import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createMatcher } from '../src/match.js';
import { JOB_NODES } from '../src/data/jobTree.js';
import { PLACES } from '../src/data/places.js';
import { ATTRIBUTES } from '../src/data/catalog.js';

const m = createMatcher({ jobNodes: JOB_NODES, places: PLACES, attributes: ATTRIBUTES, currentYear: 2026 });

const offer = (o = {}) => ({
  id: 'o', role: 'kinalo', jobs: ['almaszedes'], wage: { min: 2000, max: 2500 },
  place: 'kecskemet', radiusKm: 50, period: null, schedules: [], provides: [], requires: [], ...o,
});
const seek = (o = {}) => ({
  id: 's', role: 'kereso', jobs: ['almaszedes'], wage: { min: 2300, max: 3000 },
  place: 'nagykoros', radiusKm: 30, period: null, schedules: [], provides: [], requires: [], birthYear: 1990, experienceYears: 2, ...o,
});

test('alapeset: átfedő bérsáv, közeli hely, azonos munka -> találat', () => {
  assert.deepEqual(m.failures(offer(), seek()), []);
});

test('munkafa: egy csoport bejelölése lefedi az alatta lévő feladatokat', () => {
  assert.ok(m.isMatch(offer({ jobs: ['gyumolcsszedes'] }), seek()));
  assert.ok(m.isMatch(offer(), seek({ jobs: ['novenytermesztes'] })));
  assert.deepEqual(m.failures(offer({ jobs: ['szuret'] }), seek()), ['munka']);
});

test('bér: csak a sávok metszete számít', () => {
  assert.deepEqual(m.failures(offer({ wage: { min: 1800, max: 2200 } }), seek()), ['ber']);
  assert.ok(m.isMatch(offer({ wage: { min: 1800, max: 2300 } }), seek()));
});

test('hely: mindkét fél körzetének teljesülnie kell', () => {
  // Kecskemét–Szeged ~ 80 km
  assert.deepEqual(m.failures(offer({ radiusKm: 200 }), seek({ place: 'szeged' })), ['partner:hely']);
  assert.deepEqual(m.failures(offer({ radiusKm: 20 }), seek({ place: 'szeged', radiusKm: 200 })), ['hely']);
});

test('feltételek: elvárás csak akkor teljesül, ha a másik kínálja', () => {
  assert.deepEqual(m.failures(seek({ requires: ['szallas'] }), offer()), ['felt:szallas']);
  assert.ok(m.isMatch(seek({ requires: ['szallas'] }), offer({ provides: ['szallas'] })));
  assert.deepEqual(m.failures(seek(), offer({ requires: ['jogsi_t'] })), ['partner:felt:jogsi_t']);
});

test('életkor és tapasztalat a gazda elvárásaként', () => {
  assert.deepEqual(m.failures(offer({ ageMax: 30 }), seek()), ['kor']);
  assert.deepEqual(m.failures(seek(), offer({ minExperience: 5 })), ['partner:tapasztalat']);
});

test('időszak és munkarend metszete', () => {
  const a = offer({ period: { from: '2027-05-01', to: '2027-06-30' }, schedules: ['szezonalis'] });
  assert.ok(m.isMatch(a, seek({ period: { from: '2027-06-15', to: '2027-09-01' } })));
  assert.deepEqual(m.failures(a, seek({ period: { from: '2027-07-01', to: '2027-09-01' }, schedules: ['teljes'] })), ['idoszak', 'munkarend']);
});

test('lazítási javaslatok: a halmaz bővítése új találatot hoz', () => {
  const me = seek({ requires: ['szallas'], radiusKm: 10 });
  const cands = [
    offer({ id: 'a', provides: ['szallas'], radiusKm: 100 }), // Kecskemét ~ 15 km -> kör bővítés kell
    offer({ id: 'b', place: 'nagykoros' }),                   // nincs szállás
    offer({ id: 'c', place: 'nagykoros', provides: ['szallas'], jobs: ['cseresznye-meggyszedes'] }), // más gyümölcs
    offer({ id: 'd', place: 'nagykoros', provides: ['szallas'], wage: { min: 1800, max: 2100 } }),  // alacsony bér
  ];
  const { base, suggestions } = m.suggestions(me, cands);
  assert.equal(base, 0);
  const byGroup = Object.fromEntries(suggestions.map((s) => [s.group, s]));
  assert.equal(byGroup.hely.gain, 1);
  assert.equal(byGroup.feltetel.gain, 1);
  assert.equal(byGroup.munka.gain, 1);
  assert.equal(byGroup.munka.patch.jobs[0], 'gyumolcsszedes');
  assert.equal(byGroup.ber.gain, 1);
  // Az alkalmazott javaslat valóban növeli a találatok számát
  assert.equal(m.countMatches({ ...me, ...byGroup.hely.patch }, cands), 1);
});

test('fa-számláló: az ellentétes szerepű hirdetéseket ősökre és leszármazottakra is összesíti', () => {
  const counts = m.treeCounts('kereso', [offer({ jobs: ['gyumolcsszedes'] }), seek()]);
  assert.equal(counts.novenytermesztes, 1);
  assert.equal(counts.almaszedes, 1);
  assert.equal(counts.szuret, undefined);
});

test('kombinált lazítás: ha két feltétel együtt bukik el, a páros javaslat megjelenik', () => {
  const me = seek({ requires: ['szallas', 'bejelentett'] });
  const cands = [offer({ provides: [] })];
  const { base, suggestions } = m.suggestions(me, cands);
  assert.equal(base, 0);
  assert.ok(!suggestions.some((s) => s.steps !== 2), 'egyedül egyik elengedés sem segít');
  const combo = suggestions.find((s) => s.group === 'kombinalt');
  assert.ok(combo);
  assert.deepEqual(combo.patch.requires, []);
  assert.equal(m.countMatches({ ...me, ...combo.patch }, cands), 1);
});
