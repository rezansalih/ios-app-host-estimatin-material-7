// Embed both the compiled utility/reset CSS and the component stylesheet in
// index.html. A partial upload or stale CSS response must never produce a
// styled-looking app with broken box-sizing and overflowing number fields.
import fs from 'node:fs';
const htmlFile = 'index.html';
const html = fs.readFileSync(htmlFile, 'utf8');
const start = '<!-- APP_STYLES_START -->';
const end = '<!-- APP_STYLES_END -->';
const before = html.indexOf(start), after = html.indexOf(end);
if (before < 0 || after < before) throw new Error('CSS embedding markers missing from index.html');
const css = ['assets/app.css', 'new-style.css'].map(path => fs.readFileSync(path, 'utf8')).join('\n');
if (css.includes('</style')) throw new Error('Unexpected style-closing tag inside CSS');
const replacement = `${start}\n<style id="app-styles">\n${css}\n</style>\n${end}`;
fs.writeFileSync(htmlFile, html.slice(0, before) + replacement + html.slice(after + end.length));
console.log(`Embedded ${css.length} characters of CSS into ${htmlFile}`);
