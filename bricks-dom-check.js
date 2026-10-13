#!/usr/bin/env node
'use strict';
// Static DOM audit: every id referenced by the bricks code path must exist in index.html.
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const appJs = fs.readFileSync(path.join(root, 'src', 'app.src.js'), 'utf8') + '\n' + ['concrete','blocks','bricks','steel','earthwork'].map(n => fs.readFileSync(path.join(root, 'src', `calc-${n}.src.js`), 'utf8')).join('\n');
const source = html + '\n' + appJs;

const idsInHtml = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));

const start = source.indexOf("__calcHandlers.bricks");
const end = source.indexOf("__calcHandlers.steel");
const brickHandler = source.slice(start, end);

const referenced = new Set();
for (const m of brickHandler.matchAll(/getElementById\(\s*'([^']+)'\s*\)/g)) referenced.add(m[1]);
for (const m of brickHandler.matchAll(/querySelector\(\s*'input\[name="([^"]+)"\]/g)) referenced.add('radio:' + m[1]);

// Other bricks-tab wiring outside the handler.
const extra = [...source.matchAll(/getElementById\('(brick-[^']+)'\)/g)].map(m => m[1]);

console.log('IDs referenced by the bricks handler:');
let missing = 0;
for (const id of [...referenced].sort()) {
  const ok = id.startsWith('radio:') ? html.includes(`name="${id.slice(6)}"`) : idsInHtml.has(id);
  if (!ok) missing++;
  console.log(' ', ok ? 'OK  ' : 'MISS', id);
}
console.log('\nBricks ids referenced elsewhere:');
for (const id of [...new Set(extra)].sort()) {
  const ok = idsInHtml.has(id);
  if (!ok) missing++;
  console.log(' ', ok ? 'OK  ' : 'MISS', id);
}

console.log('\n--- targeted checks ---');
const checks = {
  'custom brick size inputs exist': /id="brick-custom-profile"/.test(html) && /id="brick-custom-length"/.test(html),
  'custom block size inputs exist': /id="block-custom-profile"/.test(html) && /id="block-custom-length"/.test(html),
  'bricks uses dedicated thickness-mismatch key (errWallThicknessMismatch)': brickHandler.includes('T.errWallThicknessMismatch'),
  'bricks result shows "bags" unit next to cement': /T\.cementBags\}<\/strong> \$\{cementBags\}/.test(brickHandler),
  'blocks result shows "bags" unit next to cement': /T\.cementBags\}<\/strong> \$\{cementBags\} bags/.test(source),
  'bricks mortar volume is labelled before/after waste': /mortarVolumeOrder|mortarWithWaste/.test(brickHandler),
  'opening summary uses the translated key (EN text is only a fallback)': /T\.openingsDeducted \|\|/.test(brickHandler),
  'bricks tab has leaves input': idsInHtml.has('brick-leaves'),
  'bricks tab has mortar dry factor': idsInHtml.has('brick-mortar-dry-factor'),
};
for (const [k, v] of Object.entries(checks)) console.log(v ? 'PASS' : 'FAIL', '-', k);

console.log('\nMISSING IDS:', missing);
process.exit(missing ? 1 : 0);
