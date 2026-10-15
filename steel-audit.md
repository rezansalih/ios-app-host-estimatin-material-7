# Steel Calculator — Full Audit (every element)

Date: 15 October 2026. Scope: the Steel tool only (form, labels in 4 languages, math, results, session table, menu card).

---

## 1. Complete element inventory (what is on the screen today)

### Menu card
| Element | Text (EN) | Verdict |
|---|---|---|
| Card title | "Steel" (`tabSteel`) | OK |
| Card description | "Bar bending schedules and weights" (`homeSteelDesc`) | **Overpromise** — the tool has no bar bending schedule. Same in KU/KS/AR ("بەرناما چەماندنا شیشان…", "جدول تسليح…"). |

### Calculator screen
| # | Element | What it does | Verdict |
|---|---|---|---|
| 1 | Title "Structural Steel Calculator" | — | **Misleading EN term** — "structural steel" means IPE/channels; this tool estimates **rebar** (KU/AR say "شیش/حديد التسليح" which is correct). EN should be "Rebar Calculator". |
| 2 | Card "1. General Settings" heading | — | Noisy numbered wizard ("1. 2. 3.") on a single-screen app. |
| 3 | **Lap Splice checkbox** ("Include Lap Splice Calculation") | Toggles lap fields | **Not necessary as the first thing on screen** — advanced concept (50d, splices) shown before you even choose what you are estimating. Default is off, but it occupies prime space and confuses non-engineers. |
| 4 | Standard Bar Length (m) = 12 | For lap math | Keep, but inside the lap section (hidden until wanted). |
| 5 | Lap Splice Factor (e.g., 50d) = 50 | Lap length = 50×Ø | Keep with #4. |
| 6 | "Select Structural Element" dropdown: Footing / Slab / Beam / Column / **One-Way Reinforcement** | Picks the form | Keep. "One-Way Reinforcement" is jargon → "One-way slab / strip". |
| 7 | "Member quantity" input | Should multiply results | **BUG: label is hardcoded English (no `data-lang`, no translation key in any language) AND the value is ignored in the math for Footing / Slab / One-way** — only Beam/Column multiply by it. |
| 8 | Card "2. Element Details" | Dynamic per element | Keep. |
| 8a | Footing & Slab: "Calculate By [Spacing / Number of Bars]" | Mode toggle | Keep — genuinely useful. |
| 8b | Footing & Slab: Length + Width (m) | Plan size | Keep. |
| 8c | "Bars parallel to Length" + "Bars parallel to Width" groups (Spacing+Ø or Count+Ø) | Two directions of the mesh | Keep, but wording is technical → "Bars along the length / along the width". |
| 8d | Beam: "Main Bars" (Length, Number of Bars, Ø) | Long bars | Keep. |
| 8e | Beam/Column: "Include Stirrups" + Width, Depth, Cover (40mm), Spacing, Ø | Ties/stirrups | Keep. Cover default 40 mm is helpful. |
| 8f | Column: "Column Height (m)" + count + Ø | Vertical bars | Keep (heading shows "Main Bars"; HTML default says "Vertical Bars" — minor inconsistency). |
| 8g | One-way: Distribution Length, Single Bar Length, Spacing, Ø | Single-direction bars | Keep (see rename in #6). |
| 9 | Diameter dropdowns (all of them) | 10, 12, 16, 18, 20, 22 | **Missing Ø8 (the standard tie/stirrup size in Iraq!), Ø14, and Ø25/28/32 for foundations.** Practical gap. |
| 10 | Card "3. Costing (Optional)" collapsed → "Cost per kg" | Price | Keep — good as optional. |
| 11 | Project settings row (wastage + currency) | Shared | Keep. |
| 12 | Calculate / Reset (sticky) | — | Keep. |
| 13 | Result: "Steel Estimation Result (Element)" + Save/CSV/PDF | Exports | Keep. |
| 14 | Result blocks: Number of Bars (Ø…) / Unit Weight (kg/m) / Total Weight (w/ wastage), per direction; Summary: Total Weight + Grand Total | Output | Good structure (unit-weight rows already hide inside "See details"). **But the hero (big answer) currently shows "Number of Bars" instead of Total Weight** — wrong headline for steel. |
| 15 | Lap rows when enabled: Total Number of Lap Splices / Total Lap Length Added | Output | Keep (hidden in details). |
| 16 | Session table: Element / Description / Weight / Cost (collapsed bar) | Saved rows | Keep. "Description" values are **hardcoded English fragments** ("3x2m", "6m long", "5m dist.") — and content is dimensions, so the column should be "Dimensions" like earthwork. |

---

## 2. Defects found (calculation / translation bugs)

| ID | Defect | Impact |
|---|---|---|
| **B1** | **"Member quantity" is ignored for Footing, Slab and One-way** — results are for 1 member only (Beam/Column do multiply). | **Wrong totals** when the user has several identical footings/slabs. |
| **B2** | "Member quantity" label never translated (English leaks into AR/KU/KS screens). | Confusing for non-English users. |
| **B3** | One-way result row prints hardcoded "(w/ wastage)" in English. | EN text in AR results. |
| **B4** | Session-table Description values built in English ("6m long", "5m dist.", "3x2m"). | EN text in AR tables. |
| **B5** | Result hero shows "Number of Bars" as the big answer (priority bug in `heroFromResult`) — steel's real answer is **Total Weight** (kg). | The one number users read first is the least useful. |
| **B6** | Beam/Column detail rows show per-single-member weights while Summary shows all members (×quantity) — nothing says "per member". | Misreads when quantity > 1. |
| **B7** | Menu card promises "Bar bending schedules" (no such feature). | Expectation mismatch. |
| **B8** | EN title "Structural Steel Calculator" is the wrong term (this is reinforcement/rebar). | Users may expect IPE/channel profiles. |

---

## 3. What is NOT necessary (declutter proposals)

| Item | Proposal |
|---|---|
| Lap-splice block as the first thing in Step 1 | Move it **inside a collapsed "Advanced" line at the bottom of the element details** (or under Costing), default OFF. One tap for those who need it; invisible for those who don't. |
| "1. General Settings / 2. Element Details / 3. Costing (Optional)" numbered headings | Drop the numbers; let the cards read naturally ("General", "Element details", "Costing (optional)"). |
| Unit-weight (kg/m) rows in the result | Already hidden inside "See details" after the result redesign — no action needed. |
| Per-direction weight rows + Summary weight duplication | Acceptable once the hero shows the true Total Weight and everything else sits in details. |

## 4. What is MISSING (addition proposals)

| Item | Why |
|---|---|
| **"What to order" by diameter** — e.g. "Ø12 — 850 kg", "Ø10 — 220 kg" | Steel is bought per diameter; today the order list only shows one total kg. |
| **How many 12 m bars to buy** per diameter (ceil(total length ÷ 12), or the standard-bar length the user set) | Shops sell 12 m bars, not kilograms. This is the number people actually need at the supplier. |
| **Ø8, Ø14, Ø25, Ø28, Ø32** in every diameter list | Ø8 is the usual stirrup size in Iraq; Ø25–32 are common in foundations. Current list (10–22) forces wrong diameters. |
| (Optional) **Stairs** element (waist slab + steps) | Common ask on site; medium effort. |
| (Optional) **"Custom bars" element** — free rows (Ø, count, length) for anything odd (chairs, dowels, repair bars) | One-way covers most, but a plain "just bars" tool is the simplest possible entry and would be the least confusing of all. |

## 5. Wording cleanup (all 4 languages)

| Now | Proposed |
|---|---|
| "Structural Steel Calculator" | "Rebar Calculator" (الحديد: "حاسبة حديد التسليح" stays) |
| "One-Way Reinforcement" | "One-way slab / strip" |
| "Bars parallel to Length / Width" | "Bars along the length / width" |
| "Member quantity" | "Number of members (same size)" + proper translations |
| Session "Description" | "Dimensions" (same rename already done for earthwork) |
| Menu desc "Bar bending schedules and weights" | "Rebar weight and cost by element" (matches what the tool does) |
| "(w/ wastage)", "6m long", "5m dist." | Localized strings |
