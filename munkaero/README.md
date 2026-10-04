# Farmatlasz Munkaerő – prototípus

> **Mindent nem kaphatsz meg – de segítünk, hogy a lehető legtöbbet elérd.**

Munkaerő-közvetítő portál gazdák (munkát kínálók) és munkát keresők között. A rendszer
**halmazokra épül**: mindenki a saját, szűk halmazából indul („ennyit kínálok, erre a
munkára, ezekkel a feltételekkel, ebben a faluban”). Közben folyamatosan látja, hány
illeszkedő ajánlat van. A rendszer azt is megmutatja, **melyik engedmény mennyi új
lehetőséget hozna**, így a felhasználó a kisebb halmaztól halad a nagyobb felé, és ő dönti
el, mit ad fel.

> **A valódi beépítés a FarmAtlas repóban van** (`patayg76/FarmAtlas`, `claude/sweet-wozniak-ivaebn` ág,
> `Application/60_munka/TERV.md`). Ott a meglévő két fiók a belépés alapja: a gazdaság a szerkesztőlinkjével (átvett
> adatlap), a munkát kereső a vásárlói (kedvenc-) fiókjával. Ez a prototípus a felület és a párosítás mintája; a jelszavas
> regisztráció és az adószámos gazdaság-azonosítás csak itt van, a FarmAtlasban nem.

## Futtatás

```bash
cd munkaero
npm start          # http://localhost:3000  (PORT változóval állítható)
npm test           # párosító motor + API tesztek
```

Kipróbálható bemutató telepítés nélkül: https://claude.ai/artifact/4B4GgkdsjbxR2AhuKR1W49
Ez ugyanaz az alkalmazás egyetlen HTML-fájlba csomagolva (`node demo/build.mjs` → `dist/`).
Az API ilyenkor a böngészőben fut, az adatok a látogató böngészőjében tárolódnak.

Nincs külső függőség, Node.js 20+ kell hozzá. Első indításkor bemutató adatokkal töltődik
fel (`data/db.json`). A bemutató fiókok: `gazda@demo.hu` és `munkas@demo.hu`, jelszó: `demo1234`.

## Hogyan működik

0. **Két fióktípus.** **Munkát kínálni csak a Farmatlaszban már regisztrált gazdaság
   tud.** A fiókot regisztrációkor az adószám alapján kapcsoljuk a gazdasághoz; a prototípusban
   a nyilvántartást a `src/data/farms.js` helyettesíti. **Munkát keresni magánszemélyként** lehet.
   A szerepkör a fióktípushoz kötött, ezt a szerver is ellenőrzi. A másik fél a gazdaság nevét
   látja, a magánszemélynek pedig a nevét.
1. **Munkafa** – a Farmatlasz termékfájának mintájára: *munkakategória › munkacsoport ›
   munkakör › feladat* (`src/data/jobTree.js`). Bármelyik szint bejelölhető. Egy csoport
   bejelölése mindent jelent, ami alatta van, vagyis tágabb halmazt. A fa minden eleme
   mellett látszik, hány ellenoldali hirdetés érinti.
2. **Bér (Ft/óra, tól–ig)** – **senki nem látja**. Két hirdetés akkor illeszkedik, ha a
   sávjuk átfed (a gazda felső határa ≥ a munkavállaló alsó határa). A közös rész ad helyet
   a béralkunak. A találati lista csak annyit mutat, hogy „a sávok átfednek”.
3. **Hely** – település és körzet (km). Mindkét fél körzetének teljesülnie kell: a gazda
   ennyi km-ről fogad embert, a munkavállaló ennyi km-re vállal munkát.
4. **Időszak, munkarend** – az időszakoknak és a munkarendeknek kell, hogy legyen metszete.
   Az üresen hagyott mező azt jelenti: „bármi jó”.
5. **Feltételek** – két katalógus (`src/data/catalog.js`):
   - *feltétel*: a gazda kínálja, a munkavállaló elvárhatja (szállás, étkezés, bejelentett
     munkaviszony, EFO, heti kifizetés…);
   - *képesség*: a munkavállaló kínálja, a gazda elvárhatja (T-jogosítvány, növényvédős
     vizsga, saját autó…), továbbá életkor és tapasztalat.
   Az egyik fél elvárásának benne kell lennie a másik fél kínálatában.
6. **Élő találatszám és lazítási javaslatok** – szerkesztés közben (belépés nélkül is). Például:
   „+4 – „Almaszedés” helyett a teljes „Gyümölcsszedés” kör”, „+2 – Nem várom el: Szállás”,
   „+3 – Körzet bővítése 50 km-re”. Ha egyetlen engedmény sem segít, **kétlépéses
   kombinációt** is javasol. Az „Alkalmaz” gombbal azonnal beépíthető.
   A bérjavaslatok lépcsőkben szólnak (+10/20/30%), nem pontos küszöbként, hogy mások bére
   ne legyen visszafejthető.
7. **Megkeresés** – csak illeszkedő hirdetésnek küldhető. A címzett elfogadhatja vagy
   elutasíthatja. **Elfogadás után** mindkét fél látja a másik elérhetőségét (e-mail, telefon).

## Szerkezet

```
src/match.js          párosító motor (failures, matches, suggestions, treeCounts) – tiszta függvények
src/api.js            az API útvonalai, környezetfüggetlenül (Node és böngésző)
src/server.js         Node HTTP-szerver: statikus kiszolgálás + src/api.js
demo/                 böngészős demó (fetch-réteg + egyfájlos build)
src/store.js          JSON-fájl tároló, jelszó-hash (scrypt)
src/seed.js           bemutató adatok
src/data/             munkafa, feltétel-katalógus, települések
public/               egyoldalas, mobilbarát frontend (keretrendszer nélkül)
test/                 node:test tesztek
docs/                 háttérkutatás (állásportálok)
```

### API röviden

| Végpont | Leírás |
|---|---|
| `GET /api/meta` | munkafa, települések, katalógusok |
| `POST /api/preview` | élő találatszám és javaslatok egy (nem mentett) hirdetésre |
| `GET /api/tree-counts?role=` | ellenoldali hirdetések száma a fa csomópontjain |
| `GET/POST/PUT/DELETE /api/profiles…` | saját hirdetések |
| `GET /api/profiles/:id/matches` | illeszkedő hirdetések (bér és életkor nélkül) |
| `POST /api/inquiries`, `POST /api/inquiries/:id/respond`, `GET /api/inquiries` | megkeresések |

## Beépítés a Farmatlaszba

A `src/match.js` független a tárolótól és a HTTP-rétegtől. Bemenete a fa
(`{id, parent, name, level}` lista), a települések (`{id, lat, lon}`) és a katalógus, így
a Farmatlasz meglévő termékfa-, település- és felhasználótörzsére közvetlenül ráköthető.
A JSON-tároló helyére adatbázis kerül. Ha sok a hirdetés, a jelölteket előbb
munkafa-csomópont és földrajzi doboz szerint érdemes előszűrni.
