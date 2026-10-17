
        document.addEventListener('DOMContentLoaded', function() {
            window.lucide?.createIcons?.();

            const mobileCalculate = document.getElementById('mobile-calculate');
            const mobileReset = document.getElementById('mobile-reset');

            const triggerActiveCalculation = () => {
                const activeTab = document.querySelector('.tab-btn.tab-active')?.dataset.tab;
                const calculateBtn = document.getElementById(`calculate-${activeTab}`);
                if (calculateBtn) {
                    if (navigator.vibrate) navigator.vibrate(50);
                    calculateBtn.click();
                }
            };

            const triggerActiveReset = () => {
                const activeTab = document.querySelector('.tab-btn.tab-active')?.dataset.tab;
                const resetBtn = document.querySelector(`.reset-btn[data-form="${activeTab}"]`);
                if (resetBtn) {
                    if (navigator.vibrate) navigator.vibrate(50);
                    resetBtn.click();
                }
            };

            mobileCalculate?.addEventListener('click', triggerActiveCalculation);
            mobileReset?.addEventListener('click', triggerActiveReset);

            const translations = {
                en: {
                    resetFormLabel: "Reset form", themeToggleLabel: "Dark mode", closeLabel: "Close", languageLabel: "Language", swellFactorLabel: "Soil Swell Factor (%)", looseVolume: "Loose Volume (for hauling)", soffitFormwork: "Soffit Formwork (suspended slabs only)", appTitle: "Construction Material Estimator", appSubtitle: "Construction Material Estimator", workspaceEyebrow: "FIELDNOTE / TAKEOFF WORKSPACE", readyForTakeoff: "READY FOR TAKEOFF", workspaceHeadline: "Turn site dimensions into a material plan.", workspaceDescription: "Choose a discipline, enter your quantities, and get a clear, exportable estimate in seconds.", workspaceSettings: "Project settings", workspaceHistory: "Recent calculations", activeToolLabel: "ACTIVE TOOL", activeToolMeta: "Select a calculator below", sessionItemsLabel: "SESSION ITEMS", sessionItemsMeta: "Calculations this session", defaultWastageLabel: "DEFAULT WASTAGE", defaultWastageMeta: "Adjust in project settings", mobileGuide: "Fill the sections from top to bottom, then tap Calculate.", globalSettings: "Global Settings", calcHistory: "Calculation History", noHistory: "No calculation history yet",
                    wastageLabel: "General Material Wastage (%)", currencySymbol: "Currency", exchangeRateLabel: "100 USD to IQD Rate", projectsBtn: "Manage Projects", projectsTitle: "Manage Projects", saveBtn: "Save", noProjects: "No saved projects.", appDesigner: "Designed By Engineer Rezan Salih Noori",
                    stepOf: "Step", nextStep: "Next", reviewStep: "Review & calculate", homeEyebrow: "Site quantity estimator", homeTitle: "What do you need to estimate?", homeSubtitle: "Pick a material, enter your dimensions, and get a full bill of quantities with mortar, cement, sand and cost.", homeBack: "All tools", homeTip: "Results are estimates. Set your material wastage in Project settings before you start.", homeConcreteDesc: "Slabs, footings, beams and columns", homeBlocksDesc: "Cement block walls by area or volume", homeBricksDesc: "Brickwork with mortar and openings", homeSteelDesc: "Rebar weight and cost by element", homeEarthworkDesc: "Excavation, backfill and truck loads", homeSettingsDesc: "Wastage, currency and project details", tabConcrete: "Concrete", tabBlocks: "Blocks", tabBricks: "Bricks", tabSteel: "Steel", tabEarthwork: "Earth Work",
                    errorTitle: "Error:", calculateBtn: "Calculate", resetBtn: "Reset", deductOpenings: "Manage Openings", createProjectBtn: "Create",
                    concreteTitle: "Concrete Calculator", appType: "Concrete Element", mixRatio: "Cement : sand : coarse aggregate, by loose volume", slabOption: "Slab / Foundation", columnOption: "Column", beamOption: "Beam",
                    dryVolumeFactor: "Dry-volume factor (estimate)", dryVolumeFactorNote: "Estimate only; actual yield varies by materials and batching.", customRatioNote: "This is still a nominal loose-volume ratio, not an approved mix design.", cementDensity: "Loose cement bulk density (kg/m³)", mortarMixRatio: "Mortar Mix Ratio (Cement:Sand)",
                    length: "Length (m)", width: "Width (m)", thickness: "Thickness / Depth (m)", height: "Height / Depth (m)", costCementBag: "Cost per Cement Bag", costSandM3: "Cost per m³ of Sand", costAggregateM3: "Cost per m³ of Aggregate",
                    numberOfElements: "Number of Elements",
                    blocksTitle: "Cement Block Calculator", calcMode: "Calculate By", byDimensions: "Using Element Dimensions", blockType: "Block Type", wallWidth: "Wall Width (m)", wallLength: "Wall Length (m)", wallHeight: "Wall Height (m)",
                    blockLength: "Length (cm)", blockWidth: "Width (cm)", blockHeight: "Height (cm)",
                    solidBlock20: "Solid (40x20x20cm)", solidBlock15: "Solid (40x20x15cm)", hollowBlock: "Hollow (40x20x20cm)", lightweightBlock: "Lightweight (60x20x10cm)", costPerBlock: "Cost per Block", mortarCementCost: "Cement Cost/Bag", mortarSandCost: "Sand Cost/m³",
                    bricksTitle: "Brick Calculator", brickType: "Brick Type", standardBrick: "Standard (215x102.5x65mm)", engineeringBrick: "Engineering (215x102.5x73mm)", romanBrick: "Roman (290x90x40mm)",
                    hollowBrick: "Hollow Brick (30x12x12cm)", localBrick: "Local Iraqi IQS 25 (24x11.5x7.5cm)",
                    brickLength: "Length (mm)", brickWidth: "Width (mm)", brickHeight: "Height (mm)", mortarThickness: "Mortar Thickness (cm)", costPerBrick: "Cost per Brick",
                    steelTitle: "Rebar Calculator", diameter: "Diameter (mm)", lengthPerBar: "Single Bar Length (m)", numberOfBars: "Number of Bars", costPerKg: "Cost per kg",
                    unitWeight: "Unit Weight (kg/m)", barsLabel: "Bars", quantities: "Quantities", memberQuantity: "Number of members (same size)", lapSplicesAdvanced: "Lap splices (for long bars)", customBars: "Custom bars", addRowBtn: "Add bar row", removeRowBtn: "Remove", perMember: "per member", errCustomRows: "Add at least one bar row with diameter, number of bars, and length.", helpBtn: "Help", presetBtn: "Fill typical values", sanityIntro: "Check these values:", sanityUnusual: "looks unusual — please check", hintSpacing: "Distance between two bars, measured center to center.", hintDiameter: "How thick one bar is, across its round face.", hintCalcMode: "Spacing finds the number of bars from the distance between them. Number of Bars uses the count you type.", hintCover: "Concrete between the steel and the outside face — it protects the steel. 40 mm is common.", hintStirrupSpacing: "Distance from one stirrup ring to the next.", hintStirrupDiameter: "Thickness of the stirrup ring bar. Ø8 is the usual size.", hintBarLength: "Length of one bar from the steel shop — usually 12 m. Used to count the bars to buy.", hintLapFactor: "For bars longer than shop bars, the bars overlap. 50d means the overlap is 50 × the bar diameter.", hintMemberQty: "How many identical pieces you will pour — like 5 identical footings.", hintCostPerKg: "Price of one kilogram at your supplier.", hintTruck: "How much one truck can carry, in m³.", hintSwell: "Dug soil becomes looser and takes more space. 25–30% is common.", hintMortar: "How thick the mortar joint is between blocks or bricks.", hintDryFactor: "Dry mortar shrinks when water is added. 1.33 is the common factor.", hintMixRatio: "How much sand and gravel go with one bag of cement. 1:6 is common for mortar.", hintCementDensity: "Weight of one cubic meter of loose cement. 1440 kg/m³ is common.", hintDistLength: "The length that the bars cover — the run of the strip.", hintNumberOfBars: "How many cut bars you will place in this direction.", intro1Title: "Measure", intro1Body: "Measure what you want to build — length, width and height, in meters.", intro2Title: "Enter", intro2Body: "Choose the material and type your numbers. Not sure about a field? Tap ? — or use Fill typical values.", intro3Title: "Order", intro3Body: "Press Calculate. The big number is what you need; \"What to order\" is your shopping list. Save, print or share it.", introNext: "Next", introStart: "Start estimating", barSchedule: "Bar schedule & cutting list", schedMark: "Mark", schedDia: "Dia.", schedShape: "Shape", schedBars: "No. of bars", schedCutLen: "Cut length (m)", schedTotalLen: "Total length (m)", schedWeight: "Net weight (kg)", shapeStraight: "Straight", shapeRing: "Closed ring", schedNote: "Cutting list for one member ({n} in total) — net lengths before wastage. The What-to-order list includes wastage.", backupSection: "Data backup", backupBtn: "Back up (JSON)", restoreBtn: "Restore from file", backupHint: "Saves settings, projects, session rows and history into one JSON file you can keep or move to another device.", backupDone: "Backup file downloaded", restoreDone: "Backup restored", restoreInvalid: "This file is not a valid backup", orderBarsNote: "Yards sell steel as standard 12 m commercial bars — the counts above are bars to order.", brcMesh: "BRC wire mesh", brcSoldAs: "Sold as", brcRolls: "Rolls", brcSheets: "Sheets (panels)", brcPieceW: "Piece width (m)", brcPieceL: "Piece length (m)", brcOverlap: "Overlap / waste allowance (%)", brcArea: "Total area to cover", brcTotal: "Mesh to order", priceEach: "Price per piece", hintBrc: "Ground slabs and driveways often use pre-welded wire mesh instead of tied bars. The count comes from the area plus an overlap allowance.", hintOverlap: "Extra mesh for overlaps and cutting waste. 10% is common.", hintGlue: "Thin-bed adhesive for thermo-stone and AAC blocks, applied 2–3 mm thick. About 4 kg per m² of wall is typical.", hintGrade: "C15 for blinding (1:3:6), C20 for ordinary work (1:2:4), C25–C30 for columns, beams and slabs (1:1.5:3).", glueJointLabel: "Joint type", glueMortar: "Cement mortar (conventional)", glueThinBed: "Thin-bed adhesive", glueRate: "Glue per m² of wall (kg)", glueBag: "Glue bag size (kg)", glueCost: "Price per glue bag", glueAdhesive: "Adhesive (glue)", thermoBlock20: "Thermo-stone hollow (60x20x20cm)", thermoBlock15: "Thermo-stone hollow (60x20x15cm)", aacBlock20: "AAC block (60x20x20cm)", aacBlock15: "AAC block (60x20x15cm)", gradeOptC15: "C15 · Blinding (1:3:6)", gradeOptC20: "C20 · Ordinary (1:2:4)", gradeOptC25: "C25–C30 · High strength (1:1.5:3)", gradeNoteC15: "Lean mix for blinding (clean layer) and fill — not for structural work.", gradeNoteC20: "Ordinary concrete for footings, walls and slabs. About 300–350 kg cement per m³.", gradeNoteC25: "High strength for columns, beams and slabs. About 375–400 kg cement per m³.", convTitle: "Land area converter", convValue: "Area", convM2: "Square meters (m²)", convDunum: "Dunum (2,500 m²)", convOlak: "Olak (100 m²)", convHint: "Type an area in one unit to see it in the others. 1 dunum = 2,500 m²; 1 olak = 100 m².", quoteBtn: "Quote", quoteTitle: "Material Quote", quoteDateLabel: "Date", quoteProject: "Project name", quoteClient: "Client name", quoteContractor: "Contractor / Engineer name", quoteContact: "Contact", quoteNotesLabel: "Notes", quoteItemCol: "Item", quoteQtyCol: "Quantity", quotePriceCol: "Unit price", quoteAmountCol: "Amount", quoteTotalLabel: "Grand total", quoteSignContractor: "Contractor signature", quoteSignClient: "Client signature", quotePrintBtn: "Print / Save as PDF", quoteCloseBtn: "Close", quotePriceHint: "Type the agreed unit price for each line — the amounts and grand total fill in automatically.", quoteNoItems: "Calculate first, then open the quote.", quoteWhatsappBtn: "Send to WhatsApp", quoteWhatsappDone: "Message copied ✓", bagsWord: "bags", piecesWord: "pcs",
                    earthworkTitle: "Earth Work Calculator", resultEarthwork: "Earth Work Estimation Result", excavationVolume: "Total Excavation Volume", numberOfWalls: "Number of Walls",
                    resultConcrete: "Concrete Estimation Result", totalVolume: "Total Volume concrete (Quantities)", cementBags: "Cement Bags", sand: "Sand", aggregate: "Aggregate", cementCost: "Cement Cost", sandCost: "Sand Cost", aggregateCost: "Aggregate Cost", totalCost: "Grand Total (Estimated)",
                    formworkArea: "Formwork Area", formworkCostBreakdown: "Formwork Cost", slabFormwork: "Slab Edge Formwork", columnFormwork: "Column Side Formwork", beamFormwork: "Beam Sides & Bottom Formwork",
                    resultBlocks: "Block Estimation Result", totalBlocks: "Blocks Required", blockCost: "Block Cost", mortarCement: "Mortar Cement", mortarSand: "Mortar Sand",
                    resultBricks: "Brick Estimation Result", totalBricks: "Bricks Required", brickCost: "Brick Cost",
                    resultSteel: "Steel Estimation Result", totalWeight: "Total Weight", barsPerTon: "Bars per Ton",
                    saveToHistory: "Save to History", clearHistory: "Clear History", saveBtn: "Save", csvBtn: "CSV", pdfBtn: "PDF", wallLeaves: "Wall leaves", withWastage: "w/ wastage", inclLap: "incl. lap", netWord: "net", wasteWord: "waste", orderedWord: "ordered", pcsPerM2: "pcs/m²", formworkWord: "formwork", trailInputs: "Inputs", trailElements: "element(s)", trailTotalVolumeWord: "total volume", trailWetVolume: "Wet volume", trailDryVolume: "dry volume", trailDryFactorNote: "dry-volume factor; estimate only", trailCementBeforeWaste: "Cement required before wastage", trailCementWasteAllowance: "Cement wastage allowance", trailOrderQuantity: "order quantity", trailBagsOrdered: "{n} × {kg} kg bags = {w} kg ordered", trailMaterialLine: "{name}: {a} {u} before waste + {b} {u} allowance = {c} {u} ordered", trailPrice: "Price", trailAssumption: "Assumption: the selected ratio is not a certified strength design or approved mix sheet; water and admixtures are excluded.", trailBeforeWaste: "before waste", trailNetToBatch: "{a} m³ net → {b} m³ to batch (waste {c} m³)", trailCementOrdered: "{a} kg required → {b} × {kg} kg = {c} kg ordered (surplus {d} kg from rounding up to whole bags)", trailWaterPerKg: "≈{v} L (0.6 L per kg of cement batched)", trailMixRatioWord: "Nominal mix ratio", trailWasteWord: "Waste", trailAssumptionNominal: "Assumption: nominal ratios do not certify strength.", trailModeWord: "Mode", trailTotalWallVolumeMode: "total wall volume", trailWallDimsMode: "wall dimensions", trailWallVolume: "Wall volume", trailWallThickness: "Wall thickness", trailLeaves: "leaves", trailFaceAreaNote: "Face-area method includes joints and checks implied thickness.", trailSteelNote: "Rough quantity estimate for one selected member; not a reinforcement design schedule. Anchorage, hooks, bends, extra zones, repeated members, and stock-bar cutting are not modeled.", trailGrossVolume: "Gross volume", trailSwell: "Swell", trailTruckCapacity: "Truck capacity",  trailEarthNote: "Rectangular estimate only; slopes, working room, backfill, compaction, and payload limits are not modeled.", excavShape: "Excavation shape", shapeRectangular: "Rectangular pit", shapeTrench: "Trench / strip", shapeCustom: "Custom profile (same L × W × H basis)", mixModeNominal: "Nominal ratio", mixModeCustom: "Custom nominal ratio", mixModeApproved: "Approved recipe per m³", customProduct: "Custom site product", installApp: "Install app", calculationDetails: "Calculation details", backStep: "Back",
                    numWindows: "Number of Windows", numDoors: "Number of Doors", netWallArea: "Net Wall Area", totalOpeningVolume: "Total Opening Volume", totalWallVolume: "Total Wall Volume", byTotalVolume: "Using Total Volume", totalWallVolumeInput: "Total Wall Volume (m³)", totalVolumeInput: "Total Concrete Volume (m³)", calcOptions: "Calculation Options", includeMortar: "Use Mortar Thickness in Calculation", includeMortarBricks: "Use Mortar Thickness in Calculation", mortarVolume: "Volume of Mortar", mortarCementBags: "Cement Bags (Mortar)", cementWeight: "Weight of Cement", mortarSandVolume: "Volume of Sand (Mortar)",
                    selectElement: "Select Structural Element", selectOption: "-- Please Choose --", footing: "Footing", slab: "Slab", beam: "Beam", column: "Column", oneWay: "One-way slab / strip", distLength: "Distribution Length (m)", barLength: "Single Bar Length (m)", footingLength: "Footing Length (m)", footingWidth: "Footing Width (m)", slabLength: "Slab Length (m)", slabWidth: "Slab Width (m)", spacing: "Spacing (mm)", beamLength: "Beam Length (m)", columnHeight: "Column Height (m)", totalLength: "Total Length of Steel", numberOfStirrups: "Number of Stirrups", lengthwiseBars: "Bars along the length", widthwiseBars: "Bars along the width", barsAlongLength: "Bars (Lengthwise)", barsAlongWidth: "Bars (Widthwise)", weightAlongLength: "Weight (Lengthwise)", weightAlongWidth: "Weight (Widthwise)", bySpacing: "By Spacing", byNumberOfBars: "By Number of Bars", includeStirrups: "Include Stirrups Calculation", mainBars: "Main Bars", beamWidthDim: "Beam Width (mm)", beamDepthDim: "Beam Depth (mm)", concreteCover: "Concrete Cover (mm)", stirrupSpacing: "Stirrup Spacing (mm)", stirrupDiameter: "Stirrup Diameter (mm)", columnWidthDim: "Column Width (mm)", columnDepthDim: "Column Depth (mm)", mainBarDetails: "Main Bar Details", stirrupDetails: "Stirrup Details", summary: "Summary", singleStirrupLength: "Single Stirrup Length", includeLapSplice: "Include Lap Splice Calculation", standardBarLength: "Bar length in shops (m)", lapSpliceFactor: "Lap Splice Factor (e.g., 50d)", totalLapLengthAdded: "Total Lap Length Added", totalNumberOfSplices: "Total Number of Lap Splices",
                    saveToProject: "Save to Project", saveCalcTitle: "Save Calculation to Project", selectProjectLabel: "Select Project", newProjectNameLabel: "New Project Name", calculationNameLabel: "Calculation Name", cancelBtn: "Cancel", createNewProjectOption: "--- Create New Project ---", noCalcsSaved: "No calculations saved for this project.", sessionResults: "Session Results", clearTable: "Clear Table", tableHeaderDesc: "Description", tableHeaderDims: "Dimensions", tableHeaderCement: "Cement", tableHeaderSand: "Sand", tableHeaderAggregate: "Aggregate", tableHeaderCost: "Cost", tableHeaderBlocks: "Blocks", tableHeaderBricks: "Bricks", tableHeaderMortarCement: "Mortar Cement", tableHeaderMortarSand: "Mortar Sand", tableHeaderElement: "Element", tableHeaderWeight: "Weight", tableHeaderQty: "Qty", tableHeaderVolume: "Volume", tableHeaderVolumeDim: "Volume / Dimensions", tableHeaderTotalVolume: "Total Volume", cumulativeTotal: "Cumulative Total",
                    saveToHistoryTitle: "Save to History", exportCsvTitle: "Export to CSV", exportPdfTitle: "Export to PDF", exportProjectPdfTitle: "Export Project to PDF", exportProjectCsvTitle: "Export Project to CSV", deleteProjectTitle: "Delete Project", loadTitle: "Load", deleteTitle: "Delete", swipeHint: "Swipe table to view more", step1Dimensions: "Dimensions & quantity", step2Mix: "Mix details", step3Cost: "Costing (optional)", step1General: "General settings", step2Details: "Element details", step1Excavation: "Excavation details", step2Haulage: "Haulage & soil", selectDiameter: "Select Diameter", truckLoads: "Truck Loads", truckCapacityLabel: "Truck Capacity (m³)",
                    errExchangeRate: "Please enter a valid, positive exchange rate for conversion.", errWastage: "Wastage percentage must be between 0 and 50.", errNegative: "Negative values are not allowed.", errProjectName: "Please enter a project name.", errProjectExists: "A project with this name already exists.", errCalcName: "Please enter a name for this calculation.", errNewProjectName: "Please enter a new project name.", errSelectProject: "Please select a project.", errTotalVolumeSingle: "Please enter a valid total volume for a single element.", errNumElements: "Number of elements must be a positive number.", errDimensions: "Please enter valid dimensions.", errBlockDims: "Please ensure all block dimensions are valid numbers.", errTotalVolume: "Please enter a valid total volume.", errDimsWallWidth: "Please enter valid dimensions and wall width.", errOpeningExceeds: "The total opening volume to deduct cannot exceed the gross wall volume.", errBrickDims: "Please ensure all brick dimensions are valid numbers.", errSelectElement: "Please select a structural element first.", errLapSplice: "Please enter valid, positive values for lap splice settings.", errSpacingInputs: "Please fill all spacing inputs with valid numbers.", errNumberInputs: "Please fill all number inputs with valid numbers.", errMainBars: "Please enter valid length, number of bars, and diameter for main bars.", errStirrups: "Please fill all stirrup fields with valid positive numbers.", errRequiredFields: "Please fill in all required fields with valid positive numbers.", errEarthworkDims: "Please enter valid dimensions and a valid number of walls."
                },
                ku: {
                    resetFormLabel: "ڤەگەڕاندنا فۆرمێ", themeToggleLabel: "دۆخێ تاری", closeLabel: "گرتن", languageLabel: "زمان", swellFactorLabel: "رێژەیا ئاوسانا ئاخێ (%)", looseVolume: "قەبارێ ئاخا سست (بۆ ڤەگوهاستنێ)", soffitFormwork: "قالبێ ژێرێ بانی (تنێ بۆ بانێن هەلاویستی)", appTitle: "خەمڵێنەری کەرەستێن بیناسازی", appSubtitle: "خەمڵێنەری کەرەستێن بیناسازی", workspaceEyebrow: "FIELDNOTE / کارێ خەمڵاندنێ", readyForTakeoff: "ئامادەیە بۆ خەمڵاندن", workspaceHeadline: "پیڤانێن جهێ کارێ بکە بە پلانەکا کەرەستەیی.", workspaceDescription: "جۆرێ کارێ هەلبژێرە، بڕێن خۆ بنڤیسە و خەمڵاندنەکا ڕوون و هەناردەکراو وەرگرە.", workspaceSettings: "رێکخستنێن پروژێ", workspaceHistory: "هەژمارێن دوماهیێ", activeToolLabel: "ئامرازێ چالاک", activeToolMeta: "هەژمارکەرەکێ ل خوارێ هەلبژێرە", sessionItemsLabel: "بڕێن ڕوونشتێ", sessionItemsMeta: "هەژمار د ڤێ ڕوونشتێ دا", defaultWastageLabel: "بەفیڕۆچوونا بنەڕەتی", defaultWastageMeta: "ژ رێکخستنێن پروژێ ڤەگوهێزە", mobileGuide: "بەشێن ژ سەرەوە بۆ خوارێ پڕبکە، پاشێ کلیک ل هەژمارکرنێ بکە.", globalSettings: "رێکخستنێن گشتی", calcHistory: "مێژوویا هەژمارکرنێ", noHistory: "هێشتا چ هەژمارکرن نینن",
                    wastageLabel: "رێژا گشتی یا بەرهەدەرچوونێ (%)", currencySymbol: "دراڤ", exchangeRateLabel: "نرخێ ١٠٠$ بەرامبەر IQD", projectsBtn: "کارگێریا پروژا", projectsTitle: "رێکخستنا پروژا", saveBtn: "پاشکەفتکە", noProjects: "چ پروژێن پاشکەفتکری نینن.", appDesigner: "دیزاین ژلایێ ئەندازیار ڕێزان صالح نوری",
                    stepOf: "گاڤ", nextStep: "بێهتر", reviewStep: "ڤەگەراندن و هەژمارتن", homeEyebrow: "هەژمارکەرا ماددەیێن ئاڤاکاریێ", homeTitle: "تۆ دڤێت چ هەژمار بکەی؟", homeSubtitle: "ماددەیەکێ هەلبژێرە، پیڤانێن خۆ بنڤیسە، و هەژمارا ماددەیان ب مۆرتار و چیمەنتۆ و خیلێ و بهایێ وەربگرە.", homeBack: "هەمی ئامێر", homeTip: "ئەنجام تەنێ هەژماراندنە. بەری دەستپێکێ رێژا بەرهەدەرچوونێ د زانیاریێن پرۆژەی دەست نیشان بکە.", homeConcreteDesc: "تەختە، بنگەه، تیر و ستوون", homeBlocksDesc: "دیوارێن بلۆکێ چیمەنتۆ ب ڕووبەر یان قەبارە", homeBricksDesc: "دیوارێن خشتی دگەل مۆرتار و ڤالاهیان", homeSteelDesc: "کێشا شیشێ و بهایێ ب پێی ئەندام", homeEarthworkDesc: "کۆلان، پڕکرن و بارێن ترومبێلان", homeSettingsDesc: "بەرهەدەرچوون، دراڤ و زانیاریێن پرۆژەی", tabConcrete: "کۆنکریت", tabBlocks: "بلۆک", tabBricks: "خشت", tabSteel: "شیش", tabEarthwork: "کارێ ئەردی", errorTitle: "خەلەتی:", calculateBtn: "هەژمار بکە", resetBtn: "ڤەگەڕاندن", deductOpenings: "رێکخستنا ڤالاهیان", createProjectBtn: "دروستکرن",
                    concreteTitle: "هەژمارکەرێ کۆنکریتی", appType: "جورێ ئەندامێ کۆنکریتى", mixRatio: "چیمەنتۆ : قوم : حەسو، بەپێی قەبارەی سستی", slabOption: "ئەرد / بناغە", columnOption: "ستوین", beamOption: "جسر", dryVolumeFactor: "فاکتەرێ قەبارێ هشک (خەمڵاندن)", dryVolumeFactorNote: "تنێ خەمڵاندنە؛ بەرهەمی ڕاستەقینە بەپێی کەرەستە و تێکەڵکردن دەگۆڕێت.", customRatioNote: "ئەمە هێشتا رێژەیەکا بنەڕەتی یا قەبارەی سستە، نە دیزاینەکا پەسەندکراوی تێکەلیێ.", cementDensity: "چڕیا سستی چیمەنتوی (کگم/م³)", mortarMixRatio: "رێژا تێکەلا خەلتەی (چیمەنتو:قوم)", length: "درێژی (م)", width: "پانی (م)", thickness: "ستووری / قووڵی (م)", height: "بلندی / قووڵی (م)", costCementBag: "بهایێ کیسێ چیمەنتوی", costSandM3: "بهایێ م³ قوم", costAggregateM3: "بهایێ م³ حەسو", numberOfElements: "ژمارا ئەندامان (ستوین/جسر)",
                    blocksTitle: "هەژمارکەرێ بلۆکێن چیمەنتوی", calcMode: "هەژمارکرن ب رێکا", byDimensions: "ب رێکا پیڤانا ئەندامێ", blockType: "جورێ بلۆکێ", wallWidth: "پانییا دیوارى (م)", wallLength: "درێژیا دیوارى (م)", wallHeight: "بلندیا دیوارى (م)", blockLength: "درێژی (سم)", blockWidth: "پانی (سم)", blockHeight: "بلندی (سم)", solidBlock20: "تژی (٤٠×٢٠×٢٠سم)", solidBlock15: "تژی (٤٠×٢٠×١٥سم)", hollowBlock: "فالە (٤٠×٢٠×٢٠سم)", lightweightBlock: "سڤك (٦٠×٢٠×١٠سم)", costPerBlock: "بهایێ هەر بلۆکەکێ", mortarCementCost: "بهایێ چیمەنتوی/کیسک", mortarSandCost: "بهایێ قوما/م³",
                    bricksTitle: "هەژمارکەرێ خشت", brickType: "جورێ خشتى", standardBrick: "ستاندەرد (٢١٥×١٠٢.٥×٦٥مم)", engineeringBrick: "ئەندازیاری (٢١٥×١٠٢.٥×٧٣مم)", romanBrick: "رومانی (٢٩٠×٩٠×٤٠مم)", hollowBrick: "خشتێ فالە (٣٠×١٢×١٢ سم)", localBrick: "خشتێ عيراقى IQS 25 (٢٤×١١.٥×٧.٥سم)", brickLength: "درێژی (مم)", brickWidth: "پانی (مم)", brickHeight: "بلندی (مم)", mortarThickness: "ستوورییا خەلتەی (سم)", costPerBrick: "بهایێ هەر خشتەکێ",
                    steelTitle: "هەژمارکەرێ شیشێ", diameter: "تیرە (مم)", lengthPerBar: "درێژاهیا تاکە شیشەکێ (م)", numberOfBars: "ژمارا شیشان", costPerKg: "بهایێ هەر کیلویەکێ", unitWeight: "کێشا مەترەکێ (کگم/م)", barsLabel: "شیش", quantities: "بڕ", memberQuantity: "ژمارا ئەندامان (هەمان قەبارە)", lapSplicesAdvanced: "لێکدانا شیشان (بۆ شیشێن درێژ)", customBars: "شیشێن تایبەت", addRowBtn: "زیادکرنا ڕیزێ", removeRowBtn: "سڕینەوە", perMember: "بۆ هەر ئەندامێک", errCustomRows: "تەنها یێک ڕیز زیاد بکە دگەل تیرە و ژمارا شیشان و درێژی.", helpBtn: "یارمەتی", presetBtn: "بەها باوەڕپێکراوەکان پڕبکەرەوە", sanityIntro: "ئەم بەها بپشکنە:", sanityUnusual: "نائاسایییە — تکایە بپشکنە", hintSpacing: "دووریا دێ نێڤ دو شیشەکاندایە — ژ دەڤا-دەڤەکێان.", hintDiameter: "قووریا تاکە شیشەکێ.", hintCalcMode: "ب ناڤبەرژمارا شیشان د دووریێ دەربدات. ب ژمارا شیشان: ژمارێن تۆ د دزین.", hintCover: "کۆنکریتێ نێڤ شیشێ و ڕوویا دەرڤییێ — شیشێ دپارێزت. 40 مم گشتییە.", hintStirrupSpacing: "دووریا دێ نێڤ دو ئێترییاندایە.", hintStirrupDiameter: "قووریا ئێترییێ. Ø8 گشتییە.", hintBarLength: "درێژیا تاکە شیشەکێ وەک دوکان دەفرۆشت — پێی گشتی 12 م. بۆ ژمارکرنا شیشان.", hintLapFactor: "شیشێن درێژتر ل شیشێن دوکانییان لێک دەخرێن. 50d یعنی لێکدان 50 × تیرەی شیشە.", hintMemberQty: "ژمارا ئەندامانی هەمانبەت — وەک 5 بناغەی هەمان.", hintCostPerKg: "بهایێ هەر کیلویەک.", hintTruck: "ئەوەی یێک ترومبێل دگرت ب م³.", hintSwell: "خاکی کولراو زیاتر دەبێت. 25–30% گشتییە.", hintMortar: "قووریا خەلتەی نێڤ بلۆکان/خشتان.", hintDryFactor: "خەلتێڤێ خشکە کەم دبێت کاتێئاڤ زیاد دکرێت. 1.33 گشتییە.", hintMixRatio: "چەند قوم و حەسو ب هەر خورێچیمەنتۆ. 1:6 ب خەلتە گشتییە.", hintCementDensity: "کێشا م³ چیمەنتۆی ڤێرکاو. 1440 کگم/م³ گشتییە.", hintDistLength: "ئەو درێژییێی ک شیشەکان د پێان دانا.", hintNumberOfBars: "ئەو ژمارا شیشانێی تۆ د دا ناڤ ئەم ئاراستەیێ.", intro1Title: "پێوانە بگرە", intro1Body: "ئەوەی دڤێت ساز بکەی پێوانە بگرە — درێژی، پانی و بلندی، ب مەتر.", intro2Title: "بنڤیسە", intro2Body: "ماددە هەلبژێرە و ژمارەکانت بنڤیسە. د دوودڵییت؟ ؟ دابخە — یان «بەها باوەڕپێکراوەکان» بکاربهێنە.", intro3Title: "فرۆشتن", intro3Body: "«هەژمار بکە» دابخە. ژمارە گەورەئەوەی پێویستە؛ «ئەو چی دڤێت فرۆشی» لیستا فرۆشتنە. پاشەکەوت بکە، چاپ بکە یان هاوبەش بکە.", introNext: "بێهتر", introStart: "دەستپێبکە", barSchedule: "لیستا شیشان و برینەکان", schedMark: "نیشانە", schedDia: "تیرە", schedShape: "شێوە", schedBars: "ژمارا شیشان", schedCutLen: "درێژیا برینە (م)", schedTotalLen: "درێژیا گشتی (م)", schedWeight: "کێشا ساف (کگ)", shapeStraight: "راست", shapeRing: "ئەتارییا داخراو", schedNote: "لیستا برینە بۆ یێک ئەندام ({n} ئەندامان گشتی) — درێژیێن ساف پێش بەفیڕۆچوون. لیستا سیارکرنا بەفیڕۆچوونێ تێدایە.", backupSection: "پاشەکەوتی داتا", backupBtn: "پاشەکەوت (JSON)", restoreBtn: "گەڕاندنەوە ل فایلێ", backupHint: "ڕێکخستن، پرۆژە، ڕیزێن روونشتنێ و مێژوو دیێک فایلێ JSON دا پاشەکەوت دکات.", backupDone: "فایلێ پاشەکەوتییێ هاتە داگرتن", restoreDone: "پاشەکەوتییەکە گەڕێندرایەوە", restoreInvalid: "ئەم فایلە پاشەکەوتییا دروست نییە", orderBarsNote: "دوکاندار شیشێ ب شیشێن بازرگانییێن 12 مەترییێن دەفرۆشن — ژمارا سەرەوە ژمارا شیشانێن کڕینە.", brcMesh: "تۆری سیمی (BRC)", brcSoldAs: "ب چی دەفرێشرێت", brcRolls: "پێچەکان", brcSheets: "پەرچەکان (تەختەکان)", brcPieceW: "پانیا پارچەیەکێ (م)", brcPieceL: "درێژیا پارچەیەکێ (م)", brcOverlap: "جێگیرا هاوکێشکرنا و پێچاندنێ (%)", brcArea: "کۆیا مساحەت", brcTotal: "تۆری پێویست", priceEach: "بهایێ هەر پارچەیەکێ", hintBrc: "سەرە زەمینان و ڕێگایان زۆر کات تۆری سیمی بکار دێنن بنڤیسە شیشێن بەستراو. ژمارە ژ مساحەتێ هاتیت دگەل جێگیرا هاوکێشکردنێ.", hintOverlap: "تۆری زیاتر بۆ هاوکێشکرنا و پێچاندنا پارچان. 10% گشتییە.", hintGlue: "چەسپا چانێ باریکی بۆ بلۆکا ثەرمەستۆنی و AAC، دگەل قەباری 2–3 مم. نزیکەی 4 کگم بۆ هەر م² ژ دیوارێ.", hintGrade: "C15 بۆ صبة نظافة (1:3:6)، C20 بۆ کارا عادیی (1:2:4)، C25–C30 بۆ ستوین و جسر و ئەردان (1:1.5:3).", glueJointLabel: "جۆری خەلتە", glueMortar: "خەلتێ چیمەنتی (دەستڕایگە)", glueThinBed: "چەسپی چانێ باریک", glueRate: "چەسپ بۆ هەر م² ژ دیوارێ (کگم)", glueBag: "قەباریا کیسا چەسپی (کگم)", glueCost: "بهایێ هەر کیسا چەسپی", glueAdhesive: "چەسپ (ماددەی چەسپاندنێ)", thermoBlock20: "بلۆکا ثەرمەستۆنی بەتاڵ (60x20x20 سم)", thermoBlock15: "بلۆکا ثەرمەستۆنی بەتاڵ (60x20x15 سم)", aacBlock20: "بلۆکا ئۆتۆکلاڤ AAC (60x20x20 سم)", aacBlock15: "بلۆکا ئۆتۆکلاڤ AAC (60x20x15 سم)", gradeOptC15: "C15 · صبة نظافة (1:3:6)", gradeOptC20: "C20 · کۆنکریتی عادی (1:2:4)", gradeOptC25: "C25–C30 · بەهێزیا بەرز (1:1.5:3)", gradeNoteC15: "تێکەڵییا لاواز بۆ صبة نظافة و پڕکرناوە — بۆ کاری سازەکاری نییە.", gradeNoteC20: "کۆنکریتی عادی بۆ بناغە و دیوار و ئەرد. نزیکەی 300–350 کگم چیمەنت بۆ هەر م³.", gradeNoteC25: "بەهێزیا بەرز بۆ ستوین و جسر و ئەردان. نزیکەی 375–400 کگم چیمەنت بۆ هەر م³.", convTitle: "گۆڕینەنا یەکانی مساحەتی زەمینێ", convValue: "مساحەت", convM2: "مەتری دووبارە (م²)", convDunum: "دونم (2,500 م²)", convOlak: "ئۆلەک (100 م²)", convHint: "مساحەت بنڤیسە ب یەک یەکە بۆ دیتنی هەموو یەکان. 1 دونم = 2,500 م²؛ 1 ئۆلەک = 100 م².", quoteBtn: "پێشنیاری بها", quoteTitle: "پێشنیاری بهای مادەیێ", quoteDateLabel: "بەروار", quoteProject: "ناوی پرۆژەی", quoteClient: "ناوی کڕیاری", quoteContractor: "ناوی پێکهاتەگەر / ئیندەزیار", quoteContact: "پەیوەندی", quoteNotesLabel: "تێبینی", quoteItemCol: "دانە", quoteQtyCol: "بڕ", quotePriceCol: "بهایێ یەکێ", quoteAmountCol: "بڕی پارە", quoteTotalLabel: "کۆیا گشتی", quoteSignContractor: "واژووی پێکهاتەگەری", quoteSignClient: "واژووی کڕیاری", quotePrintBtn: "چاپکرنا / پاشەکەوتی PDF", quoteCloseBtn: "داخستن", quotePriceHint: "بهایێ یەکێی ڕێککراو بنڤیسە بۆ هەر دانەیەک — بڕان و کۆیا گشتی ب شێوییا خۆکار پڕ دبنەوە.", quoteNoItems: "پێشتر هەژمار بکە، پاشان پێشنیاری بها بکەرەوە.", quoteWhatsappBtn: "نارینە ب واتساپ", quoteWhatsappDone: "پەیام هاتە کوپیکرن ✓", bagsWord: "کیسک", piecesWord: "دانە",
                    earthworkTitle: "هەژمارکەرێ کارێ ئەردی", resultEarthwork: "ئەنجامێ هەژمارا کارێ ئەردی", excavationVolume: "قەبارێ گشتیێ کولانێ", numberOfWalls: "ژمارا دیواران",
                    resultConcrete: "ئەنجامێ هەژمارا کۆنکریتی", totalVolume: "قەبارێ گشتیێ کۆنکریتی (بڕ)", cementBags: "کیسکێن چیمەنتوی", sand: "قوم", aggregate: "حەسو", cementCost: "بهایێ چیمەنتوی", sandCost: "بهایێ قومی", aggregateCost: "بهایێ حەسو", totalCost: "کۆی گشتی (تخمينکری)", formworkArea: "ڕووبەرێ قالبی", formworkCostBreakdown: "تێچووی قاڵب", slabFormwork: "ڕووبەرێ قالبی یێ دەورێ ئەردی", columnFormwork: "ڕووبەرێ قالبی یێ لایێن ستوینێ", beamFormwork: "ڕووبەرێ قالبی یێ لای و بنێ جسری",
                    resultBlocks: "ئەنجامێ هەژمارا بلۆکان", totalBlocks: "بلۆکێن پێدڤی", blockCost: "بهایێ بلۆکان", mortarCement: "چیمەنتویێ خەلتەی", mortarSand: "قوما خەلتەی", resultBricks: "ئەنجامێ هەژمارا خشتان", totalBricks: "خشتێن پێدڤی", brickCost: "بهایێ خشتان", resultSteel: "ئەنجامێ هەژمارا شیشی", totalWeight: "کێشا گشتی", barsPerTon: "ژمارا شیشان د هەر تەنەکێ دا",
                    saveToHistory: "پاشکەفت ب مێژوویێ", clearHistory: "پاککرنا مێژوویێ", saveBtn: "پاشکەفت", csvBtn: "CSV", pdfBtn: "PDF", wallLeaves: "چینێن دیوارێ", withWastage: "بە فیڕۆچوون", inclLap: "بە لێکدان", netWord: "ساف", wasteWord: "بەفیڕۆچوون", orderedWord: "سیارەکراو", pcsPerM2: "دەنە/م²", formworkWord: "قاڵب", trailInputs: "تێکەران", trailElements: "ئەندام", trailTotalVolumeWord: "قەبارێ گشتی", trailWetVolume: "قەبارێی بیس", trailDryVolume: "قەبارێی شک", trailDryFactorNote: "فاکتەری قەبارێ شک؛ تنێ خەمڵاندنە", trailCementBeforeWaste: "چیمەنتویێ پێدڤی جی بەفیڕۆچوونێ", trailCementWasteAllowance: "پارچەیا بەفیڕۆچوونا چیمەنتویێ", trailOrderQuantity: "بڕێ سیارەکراو", trailBagsOrdered: "{n} × {kg} کگ کیسک = {w} کگ سیارەکراو", trailMaterialLine: "{name}: {a} {u} جی بەفیڕۆچوونێ + {b} {u} پارچە = {c} {u} سیارەکراو", trailPrice: "بەها", trailAssumption: "پێشگرتن: ڕەژەیا هەلبژێرییەکێ نییە دیزاینێ ستوورییا ئێمانەتپێبوو یان چارەسەرێ تێکەلیا ڕەسمی؛ ئاڤ و زیادکراوان ل دەرەوەیین.", trailBeforeWaste: "جی بەفیڕۆچوونێ", trailNetToBatch: "{a} م³ ساف → {b} م³ بۆ تێکەڵکرنێ (بەفیڕۆچوون {c} م³)", trailCementOrdered: "{a} کگ پێدڤی → {b} × {kg} کگ = {c} کگ سیارەکراو (زیادە {d} کگ ل ڕندکرنێ)", trailWaterPerKg: "≈{v} لتر (0.6 لتر بۆ هەر کگ چیمەنتویێ)", trailMixRatioWord: "ڕەژەیا خەمڵاندنێ", trailWasteWord: "بەفیڕۆچوون", trailAssumptionNominal: "پێشگرتن: ڕەژەیێن خەمڵاندنێ ستوورییا ئێمانەتپێبوو نییە.", trailModeWord: "مۆد", trailTotalWallVolumeMode: "قەبارێ گشتیێ دیوار", trailWallDimsMode: "پیڤانێن دیوارێ", trailWallVolume: "قەبارێ دیوار", trailWallThickness: "ئەستوورییا دیوارێ", trailLeaves: "چین", trailFaceAreaNote: "ڕێگایا ڕووبەرێ درزەکان تێدایە و ئەستوورییا جی پێکھاتی دیتنە.", trailSteelNote: "خەمڵاندنا بڕێ ناڤبەرا بۆ ئەندامەکێ هەلبژێریی؛ نیشاندەری سێمانداری نییە. ئەنکەر، هوک، لێکدان، ڕێژای زیاتر، ئەندامێن دوپەخۆ و کوپکرنێ شیشێن ستۆکێ نەمۆدەلێن.", trailGrossVolume: "قەبارێ گشتی", trailSwell: "ئاوسان", trailTruckCapacity: "قەبارێ بارەهەلگری",  trailEarthNote: "تنێ خەمڵاندنا ڕووەنتی؛ تەمکان، شوێنا کارێ، پیژاندن، پڕکردن و سنوورێن بارێ نەمۆدەلێن.", excavShape: "شێوازێ کوپتنێ", shapeRectangular: "کوردێ چوارگۆشەیی", shapeTrench: "کەناڵ / تاسە", shapeCustom: "پێکهاتەیا تایبەت (بە بنەمای L × W × H)", mixModeNominal: "ڕەژەیا ناونراو", mixModeCustom: "ڕەژەیا ناونراوی تایبەت", mixModeApproved: "تێکەلێ پەسەندکراو بۆ ١ م³", customProduct: "کەرەستەی تایبەتی جێی کار", installApp: "ئەپەکە دابەزە", calculationDetails: "وردەکارییێن هەژمارتنێ", backStep: "گەڕانەوە", numWindows: "ژمارا پەنجەرەیان", numDoors: "ژمارا دەرگایان", netWallArea: "ڕووبەرا دیوارێ صافی", totalOpeningVolume: "کومێ قەبارا ڤالاهیان", totalWallVolume: "قەبارێ گشتیێ دیوارى", byTotalVolume: "ب رێکا قەبارێ گشتی", totalWallVolumeInput: "قەبارێ گشتیێ دیوارى (م³)", totalVolumeInput: "قەبارێ گشتیێ کۆنکریتی (م³)", calcOptions: "ئەگەرێن هەژمارکرنێ", includeMortar: "ستوورییا خەلتەی بکاربینە د هەژمارکرنێ دا", includeMortarBricks: "ستوورییا خەلتەی بکاربینە د هەژمارکرنێ دا", mortarVolume: "قەبارێ خەلتەی", mortarCementBags: "کیسکێن چیمەنتویا خەلتەی", cementWeight: "کێشا چیمەنتوی", mortarSandVolume: "قەبارێ قوما خەلتەی",
                    selectElement: "ئەندامێ سازییێ هەلبژێره", selectOption: "-- تکایە هەلبژێره --", footing: "بناغە", slab: "ئەرد", beam: "جسر", column: "ستوین", oneWay: "شیشێ ئەردێ ئێک-ئاراستە", distLength: "درێژیا بەلاڤبوونێ (م)", barLength: "درێژیا تاکە شیشەکێ (م)", footingLength: "درێژیا بناغەی (م)", footingWidth: "پانیا بناغەی (م)", slabLength: "درێژیا ئەردی (م)", slabWidth: "پانیا ئەردی (م)", spacing: "ناڤبەر (مم)", beamLength: "درێژیا جسری (م)", columnHeight: "بلندیا ستوینێ (م)", totalLength: "کۆیا درێژیا شیشی", numberOfStirrups: "ژمارا ئێترییان", lengthwiseBars: "شیشێن تەریب دگەل درێژیێ", widthwiseBars: "شیشێن تەریب دگەل پانیێ", barsAlongLength: "شیش (ل درێژیێ)", barsAlongWidth: "شیش (ل پانیێ)", weightAlongLength: "کێش (ل درێژیێ)", weightAlongWidth: "کێش (ل پانیێ)", bySpacing: "لدیڤ ناڤبەرێ", byNumberOfBars: "لدیڤ ژمارا شیشان", includeStirrups: "هەژمارکرنا ئێترییان تێدا بیت", mainBars: "شیشێن سەرەکی", beamWidthDim: "پانیا جسری (مم)", beamDepthDim: "قوولیا جسری (مم)", concreteCover: "بەرگێ کۆنکریتی (مم)", stirrupSpacing: "ناڤبەرا ئێترییان (مم)", stirrupDiameter: "تیرێ ئێتری (مم)", columnWidthDim: "پانیا ستوینێ (مم)", columnDepthDim: "قووڵیا ستوینێ (مم)", mainBarDetails: "هویرکاریێن شیشێن سەرەکی", stirrupDetails: "هویرکاریێن ئێترییان", summary: "کورتە", singleStirrupLength: "درێژیا تاکە ئێتریەکێ", includeLapSplice: "لێکدانا شیشی هەژمار بکە", standardBarLength: "درێژیا شیشێ د دوکانێ (م)", lapSpliceFactor: "فاکتەرێ لێکدانێ (وەک ٥٠d)", totalLapLengthAdded: "کۆیا درێژیا لێکدانێ", totalNumberOfSplices: "کۆیا ژمارا لێکدانان",
                    saveToProject: "پاشکەفتکە د پروژەی دا", saveCalcTitle: "پاشکەفتکرنا هەژمارکرنێ", selectProjectLabel: "پروژەیەکێ هەلبژێرە", newProjectNameLabel: "ناڤێ پروژێ نوی", calculationNameLabel: "ناڤێ هەژمارکرنێ", cancelBtn: "پاشگەزبوون", createNewProjectOption: "--- پروژەکێ نوی دروستکە ---", noCalcsSaved: "چ هەژمارکرن بۆ ڤی پروژەی نەهاتینە پاشکەفتکرن.", sessionResults: "ئەنجامێن ڤێ روونشتنێ", clearTable: "پاککرنا خشتەی", tableHeaderDesc: "پێناسە", tableHeaderDims: "پیڤان", tableHeaderCement: "چیمەنتو", tableHeaderSand: "قوم", tableHeaderAggregate: "حەسو", tableHeaderCost: "بها", tableHeaderBlocks: "بلۆک", tableHeaderBricks: "خشت", tableHeaderMortarCement: "چیمەنتویێ خەلتەی", tableHeaderMortarSand: "قوما خەلتەی", tableHeaderElement: "ئەندام", tableHeaderWeight: "کێش", tableHeaderQty: "ژمارە", tableHeaderVolume: "قەبارە", tableHeaderVolumeDim: "قەبارە / پیڤان", tableHeaderTotalVolume: "قەبارێ گشتی", cumulativeTotal: "کۆی گشتی", saveToHistoryTitle: "پاشکەفتکرن د مێژوویێ دا", exportCsvTitle: "هنارتن بۆ CSV", exportPdfTitle: "هنارتن بۆ PDF", exportProjectPdfTitle: "پرۆژەی هنارتن بۆ PDF", exportProjectCsvTitle: "پرۆژەی هنارتن بۆ CSV", deleteProjectTitle: "ژێبرنا پرۆژەی", loadTitle: "بارکرن", deleteTitle: "ژێبرن", swipeHint: "خشتەیی ڕابکێشە بۆ دیتنا پتر", step1Dimensions: "پیڤان و بڕ", step2Mix: "تایبەتمەندیێن تێکەلیێ", step3Cost: "بها (ئارەزوومەندانە)", step1General: "ڕێکخستنێن گشتی", step2Details: "هویرکاریێن ئەندامى", step1Excavation: "هویرکاریێن کولانێ", step2Haulage: "بارەهەلگر و ئاخ", selectDiameter: "تیرێ هەلبژێرە", truckLoads: "بارێن بارەهەلگرێ", truckCapacityLabel: "قەبارێ بارەهەلگری (م³)",
                    errExchangeRate: "هیڤیيە نرخەکێ دروست و ئەرێنی یێ گوهۆڕینێ بنڤیسە.", errWastage: "رێژا بەرهەدەرچوونێ پێدڤیە دناڤبەرا ٠ و ٥٠ دا بیت.", errNegative: "بهایێن نەرێنی (سالب) ناهێنە قەبوولکرن.", errProjectName: "هیڤیيە ناڤێ پروژەی بنڤیسە.", errProjectExists: "پروژەیەک ب ڤی ناڤی هەیە.", errCalcName: "هیڤیيە ناڤەکێ بۆ ڤێ هەژمارکرنێ بنڤیسە.", errNewProjectName: "هیڤیيە ناڤەکێ نوی یێ پروژەی بنڤیسە.", errSelectProject: "هیڤیيە پروژەیەکێ هەلبژێرە.", errTotalVolumeSingle: "هیڤیيە قەبارەکێ گشتی یێ دروست بۆ تاکە ئەندامەکێ بنڤیسە.", errNumElements: "ژمارا ئەندامان پێدڤیە ژمارەیەکا موجەب بیت.", errDimensions: "هیڤیيە پیڤانێن دروست بنڤیسە.", errBlockDims: "پشتڕاستبە کو هەمی پیڤانێن بلۆکی ژمارەیێن دروستن.", errTotalVolume: "هیڤیيە قەبارەکێ گشتی یێ دروست بنڤیسە.", errDimsWallWidth: "هیڤیيە پیڤانێن دروست و پانیا دیوارى بنڤیسە.", errOpeningExceeds: "قەبارێ ڤالاهیان نابیت ژ قەبارێ دیوارى پتر بیت.", errBrickDims: "پشتڕاستبە کو هەمی پیڤانێن خشتی ژمارەیێن دروستن.", errSelectElement: "هیڤیيە دەستپێکێ ئەندامێ سازییێ هەلبژێرە.", errLapSplice: "هیڤیيە بهایێن دروست و ئەرێنی بۆ رێکخستنێن لێکدانێ بنڤیسە.", errSpacingInputs: "هیڤیيە هەمی خانەیێن ناڤبەران ب ژمارەیێن دروست تژی بکە.", errNumberInputs: "هیڤیيە هەمی خانەیێن ژماران ب ژمارەیێن دروست تژی بکە.", errMainBars: "هیڤیيە درێژی و ژمارا شیشان و تیرەی دروست بۆ شیشێن سەرەکی بنڤیسە.", errStirrups: "هیڤیيە هەمی خانەیێن ئێترییان ب ژمارەیێن دروست و ئەرێنی تژی بکە.", errRequiredFields: "هیڤیيە هەمی خانەیێن پێدڤی ب ژمارەیێن دروست و ئەرێنی تژی بکە.", errEarthworkDims: "هیڤیيە پیڤانێن دروست و ژمارەیەکا دروست یا دیواران بنڤیسە."
                },
                ks: {
                    resetFormLabel: "ڕیسێتکردنی فۆرم", themeToggleLabel: "دۆخی تاریک", closeLabel: "داخستن", languageLabel: "زمان", swellFactorLabel: "ڕێژەی ئاوسانی خاک (%)", looseVolume: "قەبارەی خاکی شل (بۆ گواستنەوە)", soffitFormwork: "قاڵبی ژێرەوەی سەقف (تەنها بۆ سەقفی هەڵواسراو)", appTitle: "خەمڵێنەری کەرەستەی بیناسازی", appSubtitle: "خەمڵێنەری کەرەستەی بیناسازی", workspaceEyebrow: "FIELDNOTE / شوێنی خەمڵاندن", readyForTakeoff: "ئامادەیە بۆ خەمڵاندن", workspaceHeadline: "پێوانەکانی شوێنی کار بکە بە پلانێکی کەرەستە.", workspaceDescription: "بواری کار هەڵبژێرە، بڕەکان بنووسە و خەمڵاندنێکی ڕوون و هەناردەکراو وەربگرە.", workspaceSettings: "ڕێکخستنەکانی پڕۆژە", workspaceHistory: "ئەژمارەکانی دوایی", activeToolLabel: "ئامرازی چالاک", activeToolMeta: "خەمڵێنەرێک لە خوارەوە هەڵبژێرە", sessionItemsLabel: "دانەکانی دانیشتن", sessionItemsMeta: "ئەژمارەکانی ئەم دانیشتنە", defaultWastageLabel: "بەفیڕۆچوونی بنەڕەت", defaultWastageMeta: "لە ڕێکخستنەکانی پڕۆژە بگۆڕە", mobileGuide: "بەشەکان لە سەرەوە بۆ خوارەوە پڕ بکە، پاشان کلیک لە ئەژمارکردن بکە.", globalSettings: "ڕێکخستنە گشتییەکان", calcHistory: "مێژووی ئەژمارکردنەکان", noHistory: "هیچ مێژوویەکی ئەژمارکردن نییە",
                    wastageLabel: "ڕێژەی گشتیی بەفیڕۆچوون (%)", currencySymbol: "دراو", exchangeRateLabel: "نرخی ١٠٠ دۆلار بەرامبەر دینار", projectsBtn: "بەڕێوەبردنی پڕۆژەکان", projectsTitle: "بەڕێوەبردنی پڕۆژەکان", saveBtn: "پاشەکەوت", noProjects: "هیچ پڕۆژەیەکی پاشەکەوتکراو نییە.", appDesigner: "دیزاین لەلایەن ئەندازیار ڕێزان ساڵح نووری",
                    stepOf: "هەنگاو", nextStep: "دواتر", reviewStep: "پێداچوونەوە و ئەژمارکردن", homeEyebrow: "خەمڵێنەری ماددەی بیناسازی", homeTitle: "دەتەوێت چی خەمڵاندن بکەیت؟", homeSubtitle: "ماددەیەک هەڵبژێرە، پێوانەکانت بنووسە، و خەمڵاندنی تەواوی ماددەکان لەگەڵ مۆرتار و چیمەنتۆ و خۆڵ و نرخ وەربگرە.", homeBack: "هەموو ئامێرەکان", homeTip: "ئەنجامەکان تەنها خەمڵاندنن. پێش دەستپێکردن ڕێژەی بەفیڕۆچوون لە زانیارییەکانی پڕۆژە دیاری بکە.", homeConcreteDesc: "تەختە، بناغە، تیر و ستوون", homeBlocksDesc: "دیواری بلۆکی چیمەنتۆ بە ڕووبەر یان قەبارە", homeBricksDesc: "دیواری خشت لەگەڵ مۆرتار و کونەکان", homeSteelDesc: "کێشی شیش و تێچوو بەپێی ئەندام", homeEarthworkDesc: "هەڵکەندن، پڕکردنەوە و بارەکانی بارھەڵگر", homeSettingsDesc: "بەفیڕۆچوون، دراو و زانیارییەکانی پڕۆژە", tabConcrete: "کۆنکریت", tabBlocks: "بلۆک", tabBricks: "خشت", tabSteel: "شیش", tabEarthwork: "کاری زەوی", errorTitle: "هەڵە:", calculateBtn: "ئەژمار بکە", resetBtn: "ڕیسێت", deductOpenings: "بەڕێوەبردنی کراوەکان", createProjectBtn: "دروستکردن",
                    concreteTitle: "ئەژمارکەری کۆنکریت", appType: "جۆری ئەندامی کۆنکریتی", mixRatio: "چیمەنتۆ : لم : چەو، بەپێی قەبارەی سست", slabOption: "تەختە / بناغە", columnOption: "ستوون", beamOption: "جسر", dryVolumeFactor: "فاکتەری قەبارەی وشک (خەمڵاندن)", dryVolumeFactorNote: "تەنها خەمڵاندنە؛ بەرهەمی ڕاستەقینە بە پێی کەرەستە و تێکەڵکردن دەگۆڕێت.", customRatioNote: "ئەمە هێشتا ڕێژەیەکی بنەڕەتییە بە قەبارەی سست، نە دیزاینی تێکەڵەی پەسەندکراو.", cementDensity: "چڕی سستی چیمەنتۆ (کگم/م³)", mortarMixRatio: "ڕێژەی تێکەڵەی گیراوە (چیمەنتۆ:لم)", length: "درێژی (م)", width: "پانی (م)", thickness: "ئەستووری / قووڵی (م)", height: "بەرزی / قووڵی (م)", costCementBag: "تێچووی یەک کیسە چیمەنتۆ", costSandM3: "تێچووی م³ لم", costAggregateM3: "تێچووی م³ چەو", numberOfElements: "ژمارەی ئەندامەکان (ستوون/جسر)",
                    blocksTitle: "ئەژمارکەری بلۆکی چیمەنتۆ", calcMode: "ئەژمارکردن بەپێی", byDimensions: "بەپێی پێوانەکانی ئەندام", blockType: "جۆری بلۆک", wallWidth: "پانی دیوار (م)", wallLength: "درێژی دیوار (م)", wallHeight: "بەرزی دیوار (م)", blockLength: "درێژی (سم)", blockWidth: "پانی (سم)", blockHeight: "بەرزی (سم)", solidBlock20: "تۆکمە (٤٠×٢٠×٢٠سم)", solidBlock15: "تۆکمە (٤٠×٢٠×١٥سم)", hollowBlock: "بۆش (٤٠×٢٠×٢٠سم)", lightweightBlock: "کێش سووک (٦٠×٢٠×١٠سم)", costPerBlock: "تێچووی هەر بلۆکێک", mortarCementCost: "تێچووی چیمەنتۆ/کیسە", mortarSandCost: "تێچووی لم/م³",
                    bricksTitle: "ئەژمارکەری خشت", brickType: "جۆری خشت", standardBrick: "ستاندارد (٢١٥×١٠٢.٥×٦٥مم)", engineeringBrick: "ئەندازیاری (٢١٥×١٠٢.٥×٧٣مم)", romanBrick: "ڕۆمانی (٢٩٠×٩٠×٤٠مم)", hollowBrick: "خشتی بۆش (٣٠×١٢×١٢ سم)", localBrick: "خشتی عێراقی IQS 25 (٢٤×١١.٥×٧.٥سم)", brickLength: "درێژی (مم)", brickWidth: "پانی (مم)", brickHeight: "بەرزی (مم)", mortarThickness: "ئەستووری گیراوە (سم)", costPerBrick: "تێچووی هەر خشتێک",
                    steelTitle: "ئەژمارکەری شیش", diameter: "تیرە (مم)", lengthPerBar: "درێژی یەک شیش (م)", numberOfBars: "ژمارەی شیشەکان", costPerKg: "تێچووی هەر کیلۆیەک", unitWeight: "کێشی یەک مەتر (کگم/م)", barsLabel: "شیشەکان", quantities: "بڕەکان", memberQuantity: "ژمارەی ئەندامەکان (هەمان قەبارە)", lapSplicesAdvanced: "تێهەڵکێشی شیشەکان (بۆ شیشە درێژەکان)", customBars: "شیشی تایبەت", addRowBtn: "زیادکردنی ڕیزەکە", removeRowBtn: "سڕینەوە", perMember: "بۆ هەر ئەندامێک", errCustomRows: "لەکەمترین یەک ڕیز زیاد بکە لەگەڵ تیرە و ژمارەی شیش و درێژی.", helpBtn: "یارمەتی", presetBtn: "بەهای باوەڕپێکراوەکان پڕبکەرەوە", sanityIntro: "ئەم بەهایانە بپشکنە:", sanityUnusual: "ئاسایی نییە — تکایە بپشکنە", hintSpacing: "دووری نێوان دو شیشەوە — لە ناوەندی ناوەندییەوە.", hintDiameter: "ئەستووری یەک شیشە.", hintCalcMode: "بەپێی مەودا ژمارەی شیشەکان لە دوورییەوە دێت. بەپێی ژمارە: ژمارەی تۆ دەنووسیت.", hintCover: "کۆنکریت نێوان شیش و ڕووی دەرەوەوە — شیشەکە دەپارێزێت. 40 مم باوەڕییە.", hintStirrupSpacing: "دووری نێوان دو ئەتارییەوە.", hintStirrupDiameter: "ئەستووری ئەتارییەکە. Ø8 باوەڕییە.", hintBarLength: "درێژی یەک شیش وەک لە دووکان دەفرۆشرێت — زۆرجار 12 م. بۆ ژمارەی شیشەکانی کڕین.", hintLapFactor: "شیشە درێژەکان لەگەڵ یەکتر دەکێشرێنەوە. 50d یعنی کێشانەوە 50 × تیرەی شیشە.", hintMemberQty: "ژمارەی ئەندامەکانی هەمان جۆر — وەک 5 بناغەی هەمان.", hintCostPerKg: "نرخی هەر کیلۆیەک.", hintTruck: "ئەوەی یەک بارھەڵگر دەگرێت بە م³.", hintSwell: "خاکی کندراو گەورەتر دەبێت. 25–30% باوەڕییە.", hintMortar: "ئەستووری هێلیگیراوە نێوان بلۆک/خشتەکان.", hintDryFactor: "گیراوەی وشک کەم دەبێت کاتێئاو زیاد دەکرێت. 1.33 باوەڕییە.", hintMixRatio: "چەند خۆڵ و چەو لەگەڵ هەر پاکەی چیمەنتۆ. 1:6 بۆ گیراوە باوەڕییە.", hintCementDensity: "کێشی م³ چیمەنتۆی وشک. 1440 کگم/م³ باوەڕییە.", hintDistLength: "ئەو درێژییەی شیشەکان دەگێنە.", hintNumberOfBars: "ژمارەی شیشە بریکراوەکان لەم ئاڕاستەیە.", intro1Title: "پێوانە بکە", intro1Body: "ئەوەی دەتەوێت بیناسازی بکەیت پێوانە بکە — درێژی، پانی و بەرزی، بە مەتر.", intro2Title: "بنووسە", intro2Body: "ماددەکە هەڵبژێرە و ژمارەکانت بنووسە. دودلت هەیە؟ ؟ دابگرە — یان «بەهای باوەڕپێکراوەکان» بەکاربهێنە.", intro3Title: "کڕین", intro3Body: "«ئەژمار بکە» دابگرە. ژمارە گەورەکە ئەوەی پێویستە؛ «ئەوەی دەیکڕیت» لیستی کڕینەکەتە. پاشەکەوتی بکە، چاپی بکە یان هاوبەشی بکە.", introNext: "دواتر", introStart: "دەستپێبکە", barSchedule: "لیستی شیشەکان و برینەکان", schedMark: "نیشانە", schedDia: "تیرە", schedShape: "شێوە", schedBars: "ژمارەی شیشەکان", schedCutLen: "درێژی برینە (م)", schedTotalLen: "درێژی گشتی (م)", schedWeight: "کێشی ساف (کگ)", shapeStraight: "راست", shapeRing: "ئەتاری داخراو", schedNote: "لیستی برینە بۆ یەک ئەندام ({n} ئەندام لە کۆدا) — درێژی ساف پیش بەفیڕۆچوون. لیستی داواکردن بەفیڕۆچوونی تێدایە.", backupSection: "پاشەکەوتی داتا", backupBtn: "پاشەکەوت (JSON)", restoreBtn: "گەڕاندنەوە لە فایل", backupHint: "ڕێکخستن، پرۆژە، ڕیزەکانی دانیشتن و مێژوو لە یەک فایلی JSON ـدا پاشەکەوت دەکات.", backupDone: "فایلی پاشەکەوت دابەزێنرا", restoreDone: "پاشەکەوت گەڕێندرایەوە", restoreInvalid: "ئەم فایلە پاشەکەوتی دروست نییە", orderBarsNote: "دووکانەکان شیشەکان بە شیشە بازرگانییەکانی ١٢ مەتر دەفرۆشن — ژمارەکانی سەرەوە ژمارەی شیشە کڕینەکەن.", brcMesh: "تۆڕی سیمی (BRC)", brcSoldAs: "بە چی دەفرۆشرێت", brcRolls: "پێچەکان", brcSheets: "پەڕەکان (تەختەکان)", brcPieceW: "پانی پارچە (م)", brcPieceL: "درێژی پارچە (م)", brcOverlap: "جێگیری هاوبەشکردن و ئیسراڤ (%)", brcArea: "کۆی مساحەت", brcTotal: "تۆڕی پێویست", priceEach: "نرخی هەر پارچە", hintBrc: "سەرە زەمینە و ڕێگاکان زۆرجار تۆڕی سیمی بەکاردێنە بە جیایی شیشە بەستراوەکان. ژمارەکە لە مساحەوە دێت لەگەڵ جێگیری هاوبەشکردن.", hintOverlap: "تۆڕی زیاتر بۆ هاوبەشکردن و ئیسراڤی برین. ١٠٪ باوەڕییە.", hintGlue: "چەسپی چانی باریک بۆ بلۆکی ثەرمەستۆن و AAC، بە ئەستووری ٢–٣ مم. نزیکەی ٤ کگم بۆ هەر م² لە دیوار.", hintGrade: "C15 بۆ صبة نظافة (1:3:6)، C20 بۆ کاری ئاسایی (1:2:4)، C25–C30 بۆ ستوون و جسر و تەختە (1:1.5:3).", glueJointLabel: "جۆری هێل", glueMortar: "هێلی چیمەنتی (دەستڕایگە)", glueThinBed: "چەسپی چانی باریک", glueRate: "چەسپ بۆ هەر م² لە دیوار (کگم)", glueBag: "قەبارەی کیسی چەسپ (کگم)", glueCost: "نرخی هەر کیسی چەسپ", glueAdhesive: "چەسپ (مادەی چەسپاندن)", thermoBlock20: "بلۆکی ثەرمەستۆنی بەتاڵ (60x20x20 سم)", thermoBlock15: "بلۆکی ثەرمەستۆنی بەتاڵ (60x20x15 سم)", aacBlock20: "بلۆکی ئۆتۆکلاڤ AAC (60x20x20 سم)", aacBlock15: "بلۆکی ئۆتۆکلاڤ AAC (60x20x15 سم)", gradeOptC15: "C15 · صبة نظافة (1:3:6)", gradeOptC20: "C20 · کۆنکریتی ئاسایی (1:2:4)", gradeOptC25: "C25–C30 · بەهێزی بەرز (1:1.5:3)", gradeNoteC15: "تێکەڵەی لاواز بۆ صبة نظافة و پڕکردنەوە — بۆ کاری پتەو نییە.", gradeNoteC20: "کۆنکریتی ئاسایی بۆ بناغە و دیوار و تەختە. نزیکەی ٣٠٠–٣٥٠ کگم چیمەنت بۆ هەر م³.", gradeNoteC25: "بەهێزی بەرز بۆ ستوون و جسر و تەختە. نزیکەی ٣٧٥–٤٠٠ کگم چیمەنت بۆ هەر م³.", convTitle: "گۆڕینەوەی یەکەکانی مساحەتی زەمین", convValue: "مساحەت", convM2: "مەتری دووبارە (م²)", convDunum: "دونم (٢,٥٠٠ م²)", convOlak: "ئۆلەک (١٠٠ م²)", convHint: "مساحەت بنووسە بە یەک یەکە بۆ بینینی هەموو یەکەکان. ١ دونم = ٢,٥٠٠ م²؛ ١ ئۆلەک = ١٠٠ م².", quoteBtn: "پێشنیاری نرخ", quoteTitle: "پێشنیاری نرخی مادە", quoteDateLabel: "بەروار", quoteProject: "ناوی پڕۆژە", quoteClient: "ناوی کڕیار", quoteContractor: "ناوی پێکهاتەگەر / ئیندەزیار", quoteContact: "پەیوەندی", quoteNotesLabel: "تێبینی", quoteItemCol: "دانە", quoteQtyCol: "بڕ", quotePriceCol: "نرخی یەکە", quoteAmountCol: "بڕی پارە", quoteTotalLabel: "کۆی گشتی", quoteSignContractor: "واژووی پێکهاتەگەر", quoteSignClient: "واژووی کڕیار", quotePrintBtn: "چاپکردن / پاشەکەوتی PDF", quoteCloseBtn: "داخستن", quotePriceHint: "نرخی یەکەی ڕێککراو بنووسە بۆ هەر دانەیەک — بڕەکان و کۆی گشتی بە شێوەی خۆکار پڕ دەبنەوە.", quoteNoItems: "سەرەتا هەژمار بکەرەوە، پاشان پێشنیاری نرخ بکەرەوە.", quoteWhatsappBtn: "ناردن بە واتساب", quoteWhatsappDone: "پەیامەکە کوپی کرا ✓", bagsWord: "کیسە", piecesWord: "دانە",
                    earthworkTitle: "ئەژمارکەری کاری زەوی", resultEarthwork: "ئەنجامی خەمڵاندنی کاری زەوی", excavationVolume: "کۆی گشتی قەبارەی هەڵکەندن", numberOfWalls: "ژمارەی دیوارەکان",
                    resultConcrete: "ئەنجامی خەمڵاندنی کۆنکریت", totalVolume: "کۆی گشتی قەبارەی کۆنکریت (بڕەکان)", cementBags: "کیسەی چیمەنتۆ", sand: "لم", aggregate: "چەو", cementCost: "تێچووی چیمەنتۆ", sandCost: "تێچووی لم", aggregateCost: "تێچووی چەو", totalCost: "کۆی گشتی (خەمڵێنراو)", formworkArea: "ڕووبەری قاڵب", formworkCostBreakdown: "تێچووی قاڵب", slabFormwork: "قاڵبی لێواری تەختە", columnFormwork: "قاڵبی لایەکانی ستوون", beamFormwork: "قاڵبی لایەکان و بنی جسر",
                    resultBlocks: "ئەنجامی خەمڵاندنی بلۆک", totalBlocks: "بلۆکی پێویست", blockCost: "تێچووی بلۆک", mortarCement: "چیمەنتۆی گیراوە", mortarSand: "لمی گیراوە", resultBricks: "ئەنجامی خەمڵاندنی خشت", totalBricks: "خشتی پێویست", brickCost: "تێچووی خشت", resultSteel: "ئەنجامی خەمڵاندنی شیش", totalWeight: "کێشی گشتی", barsPerTon: "ژمارەی شیش لە هەر تەنێکدا",
                    saveToHistory: "پاشەکەوتکردن لە مێژوو", clearHistory: "سڕینەوەی مێژوو", saveBtn: "پاشەکەوت", csvBtn: "CSV", pdfBtn: "PDF", wallLeaves: "چینەکانی دیوار", withWastage: "بە بەفیڕۆچوون", inclLap: "بە تێهەڵکێش", netWord: "ساف", wasteWord: "بەفیڕۆچوون", orderedWord: "داواکراو", pcsPerM2: "دانە/م²", formworkWord: "قاڵب", trailInputs: "تێخستنەکان", trailElements: "ئەندام", trailTotalVolumeWord: "قەبارەی گشتی", trailWetVolume: "قەبارەی تەڕ", trailDryVolume: "قەبارەی شێک", trailDryFactorNote: "فاکتەری قەبارەی شێک؛ تەنها خەمڵاندنە", trailCementBeforeWaste: "چیمەنتۆی پێویست پێش بەفیڕۆچوون", trailCementWasteAllowance: "هامش بەفیڕۆچوونی چیمەنتۆ", trailOrderQuantity: "بڕی داواکراو", trailBagsOrdered: "{n} × {kg} کگ کیسە = {w} کگ داواکراو", trailMaterialLine: "{name}: {a} {u} پێش بەفیڕۆچوون + {b} {u} هێما = {c} {u} داواکراو", trailPrice: "نرخ", trailAssumption: "فرض: ڕێژەی هەڵبژێردراو دیزاینی بەرووبووی بەرگری یان تێکەڵەی ڕەسمی نییە؛ ئاو و زیادەکارییەکان ناگیرێن.", trailBeforeWaste: "پێش بەفیڕۆچوون", trailNetToBatch: "{a} م³ ساف → {b} م³ بۆ تێکەڵکردن (بەفیڕۆچوون {c} م³)", trailCementOrdered: "{a} کگ پێویست → {b} × {kg} کگ = {c} کگ داواکراو (زیادە {d} کگ لە یەکدەستنەوەی کیسە تەواوەکان)", trailWaterPerKg: "≈{v} لتر (0.6 لتر بۆ هەر کگ چیمەنتۆ)", trailMixRatioWord: "ڕێژەی خەمڵاندن", trailWasteWord: "بەفیڕۆچوون", trailAssumptionNominal: "فرض: ڕێژە خەمڵێنراوەکان بەرگری نەدەستن بەرهەم.", trailModeWord: "دۆخ", trailTotalWallVolumeMode: "قەبارەی گشتی دیوار", trailWallDimsMode: "پێوانەکانی دیوار", trailWallVolume: "قەبارەی دیوار", trailWallThickness: "ئەستووری دیوار", trailLeaves: "چین", trailFaceAreaNote: "ڕێگای ڕووبەر درزەکان لەخۆدەگرێت و ئەستووری پێشبینیکراو ڕوون دەکاتەوە.", trailSteelNote: "خەمڵاندنی ناوین بۆ ئەندامێکی هەڵبژێردراو؛ نەقشەی سێمێنتی نییە. ئاڤەستین، پووچ، لێکدان، هەرێمەکانی زیاد، ئەندامە دووبارەکان و کەرتنی شیشەکانی ستۆک مۆدێل نەکراون.", trailGrossVolume: "قەبارەی سەرجەم", trailSwell: "ئاوسان", trailTruckCapacity: "قەبارەی بارهەڵگر",  trailEarthNote: "تەنها خەمڵاندنی چوارگۆشە؛ ژیوانەکان، شوێنی کار، پڕکردنەوە، پەکخستن و سنوورەکانی بار مۆدێل نەکراون.", excavShape: "شێوازی کولکردن", shapeRectangular: "خاڵی چوارگۆشەیی", shapeTrench: "کاناڵ / تاشە", shapeCustom: "شێوازی تایبەت (بە بنەمای L × W × H)", mixModeNominal: "ڕێژەی ناودار", mixModeCustom: "ڕێژەی ناوداری تایبەت", mixModeApproved: "تێکەڵەی پەسەندکراو بۆ ١ م³", customProduct: "کەرەستەی تایبەتی شوێنی کار", installApp: "ئەپەکە دابەزێنە", calculationDetails: "وردەکارییەکانی هەژمارکردن", backStep: "گەڕانەوە", numWindows: "ژمارەی پەنجەرەکان", numDoors: "ژمارەی دەرگاکان", netWallArea: "ڕووبەری سافی دیوار", totalOpeningVolume: "کۆی گشتی قەبارەی کراوەکان", totalWallVolume: "کۆی گشتی قەبارەی دیوار", byTotalVolume: "بەپێی کۆی گشتی قەبارە", totalWallVolumeInput: "کۆی گشتی قەبارەی دیوار (م³)", totalVolumeInput: "کۆی گشتی قەبارەی کۆنکریت (م³)", calcOptions: "هەڵبژاردەکانی ئەژمارکردن", includeMortar: "بەکارهێنانی ئەستووری گیراوە لە ئەژمارکردندا", includeMortarBricks: "بەکارهێنانی ئەستووری گیراوە لە ئەژمارکردندا", mortarVolume: "قەبارەی گیراوە", mortarCementBags: "کیسەی چیمەنتۆی گیراوە", cementWeight: "کێشی چیمەنتۆ", mortarSandVolume: "قەبارەی لمی گیراوە",
                    selectElement: "ئەندامی پێکهاتەیی هەڵبژێرە", selectOption: "-- تکایە هەڵبژێرە --", footing: "بناغە", slab: "تەختە", beam: "جسر", column: "ستوون", oneWay: "شیشی تەختەی یەک-ئاڕاستە", distLength: "درێژی دابەشکردن (م)", barLength: "درێژی یەک شیش (م)", footingLength: "درێژی بناغە (م)", footingWidth: "پانی بناغە (م)", slabLength: "درێژی تەختە (م)", slabWidth: "پانی تەختە (م)", spacing: "مەودا (مم)", beamLength: "درێژی جسر (م)", columnHeight: "بەرزی ستوون (م)", totalLength: "کۆی گشتی درێژی شیش", numberOfStirrups: "ژمارەی ئەتارییەکان", lengthwiseBars: "شیشە تەریبەکان لەگەڵ درێژی", widthwiseBars: "شیشە تەریبەکان لەگەڵ پانی", barsAlongLength: "شیشەکان (بە درێژایی)", barsAlongWidth: "شیشەکان (بە پانی)", weightAlongLength: "کێش (بە درێژایی)", weightAlongWidth: "کێش (بە پانی)", bySpacing: "بەپێی مەودا", byNumberOfBars: "بەپێی ژمارەی شیشەکان", includeStirrups: "لەخۆگرتنی ئەژمارکردنی ئەتاری", mainBars: "شیشە سەرەکییەکان", beamWidthDim: "پانی جسر (مم)", beamDepthDim: "قووڵی جسر (مم)", concreteCover: "بەرگی کۆنکریتی (مم)", stirrupSpacing: "مەودای ئەتاری (مم)", stirrupDiameter: "تیرەی ئەتاری (مم)", columnWidthDim: "پانی ستوون (مم)", columnDepthDim: "قووڵی ستوون (مم)", mainBarDetails: "وردەکاری شیشە سەرەکییەکان", stirrupDetails: "وردەکاری ئەتارییەکان", summary: "پوختە", singleStirrupLength: "درێژی یەک ئەتاری", includeLapSplice: "لەخۆگرتنی ئەژمارکردنی تێهەڵکێش (Lap Splice)", standardBarLength: "درێژی شیشی دووکان (م)", lapSpliceFactor: "فاکتەری تێهەڵکێش (بۆ نموونە، ٥٠d)", totalLapLengthAdded: "کۆی گشتی درێژی زیادکراوی تێهەڵکێش", totalNumberOfSplices: "کۆی گشتی ژمارەی تێهەڵکێشەکان",
                    saveToProject: "پاشەکەوتکردن لە پڕۆژە", saveCalcTitle: "پاشەکەوتکردنی ئەژمارکردن لە پڕۆژە", selectProjectLabel: "پڕۆژەیەک هەڵبژێرە", newProjectNameLabel: "ناوی پڕۆژەی نوێ", calculationNameLabel: "ناوی ئەژمارکردن", cancelBtn: "هەڵوەشاندنەوە", createNewProjectOption: "--- دروستکردنی پڕۆژەی نوێ ---", noCalcsSaved: "هیچ ئەژمارکردنێک بۆ ئەم پڕۆژەیە پاشەکەوت نەکراوە.", sessionResults: "ئەنجامەکانی ئەم دانیشتنە", clearTable: "سڕینەوەی خشتە", tableHeaderDesc: "ڕوونکردنەوە", tableHeaderDims: "پێوانەکان", tableHeaderCement: "چیمەنتۆ", tableHeaderSand: "لم", tableHeaderAggregate: "چەو", tableHeaderCost: "تێچوو", tableHeaderBlocks: "بلۆک", tableHeaderBricks: "خشت", tableHeaderMortarCement: "چیمەنتۆی گیراوە", tableHeaderMortarSand: "لمی گیراوە", tableHeaderElement: "ئەندام", tableHeaderWeight: "کێش", tableHeaderQty: "ژمارە", tableHeaderVolume: "قەبارە", tableHeaderVolumeDim: "قەبارە / پێوانەکان", tableHeaderTotalVolume: "کۆی گشتی قەبارە", cumulativeTotal: "کۆی گشتی کەڵەکەبوو", saveToHistoryTitle: "پاشەکەوتکردن لە مێژوو", exportCsvTitle: "هەناردەکردن بۆ CSV", exportPdfTitle: "هەناردەکردن بۆ PDF", exportProjectPdfTitle: "پڕۆژە هەناردەکردن بۆ PDF", exportProjectCsvTitle: "پڕۆژە هەناردەکردن بۆ CSV", deleteProjectTitle: "سڕینەوەی پڕۆژە", loadTitle: "بارکردن", deleteTitle: "سڕینەوە", swipeHint: "خشتەکە ڕابکێشە بۆ بینینی زیاتر", step1Dimensions: "پێوانەکان و بڕ", step2Mix: "تایبەتمەندییەکانی تێکەڵە", step3Cost: "تێچوو (ئارەزوومەندانە)", step1General: "ڕێکخستنە گشتییەکان", step2Details: "وردەکارییەکانی ئەندام", step1Excavation: "وردەکارییەکانی هەڵکەندن", step2Haulage: "بارھەڵگر و خاک", selectDiameter: "تیرە هەڵبژێرە", truckLoads: "بارەکانی بارھەڵگر", truckCapacityLabel: "قەبارەی بارھەڵگر (م³)",
                    errExchangeRate: "تکایە نرخێکی دروست و ئەرێنیی گۆڕینەوە بنووسە.", errWastage: "ڕێژەی بەفیڕۆچوون دەبێت لە نێوان ٠ و ٥٠ بێت.", errNegative: "نرخی نەرێنی (سالب) ڕێگەپێدراو نییە.", errProjectName: "تکایە ناوی پڕۆژە بنووسە.", errProjectExists: "پڕۆژەیەک بەم ناوە بوونی هەیە.", errCalcName: "تکایە ناوێک بۆ ئەم ئەژمارکردنە بنووسە.", errNewProjectName: "تکایە ناوێکی نوێی پڕۆژە بنووسە.", errSelectProject: "تکایە پڕۆژەیەک هەڵبژێرە.", errTotalVolumeSingle: "تکایە قەبارەیەکی گشتیی دروست بۆ تاکە ئەندامێک بنووسە.", errNumElements: "ژمارەی ئەندامەکان دەبێت ژمارەیەکی ئەرێنی بێت.", errDimensions: "تکایە پێوانەی دروست بنووسە.", errBlockDims: "دڵنیابە لەوەی هەموو پێوانەکانی بلۆک ژمارەی دروستن.", errTotalVolume: "تکایە قەبارەیەکی گشتیی دروست بنووسە.", errDimsWallWidth: "تکایە پێوانەی دروست و پانیی دیوار بنووسە.", errOpeningExceeds: "قەبارەی کراوەکان نابێت لە قەبارەی گشتیی دیوار زیاتر بێت.", errBrickDims: "دڵنیابە لەوەی هەموو پێوانەکانی خشت ژمارەی دروستن.", errSelectElement: "تکایە سەرەتا ئەندامێکی پێکهاتەیی هەڵبژێرە.", errLapSplice: "تکایە نرخی دروست و ئەرێنی بۆ ڕێکخستنەکانی تێهەڵکێش بنووسە.", errSpacingInputs: "تکایە هەموو خانەکانی مەودا بە ژمارەی دروست پڕبکەرەوە.", errNumberInputs: "تکایە هەموو خانەکانی ژمارە بە ژمارەی دروست پڕبکەرەوە.", errMainBars: "تکایە درێژی و ژمارەی شیش و تیرەی دروست بۆ شیشە سەرەکییەکان بنووسە.", errStirrups: "تکایە هەموو خانەکانی ئەتاری بە ژمارەی دروست و ئەرێنی پڕبکەرەوە.", errRequiredFields: "تکایە هەموو خانە پێویستەکان بە ژمارەی دروست و ئەرێنی پڕبکەرەوە.", errEarthworkDims: "تکایە پێوانەی دروست و ژمارەیەکی دروستی دیوارەکان بنووسە."
                },
                ar: {
                    resetFormLabel: "إعادة تعيين النموذج", themeToggleLabel: "الوضع الداكن", closeLabel: "إغلاق", languageLabel: "اللغة", swellFactorLabel: "معامل انتفاخ التربة (%)", looseVolume: "الحجم المنفوش (للنقل)", soffitFormwork: "قالب السطح السفلي (للبلاطات المعلقة فقط)", appTitle: "مُقدّر المواد الإنشائية", appSubtitle: "مُقدّر المواد الإنشائية", workspaceEyebrow: "FIELDNOTE / مساحة حصر الكميات", readyForTakeoff: "جاهز لحصر الكميات", workspaceHeadline: "حوّل أبعاد الموقع إلى خطة مواد.", workspaceDescription: "اختر نوع العمل، أدخل الكميات، واحصل على تقدير واضح وقابل للتصدير خلال ثوانٍ.", workspaceSettings: "إعدادات المشروع", workspaceHistory: "الحسابات الأخيرة", activeToolLabel: "الأداة النشطة", activeToolMeta: "اختر حاسبة من الأسفل", sessionItemsLabel: "عناصر الجلسة", sessionItemsMeta: "الحسابات في هذه الجلسة", defaultWastageLabel: "الهدر الافتراضي", defaultWastageMeta: "عدّله من إعدادات المشروع", mobileGuide: "املأ الأقسام من الأعلى إلى الأسفل، ثم اضغط حساب.", globalSettings: "الإعدادات العامة", calcHistory: "سجل الحسابات", noHistory: "لا توجد حسابات سابقة بعد",
                    wastageLabel: "نسبة الهدر العامة للمواد (%)", currencySymbol: "العملة", exchangeRateLabel: "سعر صرف 100$ إلى دينار", projectsBtn: "إدارة المشاريع", projectsTitle: "إدارة المشاريع", saveBtn: "حفظ", noProjects: "لا توجد مشاريع محفوظة.", appDesigner: "تصميم المهندس ريزان صالح نوري",
                    stepOf: "خطوة", nextStep: "التالي", reviewStep: "مراجعة وحساب", homeEyebrow: "مقدّر مواد البناء", homeTitle: "ماذا تريد أن تحسب؟", homeSubtitle: "اختر المادة، أدخل أبعادك، واحصل على جدول كميات كامل مع المونة والأسمنت والرمل والتكلفة.", homeBack: "كل الأدوات", homeTip: "النتائج تقديرية. حدد نسبة الهدر في إعدادات المشروع قبل البدء.", homeConcreteDesc: "البلاطات والأساسات والجسور والأعمدة", homeBlocksDesc: "جدران البلوك الإسمنتي بالمساحة أو الحجم", homeBricksDesc: "جدران الطابوق مع المونة والفتحات", homeSteelDesc: "أوزان حديد التسليح والتكلفة بحسب العنصر", homeEarthworkDesc: "الحفر والردم وحمولات الشاحنات", homeSettingsDesc: "الهدر والعملة وبيانات المشروع", tabConcrete: "الخرسانة", tabBlocks: "البلوك", tabBricks: "الطابوق", tabSteel: "الحديد", tabEarthwork: "أعمال الحفر", errorTitle: "خطأ:", calculateBtn: "احسب", resetBtn: "إعادة ضبط", deductOpenings: "إدارة الفتحات", createProjectBtn: "إنشاء",
                    concreteTitle: "حاسبة الخرسانة", appType: "نوع العنصر الخرساني", mixRatio: "إسمنت : رمل : حصى، حسب الحجم السائب", slabOption: "بلاطة / أساس", columnOption: "عمود", beamOption: "جسر", dryVolumeFactor: "معامل الحجم الجاف (تقديري)", dryVolumeFactorNote: "للتقدير فقط؛ يختلف العائد الفعلي حسب المواد وطريقة الخلط.", customRatioNote: "هذه ما تزال نسبة اسمية بالحجم السائب وليست تصميم خلطة معتمداً.", cementDensity: "الكثافة الحجمية السائبة للإسمنت (كجم/م³)", mortarMixRatio: "نسبة خلط المونة (اسمنت:رمل)", length: "الطول (م)", width: "العرض (م)", thickness: "السماكة / العمق (م)", height: "الارتفاع / العمق (م)", costCementBag: "تكلفة كيس الإسمنت", costSandM3: "تكلفة م³ من الرمل", costAggregateM3: "تكلفة م³ من الحصى", numberOfElements: "عدد العناصر (أعمدة/جسور)",
                    blocksTitle: "حاسبة بلوك الإسمنت", calcMode: "الحساب بواسطة", byDimensions: "باستخدام أبعاد العنصر", blockType: "نوع البلوك", wallWidth: "عرض الجدار (م)", wallLength: "طول الجدار (م)", wallHeight: "ارتفاع الجدار (م)", blockLength: "الطول (سم)", blockWidth: "العرض (سم)", blockHeight: "الارتفاع (سم)", solidBlock20: "مصمت (٤٠×٢٠×٢٠ سم)", solidBlock15: "مصمت (٤٠×٢٠×١٥ سم)", hollowBlock: "مفرغ (٤٠×٢٠×٢٠ سم)", lightweightBlock: "خفيف الوزن (٦٠×٢٠×١٠ سم)", costPerBlock: "تكلفة البلوك الواحد", mortarCementCost: "تكلفة الإسمنت/كيس", mortarSandCost: "تكلفة الرمل/م³",
                    bricksTitle: "حاسبة الطابوق", brickType: "نوع الطابوق", standardBrick: "قياسي (٢١٥×١٠٢.٥×٦٥ مم)", engineeringBrick: "هندسي (٢١٥×١٠٢.٥×٧٣ مم)", romanBrick: "روماني (٢٩٠×٩٠×٤٠ مم)", hollowBrick: "طابوق مفرغ (٣٠×١٢×١٢ سم)", localBrick: "طابوق عراقي IQS 25 (٢٤×١١.٥×٧.٥ سم)", brickLength: "الطول (مم)", brickWidth: "الارتفاع (مم)", brickHeight: "الارتفاع (مم)", mortarThickness: "سماكة المونة (سم)", costPerBrick: "تكلفة الطابوقة الواحدة",
                    steelTitle: "حاسبة حديد التسليح", diameter: "القطر (مم)", lengthPerBar: "طول السيخ الواحد (م)", numberOfBars: "عدد الأسياخ", costPerKg: "التكلفة لكل كجم", unitWeight: "الوزن لكل متر (كجم/م)", barsLabel: "أسياخ", quantities: "الكميات", memberQuantity: "عدد العناصر (نفس المقاس)", lapSplicesAdvanced: "وصلات التراكب (للأسياخ الطويلة)", customBars: "أسياخ مخصصة", addRowBtn: "إضافة صف", removeRowBtn: "إزالة", perMember: "لكل عنصر", errCustomRows: "أضف صفًا واحدًا على الأقل بقطر وعدد وطول سيخ.", helpBtn: "مساعدة", presetBtn: "ملء القيم المعتادة", sanityIntro: "يرجى فحص هذه القيم:", sanityUnusual: "تبدو غير معتادة — يرجى المراجعة", hintSpacing: "المسافة بين سيخين، من المركز إلى المركز.", hintDiameter: "سماكة السيخ الواحد عبر وجهه الدائري.", hintCalcMode: "حسب المسافة: عدد الأسياخ يُحسب من المسافة بينها. حسب العدد: تكتب العدد بنفسك.", hintCover: "الخرسانة بين الحديد والوجه الخارجي — تحمي الحديد. 40 مم شائعة.", hintStirrupSpacing: "المسافة بين كانة وأخرى.", hintStirrupDiameter: "سماكة سيخ الكانة. Ø8 هو الشائع.", hintBarLength: "طول السيخ الواحد كما يباع في الأسواق — عادة 12 م. يُستخدم لحساب عدد الأسياخ للشراء.", hintLapFactor: "الأسياخ الأطول من أسياخ السوق تتراكب. 50d يعني التراكب = 50 × قطر السيخ.", hintMemberQty: "عدد العناصر المتطابقة التي ستصبها — مثل 5 أساسات متطابقة.", hintCostPerKg: "سعر الكيلوغرام الواحد عند المورد.", hintTruck: "كم يحمل الشاحنة الواحد بالمتر المكعب.", hintSwell: "التربة المحفورة تزداد حجمًا. 25–30% شائعة.", hintMortar: "سماكة فاصل المونة بين البلوك أو الطابوق.", hintDryFactor: "المونة الجافة تنكمش عند إضافة الماء. 1.33 هو المعامل الشائع.", hintMixRatio: "كم رملًا وحصًا مع كل كيس إسمنت. 1:6 شائع للمونة.", hintCementDensity: "وزن متر مكعب من الإسمنت الفائب. 1440 كجم/م³ شائع.", hintDistLength: "الطول الذي تغطيه الأسياخ — امتداد الشريط.", hintNumberOfBars: "عدد الأسياخ المقطوعة التي ستضعها في هذا الاتجاه.", intro1Title: "قِس", intro1Body: "قِس ما تريد بناءه — الطول والعرض والارتفاع، بالمتر.", intro2Title: "أدخل", intro2Body: "اختر المادة واكتب أرقامك. غير متأكد من حقل؟ اضغط ؟ — أو استخدم «ملء القيم المعتادة».", intro3Title: "اطلب", intro3Body: "اضغط احسب. الرقم الكبير هو ما تحتاجه؛ «ماذا تطلب» هي قائمة تسوقك. احفظها أو اطبعها أو شاركها.", introNext: "التالي", introStart: "ابدأ التقدير", barSchedule: "جدول التسليح وقائمة القص", schedMark: "العلامة", schedDia: "القطر", schedShape: "الشكل", schedBars: "عدد القضبان", schedCutLen: "طول القص (م)", schedTotalLen: "الطول الكلي (م)", schedWeight: "الوزن الصافي (كجم)", shapeStraight: "مستقيم", shapeRing: "حلقة مغلقة", schedNote: "قائمة القص لعنصر واحد ({n} عنصر إجمالًا) — أطوال صافية قبل الهدر. قائمة «ماذا تطلب» تشمل الهدر.", backupSection: "نسخ احتياطي للبيانات", backupBtn: "نسخ احتياطي (JSON)", restoreBtn: "استعادة من ملف", backupHint: "يحفظ الإعدادات والمشاريع وصفوف الجلسة والسجل في ملف JSON واحد يمكنك الاحتفاظ به أو نقله إلى جهاز آخر.", backupDone: "تم تنزيل ملف النسخة الاحتياطية", restoreDone: "تمت استعادة النسخة الاحتياطية", restoreInvalid: "هذا الملف ليس نسخة احتياطية صالحة", orderBarsNote: "تُباع القضبان كأسياخ تجارية قياسية طول 12 م — الأعداد أعلاه هي عدد الأسياخ المطلوب شراؤها.", brcMesh: "سيم مش (BRC)", brcSoldAs: "يُباع على شكل", brcRolls: "لفات", brcSheets: "ألواح (صفائح)", brcPieceW: "عرض القطعة (م)", brcPieceL: "طول القطعة (م)", brcOverlap: "بدل التداخل والهدر (%)", brcArea: "إجمالي المساحة المطلوبة", brcTotal: "الشبك المطلوب", priceEach: "سعر القطعة", hintBrc: "الأرضيات والمناور تستخدم الشبك الملحوم بدل الأسياخ المربوطة. العدد يُحسب من المساحة مع بدل التداخل.", hintOverlap: "شبك إضافي للتداخل وقص الهدر. 10% شائعة.", hintGlue: "غراء الطبقة الرقيقة لبلوك الثرمستون والأوتوكلاف، بسماكة 2–3 مم. حوالي 4 كجم لكل م² من الجدار.", hintGrade: "C15 للصبة النظافة (1:3:6)، C20 للخرسانة العادية (1:2:4)، C25–C30 للأعمدة والجسور والأسقف (1:1.5:3).", glueJointLabel: "نوع الفاصل", glueMortar: "مونة إسمنتية (تقليدية)", glueThinBed: "غراء الطبقة الرقيقة", glueRate: "الغراء لكل م² من الجدار (كجم)", glueBag: "حجم كيس الغراء (كجم)", glueCost: "سعر كيس الغراء", glueAdhesive: "الغراء (مادة اللصق)", thermoBlock20: "بلوك ثرمستون مجوف (60x20x20 سم)", thermoBlock15: "بلوك ثرمستون مجوف (60x20x15 سم)", aacBlock20: "بلوك أوتوكلاف AAC (60x20x20 سم)", aacBlock15: "بلوك أوتوكلاف AAC (60x20x15 سم)", gradeOptC15: "C15 · صبة نظافة (1:3:6)", gradeOptC20: "C20 · خرسانة عادية (1:2:4)", gradeOptC25: "C25–C30 · عالية المقاومة (1:1.5:3)", gradeNoteC15: "خلطة هزيلة لصبة النظافة والحشو — ليست للأعمال الإنشائية.", gradeNoteC20: "خرسانة عادية للأساسات والجدران والأسقف. حوالي 300–350 كجم إسمنت لكل م³.", gradeNoteC25: "عالية المقاومة للأعمدة والجسور والأسقف. حوالي 375–400 كجم إسمنت لكل م³.", convTitle: "محول وحدات مساحة الأرض", convValue: "المساحة", convM2: "متر مربع (م²)", convDunum: "دونم (2,500 م²)", convOlak: "أولك (100 م²)", convHint: "اكتب المساحة بوحدة لترى البقية. 1 دونم = 2,500 م²؛ 1 أولك = 100 م².", quoteBtn: "عرض سعر", quoteTitle: "عرض سعر المواد", quoteDateLabel: "التاريخ", quoteProject: "اسم المشروع", quoteClient: "اسم العميل", quoteContractor: "اسم المقاول / المهندس", quoteContact: "معلومات الاتصال", quoteNotesLabel: "ملاحظات", quoteItemCol: "البند", quoteQtyCol: "الكمية", quotePriceCol: "سعر الوحدة", quoteAmountCol: "المبلغ", quoteTotalLabel: "المجموع الكلي", quoteSignContractor: "توقيع المقاول", quoteSignClient: "توقيع العميل", quotePrintBtn: "طباعة / حفظ PDF", quoteCloseBtn: "إغلاق", quotePriceHint: "اكتب سعر الوحدة المتفق عليه لكل بند — تُحسب المبالغ والمجموع الكلي تلقائيًا.", quoteNoItems: "احسب أولًا ثم افتح عرض السعر.", quoteWhatsappBtn: "إرسال عبر واتساب", quoteWhatsappDone: "تم نسخ الرسالة ✓", bagsWord: "كيس", piecesWord: "قطعة",
                    earthworkTitle: "حاسبة أعمال الحفر", resultEarthwork: "نتيجة تقدير أعمال الحفر", excavationVolume: "حجم الحفر الكلي", numberOfWalls: "عدد الجدران",
                    resultConcrete: "نتيجة تقدير الخرسانة", totalVolume: "الحجم الإجمالي للخرسانة (الكميات)", cementBags: "أكياس الإسمنت", sand: "الرمل", aggregate: "الحصى", cementCost: "تكلفة الإسمنت", sandCost: "تكلفة الرمل", aggregateCost: "تكلفة الحصى", totalCost: "المجموع الكلي (التقديري)", formworkArea: "مساحة القالب", formworkCostBreakdown: "تكلفة القالب", slabFormwork: "مساحة قالب حافة البلاطة", columnFormwork: "مساحة قالب جوانب العمود", beamFormwork: "مساحة قالب جوانب وأسفل الجسر",
                    resultBlocks: "نتيجة تقدير البلوك", totalBlocks: "البلوك المطلوب", blockCost: "تكلفة البلوك", mortarCement: "إسمنت المونة", mortarSand: "رمل المونة", resultBricks: "نتيجة تقدير الطابوق", totalBricks: "الطابوق المطلوب", brickCost: "تكلفة الطابوق", resultSteel: "نتيجة تقدير الحديد", totalWeight: "الوزن الإجمالي", barsPerTon: "عدد الأسياخ في الطن",
                    saveToHistory: "حفظ في السجل", clearHistory: "مسح السجل", saveBtn: "حفظ", csvBtn: "CSV", pdfBtn: "PDF", wallLeaves: "عدد طبقات الجدار", withWastage: "مع الهدر", inclLap: "شاملاً التراكب", netWord: "صافي", wasteWord: "هدر", orderedWord: "يُطلب", pcsPerM2: "قطعة/م²", formworkWord: "قالب", trailInputs: "المدخلات", trailElements: "عنصر", trailTotalVolumeWord: "الحجم الكلي", trailWetVolume: "الحجم الرطب", trailDryVolume: "الحجم الجاف", trailDryFactorNote: "معامل الحجم الجاف؛ للتقدير فقط", trailCementBeforeWaste: "الإسمنت المطلوب قبل الهدر", trailCementWasteAllowance: "هامش هدر الإسمنت", trailOrderQuantity: "كمية الطلب", trailBagsOrdered: "{n} × {kg} كجم كيس = {w} كجم مطلوب", trailMaterialLine: "{name}: {a} {u} قبل الهدر + {b} {u} هامش = {c} {u} مطلوب", trailPrice: "السعر", trailAssumption: "فرض: النسبة المحددة ليست تصميم اعتماد قوة ولا وصف خلطة معتمد؛ الماء والمضافات مستبعدة.", trailBeforeWaste: "قبل الهدر", trailNetToBatch: "{a} م³ صافي → {b} م³ للتخلیط (هدر {c} م³)", trailCementOrdered: "{a} كجم مطلوب → {b} × {kg} كجم = {c} كجم مطلوب (فائض {d} كجم من تقريب إلى أكياس كاملة)", trailWaterPerKg: "≈{v} لتر (0.6 لتر لكل كجم إسمنت)", trailMixRatioWord: "نسبة الخلط الاسمية", trailWasteWord: "الهدر", trailAssumptionNominal: "فرض: النسب الاسمية لا تضمن القوة.", trailModeWord: "الوضع", trailTotalWallVolumeMode: "حجم الجدار الكلي", trailWallDimsMode: "أبعاد الجدار", trailWallVolume: "حجم الجدار", trailWallThickness: "سماكة الجدار", trailLeaves: "طبقات", trailFaceAreaNote: "طريقة المساحة السطحية تشمل الفواصل وتتحقق من السماكة الضمنية.", trailSteelNote: "تقدير تقريبي لعدد كمية عنصر واحد محدد؛ ليس جدول تصميم تسليح. التثبيت والخطافات والانحناءات والمناطق الإضافية والأعضاء المتكررة وقطع القضبان المخزنية غير نمذجية.", trailGrossVolume: "الحجم الإجمالي", trailSwell: "الانتفاخ", trailTruckCapacity: "سعة الشاحنة",  trailEarthNote: "تقدير مستطيل فقط؛ المنحدرات ومساحة العمل والردم والمضغوطة وسعة الحمولة غير نمذجية.", excavShape: "شكل الحفر", shapeRectangular: "حفرة مستطيلة", shapeTrench: "خندق / شريط", shapeCustom: "مقطع مخصص (بنفس أساس L × W × H)", mixModeNominal: "النسبة الاسمية", mixModeCustom: "نسبة اسمية مخصصة", mixModeApproved: "وصفة معتمدة لكل ١ م³", customProduct: "منتج موقع مخصص", installApp: "تثبيت التطبيق", calculationDetails: "تفاصيل الحساب", backStep: "رجوع", numWindows: "عدد النوافذ", numDoors: "عدد الأبواب", netWallArea: "صافي مساحة الجدار", totalOpeningVolume: "إجمالي حجم الفتحات", totalWallVolume: "حجم الجدار الإجمالي", byTotalVolume: "باستخدام الحجم الكلي", totalWallVolumeInput: "حجم الجدار الإجمالي (م³)", totalVolumeInput: "الحجم الكلي للخرسانة (م³)", calcOptions: "خيارات الحساب", includeMortar: "استخدام سماكة المونة في الحساب", includeMortarBricks: "استخدام سماكة المونة في الحساب", mortarVolume: "حجم المونة", mortarCementBags: "أكياس إسمنت المونة", cementWeight: "وزن الإسمنت", mortarSandVolume: "حجم رمل المونة",
                    selectElement: "اختر العنصر الإنشائي", selectOption: "-- الرجاء الاختيار --", footing: "أساس", slab: "بلاطة", beam: "جسر", column: "عمود", oneWay: "بلاطة باتجاه واحد", distLength: "طول التوزيع (م)", barLength: "طول السيخ الواحد (م)", footingLength: "طول الأساس (م)", footingWidth: "عرض الأساس (م)", slabLength: "طول البلاطة (م)", slabWidth: "عرض البلاطة (م)", spacing: "المسافة (مم)", beamLength: "طول الجسر (م)", columnHeight: "ارتفاع العمود (م)", totalLength: "الطول الإجمالي للحديد", numberOfStirrups: "عدد الكانات", lengthwiseBars: "قضبان موازية للطول", widthwiseBars: "قضبان موازية للعرض", barsAlongLength: "قضبان (باتجاه الطول)", barsAlongWidth: "قضبان (باتجاه العرض)", weightAlongLength: "الوزن (باتجاه الطول)", weightAlongWidth: "الوزن (باتجاه العرض)", bySpacing: "حسب المسافة", byNumberOfBars: "حسب عدد الأسياخ", includeStirrups: "تضمين حساب الكانات", mainBars: "القضبان الرئيسية", beamWidthDim: "عرض الجسر (مم)", beamDepthDim: "عمق الجسر (مم)", concreteCover: "الغطاء الخرساني (مم)", stirrupSpacing: "المسافة بين الكانات (مم)", stirrupDiameter: "قطر الكانة (مم)", columnWidthDim: "عرض العمود (مم)", columnDepthDim: "عمق العمود (مم)", mainBarDetails: "تفاصيل القضبان الرئيسية", stirrupDetails: "تفاصيل الكانات", summary: "الملخص", singleStirrupLength: "طول الكانة الواحدة", includeLapSplice: "تضمين حساب وصلات التراكب", standardBarLength: "طول السيخ في الأسواق (م)", lapSpliceFactor: "معامل وصلة التراكب (مثال: 50d)", totalLapLengthAdded: "إجمالي طول التراكب المضاف", totalNumberOfSplices: "العدد الإجمالي لوصلات التراكب",
                    saveToProject: "حفظ في المشروع", saveCalcTitle: "حفظ الحساب في المشروع", selectProjectLabel: "اختر المشروع", newProjectNameLabel: "اسم المشروع الجديد", calculationNameLabel: "اسم الحساب", cancelBtn: "إلغاء", createNewProjectOption: "--- إنشاء مشروع جديد ---", noCalcsSaved: "لا توجد حسابات محفوظة لهذا المشروع.", sessionResults: "نتائج الجلسة الحالية", clearTable: "مسح الجدول", tableHeaderDesc: "الوصف", tableHeaderDims: "الأبعاد", tableHeaderCement: "الإسمنت", tableHeaderSand: "الرمل", tableHeaderAggregate: "الحصى", tableHeaderCost: "التكلفة", tableHeaderBlocks: "البلوك", tableHeaderBricks: "الطابوق", tableHeaderMortarCement: "إسمنت المونة", tableHeaderMortarSand: "رمل المونة", tableHeaderElement: "العنصر", tableHeaderWeight: "الوزن", tableHeaderQty: "الكمية", tableHeaderVolume: "الحجم", tableHeaderVolumeDim: "الحجم / الأبعاد", tableHeaderTotalVolume: "الحجم الكلي", cumulativeTotal: "المجموع التراكمي", saveToHistoryTitle: "حفظ في السجل", exportCsvTitle: "تصدير إلى CSV", exportPdfTitle: "تصدير إلى PDF", exportProjectPdfTitle: "تصدير المشروع إلى PDF", exportProjectCsvTitle: "تصدير المشروع إلى CSV", deleteProjectTitle: "حذف المشروع", loadTitle: "تحميل", deleteTitle: "حذف", swipeHint: "اسحب الجدول لرؤية المزيد", step1Dimensions: "الأبعاد والكمية", step2Mix: "مواصفات الخلطة", step3Cost: "التكلفة (اختياري)", step1General: "الإعدادات العامة", step2Details: "تفاصيل العنصر", step1Excavation: "تفاصيل الحفر", step2Haulage: "النقل والتربة", selectDiameter: "اختر القطر", truckLoads: "عدد النقلات (الشاحنات)", truckCapacityLabel: "سعة الشاحنة (م³)",
                    errExchangeRate: "يرجى إدخال سعر صرف صحيح وإيجابي.", errWastage: "يجب أن تكون نسبة الهدر بين 0 و 50.", errNegative: "القيم السالبة غير مسموحة.", errProjectName: "يرجى إدخال اسم المشروع.", errProjectExists: "يوجد مشروع بهذا الاسم بالفعل.", errCalcName: "يرجى إدخال اسم لهذه الحسابات.", errNewProjectName: "يرجى إدخال اسم المشروع الجديد.", errSelectProject: "يرجى تحديد مشروع.", errTotalVolumeSingle: "يرجى إدخال حجم كلي صحيح للعنصر الواحد.", errNumElements: "يجب أن يكون عدد العناصر رقماً موجباً.", errDimensions: "يرجى إدخال أبعاد صحيحة.", errBlockDims: "يرجى التأكد من أن جميع أبعاد البلوك أرقام صحيحة.", errTotalVolume: "يرجى إدخال حجم كلي صحيح.", errDimsWallWidth: "يرجى إدخال أبعاد صحيحة وعرض الجدار.", errOpeningExceeds: "لا يمكن أن يتجاوز حجم الفتحات الحجم الإجمالي للجدار.", errBrickDims: "يرجى التأكد من أن جميع أبعاد الطابوق أرقام صحيحة.", errSelectElement: "يرجى اختيار العنصر الإنشائي أولاً.", errLapSplice: "يرجى إدخال قيم صحيحة وموجبة لإعدادات وصلات التراكب.", errSpacingInputs: "يرجى ملء جميع حقول المسافات بأرقام صحيحة.", errNumberInputs: "يرجى ملء جميع حقول الأعداد بأرقام صحيحة.", errMainBars: "يرجى إدخال طول وعدد وقطر صحيح للقضبان الرئيسية.", errStirrups: "يرجى ملء جميع حقول الكانات بأرقام موجبة صحيحة.", errRequiredFields: "يرجى ملء جميع الحقول المطلوبة بأرقام موجبة صحيحة.", errEarthworkDims: "يرجى إدخال أبعاد صحيحة وعدد جدران صحيح."
                }
            };

            const concreteExtraLabels = {
                en: { cementRequiredWeight: 'Cement required before wastage', cementOrderQuantity: 'Cement order quantity', costNotEntered: 'Cost not entered', excludedMaterialsNote: 'Included: cement, sand, and coarse aggregate. Excluded: water and admixtures; these require an approved recipe and moisture corrections.', approvedRecipeNote: 'Enter the approved mix-sheet quantities for 1 m³. Water and admixture are used only from this recipe; they are never guessed from a nominal ratio.', moistureBasisNote: 'Use the same moisture/batch basis as the approved mix sheet. No stockpile moisture or aggregate absorption correction is applied here; add correction inputs later if needed.', approvedCementLabel: 'Cement (kg/m³)', approvedWaterLabel: 'Water (L/m³)', approvedSandLabel: 'Sand (kg/m³)', approvedAggregateLabel: 'Coarse aggregate (kg/m³)', approvedAdmixtureLabel: 'Admixture (unit/m³; 0 if none)', approvedAdmixtureUnitLabel: 'Admixture unit', costSandKg: 'Cost per kg of Sand', costAggregateKg: 'Cost per kg of Aggregate', formworkDimensionsNote: 'Formwork pricing needs element dimensions; it is not included in total-volume mode.', formworkNotIncludedVolume: 'Formwork area cannot be derived from total volume alone.', costScopeNote: 'Cost scope: the displayed total includes only entered cement, sand, coarse aggregate, and formwork prices. It is not a full construction cost.', approvedCostExclusion: 'Water and admixture are shown as quantities only and are not included in the cost total because no prices were entered for them.', columnHeightLabel: 'Column height (m)', columnWidthLabel: 'Column width (m)', columnDepthLabel: 'Column depth (m)', beamSpanLabel: 'Beam span (m)', beamWidthLabel: 'Beam width (m)', beamDepthLabel: 'Beam depth (m)' },
                ku: { cementRequiredWeight: 'کێشی چیمەنتۆ پێش بەفیڕۆچوون', cementOrderQuantity: 'بڕی داواکراوی چیمەنتۆ', costNotEntered: 'بها نەنووسراوە', excludedMaterialsNote: 'تێدایە: چیمەنتۆ، قوم و حەسو. نییە: ئاو و زیادکراوەکان؛ پێویستیان بە ڕەچەتەی پەسەندکراو و ڕاستکردنەوەی شێدارییە.', approvedRecipeNote: 'بڕە پەسەندکراوەکانی پەڕەی ڕەچەتە بۆ ١ م³ بنووسە. ئاو و زیادکراوەکان تەنها لەم ڕەچەتەیەوە بەکاردێن، لە ڕێژەی ناونراوەوە خەمڵێنراو نین.', moistureBasisNote: 'هەمان بنەمای شێداری و خولاندن بەکاربهێنە کە لە پەڕەی ڕەچەتەی پەسەندکراوە. لێرەدا ڕاستکردنەوەی شێداری کۆگای حەسو یان هەڵمژینی حەسو ناکرێت.', approvedCementLabel: 'چیمەنتۆ (کگ/م³)', approvedWaterLabel: 'ئاو (لیتر/م³)', approvedSandLabel: 'قوم (کگ/م³)', approvedAggregateLabel: 'حەسو (کگ/م³)', approvedAdmixtureLabel: 'زیادکراوە (یەکە/م³؛ ٠ ئەگەر نییە)', approvedAdmixtureUnitLabel: 'یەکەی زیادکراوە', costSandKg: 'نرخی هەر کگ قوم', costAggregateKg: 'نرخی هەر کگ حەسو', formworkDimensionsNote: 'نرخی فۆرم‌وەرک پێویستی بە دوورییەکانی ئەندامەکانە؛ لە دۆخی کۆی حەجمدا لەخۆناگیرێت.', formworkNotIncludedVolume: 'ناتوانرێت ڕووبەری فۆرم‌وەرک تەنها لە کۆی حەجمەوە دیاری بکرێت.', costScopeNote: 'سنووری تێچوون: کۆی پیشاندراو تەنها نرخی نووسراوی چیمەنتۆ، قوم، حەسو و فۆرم‌وەرکە. نرخی تەواوی بیناسازی نییە.', approvedCostExclusion: 'ئاو و زیادکراوەکان تەنها وەک بڕ پیشان دەدرێن و لە کۆی تێچووندا نین، چونکە نرخەکانیان نەنووسراون.', columnHeightLabel: 'بلندییا ستوین (م)', columnWidthLabel: 'پانییا ستوین (م)', columnDepthLabel: 'قووڵیا ستوین (م)', beamSpanLabel: 'سپا‌نا جسرێ (م)', beamWidthLabel: 'پانییا جسرێ (م)', beamDepthLabel: 'قووڵیا جسرێ (م)' },
                ks: { cementRequiredWeight: 'کێشی چیمەنتۆ پێش بەفیڕۆچوون', cementOrderQuantity: 'بڕی داواکراوی چیمەنتۆ', costNotEntered: 'نرخ نەنووسراوە', excludedMaterialsNote: 'لەخۆدەگرێت: چیمەنتۆ، لم و چەو. لەخۆناگرێت: ئاو و زیادکراوەکان؛ پێویستی بە ڕەچەتەی پەسەندکراو و ڕاستکردنەوەی شێدارییە.', approvedRecipeNote: 'بڕەکانی ڕەچەتەی پەسەندکراو بۆ ١ م³ بنووسە. ئاو و زیادکراوەکان تەنها لەم ڕەچەتەیەوە بەکاردێن، لە ڕێژەی ناونراوەوە خەمڵێنراو نین.', moistureBasisNote: 'هەمان بنەمای شێداری و خولاندن بەکاربهێنە کە لە پەڕەی ڕەچەتەی پەسەندکراوە. لێرەدا ڕاستکردنەوەی شێداری کۆگای حەسو یان هەڵمژینی حەسو ناکرێت.', approvedCementLabel: 'چیمەنتۆ (کگ/م³)', approvedWaterLabel: 'ئاو (لیتر/م³)', approvedSandLabel: 'لم (کگ/م³)', approvedAggregateLabel: 'چەوی گەورە (کگ/م³)', approvedAdmixtureLabel: 'زیادکراوە (یەکە/م³؛ ٠ ئەگەر نییە)', approvedAdmixtureUnitLabel: 'یەکەی زیادکراوە', costSandKg: 'نرخی هەر کگ قوم', costAggregateKg: 'نرخی هەر کگ حەسو', formworkDimensionsNote: 'نرخی فۆرم‌وەرک پێویستی بە دوورییەکانی ئەندامەکانە؛ لە دۆخی کۆی حەجمدا لەخۆناگیرێت.', formworkNotIncludedVolume: 'ناتوانرێت ڕووبەری فۆرم‌وەرک تەنها لە کۆی حەجمەوە دیاری بکرێت.', costScopeNote: 'سنووری تێچوون: کۆی پیشاندراو تەنها نرخی نووسراوی چیمەنتۆ، لم، چەو و فۆرم‌وەرکە. نرخی تەواوی بیناسازی نییە.', approvedCostExclusion: 'ئاو و زیادکراوەکان تەنها وەک بڕ پیشان دەدرێن و لە کۆی تێچووندا نین، چونکە نرخەکانیان نەنووسراون.', columnHeightLabel: 'بەرزی ستوون (م)', columnWidthLabel: 'پانی ستوون (م)', columnDepthLabel: 'قووڵی ستوون (م)', beamSpanLabel: 'دەوری جسر (م)', beamWidthLabel: 'پانی جسر (م)', beamDepthLabel: 'قووڵی جسر (م)' },
                ar: { cementRequiredWeight: 'كمية الإسمنت المطلوبة قبل الهدر', cementOrderQuantity: 'كمية الإسمنت للطلب', costNotEntered: 'لم تُدخل التكلفة', excludedMaterialsNote: 'يشمل: الإسمنت والرمل والركام الخشن. لا يشمل: الماء والإضافات؛ ويجب اعتماد وصفة ومراعاة رطوبة المواد.', approvedRecipeNote: 'أدخل كميات ورقة الخلطة المعتمدة لكل 1 م³. يُستخدم الماء والمضاف فقط من هذه الوصفة ولا يتم تخمينهما من النسبة الاسمية.', moistureBasisNote: 'استخدم نفس أساس الرطوبة والخلطة الموجود في ورقة الخلطة المعتمدة. لا يتم هنا تصحيح رطوبة الركام المخزون أو امتصاصه؛ يمكن إضافة مدخلات التصحيح لاحقاً.', approvedCementLabel: 'الإسمنت (كغ/م³)', approvedWaterLabel: 'الماء (لتر/م³)', approvedSandLabel: 'الرمل (كغ/م³)', approvedAggregateLabel: 'الركام الخشن (كغ/م³)', approvedAdmixtureLabel: 'المضاف (وحدة/م³؛ 0 إذا لا يوجد)', approvedAdmixtureUnitLabel: 'وحدة المضاف', costSandKg: 'تكلفة كجم الرمل', costAggregateKg: 'تكلفة كجم الركام', formworkDimensionsNote: 'تسعير الشدة يحتاج إلى أبعاد العناصر؛ ولا يُدرج في وضع الحجم الكلي.', formworkNotIncludedVolume: 'لا يمكن اشتقاق مساحة الشدة من الحجم الكلي وحده.', costScopeNote: 'نطاق التكلفة: الإجمالي المعروض يشمل فقط أسعار الإسمنت والرمل والركام الخشن والشدة التي تم إدخالها. ليس تكلفة البناء الكاملة.', approvedCostExclusion: 'يُعرض الماء والمضاف ككميات فقط ولا يدخلان في إجمالي التكلفة لعدم إدخال أسعارهما.', columnHeightLabel: 'ارتفاع العمود (م)', columnWidthLabel: 'عرض العمود (م)', columnDepthLabel: 'عمق العمود (م)', beamSpanLabel: 'بحر الجسر (م)', beamWidthLabel: 'عرض الجسر (م)', beamDepthLabel: 'عمق الجسر (م)' }
            };
            const concreteRecipeLabels = {
                en: { approvedDryVolumeNote: 'Not used; approved quantities are per m³.', approvedRecipePerM3: 'Approved recipe per 1 m³', approvedCementWord: 'cement', approvedWaterWord: 'water', approvedSandWord: 'sand', approvedAggregateWord: 'coarse aggregate', approvedAdmixtureRateWord: 'admixture rate', approvedWaterAdmixtureResult: 'Water / admixture (approved recipe)', approvedWaterFromRecipe: 'Water from approved recipe', approvedAdmixtureTotal: 'Admixture total', approvedSolidsAllowance: 'Solids purchase allowance', approvedAllowanceNote: 'Water and admixture remain at the approved recipe quantities for the required concrete volume.', approvedRecipeAssumption: 'Approved recipe values are used as entered from the mix sheet; no water or admixture estimate is inferred.', approvedCostExclusion: 'Water and admixture are shown as quantities only and are not included in the cost total. No price fields are provided for them in this version.', customNominalWord: 'Custom nominal', nominalWord: 'Nominal', ratioLooseVolume: 'cement : sand : coarse aggregate ratio by loose volume', looseDensity: 'loose cement bulk density' },
                ku: { approvedDryVolumeNote: 'نەبەکارهاتووە؛ بڕە پەسەندکراوەکان بۆ هەر م³ ـە.', approvedRecipePerM3: 'ڕەچەتەی پەسەندکراو بۆ ١ م³', approvedCementWord: 'چیمەنتۆ', approvedWaterWord: 'ئاو', approvedSandWord: 'قوم', approvedAggregateWord: 'حەسو', approvedAdmixtureRateWord: 'ڕێژەی زیادکراوە', approvedWaterAdmixtureResult: 'ئاو / زیادکراوە (ڕەچەتەی پەسەندکراو)', approvedWaterFromRecipe: 'ئاو لە ڕەچەتەی پەسەندکراوەوە', approvedAdmixtureTotal: 'کۆی زیادکراوە', approvedSolidsAllowance: 'بەفیڕۆچوونی کڕینی ماددە ڕەقەکان', approvedAllowanceNote: 'ئاو و زیادکراوەکان بە هەمان بڕی ڕەچەتەی پەسەندکراو بۆ حەجمی پێویستی کۆنکریت دەمێننەوە.', approvedRecipeAssumption: 'بڕەکانی ڕەچەتەی پەسەندکراو وەک لە پەڕەی ڕەچەتەدا بەکارهاتوون؛ هیچ خەمڵاندنێک بۆ ئاو یان زیادکراوە ناکرێت.', approvedCostExclusion: 'ئاو و زیادکراوەکان تەنها وەک بڕ پیشان دەدرێن و لە کۆی تێچووندا نین. لەم وەشانەدا خانەی نرخ بۆیان نییە.', customNominalWord: 'ناونراوی تایبەت', nominalWord: 'ناونراو', ratioLooseVolume: 'ڕێژەی چیمەنتۆ : قوم : حەسو بە پێی حەجمی سائب', looseDensity: 'چڕیی سائیبی چیمەنتۆ' },
                ks: { approvedDryVolumeNote: 'بەکارنەهاتووە؛ بڕە پەسەندکراوەکان بۆ هەر م³ ـە.', approvedRecipePerM3: 'ڕەچەتەی پەسەندکراو بۆ ١ م³', approvedCementWord: 'چیمەنتۆ', approvedWaterWord: 'ئاو', approvedSandWord: 'لم', approvedAggregateWord: 'چەو', approvedAdmixtureRateWord: 'ڕێژەی زیادکراوە', approvedWaterAdmixtureResult: 'ئاو / زیادکراوە (ڕەچەتەی پەسەندکراو)', approvedWaterFromRecipe: 'ئاو لە ڕەچەتەی پەسەندکراوەوە', approvedAdmixtureTotal: 'کۆی زیادکراوە', approvedSolidsAllowance: 'بەفیڕۆچوونی کڕینی ماددە ڕەقەکان', approvedAllowanceNote: 'ئاو و زیادکراوەکان بە هەمان بڕی ڕەچەتەی پەسەندکراو بۆ حەجمی پێویستی کۆنکریت دەمێننەوە.', approvedRecipeAssumption: 'بڕەکانی ڕەچەتەی پەسەندکراو وەک لە پەڕەی ڕەچەتەدا بەکارهاتوون؛ هیچ خەمڵاندنێک بۆ ئاو یان زیادکراوە ناکرێت.', approvedCostExclusion: 'ئاو و زیادکراوەکان تەنها وەک بڕ پیشان دەدرێن و لە کۆی تێچووندا نین. لەم وەشانەدا خانەی نرخ بۆیان نییە.', customNominalWord: 'ناونراوی تایبەت', nominalWord: 'ناونراو', ratioLooseVolume: 'ڕێژەی چیمەنتۆ : لم : چەو بە پێی حەجمی سائب', looseDensity: 'چڕیی سائیبی چیمەنتۆ' },
                ar: { approvedDryVolumeNote: 'غير مستخدم؛ الكميات المعتمدة لكل م³.', approvedRecipePerM3: 'الوصفة المعتمدة لكل 1 م³', approvedCementWord: 'الإسمنت', approvedWaterWord: 'الماء', approvedSandWord: 'الرمل', approvedAggregateWord: 'الركام الخشن', approvedAdmixtureRateWord: 'معدل المضاف', approvedWaterAdmixtureResult: 'الماء / المضاف (الوصفة المعتمدة)', approvedWaterFromRecipe: 'الماء من الوصفة المعتمدة', approvedAdmixtureTotal: 'إجمالي المضاف', approvedSolidsAllowance: 'هدر شراء المواد الصلبة', approvedAllowanceNote: 'يبقى الماء والمضاف بكميات الوصفة المعتمدة لحجم الخرسانة المطلوب.', approvedRecipeAssumption: 'تُستخدم كميات الوصفة المعتمدة كما أُدخلت من ورقة الخلطة؛ ولا يتم تخمين الماء أو المضاف.', approvedCostExclusion: 'يُعرض الماء والمضاف ككميات فقط ولا يدخلان في إجمالي التكلفة. لا توجد حقول أسعار لهما في هذا الإصدار.', customNominalWord: 'اسمي مخصص', nominalWord: 'اسمي', ratioLooseVolume: 'نسبة الإسمنت : الرمل : الركام الخشن بالحجم السائب', looseDensity: 'الكثافة الحجمية السائبة للإسمنت' }
            };
            Object.keys(concreteExtraLabels).forEach(lang => Object.assign(translations[lang], concreteExtraLabels[lang], concreteRecipeLabels[lang]));
            const blockExtraLabels = {
                en: { openingWidth: 'Opening width (m)', openingHeight: 'Opening height (m)', mortarDryFactor: 'Mortar dry-volume factor (estimate)', mortarDryFactorNote: 'Estimate only; actual mortar yield varies by materials and batching.', hollowBlockNote: 'Hollow blocks are counted by external dimensions and joint mortar only. Grouted cells are not included; add a separate grout estimate if required.', errWallThicknessMismatch: 'Wall thickness does not match the selected leaves and block thickness', errOpeningDimensions: 'Enter each opening as width × height; the app multiplies by wall thickness.', openingsDeducted: 'Deducted {v} m³: {nw} window(s) {ww}×{wh} m + {nd} door(s) {dw}×{dh} m, × wall thickness' },
                ku: { openingWidth: 'پانییا کونێ (م)', openingHeight: 'بلندییا کونێ (م)', mortarDryFactor: 'فاکتەری حەجما وشکی مۆرتاری (خەمڵێنکری)', mortarDryFactorNote: 'تنێ خەمڵاندنە؛ بەرهەما راستەقینە یا مۆرتاری ب پێی ماددە و تێکەڵکرنێ دگۆڕێت.', hollowBlockNote: 'بلۆکێ بەتاڵ ب دوورییێن دەرەوە و مۆرتارا درزێنێ دهێتە هەژمارتن. پڕکرنا خانەکان نەهاتیە هەژمارتن؛ ئەگەر پێویستە خەمڵاندنا جیاوازا گراوتێ زیاد بکە.', errWallThicknessMismatch: 'ئەستووری دیوار لەگەڵ ژمارەی چین و ئەستووری بلۆکا هەڵبژێردراو ناگونجێت', openingsDeducted: 'لێدەرکراو {v} م٣: {nw} پەنجەرە {ww}×{wh} م + {nd} دەرگا {dw}×{dh} م × ئەستووری دیوار', errOpeningDimensions: 'هەر کونەکێ ب پانی × بلندی بنڤیسە؛ ئەپ ب ئەستووری دیوار لێدکەت.' },
                ks: { openingWidth: 'پانیی کونە (م)', openingHeight: 'بەرزیی کونە (م)', mortarDryFactor: 'فاکتەری حەجمی وشکی مۆرتار (خەمڵێنراو)', mortarDryFactorNote: 'تەنها خەمڵاندنە؛ بەرهەمی ڕاستەقینەی مۆرتار بە ماددە و تێکەڵکردن دەگۆڕێت.', hollowBlockNote: 'بلۆکی بەتاڵ بە دوورییەکانی دەرەوە و مۆرتاری درزەکان هەژمار دەکرێت. پڕکردنەوەی خانەکان لەخۆناگیرێت؛ ئەگەر پێویستە خەمڵاندنی جیاوازی گراوت زیاد بکە.', errWallThicknessMismatch: 'ئەستووری دیوار لەگەڵ ژمارەی چین و ئەستووری بلۆکی هەڵبژێردراو ناگونجێت', openingsDeducted: 'لێدەرکری {v} م٣: {nw} پەنجەرە {ww}×{wh} م + {nd} دەرگا {dw}×{dh} م × ستوورییا دیواری', errOpeningDimensions: 'هەر کونەیەک بە پانی × بەرزی بنووسە؛ ئەپەکە بە ئەستووری دیوار لێی دەدات.' },
                ar: { openingWidth: 'عرض الفتحة (م)', openingHeight: 'ارتفاع الفتحة (م)', mortarDryFactor: 'معامل الحجم الجاف للمونة (تقديري)', mortarDryFactorNote: 'للتقدير فقط؛ يختلف مردود المونة حسب المواد والخلط.', hollowBlockNote: 'يتم حساب البلوك المفرغ بأبعاده الخارجية ومونة الفواصل فقط. لا يشمل ملء الخلايا بالجراوت؛ أضف تقديراً منفصلاً للجراوت عند الحاجة.', errWallThicknessMismatch: 'سماكة الجدار لا تطابق عدد الطبقات وسماكة البلوك المحدد', openingsDeducted: 'المخصوم {v} م³: {nw} نافذة {ww}×{wh} م + {nd} باب {dw}×{dh} م × سماكة الجدار', errOpeningDimensions: 'أدخل كل فتحة كعرض × ارتفاع؛ ويضرب التطبيق الناتج في سماكة الجدار.' }
            };
            Object.keys(blockExtraLabels).forEach(lang => Object.assign(translations[lang], blockExtraLabels[lang]));
            const brickExtraLabels = {
                en: { hollowBrickNote: 'Hollow bricks are counted by external dimensions and joint mortar only. Cavity filling or grout is not included; add a separate grout estimate if required.', bricksPerM2: 'Bricks per m² of wall face', mixingWaterEstimate: 'Mixing water estimate', mortarDryFactor: 'Mortar dry-volume factor (estimate)', mortarDryFactorNote: 'Estimate only; actual mortar yield varies by materials and batching.', brickCalculationDetails: 'Calculation details' },
                ku: { hollowBrickNote: 'خشتێن بەتاڵ تنێ ب دوورییێن دەرەوە و مۆرتارا درزێنێ دهێنە هەژمارتن. پڕکرنا ناڤەوە یان گراوت نەهاتیە هەژمارتن؛ ئەگەر پێویستە خەمڵاندنا جیاواز زیاد بکە.', bricksPerM2: 'ژمارا خشتان بۆ هەر م² روویا دیوارێ', mixingWaterEstimate: 'خەمڵاندنا ئاڤا تێکەڵکرنێ', mortarDryFactor: 'فاکتەری حەجما وشکی مۆرتاری (خەمڵێنکری)', mortarDryFactorNote: 'تنێ خەمڵاندنە؛ بەرهەما راستەقینە یا مۆرتاری ب پێی ماددە و تێکەڵکرنێ دگۆڕێت.', brickCalculationDetails: 'وردەکارییێن هەژمارتنێ' },
                ks: { hollowBrickNote: 'خشتە بەتاڵەکان تەنها بە دوورییەکانی دەرەوە و مۆرتاری درزەکان هەژمار دەکرێن. پڕکردنەوەی ناوەوە یان گراوت لەخۆناگیرێت؛ ئەگەر پێویستە خەمڵاندنی جیاواز زیاد بکە.', bricksPerM2: 'ژمارەی خشت بۆ هەر م² ڕووی دیوار', mixingWaterEstimate: 'خەمڵاندنی ئاوی تێکەڵکردن', mortarDryFactor: 'فاکتەری حەجمی وشکی مۆرتار (خەمڵێنراو)', mortarDryFactorNote: 'تەنها خەمڵاندنە؛ بەرهەمی ڕاستەقینەی مۆرتار بە ماددە و تێکەڵکردن دەگۆڕێت.', brickCalculationDetails: 'وردەکارییەکانی هەژمارکردن' },
                ar: { hollowBrickNote: 'يتم حساب الطابوق المفرغ بأبعاده الخارجية ومونة الفواصل فقط. لا يشمل ملء التجاويف أو الجراوت؛ أضف تقديراً منفصلاً عند الحاجة.', bricksPerM2: 'عدد الطابوق لكل م² من وجه الجدار', mixingWaterEstimate: 'تقدير ماء الخلط', mortarDryFactor: 'معامل الحجم الجاف للمونة (تقديري)', mortarDryFactorNote: 'للتقدير فقط؛ يختلف مردود المونة حسب المواد والخلط.', brickCalculationDetails: 'تفاصيل الحساب' }
            };
            Object.keys(brickExtraLabels).forEach(lang => Object.assign(translations[lang], brickExtraLabels[lang]));

            const fill = (str, map) => String(str).replace(/\{(\w+)\}/g, (m, k) => (k in map ? map[k] : m));
            const languageSelector = document.getElementById('language-selector');
            const themeToggle = document.getElementById('theme-toggle');
            const themeColorMeta = document.getElementById('theme-color-meta');
            const body = document.body;
            const htmlEl = document.documentElement;
            const currencySelect = document.getElementById('currency');
            const customCurrencyInput = document.getElementById('custom-currency');
            
            const costInputIds = [
                'concrete-cement-cost', 'concrete-sand-cost', 'concrete-aggregate-cost',
                'block-cost', 'block-cement-cost', 'block-sand-cost', 'block-glue-cost',
                'brick-cost', 'brick-cement-cost', 'brick-sand-cost',
                'steel-cost', 'brc-cost', 'concrete-formwork-cost'
            ];
            
            let previousCurrency = currencySelect.value;
            let lastCalcData = {};
            let sessionResults = { concrete: [], blocks: [], bricks: [], steel: [], earthwork: [] };

            const convertAllCosts = (fromCurrency, toCurrency) => {
                if (!((fromCurrency === '$' && toCurrency === 'د.ع') || (fromCurrency === 'د.ع' && toCurrency === '$'))) return true;

                const exchangeRateInput = document.getElementById('exchange-rate');
                const rateFor100Usd = parseFloat(exchangeRateInput.value);

                if (isNaN(rateFor100Usd) || rateFor100Usd <= 0) {
                    const lang = localStorage.getItem('language') || 'en';
                    showError(translations[lang].errExchangeRate);
                    return false;
                }
                
                const singleUsdRate = rateFor100Usd / 100;
                costInputIds.forEach(id => {
                    const input = document.getElementById(id);
                    if (input && input.value) {
                        const currentValue = parseFloat(input.value);
                        if (!isNaN(currentValue)) {
                            let newValue;
                            if (fromCurrency === '$' && toCurrency === 'د.ع') {
                                newValue = currentValue * singleUsdRate;
                                input.value = newValue.toFixed(0);
                            } else if (fromCurrency === 'د.ع' && toCurrency === '$') {
                                newValue = currentValue / singleUsdRate;
                                input.value = newValue.toFixed(2);
                            }
                        }
                    }
                });
                return true;
            };

            currencySelect.addEventListener('change', function() {
                const newCurrency = this.value;
                if (!['$','د.ع'].includes(newCurrency)) { this.value = previousCurrency; return; }
                if (this.value === 'other') { customCurrencyInput.classList.remove('hidden'); } 
                else { customCurrencyInput.classList.add('hidden'); }
                
                if (convertAllCosts(previousCurrency, newCurrency)) { previousCurrency = newCurrency; } 
                else { this.value = previousCurrency; }
            });

            const upgradeLabels = {
                en: {projectInfo:'Project information', projectName:'Project name', clientName:'Client', projectLocation:'Location', projectDate:'Estimate date', inputUnits:'Input unit system', metricUnits:'Metric (m / cm / mm)', imperialUnits:'Imperial display (ft / in)', cementBagSize:'Cement bag size', bag25:'25 kg', bag40:'40 kg', bag50:'50 kg', projectNotes:'Estimate notes', slabSupport:'Slab support', groundSupported:'Ground-supported (no soffit formwork)', suspendedSlab:'Suspended slab (include soffit formwork)', wallLeaves:'Wall leaves', wallThickness:'Wall thickness (m)', formworkCost:'Formwork cost / m²'},
                ku: {projectInfo:'ئاگاھیێن پرۆژێ', projectName:'ناڤێ پرۆژێ', clientName:'میشتری', projectLocation:'شوێن', projectDate:'دروستەیا خەمڵاندنێ', inputUnits:'سیستەما یەکەیێن تێکەران', metricUnits:'متریک (m / cm / mm)', imperialUnits:'ئیمپریاڵ (ft / in)', cementBagSize:'قەبارەیا کەسا چیمەنتویێ', bag25:'٢٥ کگ', bag40:'٤٠ کگ', bag50:'٥٠ کگ', projectNotes:'تێبینیێن خەمڵاندنێ', slabSupport:'پشتگیریا سلەبێ', groundSupported:'سلەبێ ل سەرا ئاخێ (بێ قاڵبێ ژێرێ)', suspendedSlab:'سلەبێ هەلبژێرتیی (ب قاڵبێ ژێرێ)', wallLeaves:'چینێن دیوارێ', wallThickness:'ئەستوورییا دیوارێ (م)', formworkCost:'بەهایا قاڵبێ / م²'},
                ks: {projectInfo:'زانیارییەکانی پڕۆژە', projectName:'ناوی پڕۆژە', clientName:'کڕیار', projectLocation:'شوێن', projectDate:'بەرواری خەمڵاندن', inputUnits:'سیستەمی یەکەکانی تێخستن', metricUnits:'مەتری (m / cm / mm)', imperialUnits:'ئیمپریاڵ (ft / in)', cementBagSize:'قەبارەی کیسەی چیمەنتۆ', bag25:'٢٥ کگ', bag40:'٤٠ کگ', bag50:'٥٠ کگ', projectNotes:'تێبینییەکانی خەمڵاندن', slabSupport:'پشتگیری تەختە', groundSupported:'تەختەی پشتبەستوو بە زەوی (بێ قاڵبی ژێرەوە)', suspendedSlab:'تەختەی هەڵواسراو (لەگەڵ قاڵبی ژێرەوە)', wallLeaves:'چینەکانی دیوار', wallThickness:'ئەستووری دیوار (م)', formworkCost:'تێچووی قاڵب / م²'},
                ar: {projectInfo:'معلومات المشروع', projectName:'اسم المشروع', clientName:'العميل', projectLocation:'الموقع', projectDate:'تاريخ التقدير', inputUnits:'نظام وحدات الإدخال', metricUnits:'متري (م / سم / مم)', imperialUnits:'إمبراطوري (قدم / بوصة)', cementBagSize:'حجم كيس الإسمنت', bag25:'٢٥ كجم', bag40:'٤٠ كجم', bag50:'٥٠ كجم', projectNotes:'ملاحظات التقدير', slabSupport:'نوع دعم البلاطة', groundSupported:'بلاطة على الأرض (بدون قالب سفلي)', suspendedSlab:'بلاطة معلقة (مع قالب سفلي)', wallLeaves:'عدد طبقات الجدار', wallThickness:'سماكة الجدار (م)', formworkCost:'تكلفة القالب / م²'}
            };
            const currencyNotes = { en: 'Only USD ↔ IQD conversion is supported; enter prices in the selected currency.', ku: 'تنێ گۆڕینا USD ↔ IQD پشتگیری دەکرێت؛ بهاکان بۆ دراوێ هەلبژێری بنڤیسە.', ks: 'تەنها گۆڕینی USD ↔ IQD پشتگیری دەکرێت؛ نرخەکان بە دراوی هەڵبژێردراو بنووسە.', ar: 'تتوفر التحويلات بين USD وIQD فقط؛ أدخل الأسعار بالعملة المحددة.' };
            const applyUpgradeLabels = (lang) => { document.querySelectorAll('[data-upgrade-label]').forEach(el => { const key=el.dataset.upgradeLabel; if (upgradeLabels[lang]?.[key]) el.textContent=upgradeLabels[lang][key]; }); const note=document.getElementById('currency-conversion-note'); if (note) note.textContent=currencyNotes[lang] || currencyNotes.en; };

            const escapeHtmlText = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            // Isolate LTR runs (mix ratios like 1:2:4, diameters like Ø12, lap
            // factors like 50d) so they never scramble inside RTL text.
            const bidiWrap = (escaped) => escaped.replace(/(Ø\d+(?:\.\d+)?|\d+(?:\.\d+)?:\d+(?:\.\d+)?(?::\d+(?:\.\d+)?)?|\d+d)/g, '<bdi dir="ltr">$1</bdi>');
            const setLangText = (el, text) => {
                if (el.tagName === 'OPTION' || el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') { el.textContent = text; return; }
                const icons = Array.prototype.slice.call(el.querySelectorAll('i[data-lucide], svg.lucide'));
                if (icons.length) {
                    // Keep icon children (e.g. reset buttons), replace only the label.
                    Array.prototype.slice.call(el.childNodes).forEach(n => {
                        const isIcon = n.nodeType === 1 && n.matches && n.matches('i[data-lucide], svg.lucide');
                        if (!isIcon) el.removeChild(n);
                    });
                    const span = document.createElement('span');
                    span.innerHTML = bidiWrap(escapeHtmlText(text));
                    el.appendChild(span);
                    return;
                }
                el.innerHTML = bidiWrap(escapeHtmlText(text));
            };

            const changeLanguage = (lang) => {
                const dir = lang === 'ar' || lang === 'ku' || lang === 'ks' ? 'rtl' : 'ltr';
                htmlEl.setAttribute('dir', dir);
                htmlEl.setAttribute('lang', lang);
                document.querySelectorAll('[data-lang]').forEach(el => {
                    const key = el.dataset.lang;
                    if (translations[lang] && translations[lang][key]) { 
                        if (el.tagName === "OPTION") el.text = translations[lang][key];
                        else setLangText(el, translations[lang][key]);
                    }
                });
                applyUpgradeLabels(lang);
                // A11Y: translated accessible names
                document.querySelectorAll('[data-lang-aria]').forEach(el => {
                    const key = el.dataset.langAria;
                    if (translations[lang] && translations[lang][key]) {
                        el.setAttribute('aria-label', translations[lang][key]);
                        if (el.hasAttribute('title')) el.title = translations[lang][key];
                    }
                });
                localStorage.setItem('language', lang);
                document.dispatchEvent(new CustomEvent('app:lang', { detail: { lang } }));
            };

            // Light is the default palette; body.theme-dark swaps every token at once.
            const setTheme = (theme) => {
                if (theme === 'dark') {
                    body.classList.add('theme-dark');
                    themeToggle.checked = true;
                    if (themeColorMeta) themeColorMeta.setAttribute('content', '#0b1214');
                } else {
                    body.classList.remove('theme-dark');
                    themeToggle.checked = false;
                    if (themeColorMeta) themeColorMeta.setAttribute('content', '#f2f6f7');
                }
                localStorage.setItem('theme', theme);
            };

            themeToggle.addEventListener('change', () => setTheme(themeToggle.checked ? 'dark' : 'light'));
            languageSelector.addEventListener('change', (e) => changeLanguage(e.target.value));
            
            const savedLang = localStorage.getItem('language') || 'en';
            const savedTheme = localStorage.getItem('theme') || 'light';
            languageSelector.value = savedLang;
            changeLanguage(savedLang);
            setTheme(savedTheme);

            const tabs = document.querySelectorAll('.tab-btn');
            const tabContents = document.querySelectorAll('.tab-content');
            const errorBox = document.getElementById('error-box');
            const errorMessage = document.getElementById('error-message');
            const closeErrorBtn = document.getElementById('close-error');
            const globalSettingsWrapper = document.getElementById('global-settings-wrapper');

            function showError(message) {
                errorMessage.textContent = message;
                errorBox.classList.remove('hidden');
                errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            closeErrorBtn.addEventListener('click', () => { errorBox.classList.add('hidden'); });

            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    if (navigator.vibrate) navigator.vibrate(30);
                    if (typeof loadCalc === 'function') loadCalc(tab.dataset.tab).catch(() => {});
                    tabs.forEach(item => item.classList.remove('tab-active'));
                    tabContents.forEach(content => content.classList.add('hidden'));
                    
                    tab.classList.add('tab-active');
                    const activeTabContent = document.getElementById(tab.dataset.tab);
                    activeTabContent.classList.remove('hidden');
                    
                    // Global settings remain outside every calculator form so Reset cannot change them.
                    if (globalSettingsWrapper) globalSettingsWrapper.classList.add('hidden');
                    errorBox.classList.add('hidden');
                });
            });


            // ------------------------------------------------------------------
            // Home screen: big tiles open a calculator; the back bar returns home.
            // ------------------------------------------------------------------
            const homeScreen = document.getElementById('home-screen');
            const calcBackTitle = document.getElementById('calc-back-title');
            const tabList = Array.from(tabs);

            let toolBeforeSettings = null;
            const goHome = () => {
                body.classList.add('view-home');
                body.classList.remove('view-settings');
                toolBeforeSettings = null;
                homeScreen?.classList.remove('hidden');
                tabList.forEach(t => t.classList.remove('tab-active'));
                tabContents.forEach(c => c.classList.add('hidden'));
                if (globalSettingsWrapper) globalSettingsWrapper.classList.add('hidden');
                errorBox.classList.add('hidden');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };

            const openTool = (toolId) => {
                body.classList.remove('view-home');
                homeScreen?.classList.add('hidden');
                const T9 = translations[localStorage.getItem('language') || 'en'] || {};
                if (toolId === 'settings') {
                    // Project settings is its own screen (back bar + bottom nav).
                    // Remember where the user came from so closing can return there.
                    const activeTab = tabList.find(t => t.classList.contains('tab-active'));
                    if (activeTab) toolBeforeSettings = activeTab.dataset.tab;
                    else if (!body.classList.contains('view-settings')) toolBeforeSettings = null;
                    body.classList.add('view-settings');
                    tabList.forEach(t => t.classList.remove('tab-active'));
                    tabContents.forEach(c => c.classList.add('hidden'));
                    if (globalSettingsWrapper) globalSettingsWrapper.classList.remove('hidden');
                    if (calcBackTitle) calcBackTitle.textContent = T9.workspaceSettings || 'Project settings';
                } else {
                    body.classList.remove('view-settings');
                    if (globalSettingsWrapper) globalSettingsWrapper.classList.add('hidden');
                    const target = tabList.find(t => t.dataset.tab === toolId);
                    if (!target) return;
                    target.click();                       // reuse the existing tab logic
                    if (calcBackTitle) {
                        calcBackTitle.textContent = (target.querySelector('[data-lang]')?.textContent || '').trim() || toolId;
                    }
                }
                errorBox.classList.add('hidden');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
            window.openTool = openTool;

            document.querySelectorAll('.app-tile').forEach(tile => {
                tile.addEventListener('click', () => {
                    if (navigator.vibrate) navigator.vibrate(20);
                    openTool(tile.dataset.goto);
                });
            });
            document.getElementById('back-home-btn')?.addEventListener('click', () => {
                if (navigator.vibrate) navigator.vibrate(20);
                goHome();
            });

            // Closing the settings screen returns to the tool the user was using;
            // when settings were opened from the home screen it returns home.
            const closeSettings = () => {
                if (globalSettingsWrapper) globalSettingsWrapper.classList.add('hidden');
                body.classList.remove('view-settings');
                const back = toolBeforeSettings;
                toolBeforeSettings = null;
                if (back) openTool(back);
                else goHome();
            };
            const closeGlobalSettingsBtn = document.getElementById('close-global-settings-btn');
            if (closeGlobalSettingsBtn && globalSettingsWrapper) closeGlobalSettingsBtn.addEventListener('click', closeSettings);
            if (globalSettingsWrapper) globalSettingsWrapper.addEventListener('click', (event) => {
                if (event.target === globalSettingsWrapper) closeSettings();
            });

            document.querySelectorAll('.reset-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const formId = button.dataset.form;
                    const form = document.getElementById(formId);
                    
                    form.querySelectorAll('input, select').forEach(input => {
                        if (input.tagName.toLowerCase() === 'select') { 
                            input.selectedIndex = 0; input.dispatchEvent(new Event('change'));
                        } else if (input.type === 'checkbox') {
                            input.checked = (input.id === 'block-include-mortar' || input.id === 'brick-include-mortar');
                        } else if (input.type !== 'radio') { 
                             input.value = input.defaultValue; 
                             input.classList.remove('input-error', 'input-valid');
                        }
                    });

                    form.querySelectorAll('input[type="radio"]').forEach(radio => {
                        if (radio.value === 'dims' || radio.value === 'spacing') radio.checked = true;
                    });

                    form.querySelectorAll('#block-num-windows, #block-window-width, #block-window-height, #block-num-doors, #block-door-width, #block-door-height, #brick-num-windows, #brick-window-width, #brick-window-height, #brick-num-doors, #brick-door-width, #brick-door-height').forEach(input => {
                        input.value = '0';
                    });

                    if (formId === 'steel') {
                        const lapDetails = document.getElementById('steel-lap-details');
                        if (lapDetails) lapDetails.open = false;
                        const customRows = document.getElementById('steel-custom-rows');
                        const customAdd = document.getElementById('steel-custom-add-row');
                        if (customRows && customAdd) { customRows.innerHTML = ''; customAdd.click(); }
                    }
                    if (formId === 'bricks') { document.getElementById('brick-mortar-thickness').value = '1.0'; document.getElementById('brick-mortar-dry-factor').value = '1.33'; }
                    if (formId === 'blocks') { document.getElementById('block-mortar-thickness').value = '1.0'; document.getElementById('block-mortar-dry-factor').value = '1.33'; }
                    if (formId === 'concrete') {
                        document.getElementById('concrete-ratio').value = '1:2:4';
                        document.getElementById('concrete-mix-basis').value = 'nominal';
                        document.getElementById('concrete-approved-profile')?.classList.add('hidden');
                        document.getElementById('concrete-approved-recipe')?.classList.add('hidden');
                        ['concrete-approved-cement','concrete-approved-water','concrete-approved-sand','concrete-approved-aggregate'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
                        document.getElementById('concrete-approved-admixture').value = '0';
                        document.getElementById('concrete-approved-admixture-unit').value = 'kg';
                        document.getElementById('concrete-quantity').value = '1';
                        document.querySelector('input[name="concrete-mode"][value="dims"]').checked = true;
                        document.getElementById('concrete-type').value = 'slab';
                        document.querySelector('input[name="concrete-mode"][value="dims"]').dispatchEvent(new Event('change'));
                        document.getElementById('concrete-type').dispatchEvent(new Event('change'));
                    }

                    document.querySelectorAll('input[name="block-mode"], input[name="brick-mode"], input[name="footing-mode"], input[name="slab-mode"], input[name="concrete-mode"]').forEach(radio => {
                        if (radio.checked) radio.dispatchEvent(new Event('change'));
                    });

                    document.getElementById(`${formId}-result`).classList.add('hidden');
                    document.querySelectorAll('.sanity-banner').forEach(b => b.remove());
                    errorBox.classList.add('hidden');

                    if (sessionResults[formId]) {
                        sessionResults[formId] = [];
                        renderSessionTable(formId);
                    }
                });
            });
            
            function setupCalcModeToggle(modeName) {
                const modeRadios = document.querySelectorAll(`input[name="${modeName}-mode"]`);
                const dimsInputs = document.getElementById(`${modeName}-dims-inputs`);
                const volumeInput = document.getElementById(`${modeName}-volume-input`);
                
                modeRadios.forEach(radio => {
                    radio.addEventListener('change', (e) => {
                        const mode = e.target.value;
                        if (dimsInputs) dimsInputs.classList.toggle('hidden', mode !== 'dims');
                        if (volumeInput) volumeInput.classList.toggle('hidden', mode !== 'volume');
                    });
                });
            }
            setupCalcModeToggle('block');
            setupCalcModeToggle('brick');
            setupCalcModeToggle('concrete');

            
            // Cost Accordion Handler
            document.querySelectorAll('.cost-accordion-toggle').forEach(btn => {
                btn.addEventListener('click', () => {
                    const targetId = btn.dataset.target;
                    const container = document.getElementById(targetId);
                    if (!container) return;
                    const isHidden = container.classList.toggle('hidden');
                    btn.setAttribute('aria-expanded', !isHidden);
                    const icon = btn.querySelector('[data-lucide="chevron-down"], [data-lucide="chevron-up"], svg');
                    if (icon) {
                        icon.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
                    }
                });
            });

            function setupOpeningsToggle(type) {
                const toggle = document.getElementById(`${type}-openings-toggle`);
                const container = document.getElementById(`${type}-openings-container`);
                const icon = toggle.querySelector('i');
                toggle.addEventListener('click', () => {
                    container.classList.toggle('hidden');
                    icon.setAttribute('data-lucide', container.classList.contains('hidden') ? 'chevron-down' : 'chevron-up');
                    window.lucide?.createIcons?.();
                });
                const numWindows = document.getElementById(`${type}-num-windows`);
                const windowArea = document.getElementById(`${type}-window-area`);
                const windowWidth = document.getElementById(`${type}-window-width`);
                const windowHeight = document.getElementById(`${type}-window-height`);
                const numDoors = document.getElementById(`${type}-num-doors`);
                const doorArea = document.getElementById(`${type}-door-area`);
                const doorWidth = document.getElementById(`${type}-door-width`);
                const doorHeight = document.getElementById(`${type}-door-height`);
                const wallWidthInput = document.getElementById(`${type}-wall-width-input`);
                const summary = document.getElementById(`${type}-openings-summary`);
                const updateSummary = () => {
                    const wallThickness = parseFloat(wallWidthInput?.value) || 0;
                    const totalOpeningVolume = windowWidth
                        ? ((parseFloat(numWindows.value) || 0) * (parseFloat(windowWidth.value) || 0) * (parseFloat(windowHeight.value) || 0) * wallThickness) + ((parseFloat(numDoors.value) || 0) * (parseFloat(doorWidth.value) || 0) * (parseFloat(doorHeight.value) || 0) * wallThickness)
                        : ((parseFloat(numWindows.value) || 0) * (parseFloat(windowArea?.value) || 0)) + ((parseFloat(numDoors.value) || 0) * (parseFloat(doorArea?.value) || 0));
                    const T = translations[localStorage.getItem('language') || 'en'];
                    summary.innerHTML = `<div class="opening-item">${T.totalOpeningVolume}: ${totalOpeningVolume.toFixed(3)} m³</div>`;
                };
                [numWindows, windowArea, windowWidth, windowHeight, numDoors, doorArea, doorWidth, doorHeight, wallWidthInput].filter(Boolean).forEach(input => input.addEventListener('input', updateSummary));
                updateSummary();
            }
            setupOpeningsToggle('block');
            setupOpeningsToggle('brick');

            const steelElementSelector = document.getElementById('steel-element-selector');
            const steelInputContainers = {
                footing: document.getElementById('steel-footing-inputs'), slab: document.getElementById('steel-slab-inputs'),
                beam: document.getElementById('steel-beam-inputs'), column: document.getElementById('steel-column-inputs'),
                one_way: document.getElementById('steel-one-way-inputs'), custom: document.getElementById('steel-custom-inputs'),
                brc: document.getElementById('steel-brc-inputs')
            };

            steelElementSelector.addEventListener('change', () => {
                const selectedValue = steelElementSelector.value;
                Object.values(steelInputContainers).forEach(container => container.classList.add('hidden'));
                const memberQtyRow = document.getElementById('steel-member-qty-row');
                if (memberQtyRow) memberQtyRow.classList.toggle('hidden', selectedValue === 'custom');
                const presetBtnEl = document.getElementById('steel-preset-btn');
                if (presetBtnEl) presetBtnEl.classList.toggle('hidden', !selectedValue || selectedValue === 'custom' || selectedValue === 'brc');
                if (selectedValue) {
                    steelInputContainers[selectedValue].classList.remove('hidden');
                    document.getElementById('steel-step-2-card').classList.remove('hidden');
                    document.getElementById('steel-cost-card').classList.toggle('hidden', selectedValue === 'brc');
                } else {
                    document.getElementById('steel-step-2-card').classList.add('hidden');
                    document.getElementById('steel-cost-card').classList.add('hidden');
                }
            });

            function setupSteelCalcModeToggle(elementType) {
                const modeRadios = document.querySelectorAll(`input[name="${elementType}-mode"]`);
                const spacingInputs = document.getElementById(`${elementType}-spacing-inputs`);
                const numberInputs = document.getElementById(`${elementType}-number-inputs`);
                modeRadios.forEach(radio => {
                    radio.addEventListener('change', (e) => {
                        const isSpacing = e.target.value === 'spacing';
                        spacingInputs.classList.toggle('hidden', !isSpacing);
                        numberInputs.classList.toggle('hidden', isSpacing);
                    });
                });
            }
            setupSteelCalcModeToggle('footing');
            setupSteelCalcModeToggle('slab');

            document.getElementById('beam-include-stirrups').addEventListener('change', function() { document.getElementById('beam-stirrups-details').classList.toggle('hidden', !this.checked); });
            document.getElementById('column-include-stirrups').addEventListener('change', function() { document.getElementById('column-stirrups-details').classList.toggle('hidden', !this.checked); });
            // Lap splices: a collapsed <details>; opening it enables the lap math
            // (calc-steel reads #steel-lap-details.open). Custom bars: dynamic rows.
            const steelCustomRows = document.getElementById('steel-custom-rows');
            const steelCustomAdd = document.getElementById('steel-custom-add-row');
            function buildSteelCustomRow() {
                if (!steelCustomRows || steelCustomRows.children.length >= 8) return;
                const lang = localStorage.getItem('language') || 'en';
                const T = translations[lang] || translations.en;
                const row = document.createElement('div');
                row.className = 'custom-bar-row';
                row.innerHTML = `
                    <div class="grid grid-cols-3 gap-2 items-end">
                        <div>
                            <label class="block text-xs font-medium" data-lang="diameter">${T.diameter}</label>
                            <select class="pro-input w-full custom-diameter">
                                <option value="" disabled selected data-lang="selectDiameter">${T.selectDiameter}</option>
                                ${[8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 32].map(d => `<option value="${d}">${d}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-medium" data-lang="numberOfBars">${T.numberOfBars}</label>
                            <input type="number" inputmode="numeric" min="1" step="1" class="pro-input w-full custom-count" data-sane="1:2000:">
                        </div>
                        <div>
                            <label class="block text-xs font-medium" data-lang="barLength">${T.barLength}</label>
                            <input type="number" inputmode="decimal" min="0.1" step="0.1" class="pro-input w-full custom-length" data-sane="0.3:24:m">
                        </div>
                    </div>
                    <button type="button" class="custom-remove-btn" data-lang-aria="removeRowBtn" title="${T.removeRowBtn || 'Remove'}" aria-label="${T.removeRowBtn || 'Remove'}">
                        <i data-lucide="x" class="w-4 h-4 pointer-events-none"></i>
                    </button>`;
                row.querySelector('.custom-remove-btn').addEventListener('click', () => {
                    if (steelCustomRows.children.length > 1) row.remove();
                });
                steelCustomRows.appendChild(row);
                if (window.lucide) window.lucide.createIcons();
            }
            if (steelCustomAdd) steelCustomAdd.addEventListener('click', buildSteelCustomRow);
            buildSteelCustomRow();

            function getWastageFactor() {
                const raw = document.getElementById('wastage').value.trim();
                const wastage = raw === '' ? 0 : Number(raw);
                if (!Number.isFinite(wastage) || wastage < 0 || wastage > 50) {
                    showError(translations[localStorage.getItem('language') || 'en'].errWastage);
                    return null;
                }
                return 1 + (wastage / 100);
            }
            
            function getCurrency() { return currencySelect.value === 'other' ? (customCurrencyInput.value.trim() || 'د.ع') : currencySelect.value; }

            // Project/report settings shared by every calculator.
            function getCementBagMass() { return Number(document.getElementById('cement-bag-mass')?.value) || 50; }
            function getProjectMeta() {
                return {
                    name: document.getElementById('project-name')?.value.trim() || 'Construction Material Estimate',
                    client: document.getElementById('client-name')?.value.trim() || '',
                    location: document.getElementById('project-location')?.value.trim() || '',
                    date: document.getElementById('project-date')?.value || new Date().toISOString().slice(0,10),
                    notes: document.getElementById('project-notes')?.value.trim() || '',
                    units: document.getElementById('input-unit-system')?.value || 'metric'
                };
            }
            const projectFieldIds = ['project-name','client-name','project-location','project-date','project-notes','input-unit-system','cement-bag-mass'];
            const savedProjectMeta = JSON.parse(localStorage.getItem('estimatorProjectMeta') || '{}');
            projectFieldIds.forEach(id => {
                const el = document.getElementById(id);
                if (!el) return;
                if (savedProjectMeta[id] !== undefined) el.value = savedProjectMeta[id];
                if (id === 'input-unit-system' && el.value !== 'metric') el.value = 'metric';
                el.addEventListener('input', () => {
                    const data = {}; projectFieldIds.forEach(key => { const node = document.getElementById(key); if (node) data[key] = node.value; });
                    localStorage.setItem('estimatorProjectMeta', JSON.stringify(data));
                });
            });
            document.querySelectorAll('input[type="number"], input[type="text"], textarea').forEach(input => {
                input.setAttribute('autocomplete', 'off');
                input.setAttribute('enterkeyhint', 'next');
                if (input.type === 'number') input.setAttribute('spellcheck', 'false');
            });

            // Unit preference: values entered in imperial are converted to metric just before calculation,
            // then restored for continued editing. Internal formulas always remain metric.
            const imperialUnitMap = {
                'concrete-length':.3048,'concrete-width':.3048,'concrete-thickness':.3048,'concrete-total-volume':.0283168,
                'block-wall-length':.3048,'block-wall-height':.3048,'block-wall-width-input':.3048,'block-wall-volume':.0283168,'block-window-width':.3048,'block-window-height':.3048,'block-door-width':.3048,'block-door-height':.3048,'block-mortar-thickness':2.54,
                'brick-wall-length':.3048,'brick-wall-height':.3048,'brick-wall-width-input':.3048,'brick-wall-volume':.0283168,'brick-window-width':.3048,'brick-window-height':.3048,'brick-door-width':.3048,'brick-door-height':.3048,'brick-mortar-thickness':2.54,
                'one-way-dist-length':.3048,'one-way-bar-length':.3048,'one-way-spacing':25.4,'one-way-diameter':25.4,
                'footing-length':.3048,'footing-width':.3048,'slab-length':.3048,'slab-width':.3048,
                'beam-length':.3048,'column-height':.3048,'beam-width-dim':25.4,'beam-depth-dim':25.4,'column-width-dim':25.4,'column-depth-dim':25.4,
                'concrete-cover':25.4,'stirrup-spacing':25.4,'stirrup-diameter':25.4,'steel-standard-bar-length':.3048
            };
            let unitMode = document.getElementById('input-unit-system')?.value || 'metric';
            const convertDisplayedUnits = (from, to) => {
                if (from === to) return;
                Object.entries(imperialUnitMap).forEach(([id, metricFactor]) => {
                    const el = document.getElementById(id); if (!el || el.value === '') return;
                    const value = Number(el.value); if (!Number.isFinite(value)) return;
                    el.value = from === 'metric' && to === 'imperial' ? (value / metricFactor).toFixed(3) : (value * metricFactor).toFixed(3);
                });
            };
            document.getElementById('input-unit-system')?.addEventListener('change', e => { if (e.target.value !== 'metric') { e.target.value = 'metric'; return; } unitMode = 'metric'; });
            document.querySelectorAll('[id^="calculate-"]').forEach(button => button.addEventListener('click', () => {
                if (unitMode !== 'imperial') return;
                convertDisplayedUnits('imperial','metric');
                setTimeout(() => convertDisplayedUnits('metric','imperial'), 0);
            }, true));

            document.querySelectorAll('input[type="number"]').forEach(input => {
                input.addEventListener('blur', () => {
                    if (input.value && input.value < 0) {
                        input.classList.add('input-error');
                        showError(translations[localStorage.getItem('language') || 'en'].errNegative);
                    } else if (input.value && input.value >= 0) {
                        input.classList.remove('input-error'); input.classList.add('input-valid');
                    } else {
                        input.classList.remove('input-error', 'input-valid');
                    }
                });
            });

            const updateConcreteVisibility = () => {
                const type = document.getElementById('concrete-type').value;
                const mode = document.querySelector('input[name="concrete-mode"]:checked')?.value || 'dims';
                const isMember = true;
                const T = translations[localStorage.getItem('language') || 'en'];
                const quantityWrap = document.getElementById('concrete-quantity-wrapper');
                const quantityInput = document.getElementById('concrete-quantity');
                quantityWrap.classList.toggle('hidden', mode === 'volume' || !isMember);
                quantityInput.disabled = mode === 'volume' || !isMember;
                document.getElementById('concrete-slab-support-wrap').classList.toggle('hidden', type !== 'slab');
                const formworkInput = document.getElementById('concrete-formwork-cost');
                const formworkNote = document.getElementById('concrete-formwork-note');
                if (formworkInput) { formworkInput.disabled = mode === 'volume'; if (mode === 'volume') formworkInput.value = ''; }
                if (formworkNote) formworkNote.textContent = mode === 'volume' ? `${T.formworkDimensionsNote} ${T.formworkNotIncludedVolume}` : T.formworkDimensionsNote;
                const labels = type === 'column' ? [T.columnHeightLabel, T.columnWidthLabel, T.columnDepthLabel] : type === 'beam' ? [T.beamSpanLabel, T.beamWidthLabel, T.beamDepthLabel] : [T.length, T.width, T.thickness];
                ['concrete-length-label','concrete-width-label','concrete-thickness-label'].forEach((id,i) => { const el=document.getElementById(id); if (el && labels[i]) el.textContent=labels[i]; });
            };
            document.getElementById('concrete-type').addEventListener('change', updateConcreteVisibility);
            document.querySelectorAll('input[name="concrete-mode"]').forEach(radio => radio.addEventListener('change', updateConcreteVisibility));
            updateConcreteVisibility();
            const updateConcreteMixVisibility = () => {
                const basis = document.getElementById('concrete-mix-basis')?.value || 'nominal';
                const approved = basis === 'approved';
                const custom = basis === 'custom';
                document.getElementById('concrete-nominal-ratio-wrap')?.classList.toggle('hidden', approved || custom);
                document.getElementById('concrete-approved-profile')?.classList.toggle('hidden', basis !== 'custom');
                document.getElementById('concrete-approved-recipe')?.classList.toggle('hidden', basis !== 'approved');
                const currentTranslations = translations[localStorage.getItem('language') || 'en'];
                document.getElementById('concrete-ratio').disabled = approved || custom;
                document.getElementById('concrete-dry-factor').disabled = approved;
                document.getElementById('concrete-cement-density').disabled = approved;
                document.getElementById('concrete-dry-factor-wrap')?.classList.toggle('hidden', approved);
                document.getElementById('concrete-cement-density-wrap')?.classList.toggle('hidden', approved);
                const sandLabel = document.getElementById('concrete-sand-cost-label');
                const aggregateLabel = document.getElementById('concrete-aggregate-cost-label');
                if (sandLabel) sandLabel.textContent = approved ? currentTranslations.costSandKg : currentTranslations.costSandM3;
                if (aggregateLabel) aggregateLabel.textContent = approved ? currentTranslations.costAggregateKg : currentTranslations.costAggregateM3;
            };
            document.getElementById('concrete-mix-basis')?.addEventListener('change', updateConcreteMixVisibility);
            languageSelector.addEventListener('change', updateConcreteMixVisibility);
            updateConcreteMixVisibility();
            const updateBlockTypeVisibility = () => {
                const value = document.getElementById('block-type')?.value;
                document.getElementById('block-custom-profile')?.classList.toggle('hidden', value !== 'custom');
                document.getElementById('block-hollow-note')?.classList.toggle('hidden', value !== 'hollow');
            };
            document.getElementById('block-type')?.addEventListener('change', updateBlockTypeVisibility);
            updateBlockTypeVisibility();
            const updateBrickTypeVisibility = () => { const value = document.getElementById('brick-type')?.value; document.getElementById('brick-custom-profile')?.classList.toggle('hidden', value !== 'custom'); document.getElementById('brick-hollow-note')?.classList.toggle('hidden', value !== 'hollow_brick'); }; document.getElementById('brick-type')?.addEventListener('change', updateBrickTypeVisibility); updateBrickTypeVisibility();

            let projects = JSON.parse(localStorage.getItem('estimatorProjects')) || {};

            function getActiveFormInputValues() {
                const values = {};
                const activeTab = document.querySelector('.tab-content:not(.hidden)');
                if (activeTab) {
                    activeTab.querySelectorAll('input, select').forEach(input => {
                        if (input.type === 'radio') { if(input.checked) values[input.name] = input.value; }
                        else if (input.id) { values[input.id] = input.type === 'checkbox' ? input.checked : input.value; }
                    });
                }
                return values;
            }

            function setFormInputValues(formId, values) {
                const form = document.getElementById(formId);
                if (!form) return;
                Object.keys(values).forEach(key => {
                    const inputById = form.querySelector(`#${key}`);
                    const inputByName = form.querySelector(`input[name="${key}"][value="${values[key]}"]`);
                    if (inputById && inputById.type !== 'radio') {
                        if (inputById.type === 'checkbox') inputById.checked = values[key];
                        else inputById.value = values[key];
                        inputById.dispatchEvent(new Event('change', { bubbles: true }));
                        inputById.dispatchEvent(new Event('input', { bubbles: true }));
                    } else if(inputByName && inputByName.type === 'radio'){
                        inputByName.checked = true;
                        inputByName.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                });
            }
            
            const historyModal = document.getElementById('history-modal');
            const openModal = (modalEl) => {
                if (!modalEl) return;
                modalEl.classList.remove('hidden', 'opacity-0');
                modalEl.setAttribute('aria-hidden', 'false');
                modalEl.querySelector('.modal-content')?.classList.remove('scale-95');
                document.body.classList.add('modal-open');
            };
            const closeModal = (modalEl) => {
                modalEl.classList.add('opacity-0'); modalEl.querySelector('.modal-content').classList.add('scale-95');
                setTimeout(() => { modalEl.classList.add('hidden'); modalEl.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-open'); }, 300);
            };

            const openHistoryBtn = document.getElementById('workspace-history-btn');
            if (openHistoryBtn) {
                const openHistory = (event) => { event?.preventDefault(); openModal(historyModal); };
                openHistoryBtn.addEventListener('pointerup', openHistory, { passive: false });
                openHistoryBtn.addEventListener('click', openHistory);
            }
            document.getElementById('close-history-modal-btn').addEventListener('click', () => closeModal(historyModal));
            historyModal.addEventListener('click', (e) => { if(e.target === historyModal) closeModal(historyModal); });

            let calculationHistory = JSON.parse(localStorage.getItem('calculationHistory')) || [];
            const historyContainer = document.getElementById('calculation-history');

            const saveToHistory = (type, data) => {
                calculationHistory.unshift({ type, data, timestamp: new Date().toISOString() });
                if (calculationHistory.length > 10) calculationHistory = calculationHistory.slice(0, 10);
                localStorage.setItem('calculationHistory', JSON.stringify(calculationHistory));
                renderHistory();
            };

            const renderHistory = () => {
                historyContainer.innerHTML = '';
                if (calculationHistory.length === 0) {
                    historyContainer.innerHTML = `<p class="text-center text-gray-500 py-4" data-lang="noHistory">No calculation history yet</p>`;
                    changeLanguage(localStorage.getItem('language') || 'en');
                    return;
                }
                
                calculationHistory.forEach((item, index) => {
                    const hLang = localStorage.getItem('language') || 'en';
                    const HT = translations[hLang];
                    const hTypeKey = { concrete: 'tabConcrete', blocks: 'tabBlocks', bricks: 'tabBricks', steel: 'tabSteel', earthwork: 'tabEarthwork' }[item.type];
                    const displayType = hTypeKey ? HT[hTypeKey] : (item.type === 'one_way' ? HT.oneWay : item.type.charAt(0).toUpperCase() + item.type.slice(1));
                    const historyItem = document.createElement('div');
                    historyItem.className = 'history-item';
                    historyItem.setAttribute('data-index', index);
                    historyItem.innerHTML = `
                        <div class="flex justify-between items-center pointer-events-none">
                            <div><strong>${displayType}</strong><p class="text-sm">${new Date(item.timestamp).toLocaleString()}</p></div>
                            <button type="button" class="load-history-btn text-blue-400 hover:text-blue-300 pointer-events-auto" title="${HT.loadTitle}"><i data-lucide="rotate-ccw" class="w-4 h-4 pointer-events-none"></i><span>${HT.loadTitle}</span></button>
                        </div>`;
                     historyContainer.appendChild(historyItem);
                });
                
                const clearBtn = document.createElement('button');
                clearBtn.className = 'btn btn-secondary w-full mt-4';
                clearBtn.setAttribute('data-lang', 'clearHistory');
                clearBtn.textContent = translations[localStorage.getItem('language') || 'en'].clearHistory;
                clearBtn.addEventListener('click', clearHistory);
                historyContainer.appendChild(clearBtn);
                window.lucide?.createIcons?.();
            };
            
            const clearHistory = () => { calculationHistory = []; localStorage.removeItem('calculationHistory'); renderHistory(); };

            historyContainer.addEventListener('click', (e) => {
                const historyItem = e.target.closest('.history-item');
                if (historyItem && !e.target.closest('[data-lang="clearHistory"]')) {
                    const item = calculationHistory[historyItem.getAttribute('data-index')];
                    if (item) {
                        closeModal(historyModal);
                        document.querySelector(`[data-tab="${item.type}"]`).click();
                        setTimeout(() => {
                            if (item.data && item.data.currency) previousCurrency = item.data.currency;
                            setFormInputValues(item.type, item.data);
                            const calcBtn = document.getElementById(`calculate-${item.type}`);
                            if (calcBtn) calcBtn.click();
                        }, 100);
                    }
                }
             });

            renderHistory();
            
            function renderSessionTable(type) {
                const tableBody = document.getElementById(`${type}-table-body`);
                const tableSection = document.getElementById(`${type}-table-section`);
                // Cells may hold words baked in the language active when they were
                // calculated ("12 bags", "Beam", cost-not-entered). Map any
                // language's wording back to the current one at render time.
                const localizeCell = (val) => {
                    if (typeof val !== 'string') return val;
                    const T = translations[localStorage.getItem('language') || 'en'];
                    const exact = {}, word = {};
                    const exactKeys = ['costNotEntered', 'footing', 'slab', 'beam', 'column', 'oneWay', 'customBars', 'brcMesh'];
                    const wordKeys = ['bagsWord', 'piecesWord'];
                    Object.values(translations).forEach(L => {
                        if (!L || typeof L !== 'object') return;
                        exactKeys.forEach(k => { if (L[k]) exact[L[k]] = T[k]; });
                        wordKeys.forEach(k => { if (L[k]) word[L[k]] = T[k]; });
                    });
                    if (exact[val]) return exact[val];
                    const m = /^(.*?\d[\d.,]*\s+)(\S+)$/.exec(val);
                    if (m && word[m[2]]) return m[1] + word[m[2]];
                    return val;
                };
                tableBody.innerHTML = ''; 
                const countEl = tableSection.querySelector('.session-count');
                if (countEl) countEl.textContent = String(sessionResults[type].length);

                if (sessionResults[type].length === 0) {
                    tableSection.classList.add('hidden');
                    if (type === 'concrete') document.getElementById('concrete-table-footer').innerHTML = '';
                    return;
                }

                tableSection.classList.remove('hidden');
                const table = tableSection.querySelector('table');
                const headers = [...table.querySelectorAll('thead th')].map(th => th.textContent.trim());
                let rowsHTML = '';
                sessionResults[type].forEach(result => {
                    let row = '<tr>';
                    Object.values(result).forEach((value, index) => { row += `<td data-label="${(headers[index] || '').replace(/"/g, '&quot;')}">${localizeCell(value)}</td>`; });
                    row += '</tr>';
                    rowsHTML += row;
                });
                tableBody.innerHTML = rowsHTML;

                if (type === 'concrete') {
                    const T = translations[localStorage.getItem('language') || 'en'];
                    let cumulativeVolume = 0;
                    sessionResults.concrete.forEach(r => cumulativeVolume += parseFloat(r.totalVolume));
                    document.getElementById('concrete-table-footer').innerHTML = `
                        <tr style="background-color: rgba(79, 70, 229, 0.15);">
                            <td style="text-align: end; font-weight: bold; color: inherit;" data-lang="cumulativeTotal">${T.cumulativeTotal}:</td>
                            <td style="font-weight: bold; text-align: start;">${cumulativeVolume.toFixed(2)} m³</td>
                            <td colspan="4"></td>
                        </tr>`;
                }
            }

            const exportToPDF = (resultHTML, title) => {
                const printArea = document.getElementById('print-area');
                const lang = localStorage.getItem('language') || 'en';
                const dir = lang === 'ar' || lang === 'ku' || lang === 'ks' ? 'rtl' : 'ltr';
                const T = translations[lang];
                
                const project = getProjectMeta();
                printArea.innerHTML = `
                    <style>
                        /* EXPLICIT DARK MODE OVERRIDE FOR PRINTING */
                        #print-area { background-color: #ffffff !important; color: #000000 !important; }
                        #print-area * { color: #000000 !important; border-color: #d1d5db !important; text-shadow: none !important; box-shadow: none !important; }
                        #print-area .card, #print-area .table-wrapper, #print-area .table-scroll-container, #print-area .result-content {
                            background-color: transparent !important; backdrop-filter: none !important; border: none !important; box-shadow: none !important;
                        }
                        #print-area .table-scroll-container::after { display: none !important; }
                        #print-area table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; font-size: 0.9rem; }
                        #print-area th, #print-area td { border: 1px solid #d1d5db !important; padding: 0.75rem 0.5rem; text-align: start; }
                        #print-area th { background-color: #f3f4f6 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; font-weight: bold; }
                        #print-area tr:nth-child(even) td { background-color: #f9fafb !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        #print-area tfoot td { background-color: #e0e7ff !important; font-weight: bold !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        #print-area .result-item { background-color: #f9fafb !important; border: 1px solid #e5e7eb !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin-bottom: 0.5rem; padding: 0.5rem; border-radius: 0.375rem; }
                        #print-area h1 { color: #111827 !important; border-bottom: 2px solid #e5e7eb; padding-bottom: 1rem; margin-bottom: 2rem; font-size: 2rem; font-weight: bold; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        #print-area h3 { margin-top: 0; }
                        #print-area .header-title { font-weight: bold; margin-bottom: 0.5rem; }
                        #print-area svg, #print-area i { color: #4b5563 !important; stroke: #4b5563 !important; }
                        /* ===== A11Y + MOBILE PATCH ===== */
        :focus-visible { outline: 3px solid #a5b4fc; outline-offset: 2px; border-radius: 0.375rem; }
        .light-mode :focus-visible { outline-color: #4338ca; }
        #theme-toggle:focus-visible + div { outline: 3px solid #a5b4fc; outline-offset: 2px; }
        .light-mode #theme-toggle:focus-visible + div { outline-color: #4338ca; }
        /* 44px minimum tap targets */
        #workspace-history-btn, #mobile-reset, #close-error, #close-history-modal-btn,
        .load-history-btn, .btn[class*="!p-2"] {
            min-width: 44px; min-height: 44px; display: inline-flex; align-items: center; justify-content: center;
        }
        /* contrast fixes */
        .light-mode .designer-credit { color: #4b5563; }
        .btn-success { background-color: #047857; }
        .btn-success:hover { background-color: #065f46; }
        /* no sticky hover lift on touch screens */
        @media (hover: none) {
            .card:hover, .btn:hover, .history-item:hover { transform: none; }
        }
        /* save battery on phones: static background */
        @media (max-width: 640px) { body, body.light-mode { animation: none; } }
        /* respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
            .card:hover, .btn:hover, .history-item:hover { transform: none !important; }
        }
    </style>
                    <div style="font-family: 'Inter', 'Noto Sans Arabic', sans-serif; padding: 2rem; direction: ${dir}; background: #ffffff;">
                        <h1>${project.name} — ${title}</h1>
                        <div style="margin:-1rem 0 1.5rem; color:#4b5563 !important; font-size:.9rem;">
                            ${project.client ? `Client: ${project.client} · ` : ''}${project.location ? `Location: ${project.location} · ` : ''}Date: ${project.date}
                            ${project.notes ? `<br><strong>Notes:</strong> ${project.notes}` : ''}
                        </div>
                        <div>${resultHTML}</div>
                        <footer style="margin-top: 3rem; text-align: center; font-size: 0.8rem; color: #6b7280 !important; border-top: 1px solid #e5e7eb; padding-top: 1rem;">
                            Generated by ${T.appTitle} on ${new Date().toLocaleDateString()}
                        </footer>
                    </div>`;
                window.print();
                
                // Clear the DOM after the print dialog is triggered to prevent layout issues
                setTimeout(() => {
                    printArea.innerHTML = '';
                }, 500);
            };

            const exportToCSV = async (resultCard) => {
                const title = resultCard.querySelector('h3').textContent.trim();
                const project = getProjectMeta();
                const rows = [['"Project"', `"${project.name.replace(/"/g, '""')}"`], ['"Client"', `"${project.client.replace(/"/g, '""')}"`], ['"Location"', `"${project.location.replace(/"/g, '""')}"`], ['"Date"', `"${project.date}"`], ['"Parameter"', '"Value"']];
                
                resultCard.querySelectorAll('.result-item').forEach(item => {
                    const labelEl = item.querySelector('strong');
                    const valueEl = item.querySelector('span');
                    if (labelEl && valueEl) {
                        const label = labelEl.textContent.trim().replace(/"/g, '""');
                        const textContent = valueEl.textContent || "";
                        const value = textContent.replace(labelEl.textContent, '').trim().replace(/"/g, '""');
                        rows.push([`"${label}"`, `"${value}"`]);
                    }
                });
                
                const totalCostEl = resultCard.querySelector('.total-cost-print strong');
                if (totalCostEl) {
                    const totalText = totalCostEl.textContent.trim();
                    const match = totalText.match(/^(.+?)\s+([^\s\d]*\d.*)$/);
                    if (match) {
                        rows.push([`"${match[1].trim().replace(/"/g, '""')}"`, `"${match[2].trim().replace(/"/g, '""')}"`]); 
                    } else {
                        rows.push([`"Total"`, `"${totalText.replace(/"/g, '""')}"`]);
                    }
                }
                
                let csvContent = rows.map(e => e.join(",")).join("\n");
                const fileName = `${title.replace(/[^\w\s]/gi, '').replace(/ /g, '_')}_estimation.csv`;
                const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
                
                if (navigator.canShare) {
                    const file = new File([blob], fileName, { type: 'text/csv' });
                    if (navigator.canShare({ files: [file] })) {
                        try {
                            await navigator.share({
                                files: [file],
                                title: `${title} Export`,
                            });
                            return;
                        } catch (error) {
                            console.log('Sharing failed or cancelled', error);
                        }
                    }
                }

                // Fallback
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", fileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };

            document.querySelector('main').addEventListener('click', (e) => {
                const exportBtn = e.target.closest('.export-btn');
                const exportCsvBtn = e.target.closest('.export-csv-btn');
                const saveHistoryBtn = e.target.closest('.save-history-btn');
                
                if (exportBtn) {
                    const activeTab = exportBtn.closest('.tab-content');
                    const tabId = activeTab.id;
                    const resultCard = exportBtn.closest('.result-card');
                    const title = resultCard.querySelector('h3').textContent;
                    const content = resultCard.querySelector('.result-content').cloneNode(true);
                    const totalCostEl = content.querySelector('.total-cost-print');
                    if (totalCostEl) totalCostEl.remove();
                    
                    let printHTML = content.innerHTML;
                    
                    // Append table to the print out if it exists and is visible
                    const tableSection = document.getElementById(`${tabId}-table-section`);
                    if (tableSection && !tableSection.classList.contains('hidden')) {
                        const clonedTable = tableSection.cloneNode(true);
                        
                        // Clean up the table for printing (remove buttons, swipe indicators)
                        clonedTable.querySelectorAll('button').forEach(btn => btn.remove());
                        clonedTable.querySelectorAll('.swipe-indicator').forEach(el => el.remove());
                        
                        // Remove overflow properties so full table prints
                        clonedTable.querySelectorAll('.overflow-x-auto').forEach(el => {
                            el.classList.remove('overflow-x-auto', 'custom-scrollbar');
                        });
                        
                        printHTML += `
                            <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 2px solid #e5e7eb;">
                                ${clonedTable.innerHTML}
                            </div>
                        `;
                    }
                    
                    exportToPDF(printHTML, title);
                }
                
                if (exportCsvBtn) {
                    exportToCSV(exportCsvBtn.closest('.result-card'));
                }
                
                if (saveHistoryBtn) {
                    saveToHistory(saveHistoryBtn.closest('.tab-content').id, getActiveFormInputValues());
                    const originalText = saveHistoryBtn.innerHTML;
                    saveHistoryBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4 mr-1"></i>';
                    saveHistoryBtn.classList.add('btn-success');
                    setTimeout(() => {
                        saveHistoryBtn.innerHTML = originalText;
                        saveHistoryBtn.classList.remove('btn-success');
                        window.lucide?.createIcons?.();
                    }, 2000);
                }
            });

            ['concrete', 'blocks', 'bricks', 'steel', 'earthwork'].forEach(type => {
                const clearBtn = document.getElementById(`clear-${type}-table`);
                if(clearBtn) {
                    clearBtn.addEventListener('click', () => {
                        sessionResults[type] = [];
                        renderSessionTable(type);
                    });
                }
            });

            /* CALCULATORS */

            /* ---- Lazy calculator chunks: each calc-*.js registers
               window.__calcHandlers.<name>; loaded on tool open / first Calculate. ---- */
            const calcCtx = { translations, fill, getCementBagMass, getCurrency, getWastageFactor, renderSessionTable, showError, sessionResults, lastCalcData, errorBox };
            const calcPending = {};
            const loadCalc = (name) => {
                window.__calcHandlers = window.__calcHandlers || {};
                if (window.__calcHandlers[name]) return Promise.resolve();
                if (!calcPending[name]) {
                    calcPending[name] = new Promise((resolve, reject) => {
                        const script = document.createElement('script');
                        script.src = `./calc-${name}.js`;
                        script.onload = resolve;
                        script.onerror = reject;
                        document.head.appendChild(script);
                    });
                }
                return calcPending[name];
            };
            window.__loadCalc = loadCalc;
            ['concrete', 'blocks', 'bricks', 'steel', 'earthwork'].forEach((name) => {
                const button = document.getElementById(`calculate-${name}`);
                if (!button) return;
                button.addEventListener('click', () => {
                    const run = () => window.__calcHandlers?.[name]?.(calcCtx);
                    if (window.__calcHandlers?.[name]) run();
                    else loadCalc(name).then(run).catch(() => showError(translations[localStorage.getItem('language') || 'en'].errRequiredFields));
                });
            });

            /* ===== Language switch: relabel everything that was generated at
               calculate time. Session tables and history re-render from stored
               data; an open result is re-calculated in the new language (its
               session row is not duplicated, and no auto-scroll). ===== */
            document.addEventListener('app:lang', () => {
                ['concrete', 'blocks', 'bricks', 'steel', 'earthwork'].forEach(type => {
                    if (sessionResults[type] && sessionResults[type].length) renderSessionTable(type);
                });
                if (calculationHistory.length) renderHistory();
                const active = document.querySelector('.tab-content:not(.hidden)');
                if (!active) return;
                const res = document.getElementById(`${active.id}-result`);
                if (res && !res.classList.contains('hidden')) {
                    window.__langRecalc = true;
                    setTimeout(() => { window.__langRecalc = false; }, 450);
                    const btn = document.getElementById(`calculate-${active.id}`);
                    if (btn) btn.click();
                }
            });

            /* ===== Data backup / restore (JSON) ===== */
            const backupBtnEl = document.getElementById('backup-btn');
            const restoreBtnEl = document.getElementById('restore-btn');
            const restoreFileEl = document.getElementById('restore-file');
            const flashBtn = (btn, key) => {
                const span = btn.querySelector('span');
                const original = span.textContent;
                span.textContent = translations[localStorage.getItem('language') || 'en'][key];
                setTimeout(() => { span.textContent = original; }, 2400);
            };
            const collectBackup = () => ({
                app: 'material-estimator',
                version: 1,
                savedAt: new Date().toISOString(),
                language: localStorage.getItem('language') || 'en',
                theme: localStorage.getItem('theme') || 'light',
                introSeen: localStorage.getItem('introSeen') || '',
                settings: {
                    wastage: document.getElementById('wastage').value,
                    currency: document.getElementById('currency').value,
                    customCurrency: document.getElementById('custom-currency')?.value || '',
                    exchangeRate: document.getElementById('exchange-rate')?.value || '',
                    cementBagMass: document.getElementById('cement-bag-mass')?.value || '50'
                },
                projectMeta: JSON.parse(localStorage.getItem('estimatorProjectMeta') || '{}'),
                projects: JSON.parse(localStorage.getItem('estimatorProjects') || '{}'),
                history: JSON.parse(localStorage.getItem('calculationHistory') || '[]'),
                sessions: JSON.parse(JSON.stringify(sessionResults))
            });
            if (backupBtnEl) backupBtnEl.addEventListener('click', () => {
                const data = collectBackup();
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `material-estimator-backup-${data.savedAt.slice(0, 10)}.json`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => URL.revokeObjectURL(url), 1500);
                flashBtn(backupBtnEl, 'backupDone');
            });
            if (restoreBtnEl && restoreFileEl) {
                restoreBtnEl.addEventListener('click', () => restoreFileEl.click());
                restoreFileEl.addEventListener('change', () => {
                    const file = restoreFileEl.files && restoreFileEl.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                        let data = null;
                        try { data = JSON.parse(reader.result); } catch (e) { data = null; }
                        if (!data || typeof data !== 'object' || Array.isArray(data) || data.app !== 'material-estimator') {
                            showError(translations[localStorage.getItem('language') || 'en'].restoreInvalid);
                            restoreFileEl.value = '';
                            return;
                        }
                        if (data.language) {
                            localStorage.setItem('language', data.language);
                            const langSel = document.getElementById('language-selector');
                            if (langSel) langSel.value = data.language;
                            changeLanguage(data.language);
                        }
                        if (data.theme) { localStorage.setItem('theme', data.theme); setTheme(data.theme === 'dark' ? 'dark' : 'light'); }
                        if (data.introSeen) localStorage.setItem('introSeen', '1');
                        const st = data.settings || {};
                        const setVal = (id, v) => { const el = document.getElementById(id); if (el && v !== undefined && v !== null) el.value = v; };
                        setVal('wastage', st.wastage);
                        setVal('currency', st.currency);
                        setVal('custom-currency', st.customCurrency);
                        setVal('exchange-rate', st.exchangeRate);
                        setVal('cement-bag-mass', st.cementBagMass);
                        if (data.projectMeta && typeof data.projectMeta === 'object') {
                            localStorage.setItem('estimatorProjectMeta', JSON.stringify(data.projectMeta));
                            projectFieldIds.forEach(id => {
                                const el = document.getElementById(id);
                                if (el && data.projectMeta[id] !== undefined) el.value = data.projectMeta[id];
                            });
                        }
                        if (data.projects && typeof data.projects === 'object' && !Array.isArray(data.projects)) {
                            projects = data.projects;
                            localStorage.setItem('estimatorProjects', JSON.stringify(projects));
                        }
                        if (Array.isArray(data.history)) {
                            calculationHistory = data.history;
                            localStorage.setItem('calculationHistory', JSON.stringify(calculationHistory));
                            renderHistory();
                        }
                        if (data.sessions && typeof data.sessions === 'object') {
                            ['concrete', 'blocks', 'bricks', 'steel', 'earthwork'].forEach(type => {
                                if (Array.isArray(data.sessions[type])) sessionResults[type] = data.sessions[type];
                                renderSessionTable(type);
                            });
                        }
                        flashBtn(restoreBtnEl, 'restoreDone');
                        restoreFileEl.value = '';
                    };
                    reader.readAsText(file);
                });
            }

            /* ===== BRC mesh piece-size defaults per selling unit ===== */
            const brcModeEl = document.getElementById('brc-mode');
            if (brcModeEl) brcModeEl.addEventListener('change', () => {
                const w = document.getElementById('brc-width'), l = document.getElementById('brc-length');
                if (!w || !l) return;
                if (brcModeEl.value === 'sheet') { w.value = '4.8'; l.value = '2.4'; }
                else { w.value = '2.0'; l.value = '20'; }
            });

            /* ===== Blocks: mortar vs thin-bed glue joints ===== */
            const blockJointTypeEl = document.getElementById('block-joint-type');
            const blockGlueFieldsEl = document.getElementById('block-glue-fields');
            const blockMortarFieldsEl = document.getElementById('block-mortar-fields');
            const blockJointWrapEl = document.getElementById('block-joint-type-wrap');
            const updateBlockJointVisibility = () => {
                const include = document.getElementById('block-include-mortar')?.checked;
                const glue = blockJointTypeEl?.value === 'glue';
                if (blockJointWrapEl) blockJointWrapEl.classList.toggle('hidden', !include);
                if (blockGlueFieldsEl) blockGlueFieldsEl.classList.toggle('hidden', !(include && glue));
                if (blockMortarFieldsEl) blockMortarFieldsEl.classList.toggle('hidden', !(include && !glue));
            };
            if (blockJointTypeEl) blockJointTypeEl.addEventListener('change', () => {
                if (blockJointTypeEl.value === 'glue') {
                    const th = document.getElementById('block-mortar-thickness');
                    if (th) th.value = '3';
                }
                updateBlockJointVisibility();
            });
            document.getElementById('block-include-mortar')?.addEventListener('change', updateBlockJointVisibility);
            updateBlockJointVisibility();

            /* ===== Concrete grade note under the mix-ratio select ===== */
            const concreteRatioEl = document.getElementById('concrete-ratio');
            const concreteGradeNoteEl = document.getElementById('concrete-grade-note');
            const gradeNoteKey = { '1:3:6': 'gradeNoteC15', '1:2:4': 'gradeNoteC20', '1:1.5:3': 'gradeNoteC25' };
            const updateGradeNote = () => {
                if (!concreteRatioEl || !concreteGradeNoteEl) return;
                const key = gradeNoteKey[concreteRatioEl.value] || 'gradeNoteC20';
                concreteGradeNoteEl.setAttribute('data-lang', key);
                setLangText(concreteGradeNoteEl, translations[localStorage.getItem('language') || 'en'][key]);
            };
            if (concreteRatioEl) concreteRatioEl.addEventListener('change', updateGradeNote);
            updateGradeNote();

            /* ===== Land area converter (m² / dunum / olak) ===== */
            const landValueEl = document.getElementById('land-area-value');
            const landUnitEl = document.getElementById('land-area-unit');
            const updateLandConverter = () => {
                if (!landValueEl || !landUnitEl) return;
                const v = parseFloat(landValueEl.value);
                const out = (id, val) => { const el = document.getElementById(id); if (el) el.value = Number.isFinite(val) ? String(Math.round(val * 10000) / 10000) : ''; };
                if (!Number.isFinite(v) || v < 0) { out('land-out-m2', NaN); out('land-out-dunum', NaN); out('land-out-olak', NaN); return; }
                const m2 = landUnitEl.value === 'dunum' ? v * 2500 : landUnitEl.value === 'olak' ? v * 100 : v;
                out('land-out-m2', m2);
                out('land-out-dunum', m2 / 2500);
                out('land-out-olak', m2 / 100);
            };
            if (landValueEl) {
                landValueEl.addEventListener('input', updateLandConverter);
                landValueEl.addEventListener('change', updateLandConverter);
            }
            if (landUnitEl) {
                landUnitEl.addEventListener('input', updateLandConverter);
                landUnitEl.addEventListener('change', updateLandConverter);
            }

            /* ===== Client quote (printable A4) ===== */
            const quoteMetaKey = 'estimatorQuoteMeta';
            const quotePriceKey = 'estimatorQuotePrices';
            const quoteOverlay = document.getElementById('quote-overlay');
            const quoteCurrency = () => { try { return getCurrency(); } catch (e) { return ''; } };
            const quoteQtyNumber = (txt) => {
                const m = String(txt).match(/\d+(?:[.,]\d+)?/);
                return m ? parseFloat(m[0].replace(',', '.')) : null;
            };
            let quoteLinesState = [];
            const renderQuoteTotals = () => {
                let total = 0;
                quoteLinesState.forEach((ln, i) => {
                    const qn = quoteQtyNumber(ln.qty);
                    const amount = (ln.price !== null && ln.price !== undefined && qn !== null) ? ln.price * qn : null;
                    const cell = document.getElementById(`quote-amount-${i}`);
                    if (cell) cell.textContent = amount === null ? '—' : `${quoteCurrency()}${amount.toFixed(2)}`;
                    if (amount !== null) total += amount;
                });
                const tEl = document.getElementById('quote-total');
                if (tEl) tEl.textContent = `${quoteCurrency()}${total.toFixed(2)}`;
            };
            const openQuote = (type) => {
                const T = translations[localStorage.getItem('language') || 'en'];
                const data = lastCalcData && lastCalcData[type];
                const lines = data && Array.isArray(data.quoteLines) ? data.quoteLines : [];
                if (!lines.length) { showError(T.quoteNoItems); return; }
                const savedPrices = JSON.parse(localStorage.getItem(quotePriceKey) || '{}');
                const meta = JSON.parse(localStorage.getItem(quoteMetaKey) || '{}');
                ['project', 'client', 'contractor', 'contact', 'notes'].forEach(f => {
                    const el = document.getElementById(`quote-${f}`);
                    if (el) el.value = meta[f] || '';
                });
                const dateEl = document.getElementById('quote-date-val');
                if (dateEl) dateEl.textContent = new Date().toLocaleDateString();
                const tbody = document.getElementById('quote-items');
                tbody.innerHTML = '';
                quoteLinesState = lines.map((ln, i) => {
                    const remembered = savedPrices[`${type}:${i}`];
                    return {
                        item: ln.item, qty: ln.qty,
                        price: remembered !== undefined ? remembered : (ln.unitPrice === undefined ? null : ln.unitPrice)
                    };
                });
                quoteLinesState.forEach((ln, i) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td class="quote-item"></td><td class="quote-qty"></td><td><input type="number" min="0" step="0.01" class="quote-input quote-price"></td><td class="quote-amount"></td>`;
                    tr.querySelector('.quote-item').textContent = ln.item;
                    tr.querySelector('.quote-qty').textContent = ln.qty;
                    const priceInput = tr.querySelector('input');
                    priceInput.value = (ln.price === null || ln.price === undefined) ? '' : ln.price;
                    priceInput.addEventListener('input', () => {
                        const v = priceInput.value.trim();
                        quoteLinesState[i].price = v === '' ? null : Number(v);
                        const saved = JSON.parse(localStorage.getItem(quotePriceKey) || '{}');
                        saved[`${type}:${i}`] = quoteLinesState[i].price;
                        localStorage.setItem(quotePriceKey, JSON.stringify(saved));
                        renderQuoteTotals();
                    });
                    tbody.appendChild(tr);
                });
                renderQuoteTotals();
                quoteOverlay.classList.remove('hidden');
                quoteOverlay.setAttribute('aria-hidden', 'false');
                if (window.lucide) window.lucide.createIcons();
            };
            document.addEventListener('click', (e) => {
                const btn = e.target.closest && e.target.closest('.quote-btn');
                if (!btn) return;
                const res = btn.closest('[id$="-result"]');
                openQuote(res ? res.id.replace('-result', '') : '');
            });
            ['project', 'client', 'contractor', 'contact', 'notes'].forEach(f => {
                const el = document.getElementById(`quote-${f}`);
                if (!el) return;
                el.addEventListener('input', () => {
                    const meta = JSON.parse(localStorage.getItem(quoteMetaKey) || '{}');
                    meta[f] = el.value;
                    localStorage.setItem(quoteMetaKey, JSON.stringify(meta));
                });
            });
            document.getElementById('quote-close-btn')?.addEventListener('click', () => {
                quoteOverlay.classList.add('hidden');
                quoteOverlay.setAttribute('aria-hidden', 'true');
            });
            document.getElementById('quote-print-btn')?.addEventListener('click', () => {
                document.body.classList.add('printing-quote');
                window.print();
                setTimeout(() => document.body.classList.remove('printing-quote'), 800);
            });
            window.addEventListener('afterprint', () => document.body.classList.remove('printing-quote'));
            document.getElementById('quote-whatsapp-btn')?.addEventListener('click', async () => {
                const T = translations[localStorage.getItem('language') || 'en'];
                const fieldVal = (id) => (document.getElementById(id)?.value || '').trim();
                const lines = [`*${T.quoteTitle}*`];
                const dateV = (document.getElementById('quote-date-val')?.textContent || '').trim();
                if (dateV) lines.push(`${T.quoteDateLabel}: ${dateV}`);
                if (fieldVal('quote-project')) lines.push(`${T.quoteProject}: ${fieldVal('quote-project')}`);
                if (fieldVal('quote-client')) lines.push(`${T.quoteClient}: ${fieldVal('quote-client')}`);
                if (fieldVal('quote-contractor')) lines.push(`${T.quoteContractor}: ${fieldVal('quote-contractor')}`);
                if (fieldVal('quote-contact')) lines.push(`${T.quoteContact}: ${fieldVal('quote-contact')}`);
                lines.push('');
                quoteLinesState.forEach(ln => {
                    const qn = quoteQtyNumber(ln.qty);
                    const hasPrice = ln.price !== null && ln.price !== undefined;
                    const amount = hasPrice && qn !== null ? ln.price * qn : null;
                    const priceTxt = hasPrice ? ` \u00d7 ${quoteCurrency()}${ln.price}` : '';
                    const amountTxt = amount === null ? '' : ` = ${quoteCurrency()}${amount.toFixed(2)}`;
                    lines.push(`\u2022 ${ln.item}: ${ln.qty}${priceTxt}${amountTxt}`);
                });
                lines.push('');
                lines.push(`${T.quoteTotalLabel}: ${(document.getElementById('quote-total')?.textContent || '').trim()}`);
                if (fieldVal('quote-notes')) lines.push(`${T.quoteNotesLabel}: ${fieldVal('quote-notes')}`);
                const text = lines.join('\n');
                try {
                    if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(text);
                } catch (e) { /* clipboard unavailable — WhatsApp still opens with the text */ }
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                const span = document.querySelector('#quote-whatsapp-btn span');
                if (span) {
                    const orig = span.textContent;
                    span.textContent = T.quoteWhatsappDone;
                    setTimeout(() => { span.textContent = orig; }, 2000);
                }
            });

            /* ===== Guided first-run intro ===== */
            const introOverlay = document.getElementById('intro-overlay');
            if (introOverlay && !localStorage.getItem('introSeen')) {
                introOverlay.classList.remove('hidden');
                let introSlide = 0;
                const slides = introOverlay.querySelectorAll('.intro-slide');
                const dots = introOverlay.querySelectorAll('.intro-dot');
                const introNext = document.getElementById('intro-next');
                const introStart = document.getElementById('intro-start');
                const showSlide = (i) => {
                    slides.forEach((sl, k) => sl.classList.toggle('is-active', k === i));
                    dots.forEach((dt, k) => dt.classList.toggle('is-active', k === i));
                    if (i >= slides.length - 1) { introNext.classList.add('hidden'); introStart.classList.remove('hidden'); }
                };
                introNext.addEventListener('click', () => { introSlide = Math.min(introSlide + 1, slides.length - 1); showSlide(introSlide); });
                introStart.addEventListener('click', () => {
                    localStorage.setItem('introSeen', '1');
                    introOverlay.classList.add('hidden');
                });
            }

            /* ===== Field hints: tap ? to show a plain explanation ===== */
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('.hint-btn');
                if (!btn) return;
                const wrap = btn.closest('.label-with-hint');
                const hint = wrap && wrap.nextElementSibling;
                if (hint && hint.classList.contains('field-hint')) hint.classList.toggle('hidden');
            });

            /* ===== Sanity warnings: unusual values are flagged, not blocked ===== */
            const collectSanity = () => {
                const active = document.querySelector('.tab-content:not(.hidden)');
                const T = translations[localStorage.getItem('language') || 'en'];
                if (!active) return;
                document.querySelectorAll('.sanity-banner').forEach(b => b.remove());
                const warnings = [];
                active.querySelectorAll('input[data-sane]').forEach(inp => {
                    if (inp.closest('.hidden')) return;
                    if (inp.value === '' || !Number.isFinite(Number(inp.value))) return;
                    const [lo, hi, unit] = inp.dataset.sane.split(':');
                    const v = Number(inp.value), L = Number(lo), H = Number(hi);
                    if (v < L || v > H) {
                        const labelEl = (inp.id && active.querySelector(`label[for="${inp.id}"]`)) ||
                                        (inp.closest('div') && inp.closest('div').querySelector('label'));
                        const label = labelEl ? labelEl.textContent.trim() : inp.id;
                        warnings.push(`${label}: ${inp.value}${unit ? ' ' + unit : ''} — ${T.sanityUnusual} (${lo}–${hi}${unit ? ' ' + unit : ''})`);
                    }
                });
                if (!warnings.length) return;
                const banner = document.createElement('div');
                banner.className = 'sanity-banner';
                banner.setAttribute('role', 'status');
                banner.innerHTML = `<strong>${T.sanityIntro}</strong><ul>${warnings.map(w => `<li>${w}</li>`).join('')}</ul>`;
                const resultDiv = document.getElementById(`${active.id}-result`);
                if (resultDiv) resultDiv.parentNode.insertBefore(banner, resultDiv);
            };
            document.addEventListener('click', (e) => {
                if (e.target.closest('[id^="calculate-"], #mobile-calculate')) collectSanity();
            }, true);

            /* ===== Steel: fill typical values (assumptions only — never your measurements) ===== */
            const steelPresets = {
                footing: () => {
                    const mode = document.querySelector('input[name="footing-mode"][value="spacing"]');
                    if (mode && !mode.checked) { mode.checked = true; mode.dispatchEvent(new Event('change')); }
                    setVal('footing-spacing-len', 150); setVal('footing-spacing-wid', 150);
                    setSel('footing-diameter-len', 12); setSel('footing-diameter-wid', 12);
                },
                slab: () => {
                    const mode = document.querySelector('input[name="slab-mode"][value="spacing"]');
                    if (mode && !mode.checked) { mode.checked = true; mode.dispatchEvent(new Event('change')); }
                    setVal('slab-spacing-len', 150); setVal('slab-spacing-wid', 150);
                    setSel('slab-diameter-len', 10); setSel('slab-diameter-wid', 10);
                },
                beam: () => {
                    setChk('beam-include-stirrups', true);
                    setVal('beam-stirrup-spacing', 200); setVal('beam-cover', 40); setSel('beam-stirrup-diameter', 8);
                    if (!getVal('beam-diameter')) setSel('beam-diameter', 16);
                },
                column: () => {
                    setChk('column-include-stirrups', true);
                    setVal('column-stirrup-spacing', 200); setVal('column-cover', 40); setSel('column-stirrup-diameter', 8);
                    if (!getVal('column-diameter')) setSel('column-diameter', 16);
                },
                one_way: () => { setVal('one-way-spacing', 150); setSel('one-way-diameter', 10); },
                custom: () => {}
            };
            function setVal(id, v) { const el = document.getElementById(id); if (el) el.value = String(v); }
            function setSel(id, v) { const el = document.getElementById(id); if (el) { el.value = String(v); el.dispatchEvent(new Event('change')); } }
            function setChk(id, on) { const el = document.getElementById(id); if (el) { el.checked = on; el.dispatchEvent(new Event('change')); } }
            function getVal(id) { const el = document.getElementById(id); return el ? el.value : ''; }
            const steelPresetBtn = document.getElementById('steel-preset-btn');
            if (steelPresetBtn) steelPresetBtn.addEventListener('click', () => {
                const el = document.getElementById('steel-element-selector')?.value;
                if (el && steelPresets[el]) steelPresets[el]();
            });

            /* ===== REPRODUCIBLE RESULT TRAILS ===== */
            const trailText = {
                concrete: () => { const T=translations[localStorage.getItem('language')||'en']; const mode=document.querySelector('input[name="concrete-mode"]:checked')?.value; const l=document.getElementById('concrete-length')?.value||'—', w=document.getElementById('concrete-width')?.value||'—', t=document.getElementById('concrete-thickness')?.value||'—', v=document.getElementById('concrete-total-volume')?.value||'—', q=document.getElementById('concrete-quantity')?.value||'1', ratio=document.getElementById('concrete-ratio')?.value||'—', waste=document.getElementById('wastage')?.value||'0'; return `${T.trailInputs}: ${mode==='volume'?`${T.trailTotalVolumeWord} ${v} m³`:`${l} × ${w} × ${t} m`}${q!=='1'?` × ${q} ${T.trailElements}`:''}. ${T.trailMixRatioWord}: ${ratio}. ${T.trailWasteWord}: ${waste}%. ${T.trailAssumptionNominal}`; },
                blocks: () => { const T=translations[localStorage.getItem('language')||'en']; const mode=document.querySelector('input[name="block-mode"]:checked')?.value; const v=document.getElementById('block-wall-volume')?.value||'—', th=document.getElementById(mode==='volume'?'block-volume-wall-thickness':'block-wall-width-input')?.value||'—', leaves=document.getElementById(mode==='volume'?'block-volume-leaves':'block-leaves')?.value||'—'; return `${T.trailModeWord}: ${mode==='volume'?T.trailTotalWallVolumeMode:T.trailWallDimsMode}. ${T.trailWallVolume}: ${v} m³. ${T.trailWallThickness}: ${th} m; ${T.trailLeaves}: ${leaves}. ${T.trailFaceAreaNote}`; },
                bricks: () => { const T=translations[localStorage.getItem('language')||'en']; const mode=document.querySelector('input[name="brick-mode"]:checked')?.value; const v=document.getElementById('brick-wall-volume')?.value||'—', th=document.getElementById(mode==='volume'?'brick-volume-wall-thickness':'brick-wall-width-input')?.value||'—', leaves=document.getElementById(mode==='volume'?'brick-volume-leaves':'brick-leaves')?.value||'—'; return `${T.trailModeWord}: ${mode==='volume'?T.trailTotalWallVolumeMode:T.trailWallDimsMode}. ${T.trailWallVolume}: ${v} m³. ${T.trailWallThickness}: ${th} m; ${T.trailLeaves}: ${leaves}. ${T.trailFaceAreaNote}`; },
                steel: () => translations[localStorage.getItem('language')||'en'].trailSteelNote,
                earthwork: () => { const T=translations[localStorage.getItem('language')||'en']; const l=document.getElementById('earthwork-length')?.value||'—', w=document.getElementById('earthwork-width')?.value||'—', h=document.getElementById('earthwork-height')?.value||'—', q=document.getElementById('earthwork-quantity')?.value||'—', swell=document.getElementById('earthwork-swell')?.value||'0', cap=document.getElementById('earthwork-truck-capacity')?.value||'—'; return `${T.trailGrossVolume}: ${l} × ${w} × ${h} × ${q} m³. ${T.trailSwell}: ${swell}%. ${T.trailTruckCapacity}: ${cap} m³. ${T.trailEarthNote}`; }
            };
            ['concrete','blocks','bricks','steel','earthwork'].forEach(type => { const target=document.getElementById(`${type}-result`); if (!target) return; const addTrail=()=>{ if (target.classList.contains('hidden') || target.querySelector('.calculation-trail') || target.querySelector('.result-more')) return; const d=document.createElement('details'); d.className='calculation-trail card p-3 mt-3 text-sm text-start'; d.innerHTML=`<summary class="font-semibold">${translations[localStorage.getItem('language')||'en'].calculationDetails}</summary><p class="mt-2">${trailText[type]()}</p>`; target.querySelector('.result-card')?.appendChild(d); }; new MutationObserver(addTrail).observe(target,{childList:true,subtree:true,attributes:true,attributeFilter:['class']}); });
        });
