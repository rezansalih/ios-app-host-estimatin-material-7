# Formula Audit — Construction Material Estimator
*October 2026 · every material, every formula, checked against standard methods*

Each formula below was read from the shipped source, checked against the standard engineering
method, and verified numerically (hand calculation AND live test against the real calculator).

---

## 1. Concrete

| Quantity | App formula | Standard method | Verdict |
|---|---|---|---|
| Wet volume | L × W × T × qty | geometric | ✅ |
| Dry volume | wet × dry-factor (1.54 default) | dry = wet × 1.54 (voids) | ✅ |
| Cement volume | dry × 1/(1+a+b) for ratio 1:a:b | absolute-volume method | ✅ |
| Sand / aggregate | dry × a/sum, dry × b/sum | absolute-volume method | ✅ |
| Cement weight | cement volume × density (1440 kg/m³) | loose density | ✅ |
| Wastage | weight × (1 + waste%) — applied once | — | ✅ |
| Cement bags | ceil(with-wastage ÷ bag kg) | order whole bags | ✅ |
| **Verified** | 5×4×0.2 slab, 1:2:4, 1.54, 1440, 50 kg, 5% | wet 4 → dry 6.16 → **27 bags** | ✅ matches hand math |
| **Verified** | 1 m³ of 1:2:4 | 7 bags · 0.44 m³ sand · 0.88 m³ gravel — the published figures | ✅ |
| Approved recipe | per-m³ kg × wet volume, waste on top | lab mix sheet | ✅ |
| Formwork — slab edges | (2L + 2W) × T × qty | perimeter × slab thickness | ✅ |
| Formwork — column | (2w + 2t) × height × qty | full perimeter | ✅ |
| Formwork — beam | (b + 2d) × L × qty | soffit + 2 sides (top open) | ✅ |
| Soffit (suspended slab) | L × W × qty | underside | ✅ |
| **Verified live** | slab 5×4×0.2 ×2, suspended | edges **7.20 m²** + soffit **40.00 m²** | ✅ |
| Mixing water | 0.6 L per kg cement batched | 0.55–0.65 L/kg rule | ✅ |
| Costs | bags × bag price; m³ × m³ price; m² formwork | — | ✅ |

## 2. Blocks & Bricks (masonry)

| Quantity | App formula | Standard method | Verdict |
|---|---|---|---|
| Wall volume | L × H × thickness; openings = Σ(w×h×thickness) deducted | geometric | ✅ |
| Unit face area | (length + joint) × (height + joint) | modular face with joints | ✅ |
| Units needed | (wall volume ÷ thickness ÷ unit face) × leaves | face-area method | ✅ |
| **Verified** | 6 m³ block wall (40×20×20, 1 cm joints) | **366 blocks** (11.6/m² with joints; 12.5/m² bare) | ✅ |
| **Verified** | 3.45 m³ brick wall (24×11.5×7.5) | **1483 bricks**; face rate **47.06/m²** | ✅ |
| Mortar volume | wall volume − (units × unit volume) | volume method | ✅ |
| **Verified** | brick wall above | mortar 0.528 m³ = 15.3% joint fraction (exact) | ✅ |
| Dry mortar | wet × dry factor (1.33 default) | dry shrinkage | ✅ |
| Cement / sand | dry × 1/(1+ratio) × density; sand × ratio part | 1:6 typical mortar | ✅ |
| **Verified** | 6 m³ wall, 1:6, 1440, 50 kg, 5% | 122.1 kg → **3 bags**; sand **0.509 m³** | ✅ |
| Wastage | applied once (to wet mortar / units) | — | ✅ |
| Mixing water | 0.6 L per kg cement | masonry gauging | ✅ |
| Wall leaves check | implied thickness vs wall ±11 mm, hard error | prevents silent mismatch | ✅ |

## 3. Steel

| Quantity | App formula | Standard method | Verdict |
|---|---|---|---|
| Bar weight | D²/162 kg per metre | ρ = 7850: π/4·D²·7850 = D²/162.2 | ✅ |
| Bars from spacing | ceil(dimension ÷ spacing) + 1 | centres convention | ✅ |
| **Verified** | 3×2 m footing, @150 both ways | 15 + 21 bars → **69.22 kg** (spacing mode = number mode) | ✅ |
| Lap overlap | O = lap-factor × D (50d default) | 40–60d standard; 50d typical | ✅ |
| Splices per run | ceil((L−O) ÷ (S−O)) − 1, S = shop bar | exact stock-bar algebra | ✅ |
| Order length | L + splices × O per run | overlap consumes stock | ✅ |
| **Verified** | 20 m run, 2×Ø12, 12 m stock, 50d | 2 splices, 1.20 m added, **38.45 kg** | ✅ |
| Shop-bar count | ceil(total metres ÷ shop bar length) | order by 12 m bars | ✅ |
| Stirrup cutting length | 2(w−2c) + 2(d−2c) + 2×10d hooks | centre-line + hook allowance | ✅ |
| Stirrup count | ceil(L ÷ spacing) + 1 | centres convention | ✅ |
| **Verified** | 3×0.3×0.5 beam, cover 40, Ø8@200 + 4Ø16 | 1.44 m × 16 = 23.04 m → total **29.47 kg** | ✅ |
| One-way strip | (ceil(dist÷spacing)+1) × bar length | distributed bars | ✅ |
| **Verified** | 6 m @200, 5 m bars Ø10 | 31 bars → **100.46 kg** | ✅ |
| Custom rows | Σ count × length × D²/162 × waste | direct | ✅ |
| Member quantity | multiplies every element type | fixed this release (was beams/columns only) | ✅ |
| Wastage | × once on all weights | — | ✅ |

*Anchorage, hooks on main bars, bends and cutting-list optimization remain outside the model — the
in-app calculation note says so on every steel result.*

## 4. Earthwork

| Quantity | App formula | Standard method | Verdict |
|---|---|---|---|
| Bank volume | L × W × H × qty | geometric | ✅ |
| Loose volume | bank × (1 + swell%) | swell bulking | ✅ |
| Truck loads | ceil(loose ÷ capacity) | load count | ✅ |
| **Verified** | 5×4×1 m, 25% swell, 4 m³ truck | 20 → 25 m³ → **7 loads** | ✅ |

## 5. Defects found and fixed in this audit

1. **"undefined" element name for One-way steel** — the result title and session row showed
   `(undefined)` because the translation key is `oneWay` but the code looked up `one_way`.
   Fixed; regression-tested ("element name is not undefined").
2. **Hardcoded English "bags"** in three result locations (blocks, bricks, and the concrete
   price trail) stayed "bags" in Arabic/Kurdish screens. Now uses the translated word.
3. **Blocks mortar trail** did not reconcile the displayed mortar with the wasted cement/sand.
   It now shows "net → to batch (waste)" like bricks.

## 6. Guards that keep it correct

- `tests/calculations.test.js` — independent hand-verified vectors for every branch above
  (27 bags, 366 blocks, 1483 bricks, 69.22/38.45/29.47/100.46 kg steel, 7 truck loads …)
  plus source guards (no hardcoded "bags"; block widths in metres / brick widths in mm must
  stay consistent with their handlers; the old invalid m³+m² formula must never return).
- `tests/full-ui-check.js` D2/D6 — the same vectors run against the real UI calculators.
- The wall-leaf thickness check turns a size mismatch into a hard error instead of a silent
  wrong count.

**Conclusion: all formulas are the standard methods and all checked results are correct.**
The estimates intentionally exclude anchorage/hooks on main bars, slopes, compaction and
stock-cutting optimization — each is stated in the in-app calculation notes.
