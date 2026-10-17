/* calc-steel.js — lazy-loaded calculator chunk. Loaded by app.js on first use
   (tab open or Calculate tap); registers its handler instead of running at startup. */
window.__calcHandlers = window.__calcHandlers || {};
window.__calcHandlers.steel = function (ctx) {
  const { translations, fill, getCurrency, getWastageFactor, renderSessionTable, showError, sessionResults, lastCalcData, errorBox } = ctx;

  const calculateLengthWithLap = (singleBarLength, numberOfBars, diameter, includeLap, standardLength, lapFactor) => {
    if (!includeLap || singleBarLength <= standardLength) {
      return { totalLength: singleBarLength * numberOfBars, totalLapLength: 0, spliceCount: 0 };
    }
    const lapLength = lapFactor * (diameter / 1000);
    if (standardLength <= lapLength) return { totalLength: NaN, totalLapLength: NaN, spliceCount: 0 };
    const splicesPerBar = Math.max(0, Math.ceil((singleBarLength - lapLength) / (standardLength - lapLength)) - 1);

    if (splicesPerBar <= 0) {
      return { totalLength: singleBarLength * numberOfBars, totalLapLength: 0, spliceCount: 0 };
    }

    const totalSplices = splicesPerBar * numberOfBars;
    const totalLapLength = totalSplices * lapLength;
    const totalFinalLength = (singleBarLength * numberOfBars) + totalLapLength;

    return { totalLength: totalFinalLength, totalLapLength: totalLapLength, spliceCount: totalSplices };
  };

  const lang = localStorage.getItem('language') || 'en';
  const T = translations[lang] || translations.en;

  const currency = getCurrency();
  const wastageFactor = getWastageFactor();
  if (wastageFactor === null) return;
  const costPerKgRaw = document.getElementById('steel-cost').value.trim();
  // An empty price field means "not entered" — it must never show as 0 cost.
  const costPerKg = costPerKgRaw === '' ? null : Number(costPerKgRaw);
  const selectedElement = document.getElementById('steel-element-selector').value;
  if (!selectedElement) {
    showError(T.errSelectElement);
    return;
  }
  const isCustom = selectedElement === 'custom';
  const memberQuantity = isCustom ? 1 : Number(document.getElementById('steel-member-quantity')?.value || 1);
  if (!isCustom && (!Number.isInteger(memberQuantity) || memberQuantity < 1)) { showError(T.errRequiredFields); return; }
  if (costPerKg !== null && (!Number.isFinite(costPerKg) || costPerKg < 0)) { showError(T.errRequiredFields); return; }

  // Lap splices are enabled by opening the collapsed "Lap splices" details.
  const includeLap = !!document.getElementById('steel-lap-details')?.open;
  const standardBarLength = parseFloat(document.getElementById('steel-standard-bar-length').value);
  const lapSpliceFactor = parseFloat(document.getElementById('steel-lap-splice-factor').value);

  if (includeLap && (isNaN(standardBarLength) || isNaN(lapSpliceFactor) || standardBarLength <= 0 || lapSpliceFactor <= 0)) {
    showError(T.errLapSplice);
    return;
  }

  const weightPerMeter = (diameter) => (diameter * diameter) / 162;
  const perMemberNote = memberQuantity > 1 ? `, ${T.perMember}` : '';
  const wasteNote = ` (${T.withWastage}${perMemberNote})`;

  let results = { totalLapLength: 0, totalSplices: 0 };
  let inputsValid = false;
  let description = '';
  let breakdownRows = [];          // { label, value } — details
  let brcOrder = null;             // BRC mesh order line { label, value, pieceText }
  const scheduleRows = [];         // bar-bending schedule: { dia, shape, count, cut, total }
  const byDiameter = {};           // dia -> total cut length (m), all members, incl. laps
  const addDiameter = (dia, lenMeters) => {
    const d = Number(dia);
    if (!byDiameter[d]) byDiameter[d] = 0;
    byDiameter[d] += lenMeters;
  };
  const lapGuard = (r) => {
    if (!Number.isFinite(r.totalLength)) { showError(T.errLapSplice); return false; }
    results.totalLapLength += r.totalLapLength;
    results.totalSplices += r.spliceCount;
    return true;
  };

  const isBrc = selectedElement === 'brc';
  if (isBrc) {
    const brcMode = document.getElementById('brc-mode').value;
    const areaLen = parseFloat(document.getElementById('brc-area-len').value);
    const areaWid = parseFloat(document.getElementById('brc-area-wid').value);
    const pieceW = parseFloat(document.getElementById('brc-width').value);
    const pieceL = parseFloat(document.getElementById('brc-length').value);
    const overlapPct = parseFloat(document.getElementById('brc-overlap').value);
    const brcCostRaw = document.getElementById('brc-cost').value.trim();
    const piecePrice = brcCostRaw === '' ? null : Number(brcCostRaw);
    if (![areaLen, areaWid, pieceW, pieceL, overlapPct].every(Number.isFinite) ||
        areaLen <= 0 || areaWid <= 0 || pieceW <= 0 || pieceL <= 0 || overlapPct < 0 ||
        (piecePrice !== null && (!Number.isFinite(piecePrice) || piecePrice < 0))) {
      showError(T.errRequiredFields); return;
    }
    const totalArea = areaLen * areaWid * memberQuantity;
    const pieceArea = pieceW * pieceL;
    const count = Math.ceil((totalArea * (1 + overlapPct / 100)) / pieceArea);
    const brcUnit = brcMode === 'sheet' ? T.brcSheets : T.brcRolls;
    description = `${areaLen}\u00d7${areaWid} m`;
    breakdownRows = [
      { label: T.brcArea, value: `${totalArea.toFixed(1)} m²` },
      { label: T.brcSoldAs, value: `${pieceW}\u00d7${pieceL} m · ${pieceArea.toFixed(1)} m²` },
      { label: T.brcOverlap, value: `${overlapPct}%` }
    ];
    brcOrder = { label: T.brcTotal, value: `${count} ${brcUnit}`, pieceText: `${count} × ${pieceArea.toFixed(1)} m²`, price: piecePrice };
    results.totalWeight = 0;
    results.totalCost = piecePrice === null ? null : count * piecePrice;
    inputsValid = true;
  }

  if (!isBrc && (selectedElement === 'footing' || selectedElement === 'slab')) {
    const mode = document.querySelector(`input[name="${selectedElement}-mode"]:checked`).value;
    const length = parseFloat(document.getElementById(`${selectedElement}-length`).value);
    const width = parseFloat(document.getElementById(`${selectedElement}-width`).value);
    description = `${length}×${width} m`;

    let barsAlongLength, diameterLen, barsAlongWidth, diameterWid;

    if (mode === 'spacing') {
      const spacingLen = parseFloat(document.getElementById(`${selectedElement}-spacing-len`).value);
      diameterLen = parseFloat(document.getElementById(`${selectedElement}-diameter-len`).value);
      const spacingWid = parseFloat(document.getElementById(`${selectedElement}-spacing-wid`).value);
      diameterWid = parseFloat(document.getElementById(`${selectedElement}-diameter-wid`).value);

      if ([length, width, spacingLen, diameterLen, spacingWid, diameterWid].some(v => isNaN(v) || v <= 0)) {
        showError(T.errSpacingInputs);
        return;
      }

      barsAlongWidth = Math.ceil((length * 1000) / spacingWid) + 1;
      barsAlongLength = Math.ceil((width * 1000) / spacingLen) + 1;
    } else {
      barsAlongLength = Number(document.getElementById(`${selectedElement}-number-len`).value);
      diameterLen = parseFloat(document.getElementById(`${selectedElement}-diameter-len-alt`).value);
      barsAlongWidth = Number(document.getElementById(`${selectedElement}-number-wid`).value);
      diameterWid = parseFloat(document.getElementById(`${selectedElement}-diameter-wid-alt`).value);

      if ([length, width, barsAlongLength, diameterLen, barsAlongWidth, diameterWid].some(v => !Number.isFinite(v) || v <= 0) || !Number.isInteger(barsAlongLength) || !Number.isInteger(barsAlongWidth)) {
        showError(T.errNumberInputs);
        return;
      }
    }

    const lenLapResult = calculateLengthWithLap(length, barsAlongLength, diameterLen, includeLap, standardBarLength, lapSpliceFactor);
    const widLapResult = calculateLengthWithLap(width, barsAlongWidth, diameterWid, includeLap, standardBarLength, lapSpliceFactor);
    if (!lapGuard(lenLapResult) || !lapGuard(widLapResult)) return;

    const weightAlongLength = lenLapResult.totalLength * weightPerMeter(diameterLen) * wastageFactor;
    const weightAlongWidth = widLapResult.totalLength * weightPerMeter(diameterWid) * wastageFactor;

    breakdownRows.push({
      label: `${T.lengthwiseBars} (<bdi dir="ltr">Ø${diameterLen}mm</bdi>)`,
      value: `${barsAlongLength} ${T.barsLabel} · ${weightAlongLength.toFixed(2)} kg${wasteNote}`
    });
    breakdownRows.push({
      label: `${T.widthwiseBars} (<bdi dir="ltr">Ø${diameterWid}mm</bdi>)`,
      value: `${barsAlongWidth} ${T.barsLabel} · ${weightAlongWidth.toFixed(2)} kg${wasteNote}`
    });
    scheduleRows.push({ dia: diameterLen, shape: T.shapeStraight, count: barsAlongLength, cut: length, total: lenLapResult.totalLength });
    scheduleRows.push({ dia: diameterWid, shape: T.shapeStraight, count: barsAlongWidth, cut: width, total: widLapResult.totalLength });

    addDiameter(diameterLen, lenLapResult.totalLength * memberQuantity);
    addDiameter(diameterWid, widLapResult.totalLength * memberQuantity);

    results.totalWeight = (weightAlongLength + weightAlongWidth) * memberQuantity;
    results.totalCost = costPerKg === null ? null : results.totalWeight * costPerKg;
    inputsValid = true;
  }
  else if (selectedElement === 'one_way') {
    const distLength = parseFloat(document.getElementById('one-way-dist-length').value);
    const barLength = parseFloat(document.getElementById('one-way-bar-length').value);
    const spacing = parseFloat(document.getElementById('one-way-spacing').value);
    const diameter = parseFloat(document.getElementById('one-way-diameter').value);

    description = `${distLength} m`;

    if ([distLength, barLength, spacing, diameter].every(v => !isNaN(v) && v > 0)) {
      const numBars = Math.ceil((distLength * 1000) / spacing) + 1;
      const lapResult = calculateLengthWithLap(barLength, numBars, diameter, includeLap, standardBarLength, lapSpliceFactor);
      if (!lapGuard(lapResult)) return;

      const weight = lapResult.totalLength * weightPerMeter(diameter) * wastageFactor;
      breakdownRows.push({
        label: `${T.oneWay} (<bdi dir="ltr">Ø${diameter}mm</bdi>)`,
        value: `${numBars} ${T.barsLabel} · ${weight.toFixed(2)} kg${wasteNote}`
      });
      scheduleRows.push({ dia: diameter, shape: T.shapeStraight, count: numBars, cut: barLength, total: lapResult.totalLength });

      addDiameter(diameter, lapResult.totalLength * memberQuantity);
      results.totalWeight = weight * memberQuantity;
      results.totalCost = costPerKg === null ? null : results.totalWeight * costPerKg;
      inputsValid = true;
    }
  }
  else if (isCustom) {
    const rows = [...document.querySelectorAll('#steel-custom-rows .custom-bar-row')];
    let anyRow = false;
    const descPairs = [];
    rows.forEach((row, idx) => {
      const diameter = parseFloat(row.querySelector('.custom-diameter')?.value);
      const count = Number(row.querySelector('.custom-count')?.value);
      const barLength = parseFloat(row.querySelector('.custom-length')?.value);
      if (!Number.isFinite(diameter) || diameter <= 0) return;
      if (!Number.isFinite(count) || count <= 0 || !Number.isInteger(count)) return;
      if (!Number.isFinite(barLength) || barLength <= 0) return;

      const lapResult = calculateLengthWithLap(barLength, count, diameter, includeLap, standardBarLength, lapSpliceFactor);
      if (!lapGuard(lapResult)) return;

      const weight = lapResult.totalLength * weightPerMeter(diameter) * wastageFactor;
      breakdownRows.push({
        label: `<bdi dir="ltr">Ø${diameter}mm</bdi>`,
        value: `${count} ${T.barsLabel} × ${barLength} m · ${weight.toFixed(2)} kg (${T.withWastage})`
      });
      scheduleRows.push({ dia: diameter, shape: T.shapeStraight, count: count, cut: barLength, total: lapResult.totalLength });
      addDiameter(diameter, lapResult.totalLength);
      results.totalWeight = (results.totalWeight || 0) + weight;
      descPairs.push(`Ø${diameter}:${count}`);
      anyRow = true;
    });
    if (!anyRow) { showError(T.errCustomRows); return; }
    description = descPairs.join('; ');
    results.totalCost = costPerKg === null ? null : results.totalWeight * costPerKg;
    inputsValid = true;
  }
  else if (selectedElement === 'beam' || selectedElement === 'column') {
    const isBeam = selectedElement === 'beam';
    const length = parseFloat(document.getElementById(isBeam ? 'beam-length' : 'column-height').value);
    description = `${length} m`;

    const numBars = Number(document.getElementById(`${selectedElement}-bars`).value);
    const diameter = parseFloat(document.getElementById(`${selectedElement}-diameter`).value);

    if (!Number.isFinite(length) || !Number.isFinite(numBars) || !Number.isFinite(diameter) || length <= 0 || numBars <= 0 || diameter <= 0 || !Number.isInteger(numBars)) {
      showError(T.errMainBars);
      return;
    }

    const lapResult = calculateLengthWithLap(length, numBars, diameter, includeLap, standardBarLength, lapSpliceFactor);
    if (!lapGuard(lapResult)) return;

    const mainWeight = lapResult.totalLength * weightPerMeter(diameter) * wastageFactor;
    addDiameter(diameter, lapResult.totalLength * memberQuantity);
    breakdownRows.push({
      label: `${T.mainBarDetails} (<bdi dir="ltr">Ø${diameter}mm</bdi>)`,
      value: `${numBars} ${T.barsLabel} · ${mainWeight.toFixed(2)} kg${wasteNote}`
    });
    scheduleRows.push({ dia: diameter, shape: T.shapeStraight, count: numBars, cut: length, total: lapResult.totalLength });

    let stirrupWeight = 0;
    const includeStirrups = document.getElementById(`${selectedElement}-include-stirrups`).checked;
    if (includeStirrups) {
      const elWidth = parseFloat(document.getElementById(`${selectedElement}-width-dim`).value);
      const elDepth = parseFloat(document.getElementById(`${selectedElement}-depth-dim`).value);
      const cover = parseFloat(document.getElementById(`${selectedElement}-cover`).value);
      const stirrupSpacing = parseFloat(document.getElementById(`${selectedElement}-stirrup-spacing`).value);
      const stirrupDiameter = parseFloat(document.getElementById(`${selectedElement}-stirrup-diameter`).value);

      if ([elWidth, elDepth, cover, stirrupSpacing, stirrupDiameter].some(v => !Number.isFinite(v) || v <= 0) || elWidth <= 2 * cover + stirrupDiameter || elDepth <= 2 * cover + stirrupDiameter) {
        showError(T.errStirrups);
        return;
      }
      const singleStirrupLength = (2 * (elWidth - 2 * cover) + 2 * (elDepth - 2 * cover) + 2 * (10 * stirrupDiameter)) / 1000;
      const numStirrups = Math.ceil((length * 1000) / stirrupSpacing) + 1;
      const stirrupTotalLength = numStirrups * singleStirrupLength;
      stirrupWeight = stirrupTotalLength * weightPerMeter(stirrupDiameter) * wastageFactor;
      addDiameter(stirrupDiameter, stirrupTotalLength * memberQuantity);
      breakdownRows.push({
        label: `${T.stirrupDetails} (<bdi dir="ltr">Ø${stirrupDiameter}mm</bdi>)`,
        value: `${numStirrups} ${T.barsLabel} · ${stirrupWeight.toFixed(2)} kg${wasteNote}`
      });
      scheduleRows.push({
        dia: stirrupDiameter,
        shape: `${T.shapeRing} ${elWidth - 2 * cover}×${elDepth - 2 * cover} mm`,
        count: numStirrups, cut: singleStirrupLength, total: stirrupTotalLength
      });
    }

    results.totalWeight = (mainWeight + stirrupWeight) * memberQuantity;
    results.totalCost = costPerKg === null ? null : results.totalWeight * costPerKg;
    inputsValid = true;
  }

  if (!inputsValid) {
    showError(T.errRequiredFields);
    return;
  }

  const elementKey = { one_way: 'oneWay', brc: 'brcMesh' }[selectedElement] || selectedElement;
  const elementName = isCustom ? T.customBars : (T[elementKey] || selectedElement);
  lastCalcData.steel = {
    element: elementName,
    description: description,
    weight: isBrc ? brcOrder.pieceText : `${results.totalWeight.toFixed(2)} kg`,
    cost: results.totalCost === null ? T.costNotEntered : `${currency}${results.totalCost.toFixed(2)}`,
    quoteLines: isBrc
      ? [{ item: `${elementName} · ${brcOrder.value}`, qty: brcOrder.pieceText, unitPrice: brcOrder.price }]
      : Object.keys(byDiameter).map(Number).sort((a, b) => b - a).map(d => {
          const meters = byDiameter[d];
          const weight = meters * weightPerMeter(d) * wastageFactor;
          const barsToBuy = Math.ceil(meters / standardBarLength);
          return {
            item: `Ø${d} mm`,
            qty: `${weight.toFixed(2)} kg ≈ ${barsToBuy} ${T.barsLabel} (${standardBarLength} m)`,
            unitPrice: costPerKg
          };
        })
  };

  if (!window.__langRecalc) sessionResults.steel.push(lastCalcData.steel);
  renderSessionTable('steel');

  /* ---- flat result rows: breakdown (details) -> order by diameter ->
           total weight (headline) -> grand total (cost). ---- */
  const rows = [];
  breakdownRows.forEach(r => rows.push({ kind: 'detail', label: r.label, value: r.value }));

  if (includeLap && results.totalSplices > 0) {
    rows.push({ kind: 'detail', label: T.totalNumberOfSplices, value: String(results.totalSplices) });
    rows.push({ kind: 'detail', label: T.totalLapLengthAdded, value: `${results.totalLapLength.toFixed(2)} m` });
  }

  Object.keys(byDiameter).map(Number).sort((a, b) => b - a).forEach(d => {
    const meters = byDiameter[d];
    const weight = meters * weightPerMeter(d) * wastageFactor;
    const barsToBuy = Math.ceil(meters / standardBarLength);
    rows.push({
      kind: 'order',
      label: `<bdi dir="ltr">Ø${d} mm</bdi>`,
      value: `${weight.toFixed(2)} kg ≈ ${barsToBuy} ${T.barsLabel} (${standardBarLength} m)`
    });
  });

  rows.push({ kind: 'order', label: isBrc && brcOrder ? brcOrder.label : T.totalWeight,
              value: isBrc && brcOrder ? brcOrder.value : `${results.totalWeight.toFixed(2)} kg` });
  rows.push({ kind: 'cost', label: T.totalCost, value: results.totalCost === null ? T.costNotEntered : `${currency}${results.totalCost.toFixed(2)}` });

  let resultsHTML = `
    <div class="result-card">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-base font-bold header-title">${T.resultSteel} (${elementName})</h3>
        <div class="flex gap-2">
          <button type="button" class="btn btn-secondary result-action-btn save-history-btn" title="${T.saveToHistoryTitle}">
            <i data-lucide="save" class="w-4 h-4 pointer-events-none"></i>
            <span data-lang="saveBtn">${T.saveBtn}</span>
          </button>
          <button type="button" class="btn btn-secondary result-action-btn export-csv-btn" title="${T.exportCsvTitle}">
            <i data-lucide="file-spreadsheet" class="w-4 h-4 pointer-events-none"></i>
            <span data-lang="csvBtn">${T.csvBtn}</span>
          </button>
          <button type="button" class="btn btn-secondary result-action-btn export-btn" title="${T.exportPdfTitle}">
            <i data-lucide="printer" class="w-4 h-4 pointer-events-none"></i>
            <span data-lang="pdfBtn">${T.pdfBtn}</span>
          </button>
<button type="button" class="btn btn-secondary result-action-btn quote-btn" title="${T.quoteBtn}">
                                    <i data-lucide="file-text" class="w-4 h-4 pointer-events-none"></i>
                                    <span data-lang="quoteBtn">${T.quoteBtn}</span>
                                </button>
        </div>
      </div>
      <div class="result-content">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-start">
          ${rows.map(r => `<div class="result-item" data-kind="${r.kind}"><span><strong class="font-semibold block">${r.label}</strong> ${r.value}</span></div>`).join('\n          ')}
        </div>
        ${scheduleRows.length ? `
        <details class="bar-schedule card p-3 mt-2 sm:col-span-2 text-sm text-start">
          <summary class="font-semibold">${T.barSchedule}</summary>
          <div class="table-wrapper mt-2">
            <table class="w-full text-start">
              <thead>
                <tr>
                  <th class="text-start">${T.schedMark}</th>
                  <th class="text-start">${T.schedDia}</th>
                  <th class="text-start">${T.schedShape}</th>
                  <th class="text-start">${T.schedBars}</th>
                  <th class="text-start">${T.schedCutLen}</th>
                  <th class="text-start">${T.schedTotalLen}</th>
                  <th class="text-start">${T.schedWeight}</th>
                </tr>
              </thead>
              <tbody>
                ${scheduleRows.map((r, i) => `<tr>
                  <td>${i + 1}</td>
                  <td><bdi dir="ltr">Ø${r.dia} mm</bdi></td>
                  <td>${r.shape}</td>
                  <td>${r.count}</td>
                  <td>${r.cut.toFixed(2)}</td>
                  <td>${r.total.toFixed(2)}</td>
                  <td>${(r.total * weightPerMeter(r.dia)).toFixed(2)}</td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>
          <p class="text-xs mt-2" style="color: var(--muted);">${fill(T.schedNote, { n: memberQuantity })}</p>
        </details>` : ''}
      </div>
    </div>`;

  const resultDiv = document.getElementById('steel-result');
  resultDiv.innerHTML = resultsHTML;
  resultDiv.classList.remove('hidden');
  window.lucide?.createIcons?.();
  errorBox.classList.add('hidden');

  // Smooth scroll to the result
  setTimeout(() => {
    if (!window.__langRecalc) resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
};
