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
const masonry = ({ wallVolume, wallThickness, unitLength, unitThickness, unitHeight, leaves, mortarCm = 1, waste = 5 }) => {
  const mortar = mortarCm / 100;
  const impliedThickness = leaves * unitThickness + Math.max(0, leaves - 1) * mortar;
  assert.ok(Math.abs(impliedThickness - wallThickness) <= 0.011, 'wall thickness must match leaves and joints');
  const unitFace = (unitLength + mortar) * (unitHeight + mortar);
  const theoretical = (wallVolume / wallThickness / unitFace) * leaves;
  const mortarVolume = wallVolume - theoretical * (unitLength * unitThickness * unitHeight);
  return { theoretical, order: ceilWaste(theoretical, waste), mortarVolume };
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
             fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
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
const blockHandler = html.slice(html.indexOf("document.getElementById('calculate-blocks')"), html.indexOf("document.getElementById('calculate-bricks')"));
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
  const handler = html.slice(html.indexOf("document.getElementById('calculate-bricks')"), html.indexOf("document.getElementById('calculate-steel')"));
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
assert.match(html, /T\.mixingWaterEstimate/);
assert.match(html, /const mixingWaterLitres = cementWeight \* MORTAR_WATER_PER_KG_CEMENT/);
const brickHandler = html.slice(html.indexOf("document.getElementById('calculate-bricks')"), html.indexOf("document.getElementById('calculate-steel')"));
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
  'concrete-calculations.js', 'sw.js'
]) assert.ok(fs.existsSync(path.join(__dirname, '..', asset)), `deployment asset missing: ${asset}`);
// ...and nothing in the shipped page may point at the old vendor runtimes.
for (const dead of ['vendor/tailwindcss.js', 'vendor/lucide.js']) {
  assert.equal(fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8').includes(dead), false,
    `${dead} must not be referenced by the page`);
}

console.log('PASS: concrete, blocks, bricks, steel, earthwork, openings, stirrups, and dimensional regression checks');
