# Does Where You Are Shape What You Get?
## Geographic Variation in LLM Responses to Mental Health Queries

**MSc Data Science Dissertation — Middlesex University 2026**  
**Author:** Noura Lakrimdi | **Supervisor:** Dr Giovanni Quattrone

---

## Overview

Controlled audit of geographic variation in large language model responses to standardised
mental health queries. Seven LLMs × 20 cities × 8 scenarios × 1 fixed prompt template
= 1,120 responses. Only the stated city and country vary across prompts.

Three pre-registered hypotheses tested with validated composite outcome measures
(F1 ≥ 0.70, threshold set before any human labels were collected).
A fourth finding (S1) emerged during direct inspection of response text.

---

## Key findings

| Finding | Result | Validated F1 |
|---|---|---|
| H1 — Actionability increases with income | +0.614 on 0–5 scale, High vs Low (p < 0.0001) | 0.744 |
| H2 — Localisation increases with service availability | +0.353, Established vs None (p < 0.001) | 0.750 |
| H3 — Religious framing varies by WHO region | EUR vs AFR: OR = 0.015 (p = 0.003) | 0.889 |
| S1 — Visibly suspicious crisis contacts | 34.4% in None-documented tier vs 1.1% Established | Floor estimate |

---

## Repository structure

```
.
├── src/
│   └── Geographic_variation_analysis_FINAL_CORRECTED.ipynb
├── data/
│   ├── raw/                        ← read-only original inputs
│   │   ├── combined_dataset_REPAIRED_1.csv
│   │   ├── validation_sample_v2_HOLISTIC_TO_LABEL.xlsx
│   │   └── validation_H3_religious_TO_LABEL.xlsx
│   └── processed/                  ← pipeline summary outputs
│       ├── coded_responses.csv
│       ├── summary_by_*.csv
│       └── Helpline_Verification_Table_CORRECTED.xlsx
├── models/                         ← (empty — no trained weights; rule-based pipeline)
├── results/
│   ├── figures/                    ← all dissertation figures (.png, .html)
│   ├── tables/                     ← all model output tables (.csv, .xlsx, .txt)
│   └── logs/                       ← (reserved for future execution logs)
├── weekly_meetings/                ← (reserved for meeting logs and slide decks)
├── docs/
│   ├── dissertation_latex/         ← full LaTeX source 
│   └── Poster                      ← not yet 
├── .gitignore
└── requirements.txt
```

---

## Notebook guide (`src/`)

Run cells top to bottom. Section 22 is the authoritative result section.

| Sections | Content |
|---|---|
| 1–5 | Setup, data loading, integrity audit |
| 6–10 | NLP pipeline (phone regex, directive-context filter, fabrication detection) |
| 11–16 | Exploratory analysis and EDA figures |
| 17–19 | First confirmatory models — **pre-validation outcomes, retained for transparency only** |
| 20–22 | **Final validated models — cite these** |
| 23–25 | Helpline verification, surface vs verified localisation |
| 26 | Project summary figure — all four findings on one PDF-safe map |
| 27 | Final export |

> **Important:** Section 17 uses pre-validated outcomes that failed human validation.
> Its coefficients are retained for methodological transparency but must not be cited
> as findings. Always cite Section 22.
---

## Reproducibility

Install dependencies:
```bash
pip install -r requirements.txt
```

All analysis runs on `data/raw/combined_dataset_REPAIRED_1.csv`.
The notebook is self-contained and runs end-to-end in Google Colab
without additional downloads (cartopy fetches Natural Earth shapefiles
on first run; requires internet access).

The helpline verification table (`data/processed/`) is human-annotated.
All classification decisions are documented in the Classification Note column
with primary sources cited.

---

## Ethical note

No real user data. All queries are researcher-constructed scenarios presented to
model APIs. The dataset contains no personal information. Fabrication is asserted
only where both pattern evidence and the absence of any documented service jointly
support that conclusion.
