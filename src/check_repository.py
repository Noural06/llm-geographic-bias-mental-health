"""Fast structural and data-integrity checks for a clean repository clone."""

from __future__ import annotations

import json
from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]


def require(path: Path) -> None:
    if not path.exists():
        raise FileNotFoundError(f"Required file is missing: {path.relative_to(ROOT)}")


required = [
    ROOT / "data/raw/combined_dataset_REPAIRED_1.csv",
    ROOT / "data/raw/Fresh_Holdout_Validation_LABELLED.xlsx",
    ROOT / "data/processed/README.md",
    ROOT / "results/logs/run_manifest.json",
    ROOT / "src/Geographic_variation_analysis_FINAL_SUBMISSION.ipynb",
    ROOT / "docs/latex_source/main.tex",
]
for item in required:
    require(item)

raw = pd.read_csv(ROOT / "data/raw/combined_dataset_REPAIRED_1.csv")
assert len(raw) == 1120, f"Expected 1,120 raw rows; found {len(raw)}"
assert raw["city"].nunique() == 20, "Expected 20 cities"
assert raw["scenario_id"].nunique() == 8, "Expected 8 scenarios"
assert raw["model_name"].nunique() == 7, "Expected 7 response-generating models"
assert not raw.duplicated(["city", "scenario_id", "model_name"]).any(), "Duplicate design cells found"

holdout = pd.read_excel(
    ROOT / "data/raw/Fresh_Holdout_Validation_LABELLED.xlsx",
    sheet_name="Label Here",
)
assert len(holdout) == 160, f"Expected 160 hold-out rows; found {len(holdout)}"
assert holdout["sample_id"].is_unique, "Duplicate hold-out sample IDs found"

for notebook in [
    ROOT / "src/Geographic_variation_analysis_FINAL_SUBMISSION.ipynb",
    ROOT / "src/Intra_Rater_Reliability_CORRECTED.ipynb",
]:
    require(notebook)
    with notebook.open(encoding="utf-8") as handle:
        parsed = json.load(handle)
    assert parsed.get("nbformat") == 4, f"Unexpected notebook format: {notebook.name}"

print("Repository checks passed: 1,120 responses, 20 cities, 8 scenarios, 7 models, 160 hold-out rows.")
