import fs from 'fs';

const input = 'upload/Geographic_variation_analysis_REVISED_1_FIXED.ipynb';
const output = 'work/Geographic_variation_analysis_FINAL_SUBMISSION.ipynb';
const nb = JSON.parse(fs.readFileSync(input, 'utf8'));

const setMarkdown = (i, text) => {
  nb.cells[i].cell_type = 'markdown';
  nb.cells[i].source = text.trim().split(/(?<=\n)/);
  delete nb.cells[i].execution_count;
  delete nb.cells[i].outputs;
};
const setCode = (i, text) => {
  nb.cells[i].cell_type = 'code';
  nb.cells[i].source = text.trim().split(/(?<=\n)/);
  nb.cells[i].execution_count = null;
  nb.cells[i].outputs = [];
};

setMarkdown(1, `## Scientific status and reporting contract

This notebook distinguishes **exploration**, **measure development**, **independent hold-out validation**, and **hypothesis testing**.

The original 112-response human-labelled sample was used to diagnose and revise the actionability and localisation rules, so estimates from that sample are **development-set performance**, not independent validation. The frozen revised measures were subsequently tested on a fresh, untouched 160-response hold-out sample. They did not meet the pre-specified acceptability criteria. Repeat coding of 40 responses also failed the pre-specified intra-rater reliability threshold (κ ≥ 0.70) for every measure.

Accordingly, **H1 and H2 are exploratory findings only**. Their model estimates are retained to show the observed patterns in the selected dataset, but they cannot support confirmatory claims. H3 uses a separate 100-response religious-support assessment and is reported separately, with the limitation that it relies on a single human reference standard.

Claims are restricted to the 20 sampled cities. “Location-conditioned” does not mean causal bias or stereotyping. “Visibly suspicious” is a pattern flag; “unresolved” means that available sources did not establish correctness. Neither term is synonymous with fabrication.`);

let manifest = nb.cells[2].source.join('');
manifest = manifest.replace("'notebook': 'Geographic_variation_analysis_REVISED.ipynb'", "'notebook': 'Geographic_variation_analysis_FINAL_SUBMISSION.ipynb'");
manifest = manifest.replace("'reporting_rule': 'H1/H2 provisional pending fresh hold-out validation; H3 independently assessed'", "'reporting_rule': 'H1/H2 exploratory after failed fresh hold-out validation; H3 separately assessed with a single-coder limitation'");
setCode(2, manifest);

setMarkdown(5, `### Methodology: automated content coding and metric construction

#### 1. Actionability Index (v2)

- **Definition:** Composite automated score (0–5) for crisis contact, professional referral, emergency escalation, immediate action, and named coping steps.
- **Development-set estimate:** F1 values previously reported from the revised 112-response sample are development estimates because those labels informed rule revision.
- **Independent hold-out result:** The frozen measure failed on a fresh 160-response sample: quadratic-weighted κ = **0.462**. For high actionability, F1 = **0.757** and sensitivity = **0.624**. It therefore does not meet the locked validation criteria.

#### 2. Localisation Index (v2c)

- **Definition:** Automated score combining explicit location mention, named institution, and contact presence.
- **Development-set estimate:** Earlier F1 values are development estimates, not independent validation.
- **Independent hold-out result:** Surface localisation had F1 = **0.907**, but specificity = **0.038** because the rule classified almost every response as localised. It failed the locked criteria and cannot support confirmatory H2 inference.

#### 3. Religious and spiritual framing

- **Definition:** Binary indicator for an explicit recommendation of religious or spiritual support, using directive context rather than keyword presence alone.
- **Separate assessment:** F1 = **0.889** (reported 95% CI **[0.678, 0.934]**) in a dedicated 100-response sample.
- **Limitation:** The reference labels came from one human coder; this is separate evidence for H3, not inter-rater validation.

#### Locked decision rule

Measures that fail the pre-specified validation criteria are not repaired and re-tested on the same hold-out labels. H1/H2 models below are retained as exploratory analyses; further confirmatory use would require a redesigned codebook and another untouched validation sample.`);

setMarkdown(6, `### Corrections and audit trail

The phone-number extraction pipeline was corrected to reduce false positives on bare numbers and prevent short-code double-counting. Downstream descriptive analyses were re-executed after those technical corrections.

This technical pipeline audit is distinct from construct validation. Exact regex reproduction does **not** establish that an automated outcome agrees with human judgement. The later fresh hold-out study found that the H1/H2 outcome measures did not satisfy the pre-specified validity criteria.

Other numerical corrections retained in this notebook include the Benjamini–Hochberg annotation, the H2 exploratory coefficient, and revised development-set estimates. These corrections do not change the final reporting status: **H1/H2 exploratory; H3 separately supported with a single-coder limitation.**`);

setMarkdown(27, `## 6b. Development-sample human coding (112 responses)

The 112-response holistic workbook was used to diagnose the original outcomes and guide later rule revision. It is therefore a **development sample**, not an independent hold-out validation set.

The analyses in the following cells are retained for transparency and error diagnosis. Their performance estimates must not be described as independent validation and must not determine confirmatory status.`);

setMarkdown(32, `## 6c. Development-stage outcome decisions

The 112-response analysis exposed construct problems in the original localisation and support-orientation outcomes and motivated revised measures. Because the same labels informed those revisions, any rescored performance on these responses is optimistic development evidence.

- **H1:** retained for exploratory modelling, pending an untouched hold-out test.
- **H2:** original composite withdrawn; revised surface and verified localisation measures developed for exploratory sensitivity analysis.
- **H3:** categorical support orientation withdrawn; replaced by the narrower binary construct “explicit religious/spiritual recommendation,” assessed in a separate 100-response sample.

The untouched hold-out test is reported later in Section 23. Its failure overrides any apparently acceptable development-set F1 value for H1/H2.`);

let hyp = nb.cells[37].source.join('');
hyp = hyp.replace('Three explicit hypotheses, one per outcome family, each tested by exactly\n\n**one** confirmatory model', 'Three pre-registered hypotheses, one per outcome family, were intended to be tested by exactly\n\n**one** confirmatory model');
hyp = hyp.replace(/\*\*Explicit limitation carried forward[\s\S]*$/, `**Final evidential status after independent validation:** The hypotheses remain part of the pre-registered design, but H1/H2 outcome measures failed the fresh 160-response hold-out criteria. Their fitted models are therefore reported as exploratory only. H3 is assessed separately with its dedicated 100-response sample and single-coder limitation.`);
setMarkdown(37, hyp);

setMarkdown(69, `## 17. Original planned models — retained as exploratory audit

These models implement the original pre-registered specifications. The automated outcomes later failed or were replaced during measurement work. The models are retained for reproducibility and methodological transparency only; they are not confirmatory evidence.`);
setCode(70, nb.cells[70].source.join('').replaceAll('Confirmatory', 'Exploratory').replaceAll('confirmatory', 'exploratory'));
setCode(71, nb.cells[71].source.join('').replaceAll('confirmatory', 'exploratory').replaceAll('Confirmatory', 'Exploratory'));
setMarkdown(72, `**Output of this step:** the fitted original-specification model summaries are saved to \`Tables/\` for audit. They must not be cited as validated or confirmatory findings.`);

setMarkdown(73, `### Interpretation rule for the revised-outcome models

- **H1:** The revised actionability model estimates an income-associated pattern within the selected 20-city dataset. Because the frozen automated actionability measure failed independent hold-out validation, the coefficient is **exploratory**.
- **H2:** The revised localisation models estimate service-tier-associated patterns, including surface-versus-verified sensitivity analysis. Because surface localisation showed specificity of only 0.038 on the hold-out sample and the localisation measures did not satisfy the locked criteria, these results are **exploratory**.
- **H3:** The religious-recommendation result is supported by a separate 100-response assessment (F1 = 0.889, reported 95% CI [0.678, 0.934]) and should still be presented cautiously because the human reference standard came from one coder.

Robustness to alternative statistical specifications or leave-one-model-out analyses does not repair invalid measurement. A stable coefficient based on an inadequately validated outcome remains exploratory.`);

setMarkdown(80, `## 20. Summary of final findings

### H1 — Actionability by income (exploratory)

The revised automated score shows a positive High-versus-Low income association in the selected dataset and is stable across several statistical specifications. However, the frozen actionability measure failed fresh hold-out validation (weighted κ = 0.462; high-actionability sensitivity = 0.624). **H1 is not confirmed.**

### H2 — Localisation by service availability (exploratory)

Surface and verified localisation analyses show associations in the predicted direction. However, surface localisation had specificity = 0.038 on the fresh hold-out because the rule classified almost everything as localised. **H2 is not confirmed.**

### H3 — Religious framing by WHO region (separately supported, cautious)

The binary religious-recommendation detector achieved F1 = 0.889 in its dedicated 100-response assessment. The regional association may be reported for this sample with the limitations that the validation used a single human reference standard and income was not included as an H3 covariate.

### Crisis-contact audit (exploratory)

The audit identifies verified, incorrect, visibly suspicious, and unresolved contacts. Unresolved contacts must not be called fabricated. Pattern flags are an exploratory lower-bound signal, not a fabrication rate.

### Methodological finding

Independent validation changed the evidential status of the project: plausible and statistically robust automated patterns did not survive measurement validation. This directional failure is a central contribution, not an inconvenience to conceal.`);

setMarkdown(81, `## Final reporting rule

- **H1 and H2:** exploratory only. Do not use “confirmed,” “validated,” or causal language.
- **H3:** separately supported by a dedicated 100-response assessment; always state the single-coder limitation.
- **Development-set F1 values:** label them as development estimates; never use them as evidence of independent validation.
- **Hold-out evidence:** report the fresh 160-response results and the failed 40-response intra-rater reliability study.
- **Robustness:** statistical robustness does not compensate for outcome-measure failure.
- **Geographic scope:** conclusions apply only to the selected 20-city, seven-model, English-language dataset.
- **Contacts:** distinguish verified, incorrect, visibly suspicious, and unresolved; unresolved does not mean fabricated.`);

setMarkdown(84, `### 21b. Development-set evaluation of revised outcomes

The same 112 human labels were used to diagnose, redesign, and rescore these rules. All scores in the next cell are therefore **development-set estimates**. They are retained to document rule development but do not establish independent validity.`);

setMarkdown(86, nb.cells[86].source.join('').replace('**This outcome is now validated.**', '**This outcome was separately assessed.**').replace("The vocabulary fix also improved H1: `actionability_v2`'s validated F1", "The vocabulary fix also improved H1's development-set F1"));

setMarkdown(87, `## 22. Exploratory models on the revised outcomes

The models below quantify patterns in the complete 1,120-response dataset. H1/H2 are explicitly exploratory because their frozen automated measures failed the fresh hold-out validation. H3 is interpreted separately using its dedicated assessment.`);

setMarkdown(93, `## 23. Independent validation results and final measurement verdict

### Fresh 160-response hold-out

The revised H1/H2 rules were frozen before comparison with a fresh, untouched, stratified sample of 160 responses.

| Measure | Key hold-out result | Verdict |
|---|---:|---|
| Overall actionability | Quadratic-weighted κ = 0.462 | Failed κ ≥ 0.70 |
| High actionability | F1 = 0.757; sensitivity = 0.624 | Failed sensitivity criterion |
| Coping-step detector | Specificity = 0.561 | Failed |
| Professional-help detector | Sensitivity = 0.701 | Failed |
| Surface localisation | F1 = 0.907; specificity = 0.038 | Failed decisively |

The high localisation F1 is misleading because positive labels dominate: the detector classified almost every response as localised and could not reliably identify negatives.

### Forty-response repeat-coding study

The same researcher recoded a random subset after a washout period. None of the eight measures reached the locked κ ≥ 0.70 threshold:

| Measure | κ |
|---|---:|
| Overall actionability | 0.134 |
| Coping steps | 0.178 |
| Professional help | 0.531 |
| Social support | 0.547 |
| Crisis action | 0.429 |
| Follow-up | 0.000 |
| Surface localisation | 0.000 |
| Verified localisation | 0.565 |

### Final decision

No H1/H2 automated measure passed the pre-specified independent-validation and repeat-reliability requirements. The measures were not modified after seeing these hold-out labels. H1/H2 analyses are therefore exploratory. A future confirmatory study requires a clearer codebook, at least two independent coders, frozen rules, and another untouched validation sample.

### Separate H3 assessment

The binary religious-recommendation detector was assessed in a dedicated 100-response sample: F1 = 0.889, reported 95% CI [0.678, 0.934]. This supports cautious H3 analysis, but the reference labels were produced by a single coder and do not establish inter-rater reliability.`);

setMarkdown(96, nb.cells[96].source.join('').replace('the current validated measure', 'the current automated measure').replace('**Key result:** H2 is supported under both measures with the same direction.', '**Exploratory result:** H2 has the same direction under both measures, but neither result is confirmatory because the localisation measurement family failed independent validation.'));

setMarkdown(111, `## 27. Final reproducibility export

This final step exports the notebook-generated assets. The package name refers to workflow completion, not successful validation. H1/H2 remain exploratory under the reporting rule above.`);
setCode(112, nb.cells[112].source.join('').replaceAll('FINAL VALIDATED', 'FINAL REPRODUCIBILITY').replaceAll('Final validated', 'Final reproducibility').replaceAll('final validated', 'final reproducibility'));

setMarkdown(109, `## 26. Project summary figure — descriptive and exploratory findings

This PDF-safe figure summarises the major observed patterns. H1/H2 panels are explicitly exploratory because their automated measures failed independent validation. H3 is separately assessed with a single-coder limitation; the crisis-contact audit is exploratory.`);
let summaryFigure = nb.cells[110].source.join('');
summaryFigure = summaryFigure
  .replaceAll('four confirmed findings', 'four principal findings')
  .replaceAll('confirmed, validated values', 'reported analysis values')
  .replace('F1 = 0.744  ·  crisis-contact rate shown; actionability_v2 gap confirmed monotone', 'Exploratory · actionability measure failed independent validation')
  .replace('F1 = 0.750  ·  crisis-contact rate shown; localisation_v2c gap confirmed', 'Exploratory · localisation measure failed independent validation')
  .replace('all outcomes validated (F1 ≥ 0.70) before use', 'H1/H2 exploratory after failed hold-out validation')
  .replace('+0.614 actionability gap\\nHigh vs Low  ·  p < 0.0001', '+0.614 exploratory gap\\nHigh vs Low  ·  model estimate')
  .replace('+0.353 localisation gap\\nEstablished vs None  ·  p < 0.001', '+0.353 exploratory gap\\nEstablished vs None  ·  model estimate');
setCode(110, summaryFigure);

let loader = nb.cells[11].source.join('');
loader = loader.replace('from google.colab import drive\n', `try:\n    from google.colab import drive\nexcept ImportError:\n    drive = None\n`);
setCode(11, loader);

setCode(112, `# @title FINAL REPRODUCIBILITY EXPORT — run after all analysis cells
import shutil
from pathlib import Path

# Refresh the response-level export so it includes every revised outcome.
df.to_csv(OUTPUT_DIR / 'coded_responses.csv', index=False)

# Save final tables generated by the revised analyses.
_tables_to_save = {
    'Table_13_RevisedValidation.csv': globals().get('revised_validation'),
    'Table_13b_SupportRuleComparison.csv': globals().get('support_rule_comparison'),
    'Table_14_EffectiveN_Robustness.csv': globals().get('robustness'),
    'Table_15_LeaveOneModelOut.csv': globals().get('loo_sensitivity'),
    'Table_H1_Actionability_EXPLORATORY.csv': globals().get('h1'),
    'Table_H2_Localisation_EXPLORATORY.csv': globals().get('h2'),
    'Table_H3_ReligiousFraming.csv': globals().get('h3'),
    'Table_CityLevel_Outcomes.csv': globals().get('city_level'),
    'Table_H2_SurfaceVsVerified_EXPLORATORY.csv': globals().get('h2_data'),
}
for _name, _obj in _tables_to_save.items():
    if _obj is not None:
        _obj.to_csv(TABLE_DIR / _name, index=False)

if 'verif' in globals():
    verif['Status'].value_counts().rename_axis('Status').reset_index(name='count').to_csv(
        TABLE_DIR / 'Table_H2_VerifiedContactSummary.csv', index=False)

# Include the source workbooks used by this run when available.
if 'manual_path' in globals() and Path(manual_path).exists():
    shutil.copy2(Path(manual_path), RESULTS_DIR / Path(manual_path).name)
if 'VERIFICATION_FILE' in globals() and Path(VERIFICATION_FILE).exists():
    _src = Path(VERIFICATION_FILE)
    _dst = TABLE_DIR / 'Helpline_Verification_Table.xlsx'
    if _src.resolve() != _dst.resolve():
        shutil.copy2(_src, _dst)

required_outputs = [
    TABLE_DIR / 'Table_14_EffectiveN_Robustness.csv',
    TABLE_DIR / 'Table_15_LeaveOneModelOut.csv',
    TABLE_DIR / 'Table_H1_Actionability_EXPLORATORY.csv',
    TABLE_DIR / 'Table_H2_Localisation_EXPLORATORY.csv',
    TABLE_DIR / 'Table_H3_ReligiousFraming.csv',
    TABLE_DIR / 'Table_CityLevel_Outcomes.csv',
    TABLE_DIR / 'Table_H2_SurfaceVsVerified_EXPLORATORY.csv',
    TABLE_DIR / 'Table_H2_VerifiedContactSummary.csv',
    TABLE_DIR / 'Helpline_Verification_Table.xlsx',
]
_missing = [str(p) for p in required_outputs if not p.exists()]
if _missing:
    raise FileNotFoundError('Reproducibility package incomplete:\\n' + '\\n'.join(_missing))

zip_base = Path.cwd() / 'Dissertation_Analysis_Full_Package_FINAL'
zip_path = Path(shutil.make_archive(str(zip_base), 'zip', root_dir=RESULTS_DIR))
print(f'Complete reproducibility package created: {zip_path}')

try:
    from google.colab import files
    files.download(str(zip_path))
except ImportError:
    print('Not running in Colab; collect the ZIP from the working directory.')`);

setMarkdown(113, `### Export status

The preceding cell is the only final export cell. Duplicate Colab-only export attempts were removed because they could run before required tables existed, used hard-coded paths, and produced inconsistent archives.`);
setCode(114, `# Duplicate export removed.\n+print('Final export is handled by the preceding reproducibility-export cell.')`);
setCode(115, `# Duplicate Colab-only export removed.\n+print('No additional export action is required.')`);

for (const cell of nb.cells) {
  if (cell.cell_type === 'code') {
    cell.execution_count = null;
    cell.outputs = [];
  }
}

nb.metadata = nb.metadata || {};
nb.metadata.project_reporting_status = {
  h1: 'exploratory_after_failed_holdout_validation',
  h2: 'exploratory_after_failed_holdout_validation',
  h3: 'separately_assessed_single_coder_limitation',
  holdout_n: 160,
  repeat_n: 40,
  updated: '2026-08-05'
};

fs.mkdirSync('work', {recursive: true});
fs.writeFileSync(output, JSON.stringify(nb, null, 1) + '\n');
console.log(output);
