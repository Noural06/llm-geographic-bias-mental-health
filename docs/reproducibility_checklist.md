# Reproducibility Checklist

Use this checklist before final submission or public release.

## Repository hygiene

- [ ] README describes the project, dataset, methodology, and key findings.
- [ ] requirements.txt lists all required Python packages.
- [ ] CITATION.cff is included.
- [ ] .gitignore excludes .env files, API keys, notebook checkpoints, caches, and temporary files.
- [ ] No API keys or sensitive information are committed.
- [ ] Temporary test outputs have been removed or archived.
- [ ] Notebook documentation reflects the final validated analysis.

## Data and outputs

- [ ] Final dataset contains **1,120 AI-generated responses**.
- [ ] Experimental matrix contains **20 cities × 8 scenarios × 7 language models (1,120 prompts)**.
- [ ] `coded_responses.csv` corresponds to the corrected phone-number extraction pipeline.
- [ ] Descriptive statistics, tables, figures, and statistical tests are reproduced from the supplied dataset.
- [ ] All dissertation figures are stored in `figures/`.
- [ ] Supplementary outputs are stored in `supplementary/`.

## Analysis verification

- [ ] Notebook runs successfully from start to finish without errors.
- [ ] Kruskal–Wallis results reproduce.
- [ ] Chi-square results reproduce.
- [ ] Figures and tables match those reported in the dissertation.
- [ ] Documentation no longer contains obsolete statements about the phone-regex pipeline.

## Dissertation materials

- [ ] Dissertation compiles successfully.
- [ ] All chapters have been proofread.
- [ ] References compile correctly.
- [ ] Figures and tables are numbered correctly.
- [ ] Appendices include the project outline and risk assessment (if required by the programme).
- [ ] Word count complies with university regulations.

## Viva (Poster) preparation

- [ ] Poster presentation is finalised.
- [ ] Speaker notes are prepared.
- [ ] Main findings can be explained without referring to notes.
- [ ] Statistical methods and key results can be justified.

## Ethical considerations

- [ ] Repository clearly states that the study evaluates AI-generated responses.
- [ ] Repository does not present LLMs as substitutes for qualified mental health professionals.
- [ ] Dataset does not contain personally identifiable information.
- [ ] API usage complies with the provider's terms of service.
