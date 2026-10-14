#!/usr/bin/env node
'use strict';
// Runs the REAL page in jsdom and exercises the Bricks tab end-to-end.
const fs = require('node:fs');
const path = require('path');
let JSDOM, VirtualConsole;
try { ({ JSDOM, VirtualConsole } = require('jsdom')); }
catch { console.log('jsdom not installed - run `npm install` to enable the live browser checks.'); process.exit(0); }

const root = path.join(__dirname, '..');
const pageURL = process.env.ESTIMATOR_URL || 'http://localhost:8000/index.html';
const tick = ms => new Promise(r => setTimeout(r, ms));

async function boot() {
  const vc = new VirtualConsole();
  const errors = [];
  vc.on('jsdomError', e => errors.push(String(e.message).split('\n')[0]));
  const dom = await JSDOM.fromURL(pageURL, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(win) {
      win.matchMedia = q => ({ matches: false, media: q, addListener() {}, removeListener() {},
        addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false });
      win.scrollTo = () => {};
      win.Element.prototype.scrollIntoView = () => {};
    },
  });
  await tick(700); // let external scripts and DOMContentLoaded finish
  return { dom, errors };
}

const setVal = (doc, id, v) => {
  const el = doc.getElementById(id);
  if (!el) throw new Error('missing input #' + id);
  el.value = String(v);
};

function fillBrickWall({ dom }, o) {
  const doc = dom.window.document;
  const win = dom.window;
  win.localStorage.setItem('language', 'en');
  if (o.waste !== undefined) setVal(doc, 'wastage', o.waste);
  setVal(doc, 'brick-wall-length', o.len);
  setVal(doc, 'brick-wall-height', o.hgt);
  setVal(doc, 'brick-wall-width-input', o.thick);
  setVal(doc, 'brick-leaves', o.leaves ?? 1);
  setVal(doc, 'brick-mortar-thickness', o.mortarCm ?? 1.0);
  if (o.ratio) setVal(doc, 'brick-mortar-ratio', o.ratio);
  const sel = doc.getElementById('brick-type');
  sel.value = o.type;
  sel.dispatchEvent(new win.Event('change', { bubbles: true }));
  if (o.prices) {
    setVal(doc, 'brick-cost', o.prices.brick ?? 0);
    setVal(doc, 'brick-cement-cost', o.prices.cement ?? 0);
    setVal(doc, 'brick-sand-cost', o.prices.sand ?? 0);
  }
}

async function click({ dom, errors }) {
  const doc = dom.window.document;
  const before = errors.length;
  let thrown = null;
  try { doc.getElementById('calculate-bricks').click(); } catch (e) { thrown = e; }
  await tick(500); // lazy calc-bricks chunk loads on first Calculate (prefetched on tab open in a browser)
  const res = doc.getElementById('bricks-result');
  return {
    thrown,
    errors: errors.slice(before),
    shown: !res.classList.contains('hidden'),
    text: res.textContent.replace(/\s+/g, ' ').trim(),
    errMsg: doc.getElementById('error-message').textContent.trim(),
    errShown: !doc.getElementById('error-box').classList.contains('hidden'),
  };
}

const show = (label, r) => {
  console.log('\n' + label);
  if (r.thrown) console.log('   !! THROWS:', r.thrown.message);
  if (r.errors.length) console.log('   !! page errors:', r.errors);
  if (r.errShown) console.log('   error shown  :', r.errMsg);
  console.log('   result shown :', r.shown);
  if (r.shown) console.log('   result       :', r.text.replace('Calculation details', '\n                   Calculation details:').slice(0, 1200));
};

(async () => {
  let failures = 0;
  console.log('#'.repeat(78));
  console.log('# LIVE jsdom RUN - Bricks tab (real index.html)');
  console.log('#'.repeat(78));

  const cases = [
    ['[1] Local Iraqi brick, 10 x 3.0 m half-brick wall (0.115 m), 1 leaf, 5% waste, 1:3, 10 mm joint, prices 0.15 / 8 / 25',
      { type: 'local_iraqi', len: 10, hgt: 3, thick: 0.115, leaves: 1, waste: 5, ratio: '1:3', mortarCm: 1.0, prices: { brick: 0.15, cement: 8, sand: 25 } }],
    ['[2] Brick Type = "Custom site product" (offered in the dropdown)',
      { type: 'custom', len: 10, hgt: 3, thick: 0.115, leaves: 1, waste: 5, prices: { brick: 0.15 } }],
    ['[3] Two-leaf wall: 10 x 3 m, entered thickness 0.24 m, leaves = 2, 1:4',
      { type: 'local_iraqi', len: 10, hgt: 3, thick: 0.24, leaves: 2, waste: 5, ratio: '1:4', prices: { brick: 0.15, cement: 8, sand: 25 } }],
    ['[4] Edge case: mortar joint = 0 mm',
      { type: 'local_iraqi', len: 10, hgt: 3, thick: 0.115, leaves: 1, waste: 5, mortarCm: 0, prices: { brick: 0.15, cement: 8, sand: 25 } }],
    ['[5] Hollow brick (30x12x12) wall, thickness 0.12 m',
      { type: 'hollow_brick', len: 10, hgt: 3, thick: 0.12, leaves: 1, waste: 5, prices: { brick: 0.3, cement: 8, sand: 25 } }],
    ['[6] Volume mode: 3.45 m3 wall (block module counts — no thickness/leaves input)',
      { type: 'local_iraqi', len: 0, hgt: 0, thick: 0.115, leaves: 1, waste: 5, prices: { brick: 0.15 } , volume: true }],
  ];

  for (const [label, opts] of cases) {
    const env = await boot();
    const doc = env.dom.window.document;
    if (opts.volume) {
      doc.querySelector('input[name="brick-mode"][value="volume"]').checked = true;
      doc.querySelector('input[name="brick-mode"][value="volume"]').dispatchEvent(new env.dom.window.Event('change', { bubbles: true }));
      setVal(doc, 'brick-wall-volume', 3.45);
      setVal(doc, 'brick-mortar-thickness', 1.0);
      if (opts.prices) { setVal(doc, 'brick-cost', opts.prices.brick ?? 0); setVal(doc, 'brick-cement-cost', opts.prices.cement ?? 0); setVal(doc, 'brick-sand-cost', opts.prices.sand ?? 0); }
      setVal(doc, 'wastage', opts.waste);
    } else {
      fillBrickWall(env, opts);
    }
    const result = await click(env);
    show(label, result);
    if (opts.type !== 'custom' && !result.shown) failures++;
  }

  // [7] Custom brick size must give the same answer as the equivalent preset (unit-normalisation check).
  {
    const env = await boot();
    const doc = env.dom.window.document;
    fillBrickWall(env, { type: 'local_iraqi', len: 10, hgt: 3, thick: 0.115, leaves: 1, waste: 5, ratio: '1:3', prices: { brick: 0.15, cement: 8, sand: 25 } });
    const preset = (await click(env)).text;
    const env2 = await boot();
    fillBrickWall(env2, { type: 'custom', len: 10, hgt: 3, thick: 0.115, leaves: 1, waste: 5, ratio: '1:3', prices: { brick: 0.15, cement: 8, sand: 25 } });
    const d2 = env2.dom.window.document;
    const sel = d2.getElementById('brick-type');
    sel.value = 'custom'; sel.dispatchEvent(new env2.dom.window.Event('change', { bubbles: true }));
    d2.getElementById('brick-custom-length').value = '240';
    d2.getElementById('brick-custom-width').value = '115';
    d2.getElementById('brick-custom-height').value = '75';
    const customResult = await click(env2);
    show('[7] Custom brick 240 x 115 x 75 mm  (must equal the Local Iraqi preset)', customResult);
    console.log('   identical to preset output:', customResult.text === preset);
    if (!customResult.shown || customResult.text !== preset) failures++;
  }

  // [8] Openings: deducted row appears only when openings exist.
  {
    const env = await boot();
    const doc = env.dom.window.document;
    fillBrickWall(env, { type: 'local_iraqi', len: 5, hgt: 3, thick: 0.24, leaves: 2, waste: 5, prices: { brick: 0.15, cement: 8, sand: 25 } });
    setVal(doc, 'brick-num-windows', 2); setVal(doc, 'brick-window-width', 1.5); setVal(doc, 'brick-window-height', 1.5);
    setVal(doc, 'brick-num-doors', 1); setVal(doc, 'brick-door-width', 1.0); setVal(doc, 'brick-door-height', 2.1);
    const openingsResult = await click(env);
    show('[8] 5 x 3 m two-leaf wall, 2 windows 1.5x1.5 + 1 door 1.0x2.1', openingsResult);
    if (!openingsResult.shown) failures++;
    const env2 = await boot();
    fillBrickWall(env2, { type: 'local_iraqi', len: 5, hgt: 3, thick: 0.24, leaves: 2, waste: 5, prices: { brick: 0.15 } });
    const noOp = await click(env2);
    console.log('\n   with no openings, "Total Opening Volume" row hidden:', !noOp.text.includes('Total Opening Volume'));
  }

  console.log('\n' + '#'.repeat(78));
  console.log('# Custom-brick inputs present in the DOM?');
  console.log('#'.repeat(78));
  const env = await boot();
  const d = env.dom.window.document;
  for (const id of ['brick-custom-profile', 'brick-custom-length', 'brick-custom-width', 'brick-custom-height',
                    'block-custom-profile', 'block-custom-length']) {
    console.log(' ', d.getElementById(id) ? 'present' : 'MISSING', id);
  }
  if (failures) {
    console.error(`FAILURES: ${failures}`);
    process.exit(1);
  }
})();
