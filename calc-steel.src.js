/* calc-steel.js — lazy-loaded calculator chunk. Loaded by app.js on first use
   (tab open or Calculate tap); registers its handler instead of running at startup. */
window.__calcHandlers = window.__calcHandlers || {};
window.__calcHandlers.steel = function (ctx) {
  const { translations, getCurrency, getWastageFactor, renderSessionTable, showError, sessionResults, lastCalcData, errorBox } = ctx;
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
                const T = translations[lang];

                const selectedElement = document.getElementById('steel-element-selector').value;
                if (!selectedElement) {
                    showError(T.errSelectElement);
                    return;
                }

                const currency = getCurrency();
                const wastageFactor = getWastageFactor();
                if (wastageFactor === null) return;
                const costPerKg = Number(document.getElementById('steel-cost').value || 0);
                const memberQuantity = Number(document.getElementById('steel-member-quantity')?.value || 1);
                if (!Number.isInteger(memberQuantity) || memberQuantity < 1 || !Number.isFinite(costPerKg) || costPerKg < 0) { showError(T.errRequiredFields); return; }
                if (!Number.isFinite(costPerKg) || costPerKg < 0) { showError(T.errRequiredFields); return; }

                const includeLap = document.getElementById('steel-include-lap-splice').checked;
                const standardBarLength = parseFloat(document.getElementById('steel-standard-bar-length').value);
                const lapSpliceFactor = parseFloat(document.getElementById('steel-lap-splice-factor').value);
                
                if (includeLap && (isNaN(standardBarLength) || isNaN(lapSpliceFactor) || standardBarLength <= 0 || lapSpliceFactor <= 0)) {
                    showError(T.errLapSplice);
                    return;
                }

                let results = { totalLapLength: 0, totalSplices: 0 };
                let inputsValid = false;
                let description = '';
                const weightPerMeter = (diameter) => (diameter * diameter) / 162;

                if (selectedElement === 'footing' || selectedElement === 'slab') {
                    const mode = document.querySelector(`input[name="${selectedElement}-mode"]:checked`).value;
                    const length = parseFloat(document.getElementById(`${selectedElement}-length`).value);
                    const width = parseFloat(document.getElementById(`${selectedElement}-width`).value);
                    description = `${length}x${width}m`;

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
                    
                    results.totalLapLength = lenLapResult.totalLapLength + widLapResult.totalLapLength;
                    results.totalSplices = lenLapResult.spliceCount + widLapResult.spliceCount;

                    results = {
                        ...results,
                        barsAlongLength: barsAlongLength,
                        weightAlongLength: lenLapResult.totalLength * weightPerMeter(diameterLen),
                        diameterLen: diameterLen,
                        unitWeightLen: weightPerMeter(diameterLen),
                        barsAlongWidth: barsAlongWidth,
                        weightAlongWidth: widLapResult.totalLength * weightPerMeter(diameterWid),
                        diameterWid: diameterWid,
                        unitWeightWid: weightPerMeter(diameterWid),
                        numberOfBars: barsAlongLength + barsAlongWidth,
                        totalWeight: ((lenLapResult.totalLength * weightPerMeter(diameterLen)) + (widLapResult.totalLength * weightPerMeter(diameterWid))) * wastageFactor,
                    };
                    results.totalCost = results.totalWeight * costPerKg;
                    inputsValid = true;
                } 
                else if (selectedElement === 'one_way') {
                    const distLength = parseFloat(document.getElementById('one-way-dist-length').value);
                    const barLength = parseFloat(document.getElementById('one-way-bar-length').value);
                    const spacing = parseFloat(document.getElementById('one-way-spacing').value);
                    const diameter = parseFloat(document.getElementById('one-way-diameter').value);
                    
                    description = `${distLength}m dist.`;
                    
                    if ([distLength, barLength, spacing, diameter].every(v => !isNaN(v) && v > 0)) {
                        inputsValid = true;
                        const numBars = Math.ceil((distLength * 1000) / spacing) + 1;
                        const lapResult = calculateLengthWithLap(barLength, numBars, diameter, includeLap, standardBarLength, lapSpliceFactor);
                        
                        results.totalLapLength = lapResult.totalLapLength;
                        results.totalSplices = lapResult.spliceCount;
                        
                        results = {
                            ...results,
                            numberOfBars: numBars,
                            totalLength: lapResult.totalLength,
                            unitWeight: weightPerMeter(diameter),
                            totalWeight: lapResult.totalLength * weightPerMeter(diameter) * wastageFactor
                        };
                        results.totalCost = results.totalWeight * costPerKg;
                    }
                }
                else if (selectedElement === 'beam' || selectedElement === 'column') {
                    const isBeam = selectedElement === 'beam';
                    const length = parseFloat(document.getElementById(isBeam ? 'beam-length' : 'column-height').value);
                    description = `${length}m long`;
                    
                    const numBars = Number(document.getElementById(`${selectedElement}-bars`).value);
                    const diameter = parseFloat(document.getElementById(`${selectedElement}-diameter`).value);
                    
                    if (!Number.isFinite(length) || !Number.isFinite(numBars) || !Number.isFinite(diameter) || length <= 0 || numBars <= 0 || diameter <= 0 || !Number.isInteger(numBars)) {
                        showError(T.errMainBars);
                        return;
                    }
                    
                    const lapResult = calculateLengthWithLap(length, numBars, diameter, includeLap, standardBarLength, lapSpliceFactor);
                    results.totalLapLength += lapResult.totalLapLength;
                    results.totalSplices += lapResult.spliceCount;
                    
                    results.mainBars = {
                        numberOfBars: numBars,
                        totalLength: lapResult.totalLength,
                        unitWeight: weightPerMeter(diameter),
                        totalWeight: lapResult.totalLength * weightPerMeter(diameter) * wastageFactor,
                        diameter: diameter
                    };

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
                        } else {
                            const singleStirrupLength = (2 * (elWidth - 2 * cover) + 2 * (elDepth - 2 * cover) + 2 * (10 * stirrupDiameter)) / 1000;
                            const numStirrups = Math.ceil((length * 1000) / stirrupSpacing) + 1;
                            
                            results.stirrups = {
                                numberOfStirrups: numStirrups,
                                singleLength: singleStirrupLength,
                                totalLength: numStirrups * singleStirrupLength,
                                unitWeight: weightPerMeter(stirrupDiameter),
                                totalWeight: (numStirrups * singleStirrupLength) * weightPerMeter(stirrupDiameter) * wastageFactor,
                                diameter: stirrupDiameter
                            };
                        }
                    }
                    results.totalWeight = (results.mainBars.totalWeight + (results.stirrups ? results.stirrups.totalWeight : 0)) * memberQuantity;
                    results.totalCost = results.totalWeight * costPerKg;
                    inputsValid = true;
                }
                
                if (!inputsValid) {
                    showError(T.errRequiredFields);
                    return;
                }

                lastCalcData.steel = {
                    element: T[selectedElement],
                    description: description,
                    weight: `${results.totalWeight.toFixed(2)} kg`,
                    cost: `${currency}${results.totalCost.toFixed(2)}`
                };

                sessionResults.steel.push(lastCalcData.steel);
                renderSessionTable('steel');
                
                let resultsHTML = `
                    <div class="result-card">
                        <div class="flex justify-between items-center mb-2">
                            <h3 class="text-base font-bold header-title">${T.resultSteel} (${T[selectedElement]})</h3>
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
                        <div class="result-content">`;
                
                let lapSpliceSummaryHTML = '';
                if(includeLap && results.totalSplices > 0) {
                    lapSpliceSummaryHTML = `
                        <div class="result-item" data-kind="detail"><span><strong class="font-semibold block">${T.totalNumberOfSplices}</strong> ${results.totalSplices}</span></div>
                        <div class="result-item" data-kind="detail"><span><strong class="font-semibold block">${T.totalLapLengthAdded}</strong> ${results.totalLapLength.toFixed(2)} m</span></div>
                    `;
                }

                if (selectedElement === 'footing' || selectedElement === 'slab') {
                    resultsHTML += `
                        <div class="mb-2">
                            <p class="font-semibold header-title mb-1">${T.lengthwiseBars}</p>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-start">
                                <div class="result-item" data-kind="order"><span><strong class="font-semibold block">${T.numberOfBars} (Ø${results.diameterLen}mm)</strong> ${results.barsAlongLength}</span></div>
                                <div class="result-item" data-kind="detail"><span><strong class="font-semibold block">${T.unitWeight}</strong> ${results.unitWeightLen.toFixed(3)} kg/m</span></div>
                                <div class="result-item sm:col-span-2" data-kind="order"><span><strong class="font-semibold block">${T.totalWeight}</strong> ${(results.weightAlongLength * wastageFactor).toFixed(2)} kg (${T.withWastage})</span></div>
                            </div>
                        </div>
                        <div class="mb-2">
                            <p class="font-semibold header-title mb-1">${T.widthwiseBars}</p>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-start">
                                <div class="result-item" data-kind="order"><span><strong class="font-semibold block">${T.numberOfBars} (Ø${results.diameterWid}mm)</strong> ${results.barsAlongWidth}</span></div>
                                <div class="result-item" data-kind="detail"><span><strong class="font-semibold block">${T.unitWeight}</strong> ${results.unitWeightWid.toFixed(3)} kg/m</span></div>
                                <div class="result-item sm:col-span-2" data-kind="order"><span><strong class="font-semibold block">${T.totalWeight}</strong> ${(results.weightAlongWidth * wastageFactor).toFixed(2)} kg (${T.withWastage})</span></div>
                            </div>
                        </div>
                        <div class="border-t border-gray-700 pt-2 total-cost-print text-start">
                            <p class="font-semibold header-title mb-1">${T.summary}</p>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                ${lapSpliceSummaryHTML}
                                <div class="result-item" data-kind="order"><span><strong class="font-semibold block">${T.totalWeight}</strong> ${results.totalWeight.toFixed(2)} kg</span></div>
                                <div class="result-item" data-kind="cost"><span><strong class="font-semibold block">${T.totalCost}</strong> ${currency}${results.totalCost.toFixed(2)}</span></div>
                            </div>
                        </div>`;
                } else if (selectedElement === 'beam' || selectedElement === 'column') {
                    resultsHTML += `
                        <div class="mb-2 text-start">
                            <p class="font-semibold header-title mb-1">${T.mainBarDetails}</p>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div class="result-item" data-kind="order"><span><strong class="font-semibold block">${T.numberOfBars} (Ø${results.mainBars.diameter}mm)</strong> ${results.mainBars.numberOfBars}</span></div>
                                <div class="result-item" data-kind="detail"><span><strong class="font-semibold block">${T.unitWeight}</strong> ${results.mainBars.unitWeight.toFixed(3)} kg/m</span></div>
                                <div class="result-item sm:col-span-2" data-kind="order"><span><strong class="font-semibold block">${T.totalWeight}</strong> ${results.mainBars.totalWeight.toFixed(2)} kg (${T.withWastage})</span></div>
                            </div>
                        </div>`;
                    
                    if (results.stirrups) {
                        resultsHTML += `
                            <div class="mb-2 text-start">
                                <p class="font-semibold header-title mb-1">${T.stirrupDetails}</p>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div class="result-item" data-kind="order"><span><strong class="font-semibold block">${T.numberOfStirrups} (Ø${results.stirrups.diameter}mm)</strong> ${results.stirrups.numberOfStirrups}</span></div>
                                    <div class="result-item" data-kind="detail"><span><strong class="font-semibold block">${T.singleStirrupLength}</strong> ${results.stirrups.singleLength.toFixed(2)} m</span></div>
                                    <div class="result-item sm:col-span-2" data-kind="order"><span><strong class="font-semibold block">${T.totalWeight}</strong> ${results.stirrups.totalWeight.toFixed(2)} kg (${T.withWastage})</span></div>
                                </div>
                            </div>`;
                    }
                    
                    resultsHTML += `
                        <div class="border-t border-gray-700 pt-2 total-cost-print text-start">
                            <p class="font-semibold header-title mb-1">${T.summary}</p>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                ${lapSpliceSummaryHTML}
                                <div class="result-item" data-kind="order"><span><strong class="font-semibold block">${T.totalWeight}</strong> ${results.totalWeight.toFixed(2)} kg</span></div>
                                <div class="result-item" data-kind="cost"><span><strong class="font-semibold block">${T.totalCost}</strong> ${currency}${results.totalCost.toFixed(2)}</span></div>
                            </div>
                        </div>`;
                } else { 
                    resultsHTML += `<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-start">`;
                    if (results.numberOfBars) resultsHTML += `<div class="result-item" data-kind="order"><span><strong class="font-semibold block">${T.numberOfBars}</strong> ${results.numberOfBars}</span></div>`;
                    if (results.unitWeight) resultsHTML += `<div class="result-item" data-kind="detail"><span><strong class="font-semibold block">${T.unitWeight}</strong> ${results.unitWeight.toFixed(3)} kg/m</span></div>`;
                    if (results.totalLength) resultsHTML += `<div class="result-item" data-kind="order"><span><strong class="font-semibold block">${T.totalLength} (${T.inclLap})</strong> ${results.totalLength.toFixed(2)} m</span></div>`;
                    if (results.totalWeight) resultsHTML += `<div class="result-item" data-kind="order"><span><strong class="font-semibold block">${T.totalWeight} (w/ wastage)</strong> ${results.totalWeight.toFixed(2)} kg</span></div>`;
                    if (includeLap && results.totalSplices > 0) resultsHTML += lapSpliceSummaryHTML;
                    if (results.totalCost !== undefined) resultsHTML += `<div class="result-item sm:col-span-2 total-cost-print" data-kind="cost"><span><strong class="font-semibold block">${T.totalCost}</strong> ${currency}${results.totalCost.toFixed(2)}</span></div>`;
                    resultsHTML += `</div>`;
                }
                
                resultsHTML += `</div></div>`;
                const resultDiv = document.getElementById('steel-result');
                resultDiv.innerHTML = resultsHTML;
                resultDiv.classList.remove('hidden');
                window.lucide?.createIcons?.();
                errorBox.classList.add('hidden');
                
                // Smooth scroll to the result
                setTimeout(() => {
                    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
};
