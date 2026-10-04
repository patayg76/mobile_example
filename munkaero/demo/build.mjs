// Egyetlen, önálló HTML-fájl a böngészős demóhoz: node demo/build.mjs
// (esbuild kell hozzá: npx esbuild elérhető legyen)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist', 'farmatlasz-munkaero.html');
const js = execFileSync('npx', ['-y', 'esbuild', path.join(root, 'demo', 'entry.js'), '--bundle', '--format=esm', '--target=es2020'], { encoding: 'utf8' });
const css = fs.readFileSync(path.join(root, 'public', 'style.css'), 'utf8');
const index = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
const body = index.slice(index.indexOf('<header'), index.indexOf('<script'));

const banner = `<div class="demo-banner">Bemutató változat: az adatok csak a te böngésződben tárolódnak.
  Belépés: <b>gazda@demo.hu</b> vagy <b>munkas@demo.hu</b>, jelszó: <b>demo1234</b>.
  <button type="button" onclick="resetDemo()">Demó visszaállítása</button></div>`;
const extraCss = `.demo-banner{background:var(--amber-soft);color:var(--amber-ink);padding:8px 16px;font-size:.875rem;line-height:1.6}
.demo-banner button{font:inherit;background:none;border:1px solid currentColor;color:inherit;border-radius:8px;padding:1px 8px;margin-left:6px;cursor:pointer}`;

const html = `<title>Farmatlasz Munkaerő</title>
<style>
${css}
${extraCss}
</style>
${banner}
${body.trim()}
<script type="module">
${js.replace(/<\/script/gi, '<\\/script')}
</script>
`;
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log(`${out} (${Math.round(html.length / 1024)} kB)`);
