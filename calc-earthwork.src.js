/* calc-earthwork.js — lazy-loaded calculator chunk. Loaded by app.js on first use
   (tab open or Calculate tap); registers its handler instead of running at startup. */
window.__calcHandlers = window.__calcHandlers || {};
window.__calcHandlers.earthwork = function (ctx) {
  const { translations, renderSessionTable, showError, sessionResults, lastCalcData, errorBox } = ctx;
                const lang = localStorage.getItem('language') || 'en';
                const T = translations[lang];

                const length = parseFloat(document.getElementById('earthwork-length').value);
                const width = parseFloat(document.getElementById('earthwork-width').value);
                const height = parseFloat(document.getElementById('earthwork-height').value);
                const quantity = Number(document.getElementById('earthwork-quantity').value);
                const truckCapacity = Number(document.getElementById('earthwork-truck-capacity').value);
                const swellRaw = document.getElementById('earthwork-swell').value.trim();
                const swellPct = swellRaw === '' ? 0 : Number(swellRaw);
                
                if ([length, width, height, quantity, truckCapacity, swellPct].some(v => !Number.isFinite(v)) || [length, width, height, quantity, truckCapacity].some(v => v <= 0) || !Number.isInteger(quantity) || swellPct < 0 || swellPct > 100) {
                    showError(T.errEarthworkDims);
                    return;
                }
      
                const volume = length * width * height * quantity;
                // FIX: excavated soil bulks up, trucks carry the loose volume, not the bank volume
                const looseVolume = volume * (1 + swellPct / 100);
                const totalLoads = Math.ceil(looseVolume / truckCapacity);

                lastCalcData.earthwork = {
                    description: `${length}x${width}x${height} m`,
                    quantity: quantity,
                    volume: `${volume.toFixed(2)} m³`,
                    truckLoads: `${totalLoads} (${truckCapacity} m³, +${swellPct}%)`
                };

                if (!window.__langRecalc) sessionResults.earthwork.push(lastCalcData.earthwork);
                renderSessionTable('earthwork');

                const resultDiv = document.getElementById('earthwork-result');
                resultDiv.innerHTML = `
                    <div class="result-card">
                        <div class="flex justify-between items-center mb-2">
                            <h3 class="text-base font-bold header-title">${T.resultEarthwork}</h3>
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
                                <div class="result-item flex items-center gap-2" data-kind="detail">
                                    <i data-lucide="land-plot"></i>
                                    <span>
                                        <strong class="font-semibold block">${T.excavationVolume}</strong> 
                                        ${volume.toFixed(2)} m³
                                    </span>
                                </div>
                                <div class="result-item flex items-center gap-2" data-kind="detail">
                                    <i data-lucide="layers"></i>
                                    <span>
                                        <strong class="font-semibold block">${T.looseVolume}</strong> 
                                        ${looseVolume.toFixed(2)} m³ (+${swellPct}%)
                                    </span>
                                </div>
                                <div class="result-item flex items-center gap-2" data-kind="order">
                                    <i data-lucide="truck"></i>
                                    <span>
                                        <strong class="font-semibold block">${T.truckLoads}</strong> 
                                        ${totalLoads}
                                    </span>
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
