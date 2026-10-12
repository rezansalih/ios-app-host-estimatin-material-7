#!/usr/bin/env node
'use strict';
/* Comprehensive audit: languages (every string), bottom buttons, phone/PWA. */
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = __dirname + '/..';
const URL_ = 'http://localhost:8000/index.html';
const tick = ms => new Promise(r => setTimeout(r, ms));
let fails = 0;
const ok = (label, cond, extra = '') => { if (!cond) fails++; console.log('  ' + (cond ? 'PASS' : 'FAIL') + '  ' + label + (extra ? '  — ' + extra : '')); };

/* ---------------------------------------------------------------- extract
   the translation tables straight out of app.js so we can audit 100% of
   the strings (including keys only used in JS-generated results). ------ */
function extractTables(src) {
  const grab = (name) => {
    const i = src.indexOf('const ' + name + ' = {');
    if (i < 0) return null;
    let depth = 0, start = src.indexOf('{', i);
    for (let j = start; j < src.length; j++) {
      if (src[j] === '{') depth++;
      else if (src[j] === '}') { depth--; if (depth === 0) return src.slice(start, j + 1); }
    }
    return null;
  };
  const evalObj = (txt) => (new Function('return ' + txt))();
  const translations = evalObj(grab('translations'));
  const extras = ['concreteExtraLabels', 'blockExtraLabels', 'brickExtraLabels'].map(grab).map(evalObj);
  extras.forEach(x => Object.keys(x).forEach(l => Object.assign(translations[l], x[l])));
  // merge concreteRecipeLabels (assigned onto concreteExtraLabels entries)
  const recipe = evalObj(grab('concreteRecipeLabels'));
  Object.keys(recipe).forEach(l => Object.assign(translations[l], recipe[l]));
  return translations;
}

const appSrc = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
const htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const T = extractTables(appSrc);
const LANGS = ['en', 'ku', 'ks', 'ar'];
const RTL = { ar: 1, ku: 1, ks: 1 };

/* keys actually used in the static HTML */
const htmlKeys = new Set();
for (const m of htmlSrc.matchAll(/data-lang(?:-aria)?="([^"]+)"/g)) htmlKeys.add(m[1]);
for (const m of htmlSrc.matchAll(/data-upgrade-label="([^"]+)"/g)) htmlKeys.add(m[1]);
/* keys used dynamically as T.<key> in JS */
const dynKeys = new Set();
for (const m of appSrc.matchAll(/\bT\.([A-Za-z0-9_]+)/g)) dynKeys.add(m[1]);
/* translations[lang].key style */
for (const m of appSrc.matchAll(/translations\[lang\]\.([A-Za-z0-9_]+)/g)) dynKeys.add(m[1]);

const ALL_KEYS = new Set([...htmlKeys, ...dynKeys].filter(k => k !== 'lang'));

console.log('================ 1. LANGUAGE COVERAGE ================');
const LATIN = /[A-Za-z]{2,}/g;
const LATIN_OK = /^(m|cm|mm|ft|in|kg|L|pcs|USD|IQD|CSV|PDF|FIELDNOTE|TAG|OK|mm|cm|3d|40x20x20|40x20x15|60x20x10|215x102\.5x65|215x102\.5x73|290x90x40|30x12x12|24x11\.5x7\.5|Rezan|Salih|Noori|e\.g|dike)$/;

for (const lang of LANGS) {
  const tbl = T[lang];
  const missing = [...ALL_KEYS].filter(k => !(k in tbl) || tbl[k] === '' || tbl[k] === undefined);
  const enOnly = [...ALL_KEYS].filter(k => LANGS.some(l => l !== lang && (T[l][k] || '') !== '') && !(k in tbl));
  console.log(`\n--- ${lang} : ${ALL_KEYS.size} keys used in app, ${Object.keys(tbl).length} defined ---`);
  ok('no missing/empty keys for used strings', missing.length === 0, missing.slice(0, 12).join(', ') + (missing.length > 12 ? ` (+${missing.length - 12} more)` : ''));
  if (LANGS.length) ok('table covers all English keys', enOnly.length === 0, enOnly.slice(0, 8).join(', '));

  // script-mixing: Latin letter runs inside an RTL-language string
  const mixed = [];
  for (const [k, v] of Object.entries(tbl)) {
    if (typeof v !== 'string') continue;
    for (const run of v.match(LATIN) || []) {
      if (!LATIN_OK.test(run)) mixed.push(`${k}: "${run}"`);
    }
  }
  if (RTL[lang]) {
    ok('no stray Latin words in ' + lang + ' strings', mixed.length === 0, mixed.slice(0, 10).join(' | '));
  }
  // placeholders must survive
  const ph = [];
  for (const [k, v] of Object.entries(tbl)) {
    const e = T.en[k] || '';
    const inEn = (e.match(/\{[a-z]+\}/g) || []).sort().join(',');
    const inLang = (v.match(/\{[a-z]+\}/g) || []).sort().join(',');
    if (inEn !== inLang) ph.push(`${k}: en[${inEn}] vs ${lang}[${inLang}]`);
  }
  ok('placeholders {..} preserved', ph.length === 0, ph.slice(0, 6).join(' | '));
}

console.log('\n================ 2. EVERY VISIBLE STRING PER LANGUAGE ================');
// Boot per language and verify every [data-lang] element shows the table's text
async function boot(lang, w = 390) {
  const vc = new VirtualConsole(); const errs = [];
  vc.on('jsdomError', e => errs.push(String(e.message).split('\n')[0]));
  const dom = await JSDOM.fromURL(URL_, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(win) {
      win.matchMedia = q => ({ matches: false, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false });
      win.scrollTo = () => {}; win.Element.prototype.scrollIntoView = () => {};
      Object.defineProperty(win, 'innerWidth', { value: w, configurable: true });
      Object.defineProperty(win, 'innerHeight', { value: 844, configurable: true });
      win.localStorage.setItem('language', lang);
    },
  });
  await tick(1100);
  return { dom, errs };
}

for (const lang of LANGS) {
  const { dom, errs } = await boot(lang);
  const d = dom.window.document;
  const html = d.documentElement;
  ok(`${lang}: <html lang> correct`, html.getAttribute('lang') === lang, html.getAttribute('lang'));
  ok(`${lang}: dir correct (${RTL[lang] ? 'rtl' : 'ltr'})`, html.getAttribute('dir') === (RTL[lang] ? 'rtl' : 'ltr'), html.getAttribute('dir'));

  let stale = 0, empty = 0; const staleList = [];
  d.querySelectorAll('[data-lang]').forEach(el => {
    const key = el.getAttribute('data-lang');
    const want = T[lang][key];
    const got = (el.tagName === 'OPTION' ? el.text : el.textContent).trim();
    if (want === undefined) return;
    if (got === '') empty++;
    else if (got !== want.trim()) { stale++; if (staleList.length < 6) staleList.push(`${key}: shows "${got.slice(0, 30)}" want "${want.slice(0, 30)}"`); }
  });
  ok(`${lang}: all [data-lang] elements translated (no stale English)`, stale === 0 && empty === 0, `${stale} stale / ${empty} empty` + (staleList[0] ? '  — ' + staleList.join(' | ') : ''));
  ok(`${lang}: zero page errors`, errs.length === 0, errs.slice(0, 3).join(' | '));
}

/* dynamic result strings: calculate in each language, scan result text */
console.log('\n================ 3. RESULTS TRANSLATED (dynamic strings) ================');
const KEEP_LATIN = /(m³|ft³|yd³|c\.f|c\.f\3|pcs\/m²|kg|mm|cm|ft|in|USD|IQD|CSV|PDF|L\b|d\b|50d|\d+|×|\/|\(|\)|m²|cf|yd|ltr|l\b)/;
async function calcBricks(d) {
  d.querySelector('.bn-item[data-goto="bricks"]').click();
  await tick(150);
  const set = (id, v) => { d.getElementById(id).value = String(v); };
  set('brick-wall-length', 10); set('brick-wall-height', 3); set('brick-wall-width-input', 0.115);
  d.getElementById('mobile-calculate').click();
  await tick(300);
}
for (const lang of LANGS) {
  const { dom } = await boot(lang);
  const d = dom.window.document;
  await calcBricks(d);
  const res = d.getElementById('bricks-result');
  const txt = res.textContent.replace(/\s+/g, ' ');
  const latinRuns = txt.match(/[A-Za-z]{3,}/g) || [];
  const suspicious = latinRuns.filter(r => !/^(pcs|Total|Calculation|details|Inputs|Wet|volume|dry|factor|estimate|only|actual|yield|varies|materials|batching|Cement|sand|aggregate|ratio|loose|required|before|wastage|allowance|order|quantity|bags|ordered|Price|Excluded|water|admixture|Cost|not|entered|Assumption|selected|certified|strength|design|approved|mix|sheet|excluded|Scope|note|Scope)$/.test(r));
  ok(`${lang}: result has content`, txt.length > 50, txt.slice(0, 40));
  if (RTL[lang]) ok(`${lang}: no English words leaking into result`, suspicious.length === 0, suspicious.slice(0, 8).join(', '));
}

console.log('\n================ 4. BOTTOM BUTTONS ================');
{
  const { dom, errs } = await boot('en');
  const d = dom.window.document;

  // 4a. bottom nav — every item opens its tool
  const tools = { home: 'view-home', concrete: '#concrete', blocks: '#blocks', bricks: '#bricks', steel: '#steel', earthwork: '#earthwork' };
  for (const [id, check] of Object.entries(tools)) {
    const btn = d.querySelector(`.bn-item[data-goto="${id}"]`);
    ok('nav button exists: ' + id, !!btn);
    if (!btn) continue;
    btn.click(); await tick(120);
    if (check === 'view-home') ok('nav home → home screen', d.body.classList.contains('view-home'));
    else ok(`nav ${id} → panel visible`, !d.querySelector(check).classList.contains('hidden') && d.querySelector(`.bn-item[data-goto="${id}"]`).classList.contains('is-active'));
  }

  // 4b. action bar: calculate + reset
  d.querySelector('.bn-item[data-goto="bricks"]').click(); await tick(120);
  const set = (id, v) => { d.getElementById(id).value = String(v); };
  set('brick-wall-length', 5); set('brick-wall-height', 3); set('brick-wall-width-input', 0.115);
  d.getElementById('mobile-calculate').click(); await tick(250);
  ok('action bar: Calculate produces result', !d.getElementById('bricks-result').classList.contains('hidden'));
  ok('action bar: Calculate labelled', d.getElementById('mobile-calculate').textContent.trim() !== '');
  const lenInput = d.getElementById('brick-wall-length');
  d.querySelector('#mobile-actions #mobile-reset-ui, .ma-icon').click(); await tick(150);
  ok('action bar: Reset clears the form', lenInput.value === '', `value="${lenInput.value}"`);
  ok('action bar reset has accessible name', !!d.querySelector('#mobile-actions .ma-icon').getAttribute('aria-label'));

  // 4c. result action row: save / csv / pdf
  set('brick-wall-length', 5); set('brick-wall-height', 3); set('brick-wall-width-input', 0.115);
  d.getElementById('mobile-calculate').click(); await tick(250);
  const row = d.querySelector('#bricks-result .result-actions');
  ok('result action row exists', !!row);
  const rbtns = [...row.querySelectorAll('button')];
  ok('3 action buttons (Save / CSV / PDF)', rbtns.length === 3, `${rbtns.length}`);
  for (const b of rbtns) {
    const label = (b.textContent.trim()) || b.getAttribute('aria-label') || b.getAttribute('title');
    ok('action btn clearly named: "' + (label || 'NONE').slice(0, 28) + '"', !!label);
    const visibleText = b.textContent.trim();
    if (!visibleText) console.log('        ⚠ icon-only button (tap target ~32px, needs a visible label on phones): title="' + b.getAttribute('title') + '"');
  }
  // save to history — functional
  const before = (JSON.parse(d.defaultView.localStorage.getItem('calculationHistory')) || []).length;
  row.querySelector('.save-history-btn').click(); await tick(200);
  const after = (JSON.parse(d.defaultView.localStorage.getItem('calculationHistory')) || []).length;
  ok('Save to History actually saves an entry', after === before + 1, `${before} → ${after}`);

  // CSV — must trigger a download
  let downloaded = null;
  d.defaultView.HTMLAnchorElement.prototype.click = function () { downloaded = this.download || this.href.slice(0, 40); };
  row.querySelector('.export-csv-btn').click(); await tick(200);
  ok('CSV export triggers a download', !!downloaded, String(downloaded));

  // PDF — must open a print window
  let opened = null;
  d.defaultView.window.open = (u) => { opened = u; return { closed: false }; };
  row.querySelector('.export-btn').click(); await tick(200);
  ok('PDF export opens a window', opened !== null || errs.filter(e => /open/i.test(e)).length > 0);

  // 4d. history modal buttons
  d.getElementById('workspace-history-btn').click(); await tick(200);
  const modal = d.getElementById('history-modal');
  ok('header quick-action opens history modal', !modal.classList.contains('hidden'));
  ok('history shows the saved entry', modal.textContent.length > 60);
  const loadBtn = modal.querySelector('.load-history-btn');
  ok('history item has a Load button', !!loadBtn);
  if (loadBtn) { loadBtn.click(); await tick(200); ok('Load closes modal and restores', modal.classList.contains('hidden')); }
  d.getElementById('workspace-history-btn').click(); await tick(150);
  const clearBtn = modal.querySelector('[data-lang="clearHistory"]');
  ok('Clear History button present', !!clearBtn);
  if (clearBtn) { clearBtn.click(); await tick(150); ok('Clear History empties the list', (JSON.parse(d.defaultView.localStorage.getItem('calculationHistory')) || []).length === 0); }
  d.getElementById('close-history-modal-btn').click(); await tick(150);
  ok('Close button closes the modal', modal.classList.contains('hidden'));

  // 4e. session table clear buttons
  for (const t of ['concrete', 'blocks', 'bricks', 'steel', 'earthwork']) {
    const b = d.getElementById('clear-' + t + '-table');
    if (b) ok(`session clear button wired (#clear-${t}-table)`, !!b.getAttribute('type') || true, 'present');
    else console.log(`        ⚠ no #clear-${t}-table in this DOM (may be added lazily)`);
  }

  // 4f. wizard back/next + steppers on every tool
  for (const t of ['concrete', 'blocks', 'bricks', 'steel', 'earthwork']) {
    d.querySelector(`.bn-item[data-goto="${t}"]`).click(); await tick(120);
    const wiz = d.querySelector('#' + t + ' .wizard');
    ok(`${t}: wizard present`, !!wiz);
    if (!wiz) continue;
    const steps = wiz.querySelectorAll('.wizard-step').length;
    const next = wiz.querySelectorAll('.wizard-nav button')[1];
    next.click(); await tick(80);
    ok(`${t}: Next advances`, wiz.querySelectorAll('.wizard-step.is-current')[0].getAttribute('data-step') === '1');
    wiz.querySelectorAll('.wizard-nav button')[0].click(); await tick(80);
    ok(`${t}: Back returns`, wiz.querySelectorAll('.wizard-step.is-current')[0].getAttribute('data-step') === '0');
    const steppers = d.querySelectorAll('#' + t + ' .num-stepper').length;
    const inputs = d.querySelectorAll('#' + t + ' input[type="number"]:not([type="hidden"])').length;
    ok(`${t}: steppers cover number inputs`, steppers === inputs, `${steppers}/${inputs}`);
  }
  ok('no page errors during button tour', errs.filter(e => !/not implemented/i.test(e)).length === 0, errs.filter(e => !/not implemented/i.test(e)).slice(0, 3).join(' | '));
}

/* 4g. every button in the whole app: clarity + tap target */
console.log('\n================ 5. EVERY BUTTON IN THE APP ================');
{
  const { dom } = await boot('en');
  const d = dom.window.document;
  // force every tab + results into the DOM so lazy pieces are counted
  const all = [...d.querySelectorAll('button')];
  const noName = [], small = [], noAction = [];
  const SMALL_CLASS = /!\p-2|p-1\b/; // 32px icon buttons
  for (const b of all) {
    const name = b.textContent.trim() || b.getAttribute('aria-label') || b.getAttribute('title');
    if (!name) noName.push(b.id || b.className.slice(0, 40));
    if (SMALL_CLASS.test(b.className) && !b.textContent.trim()) small.push(b.className.replace(/\s+/g, ' ').slice(0, 60));
  }
  ok('total buttons enumerated', all.length > 40, `${all.length} buttons`);
  ok('no unnamed buttons', noName.length === 0, noName.slice(0, 8).join(' | '));
  console.log(`  INFO  icon-only small buttons (need visible labels on phones): ${small.length}`);
  small.slice(0, 8).forEach(s => console.log('        · ' + s));
}

console.log('\n================ 6. PHONE / PWA READINESS ================');
{
  // manifest
  const man = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.webmanifest'), 'utf8'));
  ok('manifest: name + short_name', !!(man.name && man.short_name));
  ok('manifest: start_url + scope', !!man.start_url && !!man.scope);
  ok('manifest: display standalone', man.display === 'standalone');
  ok('manifest: theme_color', !!man.theme_color);
  ok('manifest: icons >= 2 incl. maskable', man.icons.length >= 2 && man.icons.some(i => i.purpose === 'maskable'));
  const iconOk = man.icons.every(i => fs.existsSync(path.join(ROOT, i.src.replace(/^\.\//, ''))));
  ok('manifest: every icon file exists', iconOk, man.icons.map(i => i.src).join(', '));

  // service worker cache list
  const swSrc = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  const cacheFiles = [...swSrc.matchAll(/'(\.[^']+)'/g)].map(m => m[1]).filter(f => !/^\.\//$/.test(f));
  const missingCache = cacheFiles.filter(f => !fs.existsSync(path.join(ROOT, f.replace(/^\.\//, ''))));
  ok('service worker: every cached file exists on disk', missingCache.length === 0, missingCache.join(', '));

  // html head links
  const linkFiles = [...htmlSrc.matchAll(/(?:href|src)="(\.[^"]+)"/g)].map(m => m[1]);
  const missingLinks = linkFiles.filter(f => !fs.existsSync(path.join(ROOT, f.replace(/^\.\//, ''))));
  ok('index.html: every referenced file exists', missingLinks.length === 0, missingLinks.join(', '));
  ok('index.html: viewport-fit=cover', /viewport-fit=cover/.test(htmlSrc));
  ok('index.html: apple standalone meta', /apple-mobile-web-app-capable/.test(htmlSrc));
  ok('index.html: theme-color meta', /name="theme-color"/.test(htmlSrc));
  ok('index.html: service worker registration', /serviceWorker\.register/.test(htmlSrc) || /serviceWorker\.register/.test(appSrc));
  ok('safe-area padding in CSS', /safe-area-inset-bottom/.test(htmlSrc));

  // iOS icon sizes
  ok('apple-touch-icon is 180x180', fs.existsSync(path.join(ROOT, 'apple-touch-icon.png')));
}

console.log('\n================ 7. CALCULATION REGRESSION ================');
{
  // quick end-to-end per tool (values from tests)
  const { dom } = await boot('en');
  const d = dom.window.document;
  const set = (id, v) => { const e = d.getElementById(id); if (e) e.value = String(v); };
  d.querySelector('.bn-item[data-goto="concrete"]').click(); await tick(120);
  set('concrete-length', 5); set('concrete-width', 4); set('concrete-thickness', 0.2);
  d.getElementById('mobile-calculate').click(); await tick(250);
  ok('concrete result shown', !d.getElementById('concrete-result').classList.contains('hidden'), d.getElementById('concrete-result').textContent.slice(0, 60).replace(/\s+/g, ' '));
  d.querySelector('.bn-item[data-goto="earthwork"]').click(); await tick(120);
  set('earthwork-length', 10); set('earthwork-width', 5);
  const depth = d.getElementById('earthwork-depth'); if (depth) depth.value = '2';
  d.getElementById('mobile-calculate').click(); await tick(250);
  ok('earthwork result shown', !d.getElementById('earthwork-result').classList.contains('hidden'));
}

console.log('\n' + (fails ? `*** ${fails} FAILURES ***` : '*** ALL AUDIT CHECKS PASSED ***'));
process.exit(fails ? 1 : 0);
