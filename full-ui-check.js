#!/usr/bin/env node
'use strict';
// End-to-end behaviour check against the real served page:
// bottom nav, guided steps, steppers, result hero, themes, phone widths.
let JSDOM, VirtualConsole;
try { ({ JSDOM, VirtualConsole } = require('jsdom')); }
catch { console.log('jsdom missing - run npm install'); process.exit(0); }

const URL_ = 'http://localhost:8000/index.html';
const tick = ms => new Promise(r => setTimeout(r, ms));
let fails = 0;
const ok = (label, cond, extra = '') => { if (!cond) fails++; console.log(' ', cond ? 'PASS' : 'FAIL', label, extra); };

async function boot(w = 390, h = 844, lang = 'en') {
  const vc = new VirtualConsole(); const errs = [];
  vc.on('jsdomError', e => errs.push(String(e.message).split('\n')[0]));
  const dom = await JSDOM.fromURL(URL_, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(win) {
      win.matchMedia = q => ({ matches: false, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false });
      win.scrollTo = () => {}; win.Element.prototype.scrollIntoView = () => {};
      Object.defineProperty(win, 'innerWidth', { value: w, configurable: true });
      Object.defineProperty(win, 'innerHeight', { value: h, configurable: true });
      win.localStorage.setItem('language', lang);
    },
  });
  await tick(1200);
  return { dom, errs };
}
const vis = (d, sel) => { const el = d.querySelector(sel); return !!el && !el.classList.contains('hidden'); };

(async () => {
  console.log('=== A. Load & shell ===');
  {
    const { dom, errs } = await boot();
    const d = dom.window.document;
    ok('no page errors', errs.length === 0, errs.join(' | '));
    ok('compiled CSS embedded (no partial stylesheet load)',
       !!d.querySelector('#app-styles') && d.querySelector('#app-styles').textContent.includes('box-sizing:border-box') && !d.querySelector('link[rel="stylesheet"]'));
    ok('no tailwind runtime', typeof dom.window.tailwind === 'undefined');
    ok('icon sprite inline', d.querySelectorAll('symbol[id^="i-"]').length >= 42);
    ok('bottom nav built', !!d.getElementById('bottom-nav'));
    ok('bottom nav has 6 items', d.querySelectorAll('.bn-item').length === 6, `(${d.querySelectorAll('.bn-item').length})`);
    ok('action bar built', !!d.getElementById('mobile-actions'));
    ok('calculate moved into action bar', !!d.querySelector('#mobile-actions #mobile-calculate'));
    ok('opens on home screen', d.body.classList.contains('view-home'));
    ok('steppers added', d.querySelectorAll('.num-field').length > 10, `(${d.querySelectorAll('.num-field').length})`);
    ok('all icons painted', d.querySelectorAll('i[data-lucide]').length === 0);
  }

  console.log('\n=== B. Bottom nav navigation ===');
  {
    const { dom, errs } = await boot();
    const d = dom.window.document;
    d.querySelector('.bn-item[data-goto="bricks"]').click();
    await tick(150);
    ok('bricks panel open', vis(d, '#bricks'));
    ok('view-home cleared', !d.body.classList.contains('view-home'));
    ok('nav item active', d.querySelector('.bn-item[data-goto="bricks"]').classList.contains('is-active'));
    d.querySelector('.bn-item[data-goto="steel"]').click();
    await tick(150);
    ok('switched to steel', vis(d, '#steel') && !vis(d, '#bricks'));
    d.querySelector('.bn-item[data-goto="home"]').click();
    await tick(150);
    ok('home button returns home', d.body.classList.contains('view-home'));
    ok('no errors', errs.length === 0, errs.join(' | '));
  }

  console.log('\n=== C. Guided steps ===');
  for (const tool of ['concrete', 'blocks', 'bricks', 'steel']) {
    const { dom, errs } = await boot();
    const d = dom.window.document;
    d.querySelector('.bn-item[data-goto="' + tool + '"]').click();
    await tick(200);
    const wiz = d.querySelector('#' + tool + ' .wizard');
    ok(tool + ': wizard built', !!wiz);
    if (wiz) {
      const steps = wiz.querySelectorAll('.wizard-step');
      ok(tool + ': >=3 steps', steps.length >= 3, `(${steps.length})`);
      ok(tool + ': only step 1 visible', wiz.querySelectorAll('.wizard-step.is-current').length === 1 &&
         steps[0].classList.contains('is-current'));
      ok(tool + ': progress segments', wiz.querySelectorAll('.wp-seg').length === steps.length);
      const nextBtn = wiz.querySelectorAll('.wizard-nav button')[1];
      ok(tool + ': next label', /Next/i.test(nextBtn.textContent), nextBtn.textContent.trim());
      nextBtn.click(); await tick(80);
      ok(tool + ': advanced to step 2', steps[1].classList.contains('is-current'));
      const backBtn = wiz.querySelectorAll('.wizard-nav button')[0];
      backBtn.click(); await tick(80);
      ok(tool + ': back to step 1', steps[0].classList.contains('is-current'));
      // last step
      for (let i = 1; i < steps.length; i++) { wiz.querySelectorAll('.wizard-nav button')[1].click(); await tick(60); }
      ok(tool + ': last step shows Review', /review/i.test(wiz.querySelectorAll('.wizard-nav button')[1].textContent),
         wiz.querySelectorAll('.wizard-nav button')[1].textContent.trim());
    }
    ok(tool + ': no errors', errs.length === 0, errs.join(' | '));
  }

  console.log('\n=== D. Inputs still reachable & calculating ===');
  {
    const { dom, errs } = await boot();
    const d = dom.window.document;
    d.querySelector('.bn-item[data-goto="bricks"]').click();
    await tick(150);
    const set = (id, v) => { const e = d.getElementById(id); if (!e) throw new Error('missing #' + id); e.value = String(v); };
    set('brick-wall-length', 10); set('brick-wall-height', 3); set('brick-wall-width-input', 0.115);
    d.getElementById('mobile-calculate').click();
    await tick(300);
    const res = d.getElementById('bricks-result');
    ok('result shown', !res.classList.contains('hidden'));
    ok('bricks = 1483', res.textContent.includes('1483'));   // raw value, ungrouped
    ok('hero built', !!res.querySelector('.result-hero'));
    const hero = res.querySelector('.result-hero');
    if (hero) {
      ok('hero shows quantity', /1,?483/.test(hero.textContent), hero.textContent.replace(/\s+/g, ' ').slice(0, 80));
      ok('hero shows total cost', !!hero.querySelector('.rh-cost'));
    }
    ok('action buttons row', !!res.querySelector('.result-actions'));
    ok('save/export buttons present', res.querySelectorAll('.result-actions button').length >= 3,
       `(${res.querySelectorAll('.result-actions button').length})`);
    ok('no errors', errs.length === 0, errs.join(' | '));
  }

  console.log('\n=== E. Touch steppers ===');
  {
    const { dom, errs } = await boot();
    const d = dom.window.document;
    d.querySelector('.bn-item[data-goto="bricks"]').click();
    await tick(150);
    const field = d.getElementById('brick-wall-length');
    const wrap = field.closest('.num-field');
    ok('input wrapped in .num-field', !!wrap);
    field.value = '10';
    wrap.querySelector('button[data-dir="1"]').click();
    ok('plus increments by step', field.value === '10.01', field.value);
    wrap.querySelector('button[data-dir="-1"]').click();
    ok('minus decrements', field.value === '10', field.value);
    const leaves = d.getElementById('brick-leaves');
    leaves.value = '1';
    leaves.closest('.num-field').querySelector('button[data-dir="1"]').click();
    ok('integer step = 1', leaves.value === '2', leaves.value);
    ok('no errors', errs.length === 0, errs.join(' | '));
  }

  console.log('\n=== F. Themes ===');
  {
    const { dom, errs } = await boot();
    const d = dom.window.document;
    ok('light default', !d.body.classList.contains('theme-dark'));
    const tg = d.getElementById('theme-toggle');
    tg.checked = true; tg.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    ok('dark applied', d.body.classList.contains('theme-dark'));
    tg.checked = false; tg.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    ok('back to light', !d.body.classList.contains('theme-dark'));
    ok('no errors', errs.length === 0, errs.join(' | '));
  }

  console.log('\n=== G. Phone widths (320 / 360 / 390 / 430 / 768) ===');
  for (const w of [320, 360, 390, 430, 768]) {
    const { dom, errs } = await boot(w, 800);
    const d = dom.window.document;
    d.querySelector('.bn-item[data-goto="bricks"]').click();
    await tick(150);
    const set = (id, v) => { const e = d.getElementById(id); e.value = String(v); };
    set('brick-wall-length', 5); set('brick-wall-height', 3); set('brick-wall-width-input', 0.115);
    d.getElementById('mobile-calculate').click();
    await tick(250);
    ok(`${w}px: calculates`, d.getElementById('bricks-result').textContent.includes('742'),
       d.getElementById('bricks-result').textContent.replace(/\s+/g, ' ').slice(0, 50));
    ok(`${w}px: no errors`, errs.length === 0, errs.join(' | '));
  }

  console.log('\n=== H. Languages (en / ar / ku / ks) ===');
  for (const lang of ['en', 'ar', 'ku', 'ks']) {
    const { dom, errs } = await boot(390, 844, lang);
    const d = dom.window.document;
    d.querySelector('.bn-item[data-goto="bricks"]').click();
    await tick(200);
    const wiz = d.querySelector('#bricks .wizard');
    ok(`${lang}: wizard built`, !!wiz);
    ok(`${lang}: step label present`, !!wiz && /[^\s]/.test(wiz.querySelector('.wizard-meta span').textContent),
       wiz ? wiz.querySelector('.wizard-meta span').textContent : '');
    ok(`${lang}: no errors`, errs.length === 0, errs.join(' | '));
  }

  console.log('\n' + (fails ? `FAILURES: ${fails}` : 'ALL CHECKS PASSED'));
  process.exit(fails ? 1 : 0);
})();
