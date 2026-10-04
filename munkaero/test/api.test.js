import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createApp } from '../src/server.js';

let server;
let base;
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'munkaero-'));

before(async () => {
  const { handler } = createApp({ dbFile: path.join(dir, 'db.json'), withSeed: false });
  server = http.createServer(handler);
  await new Promise((r) => server.listen(0, r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => {
  server.close();
  fs.rmSync(dir, { recursive: true, force: true });
});

async function call(method, url, body, token) {
  const res = await fetch(base + url, {
    method,
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, data: await res.json() };
}

const register = async (name, email) => (await call('POST', '/api/register', { name, email, password: 'titok123', phone: '+36 30 111 2222' })).data.token;

test('teljes folyamat: hirdetés, élő előnézet, találat, megkeresés, elfogadás', async () => {
  const gazda = await register('Teszt Gazda', 'g@teszt.hu');
  const munkas = await register('Teszt Munkás', 'm@teszt.hu');

  const offer = {
    role: 'kinalo', title: 'Almaszedés', jobs: ['almaszedes'], wage: { min: 2000, max: 2400 },
    place: 'kecskemet', radiusKm: 50, provides: ['szallas'], requires: [], ageMax: 60,
  };
  const o = await call('POST', '/api/profiles', offer, gazda);
  assert.equal(o.status, 200, JSON.stringify(o.data));

  // Élő előnézet bejelentkezés nélkül: szűk bérigény -> 0, javaslat a bér lazítására
  const draft = { role: 'kereso', jobs: ['gyumolcsszedes'], wage: { min: 2600, max: 3000 }, place: 'nagykoros', radiusKm: 30, birthYear: 1990 };
  const p1 = await call('POST', '/api/preview', { profile: draft });
  assert.equal(p1.data.count, 0);
  const wageSugg = p1.data.suggestions.find((s) => s.group === 'ber');
  assert.ok(wageSugg, 'bér-lazítási javaslat várható');
  const p2 = await call('POST', '/api/preview', { profile: { ...draft, ...wageSugg.patch } });
  assert.equal(p2.data.count, 1);

  const s = await call('POST', '/api/profiles', { ...draft, ...wageSugg.patch, title: 'Gyümölcsszedés' }, munkas);
  assert.equal(s.status, 200, JSON.stringify(s.data));

  // A találati listában nincs bér és születési év
  const matches = await call('GET', `/api/profiles/${s.data.id}/matches`, null, munkas);
  assert.equal(matches.data.length, 1);
  const hit = matches.data[0];
  assert.equal(hit.wage, undefined);
  assert.equal(hit.ageMax, undefined);
  assert.ok(!JSON.stringify(hit).includes('2400'));

  // Megkeresés + duplikáció tiltása
  const q = await call('POST', '/api/inquiries', { fromProfileId: s.data.id, toProfileId: hit.id, message: 'Szia, jönnék!' }, munkas);
  assert.equal(q.status, 200);
  assert.equal(q.data.contact, null);
  const dup = await call('POST', '/api/inquiries', { fromProfileId: s.data.id, toProfileId: hit.id, message: 'Még egyszer' }, munkas);
  assert.equal(dup.status, 409);

  // A gazda bejövő megkeresései: a munkás bére/születési éve nem látszik
  const inbox = await call('GET', '/api/inquiries', null, gazda);
  assert.equal(inbox.data.length, 1);
  assert.equal(inbox.data[0].direction, 'bejovo');
  assert.equal(inbox.data[0].otherProfile.birthYear, undefined);
  assert.equal(inbox.data[0].contact, null);

  // Csak a címzett válaszolhat
  const wrong = await call('POST', `/api/inquiries/${q.data.id}/respond`, { status: 'elfogadva' }, munkas);
  assert.equal(wrong.status, 404);
  const ok = await call('POST', `/api/inquiries/${q.data.id}/respond`, { status: 'elfogadva', reply: 'Várunk!' }, gazda);
  assert.equal(ok.data.contact.email, 'm@teszt.hu');

  const sent = await call('GET', '/api/inquiries', null, munkas);
  assert.equal(sent.data[0].contact.email, 'g@teszt.hu');
  assert.equal(sent.data[0].reply, 'Várunk!');
});

test('nem illeszkedő hirdetésnek nem lehet megkeresést küldeni, idegen hirdetés nem szerkeszthető', async () => {
  const a = await register('A', 'a@teszt.hu');
  const b = await register('B', 'b@teszt.hu');
  const pa = await call('POST', '/api/profiles', { role: 'kinalo', title: 'Szüret', jobs: ['szuret'], wage: { min: 2000, max: 2200 }, place: 'tokaj', radiusKm: 20 }, a);
  const pb = await call('POST', '/api/profiles', { role: 'kereso', title: 'Fejés', jobs: ['tehenfejes'], wage: { min: 2000, max: 2500 }, place: 'gyor', radiusKm: 20 }, b);
  const q = await call('POST', '/api/inquiries', { fromProfileId: pb.data.id, toProfileId: pa.data.id, message: 'hello' }, b);
  assert.equal(q.status, 409);
  const put = await call('PUT', `/api/profiles/${pa.data.id}`, { title: 'X' }, b);
  assert.equal(put.status, 404);
});

test('validáció: hibás bérsáv és hiányzó munka', async () => {
  const t = await register('V', 'v@teszt.hu');
  const r1 = await call('POST', '/api/profiles', { role: 'kereso', title: 'x', jobs: ['almaszedes'], wage: { min: 3000, max: 2000 }, place: 'baja', radiusKm: 10 }, t);
  assert.equal(r1.status, 400);
  const r2 = await call('POST', '/api/profiles', { role: 'kereso', title: 'x', jobs: [], wage: { min: 2000, max: 3000 }, place: 'baja', radiusKm: 10 }, t);
  assert.equal(r2.status, 400);
  const r3 = await call('GET', '/api/profiles');
  assert.equal(r3.status, 401);
});
