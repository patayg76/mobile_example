// Halmazalapú párosító motor.
//
// Minden hirdetés (profil) egy halmazt ír le: milyen munkák, milyen bérsáv,
// milyen körzet, milyen időszak/munkarend, milyen feltételek. Két ellentétes
// szerepű profil akkor "találat", ha minden dimenzióban van közös részük.
//
// A kompromisszumkeresés: a felhasználó a saját szűk halmazából indul, és a
// motor megmutatja, melyik feltétel lazítása mennyi új találatot hozna
// (pl. "ha a teljes Gyümölcsszedés csoportot bejelölöd: +4").

import { PROVIDES_KIND } from './data/catalog.js';

const R_EARTH_KM = 6371;

export function distanceKm(a, b) {
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R_EARTH_KM * Math.asin(Math.sqrt(h));
}

const roundTo = (x, step) => Math.round(x / step) * step;

export function createMatcher({ jobNodes, places, attributes, currentYear = new Date().getFullYear() }) {
  const nodeById = new Map(jobNodes.map((n) => [n.id, n]));
  const placeById = new Map(places.map((p) => [p.id, p]));
  const attrById = new Map(attributes.map((a) => [a.id, a]));

  const ancestorsCache = new Map();
  function ancestors(id) {
    let set = ancestorsCache.get(id);
    if (!set) {
      set = new Set();
      for (let cur = nodeById.get(id); cur; cur = nodeById.get(cur.parent)) set.add(cur.id);
      ancestorsCache.set(id, set);
    }
    return set;
  }

  // Két munkahalmaz akkor fed át, ha valamelyik kijelölt csomópont a másik
  // ősének vagy leszármazottjának számít (egy csoport bejelölése = minden alatta).
  // Üres lista = "bármilyen munka".
  function jobsOverlap(a = [], b = []) {
    if (!a.length || !b.length) return true;
    return a.some((x) => b.some((y) => ancestors(y).has(x) || ancestors(x).has(y)));
  }

  function wageOverlap(offer, seek) {
    const o = offer.wage;
    const s = seek.wage;
    if (!o || !s || o.max == null || s.min == null) return true;
    // A gazda legfeljebb o.max-ot ad, a munkavállaló legalább s.min-t kér:
    // ha o.max >= s.min, a két sáv metszete nem üres -> van hely a béralkunak.
    return o.max >= s.min;
  }

  function periodOverlap(a, b) {
    if (!a?.period || !b?.period) return true;
    const af = a.period.from || '0000';
    const at = a.period.to || '9999';
    const bf = b.period.from || '0000';
    const bt = b.period.to || '9999';
    return af <= bt && bf <= at;
  }

  function schedulesOverlap(a = [], b = []) {
    if (!a.length || !b.length) return true;
    return a.some((x) => b.includes(x));
  }

  function distanceBetween(a, b) {
    const pa = placeById.get(a.place);
    const pb = placeById.get(b.place);
    if (!pa || !pb) return null;
    return distanceKm(pa, pb);
  }

  // Életkor és tapasztalat: a gazda elvárása (ageMin/ageMax/minExperience)
  // a munkavállaló adataival (birthYear/experienceYears) szemben.
  function ageOk(offer, seek) {
    if (offer.ageMin == null && offer.ageMax == null) return true;
    if (!seek.birthYear) return false;
    const age = currentYear - seek.birthYear;
    return (offer.ageMin == null || age >= offer.ageMin) && (offer.ageMax == null || age <= offer.ageMax);
  }

  function experienceOk(offer, seek) {
    if (!offer.minExperience) return true;
    return (seek.experienceYears || 0) >= offer.minExperience;
  }

  // Visszaadja, mely feltételek NEM teljesülnek a `viewer` szemszögéből.
  // A kulcsok előtagja jelzi, kinek a feltételéről van szó:
  //   - előtag nélkül / 'felt:' -> a viewer saját elvárása (ő lazíthat rajta)
  //   - 'partner:'              -> a másik fél elvárása a viewerrel szemben
  function failures(viewer, cand) {
    const out = [];
    if (viewer.role === cand.role) return ['szerep'];
    const offer = viewer.role === 'kinalo' ? viewer : cand;
    const seek = viewer.role === 'kinalo' ? cand : viewer;
    const mine = (k) => k;
    const theirs = (k) => `partner:${k}`;
    const own = (p) => (p === viewer ? mine : theirs);

    if (!jobsOverlap(viewer.jobs, cand.jobs)) out.push('munka');
    if (!wageOverlap(offer, seek)) out.push('ber');

    const d = distanceBetween(viewer, cand);
    if (d != null) {
      if (viewer.radiusKm != null && d > viewer.radiusKm) out.push('hely');
      if (cand.radiusKm != null && d > cand.radiusKm) out.push('partner:hely');
    }

    if (!periodOverlap(viewer, cand)) out.push('idoszak');
    if (!schedulesOverlap(viewer.schedules, cand.schedules)) out.push('munkarend');

    for (const r of viewer.requires || []) if (!(cand.provides || []).includes(r)) out.push(`felt:${r}`);
    for (const r of cand.requires || []) if (!(viewer.provides || []).includes(r)) out.push(`partner:felt:${r}`);

    if (!ageOk(offer, seek)) out.push(own(offer)('kor'));
    if (!experienceOk(offer, seek)) out.push(own(offer)('tapasztalat'));
    return out;
  }

  function isMatch(viewer, cand) {
    return failures(viewer, cand).length === 0;
  }

  function matches(viewer, candidates) {
    return candidates.filter((c) => c.role !== viewer.role && isMatch(viewer, c));
  }

  function countMatches(viewer, candidates) {
    let n = 0;
    for (const c of candidates) if (c.role !== viewer.role && isMatch(viewer, c)) n++;
    return n;
  }

  // "Mi lenne, ha..." változatok: mindegyik egy patch, amit a profilra
  // alkalmazva a halmaz nő. A javaslat akkor jelenik meg, ha új találatot hoz.
  function relaxations(viewer, candidates) {
    const variants = [];
    const add = (label, group, patch) => variants.push({ label, group, patch });

    // 1) Munka: egy kijelölt csomópont helyett a szülője (egy szinttel tágabb kör).
    for (const id of viewer.jobs || []) {
      const node = nodeById.get(id);
      const parent = node && nodeById.get(node.parent);
      if (!parent) continue;
      const jobs = [...new Set((viewer.jobs || []).filter((j) => j !== id && !ancestors(j).has(parent.id)).concat(parent.id))];
      add(`„${node.name}” helyett a teljes „${parent.name}” kör`, 'munka', { jobs });
    }

    // 2) Bér: lépcsőkben (nem pontos küszöbként, hogy ne szivárogjon ki mások bére).
    if (viewer.wage?.min != null && viewer.wage?.max != null) {
      const steps = [0.1, 0.2, 0.3];
      for (const s of steps) {
        if (viewer.role === 'kinalo') {
          const max = roundTo(viewer.wage.max * (1 + s), 50);
          add(`Bérplafon emelése ${Math.round(s * 100)}%-kal (${max} Ft/óra)`, 'ber', {
            wage: { min: viewer.wage.min, max },
          });
        } else {
          const min = roundTo(viewer.wage.min * (1 - s), 50);
          add(`Bérigény alsó határa ${Math.round(s * 100)}%-kal lejjebb (${min} Ft/óra)`, 'ber', {
            wage: { min, max: Math.max(min, viewer.wage.max) },
          });
        }
      }
    }

    // 3) Körzet bővítése.
    if (viewer.radiusKm != null) {
      for (const extra of [10, 25, 50, 100]) {
        const r = viewer.radiusKm + extra;
        if (r > 400) continue;
        add(`Körzet bővítése ${r} km-re`, 'hely', { radiusKm: r });
      }
    }

    // 4) Időszak és munkarend.
    if (viewer.period) add('Az időszak nem kötött', 'idoszak', { period: null });
    if (viewer.schedules?.length) add('Bármilyen munkarend jó', 'munkarend', { schedules: [] });

    // 5) Saját elvárások elengedése, egyenként.
    for (const r of viewer.requires || []) {
      const a = attrById.get(r);
      add(`Nem várom el: ${a ? a.name : r}`, 'feltetel', { requires: viewer.requires.filter((x) => x !== r) });
    }
    if (viewer.role === 'kinalo') {
      if (viewer.ageMin != null || viewer.ageMax != null) add('Az életkor nem számít', 'feltetel', { ageMin: null, ageMax: null });
      if (viewer.minExperience) add('A tapasztalat nem feltétel', 'feltetel', { minExperience: 0 });
    }

    // 6) Saját kínálat bővítése: amit a partnerek elvárnak, de nálam hiányzik.
    const kind = PROVIDES_KIND[viewer.role];
    const missing = new Set();
    for (const c of candidates) {
      if (c.role === viewer.role) continue;
      for (const r of c.requires || []) {
        if (!(viewer.provides || []).includes(r) && attrById.get(r)?.kind === kind) missing.add(r);
      }
    }
    for (const r of missing) {
      const a = attrById.get(r);
      const verb = viewer.role === 'kinalo' ? 'Ha biztosítanád' : 'Ha rendelkeznél ezzel';
      add(`${verb}: ${a.name}`, 'kinalat', { provides: [...(viewer.provides || []), r] });
    }

    return variants;
  }

  // Két lazítás összevonása. Az elvárás-listák elengedése (metszet) és a
  // kínálat bővítése (unió) kombinálható; más azonos mező (pl. két bérlépcső) nem.
  function mergePatches(a, b) {
    const out = { ...a };
    for (const [k, v] of Object.entries(b)) {
      if (!(k in a)) out[k] = v;
      else if (k === 'requires') out[k] = a[k].filter((x) => v.includes(x));
      else if (k === 'provides') out[k] = [...new Set([...a[k], ...v])];
      else return null;
    }
    return out;
  }

  function suggestions(viewer, candidates, { limit = 12 } = {}) {
    const base = countMatches(viewer, candidates);
    const out = [];
    const variants = relaxations(viewer, candidates);
    const gains = variants.map((v) => countMatches({ ...viewer, ...v.patch }, candidates) - base);
    variants.forEach((v, i) => {
      if (gains[i] > 0) out.push({ ...v, gain: gains[i] });
    });

    // Kétlépéses lazítások: ha egy partnernél egyszerre két feltétel bukik el,
    // egyik lazítás sem hoz egyedül semmit – a kettő együtt viszont igen.
    // Csak akkor jelenítjük meg, ha többet ad, mint bármelyik fele önmagában.
    const pairs = [];
    const pairSeen = new Set();
    const stepKey = (v) => (v.group === 'ber' || v.group === 'hely' ? v.group : v.label);
    for (let i = 0; i < variants.length; i++) {
      for (let j = i + 1; j < variants.length; j++) {
        const a = variants[i];
        const b = variants[j];
        const patch = mergePatches(a.patch, b.patch);
        if (!patch) continue;
        const gain = countMatches({ ...viewer, ...patch }, candidates) - base;
        // A lépcsős csoportoknál (bér, körzet) csak a legkisebb, már segítő lépést tartjuk meg.
        const key = `${stepKey(a)}|${stepKey(b)}`;
        if (gain > Math.max(gains[i], gains[j], 0) && !pairSeen.has(key)) {
          pairSeen.add(key);
          pairs.push({ label: `${a.label} + ${b.label.charAt(0).toLowerCase()}${b.label.slice(1)}`, group: 'kombinalt', patch, gain, steps: 2 });
        }
      }
    }
    pairs.sort((a, b) => b.gain - a.gain);
    out.push(...pairs.slice(0, 4));
    // Csoportonként csak a legkisebb lépést mutatjuk, ami már hoz valamit
    // (a bér és körzet lépcsőinél), a többit nagyság szerint.
    const seen = new Set();
    const filtered = out.filter((s) => {
      if (s.group !== 'ber' && s.group !== 'hely') return true;
      if (seen.has(s.group)) return false;
      seen.add(s.group);
      return true;
    });
    // Előbb az egylépéses javaslatok (kisebb kompromisszum), azon belül nyereség szerint.
    filtered.sort((a, b) => (a.steps || 1) - (b.steps || 1) || b.gain - a.gain);
    return { base, suggestions: filtered.slice(0, limit) };
  }

  // Hány ellentétes szerepű profil érinti a fa egyes csomópontjait
  // (a fa böngészésekor jelenik meg a csomópontok mellett).
  function treeCounts(role, candidates) {
    const counts = {};
    const childrenOf = new Map();
    for (const n of jobNodes) {
      if (!childrenOf.has(n.parent)) childrenOf.set(n.parent, []);
      childrenOf.get(n.parent).push(n.id);
    }
    const descendants = (id, acc) => {
      for (const c of childrenOf.get(id) || []) {
        acc.add(c);
        descendants(c, acc);
      }
      return acc;
    };
    for (const c of candidates) {
      if (c.role === role) continue;
      const touched = new Set();
      for (const j of c.jobs || []) {
        for (const a of ancestors(j)) touched.add(a);
        descendants(j, touched);
      }
      for (const id of touched) counts[id] = (counts[id] || 0) + 1;
    }
    return counts;
  }

  return {
    ancestors,
    jobsOverlap,
    wageOverlap,
    distanceBetween,
    failures,
    isMatch,
    matches,
    countMatches,
    suggestions,
    treeCounts,
  };
}
