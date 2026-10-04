// Egyszerű JSON-fájl alapú tároló. Prototípushoz elég; élesben adatbázis váltja.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const EMPTY = () => ({ users: [], sessions: {}, profiles: [], inquiries: [] });

export function openStore(file) {
  let db = EMPTY();
  if (file && fs.existsSync(file)) db = { ...EMPTY(), ...JSON.parse(fs.readFileSync(file, 'utf8')) };

  function save() {
    if (!file) return;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const tmp = `${file}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(db, null, 1));
    fs.renameSync(tmp, file);
  }

  return { db, save, isEmpty: () => db.users.length === 0 };
}

export { newId } from './ids.js';

export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 32).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = String(stored).split(':');
  if (!salt || !hash) return false;
  const check = crypto.scryptSync(password, salt, 32);
  return crypto.timingSafeEqual(check, Buffer.from(hash, 'hex'));
}
