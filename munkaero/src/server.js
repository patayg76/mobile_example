// HTTP szerver (külső függőség nélkül): REST API + statikus frontend.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createApi, HttpError } from './api.js';
import { openStore, hashPassword, verifyPassword } from './store.js';
import { seed } from './seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };

export function createApp({ dbFile, withSeed = true } = {}) {
  const store = openStore(dbFile);
  if (withSeed && store.isEmpty()) seed(store, { hashPassword });
  const { dispatch, matcher } = createApi({ store, hashPassword, verifyPassword });

  function readBody(req) {
    return new Promise((resolve, reject) => {
      let size = 0;
      const chunks = [];
      req.on('data', (c) => {
        size += c.length;
        if (size > 1e6) reject(new HttpError(413, 'Túl nagy kérés.'));
        else chunks.push(c);
      });
      req.on('end', () => {
        if (!chunks.length) return resolve({});
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
        } catch {
          reject(new HttpError(400, 'Hibás JSON.'));
        }
      });
      req.on('error', reject);
    });
  }

  function serveStatic(res, pathname) {
    const rel = pathname === '/' ? 'index.html' : pathname.slice(1);
    const file = path.normalize(path.join(PUBLIC_DIR, rel));
    if (!file.startsWith(PUBLIC_DIR) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      return res.end('Nem található');
    }
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  }

  async function handler(req, res) {
    const url = new URL(req.url, 'http://localhost');
    if (!url.pathname.startsWith('/api/')) return serveStatic(res, url.pathname);
    let result;
    try {
      const body = ['POST', 'PUT'].includes(req.method) ? await readBody(req) : {};
      result = await dispatch({
        method: req.method,
        pathname: url.pathname,
        query: Object.fromEntries(url.searchParams),
        body,
        token: (req.headers.authorization || '').replace(/^Bearer\s+/i, ''),
      });
    } catch (e) {
      result = { status: e.status || 500, data: { error: e instanceof HttpError ? e.message : 'Szerverhiba.' } };
    }
    res.writeHead(result.status, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(result.data));
  }

  return { handler, store, matcher };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT) || 3000;
  const dbFile = process.env.MUNKAERO_DB || path.join(__dirname, '..', 'data', 'db.json');
  const { handler } = createApp({ dbFile });
  http.createServer(handler).listen(port, () => {
    console.log(`Munkaerő-közvetítő fut: http://localhost:${port}`);
    console.log('Bemutató fiókok: gazda@demo.hu / demo1234, munkas@demo.hu / demo1234');
  });
}
