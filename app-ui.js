/* ==========================================================================
   app-ui.js — presentation layer
   Adds bottom navigation, guided steps, touch steppers and the result hero.
   It NEVER touches calculation logic: it only moves/annotates existing DOM.
   Runs after the main app script on DOMContentLoaded.
   ========================================================================== */
(function () {
  'use strict';
  var doc = document;
  var body = doc.body;

  var WIZARDS = [];
  var TOOLS = [
    { id: 'concrete',  icon: 'box',                   key: 'tabConcrete'  },
    { id: 'blocks',    icon: 'layout-grid',            key: 'tabBlocks'    },
    { id: 'bricks',    icon: 'brick-wall',             key: 'tabBricks'    },
    { id: 'steel',     icon: 'git-commit-horizontal',  key: 'tabSteel'     },
    { id: 'earthwork', icon: 'mountain-snow',          key: 'tabEarthwork' }
  ];

  // The translation table lives inside the app script's scope, so read strings
  // back off the DOM: every translatable string has a [data-lang] carrier that
  // applyTranslations() keeps current. That keeps the UI layer localised too.
  var t = function (key, fallback) {
    var el = doc.querySelector('[data-lang="' + key + '"]');
    var txt = el ? el.textContent.trim() : '';
    return txt || fallback;
  };

  /* -------------------------------------------------- 1. bottom nav bar --- */
  function buildBottomNav() {
    var nav = doc.createElement('nav');
    nav.className = 'bottom-nav';
    nav.id = 'bottom-nav';
    nav.setAttribute('aria-label', 'Calculators');

    nav.appendChild(navButton({ id: 'home', icon: 'layers', label: function () { return t('homeBack', 'All tools'); } }));
    TOOLS.forEach(function (tool) {
      nav.appendChild(navButton({
        id: tool.id, icon: tool.icon,
        label: function () { return t(tool.key, tool.id); }
      }));
    });
    body.appendChild(nav);

    function navButton(cfg) {
      var b = doc.createElement('button');
      b.type = 'button';
      b.className = 'bn-item';
      b.setAttribute('data-goto', cfg.id);
      b.setAttribute('data-lang-key', cfg.key);
      b.innerHTML =
        '<span class="bn-icon"><svg class="lucide" aria-hidden="true"><use href="#i-' + cfg.icon + '"></use></svg></span>' +
        '<span></span>';
      b.querySelector('span:last-child').textContent = cfg.label();
      b.addEventListener('click', function () {
        if (navigator.vibrate) navigator.vibrate(18);
        if (cfg.id === 'home') { window.goHomeUI ? window.goHomeUI() : location.reload(); }
        else { window.openToolUI ? window.openToolUI(cfg.id) : null; }
      });
      return b;
    }
    return nav;
  }

  /* ---------------------------------------- 2. contextual action bar ----- */
  function buildActionBar() {
    var legacy = doc.getElementById('mobile-reset');
    var calcBtn = doc.getElementById('mobile-calculate');
    if (!calcBtn) return;

    var bar = doc.createElement('div');
    bar.className = 'mobile-actions';
    bar.id = 'mobile-actions';

    var reset = doc.createElement('button');
    reset.type = 'button';
    reset.className = 'ma-icon';
    reset.id = 'mobile-reset-ui';
    reset.setAttribute('aria-label', t('resetBtn', 'Reset'));
    reset.innerHTML = '<svg class="lucide" aria-hidden="true"><use href="#i-rotate-ccw"></use></svg>';

    bar.appendChild(reset);
    calcBtn.classList.add('ma-primary');
    bar.appendChild(calcBtn);          // reuse the existing wired button
    body.appendChild(bar);

    reset.addEventListener('click', function () {
      if (navigator.vibrate) navigator.vibrate(18);
      if (legacy) legacy.click();
    });
    if (legacy) legacy.style.display = 'none';   // keep its wiring, drop the old bar
  }

  /* ------------------------------------------------------- 3. steppers --- */
  var STEPPER_SKIP = { wastage: 1 };

  function addSteppers(root) {
    var inputs = root.querySelectorAll('input[type="number"]');
    Array.prototype.forEach.call(inputs, function (input) {
      if (input.parentElement && input.parentElement.classList.contains('num-field')) return;
      if (STEPPER_SKIP[input.id]) return;
      if (input.type === 'hidden') return;

      var step = parseFloat(input.getAttribute('step'));
      if (!isFinite(step) || step <= 0) step = (input.getAttribute('step') || '').indexOf('.') >= 0 ? 0.01 : 1;
      var min = input.hasAttribute('min') ? parseFloat(input.getAttribute('min')) : -Infinity;
      var max = input.hasAttribute('max') ? parseFloat(input.getAttribute('max')) : Infinity;

      var wrap = doc.createElement('div');
      wrap.className = 'num-field';
      input.parentNode.insertBefore(wrap, input);
      wrap.appendChild(input);

      var box = doc.createElement('div');
      box.className = 'num-stepper';
      box.innerHTML =
        '<button type="button" data-dir="-1" aria-label="Decrease">−</button>' +
        '<button type="button" data-dir="1" aria-label="Increase">+</button>';
      wrap.appendChild(box);

      box.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-dir]');
        if (!b) return;
        e.preventDefault();
        var dir = parseFloat(b.getAttribute('data-dir'));
        var cur = parseFloat(input.value);
        if (!isFinite(cur)) cur = isFinite(min) ? min : 0;
        var next = Math.round((cur + dir * step) * 1000) / 1000;
        if (next < min) next = min;
        if (next > max) next = max;
        input.value = String(next);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        if (navigator.vibrate) navigator.vibrate(8);
      });
    });
  }

  /* --------------------------------------------- 4. segmented radios ----- */
  function markSegments(root) {
    Array.prototype.forEach.call(root.querySelectorAll('[role="radiogroup"]'), function (group) {
      var labels = Array.prototype.slice.call(group.querySelectorAll('label'));
      var sync = function () {
        labels.forEach(function (l) {
          var r = l.querySelector('input[type="radio"]');
          l.classList.toggle('seg-on', !!(r && r.checked));
        });
      };
      labels.forEach(function (l) {
        var r = l.querySelector('input[type="radio"]');
        if (r) r.addEventListener('change', sync);
      });
      sync();
    });
  }

  /* -------------------------------------------------------- 5. wizard ---- */
  // "1. " / "1) " in Latin, Arabic-Indic (١) and Extended Arabic-Indic (۱)
  var NUM_PREFIX = /^\s*[\u0660-\u0669\u06F0-\u06F90-9]+\s*[\.\)\-\u00B7]\s*/;

  function stepIndexOf(card) {
    var h = card.querySelector('h3');
    var m = h ? /^\s*(\d+)\s*[\.\)]/.exec(h.textContent) : null;
    if (m) return parseInt(m[1], 10);
    var keyed = card.querySelector('[data-lang^="step"]');
    if (keyed) {
      var mm = /^step(\d+)/.exec(keyed.getAttribute('data-lang') || '');
      if (mm) return parseInt(mm[1], 10);
    }
    return null;
  }

  function stepTitle(card) {
    var h = card.querySelector('h3');
    if (h) return h.textContent.replace(NUM_PREFIX, '').trim();
    var keyed = card.querySelector('[data-lang^="step"]');
    return keyed ? keyed.textContent.replace(NUM_PREFIX, '').trim() : '';
  }

  function buildWizard(tabEl) {
    if (tabEl.querySelector('.wizard')) return null;

    var found = Array.prototype.filter.call(tabEl.querySelectorAll('.card'), function (el) {
      return stepIndexOf(el) !== null;
    });
    // drop cards nested inside another step card, then group by their shared parent
    var top = found.filter(function (c) {
      return !found.some(function (o) { return o !== c && o.contains(c); });
    });
    if (top.length < 2) return null;     // one section: leave it as a plain page
    var container = top[0].parentElement;
    var cards = Array.prototype.filter.call(container.children, function (el) {
      return top.indexOf(el) !== -1;
    });

    var groups = {};
    cards.forEach(function (c) {
      var n = stepIndexOf(c);
      (groups[n] = groups[n] || []).push(c);
    });
    var numbers = Object.keys(groups).map(Number).sort(function (a, b) { return a - b; });

    // The "calculate by" radio group belongs with step 1
    var modeRadios = tabEl.querySelector('[role="radiogroup"][aria-labelledby^="calcmode"]');
    var modeWrap = modeRadios ? modeRadios.closest('div.mb-2') || modeRadios.parentElement : null;

    var wizard = doc.createElement('div');
    wizard.className = 'wizard';
    container.insertBefore(wizard, cards[0]);        // always inside the container

    var progress = doc.createElement('div');
    progress.className = 'wizard-progress';
    numbers.forEach(function () { progress.appendChild(doc.createElement('div')).className = 'wp-seg'; });
    wizard.appendChild(progress);

    var meta = doc.createElement('div');
    meta.className = 'wizard-meta';
    var metaLabel = doc.createElement('span');
    var metaTitle = doc.createElement('span');
    meta.appendChild(metaLabel); meta.appendChild(metaTitle);
    wizard.appendChild(meta);

    var stepsHost = doc.createElement('div');
    wizard.appendChild(stepsHost);

    var stepEls = numbers.map(function (n, i) {
      var sec = doc.createElement('section');
      sec.className = 'wizard-step';
      sec.setAttribute('data-step', String(i));
      if (i === 0 && modeWrap) sec.appendChild(modeWrap);
      groups[n].forEach(function (c) { sec.appendChild(c); });
      stepsHost.appendChild(sec);
      return { el: sec, title: stepTitle(groups[n][0]) };
    });

    var nav = doc.createElement('div');
    nav.className = 'wizard-nav';
    var back = doc.createElement('button');
    back.type = 'button'; back.className = 'btn btn-secondary';
    var next = doc.createElement('button');
    next.type = 'button'; next.className = 'btn btn-primary';
    nav.appendChild(back); nav.appendChild(next);
    wizard.appendChild(nav);

    // Anything left in the old container (session table etc.) stays visible.
    var leftovers = Array.prototype.filter.call(container.children, function (el) {
      return el.classList.contains('card') && stepIndexOf(el) === null;
    });
    leftovers.forEach(function (el) { container.insertBefore(el, wizard.nextSibling); });

    var current = 0;
    function render() {
      stepEls.forEach(function (s, i) { s.el.classList.toggle('is-current', i === current); });
      Array.prototype.forEach.call(progress.children, function (seg, i) {
        seg.classList.toggle('is-current', i === current);
        seg.classList.toggle('is-done', i < current);
      });
      metaLabel.textContent = t('stepOf', 'Step') + ' ' + (current + 1) + ' / ' + stepEls.length;
      metaTitle.textContent = stepEls[current].title || '';
      back.style.display = current === 0 ? 'none' : '';
      back.textContent = t('backStep', 'Back');
      next.textContent = current === stepEls.length - 1
        ? (t('reviewStep', 'Review & calculate'))
        : (t('nextStep', 'Next'));
      if (typeof window.lucide !== 'undefined') window.lucide.createIcons();
    }
    function go(i) {
      current = Math.max(0, Math.min(stepEls.length - 1, i));
      render();
      var top = wizard.getBoundingClientRect().top + window.pageYOffset - 12;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
    back.addEventListener('click', function () { go(current - 1); });
    next.addEventListener('click', function () {
      if (current === stepEls.length - 1) {
        var btn = tabEl.querySelector('.sticky-action-container [id^="calculate-"], .mobile-actions [id^="calculate-"]');
        if (btn) btn.click();
        return;
      }
      go(current + 1);
    });
    render();

    return { el: wizard, go: go, count: stepEls.length };
  }

  /* --------------------------------------------------- 6. result hero ---- */
  var VOLUME = /m[\u00b3\u0f33]|ft[\u00b33]|yd[\u00b33]|c\.?f|c\.?y|ltr|l\b/i;

  // Which result row becomes the hero headline, per tool.
  var HEADLINE = {
    concrete: 'first',          // Total Volume
    earthwork: 'first',         // Total Excavation Volume
    blocks: 'firstNonVolume',   // Blocks Required
    bricks: 'firstNonVolume',   // Bricks Required
    steel: 'lastNonMoney'       // combined Total Weight
  };

  // "د.ع0.00" / "$12.34" -> money; "149340.80 kg" / "Cost not entered" -> not.
  function isMoneyLike(text) {
    return /[^\d\s]/.test(text) && /\d/.test(text) && !/^\s*[\d]/.test(text);
  }

  function rawValue(item) {
    var strong = item.querySelector('strong');
    var span = item.querySelector('span');
    if (!span) return '';
    var txt = span.textContent.trim();
    if (strong) txt = txt.replace(strong.textContent, '').trim();
    return txt;
  }

  function heroFromResult(resultEl, toolId) {
    var card = resultEl.querySelector('.result-card');
    if (!card || card.querySelector('.result-hero')) return;

    var items = Array.prototype.slice.call(card.querySelectorAll('.result-item'));
    if (!items.length) return;

    var grid = card.querySelector('.result-content > div');
    if (!grid) return;

    var totalEl = card.querySelector('.total-cost-print strong');
    var totalTxt = totalEl ? totalEl.textContent.trim() : '';
    // "Grand Total (Estimated) $12.34"  ->  label / currency / amount
    var tm = /^(.*?)\s*([^\s\d]+?)\s*([\d][\d,\.]*)\s*$/.exec(totalTxt);
    var money = tm ? tm[2] + ' ' + tm[3] : '';
    var costLabel = tm ? tm[1].replace(/\s*\([^)]*\)/g, '').trim() : '';

    // Headline = the single number the user came for. Each tool reports in a
    // different shape, so the pick is per-tool rather than one guessed rule.
    var pick = HEADLINE[toolId] || 'firstNonVolume';
    var lastItem = items[items.length - 1];
    var isMoneyItem = lastItem && isMoneyLike(rawValue(lastItem));

    var headIdx = 0;
    if (pick === 'firstNonVolume') {
      for (var i = 0; i < items.length; i++) {
        var v = itemValue(items[i]);
        if (VOLUME.test(v.unit) || v.unit.length > 14) continue;
        headIdx = i; break;
      }
    } else if (pick === 'lastNonMoney') {
      headIdx = items.length - 1;
      if (isMoneyItem && items.length > 1) headIdx = items.length - 2;
    }

    var head = items[headIdx];
    var strong = head.querySelector('strong');
    var label = strong ? strong.textContent.trim() : '';
    var parsed = itemValue(head);

    // Cost: prefer the printed grand total; steel renders it as a result row.
    if (!money && isMoneyItem && lastItem !== head) {
      var lm = /^(.*?)\s*([^\s\d]+?)\s*([\d][\d,\.]*)\s*$/.exec(rawValue(lastItem));
      if (lm) {
        money = lm[2] + ' ' + lm[3];
        var lmLabel = lm[1] || (lastItem.querySelector('strong') ? lastItem.querySelector('strong').textContent : '');
        costLabel = lmLabel.replace(/\s*\([^)]*\)/g, '').trim();
      }
    }

    var hero = doc.createElement('div');
    hero.className = 'result-hero';
    hero.innerHTML =
      '<div class="rh-label"></div>' +
      '<div class="rh-value"></div>' +
      (money ? '<div class="rh-cost"><span></span><strong></strong></div>' : '');
    hero.querySelector('.rh-label').textContent = label;
    hero.querySelector('.rh-value').textContent = groupDigits(parsed.qty) || '\u2014';
    if (parsed.unit) {
      var u = doc.createElement('span');
      u.className = 'rh-unit';
      u.textContent = parsed.unit;
      hero.querySelector('.rh-value').appendChild(u);
    }
    if (money) {
      hero.querySelector('.rh-cost span').textContent = costLabel;
      hero.querySelector('.rh-cost strong').textContent = money;
    }
    grid.insertBefore(hero, grid.firstChild);

    // Promote the save / CSV / print buttons out of the header into their own row.
    var header = card.querySelector('.result-card > .flex, .result-card > div');
    var actions = card.querySelector('.save-history-btn') || card.querySelector('.export-btn');
    if (actions && !card.querySelector('.result-actions')) {
      var tray = actions.parentElement;
      var row = doc.createElement('div');
      row.className = 'result-actions';
      Array.prototype.slice.call(tray.children).forEach(function (b) {
        b.classList.add('btn', 'btn-secondary');
        row.appendChild(b);
      });
      tray.remove();
      grid.insertBefore(row, hero.nextSibling);
    }

    // The headline and the grand total are now inside the hero, so stop showing
    // them twice. They are HIDDEN, not removed: exportToCSV() enumerates
    // .result-item, and PDF/print already shows both values inside the hero.
    head.style.display = 'none';
    head.setAttribute('aria-hidden', 'true');
    if (totalEl) {
      var tp = totalEl.closest('.total-cost-print');
      if (tp) tp.style.display = 'none';
    }
    if (money && isMoneyItem && lastItem !== head) lastItem.style.display = 'none';
    if (typeof window.lucide !== 'undefined') window.lucide.createIcons();
  }

  function groupDigits(qty) {
    if (!qty || !/^[\d][\d,\.]*$/.test(qty)) return qty;
    var parts = qty.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function itemValue(item) {
    var txt = rawValue(item);
    var m = /^([\d][\d,\.]*)\s*(.*)$/.exec(txt);
    return m ? { qty: m[1], unit: m[2] } : { qty: txt, unit: '' };
  }

  function watchResults() {
    ['concrete', 'blocks', 'bricks', 'steel', 'earthwork'].forEach(function (type) {
      var target = doc.getElementById(type + '-result');
      if (!target) return;
      var run = function () {
        if (target.classList.contains('hidden')) return;
        if (!target.querySelector('.result-card')) return;
        try { heroFromResult(target, type); } catch (e) { /* never break the result */ }
      };
      new MutationObserver(run).observe(target, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    });
  }

  /* ------------------------------------------------------------- boot ---- */
  function init() {
    buildBottomNav();
    buildActionBar();

    ['concrete', 'blocks', 'bricks', 'steel', 'earthwork'].forEach(function (id) {
      var tab = doc.getElementById(id);
      if (!tab) return;
      addSteppers(tab);
      markSegments(tab);
      var wiz = buildWizard(tab);
      if (wiz) { tab.__wizard = wiz; WIZARDS.push(wiz); }
    });

    watchResults();

    // Expose the same verbs the home tiles use, so the bottom nav can reuse them.
    window.goHomeUI = function () {
      var back = doc.getElementById('back-home-btn');
      if (back) back.click();
      else { body.classList.add('view-home'); }
    };
    window.openToolUI = function (toolId) {
      var tile = doc.querySelector('.app-tile[data-goto="' + toolId + '"]');
      if (tile) tile.click();
    };

    // PWA install: show the home button when the browser defers the prompt
    var deferredInstall = null;
    var installBtn = doc.getElementById('install-app-btn');
    if (installBtn) {
      window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferredInstall = e;
        installBtn.classList.remove('hidden');
      });
      window.addEventListener('appinstalled', function () {
        installBtn.classList.add('hidden');
        deferredInstall = null;
      });
      installBtn.addEventListener('click', function () {
        if (!deferredInstall) return;
        deferredInstall.prompt();
        deferredInstall.userChoice.then(function (choice) {
          if (choice.outcome === 'accepted') installBtn.classList.add('hidden');
          deferredInstall = null;
        });
      });
    }

    function syncNav() {
      var active = doc.querySelector('.tab-btn.tab-active');
      Array.prototype.forEach.call(doc.querySelectorAll('.bn-item'), function (b) {
        var on = active && b.getAttribute('data-goto') === active.dataset.tab;
        b.classList.toggle('is-active', !!on);
        b.setAttribute('aria-current', on ? 'page' : 'false');
      });
    }
    // Sync straight away (same tick) and once more after the app's own handler
    // has swapped the active tab, so the nav is correct either way.
    doc.addEventListener('click', function () { syncNav(); setTimeout(syncNav, 0); });
    syncNav();

    // Re-read every string when the language changes (applyTranslations runs first).
    doc.addEventListener('change', function (e) {
      if (e.target && e.target.id !== 'language-selector') return;
      setTimeout(function () {
        Array.prototype.forEach.call(doc.querySelectorAll('.bn-item'), function (b) {
          var lbl = b.querySelector('span:last-child');
          if (lbl) lbl.textContent = t(b.getAttribute('data-lang-key'), lbl.textContent);
        });
        WIZARDS.forEach(function (w) { w.render(); });
        syncNav();
      }, 0);
    });
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();
})();
