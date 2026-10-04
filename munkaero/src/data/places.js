// Települések közelítő koordinátákkal (WGS84). A légvonalbeli távolság
// számításához elég; éles rendszerben a Farmatlasz településtörzse váltja ki.
const RAW = [
  ['Baja', 46.1803, 18.9549], ['Békéscsaba', 46.6736, 21.0877], ['Budapest', 47.4979, 19.0402],
  ['Cegléd', 47.1726, 19.7995], ['Debrecen', 47.5316, 21.6273], ['Eger', 47.9025, 20.3772],
  ['Gyöngyös', 47.7826, 19.9280], ['Győr', 47.6875, 17.6504], ['Gyula', 46.6464, 21.2817],
  ['Hajdúböszörmény', 47.6667, 21.5167], ['Hódmezővásárhely', 46.4181, 20.3300], ['Kalocsa', 46.5287, 18.9858],
  ['Kaposvár', 46.3594, 17.7968], ['Karcag', 47.3117, 20.9244], ['Kecskemét', 46.8964, 19.6897],
  ['Keszthely', 46.7681, 17.2432], ['Kiskőrös', 46.6214, 19.2856], ['Kiskunfélegyháza', 46.7117, 19.8478],
  ['Kisvárda', 48.2167, 22.0833], ['Makó', 46.2147, 20.4810], ['Mátészalka', 47.9553, 22.3236],
  ['Mezőtúr', 47.0040, 20.6330], ['Miskolc', 48.1035, 20.7784], ['Mohács', 45.9931, 18.6831],
  ['Mórahalom', 46.2167, 19.8833], ['Nagykőrös', 47.0333, 19.7833], ['Nyíregyháza', 47.9554, 21.7167],
  ['Paks', 46.6229, 18.8558], ['Pécs', 46.0727, 18.2323], ['Siófok', 46.9041, 18.0580],
  ['Sopron', 47.6817, 16.5845], ['Szeged', 46.2530, 20.1414], ['Székesfehérvár', 47.1860, 18.4221],
  ['Szekszárd', 46.3474, 18.7062], ['Szentes', 46.6544, 20.2572], ['Szolnok', 47.1621, 20.1825],
  ['Szombathely', 47.2307, 16.6218], ['Tata', 47.6526, 18.3184], ['Tokaj', 48.1167, 21.4078],
  ['Veszprém', 47.0933, 17.9115], ['Villány', 45.8689, 18.4536], ['Zalaegerszeg', 46.8417, 16.8416],
];

export const PLACES = RAW.map(([name, lat, lon]) => ({
  id: name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(),
  name,
  lat,
  lon,
}));
