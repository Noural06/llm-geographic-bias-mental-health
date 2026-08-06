# Reproducibility guide

## Canonical execution environment

- Python: 3.11 or 3.12
- Working directory: repository root
- Random seeds: recorded in the notebook and `results/logs/run_manifest.json`
- Dependencies: `requirements.txt`

The repository-relative layout is canonical. Colab/Drive paths retained in the notebook are optional fallbacks and are not required for a clean local run.

## Data roles

- `data/raw/`: immutable source response files and human-label workbooks.
- `results/reproduced/outputs/coded_responses.csv`: regenerated response-level dataset produced by a clean notebook run; intentionally not committed because it duplicates the raw response text.
- `data/processed/`: generated response-level datasets and validation exports. The public repository documents this contract but does not add new binary workbooks without a separate disclosure review.
- `results/tables/`: dissertation-facing tables and model summaries.
- `results/tables/modern_nlp_results_*.csv`: experimental Qwen predictions; these are development records, not validated outcomes.
- `results/logs/run_manifest.json`: environment and run metadata for the exported analysis package.

## Execution order

1. Create an isolated environment and install `requirements.txt`.
2. Run `python src/check_repository.py` to verify file presence, row counts, notebook syntax, and the 20 × 8 × 7 design.
3. Open `src/Geographic_variation_analysis_FINAL_SUBMISSION.ipynb` and run all cells from the repository root.
4. Run `python src/analyse_holdout.py` to reproduce the frozen-rule fresh hold-out metrics under `results/logs/holdout_validation/`.
5. Use `src/Intra_Rater_Reliability_CORRECTED.ipynb` only to reproduce the coding-drift diagnostic. Do not interpret either coding occasion as error-free truth.
6. Compile the dissertation, if required, from `docs/latex_source/` with `latexmk -pdf main.tex`.

## Expected invariants

- Combined response rows: 1,120
- Cities: 20
- Scenarios: 8
- Response-generating models: 7
- Duplicate response design cells: 0
- Fresh hold-out rows: 160

## Measurement decisions

- Frozen actionability and localisation measures failed the fresh hold-out gate; RQ1 and RQ2 remain exploratory.
- The Qwen prompt-based coder performed worse overall than the transparent rule-based pipeline on the matched 40-case subset and was rejected.
- Better relative performance does not validate the rule-based method.
- Surface and verified localisation are distinct outcomes.
- Visibly suspicious, unresolved, incorrect, verified, and general-emergency contacts must not be collapsed into one category.

## Non-core utilities

The JavaScript workbook builders are retained as development provenance. They use `@oai/artifact-tool`, which is not required for the scientific analysis and is not part of the Python environment. The committed workbooks are the canonical outputs of those utilities.

## Historical materials

Files in `weekly_meetings/` record the project at the date shown in each filename. Earlier slides can contain claims superseded by the final validation results. They are not current submission artifacts.
