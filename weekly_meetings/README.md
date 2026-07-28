# Does Where You Are Shape What You Get?
### Geographic Variation in LLM Responses to Mental Health Queries

**Noura Lakrimdi** — MSc Data Science, Middlesex University  
**Supervisor:** Dr Giovanni Quattrone  
**Module:** CST4990

---

## What this project is

An audit of whether the geographic location a user states when asking a large language
model for mental health guidance changes the quality, localisation, and cultural framing
of the response they receive — and whether that variation disadvantages users in lower-income
and lower-infrastructure settings.

**Dataset:** 1,120 responses from 7 LLMs across 20 cities, 8 scenarios, varying only the
stated city and country. Every other element of the prompt is held constant.

**Core methodological commitment:** no automated outcome measure is used in a hypothesis
test until it has been validated against independently collected human labels with
F1 ≥ 0.70. Two of the three original measures failed this check. One failure would have
supported a published finding pointing in the wrong direction. This is documented rather
than hidden.

---

## This week's work — response to supervisor feedback

The supervisor's to-do list (7 items) has been completed in full.

### 1. Manual coding (Item 1)
- **112 responses** hand-coded across all three outcome families (actionability,
  localisation, support orientation) using a structured holistic coding sheet
- **100 additional responses** coded in a second, targeted pass for the H3 religious
  framing measure, using choice-based sampling (40 auto-positive / 60 auto-negative)
  with sampling weights to correct for the low base rate

### 2. Validation — precision, recall, F1 (Item 2)

All three pre-registered measures were tested against human labels. None passed on
first attempt. The table below shows the before/after:

| Outcome | First F1 | Problem found | Final F1 | Status |
|---|---|---|---|---|
| `actionability_v2` | 0.680 | Named coping step missing from code; professional referral counted even when only mentioned, not recommended | **0.764** | ✓ Passes |
| `localisation_v2c` | 0.602 | **Circular definition** — component rewarded omitting a crisis number in unserved cities, making least-served cities score highest (backwards) | **0.750** | ✓ Passes |
| `support_orientation_auto` | 0.218 | 52% of responses are genuinely "mixed" — single-winner categorical outcome cannot represent this. Irreparable by vocabulary tuning | Withdrawn | → Replaced |
| `religious_rec` (replacement for H3) | 0.571 | 5 of 7 disagreements were data-entry slips; vocabulary missing "attend", "check" for bullet-list suggestions | **0.889** | ✓ Passes |

**The H2 near-miss is the most important finding methodologically.** The original
localisation index was defined so that it rewarded *omitting* a crisis number in
countries with no documented service, and rewarded *including* one in served countries.
Two automated coding rules agreed at κ = 0.93–0.99 without catching this, because they
shared the same flawed logic. Human validation caught it. The corrected result points
in the opposite direction from the original.

### 3. Three finalised hypotheses (Item 3)

| | Outcome | Predictor | Controls | Validated F1 | Result |
|---|---|---|---|---|---|
| **H1** | `actionability_v2` (0–5) | World Bank income category (ref = Low) | model, scenario | 0.764 | **Supported** |
| **H2** | `localisation_v2c` (0–2) | Documented crisis-service availability (ref = None) | model, scenario | 0.750 | **Supported** |
| **H3** | `religious_rec` (binary) | WHO region (ref = AFR) | model, scenario | 0.889 [0.678, 0.934] | **Supported** |

### 4. Data retained at city and response level (Item 4)

All 1,120 responses retained throughout. Models fitted at response level with city as
a random intercept. City-level outcome table exported (`Table_CityLevel_Outcomes.csv`).
Nothing is aggregated to income tier or WHO region before modelling — those enter only
as predictors.

### 5. One controlled model per outcome (Item 5)

- **H1:** Linear mixed-effects model — `actionability_v2 ~ income + model + scenario`,
  city random intercept, n = 1,120
- **H2:** Linear mixed-effects model — `localisation_v2c ~ service_category + model + scenario`,
  city random intercept, n = 1,120
- **H3:** Firth penalised logistic regression — `religious_rec ~ WHO_region + model + scenario`
  (Firth required: EUR had only 2 of 168 positive responses, causing separation in
  standard logistic regression)

**Key results:**

| Hypothesis | Effect | 95% CI | p |
|---|---|---|---|
| H1: High vs Low income | +0.639 on 0–5 scale | [0.470, 0.808] | < 0.001 |
| H2: Established line vs None | +0.353 on 0–2 scale | [0.159, 0.547] | < 0.001 |
| H3: EMR vs AFR (reference) | OR = 1.139 | [0.690, 1.883] | 0.61 (n.s.) |
| H3: EUR vs AFR | OR = 0.030 | [0.008, 0.111] | < 0.001 |

Both H1 and H2 survive refitting on city-level means only (n = 20 cities, H1 Spearman
ρ = 0.824, p < 0.001) and under all 7 leave-one-model-out exclusions.

### 6. Three core figures (Item 6)

All three figures show cities as the unit with ±1 SE error bars, grouped by the
relevant geographic category, with separator lines between groups. No premature
aggregation.

- `Figure_H1_Actionability.png` — actionability by city, grouped by income category
- `Figure_H2_Localisation.png` — localisation by city, grouped by service availability
- `Figure_H3_ReligiousFraming.png` — religious framing by city, grouped by WHO region

### 7. GitHub upload (Item 7)

This repository. Code, data, validation labels, notebook, and dissertation source
all uploaded.

---

## An unplanned finding: fabricated crisis-helpline numbers

Auditing the raw response text found that models offer phone numbers alongside
crisis-line language at rates that rise sharply where no documented service exists:

| Documented crisis service | Numbers offered | Visibly synthetic pattern | Rate |
|---|---|---|---|
| Established national line | 277 | 3 | 1.1% |
| Limited / NGO | 181 | 29 | 16.0% |
| None documented | 32 | 11 | **34.4%** |

"Visibly synthetic" means the fictional North American 555-exchange block, sequential
digit runs, or repeated-digit runs — patterns used in fiction precisely because they
cannot connect to a real subscriber. One model handed a user in Antananarivo, Madagascar
the number `020 22 222 22` presented as a 24-hour Suicide Prevention Hotline. Madagascar's
own health documentation states explicitly that no such line exists.

This is a floor estimate. The true fabrication rate is higher.

---

## Repository layout

```
├── Geographic_variation_analysis_VALIDATED.ipynb   # Full pipeline, Colab-ready
├── score_h3.py                                     # H3 validation scoring script
├── data/
│   ├── combined_dataset_REPAIRED.csv               # Use this — rebuilt IDs
│   ├── combined_dataset.csv                        # Original (broken matrix_id)
│   └── coded_dataset_v2.csv                        # All engineered features
├── source_data/                                    # 7 original per-model response files
├── validation/
│   ├── validation_sample_v2_HOLISTIC_TO_LABEL.xlsx # 112 responses, completed
│   └── validation_H3_religious_TO_LABEL.xlsx       # 100 responses, completed & scored
├── reference/
│   ├── crisis_reference_v2.py                      # Verified crisis-service reference
│   └── rebuild_v3.py                               # Final outcome-measure construction
├── tables/                                         # All output tables (CSV)
├── figures/                                        # All output figures (PNG)
├── supervisor_response.md                          # Full methods writeup
├── publication_strategy.md                         # Path to publication
├── data_audit.md                                   # Source-file provenance
└── References.tex                                  # Bibliography (Google Scholar / MDX)
```

---

## Reproducing the analysis

Open `Geographic_variation_analysis_VALIDATED.ipynb` in Google Colab or Jupyter.
Run top to bottom. Expects `combined_dataset_REPAIRED.csv` and the two validation
workbooks in the working directory.

**Dependencies:** `pandas`, `numpy`, `scipy`, `scikit-learn`, `statsmodels`,
`matplotlib`, `plotly`, `vaderSentiment`, `openpyxl`

---

## Known limitations (stated plainly)

- **Language:** all queries posed in English. Users in non-Anglophone settings who
  query in a local language would likely show wider gaps than reported here.
- **Crisis-service reference:** 5 of 20 countries directly verified against IASP /
  Befrienders / WHO this week (Nepal, Madagascar, Afghanistan, Nigeria, DR Congo);
  15 carried over from earlier desk research. The H2 predictor and fabrication finding
  rest partly on unverified classifications.
- **20 cities:** every geographic claim rests on 20 units. Effective-n robustness
  checks are included; a larger city sample would strengthen generalisability.
- **Fabrication floor:** pattern-matching catches visibly synthetic numbers only.
  The true fabrication rate requires a complete, verified directory for all countries.
- **One response per cell:** no within-cell variance estimate. At temperature > 0,
  fabrication may be intermittent; a single sample may over- or under-estimate it.

---

## What remains before publication

1. **Complete the crisis-service verification** for all 20 countries (15 outstanding)
2. **Add a no-location control condition** — one API run to establish a baseline
3. **Expand city count** beyond 20 for stronger generalisability

The dissertation is submitted. The paper is not yet written.
