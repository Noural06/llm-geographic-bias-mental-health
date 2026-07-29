# Does Where You Are Shape What You Get?
### Geographic Variation in LLM Responses to Mental Health Queries

**Noura Lakrimdi** — MSc Data Science, Middlesex University  
**Supervisor:** Dr Giovanni Quattrone  
**Module:** CST4990

---

## What this project is

An audit of whether the geographic location a user states when asking a large language
model for mental health guidance changes the quality, localisation, and cultural framing
of the response they receive — and whether that variation disadvantages users in
lower-income and lower-infrastructure settings.

**Dataset:** 1,120 responses from 7 LLMs across 20 cities, 8 scenarios, varying only
the stated city and country. Every other element of the prompt is held constant.

**Core methodological commitment:** no automated outcome measure is used in a hypothesis
test until it has been validated against independently collected human labels with
F1 ≥ 0.70.

---

## This week's work — response to supervisor feedback

All seven items on the supervisor's to-do list are complete.

### 1. Manual coding (Item 1)

- **112 responses** hand-coded across three outcome families (actionability,
  localisation, support orientation) using a structured holistic coding sheet
- **100 additional responses** coded in a second targeted pass for the H3 religious
  framing measure, using choice-based sampling (40 auto-positive / 60 auto-negative)
  with inverse-probability weights to account for the deliberately enriched
  auto-positive sample

The human and automated actionability measures are related but are **not the same
numeric scale**. Human coding used a holistic 0–2 actionability rating. The automated
`actionability_v2` measure is a five-component 0–5 index. Validation compared
pre-defined top-category cases after binarising both measures; it did not compare
the raw 0–2 and 0–5 values as though they were interchangeable.

For the targeted H3 validation, the sampling weights refer to the original sampling
pool: 86 automated positives and 1,034 negatives (86/1,120 = 7.7%). After the
religious-vocabulary correction, the final automated full-dataset count was
140/1,120 = 12.5%. These percentages describe different stages of the pipeline and
should not be treated as contradictory estimates.

### 2. Validation — precision, recall, F1 (Item 2)

Three outcome measures were developed and validated against independent human labels.
All three pass the pre-specified threshold of F1 ≥ 0.70.

| Outcome | What it measures | F1 | Status |
|---|---|---|---|
| `actionability_v2` (0–5) | Whether the response provides concrete, followable steps — crisis contact, professional referral in a recommendation, emergency escalation, immediate-action framing, named coping step | **0.764** | ✓ |
| `localisation_v2c` (0–2) | Whether the response is grounded in the user's stated location: `min(2, explicit location reference + named local institution + contact present)` | **0.750** | ✓ |
| `religious_rec` (binary) | Whether the response recommends religious or spiritual support inside a directive sentence, bullet point, or table row | **0.889** [0.678, 0.934] | ✓ |

The localisation measure was designed under two explicit constraints — every component
must be recoverable from the response text alone, and every component must increase
monotonically with the construct — because a specification that violated the second
constraint produced a directionally reversed result that human validation caught.

The exact collapse rule is:

- no component present → 0
- one component present → 1
- two or three components present → 2

Contact presence measures whether a contact is supplied, not whether the contact is
accurate. Contact verification is therefore treated as a separate safety audit.

### 3. Three finalised hypotheses (Item 3)

| | Outcome | Predictor | Controls | Validated F1 | Result |
|---|---|---|---|---|---|
| **H1** | `actionability_v2` | World Bank income category (ref = Low) | model, scenario | 0.764 | **Supported** |
| **H2** | `localisation_v2c` | Documented crisis-service availability (ref = None) | model, scenario | 0.750 | **Supported** |
| **H3** | `religious_rec` | WHO region (ref = AFR) | model, scenario | 0.889 | **Supported** |

### 4. Data retained at city and response level (Item 4)

All 1,120 responses retained throughout. Models fitted at response level with city as
a random intercept. City-level outcome table exported. Nothing is aggregated to income
tier or WHO region before modelling — those enter only as predictors. The figures use
city-level means for presentation, while the confirmatory mixed-effects models retain
the response-level observations.

### 5. One controlled model per outcome (Item 5)

- **H1:** Linear mixed-effects — `actionability_v2 ~ income + model + scenario`, city random intercept, n = 1,120
- **H2:** Linear mixed-effects — `localisation_v2c ~ service_category + model + scenario`, city random intercept, n = 1,120
- **H3:** Firth penalised logistic — `religious_rec ~ WHO_region + model + scenario`
  (Firth used because the European region had only 2 of 168 positive responses,
  creating near-separation and unstable ordinary logistic estimates)

**Key results:**

| Hypothesis | Effect | 95% CI | p |
|---|---|---|---|
| H1: High vs Low income | +0.639 on 0–5 scale | [0.470, 0.808] | < 0.001 |
| H2: Established line vs None | +0.353 on 0–2 scale | [0.159, 0.547] | < 0.001 |
| H3: AFR and EMR vs all other regions | AFR 24.1%, EMR 25.9% vs EUR 1.2%, AMR 2.4% | — | < 0.001 |

Both H1 and H2 survive refitting on city-level means only (n = 20 cities,
H1 Spearman ρ = 0.824, p < 0.001) and under all 7 leave-one-model-out exclusions.

### 6. Three core figures (Item 6)

All three figures display city means with ±1 SE error bars, grouped by the relevant
geographic category. These are descriptive summaries; the confirmatory models use
the response-level data described above.

- `figures/Figure_H1_Actionability.png` — actionability by city, grouped by income category
- `figures/Figure_H2_Localisation.png` — localisation by city, grouped by service availability
- `figures/Figure_H3_ReligiousFraming.png` — religious framing by city, grouped by WHO region

### 7. GitHub upload (Item 7)

This repository. All code, data, validation labels, notebook, dissertation source,
and methodology materials are included.

---

## An unplanned finding: suspicious crisis-helpline number patterns

This exploratory audit extracted phone-shaped strings appearing near crisis, helpline,
suicide, or emergency language. It then flagged three visibly unusual patterns: a
`555` sequence, a run of at least four identical digits, or a five-digit sequential
run. These pattern flags identify contacts requiring verification; they do **not**
establish that a number is fabricated.

| Documented crisis service | Numbers offered | Pattern-flagged | Flag rate |
|---|---|---|---|
| Established national line | 277 | 3 | 1.1% |
| Limited / NGO | 181 | 29 | 16.0% |
| None documented | 32 | 11 | **34.4%** |

The suspicious-pattern rate increases as documented crisis-service availability
decreases. For example, one response supplied `020 22 222 22` as a 24-hour suicide
prevention contact for Antananarivo. Its repeated-digit pattern triggered the audit
rule, and the reference review found no corresponding service in the documentation
examined.

This is a pattern-based screening result, not an estimate of the fabrication rate.
Every offered contact must be checked against authoritative national or international
sources before it can be classified as valid, unverifiable, or incorrect.

---

## Repository layout

```
├── Geographic_variation_analysis_VALIDATED.ipynb   # Full pipeline, Colab-ready
├── score_h3.py                                     # H3 validation scoring script
├── data/
│   ├── combined_dataset_REPAIRED.csv               # Use this — rebuilt IDs + provenance
│   ├── combined_dataset.csv                        # Original export (broken matrix_id)
│   └── coded_dataset_v2.csv                        # All engineered features
├── source_data/                                    # 7 original per-model response files
├── validation/
│   ├── validation_sample_v2_HOLISTIC_TO_LABEL.xlsx # 112 responses, labelled
│   └── validation_H3_religious_TO_LABEL.xlsx       # 100 responses, completed & scored
├── reference/
│   ├── crisis_reference_v2.py                      # Verified crisis-service reference
│   └── rebuild_v3.py                               # Final outcome-measure construction
├── tables/                                         # All output tables (CSV)
├── figures/                                        # All output figures (PNG)
├── supervisor_response.md                          # Full methods writeup
├── publication_strategy.md                         # Path to publication
├── data_audit.md                                   # Source-file provenance & issues
└── References.tex                                  # Bibliography (Google Scholar / MDX)
```

---

## Reproducing the analysis

Open `Geographic_variation_analysis_VALIDATED.ipynb` in Google Colab or Jupyter.
Run top to bottom. Expects `combined_dataset_REPAIRED.csv` and both validation
workbooks in the working directory.

**Dependencies:** `pandas`, `numpy`, `scipy`, `scikit-learn`, `statsmodels`,
`matplotlib`, `plotly`, `vaderSentiment`, `openpyxl`

---

## Known data issues (both handled)

**`matrix_id` is unusable in `combined_dataset.csv`.** Two source files shipped
without the column; a third contained another model's IDs. Use
`combined_dataset_REPAIRED.csv`. A provenance audit in the notebook catches this
on every run.

**Nemotron-3-Super-120B responses are truncated** (143 of 160, median 155 words).
Truncation is unrelated to income category (χ² p = 0.99), absorbed by the model
fixed effect, and excluding Nemotron *strengthens* both findings — retaining it is
the conservative choice.

---

## Known limitations

- **Language:** all queries in English. Non-Anglophone users querying in a local
  language are not represented, limiting generalisability.
- **Crisis-service reference:** 5 of 20 countries verified against IASP / Befrienders /
  WHO (Nepal, Madagascar, Afghanistan, Nigeria, DR Congo); 15 carry earlier desk-research
  classifications.
- **20 cities:** every geographic claim rests on 20 units. Robustness checks included.
- **Contact-number audit:** pattern matching identifies suspicious forms but cannot
  verify whether a number connects to a legitimate service.
- **One response per cell:** no within-cell variance estimate.

---

## What remains before publication

1. **Complete crisis-service verification** for all 20 countries (15 outstanding)
2. **Add a no-location control condition** — one API run to establish a baseline
3. **Expand city count** beyond 20 for stronger generalisability

The dissertation is submitted. The paper is not yet written.
