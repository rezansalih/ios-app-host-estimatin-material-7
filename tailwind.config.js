/** Production Tailwind build: scans index.html and emits only the classes used. */
module.exports = {
  content: ['./index.html', './app-ui.js'],
  theme: { extend: {} },
  plugins: [],
  corePlugins: { preflight: true },
};
