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
    ok('one "See details" section with the trail merged inside',
       res.querySelectorAll('details.result-more').length === 1 && !res.querySelector('details.calculation-trail'),
       `(more=${res.querySelectorAll('details.result-more').length}, trail=${res.querySelectorAll('details.calculation-trail').length})`);
    ok('details section closed by default', !!res.querySelector('details.result-more') && !res.querySelector('details.result-more').open);
    const grid = res.querySelector('.result-content > div');
    const orderList = grid && grid.querySelector('.order-list');
    ok('answer sits above the order list', !!grid && !!orderList &&
       [...grid.children].indexOf(hero) < [...grid.children].indexOf(orderList));
    const sd = d.querySelector('#bricks-table-section .session-details');
    ok('session table hidden behind a closed bar', !!sd && !sd.open);
    ok('session count badge present', !!d.querySelector('#bricks-table-section .session-count'));
    ok('no errors', errs.length === 0, errs.join(' | '));
  }

  console.log('\n=== D2. Steel: custom bars, member quantity, order by diameter ===');
  {
    const { dom, errs } = await boot();
    const d = dom.window.document;
    d.querySelector('.bn-item[data-goto="steel"]').click();
    await tick(150);
    const set = (id, v) => { const e = d.getElementById(id); if (!e) throw new Error('missing #' + id); e.value = String(v); };

    // lap splices: collapsed advanced details, not a top-level checkbox
    ok('lap splices hidden in closed details', !!d.getElementById('steel-lap-details') && !d.getElementById('steel-lap-details').open);
    ok('no old lap checkbox', !d.getElementById('steel-include-lap-splice'));

    // --- custom bars element ---
    const sel = d.getElementById('steel-element-selector');
    sel.value = 'custom';
    sel.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(50);
    ok('custom inputs shown', !d.getElementById('steel-custom-inputs').classList.contains('hidden'));
    ok('member qty hidden for custom', d.getElementById('steel-member-qty-row').classList.contains('hidden'));
    ok('one custom row to start', d.querySelectorAll('#steel-custom-rows .custom-bar-row').length === 1,
       `(${d.querySelectorAll('#steel-custom-rows .custom-bar-row').length})`);
    d.getElementById('steel-custom-add-row').click();
    ok('add row works', d.querySelectorAll('#steel-custom-rows .custom-bar-row').length === 2);
    const rows = d.querySelectorAll('#steel-custom-rows .custom-bar-row');
    rows[0].querySelector('.custom-diameter').value = '12';
    rows[0].querySelector('.custom-count').value = '10';
    rows[0].querySelector('.custom-length').value = '3';
    rows[1].querySelector('.custom-diameter').value = '8';
    rows[1].querySelector('.custom-count').value = '20';
    rows[1].querySelector('.custom-length').value = '1.5';
    set('steel-cost', 1500);
    d.getElementById('mobile-calculate').click();
    await tick(300);
    const res = d.getElementById('steel-result');
    ok('steel result shown', !res.classList.contains('hidden'));
    const hero = res.querySelector('.result-hero');
    ok('hero built', !!hero);
    ok('hero headline is Total Weight', /Total Weight/.test(hero?.querySelector('.rh-label')?.textContent || ''),
       (hero?.querySelector('.rh-label')?.textContent || '').trim());
    // Ø12: 30 m x 0.8889 kg/m x 1.05 = 28.00 kg ; Ø8: 30 m x 0.3951 x 1.05 = 12.44 kg ; total 40.44
    ok('total weight = 40.44 kg', /40\.44/.test(hero?.querySelector('.rh-value')?.textContent || ''),
       (hero?.querySelector('.rh-value')?.textContent || '').trim());
    ok('hero shows cost', !!hero?.querySelector('.rh-cost'));
    ok('flat rows: no stray group headings', res.querySelectorAll('.result-content > div > p').length === 0);
    const orderRows = [...res.querySelectorAll('.order-list .result-item')];
    ok('what-to-order lists each diameter with shop bars',
       orderRows.some(r => /Ø12 mm/.test(r.textContent) && /3 .*\u00d7 12 m/.test(r.textContent)) &&
       orderRows.some(r => /Ø8 mm/.test(r.textContent)),
       orderRows.map(r => r.textContent.replace(/\s+/g, ' ').trim()).join(' | '));
    ok('one closed "See details" section', res.querySelectorAll('details.result-more').length === 1 &&
       !res.querySelector('details.result-more').open);
    ok('breakdown rows live in details', /Custom bars/.test(res.querySelector('details.result-more')?.textContent || '') ||
       /20 .*\u00d7 1\.5 m/.test(res.querySelector('details.result-more')?.textContent || ''));
    ok('calculation note merged into details', !!res.querySelector('details.result-more .trail-subhead') &&
       (res.querySelector('details.result-more .trail-body')?.textContent || '').length > 40);

    // --- footing: member quantity must multiply (regression) ---
    sel.value = 'footing';
    sel.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(50);
    ok('member qty visible for footing', !d.getElementById('steel-member-qty-row').classList.contains('hidden'));
    set('footing-length', 3); set('footing-width', 2);
    set('footing-spacing-len', 150); set('footing-diameter-len', 12);
    set('footing-spacing-wid', 150); set('footing-diameter-wid', 10);
    set('steel-member-quantity', 1);
    d.getElementById('mobile-calculate').click();
    await tick(300);
    const hero1 = d.querySelector('#steel-result .result-hero .rh-value')?.textContent || '';
    const w1 = parseFloat(hero1.replace(/[^\d.]/g, ''));
    // qty 1: (3x15x144/162 + 2x21x100/162) x 1.05 = 69.22 kg
    ok('footing weight qty 1 = 69.22', Math.abs(w1 - 69.22) < 0.02, String(w1));
    set('steel-member-quantity', 2);
    d.getElementById('mobile-calculate').click();
    await tick(300);
    const hero2 = d.querySelector('#steel-result .result-hero .rh-value')?.textContent || '';
    const w2 = parseFloat(hero2.replace(/[^\d.]/g, ''));
    ok('member quantity doubles the weight', Math.abs(w2 - 2 * 69.22) < 0.05, String(w2));
    ok('per-member note in details', /per member/.test(d.getElementById('steel-result').textContent));
    ok('session row dimensions are language-neutral', /3\u00d72 m/.test(d.querySelector('#steel-table-body')?.textContent || ''),
       (d.querySelector('#steel-table-body')?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80));
    ok('no errors', errs.length === 0, errs.join(' | '));
  }

  console.log('\n=== D3. Reset button clears the form and hides the result ===');
  {
    const { dom, errs } = await boot();
    const d = dom.window.document;
    d.querySelector('.bn-item[data-goto="steel"]').click();
    await tick(150);
    const sel = d.getElementById('steel-element-selector');
    sel.value = 'custom';
    sel.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(50);
    const r0 = d.querySelector('#steel-custom-rows .custom-bar-row');
    r0.querySelector('.custom-diameter').value = '12';
    r0.querySelector('.custom-count').value = '10';
    r0.querySelector('.custom-length').value = '3';
    d.getElementById('steel-cost').value = '1500';
    d.getElementById('steel-lap-details').open = true;
    d.getElementById('mobile-calculate').click();
    await tick(300);
    ok('steel result shown before reset', !d.getElementById('steel-result').classList.contains('hidden'));
    ok('session row exists before reset', d.querySelectorAll('#steel-table-body tr').length >= 1);
    d.querySelector('.reset-btn[data-form="steel"]').click();
    await tick(150);
    ok('result hidden after reset', d.getElementById('steel-result').classList.contains('hidden'));
    ok('element selector cleared', d.getElementById('steel-element-selector').value === '');
    ok('member quantity back to 1', d.getElementById('steel-member-quantity').value === '1');
    ok('cost cleared', d.getElementById('steel-cost').value === '');
    ok('bar length back to 12', d.getElementById('steel-standard-bar-length').value === '12');
    ok('lap details closed again', !d.getElementById('steel-lap-details').open);
    ok('custom rows reset to one empty row', d.querySelectorAll('#steel-custom-rows .custom-bar-row').length === 1 &&
       !(d.querySelector('#steel-custom-rows .custom-count')?.value));
    ok('session rows cleared', d.querySelectorAll('#steel-table-body tr').length === 0 ||
       d.getElementById('steel-table-section').classList.contains('hidden'));
    ok('no errors on steel reset', errs.length === 0, errs.join(' | '));
  }
  {
    const { dom, errs } = await boot();
    const d = dom.window.document;
    d.querySelector('.bn-item[data-goto="bricks"]').click();
    await tick(150);
    d.getElementById('brick-wall-length').value = '10';
    d.getElementById('brick-wall-height').value = '3';
    d.getElementById('brick-wall-width-input').value = '0.115';
    d.getElementById('mobile-calculate').click();
    await tick(300);
    ok('bricks result shown before reset', !d.getElementById('bricks-result').classList.contains('hidden'));
    d.querySelector('.reset-btn[data-form="bricks"]').click();
    await tick(150);
    ok('bricks result hidden after reset', d.getElementById('bricks-result').classList.contains('hidden'));
    ok('bricks fields cleared', d.getElementById('brick-wall-length').value === '');
    ok('no errors on bricks reset', errs.length === 0, errs.join(' | '));
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
