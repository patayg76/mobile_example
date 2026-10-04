// Munkák fája – a Farmatlasz termékfájának (kategória > csoport > termék > cikk)
// mintájára: munkakategória > munkacsoport > munkakör > feladat.
// Bármelyik szint bejelölhető; egy belső csomópont bejelölése a teljes alágat jelenti
// (ez a "nagyobb halmaz").

const RAW = [
  ['Növénytermesztés', [
    ['Szántóföldi növénytermesztés', [
      ['Talajművelés és vetés', ['Szántás, tárcsázás', 'Vetés', 'Műtrágyaszórás']],
      ['Szántóföldi növényvédelem', ['Szántóföldi permetezés']],
      ['Betakarítás', ['Gabona aratás', 'Kukorica betakarítás', 'Bálázás, szalmabehordás']],
    ]],
    ['Zöldségtermesztés', [
      ['Palántanevelés és ültetés', ['Palántázás', 'Fóliasátor-építés']],
      ['Zöldségápolás', ['Kapálás, gyomlálás', 'Kézi öntözés']],
      ['Zöldségszedés', ['Paprikaszedés', 'Paradicsomszedés', 'Uborkaszedés', 'Burgonyaszedés', 'Hagymaszedés']],
    ]],
    ['Gyümölcstermesztés', [
      ['Ültetvényápolás', ['Gyümölcsfa-metszés', 'Gyümölcsritkítás', 'Gyümölcsös permetezése']],
      ['Gyümölcsszedés', ['Cseresznye-, meggyszedés', 'Kajszi-, őszibarackszedés', 'Almaszedés', 'Bogyós gyümölcs szedése', 'Dió-, mogyoróbetakarítás']],
    ]],
    ['Szőlészet és borászat', [
      ['Szőlőművelés', ['Szőlőmetszés', 'Zöldmunka (kötözés, hajtásválogatás)', 'Szőlő permetezése']],
      ['Szüret', ['Kézi szüret', 'Gépi szüret kísérése']],
      ['Pincemunka', ['Pincemunkás', 'Palackozás']],
    ]],
  ]],
  ['Állattenyésztés', [
    ['Szarvasmarha-tartás', [
      ['Tejelő tehenészet', ['Tehénfejés', 'Borjúnevelés']],
      ['Marhagondozás', ['Marha takarmányozása', 'Almozás, trágyázás']],
    ]],
    ['Sertéstartás', [
      ['Sertésgondozás', ['Sertés takarmányozása', 'Fiaztatás, malacnevelés']],
    ]],
    ['Baromfitartás', [
      ['Baromfigondozás', ['Telepi gondozás', 'Tojásgyűjtés, -válogatás', 'Ólak takarítása, fertőtlenítése']],
    ]],
    ['Juh- és kecsketartás', [
      ['Kiskérődzők', ['Pásztorkodás', 'Juhnyírás', 'Juh- és kecskefejés']],
    ]],
    ['Lótartás', [
      ['Lovászat', ['Lóápolás', 'Istállómunka']],
    ]],
    ['Méhészet', [
      ['Méhészeti munkák', ['Mézpörgetés', 'Vándoroltatás']],
    ]],
  ]],
  ['Gépek és technika', [
    ['Erőgépek kezelése', [
      ['Gépkezelés', ['Traktoros munkák', 'Kombájnos', 'Rakodógép-kezelés']],
    ]],
    ['Karbantartás és javítás', [
      ['Szerelés', ['Mezőgazdasági gépszerelő', 'Hegesztés, lakatosmunka', 'Villanyszerelés']],
    ]],
    ['Öntözés', [
      ['Öntözéstechnika', ['Öntözőrendszer telepítése', 'Öntözés felügyelete']],
    ]],
  ]],
  ['Feldolgozás és logisztika', [
    ['Válogatás és csomagolás', [
      ['Csomagolóüzem', ['Zöldség-gyümölcs válogatás', 'Csomagolás, címkézés']],
    ]],
    ['Raktározás', [
      ['Raktári munka', ['Targoncás', 'Raktári segédmunka']],
    ]],
    ['Szállítás', [
      ['Fuvarozás', ['Tehergépkocsi-vezető', 'Kisteherautó-sofőr']],
    ]],
    ['Élelmiszer-feldolgozás', [
      ['Kisüzemi feldolgozás', ['Sajtkészítés', 'Húsfeldolgozás', 'Lekvár-, szörpkészítés']],
    ]],
  ]],
  ['Erdészet és kertészet', [
    ['Erdőgazdálkodás', [
      ['Erdei munkák', ['Fakitermelés (motorfűrész)', 'Erdőtelepítés, csemeteültetés', 'Tűzifa-feldolgozás']],
    ]],
    ['Dísznövény- és parkfenntartás', [
      ['Kertészeti munkák', ['Fűnyírás, kaszálás', 'Sövény- és fametszés', 'Dísznövénytermesztés']],
    ]],
  ]],
  ['Gazdaság körüli munkák', [
    ['Építés és karbantartás', [
      ['Karbantartás', ['Kerítésépítés', 'Épület-karbantartás']],
    ]],
    ['Iroda és értékesítés', [
      ['Adminisztráció', ['Gazdasági adminisztráció', 'Pályázatírás']],
      ['Értékesítés', ['Piaci árusítás', 'Termelői bolt']],
    ]],
  ]],
];

export const LEVEL_NAMES = ['Munkakategória', 'Munkacsoport', 'Munkakör', 'Feladat'];

export function slugify(s) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Lapos lista: { id, name, parent, level }
function build() {
  const nodes = [];
  const used = new Set();
  const walk = (items, parent, level) => {
    for (const item of items) {
      const [name, children] = Array.isArray(item) ? item : [item, []];
      let id = slugify(name);
      if (used.has(id)) id = `${parent}--${id}`;
      used.add(id);
      nodes.push({ id, name, parent, level });
      walk(children, id, level + 1);
    }
  };
  walk(RAW, null, 0);
  return nodes;
}

export const JOB_NODES = build();
