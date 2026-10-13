# Mobile review — Construction Material Estimator

## What was needed

The app already had a strong phone-first foundation: PWA metadata, install support, bottom navigation, guided calculator steps, touch steppers, and RTL translations. The main issues were polish and reliability rather than a broken calculation engine:

1. **Header used too much vertical space on phones.** Project settings and Recent calculations were stacked as full-width rows.
2. **Notch/safe-area handling was incomplete** for the fixed mobile action bar and bottom navigation.
3. **The large fixed background could be less smooth on mobile browsers**, especially iOS Safari.
4. **Offline caching missed `app.js`**, which contains the calculator logic and app initialization. An installed app could open without the calculation engine after a cold offline launch.
5. **The service-worker cache version needed to be bumped** so returning users receive the corrected shell.

## Changes made

- Made the two header utility actions sit side-by-side below 640px.
- Added horizontal safe-area padding to the mobile bottom navigation and Calculate/Reset action bar.
- Disabled fixed background attachment on small screens and prevented horizontal overscroll.
- Added `app.js` to the service-worker app shell.
- Bumped the cache from `material-estimator-v23` to `material-estimator-v24`.
- Kept `new-style.css` synchronized with the inline shipped stylesheet in `index.html`.

## Verification

All of the following pass after the changes:

- Calculation regression tests: concrete, blocks, bricks, steel, earthwork, openings, stirrups, and dimensional checks.
- Deep language/PWA audit: English, Kurdish Badini, Kurdish Sorani, and Arabic.
- Phone UI navigation: home screen, all calculator tabs, back navigation, wizard steps, Calculate/Reset, history, CSV, and PDF actions.
- Smoke tests across the calculator tabs and RTL result rendering.
- Local HTTP checks for the HTML, app scripts, service worker, and manifest.

## Next improvements if you want a larger product upgrade

- Add a project dashboard with saved project cards and recent estimates.
- Add share/export actions using the native phone share sheet.
- Add a short onboarding flow for first-time users.
- Add automated visual tests on iPhone and Android screen sizes.
- Consider a native wrapper only if you need app-store distribution, push notifications, camera access, or device file integration.
