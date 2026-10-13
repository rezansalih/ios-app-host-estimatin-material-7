// Optional real-browser regression for the overflowing steppers shown in the
// user's iPhone screenshot. With the local server on port 8000, run:
// npm install --no-save playwright && npx playwright install chromium
// npm run test:mobile-geometry (or BROWSER=webkit after installing WebKit).
const { chromium, webkit } = require('playwright');
(async () => {
  const engine = process.env.BROWSER === 'webkit' ? webkit : chromium;
  const browser = await engine.launch(engine === chromium ? { args: ['--no-sandbox'] } : {});
  let checks = 0;
  for (const width of [320, 375, 390, 428, 600]) {
    for (const lang of ['en', 'ar']) {
      const page = await browser.newPage({ viewport: { width, height: 780 }, isMobile: true, hasTouch: true });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      // No CSS file is allowed to load. The complete layout MUST be embedded.
      await page.route('**/*.css', route => route.abort());
      await page.goto('http://127.0.0.1:8000/', { waitUntil: 'networkidle' });
      await page.selectOption('#language-selector', lang);
      await page.locator('.app-tile[data-goto="concrete"]').click();
      await page.waitForTimeout(350);
      const result = await page.evaluate(() => {
        const card = document.querySelector('#concrete-dims-inputs').closest('.card');
        const outer = card.getBoundingClientRect();
        const fields = ['concrete-type', 'concrete-slab-support', 'concrete-quantity', 'concrete-length', 'concrete-width', 'concrete-thickness'];
        return {
          screen: innerWidth, doc: document.documentElement.scrollWidth,
          boxSizing: getComputedStyle(document.querySelector('#concrete-length')).boxSizing,
          card: [outer.left, outer.right],
          fields: fields.map(id => {
            const r = document.getElementById(id).getBoundingClientRect();
            return [id, r.left, r.right, r.width];
          })
        };
      });
      if (errors.length || result.doc > width + 1 || result.boxSizing !== 'border-box' ||
          result.fields.some(([, left, right, fieldWidth]) => left < result.card[0] - 1 || right > result.card[1] + 1 || fieldWidth < 44)) {
        throw Error(`FAILED ${width}px ${lang}: ${JSON.stringify({ result, errors })}`);
      }
      checks++;
      console.log(`PASS ${width}px ${lang}: 6 inputs inside card, no page overflow, no external CSS`);
      await page.close();
    }
  }
  await browser.close();
  console.log(`${checks} mobile geometry checks passed`);
})().catch(error => { console.error(error); process.exitCode = 1; });
