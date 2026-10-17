/* calc-blocks.js — lazy-loaded calculator chunk. Loaded by app.js on first use
   (tab open or Calculate tap); registers its handler instead of running at startup. */
window.__calcHandlers = window.__calcHandlers || {};
window.__calcHandlers.blocks = function (ctx) {
  const { translations, fill, getCementBagMass, getCurrency, getWastageFactor, renderSessionTable, showError, sessionResults, lastCalcData, errorBox } = ctx;
                const lang = localStorage.getItem('language') || 'en';
                const T = translations[lang];

                const blockOpt = document.getElementById('block-type').options[document.getElementById('block-type').selectedIndex];
                const blockCustom = blockOpt.value === 'custom';
                const blockLengthM = blockCustom ? Number(document.getElementById('block-custom-length').value) / 1000 : parseFloat(blockOpt.getAttribute('data-length')) / 1000;
                const blockWidthM = blockCustom ? Number(document.getElementById('block-custom-width').value) / 1000 : parseFloat(blockOpt.getAttribute('data-width'));
                const blockHeightM = blockCustom ? Number(document.getElementById('block-custom-height').value) / 1000 : parseFloat(blockOpt.getAttribute('data-height')) / 1000;
                
                if ([blockLengthM, blockWidthM, blockHeightM].some(v => isNaN(v) || v <= 0)) {
                    showError(T.errBlockDims);
                    return;
                }

                const blockCost = Number(document.getElementById('block-cost').value || 0);
                const cementCost = Number(document.getElementById('block-cement-cost').value || 0);
                const sandCost = Number(document.getElementById('block-sand-cost').value || 0);
                const includeMortar = document.getElementById('block-include-mortar').checked;
                const mortarRatioParts = document.getElementById('block-mortar-ratio').value.split(':').map(Number);
                const cementDensity = Number(document.getElementById('block-cement-density').value);
                if ([blockCost, cementCost, sandCost].some(v => !Number.isFinite(v) || v < 0) || !Number.isFinite(cementDensity) || cementDensity <= 0 || mortarRatioParts.some(v => !Number.isFinite(v) || v <= 0)) { showError(T.errRequiredFields); return; }

                const mode = document.querySelector('input[name="block-mode"]:checked').value;
                let totalWallVolume, length, height, dimsWallWidth = null;
                let totalOpeningVolumeForDisplay = 'N/A';
                let hasOpenings = false;
                
                if (mode === 'volume') {
                    // Total volume already includes the wall thickness, so the number of
                    // blocks follows from the block module alone (length × height × block
                    // width). No wall-thickness or leaves input is needed in this mode.
                    totalWallVolume = Number(document.getElementById('block-wall-volume').value);
                    if (!Number.isFinite(totalWallVolume) || totalWallVolume <= 0) {
                        showError(T.errDimsWallWidth);
                        return;
                    }
                    length = null; height = null;
                } else if (mode === 'dims') {
                    const wallWidth = parseFloat(document.getElementById('block-wall-width-input').value);
                    length = parseFloat(document.getElementById('block-wall-length').value);
                    height = parseFloat(document.getElementById('block-wall-height').value);
                    
                    if ([length, height, wallWidth].some(v => isNaN(v) || v <= 0)) {
                        showError(T.errDimsWallWidth);
                        return;
                    }
                    
                    const grossWallVolume = length * height * wallWidth;
                    dimsWallWidth = wallWidth;
                    const numWindows = Number(document.getElementById('block-num-windows').value);
                    const windowWidth = Number(document.getElementById('block-window-width').value);
                    const windowHeight = Number(document.getElementById('block-window-height').value);
                    const numDoors = Number(document.getElementById('block-num-doors').value);
                    const doorWidth = Number(document.getElementById('block-door-width').value);
                    const doorHeight = Number(document.getElementById('block-door-height').value);
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
                const singleBlockVolume = blockLengthM * blockWidthM * blockHeightM;
                let blocksNeededUnwasted, mortarVolume = 0, cementBags = 0, sandVolume = 0, cementWeight = 0;
                
                // Wall leaves are explicit in dimensions mode and are not multiplied again in total-volume mode.
                const mortarThicknessM = includeMortar ? Number(document.getElementById('block-mortar-thickness').value) / 100 : 0;
                const mortarDryFactor = includeMortar ? Number(document.getElementById('block-mortar-dry-factor').value) : 1;
                const wallThicknessM = dimsWallWidth || blockWidthM;
                if (!Number.isFinite(mortarThicknessM) || mortarThicknessM < 0 || !Number.isFinite(mortarDryFactor) || mortarDryFactor < 1 || !Number.isFinite(wallThicknessM) || wallThicknessM <= 0) { showError(T.errRequiredFields); return; }
                const requestedLeaves = mode === 'dims' ? Number(document.getElementById('block-leaves')?.value) : 1;
                if (!Number.isInteger(requestedLeaves) || requestedLeaves < 1) { showError(T.errDimsWallWidth); return; }
                const leaves = requestedLeaves;
                const impliedThicknessM = leaves * blockWidthM + Math.max(0, leaves - 1) * mortarThicknessM;
                if (Math.abs(impliedThicknessM - wallThicknessM) > 0.011) {
                    showError(`${T.errWallThicknessMismatch}: ${blockWidthM.toFixed(3)} m block × ${leaves} leaf${leaves === 1 ? '' : 's'} with ${mortarThicknessM.toFixed(3)} m joints implies ${impliedThicknessM.toFixed(3)} m, but wall is ${wallThicknessM.toFixed(3)} m.`);
                    return;
                }
                const netWallArea = totalWallVolume / wallThicknessM;
                const unitFaceArea = (blockLengthM + mortarThicknessM) * (blockHeightM + mortarThicknessM);
                blocksNeededUnwasted = (netWallArea / unitFaceArea) * leaves;
                if (includeMortar) {
                    mortarVolume = totalWallVolume - (blocksNeededUnwasted * singleBlockVolume);
                    if (mortarVolume < -1e-9) { showError(T.errRequiredFields); return; }
                    mortarVolume = Math.max(0, mortarVolume);
                    if (mortarVolume > 0) {
                        const dryMortarVolume = mortarVolume * mortarDryFactor;
                        const sumOfRatio = mortarRatioParts.reduce((a, b) => a + b, 0);
                        const cementVolume = (dryMortarVolume * mortarRatioParts[0]) / sumOfRatio;
                        sandVolume = (dryMortarVolume * mortarRatioParts[1]) / sumOfRatio;
                        cementWeight = cementVolume * cementDensity;
                        cementBags = Math.ceil((cementWeight * wastageFactor) / getCementBagMass());
                        sandVolume *= wastageFactor;
                    }
                }
                
                const blocksNeeded = Math.ceil(blocksNeededUnwasted * wastageFactor);
                const totalBlockCost = blocksNeeded * blockCost;
                const totalCementCost = cementBags * cementCost;
                const totalSandCost = sandVolume * sandCost;
                const totalCost = totalBlockCost + totalCementCost + totalSandCost;
                
                const materialCostsComplete = [blockCost, cementCost, sandCost].every(v => Number.isFinite(v) && v >= 0);
                const currency = getCurrency();
                const hollowGroutNote = blockOpt.value === 'hollow' ? T.hollowBlockNote : '';

                lastCalcData.blocks = {
                    volume: `${totalWallVolume.toFixed(2)} m³`,
                    blocks: `${blocksNeeded} ${T.piecesWord}`,
                    cement: includeMortar ? `${cementBags} ${T.bagsWord}` : 'N/A',
                    sand: includeMortar ? `${sandVolume.toFixed(2)} m³` : 'N/A',
                    cost: materialCostsComplete ? `${currency}${totalCost.toFixed(2)}` : T.costNotEntered
                };
                
                if (!window.__langRecalc) sessionResults.blocks.push(lastCalcData.blocks);
                renderSessionTable('blocks');
                
                const resultDiv = document.getElementById('blocks-result');
                let mortarResultsHTML = '', costResultsHTML = '';
                
                if (includeMortar && mortarVolume > 0) {
                    mortarResultsHTML = `
                        <div class="result-item flex items-center gap-2" data-kind="detail"><i data-lucide="blending"></i><span><strong class="font-semibold block">${T.mortarVolume}</strong> ${mortarVolume.toFixed(3)} m³</span></div>
                        <div class="result-item flex items-center gap-2" data-kind="order"><i data-lucide="shopping-bag"></i><span><strong class="font-semibold block">${T.cementBags}</strong> ${cementBags} ${T.bagsWord}</span></div>
                        <div class="result-item flex items-center gap-2" data-kind="detail"><i data-lucide="scale"></i><span><strong class="font-semibold block">${T.cementWeight}</strong> ${cementWeight.toFixed(2)} kg</span></div>
                        <div class="result-item flex items-center gap-2" data-kind="order"><i data-lucide="waves"></i><span><strong class="font-semibold block">${T.sand}</strong> ${sandVolume.toFixed(3)} m³</span></div>
                    `;
                    costResultsHTML = `
                        <div class="result-item flex items-center gap-2" data-kind="cost"><i data-lucide="wallet"></i><span><strong class="font-semibold block">${T.blockCost}</strong> ${currency}${totalBlockCost.toFixed(2)}</span></div>
                        <div class="result-item flex items-center gap-2" data-kind="cost"><i data-lucide="wallet"></i><span><strong class="font-semibold block">${T.cementCost}</strong> ${currency}${totalCementCost.toFixed(2)}</span></div>
                        <div class="result-item flex items-center gap-2 col-span-2" data-kind="cost"><i data-lucide="wallet"></i><span><strong class="font-semibold block">${T.sandCost}</strong> ${currency}${totalSandCost.toFixed(2)}</span></div>
                    `;
                } else {
                    costResultsHTML = `
                        <div class="result-item flex items-center gap-2 col-span-2" data-kind="cost"><i data-lucide="wallet"></i><span><strong class="font-semibold block">${T.blockCost}</strong> ${currency}${totalBlockCost.toFixed(2)}</span></div>
                    `;
                }

                resultDiv.innerHTML = `
                    <div class="result-card">
                        <div class="flex justify-between items-center mb-2">
                            <h3 class="text-base font-bold header-title">${T.resultBlocks}</h3>
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
                                <div class="result-item flex items-center gap-2" data-kind="order"><i data-lucide="table-2"></i><span><strong class="font-semibold block">${T.totalBlocks}</strong> ${blocksNeeded}</span></div>
                                 
                                 ${mortarResultsHTML}

                                 ${hasOpenings ? `<div class="result-item flex items-center gap-2 sm:col-span-2 text-start" data-kind="detail"><i data-lucide="scan"></i><span><strong class="font-semibold block">${T.totalOpeningVolume}</strong> ${totalOpeningVolumeForDisplay}</span></div>` : ''}
                                ${hollowGroutNote ? `<div class="result-item flex items-center gap-2 sm:col-span-2 text-start"><i data-lucide="info"></i><span>${hollowGroutNote}</span></div>` : ''}
                                <details class="calculation-trail card p-3 mt-2 sm:col-span-2 text-sm text-start"><summary class="font-semibold">${T.calculationDetails || 'Calculation details'}</summary><div class="mt-2 space-y-1"><div>${mode === 'volume' ? `${T.totalWallVolume}: ${totalWallVolume.toFixed(3)} m³` : `${T.totalWallVolume}: ${totalWallVolume.toFixed(3)} m³; ${T.wallWidth}: ${wallThicknessM.toFixed(3)} m; ${T.wallLeaves}: ${leaves}`}</div><div>${T.totalBlocks}: ${blocksNeededUnwasted.toFixed(2)} ${T.trailBeforeWaste} + ${(blocksNeeded - blocksNeededUnwasted).toFixed(2)} ${T.wasteWord} = ${blocksNeeded} ${T.orderedWord}</div><div>${T.mortarVolume}: ${fill(T.trailNetToBatch, { a: mortarVolume.toFixed(3), b: (mortarVolume * mortarDryFactor > 0 ? (mortarVolume * wastageFactor).toFixed(3) : '0.000'), c: (mortarVolume * wastageFactor - mortarVolume).toFixed(3) })}; ${T.mortarDryFactor}: ${mortarDryFactor.toFixed(2)}; ${T.mortarMixRatio}: ${mortarRatioParts.join(':')}</div>${hasOpenings ? `<div>${T.totalOpeningVolume}: ${totalOpeningVolumeForDisplay}</div>` : ''}${hollowGroutNote ? `<div>${hollowGroutNote}</div>` : ''}</div></details>
                               
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
                    if (!window.__langRecalc) resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
};
