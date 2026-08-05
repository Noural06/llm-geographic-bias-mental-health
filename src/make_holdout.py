import json
import re
import unicodedata
from pathlib import Path

import numpy as np
import pandas as pd
from scipy.optimize import Bounds, LinearConstraint, milp

BASE = Path('/workspace/scratch/e5c7d9a5fab7/upload')
OUT = Path('/tmp/validation_holdout_rows.json')
SEED = 20260804

def norm(s):
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFKC', str(s))).strip().lstrip('0')

data = pd.read_csv(BASE / 'combined_dataset_REPAIRED_1.csv')
hol = pd.read_excel(BASE / 'validation_sample_v2_HOLISTIC_TO_LABEL.xlsx', sheet_name='Label Here')
rel = pd.read_excel(BASE / 'validation_H3_religious_TO_LABEL.xlsx', sheet_name='Label Here')
excluded = {norm(x) for x in pd.concat([hol.response_text, rel.response_text])}
pool = data.loc[~data.response_text.map(norm).isin(excluded)].reset_index(drop=True)

n = len(pool)
rng = np.random.default_rng(SEED)
c = rng.random(n) * 1e-5
rows = []
lb = []
ub = []

def add_constraint(mask, lower, upper):
    rows.append(mask.astype(float))
    lb.append(lower)
    ub.append(upper)

add_constraint(np.ones(n), 160, 160)
for city in sorted(pool.city.unique()):
    add_constraint((pool.city == city).to_numpy(), 8, 8)
for scenario in sorted(pool.scenario_id.unique()):
    add_constraint((pool.scenario_id == scenario).to_numpy(), 20, 20)
for income in sorted(pool.income_category.unique()):
    add_constraint((pool.income_category == income).to_numpy(), 40, 40)
for model in sorted(pool.model_name.unique()):
    add_constraint((pool.model_name == model).to_numpy(), 22, 23)
for acuity, target in {'Low':40, 'Moderate':80, 'High':40}.items():
    add_constraint((pool.acuity == acuity).to_numpy(), target, target)

res = milp(c=c, integrality=np.ones(n), bounds=Bounds(0, 1),
           constraints=LinearConstraint(np.vstack(rows), np.array(lb), np.array(ub)),
           options={'time_limit': 30})
if not res.success:
    raise RuntimeError(res.message)

sample = pool.loc[res.x > 0.5].copy()
sample = sample.sample(frac=1, random_state=SEED).reset_index(drop=True)
sample['sample_id'] = [f'H{i:03d}' for i in range(1, len(sample)+1)]

records = sample[['sample_id','response_text']].to_dict(orient='records')
audit = {
    'seed': SEED,
    'pool_n': len(pool),
    'sample_n': len(sample),
    'excluded_unique_responses': len(excluded),
    'counts': {
        'city': sample.city.value_counts().sort_index().to_dict(),
        'scenario_id': sample.scenario_id.value_counts().sort_index().to_dict(),
        'income_category': sample.income_category.value_counts().sort_index().to_dict(),
        'model_name': sample.model_name.value_counts().sort_index().to_dict(),
        'who_region': sample.who_region.value_counts().sort_index().to_dict(),
        'acuity': sample.acuity.value_counts().sort_index().to_dict(),
    },
    'records': records,
}
OUT.write_text(json.dumps(audit, ensure_ascii=False), encoding='utf-8')
print(json.dumps({k:v for k,v in audit.items() if k != 'records'}, indent=2))
