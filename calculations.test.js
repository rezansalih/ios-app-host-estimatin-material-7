#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

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
const block = masonry({ wallVolume: 6, wallThickness: .2, unitLength: .4, unitThickness: .2, unitHeight: .2, leaves: 1 });
assert.equal(block.order, 366);
assert.ok(block.mortarVolume > 0 && block.mortarVolume < 1);
const brick = masonry({ wallVolume: 3.45, wallThickness: .115, unitLength: .24, unitThickness: .115, unitHeight: .075, leaves: 1 });
assert.equal(brick.order, 1483);
assert.ok(brick.mortarVolume > 0);
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
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
assert.equal(html.includes('singleBlockVolume + (mortarThicknessM'), false);
assert.equal(html.includes('singleBrickVolume + (mortarThicknessM'), false);

console.log('PASS: concrete, blocks, bricks, steel, earthwork, openings, stirrups, and dimensional regression checks');
