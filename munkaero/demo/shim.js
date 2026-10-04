// Böngészős demó: a /api/... kéréseket a böngészőben futó API szolgálja ki,
// az adatok csak a látogató böngészőjében (localStorage) tárolódnak.
import { createApi } from '../src/api.js';
import { seed } from '../src/seed.js';

const KEY = 'munkaero_demo_db_v1';
let saved = null;
try {
  saved = JSON.parse(localStorage.getItem(KEY));
} catch { /* nincs tárolás: minden betöltéskor friss demó */ }

const db = saved || { users: [], sessions: {}, profiles: [], inquiries: [] };
const store = {
  db,
  save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(db));
    } catch { /* privát mód */ }
  },
  isEmpty: () => db.users.length === 0,
};

// Csak demó: a jelszavak a látogató saját böngészőjében maradnak, valódi hash nem kell.
const hashPassword = (pw) => `demo$${pw}`;
const verifyPassword = (pw, stored) => stored === `demo$${pw}`;

if (store.isEmpty()) seed(store, { hashPassword });
const { dispatch } = createApi({ store, hashPassword, verifyPassword });

const realFetch = window.fetch.bind(window);
window.fetch = async (input, init = {}) => {
  const url = new URL(typeof input === 'string' ? input : input.url, location.href);
  if (!url.pathname.startsWith('/api/')) return realFetch(input, init);
  const headers = new Headers(init.headers || {});
  const r = await dispatch({
    method: (init.method || 'GET').toUpperCase(),
    pathname: url.pathname,
    query: Object.fromEntries(url.searchParams),
    body: init.body ? JSON.parse(init.body) : {},
    token: (headers.get('authorization') || '').replace(/^Bearer\s+/i, ''),
  });
  return new Response(JSON.stringify(r.data), { status: r.status, headers: { 'content-type': 'application/json' } });
};

window.resetDemo = () => {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem('munkaero_token');
  } catch { /* nincs mit törölni */ }
  location.hash = '#/';
  location.reload();
};
