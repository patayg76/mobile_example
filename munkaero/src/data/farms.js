// A Farmatlaszban már regisztrált gazdaságok – a prototípusban ez a lista
// helyettesíti a Farmatlasz gazdaságtörzsét. Munkát kínálni csak olyan fiók
// tud, amely egy itt szereplő gazdasághoz kapcsolódik (adószám alapján).
// Az adatok kitaláltak, csak a bemutatót szolgálják.
export const REGISTERED_FARMS = [
  { id: 'fa-demo', name: 'Demo Gazdaság', taxNumber: '11111111-1-03', place: 'nagykoros' },
  { id: 'fa-001', name: 'Tiszamenti Zöldség Kft.', taxNumber: '12345678-2-03', place: 'szentes' },
  { id: 'fa-002', name: 'Hegyalja Szőlőbirtok', taxNumber: '23456789-2-05', place: 'tokaj' },
  { id: 'fa-003', name: 'Mezőföldi Állattartó Bt.', taxNumber: '34567890-2-07', place: 'szekesfehervar' },
  { id: 'fa-004', name: 'Nyírségi Almás Kft.', taxNumber: '45678901-2-15', place: 'nyiregyhaza' },
  { id: 'fa-005', name: 'Kovács Pál őstermelő', taxNumber: '56789012-1-13', place: 'cegled' },
];

export const normalizeTaxNumber = (s) => String(s || '').replace(/\D/g, '');
