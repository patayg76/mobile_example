// HTTP szerver (külső függőség nélkül): REST API + statikus frontend.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

import { JOB_NODES, LEVEL_NAMES } from './data/jobTree.js';
import { PLACES } from './data/places.js';
import { ATTRIBUTES, SCHEDULES, ROLES, PROVIDES_KIND } from './data/catalog.js';
import { createMatcher } from './match.js';
import { openStore, newId, hashPassword, verifyPassword } from './store.js';
import { seed } from './seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function createApp({ dbFile, withSeed = true } = {}) {
  const store = openStore(dbFile);
  if (withSeed && store.isEmpty()) seed(store);
  const { db } = store;

  const matcher = createMatcher({ jobNodes: JOB_NODES, places: PLACES, attributes: ATTRIBUTES });
  const nodeIds = new Set(JOB_NODES.map((n) => n.id));
  const placeIds = new Set(PLACES.map((p) => p.id));
  const attrById = new Map(ATTRIBUTES.map((a) => [a.id, a]));
  const scheduleIds = new Set(SCHEDULES.map((s) => s.id));

  // ---- segédek -----------------------------------------------------------
  const num = (v) => (v === '' || v == null || Number.isNaN(Number(v)) ? null : Number(v));
  const isDate = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);

  // A beküldött profil megtisztítása. `strict` = mentés (kötelező mezők).
  function normalizeProfile(input, { strict }) {
    const p = input || {};
    const role = p.role;
    if (!ROLES[role]) throw new HttpError(400, 'Érvénytelen szerep.');
    const providesKind = PROVIDES_KIND[role];
    const ofKind = (list, kind) => [...new Set((Array.isArray(list) ? list : []).filter((id) => attrById.get(id)?.kind === kind))];

    // Ha egy csomópont és az őse is ki van jelölve, az ős elég.
    let jobs = [...new Set((Array.isArray(p.jobs) ? p.jobs : []).filter((id) => nodeIds.has(id)))];
    jobs = jobs.filter((j) => !jobs.some((o) => o !== j && matcher.ancestors(j).has(o)));

    const wMin = num(p.wage?.min);
    const wMax = num(p.wage?.max);
    let wage = null;
    if (wMin != null || wMax != null) {
      const min = wMin ?? wMax;
      const max = wMax ?? wMin;
      if (min < 0 || max < 0) throw new HttpError(400, 'A bér nem lehet negatív.');
      if (min > max) throw new HttpError(400, 'A bérsáv alsó határa nagyobb a felsőnél.');
      wage = { min, max };
    }

    const radiusKm = num(p.radiusKm);
    const place = placeIds.has(p.place) ? p.place : null;
    let period = null;
    if (p.period && (isDate(p.period.from) || isDate(p.period.to))) {
      period = { from: isDate(p.period.from) ? p.period.from : null, to: isDate(p.period.to) ? p.period.to : null };
      if (period.from && period.to && period.from > period.to) throw new HttpError(400, 'Az időszak vége a kezdete előtt van.');
    }

    const out = {
      role,
      title: String(p.title || '').slice(0, 120).trim(),
      jobs,
      wage,
      place,
      radiusKm: radiusKm == null ? null : Math.max(0, Math.min(500, radiusKm)),
      period,
      schedules: [...new Set((Array.isArray(p.schedules) ? p.schedules : []).filter((s) => scheduleIds.has(s)))],
      provides: ofKind(p.provides, providesKind),
      requires: ofKind(p.requires, providesKind === 'feltetel' ? 'kepesseg' : 'feltetel'),
      note: String(p.note || '').slice(0, 1000),
      active: p.active !== false,
    };
    if (role === 'kinalo') {
      out.ageMin = num(p.ageMin);
      out.ageMax = num(p.ageMax);
      out.minExperience = num(p.minExperience) || 0;
      out.headcount = Math.max(1, num(p.headcount) || 1);
    } else {
      out.birthYear = num(p.birthYear);
      out.experienceYears = num(p.experienceYears) || 0;
    }

    if (strict) {
      if (!out.title) throw new HttpError(400, 'Adj címet a hirdetésnek.');
      if (!out.jobs.length) throw new HttpError(400, 'Jelölj be legalább egy munkát a fán.');
      if (!out.wage) throw new HttpError(400, 'Add meg a bérsávot (tól–ig).');
      if (!out.place) throw new HttpError(400, 'Válaszd ki a települést.');
      if (out.radiusKm == null) throw new HttpError(400, 'Add meg a körzetet (km).');
    }
    return out;
  }

  const userOf = (id) => db.users.find((u) => u.id === id);
  const placeName = (id) => PLACES.find((p) => p.id === id)?.name;

  // Más profiljának nyilvános nézete: a bér, az életkor és a gazda
  // életkor-elvárása SOHA nem kerül ki.
  function publicProfile(p, viewer) {
    const d = viewer ? matcher.distanceBetween(viewer, p) : null;
    const owner = userOf(p.userId);
    return {
      id: p.id,
      role: p.role,
      title: p.title,
      ownerName: owner ? owner.name.split(' ').slice(0, 2).join(' ') : '',
      jobs: p.jobs,
      place: p.place,
      placeName: placeName(p.place),
      distanceKm: d == null ? null : Math.round(d),
      period: p.period,
      schedules: p.schedules,
      provides: p.provides,
      requires: p.requires,
      headcount: p.headcount,
      experienceYears: p.role === 'kereso' ? p.experienceYears : undefined,
      minExperience: p.role === 'kinalo' ? p.minExperience : undefined,
      note: p.note,
    };
  }

  // Jelöltek: aktív, ellentétes szerepű, nem a saját felhasználóé.
  const candidatesFor = (userId) => db.profiles.filter((p) => p.active && p.userId !== userId);

  function ownProfile(user, id) {
    const p = db.profiles.find((x) => x.id === id);
    if (!p || p.userId !== user.id) throw new HttpError(404, 'Nincs ilyen hirdetésed.');
    return p;
  }

  function publicUser(u) {
    return { id: u.id, name: u.name, email: u.email, phone: u.phone };
  }

  function createSession(user) {
    const token = crypto.randomBytes(24).toString('hex');
    db.sessions[token] = { userId: user.id, createdAt: new Date().toISOString() };
    store.save();
    return { token, user: publicUser(user) };
  }

  // Megkeresés nézete: elfogadás után mindkét fél látja a másik elérhetőségét.
  function inquiryView(q, user) {
    const outgoing = q.fromUserId === user.id;
    const otherId = outgoing ? q.toUserId : q.fromUserId;
    const other = userOf(otherId);
    const from = db.profiles.find((p) => p.id === q.fromProfileId);
    const to = db.profiles.find((p) => p.id === q.toProfileId);
    return {
      id: q.id,
      direction: outgoing ? 'kimeno' : 'bejovo',
      status: q.status,
      message: q.message,
      reply: q.reply,
      createdAt: q.createdAt,
      respondedAt: q.respondedAt,
      myProfile: outgoing ? from && { id: from.id, title: from.title } : to && { id: to.id, title: to.title },
      otherProfile: outgoing ? to && publicProfile(to, from) : from && publicProfile(from, to),
      otherName: other?.name,
      contact: q.status === 'elfogadva' && other ? { email: other.email, phone: other.phone } : null,
    };
  }

  // ---- útvonalak ---------------------------------------------------------
  const routes = [];
  const route = (method, pattern, handler, { auth = true } = {}) => {
    const keys = [];
    const re = new RegExp(`^${pattern.replace(/:(\w+)/g, (_, k) => (keys.push(k), '([^/]+)'))}$`);
    routes.push({ method, re, keys, handler, auth });
  };

  route('GET', '/api/meta', () => ({ jobNodes: JOB_NODES, levelNames: LEVEL_NAMES, places: PLACES, attributes: ATTRIBUTES, schedules: SCHEDULES, roles: ROLES, providesKind: PROVIDES_KIND }), { auth: false });

  route('POST', '/api/register', ({ body }) => {
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) throw new HttpError(400, 'Név és érvényes e-mail cím szükséges.');
    if (password.length < 6) throw new HttpError(400, 'A jelszó legalább 6 karakter legyen.');
    if (db.users.some((u) => u.email === email)) throw new HttpError(409, 'Ezzel az e-mail címmel már van fiók.');
    const user = { id: newId('u'), name, email, phone: String(body.phone || '').trim(), passwordHash: hashPassword(password), createdAt: new Date().toISOString() };
    db.users.push(user);
    return createSession(user);
  }, { auth: false });

  route('POST', '/api/login', ({ body }) => {
    const email = String(body.email || '').trim().toLowerCase();
    const user = db.users.find((u) => u.email === email);
    if (!user || !user.passwordHash || !verifyPassword(String(body.password || ''), user.passwordHash)) throw new HttpError(401, 'Hibás e-mail cím vagy jelszó.');
    return createSession(user);
  }, { auth: false });

  route('POST', '/api/logout', ({ token }) => {
    delete db.sessions[token];
    store.save();
    return { ok: true };
  });

  route('GET', '/api/me', ({ user }) => publicUser(user));

  // Élő előnézet szerkesztés közben: találatszám + lazítási javaslatok.
  // Bejelentkezés nélkül is használható (kedvcsináló: "nézd meg, hány lehetőség van").
  route('POST', '/api/preview', ({ body, user }) => {
    const profile = normalizeProfile(body.profile, { strict: false });
    const { base, suggestions } = matcher.suggestions(profile, candidatesFor(user?.id));
    return { count: base, suggestions };
  }, { auth: 'optional' });

  route('GET', '/api/tree-counts', ({ query, user }) => {
    if (!ROLES[query.role]) throw new HttpError(400, 'Érvénytelen szerep.');
    return matcher.treeCounts(query.role, candidatesFor(user?.id));
  }, { auth: 'optional' });

  route('GET', '/api/profiles', ({ user }) => {
    const mine = db.profiles.filter((p) => p.userId === user.id);
    const cands = candidatesFor(user.id);
    return mine.map((p) => ({ ...p, matchCount: p.active ? matcher.countMatches(p, cands) : 0 }));
  });

  route('POST', '/api/profiles', ({ body, user }) => {
    const p = { id: newId('p'), userId: user.id, createdAt: new Date().toISOString(), ...normalizeProfile(body, { strict: true }) };
    db.profiles.push(p);
    store.save();
    return p;
  });

  route('GET', '/api/profiles/:id', ({ params, user }) => ownProfile(user, params.id));

  route('PUT', '/api/profiles/:id', ({ params, body, user }) => {
    const p = ownProfile(user, params.id);
    const next = normalizeProfile({ ...body, role: p.role }, { strict: true });
    for (const k of Object.keys(p)) if (!['id', 'userId', 'createdAt'].includes(k)) delete p[k];
    Object.assign(p, next, { updatedAt: new Date().toISOString() });
    store.save();
    return p;
  });

  route('DELETE', '/api/profiles/:id', ({ params, user }) => {
    const p = ownProfile(user, params.id);
    db.profiles = db.profiles.filter((x) => x !== p);
    store.save();
    return { ok: true };
  });

  route('GET', '/api/profiles/:id/matches', ({ params, user }) => {
    const p = ownProfile(user, params.id);
    const list = matcher.matches(p, candidatesFor(user.id));
    return list
      .map((c) => {
        const sent = db.inquiries.find((q) => q.fromProfileId === p.id && q.toProfileId === c.id);
        return { ...publicProfile(c, p), inquiry: sent ? { id: sent.id, status: sent.status } : null };
      })
      .sort((a, b) => (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9));
  });

  route('POST', '/api/inquiries', ({ body, user }) => {
    const from = ownProfile(user, body.fromProfileId);
    const to = db.profiles.find((p) => p.id === body.toProfileId && p.active);
    if (!to || to.userId === user.id) throw new HttpError(404, 'A megkeresett hirdetés nem található.');
    if (!matcher.isMatch(from, to)) throw new HttpError(409, 'Ez a hirdetés már nem illeszkedik a tiédhez.');
    if (db.inquiries.some((q) => q.fromProfileId === from.id && q.toProfileId === to.id)) throw new HttpError(409, 'Ennek a hirdetésnek már küldtél megkeresést.');
    const message = String(body.message || '').trim().slice(0, 2000);
    if (!message) throw new HttpError(400, 'Írj néhány sort a megkereséshez.');
    const q = { id: newId('q'), fromUserId: user.id, toUserId: to.userId, fromProfileId: from.id, toProfileId: to.id, message, status: 'uj', reply: '', createdAt: new Date().toISOString() };
    db.inquiries.push(q);
    store.save();
    return inquiryView(q, user);
  });

  route('GET', '/api/inquiries', ({ user }) =>
    db.inquiries
      .filter((q) => q.fromUserId === user.id || q.toUserId === user.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((q) => inquiryView(q, user)));

  route('POST', '/api/inquiries/:id/respond', ({ params, body, user }) => {
    const q = db.inquiries.find((x) => x.id === params.id);
    if (!q || q.toUserId !== user.id) throw new HttpError(404, 'Nincs ilyen megkeresés.');
    if (!['elfogadva', 'elutasitva'].includes(body.status)) throw new HttpError(400, 'Érvénytelen válasz.');
    q.status = body.status;
    q.reply = String(body.reply || '').trim().slice(0, 2000);
    q.respondedAt = new Date().toISOString();
    store.save();
    return inquiryView(q, user);
  });

  // ---- HTTP kezelő -------------------------------------------------------
  function readBody(req) {
    return new Promise((resolve, reject) => {
      let size = 0;
      const chunks = [];
      req.on('data', (c) => {
        size += c.length;
        if (size > 1e6) reject(new HttpError(413, 'Túl nagy kérés.'));
        else chunks.push(c);
      });
      req.on('end', () => {
        if (!chunks.length) return resolve({});
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
        } catch {
          reject(new HttpError(400, 'Hibás JSON.'));
        }
      });
      req.on('error', reject);
    });
  }

  function serveStatic(res, pathname) {
    const rel = pathname === '/' ? 'index.html' : pathname.slice(1);
    const file = path.normalize(path.join(PUBLIC_DIR, rel));
    if (!file.startsWith(PUBLIC_DIR) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      return res.end('Nem található');
    }
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  }

  async function handler(req, res) {
    const url = new URL(req.url, 'http://localhost');
    if (!url.pathname.startsWith('/api/')) return serveStatic(res, url.pathname);
    const send = (status, data) => {
      res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(data));
    };
    try {
      const r = routes.find((x) => x.method === req.method && x.re.test(url.pathname));
      if (!r) throw new HttpError(404, 'Ismeretlen végpont.');
      const m = url.pathname.match(r.re);
      const params = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
      const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
      const session = token && db.sessions[token];
      const user = session ? userOf(session.userId) : null;
      if (r.auth === true && !user) throw new HttpError(401, 'Jelentkezz be.');
      const body = ['POST', 'PUT'].includes(req.method) ? await readBody(req) : {};
      const result = await r.handler({ params, body, user, token, query: Object.fromEntries(url.searchParams) });
      send(200, result);
    } catch (e) {
      if (!(e instanceof HttpError)) console.error(e);
      send(e.status || 500, { error: e instanceof HttpError ? e.message : 'Szerverhiba.' });
    }
  }

  return { handler, store, matcher };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT) || 3000;
  const dbFile = process.env.MUNKAERO_DB || path.join(__dirname, '..', 'data', 'db.json');
  const { handler } = createApp({ dbFile });
  http.createServer(handler).listen(port, () => {
    console.log(`Munkaerő-közvetítő fut: http://localhost:${port}`);
    console.log('Bemutató fiókok: gazda@demo.hu / demo1234, munkas@demo.hu / demo1234');
  });
}
