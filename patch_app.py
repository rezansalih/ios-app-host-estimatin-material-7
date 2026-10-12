#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Patch app.js: translate every hardcoded string, fix script mixing, label buttons."""
import sys, re

p = '/home/user/app/app.js'
s = open(p, encoding='utf-8').read()
orig = s

def rep(old, new, count=1, label=''):
    global s
    n = s.count(old)
    if n != count:
        print(f'!! {label}: expected {count} occurrence(s), found {n}')
        sys.exit(1)
    s = s.replace(old, new)
    print(f'ok {label}')

# ---------------------------------------------------------------- 1. new keys
# Insert a block of new keys after each language's `clearHistory` line.
NEW_KEYS = {
 'en': ' saveBtn: "Save", csvBtn: "CSV", pdfBtn: "PDF", wallLeaves: "Wall leaves", withWastage: "w/ wastage", inclLap: "incl. lap", netWord: "net", wasteWord: "waste", orderedWord: "ordered", pcsPerM2: "pcs/m²", formworkWord: "formwork", trailInputs: "Inputs", trailElements: "element(s)", trailTotalVolumeWord: "total volume", trailWetVolume: "Wet volume", trailDryVolume: "dry volume", trailCementBeforeWaste: "Cement required before wastage", trailCementWasteAllowance: "Cement wastage allowance", trailOrderQuantity: "order quantity", trailBagsOrdered: "{n} × {kg} kg bags = {w} kg ordered", trailMaterialLine: "{name}: {a} {u} before waste + {b} {u} allowance = {c} {u} ordered", trailPrice: "Price", trailAssumption: "Assumption: the selected ratio is not a certified strength design or approved mix sheet; water and admixtures are excluded.", trailBeforeWaste: "before waste", trailNetToBatch: "{a} m³ net → {b} m³ to batch (waste {c} m³)", trailCementOrdered: "{a} kg required → {b} × {kg} kg = {c} kg ordered (surplus {d} kg from rounding up to whole bags)", trailWaterPerKg: "≈{v} L (0.6 L per kg of cement batched)", trailMixRatioWord: "Nominal mix ratio", trailWasteWord: "Waste", trailAssumptionNominal: "Assumption: nominal ratios do not certify strength.", trailModeWord: "Mode", trailTotalWallVolumeMode: "total wall volume", trailWallDimsMode: "wall dimensions", trailWallVolume: "Wall volume", trailWallThickness: "Wall thickness", trailLeaves: "leaves", trailFaceAreaNote: "Face-area method includes joints and checks implied thickness.", trailSteelNote: "Rough quantity estimate for one selected member; not a reinforcement design schedule. Anchorage, hooks, bends, extra zones, repeated members, and stock-bar cutting are not modeled.", trailGrossVolume: "Gross volume", trailSwell: "Swell", trailTruckCapacity: "Truck capacity", trailEarthNote: "Rectangular estimate only; slopes, working room, backfill, compaction, and payload limits are not modeled.",',
 'ku': ' saveBtn: "پاشکەفت", csvBtn: "CSV", pdfBtn: "PDF", wallLeaves: "چینێن دیوارێ", withWastage: "بە فیڕۆچوون", inclLap: "بە لێکدان", netWord: "ساف", wasteWord: "بەفیڕۆچوون", orderedWord: "سیارەکراو", pcsPerM2: "دەنە/م²", formworkWord: "قاڵب", trailInputs: "تێکەران", trailElements: "ئەندام", trailTotalVolumeWord: "قەبارێ گشتی", trailWetVolume: "قەبارێی بیس", trailDryVolume: "قەبارێی شک", trailCementBeforeWaste: "چیمەنتویێ پێدڤی جی بەفیڕۆچوونێ", trailCementWasteAllowance: "پارچەیا بەفیڕۆچوونا چیمەنتویێ", trailOrderQuantity: "بڕێ سیارەکراو", trailBagsOrdered: "{n} × {kg} کگ کەسک = {w} کگ سیارەکراو", trailMaterialLine: "{name}: {a} {u} جی بەفیڕۆچوونێ + {b} {u} پارچە = {c} {u} سیارەکراو", trailPrice: "بەها", trailAssumption: "پێشگرتن: ڕەژەیا هەلبژێرییەکێ نییە دیزاینێ ستوورییا ئێمانەتپێبوو یان چارەسەرێ تێکەلیا ڕەسمی؛ ئاڤ و زیادکراوان ل دەرەوەیین.", trailBeforeWaste: "جی بەفیڕۆچوونێ", trailNetToBatch: "{a} م³ ساف → {b} م³ بۆ تێکەڵکرنێ (بەفیڕۆچوون {c} م³)", trailCementOrdered: "{a} کگ پێدڤی → {b} × {kg} کگ = {c} کگ سیارەکراو (زیادە {d} کگ ل ڕندکرنێ)", trailWaterPerKg: "≈{v} لتر (0.6 لتر بۆ هەر کگ چیمەنتویێ)", trailMixRatioWord: "ڕەژەیا خەمڵاندنێ", trailWasteWord: "بەفیڕۆچوون", trailAssumptionNominal: "پێشگرتن: ڕەژەیێن خەمڵاندنێ ستوورییا ئێمانەتپێبوو نییە.", trailModeWord: "مۆد", trailTotalWallVolumeMode: "قەبارێ گشتیێ دیوار", trailWallDimsMode: "پیڤانێن دیوارێ", trailWallVolume: "قەبارێ دیوار", trailWallThickness: "ئەستوورییا دیوارێ", trailLeaves: "چین", trailFaceAreaNote: "ڕێگایا ڕووبەرێ درزەکان تێدایە و ئەستوورییا جی پێکھاتی دیتنە.", trailSteelNote: "خەمڵاندنا بڕێ ناڤبەرا بۆ ئەندامەکێ هەلبژێریی؛ نیشاندەری سێمانداری نییە. ئەنکەر، هوک، لێکدان، ڕێژای زیاتر، ئەندامێن دوپەخۆ و کوپکرنێ شیشێن ستۆکێ نەمۆدەلێن.", trailGrossVolume: "قەبارێ کورد", trailSwell: "ئاوسان", trailTruckCapacity: "قەبارێ بارەهەلگری", trailEarthNote: "تنێ خەمڵاندنا ڕووەنتی؛ تەمکان، شوێنا کارێ، پیژاندن، پڕکردن و سنوورێن بارێ نەمۆدەلێن.",',
 'ks': ' saveBtn: "پاشەکەوت", csvBtn: "CSV", pdfBtn: "PDF", wallLeaves: "چینەکانی دیوار", withWastage: "بە بەفیڕۆچوون", inclLap: "بە تێهەڵکێش", netWord: "ساف", wasteWord: "بەفیڕۆچوون", orderedWord: "سەڵامە", pcsPerM2: "دانە/م²", formworkWord: "قاڵب", trailInputs: "تێخستنەکان", trailElements: "ئەندام", trailTotalVolumeWord: "قەبارەی گشتی", trailWetVolume: "قەبارەی چرکە", trailDryVolume: "قەبارەی شێک", trailCementBeforeWaste: "چیمەنتۆی پێویست پێش بەفیڕۆچوون", trailCementWasteAllowance: "هامش بەفیڕۆچوونی چیمەنتۆ", trailOrderQuantity: "بڕی سەڵامە", trailBagsOrdered: "{n} × {kg} کگ کیسە = {w} کگ سەڵامە", trailMaterialLine: "{name}: {a} {u} پێش بەفیڕۆچوون + {b} {u} هێما = {c} {u} سەڵامە", trailPrice: "نرخ", trailAssumption: "فرض: ڕێژەی هەڵبژێردراو دیزاینی بەرووبووی ستڕێنگ یان تێکەڵەی ڕەسمی نییە؛ ئاو و زیادەکارییەکان ناگیرێن.", trailBeforeWaste: "پێش بەفیڕۆچوون", trailNetToBatch: "{a} م³ ساف → {b} م³ بۆ تێکەڵکردن (بەفیڕۆچوون {c} م³)", trailCementOrdered: "{a} کگ پێویست → {b} × {kg} کگ = {c} کگ سەڵامە (زیادە {d} کگ لە یەکدەستنەوەی کیسە تەواوەکان)", trailWaterPerKg: "≈{v} لتر (0.6 لتر بۆ هەر کگ چیمەنتۆ)", trailMixRatioWord: "ڕێژەی خەمڵاندن", trailWasteWord: "بەفیڕۆچوون", trailAssumptionNominal: "فرض: ڕێژە خەمڵێنراوەکان ستڕێنگ نەدەستن بەرهەم.", trailModeWord: "دۆخ", trailTotalWallVolumeMode: "قەبارەی گشتی دیوار", trailWallDimsMode: "پێوانەکانی دیوار", trailWallVolume: "قەبارەی دیوار", trailWallThickness: "ئەستووری دیوار", trailLeaves: "چین", trailFaceAreaNote: "ڕێگای ڕووبەر درزەکان لەخۆدەگرێت و ئەستووری پێشبینیکراو ڕوون دەکاتەوە.", trailSteelNote: "خەمڵاندنی ناوین بۆ ئەندامێکی هەڵبژێردراو؛ نەقشەی سێمێنتی نییە. ئاڤەستین، پووچ، لێکدان، هەرێمەکانی زیاد، ئەندامە دووبارەکان و کەرتنی شیشەکانی ستۆک مۆدێل نەکراون.", trailGrossVolume: "قەبارەی کورد", trailSwell: "ئاوسان", trailTruckCapacity: "قەبارەی بارهەڵگر", trailEarthNote: "تەنها خەمڵاندنی چوارگۆشە؛ ژیوانەکان، شوێنی کار، پڕکردنەوە، پەکخستن و سنوورەکانی بار مۆدێل نەکراون.",',
 'ar': ' saveBtn: "حفظ", csvBtn: "CSV", pdfBtn: "PDF", wallLeaves: "عدد طبقات الجدار", withWastage: "مع الهدر", inclLap: "شاملاً التراكب", netWord: "صافي", wasteWord: "هدر", orderedWord: "يُطلب", pcsPerM2: "قطعة/م²", formworkWord: "قالب", trailInputs: "المدخلات", trailElements: "عنصر", trailTotalVolumeWord: "الحجم الكلي", trailWetVolume: "الحجم الرطب", trailDryVolume: "الحجم الجاف", trailCementBeforeWaste: "الإسمنت المطلوب قبل الهدر", trailCementWasteAllowance: "هامش هدر الإسمنت", trailOrderQuantity: "كمية الطلب", trailBagsOrdered: "{n} × {kg} كجم كيس = {w} كجم مطلوب", trailMaterialLine: "{name}: {a} {u} قبل الهدر + {b} {u} هامش = {c} {u} مطلوب", trailPrice: "السعر", trailAssumption: "فرض: النسبة المحددة ليست تصميم اعتماد قوة ولا وصف خلطة معتمد؛ الماء والمضافات مستبعدة.", trailBeforeWaste: "قبل الهدر", trailNetToBatch: "{a} م³ صافي → {b} م³ للتخلیط (هدر {c} م³)", trailCementOrdered: "{a} كجم مطلوب → {b} × {kg} كجم = {c} كجم مطلوب (فائض {d} كجم من تقريب إلى أكياس كاملة)", trailWaterPerKg: "≈{v} لتر (0.6 لتر لكل كجم إسمنت)", trailMixRatioWord: "نسبة الخلط الاسمية", trailWasteWord: "الهدر", trailAssumptionNominal: "فرض: النسب الاسمية لا تضمن القوة.", trailModeWord: "الوضع", trailTotalWallVolumeMode: "حجم الجدار الكلي", trailWallDimsMode: "أبعاد الجدار", trailWallVolume: "حجم الجدار", trailWallThickness: "سماكة الجدار", trailLeaves: "طبقات", trailFaceAreaNote: "طريقة المساحة السطحية تشمل الفواصل وتتحقق من السماكة الضمنية.", trailSteelNote: "تقدير تقريبي لعدد كمية عنصر واحد محدد؛ ليس جدول تصميم تسليح. التثبيت والخطافات والانحناءات والمناطق الإضافية والأعضاء المتكررة وقطع القضبان المخزنية غير نمذجية.", trailGrossVolume: "الحجم الإجمالي", trailSwell: "الانتفاخ", trailTruckCapacity: "سعة الشاحنة", trailEarthNote: "تقدير مستطيل فقط؛ المنحدرات ومساحة العمل والردم والمضغوطة وسعة الحمولة غير نمذجية.",',
}
for lang, block in NEW_KEYS.items():
    anchor = 'clearHistory: "'
    langStart = s.index(f'\n                {lang}: {{')
    bounds = [s.index(f'\n                {l}: {{') for l in NEW_KEYS if l != lang]
    bounds.append(s.index('languageSelector'))
    segEnd = min(b for b in bounds if b > langStart)
    line = s[langStart:segEnd]
    i = line.index(anchor)
    j = line.index(',', i) + 1
    global_pos = langStart + j
    s = s[:global_pos] + block + s[global_pos:]
    print(f'ok new keys inserted for {lang}')

# ---------------------------------------------------------------- 2. typos
rep('weightAlongLength: "الوزن (باتجاه الط الطول)"', 'weightAlongLength: "الوزن (باتجاه الطول)"', label='ar weightAlongLength typo')
rep('totalNumberOfSplices: "الالعدد الإجمالي لوصلات التراكب"', 'totalNumberOfSplices: "العدد الإجمالي لوصلات التراكب"', label='ar totalNumberOfSplices typo')
rep('ku: \'تنێ گۆڕینا USD ↔ IQD پشتگیری dike؛ بهاکان بۆ دراوێ هەلبژێری بنڤیسە.\'', 'ku: \'تنێ گۆڕینا USD ↔ IQD پشتگیری دەکرێت؛ بهاکان بۆ دراوێ هەلبژێری بنڤیسە.\'', label='ku currencyNotes Latin word')

# ---------------------------------------------------------------- 3. fill helper
rep("            const languageSelector = document.getElementById('language-selector');",
    "            const fill = (str, map) => String(str).replace(/\\{(\\w+)\\}/g, (m, k) => (k in map ? map[k] : m));\n            const languageSelector = document.getElementById('language-selector');",
    label='fill() helper')

# ---------------------------------------------------------------- 4. button labels (5x each)
OLD_SAVE = '''<button type="button" class="btn btn-secondary !p-2 save-history-btn" title="${T.saveToHistoryTitle}">
                                    <i data-lucide="save" class="w-4 h-4 pointer-events-none"></i>
                                </button>'''
NEW_SAVE = '''<button type="button" class="btn btn-secondary result-action-btn save-history-btn" title="${T.saveToHistoryTitle}">
                                    <i data-lucide="save" class="w-4 h-4 pointer-events-none"></i>
                                    <span data-lang="saveBtn">${T.saveBtn}</span>
                                </button>'''
rep(OLD_SAVE, NEW_SAVE, count=5, label='save buttons labelled')
OLD_CSV = '''<button type="button" class="btn btn-secondary !p-2 export-csv-btn" title="${T.exportCsvTitle}">
                                    <i data-lucide="file-spreadsheet" class="w-4 h-4 pointer-events-none"></i>
                                </button>'''
NEW_CSV = '''<button type="button" class="btn btn-secondary result-action-btn export-csv-btn" title="${T.exportCsvTitle}">
                                    <i data-lucide="file-spreadsheet" class="w-4 h-4 pointer-events-none"></i>
                                    <span data-lang="csvBtn">${T.csvBtn}</span>
                                </button>'''
rep(OLD_CSV, NEW_CSV, count=5, label='csv buttons labelled')
OLD_PDF = '''<button type="button" class="btn btn-secondary !p-2 export-btn" title="${T.exportPdfTitle}">
                                    <i data-lucide="printer" class="w-4 h-4 pointer-events-none"></i>
                                </button>'''
NEW_PDF = '''<button type="button" class="btn btn-secondary result-action-btn export-btn" title="${T.exportPdfTitle}">
                                    <i data-lucide="printer" class="w-4 h-4 pointer-events-none"></i>
                                    <span data-lang="pdfBtn">${T.pdfBtn}</span>
                                </button>'''
rep(OLD_PDF, NEW_PDF, count=5, label='pdf buttons labelled')

# ---------------------------------------------------------------- 5. concrete result sand/aggregate
rep('${sandVolumeBeforeWaste.toFixed(2)} ${materialUnit} + ${(sandVolume - sandVolumeBeforeWaste).toFixed(2)} ${materialUnit} waste = ${sandVolume.toFixed(2)} ${materialUnit} ordered',
    '${sandVolumeBeforeWaste.toFixed(2)} ${materialUnit} + ${(sandVolume - sandVolumeBeforeWaste).toFixed(2)} ${materialUnit} ${T.wasteWord} = ${sandVolume.toFixed(2)} ${materialUnit} ${T.orderedWord}',
    label='concrete sand result line')
rep('${aggregateVolumeBeforeWaste.toFixed(2)} ${materialUnit} + ${(aggregateVolume - aggregateVolumeBeforeWaste).toFixed(2)} ${materialUnit} waste = ${aggregateVolume.toFixed(2)} ${materialUnit} ordered',
    '${aggregateVolumeBeforeWaste.toFixed(2)} ${materialUnit} + ${(aggregateVolume - aggregateVolumeBeforeWaste).toFixed(2)} ${materialUnit} ${T.wasteWord} = ${aggregateVolume.toFixed(2)} ${materialUnit} ${T.orderedWord}',
    label='concrete aggregate result line')

# ---------------------------------------------------------------- 6. concrete trail
rep('<details class="calculation-trail card p-3 mt-3 text-sm text-start"><summary class="font-semibold">Calculation details</summary><div class="mt-2 space-y-1"><div>Inputs: ${mode === \'volume\' ? `total volume ${wetVolume.toFixed(3)} m³` : `${length} × ${width} × ${thickness} m × ${quantity} element(s)`}</div><div>Wet volume: ${wetVolume.toFixed(3)} m³; dry volume: ${dryVolumeText}</div>',
    '<details class="calculation-trail card p-3 mt-3 text-sm text-start"><summary class="font-semibold">${T.calculationDetails}</summary><div class="mt-2 space-y-1"><div>${T.trailInputs}: ${mode === \'volume\' ? `${T.trailTotalVolumeWord} ${wetVolume.toFixed(3)} m³` : `${length} × ${width} × ${thickness} m × ${quantity} ${T.trailElements}`}</div><div>${T.trailWetVolume}: ${wetVolume.toFixed(3)} m³; ${T.trailDryVolume}: ${dryVolumeText}</div>',
    label='concrete trail head')
rep('<div>Cement required before wastage: ${cementWeight.toFixed(1)} kg</div>',
    '<div>${T.trailCementBeforeWaste}: ${cementWeight.toFixed(1)} kg</div>',
    label='concrete trail cement before waste')
rep('`Cement wastage allowance: ${cementWastageAllowance.toFixed(1)} kg; order quantity: ${cementBags} × ${getCementBagMass()} kg bags = ${cementOrderWeight.toFixed(1)} kg ordered`',
    '`${T.trailCementWasteAllowance}: ${cementWastageAllowance.toFixed(1)} kg; ${T.trailOrderQuantity}: ' + '${fill(T.trailBagsOrdered, { n: cementBags, kg: getCementBagMass(), w: cementOrderWeight.toFixed(1) })}`',
    label='concrete trail cement allowance')
rep('Sand: ${sandVolumeBeforeWaste.toFixed(3)} ${materialUnit} before waste + ${(sandVolume - sandVolumeBeforeWaste).toFixed(3)} ${materialUnit} allowance = ${sandVolume.toFixed(3)} ${materialUnit} ordered',
    '${fill(T.trailMaterialLine, { name: T.sand, a: sandVolumeBeforeWaste.toFixed(3), u: materialUnit, b: (sandVolume - sandVolumeBeforeWaste).toFixed(3), c: sandVolume.toFixed(3) })}',
    label='concrete trail sand')
rep('Coarse aggregate: ${aggregateVolumeBeforeWaste.toFixed(3)} ${materialUnit} before waste + ${(aggregateVolume - aggregateVolumeBeforeWaste).toFixed(3)} ${materialUnit} allowance = ${aggregateVolume.toFixed(3)} ${materialUnit} ordered',
    '${fill(T.trailMaterialLine, { name: T.aggregate, a: aggregateVolumeBeforeWaste.toFixed(3), u: materialUnit, b: (aggregateVolume - aggregateVolumeBeforeWaste).toFixed(3), c: aggregateVolume.toFixed(3) })}',
    label='concrete trail aggregate')
rep("formwork ${currency}${formworkCost.toFixed(2)}",
    "${T.formworkWord} ${currency}${formworkCost.toFixed(2)}",
    label='concrete trail formwork word')
rep("<div>${materialCostsComplete ? `Price: ", "<div>${materialCostsComplete ? `${T.trailPrice}: ",
    label='concrete trail price')
rep("'Assumption: the selected ratio is not a certified strength design or approved mix sheet; water and admixtures are excluded.'}",
    "${T.trailAssumption}}",
    label='concrete trail assumption')

# ---------------------------------------------------------------- 7. blocks trail
rep('${T.totalBlocks}: ${blocksNeededUnwasted.toFixed(2)} before waste + ${(blocksNeeded - blocksNeededUnwasted).toFixed(2)} waste = ${blocksNeeded} ordered',
    '${T.totalBlocks}: ${blocksNeededUnwasted.toFixed(2)} ${T.trailBeforeWaste} + ${(blocksNeeded - blocksNeededUnwasted).toFixed(2)} ${T.wasteWord} = ${blocksNeeded} ${T.orderedWord}',
    label='blocks trail before-waste')
rep('${T.wallLeaves || \'Leaves\'}: ${leaves}</div><div>${T.totalBlocks}:',
    '${T.wallLeaves}: ${leaves}</div><div>${T.totalBlocks}:',
    label='blocks trail leaves fallback')

# ---------------------------------------------------------------- 8. bricks result + trail
rep('${mortarVolumeOrder.toFixed(3)} m³ <span class="text-xs opacity-75">(${mortarVolumeNet.toFixed(3)} net + ${(mortarVolumeOrder - mortarVolumeNet).toFixed(3)} waste)</span>',
    '${mortarVolumeOrder.toFixed(3)} m³ <span class="text-xs opacity-75">(${mortarVolumeNet.toFixed(3)} ${T.netWord} + ${(mortarVolumeOrder - mortarVolumeNet).toFixed(3)} ${T.wasteWord})</span>',
    label='bricks mortar result line')
rep('${bricksPerM2.toFixed(1)} pcs/m²',
    '${bricksPerM2.toFixed(1)} ${T.pcsPerM2}',
    label='bricks pcs/m2')
rep('${T.wallLeaves || \'Leaves\'}: ${leaves}</div><div>${T.totalBricks}:',
    '${T.wallLeaves}: ${leaves}</div><div>${T.totalBricks}:',
    label='bricks trail leaves fallback')
rep('${T.totalBricks}: ${bricksNeededUnwasted.toFixed(2)} before waste + ${(bricksNeeded - bricksNeededUnwasted).toFixed(2)} waste = ${bricksNeeded} ordered',
    '${T.totalBricks}: ${bricksNeededUnwasted.toFixed(2)} ${T.trailBeforeWaste} + ${(bricksNeeded - bricksNeededUnwasted).toFixed(2)} ${T.wasteWord} = ${bricksNeeded} ${T.orderedWord}',
    label='bricks trail before-waste')
rep('${T.mortarVolume}: ${mortarVolumeNet.toFixed(3)} m³ net → ${mortarVolumeOrder.toFixed(3)} m³ to batch (waste ${(mortarVolumeOrder - mortarVolumeNet).toFixed(3)} m³);',
    '${T.mortarVolume}: ${fill(T.trailNetToBatch, { a: mortarVolumeNet.toFixed(3), b: mortarVolumeOrder.toFixed(3), c: (mortarVolumeOrder - mortarVolumeNet).toFixed(3) })};',
    label='bricks trail net-to-batch')
rep('${T.cementWeight}: ${cementWeight.toFixed(2)} kg required → ${cementBags} × ${getCementBagMass()} kg = ${cementOrderedKg.toFixed(0)} kg ordered (surplus ${(cementOrderedKg - cementWeight).toFixed(2)} kg from rounding up to whole bags)',
    '${T.cementWeight}: ${fill(T.trailCementOrdered, { a: cementWeight.toFixed(2), b: cementBags, kg: getCementBagMass(), c: cementOrderedKg.toFixed(0), d: (cementOrderedKg - cementWeight).toFixed(2) })}',
    label='bricks trail cement ordered')
rep('${T.mixingWaterEstimate}: ≈${mixingWaterLitres.toFixed(1)} L (0.6 L per kg of cement batched)',
    '${T.mixingWaterEstimate}: ${fill(T.trailWaterPerKg, { v: mixingWaterLitres.toFixed(1) })}',
    label='bricks trail water per kg')

# ---------------------------------------------------------------- 9. steel (w/ wastage) + incl lap
rep('kg (w/ wastage)', 'kg (${T.withWastage})', count=4, label='steel w/ wastage x4')
rep('${T.totalLength} (incl. lap)', '${T.totalLength} (${T.inclLap})', label='steel incl lap')

# ---------------------------------------------------------------- 10. history modal: type name + load label
rep("""                calculationHistory.forEach((item, index) => {
                    const displayType = item.type === 'one_way' ? 'One-Way' : item.type.charAt(0).toUpperCase() + item.type.slice(1);""",
    """                calculationHistory.forEach((item, index) => {
                    const hLang = localStorage.getItem('language') || 'en';
                    const HT = translations[hLang];
                    const hTypeKey = { concrete: 'tabConcrete', blocks: 'tabBlocks', bricks: 'tabBricks', steel: 'tabSteel', earthwork: 'tabEarthwork' }[item.type];
                    const displayType = hTypeKey ? HT[hTypeKey] : (item.type === 'one_way' ? HT.oneWay : item.type.charAt(0).toUpperCase() + item.type.slice(1));""",
    label='history item type names translated')
rep('''<button type="button" class="load-history-btn text-blue-400 hover:text-blue-300 pointer-events-auto" title="Load"><i data-lucide="rotate-ccw" class="w-4 h-4 pointer-events-none"></i></button>''',
    '''<button type="button" class="load-history-btn text-blue-400 hover:text-blue-300 pointer-events-auto" title="${HT.loadTitle}"><i data-lucide="rotate-ccw" class="w-4 h-4 pointer-events-none"></i><span>${HT.loadTitle}</span></button>''',
    label='history load button labelled')

# ---------------------------------------------------------------- 11. bottom trailText object
old_trail = s[s.index('const trailText = {'):s.index('};', s.index('const trailText = {')) + 2]
new_trail = '''const trailText = {
                concrete: () => { const T=translations[localStorage.getItem('language')||'en']; const mode=document.querySelector('input[name="concrete-mode"]:checked')?.value; const l=document.getElementById('concrete-length')?.value||'—', w=document.getElementById('concrete-width')?.value||'—', t=document.getElementById('concrete-thickness')?.value||'—', v=document.getElementById('concrete-total-volume')?.value||'—', q=document.getElementById('concrete-quantity')?.value||'1', ratio=document.getElementById('concrete-ratio')?.value||'—', waste=document.getElementById('wastage')?.value||'0'; return `${T.trailInputs}: ${mode==='volume'?`${T.trailTotalVolumeWord} ${v} m³`:`${l} × ${w} × ${t} m`}${q!=='1'?` × ${q} ${T.trailElements}`:''}. ${T.trailMixRatioWord}: ${ratio}. ${T.trailWasteWord}: ${waste}%. ${T.trailAssumptionNominal}`; },
                blocks: () => { const T=translations[localStorage.getItem('language')||'en']; const mode=document.querySelector('input[name="block-mode"]:checked')?.value; const v=document.getElementById('block-wall-volume')?.value||'—', th=document.getElementById(mode==='volume'?'block-volume-wall-thickness':'block-wall-width-input')?.value||'—', leaves=document.getElementById(mode==='volume'?'block-volume-leaves':'block-leaves')?.value||'—'; return `${T.trailModeWord}: ${mode==='volume'?T.trailTotalWallVolumeMode:T.trailWallDimsMode}. ${T.trailWallVolume}: ${v} m³. ${T.trailWallThickness}: ${th} m; ${T.trailLeaves}: ${leaves}. ${T.trailFaceAreaNote}`; },
                bricks: () => { const T=translations[localStorage.getItem('language')||'en']; const mode=document.querySelector('input[name="brick-mode"]:checked')?.value; const v=document.getElementById('brick-wall-volume')?.value||'—', th=document.getElementById(mode==='volume'?'brick-volume-wall-thickness':'brick-wall-width-input')?.value||'—', leaves=document.getElementById(mode==='volume'?'brick-volume-leaves':'brick-leaves')?.value||'—'; return `${T.trailModeWord}: ${mode==='volume'?T.trailTotalWallVolumeMode:T.trailWallDimsMode}. ${T.trailWallVolume}: ${v} m³. ${T.trailWallThickness}: ${th} m; ${T.trailLeaves}: ${leaves}. ${T.trailFaceAreaNote}`; },
                steel: () => translations[localStorage.getItem('language')||'en'].trailSteelNote,
                earthwork: () => { const T=translations[localStorage.getItem('language')||'en']; const l=document.getElementById('earthwork-length')?.value||'—', w=document.getElementById('earthwork-width')?.value||'—', h=document.getElementById('earthwork-height')?.value||'—', q=document.getElementById('earthwork-quantity')?.value||'—', swell=document.getElementById('earthwork-swell')?.value||'0', cap=document.getElementById('earthwork-truck-capacity')?.value||'—'; return `${T.trailGrossVolume}: ${l} × ${w} × ${h} × ${q} m³. ${T.trailSwell}: ${swell}%. ${T.trailTruckCapacity}: ${cap} m³. ${T.trailEarthNote}`; }
            };'''
s = s.replace(old_trail, new_trail)
print('ok trailText object translated')

# trail summary label
rep("d.innerHTML=`<summary class=\"font-semibold\">Calculation trail &amp; assumptions</summary><p class=\"mt-2\">${trailText[type]()}</p>`;",
    "d.innerHTML=`<summary class=\"font-semibold\">${translations[localStorage.getItem('language')||'en'].calculationDetails}</summary><p class=\"mt-2\">${trailText[type]()}</p>`;",
    label='trail summary label')

# ---------------------------------------------------------------- 12. ku upgrade labels -> Arabic script
UP = {
 "ku: {projectInfo:'Agahiyên projeyê', projectName:'Navê projeyê', clientName:'Mişterî', projectLocation:'Cih', projectDate:'Dîroka texmînê', inputUnits:'Sîstema yekîtiyên têketinê', metricUnits:'Metrîk (m / cm / mm)', imperialUnits:'Imperyal (ft / in)', cementBagSize:'Mezinahiya kîsê çîmentoyê', bag25:'25 kg', bag40:'40 kg', bag50:'50 kg', projectNotes:'Têbînîyên texmînê', slabSupport:'Piştgiriya slabê', groundSupported:'Slaba li ser axê (bê qalibê binê)', suspendedSlab:'Slaba hilbijartî (bi qalibê binê)', wallLeaves:'Pelên dîwarê', wallThickness:'Stûrahiya dîwarê (m)', formworkCost:'Bihaya qalibê / m²'}":
 "ku: {projectInfo:'ئاگاھیێن پرۆژێ', projectName:'ناڤێ پرۆژێ', clientName:'میشتری', projectLocation:'شوێن', projectDate:'دروستەیا خەمڵاندنێ', inputUnits:'سیستەما یەکەیێن تێکەران', metricUnits:'متریک (m / cm / mm)', imperialUnits:'ئیمپریاڵ (ft / in)', cementBagSize:'قەبارەیا کەسا چیمەنتویێ', bag25:'٢٥ کگ', bag40:'٤٠ کگ', bag50:'٥٠ کگ', projectNotes:'تێبینیێن خەمڵاندنێ', slabSupport:'پشتگیریا سلەبێ', groundSupported:'سلەبێ ل سەرا ئاخێ (بێ قاڵبێ ژێرێ)', suspendedSlab:'سلەبێ هەلبژێرتیی (ب قاڵبێ ژێرێ)', wallLeaves:'چینێن دیوارێ', wallThickness:'ئەستوورییا دیوارێ (م)', formworkCost:'بەهایا قاڵبێ / م²'}"
}
for old, new in UP.items():
    rep(old, new, label='ku upgrade labels Arabic script')

open(p, 'w', encoding='utf-8').write(s)
print('\nALL app.js PATCHES APPLIED')
