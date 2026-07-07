# Repository Structure

This document describes the recommended final structure for the dissertation repository.

```text
llm-geographic-bias-mental-health/
│
├── README.md
├── CITATION.cff
├── requirements.txt
├── .gitignore
│
├── config/
│   ├── cities.csv
│   ├── scenarios.csv
│   └── models.csv or models.yaml
│
├── data/
│   ├── raw/              # Raw response outputs and collection logs
│   ├── processed/        # Cleaned datasets and experimental matrices
│   ├── outputs/          # Statistical summaries and topic outputs
│   └── coding/           # Coding framework or topic labels, if used
│
├── src/
│   ├── 01_collect_responses.py
│   ├── 02_preprocess_responses.py
│   ├── 03_bertopic_analysis.py
│   ├── 04_feature_extraction.py
│   ├── 05_statistical_analysis.py
│   └── 06_visualisations.py
│
├── figures/
│   ├── fig4_1_theme_by_income.png
│   ├── fig4_2_theme_by_who_region.png
│   ├── fig4_3_theme_by_model.png
│   ├── fig4_4_theme_by_acuity.png
│   ├── fig4_5_geographic_microclusters_map.png
│   ├── fig4_6_textfeatures_by_income.png
│   ├── fig4_7_umap_by_income.png
│   ├── fig4_8_umap_by_who_region.png
│   ├── figD1_full_topic_distribution.png
│   └── figD2_city_heatmap.png
│
├── dissertation/
│   ├── main.tex
│   ├── Abstract.tex
│   ├── introduction.tex
│   ├── literature_review.tex
│   ├── methodology.tex
│   ├── results.tex
│   ├── discussion.tex
│   ├── conclusion.tex
│   ├── references.bib
│   ├── appendix_A.tex
│   ├── appendix_B.tex
│   ├── appendix_C.tex
│   ├── appendix_D.tex
│   ├── appendix_E.tex
│   ├── appendix_project_outline.tex
│   └── appendix_risk_assessment.tex
│
├── supplementary/
│   ├── 01_topics.html
│   ├── 02_hierarchy.html
│   ├── 03_heatmap.html
│   ├── 04_barchart.html
│   ├── 05_documents.html
│   ├── bertopic_intertopic_distance.html
│   ├── map_dominant_topic_by_city.html
│   ├── heatmap_topic_by_income_category.html
│   └── heatmap_topic_by_who_region.html
│
└── presentation/
    └── MSc_Viva_Presentation.pptx
```

## Notes

- API keys must never be committed.
- `.env`, notebook checkpoints, cache files, and temporary outputs should remain ignored.
- If data cannot be shared publicly, include only anonymised or derived outputs and describe access restrictions clearly in the README.
- The dissertation PDF and viva presentation may be included only if permitted by the university submission policy.
