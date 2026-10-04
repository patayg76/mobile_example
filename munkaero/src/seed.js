// Bemutató adatok: néhány tucat gazda- és munkavállalói hirdetés, hogy a
// találatszámok és lazítási javaslatok már az első indításkor beszédesek legyenek.
import { JOB_NODES } from './data/jobTree.js';
import { PLACES } from './data/places.js';
import { ATTRIBUTES, SCHEDULES } from './data/catalog.js';
import { newId } from './ids.js';
import { REGISTERED_FARMS } from './data/farms.js';

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = ['Anna', 'Béla', 'Csaba', 'Dóra', 'Erika', 'Ferenc', 'Gábor', 'Hajnalka', 'István', 'Judit', 'Károly', 'László', 'Mária', 'Norbert', 'Orsolya', 'Péter', 'Réka', 'Sándor', 'Tamás', 'Zoltán'];
const LAST = ['Kovács', 'Szabó', 'Tóth', 'Varga', 'Kiss', 'Molnár', 'Nagy', 'Farkas', 'Balogh', 'Papp', 'Takács', 'Juhász', 'Lakatos', 'Mészáros', 'Oláh'];

// hashPassword: a futtatókörnyezet jelszó-hash függvénye (Node: scrypt).
export function seed(store, { hashPassword, year = new Date().getFullYear() }) {
  const r = rng(20261004);
  const pick = (arr) => arr[Math.floor(r() * arr.length)];
  const some = (arr, p) => arr.filter(() => r() < p);
  const between = (a, b, step = 50) => Math.round((a + r() * (b - a)) / step) * step;

  const deepNodes = JOB_NODES.filter((n) => n.level >= 2);
  const feltetel = ATTRIBUTES.filter((a) => a.kind === 'feltetel').map((a) => a.id);
  const kepesseg = ATTRIBUTES.filter((a) => a.kind === 'kepesseg').map((a) => a.id);
  const nodeName = (id) => JOB_NODES.find((n) => n.id === id).name;
  const placeName = (id) => PLACES.find((p) => p.id === id).name;
  const now = new Date().toISOString();

  // farm: gazdaság adatai (gazdaság-fióknál), különben magánszemély.
  const mkUser = (name, email, password, farm = null) => {
    const u = { id: newId('u'), name, email, accountType: farm ? 'gazdasag' : 'maganszemely', farm, phone: `+36 30 ${between(100, 999, 1)} ${between(1000, 9999, 1)}`, passwordHash: password ? hashPassword(password) : null, createdAt: now };
    store.db.users.push(u);
    return u;
  };
  const period = () => {
    if (r() < 0.4) return null;
    const m = 3 + Math.floor(r() * 6);
    const len = 1 + Math.floor(r() * 4);
    const pad = (x) => String(x).padStart(2, '0');
    return { from: `${year + 1}-${pad(m)}-01`, to: `${year + 1}-${pad(Math.min(12, m + len))}-28` };
  };

  // Gazdák
  for (let i = 0; i < 28; i++) {
    const owner = `${pick(LAST)} ${pick(FIRST)}`;
    const farmName = pick([`${owner.split(' ')[0]} Családi Gazdaság`, `${owner.split(' ')[0]} és Társa Kft.`, `${owner} őstermelő`]);
    const u = mkUser(owner, `gazda${i}@pelda.hu`, null, { id: `fa-gen-${i}`, name: farmName, taxNumber: `9${String(1000000 + i).slice(1)}0-2-11`, place: null });
    const jobs = [...new Set([pick(deepNodes).id, ...(r() < 0.3 ? [pick(deepNodes).id] : [])])];
    const place = pick(PLACES).id;
    const min = between(1900, 2600);
    store.db.profiles.push({
      id: newId('p'), userId: u.id, role: 'kinalo', active: true, createdAt: now,
      title: `${nodeName(jobs[0])} – ${placeName(place)}`,
      jobs, place, radiusKm: pick([20, 30, 50, 80, 150]),
      wage: { min, max: min + between(200, 1200) },
      period: period(), schedules: some(SCHEDULES.map((s) => s.id), 0.45),
      provides: some(feltetel, 0.4), requires: some(kepesseg, 0.15),
      ageMin: r() < 0.25 ? 18 : null, ageMax: r() < 0.2 ? pick([45, 55, 60]) : null,
      minExperience: r() < 0.3 ? pick([1, 2, 3]) : 0,
      headcount: pick([1, 1, 2, 3, 5, 10]), note: '',
    });
  }

  // Munkavállalók
  for (let i = 0; i < 40; i++) {
    const name = `${pick(LAST)} ${pick(FIRST)}`;
    const u = mkUser(name, `munkas${i}@pelda.hu`);
    const jobs = [...new Set([pick(deepNodes).id, ...(r() < 0.5 ? [pick(deepNodes).id] : [])])];
    const min = between(1800, 2900);
    store.db.profiles.push({
      id: newId('p'), userId: u.id, role: 'kereso', active: true, createdAt: now,
      title: `${name.split(' ')[1]}: ${nodeName(jobs[0])}`,
      jobs, place: pick(PLACES).id, radiusKm: pick([10, 20, 30, 50, 100]),
      wage: { min, max: min + between(300, 1500) },
      period: period(), schedules: some(SCHEDULES.map((s) => s.id), 0.5),
      provides: some(kepesseg, 0.35), requires: some(feltetel, 0.2),
      birthYear: year - between(18, 64, 1), experienceYears: Math.floor(r() * 12),
      note: '',
    });
  }

  // A bemutató fiókok környékén néhány kézzel összeállított hirdetés: egy pontos
  // találat és néhány "majdnem" találat, amelyekhez egy-egy lazítás kell.
  const near = [
    ['Horváth Gyümölcsös', { role: 'kinalo', title: 'Almaszedés – Kecskemét', jobs: ['gyumolcsszedes'], place: 'kecskemet', radiusKm: 40, wage: { min: 2400, max: 3000 }, schedules: ['szezonalis'], provides: ['szallas', 'bejelentett', 'munkaruha'], requires: [], minExperience: 0, headcount: 8 }],
    ['Kun Barackos Kft.', { role: 'kinalo', title: 'Barackszedés – Kiskunfélegyháza', jobs: ['kajszi-oszibarackszedes'], place: 'kiskunfelegyhaza', radiusKm: 40, wage: { min: 2300, max: 2900 }, schedules: ['szezonalis', 'alkalmi'], provides: ['bejelentett', 'heti_fizetes'], requires: [], minExperience: 0, headcount: 4 }],
    ['Kőrösi Almás', { role: 'kinalo', title: 'Almaszedők kellenek – Nagykőrös', jobs: ['almaszedes'], place: 'nagykoros', radiusKm: 50, wage: { min: 2000, max: 2400 }, schedules: [], provides: ['szallas', 'bejelentett', 'etkezes'], requires: [], minExperience: 0, headcount: 10 }],
    ['Fekete Ildikó', { role: 'kereso', title: 'Ildikó: cseresznyeszedés, saját autóval', jobs: ['gyumolcsszedes'], place: 'cegled', radiusKm: 30, wage: { min: 1900, max: 2600 }, schedules: ['szezonalis'], provides: ['sajat_auto', 'jogsi_b'], requires: [], birthYear: year - 41, experienceYears: 2 }],
    ['Bodnár Attila', { role: 'kereso', title: 'Attila: gyümölcsszedés Kecskemét környékén', jobs: ['cseresznye-meggyszedes', 'almaszedes'], place: 'kecskemet', radiusKm: 30, wage: { min: 2100, max: 2600 }, schedules: [], provides: ['nehez_fizikai'], requires: [], birthYear: year - 27, experienceYears: 1 }],
    ['Lengyel Kata', { role: 'kereso', title: 'Kata: szezonális kerti munka', jobs: ['gyumolcstermesztes'], place: 'nagykoros', radiusKm: 20, wage: { min: 2600, max: 3200 }, schedules: ['szezonalis', 'alkalmi'], provides: ['sajat_auto'], requires: [], birthYear: year - 35, experienceYears: 4 }],
  ];
  for (const [name, p] of near) {
    const email = `${p.title.split(':')[0].toLowerCase().replace(/\W+/g, '')}${store.db.users.length}@pelda.hu`;
    const farm = p.role === 'kinalo' ? { id: `fa-near-${store.db.users.length}`, name, taxNumber: '', place: p.place } : null;
    const u = mkUser(farm ? `${pick(LAST)} ${pick(FIRST)}` : name, email, null, farm);
    store.db.profiles.push({ id: newId('p'), userId: u.id, active: true, createdAt: now, period: null, note: '', ...p });
  }

  // Belépésre használható bemutató fiókok
  const gazda = mkUser('Demo Gazda', 'gazda@demo.hu', 'demo1234', { ...REGISTERED_FARMS.find((f) => f.id === 'fa-demo') });
  store.db.profiles.push({
    id: newId('p'), userId: gazda.id, role: 'kinalo', active: true, createdAt: now,
    title: 'Cseresznyeszedés – Nagykőrös', jobs: ['cseresznye-meggyszedes'], place: 'nagykoros', radiusKm: 30,
    wage: { min: 2000, max: 2400 }, period: { from: `${year + 1}-05-20`, to: `${year + 1}-07-15` },
    schedules: ['szezonalis', 'alkalmi'], provides: ['heti_fizetes', 'efo'], requires: ['sajat_auto'],
    ageMin: 18, ageMax: 55, minExperience: 1, headcount: 6, note: 'Reggel 6-tól, kora délutánig.',
  });
  // Egy bejövő megkeresés a demo gazdának, hogy az elfogadás azonnal kipróbálható legyen.
  const ildiko = store.db.profiles.find((p) => p.title.startsWith('Ildikó:'));
  const gazdaProfile = store.db.profiles[store.db.profiles.length - 1];
  store.db.inquiries.push({
    id: newId('q'), fromUserId: ildiko.userId, toUserId: gazda.id, fromProfileId: ildiko.id, toProfileId: gazdaProfile.id,
    message: 'Jó napot! Tavaly is szedtem cseresznyét Cegléden, saját autóval járok. Május végétől ráérek.',
    status: 'uj', reply: '', createdAt: now,
  });

  const munkas = mkUser('Demo Munkás', 'munkas@demo.hu', 'demo1234');
  store.db.profiles.push({
    id: newId('p'), userId: munkas.id, role: 'kereso', active: true, createdAt: now,
    title: 'Gyümölcsszedést keresek Kecskemét környékén', jobs: ['almaszedes', 'kajszi-oszibarackszedes'], place: 'kecskemet', radiusKm: 25,
    wage: { min: 2600, max: 3200 }, period: null, schedules: ['szezonalis'],
    provides: ['jogsi_b', 'nehez_fizikai'], requires: ['szallas', 'bejelentett'],
    birthYear: year - 34, experienceYears: 3, note: '',
  });

  store.save();
}
