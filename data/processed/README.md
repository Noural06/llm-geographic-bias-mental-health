# Processed data

This directory is reserved for generated, non-source artifacts. Raw inputs remain immutable in `data/raw/`.

The main notebook writes response-level coded data and summary exports beneath `results/reproduced/`. The fresh hold-out validation script writes metrics, matched rows, error cases, the repeat sample, and an audit JSON beneath `results/logs/holdout_validation/`.

Binary validation and reliability workbooks should be added to this public repository only after a separate disclosure review confirms that they contain no unintended personal, private, or sensitive information. The repository already contains the source label workbooks required by the current scripts under `data/raw/`.
