# Construction Material Estimator — mobile-fixed app

This is the **complete app folder**, not a screenshot. Open `index.html` through a local web server or host the folder on an HTTPS site. **Keep the `assets/`, `src/`, `scripts/`, and `tests/` folders in place**; the page loads `assets/app.css` and `new-style.css` by relative path.

## Quick start

```bash
cd material-estimator
python -m http.server 8000
```

Open `http://localhost:8000` on your computer. For a phone on the same Wi-Fi network, open `http://YOUR-COMPUTER-LAN-IP:8000`. For **Install app** / reliable offline use on a phone, deploy the entire folder to an HTTPS host (or use localhost on the device). A downloaded HTML file opened with `file://` cannot install a service worker.

## What changed in this revision

- Restored the missing `assets/app.css`, `manifest.webmanifest`, `icon.svg`, and `favicon.ico`; all references in the HTML and offline cache now resolve.
- Made the language selector, visible **Dark mode** switch, settings, and history controls a tidy two-column phone toolbar. The same switch works inside calculators and remembers your choice.
- Matched the header logo to the supplied brick-wall app icons.
- Stacked narrow dimension/input rows instead of squeezing three steppers across a phone; fixed widths, RTL positioning, and bottom-nav/action-bar space. No page-width panning is required.
- Removed the desktop metric dashboard from the small-screen calculator view, so the form starts higher on the screen. Phone tabs live in the bottom navigation; tablet/desktop use the standard tabs and action buttons.
- Bottom navigation respects the device safe area, and the keyboard hides the fixed action bar while typing.
- Advanced the offline-cache version to v31 so previously installed copies receive the corrected shell.

## Verification

`npm ci && npm run test:all && npm run test:ui && npm run test:audit`

Also checked actual mobile Chromium viewports at 320, 360, 390, 428, and 600 pixels; all calculator tabs at 320 pixels in English, Badini, Sorani, and Arabic had no page-width overflow or page errors. Dark-mode switching was tested from the phone UI. Browser pinch-to-zoom remains available for accessibility, but the app itself fits the portrait screen without zooming or sideways scrolling.

Editable JavaScript is in `src/*.src.js`; use `npm run build` to regenerate the minified root scripts. The source for the custom mobile layout is `new-style.css`.
