"""Compute pre-adjudication agreement for the independent second-coder subset."""

from pathlib import Path

import pandas as pd
from sklearn.metrics import cohen_kappa_score

ROOT = Path(__file__).resolve().parents[1]
CODER1 = ROOT / "data/raw/Fresh_Holdout_Validation_LABELLED.xlsx"
CODER2 = ROOT / "data/raw/Second_Coder_Independent_Validation_40_LABELS.csv"
OUTPUT = ROOT / "tables/Table_16_IndependentCoderAgreement.csv"

FIELDS = [
    "actionability_overall",
    "coping_step",
    "professional_help",
    "social_support",
    "crisis_action",
    "follow_up",
    "surface_localisation",
    "verified_localisation",
]


def main() -> None:
    coder1 = pd.read_excel(CODER1, sheet_name="Label Here")
    coder2 = pd.read_csv(CODER2)

    paired = coder2[["sample_id", *FIELDS]].merge(
        coder1[["sample_id", *FIELDS]],
        on="sample_id",
        suffixes=("_coder2", "_coder1"),
        validate="one_to_one",
    )
    if len(paired) != 40 or paired["sample_id"].nunique() != 40:
        raise ValueError("Expected exactly 40 unique matched responses.")

    rows = []
    for field in FIELDS:
        first = paired[f"{field}_coder1"].astype(int)
        second = paired[f"{field}_coder2"].astype(int)
        weights = "quadratic" if field == "actionability_overall" else None
        kappa = cohen_kappa_score(first, second, weights=weights)
        target = 2 if field == "actionability_overall" else 1
        rows.append(
            {
                "outcome": field,
                "n": len(first),
                "raw_agreement": round(float((first == second).mean()), 3),
                "cohen_kappa": round(float(kappa), 3),
                "kappa_type": "quadratic-weighted" if weights else "unweighted",
                "meets_kappa_0_70": bool(kappa >= 0.70),
                "coder1_positive_or_high": int((first == target).sum()),
                "coder2_positive_or_high": int((second == target).sum()),
            }
        )

    result = pd.DataFrame(rows)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    result.to_csv(OUTPUT, index=False)
    print(result.to_string(index=False))
    print("\nDecision: only social support meets κ ≥ 0.70; H1/H2 remain exploratory.")


if __name__ == "__main__":
    main()
