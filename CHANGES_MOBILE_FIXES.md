# Mobile fixes applied (13 Oct 2026) — cache v25

## Fixed
1. **Missing PWA files created**: `manifest.webmanifest` (name, standalone, scope/id, any+maskable icons), `icon.svg` (brick-wall mark), `favicon.ico`. Previously referenced but absent — this blocked install and would have failed the whole service-worker cache (`cache.addAll` is all-or-nothing).
2. **Scripts deferred, order preserved**: `concrete-calculations.js`, `app.js`, `app-ui.js` all `defer`, with `app.js` before `app-ui.js` in the document so deferred execution keeps the original run order (app-ui must run after app). No more parser-blocking 235 KB at first paint.
3. **One CSS source of truth**: the 36 KB design stylesheet now loads as `./new-style.css` (cacheable by the service worker, no longer re-downloaded inside every HTML page) and is in the SW shell. No hand-syncing a duplicate.
4. **Keyboard no longer covers the app**: `visualViewport` detection in `app-ui.js` adds `body.keyboard-open`, which slides the bottom nav away while typing; `100dvh` stops URL-bar resize jumps; result cards get `scroll-margin` so Calculate results never hide under the fixed bars.
5. **Readable bottom-nav labels**: `.58rem` -> `.68rem` (~9.3px -> ~10.9px) on small screens.
6. **Phone keyboards**: every field now gets `enterkeyhint` (Next/Done) and a `name` (from its id) at startup.
7. Added `mobile-web-app-capable` meta; `npm run test:all` runs the main suites in one command.
8. Service-worker cache bumped `v24 -> v25` (users actually receive these fixes). Tests `ui-navigation-check.js`, `smoke-all-tabs.js`, `audit-deep.mjs` updated only where they hardcoded the old inline-CSS/script-tag layout — same assertions, new file locations.

## Verified
- `calculations.test.js` PASS · `bricks-audit.js` PASS · `smoke-all-tabs.js` PASS (EN/KU/KS/AR, 0 errors)
- `ui-navigation-check.js` PASS (0 failures) · `full-ui-check.js` ALL CHECKS PASSED · `audit-deep.mjs` PASS
- Every service-worker shell file and every `index.html` reference exists on disk.

## Still recommended later (not done — needs your decision)
- Minify/split `app.js` per calculator tab (biggest remaining speed win on slow networks).
- Native share sheet for results; visual screenshot tests at 360px width.

## Update — code splitting + minification (same day)
- `app.js` split: the 5 calculator handlers (~86 KB) moved to lazy chunks `calc-concrete.js` … `calc-earthwork.js`. A chunk downloads when its tool is opened (or on first Calculate tap if somehow not yet loaded), then is runtime-cached by the service worker for offline use. Note: a calculator never opened while online won't be available on a later *first* offline launch — opening each tool once online covers it.
- Everything minified with Terser (`scripts/build.mjs`, identifiers kept where tests audit them): editable sources live in `src/*.src.js` — **edit those, then run `npm run build`**. Never edit the minified root files directly.
- Initial JS: 268 KB -> 142 KB raw (~37 KB gzip). Each calculator chunk adds only ~1-3 KB gzip when first opened.
- Cache bumped v25 -> v26. Tests updated only where they hardcoded the old file layout (same assertions).

## Update — clearer results (same day, cache v27)
After Calculate, results are now organised in 3 layers (in `app-ui.js`, presentation only — no calculation changed, nothing removed from the DOM so CSV/PDF export is untouched):
1. **Hero** — the one headline number + grand total (as before).
2. **"What to order"** — max 6 final quantities only. "1.20 + 0.06 waste = 1.26 m³" is shown as just "1.26 m³ ordered" (pack maths like "27 × 50 kg bags" is kept whole). Includes a **Share list** button (native share sheet, clipboard fallback) that sends the order list as plain text — in EN / Kurdish Badini / Sorani / Arabic.
3. **"Details & breakdown"** — everything else (before-waste figures, cost breakdown, long notes, calculation trail) in a collapsed section.
Cost rows that only say "cost not entered" are now hidden. The hero briefly animates + vibrates on a fresh result and scrolls into view.

## Update — inputs collapse after Calculate (cache v28)
Once a result exists, the input wizard collapses behind a full-width **"✎ Edit inputs / Hide inputs"** bar at the top of the result, so on a phone the result *is* the page. Tapping Edit restores the wizard at its current step (all values untouched), recalculating collapses it again, and **Reset automatically brings the inputs back** — the user can never be stranded without a form. Translated in all 4 languages.

## Update — language-safe results + RTL numbers (cache v29)
- Every generated result row now carries `data-kind="order|cost|detail"` (set in the `calc-*.src.js` templates). The result organiser classifies by that tag, never by matching English words — so the "before wastage" intermediate row can no longer leak into *What to order* in Kurdish/Arabic (it did; now verified fixed in ku/ar/en).
- Order values are wrapped in `<bdi>` and the hero number has `unicode-bidi: isolate`, so "1.85 m³" never reorders inside RTL sentences.
- Removed the duplicated cost-scope note from the concrete calculation trail (the visible note stays).
- Added `NATIVE_REVIEW_STRINGS.md`: 49 calculation/result strings (EN | Badini | Sorani | Arabic) for a native Badini + Sorani speaker to proofread — the only remaining language work, and it needs a human, not code.

## Update — reliable first offline launch (cache v30)
- Pre-cached all five lazy calculator chunks in the service-worker app shell.
- A newly installed app can now open Concrete, Blocks, Bricks, Steel, or Earth Work without first opening that calculator online.
- Cache bumped from v29 to v30 so existing installs receive the fix.
