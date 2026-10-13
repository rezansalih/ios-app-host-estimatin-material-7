/* calc-bricks.js — lazy-loaded calculator chunk. Loaded by app.js on first use
   (tab open or Calculate tap); registers its handler instead of running at startup. */
window.__calcHandlers = window.__calcHandlers || {};
window.__calcHandlers.bricks = function (ctx) {
  const { translations, fill, getCementBagMass, getCurrency, getWastageFactor, renderSessionTable, showError, sessionResults, lastCalcData, errorBox } = ctx;
                const lang = localStorage.getItem('language') || 'en';
                const T = translations[lang];

                const brickOpt = document.getElementById('brick-type').options[document.getElementById('brick-type').selectedIndex];
                const brickCustom = brickOpt.value === 'custom';
                // All preset data-* attributes are millimetres; every dimension is converted to metres once, here.
                const brickLengthM = brickCustom ? Number(document.getElementById('brick-custom-length')?.value) / 1000 : parseFloat(brickOpt.getAttribute('data-length')) / 1000;
                const brickWidthM = brickCustom ? Number(document.getElementById('brick-custom-width')?.value) / 1000 : parseFloat(brickOpt.getAttribute('data-width')) / 1000;
                const brickHeightM = brickCustom ? Number(document.getElementById('brick-custom-height')?.value) / 1000 : parseFloat(brickOpt.getAttribute('data-height')) / 1000;
                
                if ([brickLengthM, brickWidthM, brickHeightM].some(v => isNaN(v) || v <= 0)) {
                    showError(T.errBrickDims);
                    return;
                }

                const brickCost = Number(document.getElementById('brick-cost').value || 0);
                const cementCost = Number(document.getElementById('brick-cement-cost').value || 0);
                const sandCost = Number(document.getElementById('brick-sand-cost').value || 0);
                const includeMortar = document.getElementById('brick-include-mortar').checked;
                const mortarRatioParts = document.getElementById('brick-mortar-ratio').value.split(':').map(Number);
                const cementDensity = Number(document.getElementById('brick-cement-density').value);
                if ([brickCost, cementCost, sandCost].some(v => !Number.isFinite(v) || v < 0) || !Number.isFinite(cementDensity) || cementDensity <= 0 || mortarRatioParts.some(v => !Number.isFinite(v) || v <= 0)) { showError(T.errRequiredFields); return; }

                const mode = document.querySelector('input[name="brick-mode"]:checked').value;
                let totalWallVolume, length, height, dimsWallWidth = null;
                let totalOpeningVolumeForDisplay = 'N/A';
                let hasOpenings = false;

                if (mode === 'volume') {
                    totalWallVolume = Number(document.getElementById('brick-wall-volume').value);
                    const volumeWallThickness = Number(document.getElementById('brick-volume-wall-thickness').value);
                    const volumeLeaves = Number(document.getElementById('brick-volume-leaves').value);
                    if (!Number.isFinite(totalWallVolume) || totalWallVolume <= 0 || !Number.isFinite(volumeWallThickness) || volumeWallThickness <= 0 || !Number.isInteger(volumeLeaves) || volumeLeaves < 1) {
                        showError(T.errDimsWallWidth);
                        return;
                    }
                    dimsWallWidth = volumeWallThickness;
                    length = null; height = null;
                } else if (mode === 'dims') {
                    const wallWidth = parseFloat(document.getElementById('brick-wall-width-input').value);
                    length = parseFloat(document.getElementById('brick-wall-length').value);
                    height = parseFloat(document.getElementById('brick-wall-height').value);
                    
                    if ([length, height, wallWidth].some(v => isNaN(v) || v <= 0)) {
                        showError(T.errDimsWallWidth);
                        return;
                    }
                    
                    const grossWallVolume = length * height * wallWidth;
                    dimsWallWidth = wallWidth;
                    const numWindows = Number(document.getElementById('brick-num-windows').value);
                    const windowWidth = Number(document.getElementById('brick-window-width').value);
                    const windowHeight = Number(document.getElementById('brick-window-height').value);
                    const numDoors = Number(document.getElementById('brick-num-doors').value);
                    const doorWidth = Number(document.getElementById('brick-door-width').value);
                    const doorHeight = Number(document.getElementById('brick-door-height').value);
                    if ([numWindows, windowWidth, windowHeight, numDoors, doorWidth, doorHeight].some(v => !Number.isFinite(v) || v < 0) || !Number.isInteger(numWindows) || !Number.isInteger(numDoors)) { showError(T.errOpeningDimensions); return; }
                    if ((numWindows > 0 && (windowWidth <= 0 || windowHeight <= 0)) || (numDoors > 0 && (doorWidth <= 0 || doorHeight <= 0))) { showError(T.errOpeningDimensions); return; }
                    
                    const totalOpeningVolumeToSubtract = (numWindows * windowWidth * windowHeight * wallWidth) + (numDoors * doorWidth * doorHeight * wallWidth);
                    totalWallVolume = grossWallVolume - totalOpeningVolumeToSubtract;
                    
                    if (!Number.isFinite(totalWallVolume) || totalWallVolume <= 0) {
                        showError(T.errOpeningExceeds);
                        return;
                    }
                    hasOpenings = totalOpeningVolumeToSubtract > 0;
                    const openingsTemplate = T.openingsDeducted || 'Deducted {v} m³: {nw} window(s) {ww}×{wh} m + {nd} door(s) {dw}×{dh} m, × wall thickness';
                    totalOpeningVolumeForDisplay = openingsTemplate
                        .replace('{v}', totalOpeningVolumeToSubtract.toFixed(3))
                        .replace('{nw}', numWindows).replace('{ww}', windowWidth).replace('{wh}', windowHeight)
                        .replace('{nd}', numDoors).replace('{dw}', doorWidth).replace('{dh}', doorHeight);
                }

                const wastageFactor = getWastageFactor();
                if (wastageFactor === null) return;
                const singleBrickVolume = brickLengthM * brickWidthM * brickHeightM;
                let bricksNeededUnwasted, mortarVolumeNet = 0, mortarVolumeOrder = 0, cementBags = 0, sandVolume = 0, cementWeight = 0;
                
                // Wall leaves are explicit in dimensions mode and are not multiplied again in total-volume mode.
                const mortarThicknessM = includeMortar ? Number(document.getElementById('brick-mortar-thickness').value) / 100 : 0;
                const mortarDryFactor = includeMortar ? Number(document.getElementById('brick-mortar-dry-factor').value) : 1;
                const wallThicknessM = dimsWallWidth || brickWidthM;
                if (!Number.isFinite(mortarThicknessM) || mortarThicknessM < 0 || !Number.isFinite(mortarDryFactor) || mortarDryFactor < 1 || !Number.isFinite(wallThicknessM) || wallThicknessM <= 0) { showError(T.errRequiredFields); return; }
                const requestedLeaves = mode === 'dims' ? Number(document.getElementById('brick-leaves')?.value) : Number(document.getElementById('brick-volume-leaves').value);
                if (!Number.isInteger(requestedLeaves) || requestedLeaves < 1) { showError(T.errDimsWallWidth); return; }
                const leaves = requestedLeaves;
                const impliedThicknessM = leaves * brickWidthM + Math.max(0, leaves - 1) * mortarThicknessM;
                if (Math.abs(impliedThicknessM - wallThicknessM) > 0.011) { showError(`${T.errWallThicknessMismatch}: ${brickWidthM.toFixed(3)} m brick × ${leaves} leaf${leaves === 1 ? '' : 's'} with ${mortarThicknessM.toFixed(3)} m joints implies ${impliedThicknessM.toFixed(3)} m, but wall is ${wallThicknessM.toFixed(3)} m.`); return; }
                const netWallArea = totalWallVolume / wallThicknessM;
                const unitFaceArea = (brickLengthM + mortarThicknessM) * (brickHeightM + mortarThicknessM);
                bricksNeededUnwasted = (netWallArea / unitFaceArea) * leaves;
                // Per m2 of WALL FACE (all leaves), so bricksPerM2 x face area = bricks required.
                const bricksPerM2 = leaves / unitFaceArea;
                if (includeMortar) {
                    mortarVolumeNet = totalWallVolume - (bricksNeededUnwasted * singleBrickVolume);
                    if (mortarVolumeNet < -1e-9) { showError(T.errRequiredFields); return; }
                    mortarVolumeNet = Math.max(0, mortarVolumeNet);
                    // Wastage is applied once, to the wet mortar, so cement and sand inherit it
                    // and the shown quantities reconcile with the shown mortar volume.
                    mortarVolumeOrder = mortarVolumeNet * wastageFactor;
                    if (mortarVolumeOrder > 1e-6) {
                        const dryMortarVolume = mortarVolumeOrder * mortarDryFactor;
                        const sumOfRatio = mortarRatioParts.reduce((a, b) => a + b, 0);
                        const cementVolume = (dryMortarVolume * mortarRatioParts[0]) / sumOfRatio;
                        sandVolume = (dryMortarVolume * mortarRatioParts[1]) / sumOfRatio;
                        cementWeight = cementVolume * cementDensity;
                        cementBags = Math.ceil(cementWeight / getCementBagMass());
                    }
                }

                const bricksNeeded = Math.ceil(bricksNeededUnwasted * wastageFactor);
                const totalBrickCost = bricksNeeded * brickCost;
                const totalCementCost = cementBags * cementCost;
                const totalSandCost = sandVolume * sandCost;
                const totalCost = totalBrickCost + totalCementCost + totalSandCost;
                
                const materialCostsComplete = [brickCost, cementCost, sandCost].every(v => Number.isFinite(v) && v >= 0);
                const currency = getCurrency();
                const hollowBrickNote = brickOpt.value === 'hollow_brick' ? T.hollowBrickNote : '';
                // Masonry mortar needs roughly 0.6 L of water per kg of cement. Use the cement
                // actually batched, not whole bags ordered, or small jobs are wildly over-estimated.
                const MORTAR_WATER_PER_KG_CEMENT = 0.6;
                const mixingWaterLitres = cementWeight * MORTAR_WATER_PER_KG_CEMENT;
                const cementOrderedKg = cementBags * getCementBagMass();

                lastCalcData.bricks = {
                    description: mode === 'dims' ? `${length}x${height}m Wall` : `${totalWallVolume.toFixed(2)} m³`,
                    bricks: `${bricksNeeded} pcs`,
                    mortarCement: includeMortar ? `${cementBags} bags` : 'N/A',
                    mortarSand: includeMortar ? `${sandVolume.toFixed(2)} m³` : 'N/A',
                    cost: materialCostsComplete ? `${currency}${totalCost.toFixed(2)}` : T.costNotEntered
                };

                sessionResults.bricks.push(lastCalcData.bricks);
                renderSessionTable('bricks');

                const resultDiv = document.getElementById('bricks-result');
                let mortarResultsHTML = '', costResultsHTML = '';
                
                if (includeMortar && mortarVolumeOrder > 1e-6) {
                    mortarResultsHTML = `
                        <div class="result-item flex items-center gap-2" data-kind="detail"><i data-lucide="blending"></i><span><strong class="font-semibold block">${T.mortarVolume}</strong> ${mortarVolumeOrder.toFixed(3)} m³ <span class="text-xs opacity-75">(${mortarVolumeNet.toFixed(3)} ${T.netWord} + ${(mortarVolumeOrder - mortarVolumeNet).toFixed(3)} ${T.wasteWord})</span></span></div>
                        <div class="result-item flex items-center gap-2" data-kind="order"><i data-lucide="shopping-bag"></i><span><strong class="font-semibold block">${T.cementBags}</strong> ${cementBags} bags</span></div>
                        <div class="result-item flex items-center gap-2" data-kind="detail"><i data-lucide="scale"></i><span><strong class="font-semibold block">${T.cementWeight}</strong> ${cementWeight.toFixed(2)} kg</span></div>
                        <div class="result-item flex items-center gap-2" data-kind="detail"><i data-lucide="droplets"></i><span><strong class="font-semibold block">${T.mixingWaterEstimate}</strong> ${fill(T.trailWaterPerKg, { v: mixingWaterLitres.toFixed(1) })}</span></div>
                        <div class="result-item flex items-center gap-2 col-span-2" data-kind="order"><i data-lucide="waves"></i><span><strong class="font-semibold block">${T.sand}</strong> ${sandVolume.toFixed(3)} m³</span></div>
                    `;
                    costResultsHTML = `
                        <div class="result-item flex items-center gap-2" data-kind="cost"><i data-lucide="wallet"></i><span><strong class="font-semibold block">${T.brickCost}</strong> ${currency}${totalBrickCost.toFixed(2)}</span></div>
                        <div class="result-item flex items-center gap-2" data-kind="cost"><i data-lucide="wallet"></i><span><strong class="font-semibold block">${T.cementCost}</strong> ${currency}${totalCementCost.toFixed(2)}</span></div>
                        <div class="result-item flex items-center gap-2 col-span-2" data-kind="cost"><i data-lucide="wallet"></i><span><strong class="font-semibold block">${T.sandCost}</strong> ${currency}${totalSandCost.toFixed(2)}</span></div>
                    `;
                } else {
                    costResultsHTML = `
                        <div class="result-item flex items-center gap-2 col-span-2" data-kind="cost"><i data-lucide="wallet"></i><span><strong class="font-semibold block">${T.brickCost}</strong> ${currency}${totalBrickCost.toFixed(2)}</span></div>
                    `;
                }
                
                resultDiv.innerHTML = `
                    <div class="result-card">
                        <div class="flex justify-between items-center mb-2">
                            <h3 class="text-base font-bold header-title">${T.resultBricks}</h3>
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
                             </div>
                        </div>
                        <div class="result-content">
                             <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-start">
                                 <div class="result-item flex items-center gap-2" data-kind="detail"><i data-lucide="box-select"></i><span><strong class="font-semibold block">${T.totalWallVolume}</strong> ${totalWallVolume.toFixed(2)} m³</span></div>
                                <div class="result-item flex items-center gap-2" data-kind="order"><i data-lucide="grip-vertical"></i><span><strong class="font-semibold block">${T.totalBricks}</strong> ${bricksNeeded}</span></div>
                                <div class="result-item flex items-center gap-2" data-kind="detail"><i data-lucide="ruler"></i><span><strong class="font-semibold block">${T.bricksPerM2}</strong> ${bricksPerM2.toFixed(1)} ${T.pcsPerM2}</span></div>
                                 
                                 ${mortarResultsHTML}

                                 ${hasOpenings ? `<div class="result-item flex items-center gap-2 sm:col-span-2 text-start" data-kind="detail"><i data-lucide="scan"></i><span><strong class="font-semibold block">${T.totalOpeningVolume}</strong> ${totalOpeningVolumeForDisplay}</span></div>` : ''}
                                ${hollowBrickNote ? `<div class="result-item flex items-center gap-2 sm:col-span-2 text-start"><i data-lucide="info"></i><span>${hollowBrickNote}</span></div>` : ''}
                                <details class="calculation-trail card p-3 mt-2 sm:col-span-2 text-sm text-start"><summary class="font-semibold">${T.brickCalculationDetails}</summary><div class="mt-2 space-y-1"><div>${T.totalWallVolume}: ${totalWallVolume.toFixed(3)} m³; ${T.wallWidth}: ${wallThicknessM.toFixed(3)} m; ${T.wallLeaves}: ${leaves}</div><div>${T.totalBricks}: ${bricksNeededUnwasted.toFixed(2)} ${T.trailBeforeWaste} + ${(bricksNeeded - bricksNeededUnwasted).toFixed(2)} ${T.wasteWord} = ${bricksNeeded} ${T.orderedWord}</div><div>${T.mortarVolume}: ${fill(T.trailNetToBatch, { a: mortarVolumeNet.toFixed(3), b: mortarVolumeOrder.toFixed(3), c: (mortarVolumeOrder - mortarVolumeNet).toFixed(3) })}; ${T.mortarDryFactor}: ${mortarDryFactor.toFixed(2)}; ${T.mortarMixRatio}: ${mortarRatioParts.join(':')}</div><div>${T.cementWeight}: ${fill(T.trailCementOrdered, { a: cementWeight.toFixed(2), b: cementBags, kg: getCementBagMass(), c: cementOrderedKg.toFixed(0), d: (cementOrderedKg - cementWeight).toFixed(2) })}</div><div>${T.mixingWaterEstimate}: ${fill(T.trailWaterPerKg, { v: mixingWaterLitres.toFixed(1) })}</div>${hasOpenings ? `<div>${T.totalOpeningVolume}: ${totalOpeningVolumeForDisplay}</div>` : ''}${hollowBrickNote ? `<div>${hollowBrickNote}</div>` : ''}</div></details>
                                
                                 <div class="sm:col-span-2 mt-2 pt-2 border-t border-gray-700">
                                     <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-start">
                                         ${costResultsHTML}
                                    </div>
                                 </div>
                                
                                 <div class="col-span-2 text-center mt-2 pt-2 border-t border-gray-700 total-cost-print">
                                     <strong class="font-bold text-lg header-title">${T.totalCost} ${currency}${totalCost.toFixed(2)}</strong>
                                 </div>
                             </div>
                         </div>
                     </div>`;
                resultDiv.classList.remove('hidden');
                window.lucide?.createIcons?.();
                errorBox.classList.add('hidden');
                
                // Smooth scroll to the result
                setTimeout(() => {
                    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
};
