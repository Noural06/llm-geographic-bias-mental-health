# Weekly Deliverables — LLM Geographic Bias in Mental Health Responses

Response to supervisor feedback (week of 2026-07-22).

## Contents

- **`methodology.md`** — Current Methodology chapter (experimental design,
  data collection, pre-processing/feature extraction, statistical
  analysis, reliability/validity/limitations/ethics).
- **`feature_specification.md`** — The three primary outcome families
  (Actionability, Localisation, Support Orientation), a complete feature
  specification table (conceptual definition, extraction rule, output
  type, examples, assumptions, and expected failure modes for every
  retained feature), three explicit hypotheses (one per outcome family),
  and a recommendation for consolidating to 3–4 core figures.
- **`validation_sample_TO_LABEL.xlsx`** — Stratified manual-validation
  sample (112 responses; balanced across all 4 income categories, all 7
  models, all 8 scenarios, and all 20 cities). Automated/pipeline labels
  are deliberately withheld from this sheet to avoid anchoring bias
  during manual coding.

## Status against supervisor's to-do list

| # | Item | Status |
|---|---|---|
| 1 | Define three outcome families | Done — see `feature_specification.md` §1 |
| 2 | Complete feature specification table | Done — see `feature_specification.md` §2 |
| 3 | Manually label stratified validation sample (80–120) | Sample drawn (n=112); manual labeling in progress |
| 4 | Precision/recall/F1 for binary/categorical features | Pending — needs (a) completed manual labels and (b) the automated extraction output for the same 112 responses |
| 5 | Three explicit hypotheses | Done — see `feature_specification.md` §3 |
| 6 | 3–4 core figures, each mapped to one hypothesis | Recommendation drafted — see `feature_specification.md` §4; figures not yet regenerated |
| 7 | Upload to GitHub | This repo |

## Next steps

1. Complete manual labeling in `validation_sample_TO_LABEL.xlsx`.
2. Supply the automated rule-based extraction output (script or feature
   matrix) for the same 112 `sample_id` responses, so labels can be
   compared and precision/recall/F1 computed per feature.
3. Regenerate the 3–4 core figures per the consolidation plan.
4. Revised slides — pending.
