#!/usr/bin/env node
'use strict';
// Independent numerical audit of the Bricks tab maths (mirrors the FIXED handler).
const f = (n, d = 3) => Number(n).toFixed(d);

function bricksCalc(o) {
  const { L, W, H, wallLen, wallH, wallT, wallVolume, volT, leaves = 1,
          mortarCm = 1, ratio = [1, 3], density = 1440, bagKg = 50, waste = 5,
          includeMortar = true, dryFactor = 1.33 } = o;
  const t = mortarCm / 100;
  const wallThicknessM = wallT ?? volT;
  const totalWallVolume = wallVolume ?? (wallLen * wallH * wallT);
  const unitFace = (L + t) * (H + t);
  const netArea = totalWallVolume / wallThicknessM;
  const unwasted = (netArea / unitFace) * leaves;
  const single = L * W * H;

  let net = 0, order = 0, cementBags = 0, sand = 0, cementW = 0;
  if (includeMortar) {
    net = Math.max(0, totalWallVolume - unwasted * single);
    order = net * (1 + waste / 100);
    if (order > 1e-6) {
      const dry = order * dryFactor, sum = ratio[0] + ratio[1];
      cementW = (dry * ratio[0] / sum) * density;
      sand = (dry * ratio[1] / sum);
      cementBags = Math.ceil(cementW / bagKg);
    }
  }
  return {
    unwasted, ordered: Math.ceil(unwasted * (1 + waste / 100)),
    perM2: leaves / unitFace,
    mortarNet: net, mortarOrder: order, mortarDry: order * dryFactor,
    cementW, cementBags, cementOrderedKg: cementBags * bagKg, sand,
    water: cementW * 0.6,
  };
}

let failures = 0;
const check = (name, got, want, tol) => {
  const ok = Math.abs(got - want) <= tol;
  if (!ok) failures++;
  console.log(' ', ok ? 'PASS' : 'FAIL', name.padEnd(52), f(got, 4), ok ? '' : `(expected ${f(want, 4)})`);
};

console.log('='.repeat(86));
console.log('1. BRICK COUNT vs independent reference  1 / ((L+t)(H+t)) x leaves x area');
console.log('='.repeat(86));
const presets = {
  'Local Iraqi 24x11.5x7.5': { L: .240, W: .115, H: .075 },
  'Standard UK 21.5x10.25x6.5': { L: .215, W: .1025, H: .065 },
  'Engineering 21.5x10.25x7.3': { L: .215, W: .1025, H: .073 },
  'Roman 29x9x4': { L: .290, W: .090, H: .040 },
  'Hollow 30x12x12': { L: .300, W: .120, H: .120 },
};
for (const [name, p] of Object.entries(presets)) {
  const r = bricksCalc({ ...p, wallLen: 10, wallH: 3, wallT: p.W, waste: 0, includeMortar: false });
  const ref = (10 * 3) / ((p.L + .01) * (p.H + .01));
  check(name + ' pcs (30 m2, 1 leaf)', r.unwasted, ref, 0.01);
}
{
  const r = bricksCalc({ L: .240, W: .115, H: .075, wallLen: 10, wallH: 3, wallT: .24, leaves: 2, waste: 0, includeMortar: false });
  check('two-leaf 0.24 m wall pcs', r.unwasted, 2 * 30 / (.25 * .085), 0.01);
  check('two-leaf pcs per m2 of wall FACE', r.perM2, 2 / (.25 * .085), 1e-6);
}

console.log('\n' + '='.repeat(86));
console.log('2. MORTAR VOLUME vs envelope-minus-unit reference');
console.log('='.repeat(86));
for (const [name, p] of Object.entries(presets)) {
  const r = bricksCalc({ ...p, wallLen: 1, wallH: 1, wallT: p.W, waste: 0 });
  const perUnit = (p.L + .01) * (p.H + .01) * p.W - p.L * p.H * p.W;
  const ref = perUnit / ((p.L + .01) * (p.H + .01));
  check(name + ' mortar m3/m2', r.mortarNet, ref, 1e-6);
}

console.log('\n' + '='.repeat(86));
console.log('3. INTERNAL RECONCILIATION (the thing that was broken)');
console.log('='.repeat(86));
const c = bricksCalc({ L: .240, W: .115, H: .075, wallLen: 10, wallH: 3, wallT: .115, waste: 5, ratio: [1, 3] });
console.log(`  wall 10 x 3 m, half brick, 5% waste, 1:3 mortar, 10 mm joints`);
console.log(`  bricks ordered            ${c.ordered}`);
console.log(`  wet mortar  net / order   ${f(c.mortarNet)} / ${f(c.mortarOrder)} m3`);
console.log(`  dry mortar (x1.33)        ${f(c.mortarDry)} m3`);
console.log(`  cement / sand             ${f(c.cementW, 2)} kg (${c.cementBags} bags) / ${f(c.sand)} m3`);
check('cement vol + sand vol == dry mortar', c.cementW / 1440 + c.sand, c.mortarDry, 1e-9);
check('(cement+sand)/1.33 == wet mortar ORDERED', (c.cementW / 1440 + c.sand) / 1.33, c.mortarOrder, 1e-9);
check('sand : cement-by-volume == 1 : 3', c.sand / (c.cementW / 1440), 3, 1e-9);
check('water == 0.6 x cement batched', c.water, c.cementW * 0.6, 1e-9);

console.log('\n' + '='.repeat(86));
console.log('4. EDGE CASES');
console.log('='.repeat(86));
const zero = bricksCalc({ L: .240, W: .115, H: .075, wallLen: 10, wallH: 3, wallT: .115, mortarCm: 0, waste: 5 });
console.log('  0 mm joint -> mortar', f(zero.mortarOrder, 8), '| bags', zero.cementBags, '| water', f(zero.water, 2), 'L');
check('0 mm joint must not create a phantom cement bag', zero.cementBags, 0, 0);
const noMortar = bricksCalc({ L: .240, W: .115, H: .075, wallLen: 10, wallH: 3, wallT: .115, waste: 5, includeMortar: false });
check('mortar checkbox off -> 0 bags', noMortar.cementBags, 0, 0);
check('mortar checkbox off -> 0 sand', noMortar.sand, 0, 0);
const tiny = bricksCalc({ L: .240, W: .115, H: .075, wallLen: 0.2, wallH: 0.2, wallT: .115, waste: 5 });
console.log('  1 m2 patch -> cement', f(tiny.cementW, 2), 'kg, bags', tiny.cementBags, ', water', f(tiny.water, 2), 'L  (old bagsx30 rule said 30 L)');

console.log('\n' + '='.repeat(86));
console.log('5. CROSS-CHECK AGAINST THE HAND-VALUE ALREADY IN tests/calculations.test.js');
console.log('='.repeat(86));
const ref = bricksCalc({ L: .240, W: .115, H: .075, wallVolume: 3.45, volT: .115, waste: 5, includeMortar: false });
check('3.45 m3 wall -> 1483 bricks ordered (test expectation)', ref.ordered, 1483, 0);
check('brick face rate 47.06 /m2 (test expectation)', bricksCalc({ L:.240,W:.115,H:.075,wallLen:1,wallH:1,wallT:.115,waste:0,includeMortar:false }).perM2, 47.0588, 0.001);

console.log('\n' + (failures ? `FAILURES: ${failures}` : 'ALL CHECKS PASSED'));
process.exit(failures ? 1 : 0);
