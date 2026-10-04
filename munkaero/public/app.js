// Farmatlasz Munkaerő – egyoldalas frontend (keretrendszer nélkül).

const $app = document.getElementById('app');
const $nav = document.getElementById('nav');

const state = {
  meta: null,
  token: localStorage.getItem('munkaero_token') || null,
  user: null,
  draft: null,        // szerkesztett hirdetés
  editingId: null,    // meglévő hirdetés azonosítója szerkesztéskor
  treeAt: null,       // a fában épp megnyitott csomópont
  treeCounts: {},
  preview: { count: null, suggestions: [] },
};

// ---- segédek ---------------------------------------------------------------
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function api(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: { 'content-type': 'application/json', ...(state.token ? { authorization: `Bearer ${state.token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && state.token && url !== '/api/login') {
    setToken(null);
  }
  if (!res.ok) throw new Error(data.error || 'Hiba történt.');
  return data;
}

function setToken(token) {
  state.token = token;
  try {
    if (token) localStorage.setItem('munkaero_token', token);
    else localStorage.removeItem('munkaero_token');
  } catch { /* privát mód */ }
  if (!token) state.user = null;
}

let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 3200);
}

function debounce(fn, ms) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
}

const node = (id) => state.meta.nodeById.get(id);
const children = (id) => state.meta.childrenOf.get(id) || [];
const attr = (id) => state.meta.attrById.get(id);
const placeName = (id) => state.meta.places.find((p) => p.id === id)?.name || '';
const scheduleName = (id) => state.meta.schedules.find((s) => s.id === id)?.name || id;
const opposite = (role) => (role === 'kinalo' ? 'kereso' : 'kinalo');

function pathOf(id) {
  const out = [];
  for (let n = node(id); n; n = node(n.parent)) out.unshift(n);
  return out;
}
function isUnderSelected(id, selected) {
  return pathOf(id).some((n) => n.id !== id && selected.includes(n.id));
}
function fmtPeriod(p) {
  if (!p) return 'nem kötött';
  return `${p.from || '…'} – ${p.to || '…'}`;
}

// ---- navigáció --------------------------------------------------------------
let unread = 0;
function renderNav() {
  const h = location.hash || '#/';
  const link = (href, text) => `<a href="${href}" class="${h === href ? 'active' : ''}">${text}</a>`;
  $nav.innerHTML = state.user
    ? link('#/', 'Hirdetéseim') + link('#/uzenetek', `Megkeresések${unread ? `<span class="badge-dot">${unread}</span>` : ''}`) + `<button id="logout">Kilépés</button>`
    : link('#/', 'Kezdőlap') + link('#/belepes', 'Belépés');
  document.getElementById('logout')?.addEventListener('click', async () => {
    await api('POST', '/api/logout').catch(() => {});
    setToken(null);
    location.hash = '#/';
  });
}

async function refreshUnread() {
  if (!state.user) return (unread = 0);
  const list = await api('GET', '/api/inquiries').catch(() => []);
  unread = list.filter((q) => q.direction === 'bejovo' && q.status === 'uj').length;
}

async function router() {
  const parts = (location.hash.replace(/^#\/?/, '') || '').split('/');
  const [page, arg] = parts;
  window.scrollTo(0, 0);
  try {
    if (state.token && !state.user) state.user = await api('GET', '/api/me').catch(() => null);
    if (!['uj', 'szerkeszt', 'belepes'].includes(page)) {
      state.draft = null;
      state.editingId = null;
    }
    await refreshUnread();
    renderNav();
    if (page === 'belepes') return renderLogin();
    if (page === 'uj') return openEditor({ role: arg });
    if (page === 'szerkeszt') return openEditor({ id: arg });
    if (page === 'talalatok') return renderMatches(arg);
    if (page === 'uzenetek') return renderInbox();
    return state.user ? renderMyProfiles() : renderHome();
  } catch (e) {
    $app.innerHTML = `<p class="err">${esc(e.message)}</p>`;
  }
}

// ---- kezdőlap ---------------------------------------------------------------
function renderHome() {
  $app.innerHTML = `
    <section class="hero">
      <h1>Mindent nem kaphatsz meg – de segítünk, hogy a lehető legtöbbet elérd.</h1>
      <p>Kezdd azzal, amit ideális esetben szeretnél: milyen munka, mennyiért, hol, milyen feltételekkel.
      Közben folyamatosan látod, hány gazda vagy munkát kereső illeszkedik hozzá. Ha kevés, megmutatjuk,
      melyik engedmény mennyi új lehetőséget nyit meg – hogy te dönthesd el, mit érdemes feladnod, és mit nem.</p>
      <ol class="small muted" style="max-width:720px">
        <li><b>Jelöld be a munkát</b> a munkafán – minél tágabb csoportot jelölsz, annál több a lehetőség.</li>
        <li><b>Add meg a bérsávot.</b> Senki nem látja; csak azokat kötjük össze, akiknek a sávja átfed – így marad hely az alkunak.</li>
        <li><b>Hely, időszak, feltételek</b> – amit kínálsz, és amit elvársz.</li>
        <li><b>Engedj, ahol megéri</b>, aztán küldj megkeresést az illeszkedőknek.</li>
      </ol>
      <div class="choice">
        <a href="#/uj/kinalo"><strong>Munkát kínálok</strong><span class="muted">Gazda vagyok, munkaerőt keresek.</span></a>
        <a href="#/uj/kereso"><strong>Munkát keresek</strong><span class="muted">Dolgoznék, munkát keresek.</span></a>
      </div>
      <p class="muted small">Regisztráció nélkül is kipróbálhatod; megkeresést küldeni belépés után tudsz.</p>
    </section>`;
}

// ---- belépés / regisztráció ------------------------------------------------
function renderLogin() {
  $app.innerHTML = `
    <div class="grid2">
      <form class="card" id="login">
        <h2>Belépés</h2>
        <label>E-mail</label><input type="email" name="email" required autocomplete="username">
        <label>Jelszó</label><input type="password" name="password" required autocomplete="current-password">
        <p class="err" data-err></p>
        <button class="btn">Belépés</button>
        <p class="hint">Bemutató fiókok: <code>gazda@demo.hu</code> és <code>munkas@demo.hu</code>, jelszó: <code>demo1234</code></p>
      </form>
      <form class="card" id="register">
        <h2>Regisztráció</h2>
        <label>Név</label><input type="text" name="name" required autocomplete="name">
        <label>E-mail</label><input type="email" name="email" required autocomplete="email">
        <label>Telefon</label><input type="text" name="phone" autocomplete="tel">
        <p class="hint">Az elérhetőségedet csak az látja, akinek a megkeresését elfogadod (vagy aki a tiédet elfogadja).</p>
        <label>Jelszó</label><input type="password" name="password" required minlength="6" autocomplete="new-password">
        <p class="err" data-err></p>
        <button class="btn">Regisztrálok</button>
      </form>
    </div>`;
  for (const id of ['login', 'register']) {
    const form = document.getElementById(id);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const res = await api('POST', `/api/${id}`, Object.fromEntries(new FormData(form)));
        setToken(res.token);
        state.user = res.user;
        if (state.draft) {
          // Belépés előtt elkezdett hirdetés folytatása
          location.hash = state.editingId ? `#/szerkeszt/${state.editingId}` : `#/uj/${state.draft.role}?folytat`;
        } else location.hash = '#/';
      } catch (err) {
        form.querySelector('[data-err]').textContent = err.message;
      }
    });
  }
}

// ---- saját hirdetések -------------------------------------------------------
async function renderMyProfiles() {
  const list = await api('GET', '/api/profiles');
  $app.innerHTML = `
    <div class="row" style="justify-content:space-between">
      <h1>Hirdetéseim</h1>
      <div class="row">
        <a class="btn" href="#/uj/kinalo">+ Munkát kínálok</a>
        <a class="btn secondary" href="#/uj/kereso">+ Munkát keresek</a>
      </div>
    </div>
    ${list.length ? '' : '<p class="muted">Még nincs hirdetésed. Kezdd el a fenti gombok egyikével.</p>'}
    ${list.map((p) => `
      <div class="card">
        <div class="row" style="justify-content:space-between">
          <div>
            <span class="chip plain">${p.role === 'kinalo' ? 'Munkát kínálok' : 'Munkát keresek'}</span>
            ${p.active ? '' : '<span class="chip amber">Szünetel</span>'}
            <h2 style="margin-top:6px">${esc(p.title)}</h2>
            <div class="muted small">${esc(placeName(p.place))}, ${p.radiusKm} km · ${p.jobs.map((j) => esc(node(j)?.name)).join(', ')}</div>
          </div>
          <div class="count ${p.matchCount ? '' : 'zero'}"><b>${p.matchCount}</b><span class="muted">találat</span></div>
        </div>
        <div class="row" style="margin-top:10px">
          <a class="btn small" href="#/talalatok/${p.id}">Találatok</a>
          <a class="btn small secondary" href="#/szerkeszt/${p.id}">Szerkesztés / lazítás</a>
          <button class="btn small secondary" data-toggle="${p.id}">${p.active ? 'Szüneteltetés' : 'Újraindítás'}</button>
          <button class="btn small danger" data-del="${p.id}">Törlés</button>
        </div>
      </div>`).join('')}`;

  $app.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', async () => {
    if (!confirm('Biztosan törlöd ezt a hirdetést?')) return;
    await api('DELETE', `/api/profiles/${b.dataset.del}`);
    renderMyProfiles();
  }));
  $app.querySelectorAll('[data-toggle]').forEach((b) => b.addEventListener('click', async () => {
    const p = list.find((x) => x.id === b.dataset.toggle);
    await api('PUT', `/api/profiles/${p.id}`, { ...p, active: !p.active });
    renderMyProfiles();
  }));
}

// ---- szerkesztő -------------------------------------------------------------
function emptyDraft(role) {
  return {
    role, title: '', jobs: [], wage: { min: '', max: '' }, place: '', radiusKm: role === 'kinalo' ? 50 : 30,
    period: null, schedules: [], provides: [], requires: [], note: '',
    ...(role === 'kinalo' ? { ageMin: '', ageMax: '', minExperience: 0, headcount: 1 } : { birthYear: '', experienceYears: 0 }),
  };
}

async function openEditor({ role, id }) {
  const continuing = location.hash.includes('?folytat');
  role = role?.split('?')[0];
  if (id) {
    if (!(state.editingId === id && state.draft)) {
      state.draft = await api('GET', `/api/profiles/${id}`);
      state.editingId = id;
    }
  } else {
    if (!['kinalo', 'kereso'].includes(role)) return (location.hash = '#/');
    if (!(continuing && state.draft?.role === role)) {
      state.draft = emptyDraft(role);
      state.editingId = null;
    }
  }
  state.treeAt = null;
  state.treeCounts = await api('GET', `/api/tree-counts?role=${state.draft.role}`).catch(() => ({}));
  renderEditor();
  refreshPreview();
}

function renderEditor() {
  const d = state.draft;
  const isOffer = d.role === 'kinalo';
  const providesKind = state.meta.providesKind[d.role];
  const provideAttrs = state.meta.attributes.filter((a) => a.kind === providesKind);
  const requireAttrs = state.meta.attributes.filter((a) => a.kind !== providesKind);
  const checks = (list, field, selected) => list.map((a) => `
    <label class="check"><input type="checkbox" data-list="${field}" value="${a.id}" ${selected.includes(a.id) ? 'checked' : ''}> ${esc(a.name)}</label>`).join('');

  $app.innerHTML = `
    <div class="editor">
      <form id="ed" autocomplete="off" onsubmit="return false">
        <h1>${state.editingId ? 'Hirdetés szerkesztése' : isOffer ? 'Munkát kínálok' : 'Munkát keresek'}</h1>

        <div class="card">
          <label for="f-title">A hirdetés címe</label>
          <input id="f-title" type="text" data-f="title" value="${esc(d.title)}" placeholder="${isOffer ? 'pl. Almaszedés – Kecskemét' : 'pl. Szüretelést keresek a Tokaji borvidéken'}">
        </div>

        <div class="card">
          <h2>1. Milyen munka?</h2>
          <p class="hint">Haladj végig a fán. Bármelyik szintet bejelölheted: egy csoport bejelölése mindent jelent, ami alatta van – ez tágabb kört ad.</p>
          <div id="tree"></div>
        </div>

        <div class="card">
          <h2>2. Bér (Ft/óra)</h2>
          <div class="inline">
            <input type="number" min="0" step="50" data-f="wage.min" value="${esc(d.wage?.min ?? '')}" placeholder="tól">
            <span>–</span>
            <input type="number" min="0" step="50" data-f="wage.max" value="${esc(d.wage?.max ?? '')}" placeholder="ig">
          </div>
          <p class="hint lock">${isOffer ? 'Mennyit kínálsz?' : 'Mennyit szeretnél keresni?'} Ezt senki nem látja. Csak azokat kötjük össze, akiknek a sávja átfed a tiéddel – így marad hely a béralkunak.</p>
        </div>

        <div class="card">
          <h2>3. Hol?</h2>
          <div class="grid2">
            <div>
              <label>${isOffer ? 'A munkavégzés helye' : 'Lakóhelyed'}</label>
              <select data-f="place">
                <option value="">– válassz –</option>
                ${state.meta.places.map((p) => `<option value="${p.id}" ${d.place === p.id ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}
              </select>
            </div>
            <div>
              <label>${isOffer ? 'Honnan fogadsz munkavállalót?' : 'Milyen messzire vállalsz munkát?'} <span id="rad-out">${esc(d.radiusKm)}</span> km</label>
              <input type="range" min="5" max="400" step="5" data-f="radiusKm" value="${esc(d.radiusKm ?? 30)}" style="width:100%">
            </div>
          </div>
        </div>

        <div class="card">
          <h2>4. Mikor, milyen rendben?</h2>
          <div class="grid2">
            <div><label>Időszak kezdete</label><input type="date" data-f="period.from" value="${esc(d.period?.from || '')}"></div>
            <div><label>Időszak vége</label><input type="date" data-f="period.to" value="${esc(d.period?.to || '')}"></div>
          </div>
          <p class="hint">Üresen hagyva: nem kötött időszakhoz.</p>
          <label>${isOffer ? 'Munkarend, amit kínálsz' : 'Munkarend, ami jó neked'}</label>
          ${checks(state.meta.schedules, 'schedules', d.schedules)}
          <p class="hint">Ha egyiket sem jelölöd, bármelyik megfelel.</p>
        </div>

        <div class="card">
          <h2>5. Feltételek</h2>
          <div class="grid2">
            <div>
              <h3>${isOffer ? 'Amit biztosítasz' : 'Amivel rendelkezel'}</h3>
              ${checks(provideAttrs, 'provides', d.provides)}
              ${isOffer ? '' : `
                <label>Születési év</label><input type="number" min="1930" max="2015" data-f="birthYear" value="${esc(d.birthYear ?? '')}">
                <p class="hint lock">Nem jelenik meg, csak a gazda életkor-feltételéhez vetjük össze.</p>
                <label>Tapasztalat (év)</label><input type="number" min="0" max="60" data-f="experienceYears" value="${esc(d.experienceYears ?? 0)}">`}
            </div>
            <div>
              <h3>${isOffer ? 'Amit elvársz' : 'Amit elvársz a gazdától'}</h3>
              ${checks(requireAttrs, 'requires', d.requires)}
              ${isOffer ? `
                <label>Életkor (tól–ig)</label>
                <div class="inline">
                  <input type="number" min="16" max="99" data-f="ageMin" value="${esc(d.ageMin ?? '')}" placeholder="mindegy">
                  <span>–</span>
                  <input type="number" min="16" max="99" data-f="ageMax" value="${esc(d.ageMax ?? '')}" placeholder="mindegy">
                </div>
                <label>Minimális tapasztalat (év)</label><input type="number" min="0" max="40" data-f="minExperience" value="${esc(d.minExperience ?? 0)}">
                <label>Hány főt keresel?</label><input type="number" min="1" max="500" data-f="headcount" value="${esc(d.headcount ?? 1)}">` : ''}
            </div>
          </div>
          <label>Egyéb, amit tudni érdemes</label>
          <textarea data-f="note" placeholder="${isOffer ? 'pl. munkaidő, szállás jellege, mit kell hozni' : 'pl. mikortól érsz rá, csapatban jönnél-e'}">${esc(d.note || '')}</textarea>
        </div>

        <p class="err" id="save-err"></p>
        <div class="row">
          <button class="btn" id="save" type="button">${state.editingId ? 'Mentés' : 'Hirdetés közzététele'}</button>
          <a class="btn secondary" href="#/">Mégse</a>
        </div>
      </form>

      <aside class="side collapsed" id="side"><div class="card" id="preview"></div></aside>
    </div>`;

  renderTree();
  renderPreview();

  const form = document.getElementById('ed');
  const onChange = () => {
    readForm();
    document.getElementById('rad-out').textContent = state.draft.radiusKm;
    refreshPreview();
  };
  form.addEventListener('input', onChange);
  form.addEventListener('change', onChange);
  document.getElementById('save').addEventListener('click', saveDraft);
}

function readForm() {
  const d = state.draft;
  const form = document.getElementById('ed');
  form.querySelectorAll('[data-f]').forEach((el) => {
    const path = el.dataset.f.split('.');
    let v = el.value;
    if (el.type === 'number' || el.type === 'range') v = v === '' ? '' : Number(v);
    if (path.length === 2) {
      d[path[0]] = { ...(d[path[0]] || {}), [path[1]]: v };
    } else d[path[0]] = v;
  });
  if (d.period && !d.period.from && !d.period.to) d.period = null;
  for (const field of ['schedules', 'provides', 'requires']) {
    d[field] = [...form.querySelectorAll(`[data-list="${field}"]:checked`)].map((el) => el.value);
  }
}

// A munkafa böngészője: morzsamenü + az aktuális szint elemei.
function renderTree() {
  const d = state.draft;
  const $t = document.getElementById('tree');
  const at = state.treeAt;
  const kids = children(at);
  const level = at ? node(at).level + 1 : 0;
  const crumbs = [{ id: null, name: 'Minden munka' }, ...(at ? pathOf(at) : [])];
  const who = d.role === 'kinalo' ? 'munkát kereső' : 'gazda';

  $t.innerHTML = `
    <div class="chips">
      ${d.jobs.length ? d.jobs.map((j) => `<span class="chip">${esc(pathOf(j).map((n) => n.name).join(' › '))}<button type="button" data-unsel="${j}" aria-label="Eltávolítás">×</button></span>`).join('') : '<span class="muted small">Még nincs bejelölt munka.</span>'}
    </div>
    <div class="crumbs">${crumbs.map((c, i) => `${i ? '<span class="sep">›</span>' : ''}<button type="button" data-go="${c.id ?? ''}">${esc(c.name)}</button>`).join('')}</div>
    <div class="lvl">${esc(state.meta.levelNames[level] || '')}</div>
    <ul class="tree">
      ${kids.map((n) => {
        const inherited = isUnderSelected(n.id, d.jobs);
        const sel = d.jobs.includes(n.id) || inherited;
        const cnt = state.treeCounts[n.id] || 0;
        return `<li class="${sel ? 'sel' : ''}">
          <input type="checkbox" data-sel="${n.id}" ${sel ? 'checked' : ''} ${inherited ? 'disabled title="A felette lévő szint már be van jelölve"' : ''} aria-label="${esc(n.name)}">
          <span class="name" data-${children(n.id).length ? 'go' : 'sel-toggle'}="${n.id}">${esc(n.name)}</span>
          <span class="cnt">${cnt} ${who}</span>
          ${children(n.id).length ? `<button type="button" class="drill" data-go="${n.id}" aria-label="Megnyitás">›</button>` : '<span></span>'}
        </li>`;
      }).join('')}
    </ul>`;

  $t.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => {
    state.treeAt = b.dataset.go || null;
    renderTree();
  }));
  const toggle = (id) => {
    if (isUnderSelected(id, d.jobs)) return;
    if (d.jobs.includes(id)) d.jobs = d.jobs.filter((j) => j !== id);
    else d.jobs = [...d.jobs.filter((j) => !pathOf(j).some((n) => n.id === id)), id]; // a leszármazottakat elnyeli
    renderTree();
    refreshPreview();
  };
  $t.querySelectorAll('[data-sel]').forEach((el) => el.addEventListener('change', (e) => {
    e.stopPropagation();
    toggle(el.dataset.sel);
  }));
  $t.querySelectorAll('[data-sel-toggle]').forEach((el) => el.addEventListener('click', () => toggle(el.dataset.selToggle)));
  $t.querySelectorAll('[data-unsel]').forEach((b) => b.addEventListener('click', () => {
    d.jobs = d.jobs.filter((j) => j !== b.dataset.unsel);
    renderTree();
    refreshPreview();
  }));
}

const refreshPreview = debounce(async () => {
  try {
    state.preview = await api('POST', '/api/preview', { profile: state.draft });
  } catch (e) {
    state.preview = { count: null, suggestions: [], error: e.message };
  }
  renderPreview();
}, 250);

function renderPreview() {
  const $p = document.getElementById('preview');
  if (!$p) return;
  const { count, suggestions, error } = state.preview;
  const other = state.draft.role === 'kinalo' ? 'munkát kereső' : 'munkát kínáló gazda';
  $p.innerHTML = `
    <div class="count ${count ? '' : 'zero'}" id="count-toggle" style="cursor:pointer">
      <b>${count ?? '–'}</b><span>illeszkedő ${other}</span>
      ${suggestions.length ? '<span class="mob-only small muted">▲ javaslatok</span>' : ''}
    </div>
    ${error ? `<p class="err small">${esc(error)}</p>` : ''}
    <div class="sugg-wrap">
      ${suggestions.length ? `
        <h3 style="margin-top:12px">Így bővülhet a kör</h3>
        <p class="hint">Mindent nem kaphatsz meg – itt látod, melyik engedmény mennyi új lehetőséget ér.</p>
        <ul class="sugg">${suggestions.map((s, i) => `
          <li><span class="gain">+${s.gain}</span><span>${esc(s.label)}</span><button class="btn small secondary" data-apply="${i}">Alkalmaz</button></li>`).join('')}
        </ul>` : `<p class="muted small">${count ? 'Minden fő feltételed teljesül a találatoknál.' : 'Jelölj be munkát, add meg a bért és a helyet – itt látod, hány lehetőség van, és mit érdemes engedni.'}</p>`}
    </div>`;
  document.getElementById('count-toggle').addEventListener('click', () => document.getElementById('side').classList.toggle('collapsed'));
  $p.querySelectorAll('[data-apply]').forEach((b) => b.addEventListener('click', () => {
    const s = suggestions[Number(b.dataset.apply)];
    Object.assign(state.draft, structuredClone(s.patch));
    toast(`Alkalmazva: ${s.label}`);
    renderEditor();
    refreshPreview();
  }));
}

async function saveDraft() {
  readForm();
  const $err = document.getElementById('save-err');
  if (!state.user) {
    toast('A közzétételhez lépj be vagy regisztrálj – a kitöltött adatok megmaradnak.');
    location.hash = '#/belepes';
    return;
  }
  try {
    const saved = state.editingId
      ? await api('PUT', `/api/profiles/${state.editingId}`, state.draft)
      : await api('POST', '/api/profiles', state.draft);
    state.draft = null;
    state.editingId = null;
    toast('Hirdetés mentve.');
    location.hash = `#/talalatok/${saved.id}`;
  } catch (e) {
    $err.textContent = e.message;
  }
}

// ---- találatok és megkeresés -----------------------------------------------
function profileCard(c, extra = '') {
  const isOffer = c.role === 'kinalo';
  return `
    <div class="card">
      <span class="chip plain">${isOffer ? 'Munkát kínál' : 'Munkát keres'}</span>
      <h2 style="margin-top:6px">${esc(c.title)}</h2>
      <div class="muted small">${esc(c.ownerName)} · ${esc(c.placeName)}${c.distanceKm != null ? ` (${c.distanceKm} km)` : ''}</div>
      <div class="chips">${c.jobs.map((j) => `<span class="chip">${esc(node(j)?.name)}</span>`).join('')}</div>
      <dl class="kv">
        <dt>Időszak</dt><dd>${esc(fmtPeriod(c.period))}</dd>
        <dt>Munkarend</dt><dd>${c.schedules.length ? c.schedules.map(scheduleName).map(esc).join(', ') : 'bármilyen'}</dd>
        ${c.provides.length ? `<dt>${isOffer ? 'Biztosít' : 'Rendelkezik'}</dt><dd>${c.provides.map((a) => esc(attr(a)?.name)).join(', ')}</dd>` : ''}
        ${c.requires.length ? `<dt>Elvár</dt><dd>${c.requires.map((a) => esc(attr(a)?.name)).join(', ')}</dd>` : ''}
        ${isOffer ? `<dt>Létszám</dt><dd>${c.headcount} fő</dd>${c.minExperience ? `<dt>Tapasztalat</dt><dd>min. ${c.minExperience} év</dd>` : ''}` : `<dt>Tapasztalat</dt><dd>${c.experienceYears || 0} év</dd>`}
        <dt>Bér</dt><dd>a sávok átfednek – megegyezés kérdése</dd>
      </dl>
      ${c.note ? `<p class="small">${esc(c.note)}</p>` : ''}
      ${extra}
    </div>`;
}

async function renderMatches(id) {
  const [mine, list] = await Promise.all([api('GET', `/api/profiles/${id}`), api('GET', `/api/profiles/${id}/matches`)]);
  $app.innerHTML = `
    <a href="#/" class="small">‹ Hirdetéseim</a>
    <h1 style="margin-top:8px">${esc(mine.title)}</h1>
    <div class="row" style="justify-content:space-between">
      <div class="count ${list.length ? '' : 'zero'}"><b>${list.length}</b><span>illeszkedő ${mine.role === 'kinalo' ? 'munkát kereső' : 'gazda'}</span></div>
      <a class="btn secondary" href="#/szerkeszt/${id}">Feltételek lazítása</a>
    </div>
    <p class="muted small">A bért sem te, sem ők nem látják – csak azt, hogy a sávok átfednek.</p>
    ${list.length ? '' : '<p>Jelenleg nincs illeszkedő hirdetés. A „Feltételek lazítása” oldalon megnézheted, mit érdemes engedni.</p>'}
    ${list.map((c) => profileCard(c, c.inquiry
      ? `<p><span class="status ${c.inquiry.status}">${statusText(c.inquiry.status)}</span> <a href="#/uzenetek" class="small">megkeresések</a></p>`
      : `<details><summary class="btn small">Megkeresés küldése</summary>
           <form data-inq="${c.id}" style="margin-top:8px">
             <textarea name="message" required placeholder="Mutatkozz be röviden, és írd meg, mikor tudnál kezdeni / mikor keresnéd."></textarea>
             <p class="err" data-err></p>
             <button class="btn small">Küldés</button>
           </form></details>`)).join('')}`;

  $app.querySelectorAll('[data-inq]').forEach((form) => form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api('POST', '/api/inquiries', { fromProfileId: id, toProfileId: form.dataset.inq, message: form.message.value });
      toast('Megkeresés elküldve.');
      renderMatches(id);
    } catch (err) {
      form.querySelector('[data-err]').textContent = err.message;
    }
  }));
}

function statusText(s) {
  return { uj: 'Válaszra vár', elfogadva: 'Elfogadva', elutasitva: 'Elutasítva' }[s] || s;
}

async function renderInbox() {
  if (!state.user) return (location.hash = '#/belepes');
  const list = await api('GET', '/api/inquiries');
  const section = (title, items) => `
    <h2>${title}</h2>
    ${items.length ? items.map((q) => profileCard(q.otherProfile || { title: '(törölt hirdetés)', jobs: [], schedules: [], provides: [], requires: [] }, `
      <hr style="border:0;border-top:1px solid var(--line)">
      <p class="small muted">${q.direction === 'bejovo' ? `${esc(q.otherName)} írta` : 'Te írtad'} a(z) „${esc(q.myProfile?.title)}” hirdetésed ${q.direction === 'bejovo' ? 'kapcsán' : 'nevében'}:</p>
      <p>${esc(q.message)}</p>
      <p><span class="status ${q.status}">${statusText(q.status)}</span></p>
      ${q.reply ? `<p class="small"><b>Válasz:</b> ${esc(q.reply)}</p>` : ''}
      ${q.contact ? `<p class="small"><b>Elérhetőség:</b> ${esc(q.otherName)} · <a href="mailto:${esc(q.contact.email)}">${esc(q.contact.email)}</a>${q.contact.phone ? ` · <a href="tel:${esc(q.contact.phone)}">${esc(q.contact.phone)}</a>` : ''}</p>` : ''}
      ${q.direction === 'bejovo' && q.status === 'uj' ? `
        <form data-resp="${q.id}">
          <textarea name="reply" placeholder="Válasz (nem kötelező)"></textarea>
          <div class="row" style="margin-top:8px">
            <button class="btn small" value="elfogadva">Elfogadom – elérhetőség megosztása</button>
            <button class="btn small danger" value="elutasitva">Elutasítom</button>
          </div>
        </form>` : ''}`)).join('') : '<p class="muted">Nincs ilyen megkeresés.</p>'}`;

  $app.innerHTML = `
    <h1>Megkeresések</h1>
    ${section('Bejövő', list.filter((q) => q.direction === 'bejovo'))}
    ${section('Elküldött', list.filter((q) => q.direction === 'kimeno'))}`;

  $app.querySelectorAll('[data-resp]').forEach((form) => form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await api('POST', `/api/inquiries/${form.dataset.resp}/respond`, { status: e.submitter.value, reply: form.reply.value });
    toast(e.submitter.value === 'elfogadva' ? 'Elfogadva – az elérhetőségetek kölcsönösen látható.' : 'Elutasítva.');
    router();
  }));
}

// ---- indulás ----------------------------------------------------------------
(async function init() {
  const meta = await api('GET', '/api/meta');
  meta.nodeById = new Map(meta.jobNodes.map((n) => [n.id, n]));
  meta.childrenOf = new Map();
  for (const n of meta.jobNodes) {
    if (!meta.childrenOf.has(n.parent)) meta.childrenOf.set(n.parent, []);
    meta.childrenOf.get(n.parent).push(n);
  }
  meta.attrById = new Map(meta.attributes.map((a) => [a.id, a]));
  state.meta = meta;
  window.addEventListener('hashchange', router);
  router();
})();
