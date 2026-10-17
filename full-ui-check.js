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

async function boot(w = 390, h = 844, lang = 'en', intro = false) {
  const vc = new VirtualConsole(); const errs = [];
  vc.on('jsdomError', e => errs.push(String(e.message).split('\n')[0]));
  const dom = await JSDOM.fromURL(URL_, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(win) {
      win.matchMedia = q => ({ matches: false, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false });
      win.scrollTo = () => {}; win.Element.prototype.scrollIntoView = () => {};
      win.URL.createObjectURL = win.URL.createObjectURL || (() => 'blob:test');
      win.URL.revokeObjectURL = win.URL.revokeObjectURL || (() => {});
      Object.defineProperty(win, 'innerWidth', { value: w, configurable: true });
      Object.defineProperty(win, 'innerHeight', { value: h, configurable: true });
      win.localStorage.setItem('language', lang);
      if (!intro) win.localStorage.setItem('introSeen', '1');
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
      ok('hero shows no fake cost without prices', !hero.querySelector('.rh-cost'));
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
       orderRows.some(r => /Ø12 mm/.test(r.textContent) && /≈ 3 .*\(12 m\)/.test(r.textContent)) &&
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

  console.log('\n=== D4. Anyone-can-use aids: intro, hints, presets, sanity ===');
  {
    const { dom, errs } = await boot(390, 844, 'en', true);   // intro = true -> first-run state
    const d = dom.window.document;
    const intro = d.getElementById('intro-overlay');
    ok('intro shows on first run', intro && !intro.classList.contains('hidden'));
    ok('intro starts on slide 1', !!intro.querySelector('.intro-slide.is-active[data-slide="0"]'));
    d.getElementById('intro-next').click();
    d.getElementById('intro-next').click();
    ok('start button appears on last slide', !d.getElementById('intro-start').classList.contains('hidden'));
    d.getElementById('intro-start').click();
    ok('intro dismisses and remembers', intro.classList.contains('hidden') && !!dom.window.localStorage.getItem('introSeen'));

    d.querySelector('.bn-item[data-goto="steel"]').click();
    await tick(150);
    const hintBtn = d.querySelector('#steel .hint-btn');
    const hintP = hintBtn && hintBtn.closest('.label-with-hint').nextElementSibling;
    ok('hint note starts hidden', !!hintP && hintP.classList.contains('field-hint') && hintP.classList.contains('hidden'));
    hintBtn.click();
    ok('hint opens on tap', !hintP.classList.contains('hidden'));
    hintBtn.click();
    ok('hint closes on tap', hintP.classList.contains('hidden'));

    const sel = d.getElementById('steel-element-selector');
    sel.value = 'footing';
    sel.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(50);
    ok('preset button visible for footing', !d.getElementById('steel-preset-btn').classList.contains('hidden'));
    d.getElementById('steel-preset-btn').click();
    ok('preset fills spacing 150', d.getElementById('footing-spacing-len').value === '150' &&
       d.getElementById('footing-spacing-wid').value === '150');
    ok('preset selects diameters', d.getElementById('footing-diameter-len').value === '12' &&
       d.getElementById('footing-diameter-wid').value === '12');
    ok('preset leaves measurements empty', d.getElementById('footing-length').value === '' &&
       d.getElementById('footing-width').value === '');
    sel.value = 'beam';
    sel.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(50);
    d.getElementById('steel-preset-btn').click();
    ok('beam preset fills stirrup assumptions', d.getElementById('beam-stirrup-spacing').value === '200' &&
       d.getElementById('beam-cover').value === '40' &&
       d.getElementById('beam-stirrup-diameter').value === '8');
    ok('beam preset enables stirrups', d.getElementById('beam-include-stirrups').checked);
    sel.value = 'custom';
    sel.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(50);
    ok('preset button hidden for custom', d.getElementById('steel-preset-btn').classList.contains('hidden'));
    ok('no errors on intro/hints/presets', errs.length === 0, errs.join(' | '));
  }
  {
    const { dom, errs } = await boot();
    const d = dom.window.document;
    d.querySelector('.bn-item[data-goto="bricks"]').click();
    await tick(150);
    d.getElementById('brick-wall-length').value = '10';
    d.getElementById('brick-wall-height').value = '30';   // unusual (usually 1-20 m)
    d.getElementById('brick-wall-width-input').value = '0.115';
    d.getElementById('mobile-calculate').click();
    await tick(300);
    const banner = d.querySelector('.sanity-banner');
    ok('sanity banner appears for odd height', !!banner && /30/.test(banner.textContent),
       (banner?.textContent || '').replace(/\s+/g, ' ').slice(0, 90));
    ok('calculation still runs (warning is not blocking)', !d.getElementById('bricks-result').classList.contains('hidden'));
    d.querySelector('.reset-btn[data-form="bricks"]').click();
    await tick(150);
    ok('banner cleared on reset', !d.querySelector('.sanity-banner'));
    ok('no errors with sanity warnings', errs.length === 0, errs.join(' | '));
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
    ok('no banner for normal values', !d.querySelector('.sanity-banner'));
    ok('no errors', errs.length === 0, errs.join(' | '));
  }

  console.log('\n=== D5. Language switch re-labels results and session rows ===');
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
    ok('result is in English', /Bricks Required/.test(d.getElementById('bricks-result').textContent));
    const rowsBefore = d.querySelectorAll('#bricks-table-body tr').length;
    ok('session row exists (English words)', /bags|pcs/.test(d.querySelector('#bricks-table-body').textContent),
       d.querySelector('#bricks-table-body').textContent.replace(/\s+/g, ' ').slice(0, 80));
    const sel = d.getElementById('language-selector');
    sel.value = 'ar';
    sel.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(700);
    const res = d.getElementById('bricks-result');
    ok('result re-rendered in Arabic', /الطابوق المطلوب/.test(res.textContent),
       res.textContent.replace(/\s+/g, ' ').slice(0, 70));
    ok('hero label switched language', !/Bricks Required/.test(res.querySelector('.result-hero')?.textContent || '') &&
       /الطابوق/.test(res.querySelector('.result-hero')?.textContent || ''));
    const cell = d.querySelector('#bricks-table-body').textContent;
    ok('session row localized to Arabic', /كيس/.test(cell) && !/\bbags\b/.test(cell),
       cell.replace(/\s+/g, ' ').slice(0, 80));
    ok('no duplicate session row after switch', d.querySelectorAll('#bricks-table-body tr').length === rowsBefore,
       `(${d.querySelectorAll('#bricks-table-body tr').length} vs ${rowsBefore})`);
    ok('no errors on language switch', errs.length === 0, errs.join(' | '));
  }
  {
    const { dom, errs } = await boot();
    const d = dom.window.document;
    d.querySelector('.bn-item[data-goto="steel"]').click();
    await tick(150);
    const elSel = d.getElementById('steel-element-selector');
    elSel.value = 'footing';
    elSel.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(50);
    d.getElementById('footing-length').value = '3';
    d.getElementById('footing-width').value = '2';
    d.getElementById('footing-spacing-len').value = '150';
    d.getElementById('footing-diameter-len').value = '12';
    d.getElementById('footing-spacing-wid').value = '150';
    d.getElementById('footing-diameter-wid').value = '10';
    d.getElementById('mobile-calculate').click();
    await tick(300);
    ok('steel session row in English', /Footing/.test(d.querySelector('#steel-table-body').textContent));
    const sel = d.getElementById('language-selector');
    sel.value = 'ar';
    sel.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(700);
    const cell = d.querySelector('#steel-table-body').textContent;
    ok('steel element name localized', /أساس/.test(cell) && !/Footing/.test(cell),
       cell.replace(/\s+/g, ' ').slice(0, 80));
    ok('steel result in Arabic', /الوزن الإجمالي|نتيجة/.test(d.getElementById('steel-result').textContent));
    ok('no errors', errs.length === 0, errs.join(' | '));
  }

  console.log('\n=== D6. Formula vectors against the live calculators ===');
  {
    // Steel beam with lap splices: 20 m run, 2x Ø12, 12 m shop bars, 50d laps, 5% waste
    const { dom, errs } = await boot();
    const d = dom.window.document;
    d.querySelector('.bn-item[data-goto="steel"]').click();
    await tick(150);
    const elSel = d.getElementById('steel-element-selector');
    elSel.value = 'beam';
    elSel.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(50);
    d.getElementById('beam-length').value = '20';
    d.getElementById('beam-bars').value = '2';
    d.getElementById('beam-diameter').value = '12';
    d.getElementById('steel-lap-details').open = true;
    d.getElementById('mobile-calculate').click();
    await tick(300);
    const t = d.getElementById('steel-result').textContent;
    ok('lap: 20 m x2Ø12 -> 38.45 kg', /38\.45 kg/.test(t), t.replace(/\s+/g, ' ').slice(0, 100));
    ok('lap: 2 splices, 1.20 m added', /2(\s*)$/.test('2') && /1\.20 m/.test(t) && /Total number of splices|Splices|عدد|ژمارا/.test(t));
  }
  {
    // Beam stirrups: 3x0.3x0.5 m, cover 40, Ø8 @200 + 4Ø16 mains -> 29.47 kg
    const { dom, errs } = await boot();
    const d = dom.window.document;
    d.querySelector('.bn-item[data-goto="steel"]').click();
    await tick(150);
    const elSel = d.getElementById('steel-element-selector');
    elSel.value = 'beam';
    elSel.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(50);
    d.getElementById('beam-length').value = '3';
    d.getElementById('beam-bars').value = '4';
    d.getElementById('beam-diameter').value = '16';
    d.getElementById('beam-include-stirrups').checked = true;
    d.getElementById('beam-include-stirrups').dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(30);
    d.getElementById('beam-width-dim').value = '300';
    d.getElementById('beam-depth-dim').value = '500';
    d.getElementById('beam-cover').value = '40';
    d.getElementById('beam-stirrup-spacing').value = '200';
    d.getElementById('beam-stirrup-diameter').value = '8';
    d.getElementById('mobile-calculate').click();
    await tick(300);
    const t = d.getElementById('steel-result').textContent;
    ok('stirrups: 3m beam 4Ø16 + Ø8@200 -> 29.47 kg', /29\.47 kg/.test(t), t.replace(/\s+/g, ' ').slice(0, 110));
    const sch = d.querySelector('.bar-schedule');
    ok('bar schedule present', !!sch && /Bar schedule/.test(sch.textContent));
    ok('stirrup shape shows ring dims 220×420', !!sch && /220×420/.test(sch.textContent));
    ok('stirrup cutting length 1.44 m', !!sch && /1\.44/.test(sch.textContent));
    ok('schedule lists 2 bar rows', !!sch && sch.querySelectorAll('tbody tr').length === 2, String(sch ? sch.querySelectorAll('tbody tr').length : -1));
  }
  {
    // One-way strip: 6 m run @200, 5 m bars Ø10 -> 100.46 kg
    const { dom, errs } = await boot();
    const d = dom.window.document;
    d.querySelector('.bn-item[data-goto="steel"]').click();
    await tick(150);
    const elSel = d.getElementById('steel-element-selector');
    elSel.value = 'one_way';
    elSel.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(50);
    d.getElementById('one-way-dist-length').value = '6';
    d.getElementById('one-way-bar-length').value = '5';
    d.getElementById('one-way-spacing').value = '200';
    d.getElementById('one-way-diameter').value = '10';
    d.getElementById('mobile-calculate').click();
    await tick(300);
    const t = d.getElementById('steel-result').textContent;
    ok('one-way: 6m @200, 5m bars Ø10 -> 100.46 kg', /100\.46 kg/.test(t), t.replace(/\s+/g, ' ').slice(0, 110));
    ok('one-way: 31 bars', /31/.test(t));
    ok('one-way: element name is not undefined', !/undefined/.test(d.getElementById('steel-result').textContent));
  }
  {
    // Footing number-of-bars mode must equal spacing mode: 15x3m Ø12 + 21x2m Ø10 -> 69.22 kg
    const { dom, errs } = await boot();
    const d = dom.window.document;
    d.querySelector('.bn-item[data-goto="steel"]').click();
    await tick(150);
    const elSel = d.getElementById('steel-element-selector');
    elSel.value = 'footing';
    elSel.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(50);
    const numMode = d.querySelector('input[name="footing-mode"][value="number"]');
    numMode.checked = true;
    numMode.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(30);
    d.getElementById('footing-length').value = '3';
    d.getElementById('footing-width').value = '2';
    d.getElementById('footing-number-len').value = '15';
    d.getElementById('footing-diameter-len-alt').value = '12';
    d.getElementById('footing-number-wid').value = '21';
    d.getElementById('footing-diameter-wid-alt').value = '10';
    d.getElementById('mobile-calculate').click();
    await tick(300);
    const t = d.getElementById('steel-result').textContent;
    ok('footing number mode = 69.22 kg (matches spacing mode)', /69\.22 kg/.test(t), t.replace(/\s+/g, ' ').slice(0, 110));
  }
  {
    // Concrete formwork: slab 5x4x0.2 x2 -> edges 7.20 m² + suspended soffit 40.00 m²
    const { dom, errs } = await boot();
    const d = dom.window.document;
    d.querySelector('.bn-item[data-goto="concrete"]').click();
    await tick(150);
    const dims = d.querySelector('input[name="concrete-mode"][value="dims"]');
    dims.checked = true;
    dims.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(30);
    d.getElementById('concrete-type').value = 'slab';
    d.getElementById('concrete-type').dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(30);
    d.getElementById('concrete-length').value = '5';
    d.getElementById('concrete-width').value = '4';
    d.getElementById('concrete-thickness').value = '0.2';
    d.getElementById('concrete-quantity').value = '2';
    const sup = d.getElementById('concrete-slab-support');
    if (sup) {
      sup.value = 'suspended';
      sup.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    }
    d.getElementById('mobile-calculate').click();
    await tick(300);
    const t = d.getElementById('concrete-result').textContent;
    ok('slab edge formwork 7.20 m²', /7\.20 m²/.test(t), t.replace(/\s+/g, ' ').slice(0, 120));
    ok('suspended soffit formwork 40.00 m²', /40\.00 m²/.test(t));
  }
  {
    // Blocks with mortar: 10x3x0.2 wall, solid 40x20x20, 1cm joints, 1:6 -> 366 blocks, 3 bags
    const { dom, errs } = await boot();
    const d = dom.window.document;
    d.querySelector('.bn-item[data-goto="blocks"]').click();
    await tick(150);
    const dims = d.querySelector('input[name="block-mode"][value="dims"]');
    dims.checked = true;
    dims.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(30);
    d.getElementById('block-wall-length').value = '10';
    d.getElementById('block-wall-height').value = '3';
    d.getElementById('block-wall-width-input').value = '0.2';
    d.getElementById('block-include-mortar').checked = true;
    d.getElementById('mobile-calculate').click();
    await tick(300);
    const t = d.getElementById('blocks-result').textContent;
    ok('blocks: 366 blocks', /366/.test(t), t.replace(/\s+/g, ' ').slice(0, 110));
    ok('blocks: 3 bags of mortar cement', /3/.test(t) && /bags|كيس|کەسک|کیسە/.test(t));
  }

  console.log('\n=== D7. Zero-cost fix and JSON backup/restore ===');
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
    const res = d.getElementById('bricks-result');
    const totalLine = res.querySelector('.total-cost-print')?.textContent || '';
    ok('bricks: missing prices say Cost not entered', /Cost not entered/.test(totalLine), totalLine.trim());
    ok('bricks: no false 0.00 total', !/0\.00/.test(totalLine));
    ok('bricks: hero omits the cost line', !res.querySelector('.result-hero .rh-cost'));
    ok('bricks: session cost cell says not entered', /Cost not entered/.test(d.querySelector('#bricks-table-body').textContent));
    // explicit 0 is still a real (free) price
    d.getElementById('brick-cost').value = '0';
    d.getElementById('brick-cement-cost').value = '0';
    d.getElementById('brick-sand-cost').value = '0';
    d.getElementById('mobile-calculate').click();
    await tick(300);
    ok('bricks: entered zeros are a real 0.00 total', /0\.00/.test((d.getElementById('bricks-result').querySelector('.total-cost-print')?.textContent) || ''), '');
  }
  {
    const { dom, errs } = await boot();
    const d = dom.window.document;
    d.querySelector('.bn-item[data-goto="steel"]').click();
    await tick(150);
    const elSel = d.getElementById('steel-element-selector');
    elSel.value = 'footing';
    elSel.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(50);
    d.getElementById('footing-length').value = '3';
    d.getElementById('footing-width').value = '2';
    d.getElementById('footing-spacing-len').value = '150';
    d.getElementById('footing-diameter-len').value = '12';
    d.getElementById('footing-spacing-wid').value = '150';
    d.getElementById('footing-diameter-wid').value = '10';
    d.getElementById('mobile-calculate').click();
    await tick(300);
    const res = d.getElementById('steel-result');
    ok('steel: missing price says Cost not entered', /Cost not entered/.test(res.textContent));
    ok('steel: hero omits the cost line', !res.querySelector('.result-hero .rh-cost'));
    ok('no errors with zero-cost fix', errs.length === 0, errs.join(' | '));
  }
  {
    const { dom, errs } = await boot();
    const d = dom.window.document;
    const w = dom.window;
    // backup downloads a JSON file
    const dl = [];
    w.HTMLAnchorElement.prototype.click = function () { dl.push(this.download); };
    d.getElementById('open-settings-btn')?.click();
    await tick(80);
    d.getElementById('backup-btn').click();
    await tick(100);
    ok('backup downloads a dated JSON file', dl.length === 1 && /material-estimator-backup-.*\.json/.test(dl[0] || ''), String(dl[0]));
    ok('backup button confirms', /Backup file downloaded/.test(d.getElementById('backup-btn').textContent));
    // restore from a crafted backup file
    const bak = {
      app: 'material-estimator', version: 1, language: 'ar', theme: 'dark', introSeen: '1',
      settings: { wastage: '7', currency: 'IQD', customCurrency: '', exchangeRate: '1350', cementBagMass: '40' },
      history: [{ type: 'bricks', data: {}, timestamp: '2026-01-01T00:00:00Z' }],
      sessions: { steel: [{ element: 'Footing', description: '3×2 m', weight: '69.22 kg', cost: 'IQD100' }] }
    };
    const file = new w.File([JSON.stringify(bak)], 'backup.json', { type: 'application/json' });
    const input = d.getElementById('restore-file');
    Object.defineProperty(input, 'files', { value: [file], configurable: true });
    input.dispatchEvent(new w.Event('change', { bubbles: true }));
    await tick(400);
    ok('restore: settings values come back', d.getElementById('wastage').value === '7' &&
       d.getElementById('cement-bag-mass').value === '40' && d.getElementById('exchange-rate').value === '1350');
    ok('restore: language applied', d.getElementById('language-selector').value === 'ar');
    ok('restore: session rows come back', d.querySelectorAll('#steel-table-body tr').length === 1 &&
       /Footing|أساس/.test(d.querySelector('#steel-table-body').textContent));
    ok('restore: history comes back', JSON.parse(w.localStorage.getItem('calculationHistory') || '[]').length === 1);
    ok('restore: button confirms', /تمت استعادة|Backup restored|استعادة/.test(d.getElementById('restore-btn').textContent));
    // invalid file is rejected
    const bad = new w.File(['{"nope":1}'], 'bad.json', { type: 'application/json' });
    Object.defineProperty(input, 'files', { value: [bad], configurable: true });
    input.dispatchEvent(new w.Event('change', { bubbles: true }));
    await tick(300);
    ok('restore: invalid file is rejected with a message', d.getElementById('error-box')?.textContent?.length > 0 ||
       !d.getElementById('error-box')?.classList.contains('hidden'));
    ok('no errors in backup/restore', errs.length === 0, errs.join(' | '));
  }

  console.log('\n=== D8. Job-site additions: BRC, grades, glue, converter, quote ===');
  {
    const { dom, errs } = await boot();
    const d = dom.window.document;
    const ratio = d.getElementById('concrete-ratio');
    ratio.value = '1:3:6';
    ratio.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(80);
    ok('grade note follows ratio (C15 blinding)', /blinding/i.test(d.getElementById('concrete-grade-note').textContent));
    ok('grade note key is data-lang-driven', d.getElementById('concrete-grade-note').getAttribute('data-lang') === 'gradeNoteC15');
    ratio.value = '1:1.5:3';
    ratio.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(80);
    ok('grade note follows ratio (C25 high strength)', /High strength/i.test(d.getElementById('concrete-grade-note').textContent));
    ok('no errors in grade presets', errs.length === 0, errs.join(' | '));
  }
  {
    const { dom, errs } = await boot();
    const d = dom.window.document;
    d.querySelector('.bn-item[data-goto="steel"]').click();
    await tick(150);
    const elSel = d.getElementById('steel-element-selector');
    elSel.value = 'brc';
    elSel.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(80);
    ok('brc inputs shown', !d.getElementById('steel-brc-inputs').classList.contains('hidden'));
    ok('brc hides the per-kg cost card', d.getElementById('steel-cost-card').classList.contains('hidden'));
    ok('brc keeps member quantity row', !d.getElementById('steel-member-qty-row').classList.contains('hidden'));
    d.getElementById('brc-area-len').value = '20';
    d.getElementById('brc-area-wid').value = '10';
    d.getElementById('mobile-calculate').click();
    await tick(300);
    const t = d.getElementById('steel-result').textContent;
    ok('brc: 200 m² +10% over 40 m² rolls -> 6 rolls', /6 Rolls/.test(t) && /200\.0 m²/.test(t), t.replace(/\s+/g, ' ').slice(0, 120));
    ok('brc: no cost entered says so', /Cost not entered/.test(t));
    const mode = d.getElementById('brc-mode');
    mode.value = 'sheet';
    mode.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(50);
    ok('sheet mode fills 4.8 x 2.4 m defaults', d.getElementById('brc-width').value === '4.8' && d.getElementById('brc-length').value === '2.4');
    d.getElementById('mobile-calculate').click();
    await tick(300);
    ok('brc sheets: 220/11.52 -> 20 sheets', /20 Sheets/.test(d.getElementById('steel-result').textContent),
       d.getElementById('steel-result').textContent.replace(/\s+/g, ' ').slice(0, 120));
    ok('no errors in brc', errs.length === 0, errs.join(' | '));
  }
  {
    const { dom, errs } = await boot();
    const d = dom.window.document;
    d.querySelector('.bn-item[data-goto="blocks"]').click();
    await tick(150);
    const vol = d.querySelector('input[name="block-mode"][value="volume"]');
    vol.checked = true;
    vol.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(80);
    d.getElementById('block-wall-volume').value = '6';
    const bt = d.getElementById('block-type');
    bt.value = 'thermo_20';
    bt.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(50);
    const jt = d.getElementById('block-joint-type');
    jt.value = 'glue';
    jt.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(50);
    ok('glue auto-sets 3 mm joint', d.getElementById('block-mortar-thickness').value === '3');
    ok('glue fields shown, mortar fields hidden', !d.getElementById('block-glue-fields').classList.contains('hidden') &&
       d.getElementById('block-mortar-fields').classList.contains('hidden'));
    d.getElementById('mobile-calculate').click();
    await tick(300);
    const t = d.getElementById('blocks-result').textContent;
    ok('glue: 30 m² x 4 kg x 5% waste -> 126.0 kg -> 6 bags of 25 kg', /126\.0 kg/.test(t) && /6 bags/.test(t), t.replace(/\s+/g, ' ').slice(0, 140));
    ok('glue: no mortar volume rows', !/Mortar Volume/.test(t));
    ok('no errors in glue mode', errs.length === 0, errs.join(' | '));
  }
  {
    const { dom, errs } = await boot();
    const d = dom.window.document;
    d.querySelector('.bn-item[data-goto="earthwork"]').click();
    await tick(150);
    const v = d.getElementById('land-area-value');
    v.value = '2';
    d.getElementById('land-area-unit').value = 'dunum';
    v.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    await tick(80);
    ok('converter: 2 dunum = 5000 m²', d.getElementById('land-out-m2').value === '5000');
    ok('converter: 2 dunum = 50 olak', d.getElementById('land-out-olak').value === '50');
    ok('converter: 2 dunum = 2 dunum', d.getElementById('land-out-dunum').value === '2');
    v.value = '100';
    d.getElementById('land-area-unit').value = 'olak';
    v.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    await tick(50);
    ok('converter: 100 olak = 10000 m² = 4 dunum', d.getElementById('land-out-m2').value === '10000' &&
       d.getElementById('land-out-dunum').value === '4');
    // switching the unit with only a change event (no input) must recalculate too
    d.getElementById('land-area-unit').value = 'dunum';
    d.getElementById('land-area-unit').dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(50);
    ok('converter: change on unit select recalculates', d.getElementById('land-out-m2').value === '250000');
    d.getElementById('land-area-unit').dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    await tick(50);
    ok('converter: input on unit select recalculates', d.getElementById('land-out-olak').value === '2500');
    ok('no errors in converter', errs.length === 0, errs.join(' | '));
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
    d.querySelector('#bricks-result .quote-btn').click();
    await tick(150);
    const ov = d.getElementById('quote-overlay');
    ok('quote overlay opens', !ov.classList.contains('hidden'));
    ok('quote lists items with quantities', ov.querySelectorAll('#quote-items tr').length >= 2 &&
       /1,483|1483/.test(ov.querySelector('#quote-items').textContent));
    ok('quote has signature lines', /Contractor signature/.test(ov.textContent) && /Client signature/.test(ov.textContent));
    // type an agreed unit price -> amount and total compute
    const price0 = ov.querySelector('#quote-items tr input');
    price0.value = '100';
    price0.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    await tick(80);
    ok('quote computes amount from unit price', /148300\.00|148,300\.00/.test(ov.textContent), ov.querySelector('.quote-amount')?.textContent);
    ok('quote grand total updates', (d.getElementById('quote-total').textContent || '').length > 0);
    // meta remembered
    d.getElementById('quote-project').value = 'Test Villa';
    d.getElementById('quote-project').dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    d.getElementById('quote-client').value = 'Mr. Ahmed';
    d.getElementById('quote-client').dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    await tick(50);
    const meta = JSON.parse(dom.window.localStorage.getItem('estimatorQuoteMeta') || '{}');
    ok('quote meta remembered', meta.project === 'Test Villa' && meta.client === 'Mr. Ahmed');
    // WhatsApp: pre-filled itemized message
    const opened = [];
    dom.window.open = (url) => { opened.push(url); return null; };
    d.getElementById('quote-whatsapp-btn').click();
    await tick(150);
    ok('whatsapp button sits beside print', !!d.getElementById('quote-whatsapp-btn') && !!d.getElementById('quote-print-btn'));
    ok('whatsapp opens wa.me with encoded text', opened.length === 1 && /wa\.me\/\?text=/.test(opened[0] || ''), String(opened[0] || '').slice(0, 60));
    const msg = decodeURIComponent((opened[0] || '').split('text=')[1] || '');
    ok('whatsapp message has the itemized bill', /1483|1,483/.test(msg) && /Material Quote/.test(msg) && /148300\.00/.test(msg),
       msg.replace(/\n/g, ' | ').slice(0, 140));
    ok('whatsapp message has names and total', /Test Villa/.test(msg) && /Mr\. Ahmed/.test(msg) && /Grand total/.test(msg));
    ok('whatsapp button flashes confirmation', /copied/i.test(d.getElementById('quote-whatsapp-btn').textContent));
    d.getElementById('quote-close-btn').click();
    await tick(50);
    ok('quote closes', ov.classList.contains('hidden'));
    ok('no errors in quote flow', errs.length === 0, errs.join(' | '));
  }

  console.log('\n=== D9. Kurdish terminology + bidi isolation ===');
  {
    const { dom, errs } = await boot(390, 844, 'ks');
    const d = dom.window.document;
    const hint1 = d.querySelector('[data-lang="hintMixRatio"]');
    ok('ks hintMixRatio wraps ratio 1:6 in <bdi dir="ltr">', /<bdi dir="ltr">1:6<\/bdi>/.test(hint1.innerHTML), hint1.innerHTML.slice(0, 110));
    const hint2 = d.querySelector('[data-lang="hintStirrupDiameter"]');
    ok('ks hintStirrupDiameter wraps Ø8 in <bdi dir="ltr">', /<bdi dir="ltr">Ø8<\/bdi>/.test(hint2.innerHTML));
    ok('reset buttons keep their icons after relabel', !!d.querySelector('button.reset-btn svg.lucide, button.reset-btn i[data-lucide]'));
    // concrete: ratio wrap + Sorani terms (wet volume, ordered, strength->بەرگری)
    d.querySelector('.bn-item[data-goto="concrete"]').click();
    await tick(150);
    const dims = d.querySelector('input[name="concrete-mode"][value="dims"]');
    dims.checked = true;
    dims.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(30);
    d.getElementById('concrete-type').value = 'slab';
    d.getElementById('concrete-type').dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(30);
    d.getElementById('concrete-length').value = '5';
    d.getElementById('concrete-width').value = '4';
    d.getElementById('concrete-thickness').value = '0.2';
    d.getElementById('concrete-quantity').value = '2';
    d.getElementById('mobile-calculate').click();
    await tick(300);
    const t = d.getElementById('concrete-result');
    ok('ks concrete trail wraps ratio in bdi', /<bdi dir="ltr">1:2:4<\/bdi>/.test(t.innerHTML), '');
    ok('ks wet volume is قەبارەی تەڕ', /قەبارەی تەڕ/.test(t.textContent) && !/قەبارەی چرکە/.test(t.textContent));
    ok('ks ordered word is dawakraw', /\u062f\u0627\u0648\u0627\u06a9\u0631\u0627\u0648/.test(t.textContent) && !/\u0633\u06d5\u06b5\u0627\u0645\u06d5/.test(t.textContent));
    ok('ks strength word is بەرگری', /بەرگری/.test(t.textContent) && !/ستڕێنگ/.test(t.textContent));
    // steel: Ø labels wrapped
    d.querySelector('.bn-item[data-goto="steel"]').click();
    await tick(150);
    const elSel = d.getElementById('steel-element-selector');
    elSel.value = 'footing';
    elSel.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await tick(50);
    d.getElementById('footing-length').value = '3';
    d.getElementById('footing-width').value = '2';
    d.getElementById('footing-spacing-len').value = '150';
    d.getElementById('footing-diameter-len').value = '12';
    d.getElementById('footing-spacing-wid').value = '150';
    d.getElementById('footing-diameter-wid').value = '10';
    d.getElementById('mobile-calculate').click();
    await tick(300);
    ok('ks steel order wraps Ø12 in bdi', /<bdi dir="ltr">Ø12 mm<\/bdi>/.test(d.getElementById('steel-result').innerHTML));
    ok('ks steel schedule wraps diameters in bdi', /<bdi dir="ltr">Ø10 mm<\/bdi>/.test(d.getElementById('steel-result').innerHTML));
    // earthwork: gross volume term
    d.querySelector('.bn-item[data-goto="earthwork"]').click();
    await tick(150);
    d.getElementById('earthwork-length').value = '4';
    d.getElementById('earthwork-width').value = '3';
    d.getElementById('earthwork-height').value = '2';
    d.getElementById('mobile-calculate').click();
    await tick(300);
    ok('ks gross volume is قەبارەی سەرجەم', /قەبارەی سەرجەم/.test(d.getElementById('earthwork-result').textContent));
    ok('no errors in ks pass', errs.length === 0, errs.join(' | '));
  }
  {
    const { dom, errs } = await boot(390, 844, 'ku');
    const d = dom.window.document;
    d.querySelector('.bn-item[data-goto="earthwork"]').click();
    await tick(150);
    d.getElementById('earthwork-length').value = '4';
    d.getElementById('earthwork-width').value = '3';
    d.getElementById('earthwork-height').value = '2';
    d.getElementById('mobile-calculate').click();
    await tick(300);
    ok('ku gross volume is قەبارێ گشتی', /قەبارێ گشتی/.test(d.getElementById('earthwork-result').textContent) &&
       !/قەبارێ کورد/.test(d.getElementById('earthwork-result').textContent));
    ok('no errors in ku pass', errs.length === 0, errs.join(' | '));
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
