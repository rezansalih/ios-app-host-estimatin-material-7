#!/usr/bin/env node
'use strict';
// Verifies the new home screen, back bar, theme switch and mobile shell.
const fs = require('node:fs');
const path = require('path');
let JSDOM, VirtualConsole;
try { ({ JSDOM, VirtualConsole } = require('jsdom')); }
catch { console.log('jsdom not installed - run `npm install` first.'); process.exit(0); }

const DIR = path.join(__dirname, '..');
// app-ui.js is now an external file; inline it so this string-based harness
// (which loads no external resources) exercises the same code the browser does.
let html = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
// Use function replacements: the sources contain "$'" and "${...}", which
// String.replace would otherwise treat as substitution patterns.
html = html.replace('<link rel="stylesheet" href="./new-style.css">',
  () => '<style>' + fs.readFileSync(path.join(DIR, 'new-style.css'), 'utf8') + '<\/style>')
   .replace(/<script src="\.\/app\.js"[^>]*><\/script>/,
  () => '<script>' + fs.readFileSync(path.join(DIR, 'app.js'), 'utf8') + '<\/script>')
   .replace(/<script src="\.\/app-ui\.js"[^>]*><\/script>/,
  () => '<script>' + fs.readFileSync(path.join(DIR, 'app-ui.js'), 'utf8') + '<\/script>');

// Lazy calc chunks: inline them here (a real browser fetches calc-*.js on first tool open).
html = html.replace('</body>', () => ['calc-concrete','calc-blocks','calc-bricks','calc-steel','calc-earthwork'].map(n => '<script>' + fs.readFileSync(path.join(DIR, n + '.js'), 'utf8') + '<\/script>').join('') + '</body>');
const tick = ms => new Promise(r => setTimeout(r, ms));

async function boot(w = 390, h = 844) {
  const vc = new VirtualConsole();
  const errors = [];
  vc.on('jsdomError', e => errors.push(String(e.message).split('\n')[0]));
  const dom = new JSDOM(html, {
    runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole: vc,
    beforeParse(win) {
      win.matchMedia = q => ({ matches: false, media: q, addListener() {}, removeListener() {},
        addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false });
      win.scrollTo = () => {};
      win.Element.prototype.scrollIntoView = () => {};
      win.localStorage.setItem('introSeen', '1');
      Object.defineProperty(win, 'innerWidth', { value: w, configurable: true });
      Object.defineProperty(win, 'innerHeight', { value: h, configurable: true });
    },
  });
  await tick(250);
  return { dom, errors };
}

let fails = 0;
const ok = (label, cond, extra = '') => {
  if (!cond) fails++;
  console.log(' ', cond ? 'PASS' : 'FAIL', label, extra);
};

const vis = (d, sel) => {
  const el = d.querySelector(sel);
  if (!el) return false;
  const cs = d.defaultView.getComputedStyle(el);
  return !el.classList.contains('hidden') && cs.display !== 'none';
};

(async () => {
  console.log('=== 1. First load lands on the home screen (phone, 390x844) ===');
  {
    const { dom, errors } = await boot();
    const d = dom.window.document;
    ok('body has view-home', d.body.classList.contains('view-home'));
    ok('home screen visible', vis(d, '#home-screen'));
    ok('5 calculator tiles rendered', d.querySelectorAll('.app-tile').length === 5, `(${d.querySelectorAll('.app-tile').length})`);
    ok('no duplicate settings tile', !d.querySelector('.app-tile[data-goto="settings"]'));
    ok('back bar hidden', !vis(d, '#calc-back'));
    ok('tab bar hidden on home', !vis(d, '.calculator-nav'));
    ok('metric grid hidden on home', !vis(d, '.metric-grid'));
    ok('sticky action bar hidden on home', !vis(d, '.mobile-sticky-footer'));
    ok('no calculator panel open', d.querySelectorAll('.tab-content:not(.hidden)').length === 0);
    ok('no page errors', errors.length === 0, errors.join(' | '));
  }

  console.log('\n=== 2. Tapping the Bricks tile opens the bricks calculator ===');
  {
    const { dom, errors } = await boot();
    const d = dom.window.document;
    d.querySelector('.app-tile[data-goto="bricks"]').click();
    ok('view-home removed', !d.body.classList.contains('view-home'));
    ok('home screen hidden', !vis(d, '#home-screen'));
    ok('bricks panel visible', vis(d, '#bricks'));
    ok('bricks tab marked active', d.querySelector('.tab-btn[data-tab="bricks"]').classList.contains('tab-active'));
    ok('back bar visible', vis(d, '#calc-back'));
    ok('back bar shows "Bricks"', d.getElementById('calc-back-title').textContent.trim() === 'Bricks',
       `("${d.getElementById('calc-back-title').textContent.trim()}")`);
    // v2: on phones the bottom nav replaces the top tab bar, so assert the nav
    // marks the open tool instead of asserting a visible .calculator-nav.
    ok('bottom nav marks the open tool',
       d.querySelector('.bn-item[data-goto="bricks"]').classList.contains('is-active'));
    ok('tab bar is phone-hidden (CSS rule)',
       /\.calculator-nav \{ display: none; \}/.test(fs.readFileSync(path.join(DIR, 'new-style.css'), 'utf8')));
    // jsdom does not evaluate @media, so assert the rule exists and the bar is not .hidden
    const css = fs.readFileSync(path.join(DIR, 'new-style.css'), 'utf8');
    // v2: the legacy .mobile-sticky-footer is replaced by the fixed bottom
    // action bar + bottom nav on phones; the sticky bar is desktop-only now.
    ok('bottom nav shown on phones (CSS rule)',
       /@media \(max-width: ?640px\)/.test(css) && /\.bottom-nav \{ display: flex; \}/.test(css));
    ok('bottom action bar shown on phones (CSS rule)',
       /body:not\(\.view-home\) \.mobile-actions \{ display: flex; \}/.test(css));
    ok('legacy sticky footer suppressed', /\.mobile-sticky-footer \{ display: none !important; \}/.test(css));
    ok('sticky action bar not .hidden', !d.querySelector('.mobile-sticky-footer').classList.contains('hidden'));
    ok('bottom nav built', !!d.getElementById('bottom-nav'));
    ok('calculate button lives in the action bar', !!d.querySelector('#mobile-actions #mobile-calculate'));
    ok('body is not view-home (bar allowed)', !d.body.classList.contains('view-home'));
    ok('no page errors', errors.length === 0, errors.join(' | '));
  }

  console.log('\n=== 3. Back button returns home and resets state ===');
  {
    const { dom, errors } = await boot();
    const d = dom.window.document;
    d.querySelector('.app-tile[data-goto="concrete"]').click();
    d.getElementById('back-home-btn').click();
    ok('back on home', d.body.classList.contains('view-home'));
    ok('home visible again', vis(d, '#home-screen'));
    ok('all panels closed', d.querySelectorAll('.tab-content:not(.hidden)').length === 0);
    ok('no tab active', !d.querySelector('.tab-btn.tab-active'));
    ok('no page errors', errors.length === 0, errors.join(' | '));
  }

  console.log('\n=== 4. The calculator still calculates after arriving from a tile ===');
  {
    const { dom, errors } = await boot();
    const d = dom.window.document;
    d.querySelector('.app-tile[data-goto="bricks"]').click();
    const set = (id, v) => { const e = d.getElementById(id); if (!e) throw new Error('missing #' + id); e.value = String(v); };
    set('brick-wall-length', 10); set('brick-wall-height', 3); set('brick-wall-width-input', 0.115);
    d.getElementById('calculate-bricks').click();
    const txt = d.getElementById('bricks-result').textContent.replace(/\s+/g, ' ');
    ok('result rendered', !d.getElementById('bricks-result').classList.contains('hidden'));
    ok('bricks = 1483', txt.includes('1483'), txt.slice(0, 90));
    ok('no page errors', errors.length === 0, errors.join(' | '));
  }

  console.log('\n=== 5. Theme: light is default, toggle switches to dark ===');
  {
    const { dom, errors } = await boot();
    const d = dom.window.document;
    ok('default is light (no theme-dark)', !d.body.classList.contains('theme-dark'));
    ok('theme meta is light', d.getElementById('theme-color-meta').getAttribute('content') === '#f2f6f7',
       d.getElementById('theme-color-meta').getAttribute('content'));
    const toggle = d.getElementById('theme-toggle');
    toggle.checked = true;
    toggle.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    ok('dark class applied', d.body.classList.contains('theme-dark'));
    ok('theme meta is dark', d.getElementById('theme-color-meta').getAttribute('content') === '#0b1214');
    ok('choice persisted', dom.window.localStorage.getItem('theme') === 'dark');
    toggle.checked = false;
    toggle.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    ok('switches back to light', !d.body.classList.contains('theme-dark'));
    ok('no page errors', errors.length === 0, errors.join(' | '));
  }

  console.log('\n=== 6. Project settings opens as its own screen (header button) ===');
  {
    const { dom, errors } = await boot();
    const d = dom.window.document;
    d.getElementById('open-settings-btn').click();
    ok('settings screen visible from home', vis(d, '#global-settings-wrapper'));
    ok('home screen left (settings is a screen)', !d.body.classList.contains('view-home'));
    ok('back bar titled "Project settings"', d.getElementById('calc-back-title').textContent.trim() === 'Project settings',
       `("${d.getElementById('calc-back-title').textContent.trim()}")`);
    d.getElementById('close-global-settings-btn').click();
    ok('panel closed', !vis(d, '#global-settings-wrapper'));
    ok('returned home after close', d.body.classList.contains('view-home'));
    d.querySelector('.bn-item[data-goto="bricks"]').click();
    await tick(150);
    d.getElementById('open-settings-btn').click();
    ok('settings open from inside a tool', vis(d, '#global-settings-wrapper'));
    ok('bricks content hidden while settings open', !vis(d, '#bricks'));
    d.getElementById('close-global-settings-btn').click();
    ok('closed, back on bricks', vis(d, '#bricks') && !vis(d, '#global-settings-wrapper'));
    // Slimmed settings panel: only wastage, currency + rate and cement bag size remain.
    ok('project information fields removed',
       ['project-name', 'client-name', 'project-location', 'project-date', 'project-notes', 'input-unit-system']
         .every(id => !d.getElementById(id)));
    ok('wastage + currency + rate + bag size kept',
       ['wastage', 'currency', 'exchange-rate', 'cement-bag-mass'].every(id => d.getElementById(id)));
    // Total-volume mode asks for the volume only — thickness/leaves were confusing
    // (total volume already contains the thickness).
    ok('volume-mode thickness/leaves fields removed',
       ['block-volume-wall-thickness', 'block-volume-leaves', 'brick-volume-wall-thickness', 'brick-volume-leaves']
         .every(id => !d.getElementById(id)));
    ok('no page errors', errors.length === 0, errors.join(' | '));
  }

  console.log('\n=== 6b. Zoom is locked down ===');
  {
    const htmlSrc = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
    const css = fs.readFileSync(path.join(DIR, 'new-style.css'), 'utf8');
    ok('viewport disables user scaling', /maximum-scale=1/.test(htmlSrc) && /user-scalable=no/.test(htmlSrc));
    ok('touch-action pan-x pan-y in CSS', /touch-action: pan-x pan-y/.test(css));
    ok('gesture / keyboard zoom guards present', /gesturestart/.test(htmlSrc) && /touchmove/.test(htmlSrc) && /ctrlKey/.test(htmlSrc));
    ok('stepper reserve is !important (beats compact !p-2 padding)',
       /padding-inline-end: 100px !important/.test(css) && /padding-inline-start: 100px !important/.test(css));
  }

  console.log('\n=== 6c. Session table labels are plain and honest ===');
  {
    const htmlSrc = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
    ok('blocks/bricks session columns say Volume / Cement / Sand',
       /data-lang="tableHeaderVolume">Volume/.test(htmlSrc) &&
       /data-lang="tableHeaderCement">Cement/.test(htmlSrc) &&
       /data-lang="tableHeaderSand">Sand/.test(htmlSrc));
    ok('confusing Mortar Cement/Sand headers gone', !/tableHeaderMortarCement|tableHeaderMortarSand/.test(htmlSrc));
    ok('earthwork description column renamed to Dimensions', /data-lang="tableHeaderDims">Dimensions/.test(htmlSrc));
    ok('session tables collapsed behind details bars', (htmlSrc.match(/class="session-details"/g) || []).length === 5);
    ok('steel session column renamed to Dimensions', (htmlSrc.match(/data-lang="tableHeaderDims"/g) || []).length === 2);
    ok('steel: member quantity label has translations', /data-lang="memberQuantity">/.test(htmlSrc));
    ok('steel: lap splices collapsed in advanced details', /id="steel-lap-details"/.test(htmlSrc) && !/id="steel-include-lap-splice"/.test(htmlSrc));
    ok('steel: custom bars element exists', /id="steel-custom-inputs"/.test(htmlSrc) && /data-lang="customBars">/.test(htmlSrc));
    ok('steel: diameter lists include 8 and 32', /value="8">8</.test(htmlSrc) && /value="32">32</.test(htmlSrc));
    ok('steel: shop bar length field present', /id="steel-standard-bar-length"/.test(htmlSrc) && /data-lang="standardBarLength">/.test(htmlSrc));

    console.log('\n=== 6d. Anyone-can-use aids are in place ===');
    ok('field hint buttons on technical labels', (htmlSrc.match(/class="hint-btn"/g) || []).length >= 40,
       `(${(htmlSrc.match(/class="hint-btn"/g) || []).length})`);
    ok('plain-language hint texts present', (htmlSrc.match(/class="field-hint hidden"/g) || []).length >= 40);
    ok('sanity ranges on measured inputs', (htmlSrc.match(/data-sane="/g) || []).length >= 60,
       `(${(htmlSrc.match(/data-sane="/g) || []).length})`);
    ok('first-run intro overlay present', /id="intro-overlay"/.test(htmlSrc) && /id="intro-next"/.test(htmlSrc) && /id="intro-start"/.test(htmlSrc));
    ok('steel "Fill typical values" button present', /id="steel-preset-btn"/.test(htmlSrc));
  }

  console.log('\n=== 7. Home screen translates (ar / ku / ks) ===');
  {
    for (const lang of ['ar', 'ku', 'ks']) {
      const { dom, errors } = await boot();
      const w = dom.window;
      w.localStorage.setItem('language', lang);
      const sel = dom.window.document.getElementById('language-selector');
      sel.value = lang;
      sel.dispatchEvent(new w.Event('change', { bubbles: true }));
      const tip = dom.window.document.querySelector('#home-screen [data-lang="homeTip"]').textContent.trim();
      const tile = dom.window.document.querySelector('#home-screen [data-lang="tabConcrete"]').textContent.trim();
      ok(`${lang} home tip translated`, tip && !/Results are estimates/.test(tip), `"${tip}"`);
      ok(`${lang} home tile label translated`, tile && !/^Concrete$/.test(tile), `"${tile}"`);
      ok(`${lang} no page errors`, errors.length === 0, errors.join(' | '));
    }
  }

  console.log('\n' + (fails ? `FAILURES: ${fails}` : 'ALL UI CHECKS PASSED'));
  process.exit(fails ? 1 : 0);
})();
