import json
from pathlib import Path

import openpyxl
from sklearn.metrics import cohen_kappa_score, confusion_matrix

ROOT = Path("/workspace/scratch/e5c7d9a5fab7")


def sheet_rows(path, sheet):
    wb = openpyxl.load_workbook(path, data_only=True)
    values = list(wb[sheet].iter_rows(values_only=True))
    headers = list(values[0])
    return [dict(zip(headers, row)) for row in values[1:]]


repeat = sheet_rows(ROOT / "upload/Fresh_Holdout_REPEAT_CODING_LABELED.xlsx", "Label Here")
original = sheet_rows(ROOT / "upload/Fresh_Holdout_Validation_LABELLED.xlsx", "Label Here")
corrections = sheet_rows(ROOT / "upload/Repeat_Coding_CORRECTION_REQUIRED_LABELED.xlsx", "Correct Scores")
replacement = sheet_rows(ROOT / "upload/Repeat_Coding_CORRECTION_REQUIRED_LABELED.xlsx", "Replacement Row")

score_col = "actionability_overall (ENTER 0–2)"
corrected_scores = {row["sample_id"]: row[score_col] for row in corrections}
merged = []
for row in repeat:
    if row["repeat_id"] == "R001":
        continue
    row = dict(row)
    if row["sample_id"] in corrected_scores:
        row["actionability_overall"] = corrected_scores[row["sample_id"]]
    merged.append(row)
merged.extend(replacement)

assert len(merged) == 40
assert len({r["sample_id"] for r in merged}) == 40
assert all(r["actionability_overall"] in (0, 1, 2) for r in merged)

original_by_id = {r["sample_id"]: r for r in original}
fields = [
    ("actionability_overall", "Overall actionability", [0, 1, 2], "quadratic"),
    ("coping_step", "Coping step", [0, 1], None),
    ("professional_help", "Professional help", [0, 1], None),
    ("social_support", "Social support", [0, 1], None),
    ("crisis_action", "Crisis action", [0, 1], None),
    ("follow_up", "Follow-up", [0, 1], None),
    ("surface_localisation", "Surface localisation", [0, 1], None),
    ("verified_localisation", "Verified localisation", [0, 1], None),
]

metrics = []
comparisons = []
for key, label, labels, weights in fields:
    first = [int(original_by_id[r["sample_id"]][key]) for r in merged]
    second = [int(r[key]) for r in merged]
    kappa = float(cohen_kappa_score(first, second, weights=weights))
    agreement = sum(a == b for a, b in zip(first, second)) / len(first)
    matrix = confusion_matrix(first, second, labels=labels).tolist()
    metrics.append({
        "field": key,
        "measure": label,
        "n": len(first),
        "agreement": agreement,
        "kappa": kappa,
        "threshold": 0.70,
        "decision": "PASS" if kappa >= 0.70 else "FAIL",
        "first_counts": {str(v): first.count(v) for v in labels},
        "repeat_counts": {str(v): second.count(v) for v in labels},
        "confusion_matrix": matrix,
        "labels": labels,
    })
    for row, a, b in zip(merged, first, second):
        comparisons.append({
            "repeat_id": row["repeat_id"], "sample_id": row["sample_id"],
            "measure": label, "first_label": a, "repeat_label": b,
            "agreement": int(a == b),
        })

payload = {
    "method": {
        "repeat_n": 40,
        "replacement": "Corrupted R001/H146 replaced prospectively with R001R/H003.",
        "actionability_statistic": "Quadratic-weighted Cohen's kappa",
        "binary_statistic": "Unweighted Cohen's kappa",
        "acceptance_threshold": 0.70,
        "interpretation": "No measure met the pre-specified kappa threshold. High raw agreement for some measures is inflated by class imbalance and does not override kappa failure.",
    },
    "metrics": metrics,
    "comparisons": comparisons,
    "merged_repeat": merged,
}

out = ROOT / "tmp/repeat_reliability"
out.mkdir(parents=True, exist_ok=True)
(out / "results.json").write_text(json.dumps(payload, indent=2), encoding="utf-8")
print(json.dumps({"output": str(out / "results.json"), "metrics": metrics}, indent=2))
