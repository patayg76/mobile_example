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

// Gazdaságként a Farmatlasz-nyilvántartásban szereplő adószámmal lehet regisztrálni (src/data/farms.js).
const register = async (name, email, taxNumber) => {
  const r = await call('POST', '/api/register', { name, email, password: 'titok123', phone: '+36 30 111 2222', accountType: taxNumber ? 'gazdasag' : 'maganszemely', taxNumber });
  assert.equal(r.status, 200, JSON.stringify(r.data));
  return r.data.token;
};

test('teljes folyamat: hirdetés, élő előnézet, találat, megkeresés, elfogadás', async () => {
  const gazda = await register('Teszt Gazda', 'g@teszt.hu', '12345678-2-03');
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
  assert.equal(inbox.data[0].otherName, 'Teszt Munkás');
  const ok = await call('POST', `/api/inquiries/${q.data.id}/respond`, { status: 'elfogadva', reply: 'Várunk!' }, gazda);
  assert.equal(ok.data.contact.email, 'm@teszt.hu');

  const sent = await call('GET', '/api/inquiries', null, munkas);
  assert.equal(sent.data[0].contact.email, 'g@teszt.hu');
  assert.equal(sent.data[0].otherName, 'Tiszamenti Zöldség Kft.');
  assert.equal(sent.data[0].otherContactPerson, 'Teszt Gazda');
  assert.equal(sent.data[0].reply, 'Várunk!');
});

test('nem illeszkedő hirdetésnek nem lehet megkeresést küldeni, idegen hirdetés nem szerkeszthető', async () => {
  const a = await register('A', 'a@teszt.hu', '23456789-2-05');
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

test('fióktípusok: munkát csak regisztrált gazdaság kínálhat, keresni csak magánszemély tud', async () => {
  const unknown = await call('POST', '/api/register', { name: 'X', email: 'x@teszt.hu', password: 'titok123', accountType: 'gazdasag', taxNumber: '99999999-9-99' });
  assert.equal(unknown.status, 400);
  const dupFarm = await call('POST', '/api/register', { name: 'Y', email: 'y@teszt.hu', password: 'titok123', accountType: 'gazdasag', taxNumber: '12345678203' });
  assert.equal(dupFarm.status, 409, 'a Tiszamenti Zöldség Kft.-hez már tartozik fiók');
  const noType = await call('POST', '/api/register', { name: 'Z', email: 'z@teszt.hu', password: 'titok123' });
  assert.equal(noType.status, 400);

  const person = await register('Magán Mária', 'mm@teszt.hu');
  const farm = await register('Kovács Pál', 'kp@teszt.hu', '56789012-1-13');
  const base = { title: 't', jobs: ['almaszedes'], wage: { min: 2000, max: 2500 }, place: 'cegled', radiusKm: 20 };
  assert.equal((await call('POST', '/api/profiles', { ...base, role: 'kinalo' }, person)).status, 403);
  assert.equal((await call('POST', '/api/profiles', { ...base, role: 'kereso' }, farm)).status, 403);
  assert.equal((await call('POST', '/api/profiles', { ...base, role: 'kereso' }, person)).status, 200);
  const me = await call('GET', '/api/me', null, farm);
  assert.equal(me.data.accountType, 'gazdasag');
  assert.equal(me.data.farm.name, 'Kovács Pál őstermelő');
});
