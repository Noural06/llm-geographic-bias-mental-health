# Reproducibility Checklist

Use this checklist before final submission or public release.

## Repository hygiene

- [ ] README describes the project, dataset, methods, and findings.
- [ ] `requirements.txt` lists the main Python dependencies.
- [ ] `CITATION.cff` is present.
- [ ] `.env` and API keys are not committed.
- [ ] Notebook checkpoints and cache files are ignored.
- [ ] Temporary test outputs are removed or moved to an archive.

## Data and outputs

- [ ] Final dataset contains 1,120 responses.
- [ ] Experimental matrix matches 20 cities × 8 scenarios × 7 models.
- [ ] Topic assignments are reproducible from the processed dataset.
- [ ] Figures used in the dissertation are stored in `figures/`.
- [ ] Supplementary HTML visualisations are stored in `supplementary/`.

## Dissertation materials

- [ ] LaTeX files compile successfully in Overleaf.
- [ ] Chapter 1 to Chapter 6 are within the required page limit.
- [ ] Word count is declared using the programme's required method.
- [ ] Project outline is included in the appendix.
- [ ] Risk assessment is included in the appendix.
- [ ] References compile correctly.

## Viva preparation

- [ ] Viva presentation is saved in `presentation/`.
- [ ] Speaker notes are prepared.
- [ ] Key statistics are memorised:
  - 1,120 responses
  - 24 BERTopic topics
  - 15 geographic micro-clusters
  - 41.3% geographic micro-cluster responses
  - Cramér's V = 0.675 for income category
  - Cramér's V = 0.649 for WHO region
  - Cramér's V = 0.170 for model identity
  - 27.9% reduction in professional references
  - 47.1% reduction in crisis references

## Ethical and safety note

- [ ] Repository makes clear that the project evaluates AI-generated text only.
- [ ] Repository does not present LLMs as substitutes for qualified mental health professionals.
