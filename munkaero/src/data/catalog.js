// Feltételek és képességek katalógusa.
//  - 'feltetel': a gazda KÍNÁLJA, a munkavállaló ELVÁRHATJA
//  - 'kepesseg': a munkavállaló KÍNÁLJA, a gazda ELVÁRHATJA
export const ATTRIBUTES = [
  { id: 'szallas', kind: 'feltetel', name: 'Szállás' },
  { id: 'etkezes', kind: 'feltetel', name: 'Étkezés' },
  { id: 'utiktg', kind: 'feltetel', name: 'Útiköltség-térítés / bejárás' },
  { id: 'bejelentett', kind: 'feltetel', name: 'Bejelentett munkaviszony' },
  { id: 'efo', kind: 'feltetel', name: 'Egyszerűsített foglalkoztatás (EFO)' },
  { id: 'heti_fizetes', kind: 'feltetel', name: 'Napi / heti kifizetés' },
  { id: 'munkaruha', kind: 'feltetel', name: 'Munkaruha, védőfelszerelés' },
  { id: 'hetvege_szabad', kind: 'feltetel', name: 'Szabad hétvége' },
  { id: 'csapat', kind: 'feltetel', name: 'Csapatot / családot is fogad' },

  { id: 'jogsi_b', kind: 'kepesseg', name: 'B kategóriás jogosítvány' },
  { id: 'jogsi_t', kind: 'kepesseg', name: 'T kategóriás (traktor) jogosítvány' },
  { id: 'jogsi_c', kind: 'kepesseg', name: 'C kategóriás jogosítvány' },
  { id: 'targonca', kind: 'kepesseg', name: 'Targoncavezetői engedély' },
  { id: 'novenyvedo', kind: 'kepesseg', name: 'Növényvédős vizsga' },
  { id: 'agrar_vegzettseg', kind: 'kepesseg', name: 'Mezőgazdasági végzettség' },
  { id: 'motorfuresz', kind: 'kepesseg', name: 'Motorfűrész-kezelői vizsga' },
  { id: 'hegeszto', kind: 'kepesseg', name: 'Hegesztő vizsga' },
  { id: 'sajat_auto', kind: 'kepesseg', name: 'Saját autóval jár' },
  { id: 'eu_kiskonyv', kind: 'kepesseg', name: 'Egészségügyi kiskönyv' },
  { id: 'nehez_fizikai', kind: 'kepesseg', name: 'Nehéz fizikai munkát vállal' },
];

export const SCHEDULES = [
  { id: 'szezonalis', name: 'Szezonális' },
  { id: 'alkalmi', name: 'Alkalmi / napszám' },
  { id: 'reszmunkaido', name: 'Részmunkaidő' },
  { id: 'teljes', name: 'Teljes munkaidő (állandó)' },
];

export const ROLES = {
  kinalo: 'Munkát kínálok (gazda)',
  kereso: 'Munkát keresek',
};

// Melyik attribútum-fajtát KÍNÁLJA az adott szerep (a másikat elvárja).
export const PROVIDES_KIND = { kinalo: 'feltetel', kereso: 'kepesseg' };
