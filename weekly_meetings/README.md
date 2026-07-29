# Does Where You Are Shape What You Get?
### Geographic Variation in LLM Responses to Mental Health Queries

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

##  29/07/2026 This week's work.

All seven items on the supervisor's to-do list are complete.

### 1. Manual coding

- **112 responses** hand-coded across three outcome families (actionability,
  localisation, support orientation) using a structured holistic coding sheet
- **100 additional responses** coded in a second targeted pass for the H3 religious
  framing measure, using choice-based sampling (40 auto-positive / 60 auto-negative)
  with sampling weights to correct for the low base rate

### 2. Validation — precision, recall, F1 

Three outcome measures were developed and validated against independent human labels.
All three pass the pre-specified threshold of F1 ≥ 0.70.

| Outcome | What it measures | F1 | Status |
|---|---|---|---|
| `actionability_v2` (0–5) | Whether the response provides concrete, followable steps — crisis contact, professional referral in a recommendation, emergency escalation, immediate-action framing, named coping step | **0.764** | ✓ |
| `localisation_v2c` (0–2) | Whether the response is grounded in the user's stated location — explicit location reference, named local institution, contact present. All three components are monotone and text-readable | **0.750** | ✓ |
| `religious_rec` (binary) | Whether the response recommends religious or spiritual support inside a directive sentence, bullet point, or table row | **0.889** [0.678, 0.934] | ✓ |

The localisation measure was designed under two explicit constraints — every component
must be recoverable from the response text alone, and every component must increase
monotonically with the construct, because a specification that violated the second 
constraint produced a directionally reversed result that human validation caught.

### 3. Three finalised hypotheses 

| | Outcome | Predictor | Controls | Validated F1 | Result |
|---|---|---|---|---|---|
| **H1** | `actionability_v2` | World Bank income category (ref = Low) | model, scenario | 0.764 | **Supported** |
| **H2** | `localisation_v2c` | Documented crisis-service availability (ref = None) | model, scenario | 0.750 | **Supported** |
| **H3** | `religious_rec` | WHO region (ref = AFR) | model, scenario | 0.889 | **Supported** |

### 4. Data is retained at the city and response level 

All 1,120 responses were retained throughout. Models fitted at the response level with city as
a random intercept. City-level outcome table exported. Nothing is aggregated to the income
tier or WHO region before modelling — those enter only as predictors.

### 5. One controlled model per outcome 

- **H1:** Linear mixed-effects — `actionability_v2 ~ income + model + scenario`, city random intercept, n = 1,120
- **H2:** Linear mixed-effects — `localisation_v2c ~ service_category + model + scenario`, city random intercept, n = 1,120
- **H3:** Firth penalised logistic — `religious_rec ~ WHO_region + model + scenario`
  (Firth used because the European region had only 2 of 168 positive responses)

**Key results:**

| Hypothesis | Effect | 95% CI | p |
|---|---|---|---|
| H1: High vs Low income | +0.639 on 0–5 scale | [0.470, 0.808] | < 0.001 |
| H2: Established line vs None | +0.353 on 0–2 scale | [0.159, 0.547] | < 0.001 |
| H3: AFR and EMR vs all other regions | AFR 24.1%, EMR 25.9% vs EUR 1.2%, AMR 2.4% | — | < 0.001 |

Both H1 and H2 survive refitting on city-level means only (n = 20 cities,
H1 Spearman ρ = 0.824, p < 0.001) and under all 7 leave-one-model-out exclusions.

### 6. Three core figures 

All three figures show cities as the unit with ±1 SE error bars, grouped by the
relevant geographic category. Nothing is aggregated away.

- `figures/Figure_H1_Actionability.png` — actionability by city, grouped by income category
- `figures/Figure_H2_Localisation.png` — localisation by city, grouped by service availability
- `figures/Figure_H3_ReligiousFraming.png` — religious framing by city, grouped by WHO region


---

## An unplanned finding: fabricated crisis-helpline numbers

Auditing the raw response text found that models offer phone numbers alongside
crisis-line language at rates that rise sharply where no documented service exists:

| Documented crisis service | Numbers offered | Visibly synthetic | Rate |
|---|---|---|---|
| Established national line | 277 | 3 | 1.1% |
| Limited / NGO | 181 | 29 | 16.0% |
| None documented | 32 | 11 | **34.4%** |

"Visibly synthetic" means the fictional North American 555-exchange block, sequential
digit runs, or repeated-digit runs — patterns used in fiction precisely because they
cannot connect to a real subscriber. One model offered `020 22 222 22` to a user in
Antananarivo, Madagascar as a 24-hour Suicide Prevention Hotline. Madagascar's own
health documentation states explicitly that no such line exists.

This is a floor estimate. The true fabrication rate is higher.




---

## Reproducing the analysis

Open `Geographic_variation_analysis_VALIDATED.ipynb` in Google Colab or Jupyter.
Run top to bottom. 

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
  language would likely show wider gaps.
- **Crisis-service reference:** 5 of 20 countries verified against IASP / Befrienders /
  WHO (Nepal, Madagascar, Afghanistan, Nigeria, DR Congo); 15 carried out earlier desk research
  classifications.
- **20 cities:** every geographic claim rests on 20 units. Robustness checks included.
- **Fabrication floor:** pattern-matching only catches visibly synthetic numbers.
- **One response per cell:** no within-cell variance estimate.





