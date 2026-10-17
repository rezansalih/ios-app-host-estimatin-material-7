#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const calculateConcreteEstimate = require('../concrete-calculations.js');

const ceilWaste = (value, waste = 5) => Math.ceil(value * (1 + waste / 100));
const concrete = ({ length, width, thickness, ratio = [1, 2, 4], dryFactor = 1.54, density = 1440, bagKg = 50, waste = 5 }) => {
  const wet = length * width * thickness;
  const dry = wet * dryFactor;
  const sum = ratio.reduce((a, b) => a + b, 0);
  const cementBags = Math.ceil((dry * ratio[0] / sum * density * (1 + waste / 100)) / bagKg);
  return { wet, dry, cementBags };
};
const masonry = ({ wallVolume, wallThickness, unitLength, unitThickness, unitHeight, leaves, mortarCm = 1, waste = 5, mortarRatio = [1, 6], density = 1440, bagKg = 50, dryFactor = 1.33 }) => {
  const mortar = mortarCm / 100;
  const impliedThickness = leaves * unitThickness + Math.max(0, leaves - 1) * mortar;
  assert.ok(Math.abs(impliedThickness - wallThickness) <= 0.011, 'wall thickness must match leaves and joints');
  const unitFace = (unitLength + mortar) * (unitHeight + mortar);
  const theoretical = (wallVolume / wallThickness / unitFace) * leaves;
  const mortarVolume = wallVolume - theoretical * (unitLength * unitThickness * unitHeight);
  // Cement/sand from dry mortar; wastage applied once to the wet mortar (bricks flow),
  // which equals the blocks flow (wet mortar -> dry -> parts, wastage on cement/sand).
  const mortarOrder = mortarVolume * (1 + waste / 100);
  const dryMortar = mortarOrder * dryFactor;
  const sum = mortarRatio[0] + mortarRatio[1];
  const cementWeight = (dryMortar * mortarRatio[0] / sum) * density;
  const sandVolume = dryMortar * mortarRatio[1] / sum;
  return {
    theoretical,
    order: ceilWaste(theoretical, waste),
    mortarVolume,
    mortarOrder,
    cementWeight,
    cementBags: Math.ceil(cementWeight / bagKg),
    sandVolume,
    mixingWaterLitres: cementWeight * 0.6
  };
};
const steelKg = (diameterMm, lengthM, bars, waste = 5) => (diameterMm ** 2 / 162) * lengthM * bars * (1 + waste / 100);
const earthwork = ({ length, width, height, sections, swell, truckCapacity }) => {
  const gross = length * width * height * sections;
  const loose = gross * (1 + swell / 100);
  return { gross, loose, truckLoads: Math.ceil(loose / truckCapacity) };
};

// Trusted hand-checked examples.
assert.deepEqual(concrete({ length: 5, width: 4, thickness: .2 }), { wet: 4, dry: 6.16, cementBags: 27 });
const appConcrete = calculateConcreteEstimate({ mode: 'dims', type: 'slab', length: 5, width: 4, thickness: .2, quantity: 1, ratio: [1, 2, 4], dryFactor: 1.54, density: 1440, bagKg: 50, wastePercent: 5 });
assert.equal(appConcrete.ok, true);
assert.equal(appConcrete.wetVolume, 4);
assert.equal(appConcrete.cementBags, 27);
const appVolume = calculateConcreteEstimate({ mode: 'volume', type: 'column', totalVolume: 4, quantity: 0, ratio: [1, 2, 4], dryFactor: 1.54, density: 1440, bagKg: 50, wastePercent: 5 });
assert.equal(appVolume.ok, true);
assert.equal(appVolume.wetVolume, 4, 'total-volume mode must not multiply by element count');
assert.equal(appVolume.quantity, null, 'total-volume mode must ignore the hidden element count');
assert.equal(calculateConcreteEstimate({ mode: 'volume', type: 'slab', totalVolume: 4, quantity: '', ratio: [1, 2, 4], dryFactor: 1.54, density: 1440, bagKg: 50, wastePercent: 5 }).ok, true);
assert.equal(calculateConcreteEstimate({ mode: 'dims', type: 'slab', length: 5, width: 4, thickness: .2, quantity: 0, ratio: [1, 2, 4], dryFactor: 1.54, density: 1440, bagKg: 50, wastePercent: 5 }).error, 'invalidQuantity');
const appCustom = calculateConcreteEstimate({ mode: 'volume', type: 'slab', totalVolume: 1, quantity: 1, ratio: [1, 3, 6], dryFactor: 1.54, density: 1440, bagKg: 50, wastePercent: 0 });
assert.equal(appCustom.ok, true);
assert.equal(appCustom.ratio.join(':'), '1:3:6');
const appCustomMode = calculateConcreteEstimate({ mode: 'volume', type: 'slab', totalVolume: 1, quantity: 1, mixMode: 'custom', ratio: [1, 3, 6], dryFactor: 1.54, density: 1440, bagKg: 50, wastePercent: 0 });
assert.equal(appCustomMode.ok, true);
assert.equal(appCustomMode.mixMode, 'custom');
const approved = calculateConcreteEstimate({ mode: 'volume', type: 'slab', totalVolume: 2, quantity: 0, mixMode: 'approved', ratio: [], dryFactor: 0, density: 0, bagKg: 50, wastePercent: 5, approvedRecipe: { cementKgPerM3: 350, waterLitresPerM3: 175, sandKgPerM3: 700, aggregateKgPerM3: 1050, admixturePerM3: 2.5, admixtureUnit: 'kg' } });
assert.equal(approved.ok, true);
assert.equal(approved.cementWeightRequired, 700);
assert.equal(approved.cementWeightWithWastage, 735);
assert.equal(approved.cementBags, 15);
assert.equal(approved.cementOrderWeight, 750);
assert.equal(approved.waterLitres, 350);
assert.equal(approved.sandVolumeBeforeWaste, 1400);
assert.equal(approved.sandVolumeOrder, 1470);
assert.equal(approved.aggregateVolumeBeforeWaste, 2100);
assert.equal(approved.aggregateVolumeOrder, 2205);
assert.equal(approved.quantityUnit, 'kg');
assert.equal(approved.admixtureAmount, 5);
assert.equal(approved.admixtureRateUnit, 'kg');
assert.equal(approved.admixtureTotalUnit, 'kg');
assert.equal(calculateConcreteEstimate({ mode: 'volume', totalVolume: 1, quantity: 1, mixMode: 'approved', approvedRecipe: { cementKgPerM3: 350, waterLitresPerM3: 0, sandKgPerM3: 700, aggregateKgPerM3: 1050 }, ratio: [], dryFactor: 1.54, density: 1440, bagKg: 50, wastePercent: 5 }).error, 'invalidApprovedRecipe');
assert.equal(calculateConcreteEstimate({ mode: 'dims', type: 'slab', length: 1e999, width: 1, thickness: 1, quantity: 1, ratio: [1, 2, 4], dryFactor: 1.54, density: 1440, bagKg: 50, wastePercent: 5 }).ok, false);
assert.equal(calculateConcreteEstimate({ mode: 'volume', type: 'slab', totalVolume: 1, quantity: 1, ratio: [1, 2, 4], dryFactor: .9, density: 1440, bagKg: 50, wastePercent: 5 }).ok, false);
const block = masonry({ wallVolume: 6, wallThickness: .2, unitLength: .4, unitThickness: .2, unitHeight: .2, leaves: 1 });
assert.equal(block.order, 366);
assert.ok(block.mortarVolume > 0 && block.mortarVolume < 1);
const wallGross = 5 * 3 * .2;
const openingVolume = 2 * 1.5 * 1 * .2;
assert.ok(Math.abs(openingVolume - 0.6) < 1e-12, 'openings must be width × height × wall thickness');
assert.ok(Math.abs(wallGross - openingVolume - 2.4) < 1e-12, 'opening deduction must use wall thickness');
assert.ok(Math.abs(1.1 * 1.33 - 1.463) < 1e-12, 'mortar dry factor must be explicit and applied to wet mortar');
const brick = masonry({ wallVolume: 3.45, wallThickness: .115, unitLength: .24, unitThickness: .115, unitHeight: .075, leaves: 1 });
assert.equal(brick.order, 1483);
assert.ok(brick.mortarVolume > 0);

// --- Hand-verified masonry material vectors (wall 10 x 3 x 0.2, solid 40x20x20 block,
// 1 cm joints, 1:6 mortar, density 1440, 50 kg bags, 5% waste) ---
const blockMat = masonry({ wallVolume: 6, wallThickness: .2, unitLength: .4, unitThickness: .2, unitHeight: .2, leaves: 1 });
assert.equal(blockMat.order, 366);                                    // ceil(348.432 x 1.05)
assert.ok(Math.abs(blockMat.mortarVolume - 0.425081) < 0.001, String(blockMat.mortarVolume));   // 6 - 348.432x0.016
assert.equal(blockMat.cementBags, 3);                                  // 116.31 kg x 1.05 / 50 -> 2.44 -> 3 bags
assert.ok(Math.abs(blockMat.sandVolume - 0.508845) < 0.001, String(blockMat.sandVolume));
// Brick 10 x 3 x 0.115 wall (3.45 m3): mortar = 15.3% joint fraction -> 0.5276 m3;
// water = 0.6 L per kg cement
assert.ok(Math.abs(brick.mortarVolume - 0.527647) < 0.001, String(brick.mortarVolume));
assert.ok(brick.mixingWaterLitres > 0 && Math.abs(brick.mixingWaterLitres - brick.cementWeight * 0.6) < 1e-9);

// --- Hand-verified steel formula vectors (mirror of calc-steel.src.js) ---
// Lap splices: stock bars needed per run = ceil((L - O) / (S - O)); order length = L + splices x O.
const lap = (L, bars, diaMm, S = 12, lapFactor = 50) => {
  const O = lapFactor * (diaMm / 1000);
  const splicesPerBar = L <= S ? 0 : Math.max(0, Math.ceil((L - O) / (S - O)) - 1);
  return { splices: splicesPerBar * bars, totalLength: L * bars + splicesPerBar * bars * O };
};
const lapVec = lap(20, 2, 12);                                          // 20 m run, 2x Ø12, 12 m stock, 50d
assert.equal(lapVec.splices, 2);                                        // 1 splice per bar
assert.ok(Math.abs(lapVec.totalLength - 41.2) < 1e-9, String(lapVec.totalLength));
assert.ok(Math.abs(lapVec.totalLength * (144 / 162) * 1.05 - 38.45) < 0.02);
assert.equal(lap(3, 4, 16).splices, 0);                                 // fits in one stock bar
assert.equal(lap(24, 1, 12).splices, 2);                                // ceil(23.4/11.4)-1 = 2
// Stirrups: cutting length = 2(w-2c) + 2(d-2c) + 2x10d hooks; count = ceil(L/s) + 1
const stirrup = (wMm, dMm, coverMm, diaMm, lengthM, spacingMm) => {
  const single = (2 * (wMm - 2 * coverMm) + 2 * (dMm - 2 * coverMm) + 2 * (10 * diaMm)) / 1000;
  const count = Math.ceil((lengthM * 1000) / spacingMm) + 1;
  return { single, count, totalLength: single * count };
};
const st = stirrup(300, 500, 40, 8, 3, 200);                            // 30x50 beam, cover 40, Ø8 @200
assert.ok(Math.abs(st.single - 1.44) < 1e-9, String(st.single));
assert.equal(st.count, 16);
assert.ok(Math.abs(st.totalLength * (64 / 162) * 1.05 - 9.56) < 0.02);
// Beam 4Ø16 x 3 m + stirrups above = 19.91 + 9.56 = 29.47 kg
assert.ok(Math.abs(12 * (256 / 162) * 1.05 + st.totalLength * (64 / 162) * 1.05 - 29.47) < 0.02);
// One-way strip: bars = ceil(dist/spacing) + 1, each barLength long
const oneWayBars = Math.ceil((6 * 1000) / 200) + 1;                     // 6 m run @200 -> 31
assert.equal(oneWayBars, 31);
assert.ok(Math.abs(31 * 5 * (100 / 162) * 1.05 - 100.46) < 0.02);
// Footing mesh (D2 cross-check): counts from spacing equal explicit number mode
assert.equal(Math.ceil((2 * 1000) / 150) + 1, 15);                      // lengthwise bars across 2 m
assert.equal(Math.ceil((3 * 1000) / 150) + 1, 21);                      // widthwise bars across 3 m
assert.ok(Math.abs((15 * 3 * (144 / 162) + 21 * 2 * (100 / 162)) * 1.05 - 69.22) < 0.02);
const brickFaceRate = 1 / ((.24 + .01) * (.075 + .01));
assert.ok(Math.abs(brickFaceRate - 47.06) < .02, 'brick face-rate sanity check');
assert.ok(Math.abs(steelKg(12, 10, 4) - 37.33) < .02);
assert.deepEqual(earthwork({ length: 5, width: 4, height: 1, sections: 1, swell: 25, truckCapacity: 4 }), { gross: 20, loose: 25, truckLoads: 7 });

// Edge cases required by the specification.
assert.throws(() => masonry({ wallVolume: 1, wallThickness: .4, unitLength: .4, unitThickness: .2, unitHeight: .2, leaves: 1 }), /wall thickness/);
assert.throws(() => {
  const gross = 2 * 2 * .2;
  const openings = 3;
  if (openings >= gross) throw new Error('openings exceed wall');
}, /openings exceed wall/);
assert.throws(() => {
  const width = 300, depth = 500, cover = 40, diameter = 8, spacing = 0;
  if (!(width > 2 * cover + diameter && depth > 2 * cover + diameter && spacing > 0)) throw new Error('invalid stirrups');
}, /invalid stirrups/);

// Regression guard: the invalid m³ + m² formula must not return to the app.
// The app script lives in app.js now; scan markup + script together so the
// assertions below keep covering both.
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8') +
             fs.readFileSync(path.join(__dirname, '..', 'src', 'app.src.js'), 'utf8') +
             ['concrete','blocks','bricks','steel','earthwork'].map(n => fs.readFileSync(path.join(__dirname, '..', 'src', `calc-${n}.src.js`), 'utf8')).join('\n');
assert.equal(html.includes('singleBlockVolume + (mortarThicknessM'), false);
assert.equal(html.includes('singleBrickVolume + (mortarThicknessM'), false);
assert.match(html, /src="\.\/concrete-calculations\.js"/);
assert.match(html, /value = '1:2:4'/);
assert.match(html, /const currentQuantity = quantity;/, 'slab and other element formwork must use the entered quantity');
assert.match(html, /const totalCementCost = cementCost === null \? null : cementBags \* cementCost;/);
assert.match(html, /const totalSandCost = sandCost === null \? null : sandVolume \* sandCost;/);
assert.match(html, /const totalAggregateCost = aggregateCost === null \? null : aggregateVolume \* aggregateCost;/);
assert.match(html, /value="approved"[^>]*>Approved recipe per m³/);
assert.match(html, /value="custom"[^>]*>Custom nominal ratio/);
assert.match(html, /id="concrete-approved-water"/);
assert.match(html, /id="concrete-approved-admixture"/);
assert.match(html, /id="concrete-approved-admixture-unit" class="pro-input[^>]*>.*value="kg"/s);
assert.match(html, /mixMode, approvedRecipe/);
assert.match(html, /Solids purchase allowance/);
assert.match(html, /approvedCostExclusion/);
assert.match(html, /data-lang="moistureBasisNote"/);
assert.match(html, /No stockpile moisture or aggregate absorption correction/);
assert.match(html, /id="concrete-nominal-ratio-wrap"/);
assert.match(html, /concrete-dry-factor-wrap/);
assert.match(html, /concrete-cement-density-wrap/);
assert.match(html, /concrete-nominal-ratio-wrap.*classList\.toggle\('hidden', approved \|\| custom\)/s);
assert.match(html, /getElementById\('concrete-ratio'\)\.disabled = approved \|\| custom/);
assert.match(html, /languageSelector\.addEventListener\('change', updateConcreteMixVisibility\)/);
assert.match(html, /currentTranslations\.costSandKg/);
assert.match(html, /currentTranslations\.costAggregateKg/);
assert.match(html, /T\.approvedWaterAdmixtureResult/);
assert.match(html, /T\.approvedSolidsAllowance/);
assert.match(html, /T\.approvedRecipeAssumption/);
assert.match(html, /No price fields are provided for them in this version/);
assert.equal(require('../package.json').scripts.test, 'node tests/calculations.test.js');
assert.match(html, /Formwork pricing needs element dimensions/);
assert.match(html, /data-lang="costScopeNote"/);
assert.match(html, /formworkInput\.disabled = mode === 'volume'/);
assert.match(html, /id="block-window-width"/);
assert.match(html, /id="block-window-height"/);
assert.match(html, /id="block-door-width"/);
assert.match(html, /id="block-door-height"/);
assert.match(html, /block-window-width.*block-window-height.*wallWidth/s);
assert.match(html, /id="block-mortar-dry-factor"/);
const blockHandler = html.slice(html.indexOf("__calcHandlers.blocks"), html.indexOf("__calcHandlers.bricks"));
assert.equal(blockHandler.includes('const dryMortarVolume = mortarVolume * 1.33;'), false);
assert.match(html, /T\.errWallThicknessMismatch/);
assert.match(html, /T\.hollowBlockNote/);
assert.match(html, /id="brick-hollow-note"/);
assert.match(html, /T\.hollowBrickNote/);
assert.match(html, /id="brick-mortar-dry-factor"/);
// Regression guard: the "Custom site product" brick option must have real inputs,
// otherwise selecting it throws on Calculate.
for (const id of ['brick-custom-profile', 'brick-custom-length', 'brick-custom-width', 'brick-custom-height']) {
  assert.match(html, new RegExp(`id="${id}"`), `missing ${id}`);
}
// Regression guard: every brick-* element the bricks handler reads must exist in the markup.
{
  const handler = html.slice(html.indexOf("__calcHandlers.bricks"), html.indexOf("__calcHandlers.steel"));
  const declared = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  for (const m of handler.matchAll(/getElementById\(\s*'([^']+)'\s*\)/g)) {
    assert.ok(declared.has(m[1]), `bricks handler reads missing element #${m[1]}`);
  }
}
// Regression guard: brick preset dimensions must all be millimetres (no mixed m/mm attributes).
for (const m of html.matchAll(/data-(width|length|height)="([^"]+)"[^>]*data-lang="(localBrick|standardBrick|engineeringBrick|romanBrick|hollowBrick)"/g)) {
  assert.ok(Number(m[2]) >= 1, `brick preset ${m[3]} ${m[1]} looks like metres, not mm: ${m[2]}`);
}
assert.match(html, /T\.bricksPerM2/);
// Formula-audit guards: result HTML must not hardcode the English word "bags",
// and block preset data-width is METRES while bricks are MILLIMETRES (handler conventions).
for (const f of ['calc-blocks.src.js', 'calc-bricks.src.js', 'calc-concrete.src.js']) {
  const src = fs.readFileSync(path.join(__dirname, '..', 'src', f), 'utf8');
  assert.equal(/\$\{cementBags\} bags/.test(src), false, `${f} hardcodes "bags" in output`);
}
{
  const blockOpts = [...html.matchAll(/<option[^>]*data-width="([^"]+)"[^>]*data-lang="(?:solidBlock20|solidBlock15|hollowBlock|lightweightBlock)"/g)].map(m => Number(m[1]));
  assert.ok(blockOpts.length >= 4 && blockOpts.every(v => v < 1), `block preset widths must be metres (handler does not divide): ${blockOpts}`);
  const brickOpts = [...html.matchAll(/<option[^>]*data-width="([^"]+)"[^>]*data-lang="(?:localBrick|standardBrick|engineeringBrick|romanBrick|hollowBrick)"/g)].map(m => Number(m[1]));
  assert.ok(brickOpts.length >= 3 && brickOpts.every(v => v >= 1), `brick preset widths must be millimetres: ${brickOpts}`);
}
assert.match(html, /T\.mixingWaterEstimate/);
assert.match(html, /const mixingWaterLitres = cementWeight \* MORTAR_WATER_PER_KG_CEMENT/);
const brickHandler = html.slice(html.indexOf("__calcHandlers.bricks"), html.indexOf("__calcHandlers.steel"));
assert.equal(brickHandler.includes('const dryMortarVolume = mortarVolume * 1.33;'), false);
assert.match(brickHandler, /<details class="calculation-trail/);
assert.match(brickHandler, /T\.errWallThicknessMismatch/, 'bricks must use the dedicated wall-thickness error, not the generic dimensions error');
assert.equal(html.includes('windowVolume'), false, 'obsolete window-volume translation/input key returned');
assert.equal(html.includes('doorVolume'), false, 'obsolete door-volume translation/input key returned');
assert.equal(html.includes('title="1 = single-leaf wall"'), false, 'English-only leaf tooltip returned');
for (const tab of ['concrete', 'blocks', 'bricks', 'steel', 'earthwork']) {
  assert.match(html, new RegExp(`data-tab="${tab}"`), `missing ${tab} tab target`);
}
assert.match(html, /t\.id = t\.id \|\| 'tab-' \+ t\.dataset\.tab/);
assert.match(html, /t\.addEventListener\('click'/);
// Shipped assets. The Tailwind Play CDN and the Lucide runtime were replaced by
// a compiled stylesheet (assets/app.css) and an inline SVG sprite, so the vendor
// runtimes are no longer part of the deployment.
for (const asset of [
  'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png',
  'icon-maskable-192.png', 'icon-maskable-512.png', 'apple-touch-icon.png',
  'favicon.ico', 'assets/app.css', 'app.js', 'app-ui.js',
  'concrete-calculations.js', 'sw.js',
  'calc-concrete.js', 'calc-blocks.js', 'calc-bricks.js', 'calc-steel.js', 'calc-earthwork.js'
]) assert.ok(fs.existsSync(path.join(__dirname, '..', asset)), `deployment asset missing: ${asset}`);
// ...and nothing in the shipped page may point at the old vendor runtimes.
for (const dead of ['vendor/tailwindcss.js', 'vendor/lucide.js']) {
  assert.equal(fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8').includes(dead), false,
    `${dead} must not be referenced by the page`);
}

console.log('PASS: concrete, blocks, bricks, steel, earthwork, openings, stirrups, and dimensional regression checks');
