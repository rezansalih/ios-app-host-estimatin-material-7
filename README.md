# Construction Material Estimator — mobile-fixed app

This is the **complete app folder**, not a screenshot. Open `index.html` through a local web server or host the folder on an HTTPS site. **Keep `index.html` and the root JavaScript files together.** CSS is embedded directly in `index.html` so missing CSS files or a stale stylesheet cannot stretch the form on a phone. `assets/`, `src/`, `scripts/`, and `tests/` contain build sources and checks; keep them if you want to maintain the project.

## Quick start

```bash
cd material-estimator
python -m http.server 8000
```

Open `http://localhost:8000` on your computer. For a phone on the same Wi-Fi network, open `http://YOUR-COMPUTER-LAN-IP:8000`. For **Install app** / reliable offline use on a phone, deploy the entire folder to an HTTPS host (or use localhost on the device). A downloaded HTML file opened with `file://` cannot install a service worker.

## What changed in this revision

- **Session Results labels corrected (all calculators)**: *Description* → **Volume** in the blocks/bricks tables (it shows the wall volume in m³), *Mortar Cement* → **Cement** and *Mortar Sand* → **Sand** (clear names in every language), and the earthwork *Description* column → **Dimensions**. The cost inputs now say *Cement Cost/Bag* and *Sand Cost/m³*.
- **Typed values no longer hide behind the +/− buttons**: compact number fields use a Tailwind `!p-2` padding override that used to cancel the stepper space reservation (worst in Arabic/Kurdish RTL, where the caret and digits start on the stepper side). The reservation is now `!important`, so values always show clearly in every language.
- **"Total Volume" mode asks for the volume only**: the confusing *Wall thickness* and *Wall leaves* fields were removed from the blocks/bricks total-volume mode (total volume already contains the thickness). Blocks and bricks are counted directly from the block module (length × height × block depth), and the result matches the dimensions mode exactly. Dimensions mode still asks for width and leaves.
- **Zoom is locked**: pinch, double-tap, keyboard and trackpad zoom are disabled (`user-scalable=no`, `touch-action: pan-x pan-y`, and gesture guards). The UI always stays at its designed size; one-finger scrolling still works.
- **Project settings slimmed down**: only **General Material Wastage**, **Currency**, the **100 USD to IQD rate** and **Cement bag size** remain. The whole *Project information* block (project name, client, location, date, unit system, notes) was removed.
- **Project settings is its own screen**: tapping *Project settings* in the header now opens a dedicated settings view (back bar + bottom navigation) exactly like the calculators; closing it returns to the tool you were using (or home).
- Restored the missing `assets/app.css`, `manifest.webmanifest`, `icon.svg`, and `favicon.ico`. The compiled CSS and component styles are now **embedded together** in the HTML, so even if a deployed copy omits `assets/app.css`, the app layout remains intact.
- Made the language selector, visible **Dark mode** switch, settings, and history controls a tidy two-column phone toolbar. The same switch works inside calculators and remembers your choice.
- Matched the header logo to the supplied brick-wall app icons.
- Stacked narrow dimension/input rows instead of squeezing three steppers across a phone; fixed widths, RTL positioning, and bottom-nav/action-bar space. No page-width panning is required.
- Removed the desktop metric dashboard from the small-screen calculator view, so the form starts higher on the screen. Phone tabs live in the bottom navigation; tablet/desktop use the standard tabs and action buttons.
- Bottom navigation respects the device safe area, and the keyboard hides the fixed action bar while typing.
- Fixed the specific iPhone screenshot failure: universal `border-box` sizing, full-width constrained number-field wrappers, and no native duplicate spinners. The width and padding of numeric inputs now stay inside their cards, just like selects.
- Advanced the offline-cache version to v32 so previously installed copies can receive the corrected shell.

## Verification

`npm ci && npm run test:all && npm run test:ui && npm run test:audit`

Also checked actual Chromium and WebKit (Safari engine) mobile viewports at 320, 375, 390, 428, and 600 pixels. In both engines, all six form controls from the reported iPhone screenshot stayed inside the same card, including when **all external CSS requests were blocked**. All calculator tabs at 320 pixels in English, Badini, Sorani, and Arabic had no page-width overflow or page errors. Zoom in/out is disabled on purpose (the app UI must never scale); the layout fits the portrait screen without zooming or sideways scrolling.

Editable JavaScript is in `src/*.src.js`; use `npm run build` to regenerate the minified root scripts and re-embed CSS. The custom mobile layout source is `new-style.css`; after editing CSS alone, run `npm run embed:css`. If you have an older installed Home Screen copy, replace the deployed files, open the site online once, and reinstall/clear the previous site's data if it still shows the old layout.

Result layout revision (October 2026): after **Calculate**, the answer appears as one compact card — the big answer and total cost first, then small Save/CSV/PDF buttons, then the "What to order" shopping list with its Share list button. All further numbers (cement, sand, water, blocks/bricks, cost rows) and the full calculation trail are folded into one closed **See details** section that opens on tap. The Session Results table is folded away behind a small "Session Results" bar showing how many saved rows there are; tap the bar to expand or collapse the table. This keeps the first screen short and the answer unmissable on small phones; everything is still there, just one tap away.

Steel tool revision (October 2026): the rebar calculator was decluttered and extended. Lap-splice settings (standard bar length is now **"Bar length in shops (m)"** in the General section, and the lap factor) moved into a collapsed **"Lap splices (for long bars)"** line at the bottom of Element details — closed by default, open it to include laps. The numbered "1./2./3." step headings were removed from every tool. The element list gained **Custom bars**: add rows of diameter + number of bars + bar length for dowels, chairs and odd jobs (member count is hidden for it since the rows are absolute). Every diameter list now offers Ø8–Ø32 (8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 32). The result is flat: the headline is always **Total Weight** with the grand total, "What to order" lists each diameter as shop bars (e.g. "Ø12 mm — 850 kg · 71 Bars × 12 m"), and the per-direction/per-row breakdown plus the calculation note sit in **See details**. Fixed: member count now multiplies footings, slabs and one-way runs too (before, only beams and columns counted it); session "Dimensions" column values are language-neutral ("3×2 m"); per-member amounts are labelled when the member count is over one.
