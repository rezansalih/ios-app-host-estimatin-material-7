# Construction Material Estimator

An offline-ready construction material quantity and cost estimator for concrete, blocks, bricks, structural steel, and earthwork.

## Offline support

The app is a static Progressive Web App (PWA):

- Runtime libraries are stored in `vendor/`.
- `sw.js` caches the app shell after the first online visit.
- `manifest.webmanifest` enables installation on supported devices.
- Calculations and preferences continue to use browser local storage.
- No server or database is required.

The first visit needs an internet connection only to download the website. After the service worker finishes installing, the app works offline from the same URL.

## Publish with GitHub Pages

1. Create a GitHub repository, for example `construction-material-estimator`.
2. Upload all files in this folder to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.
6. Share the generated `https://<username>.github.io/<repository>/` URL.

The app is already configured for a repository subpath because all local asset references are relative.

## Local preview

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/`. Service workers require `localhost` or HTTPS; opening `index.html` directly with `file://` will not install offline support.
