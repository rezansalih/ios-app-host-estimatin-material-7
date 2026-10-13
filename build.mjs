// Build: minify src/*.src.js -> shipped files. Identifiers are NOT mangled,
// so the translation tables and handler names the tests audit stay readable.
import { minify } from 'terser';
import fs from 'node:fs';

const jobs = [
  ['src/app.src.js', 'app.js'],
  ['src/app-ui.src.js', 'app-ui.js'],
  ['src/concrete-calculations.src.js', 'concrete-calculations.js'],
  ['src/calc-concrete.src.js', 'calc-concrete.js'],
  ['src/calc-blocks.src.js', 'calc-blocks.js'],
  ['src/calc-bricks.src.js', 'calc-bricks.js'],
  ['src/calc-steel.src.js', 'calc-steel.js'],
  ['src/calc-earthwork.src.js', 'calc-earthwork.js'],
];
for (const [src, out] of jobs) {
  const code = fs.readFileSync(src, 'utf8');
  const res = await minify(code, { compress: true, mangle: { reserved: ['translations'] }, format: { comments: false } });
  if (res.error) throw res.error;
  fs.writeFileSync(out, res.code + '\n');
  console.log(`${out.padEnd(28)} ${String(code.length).padStart(7)} -> ${String(res.code.length).padStart(7)} bytes`);
}
