
.
├── README.md
├── LICENSE
├── CITATION.cff
├── requirements.txt
├── .env.example
├── .gitignore
│
├── config/
│   ├── cities_20.csv
│   ├── scenarios.csv
│   └── models.yaml
│
├── data/
│   ├── raw/
│   ├── processed/
│   ├── coding/
│   └── outputs/
│
├── src/
│   ├── 01_build_experimental_matrix.py
│   ├── 02_collect_responses.py
│   ├── 03_preprocess_responses.py
│   ├── 04_extract_embeddings.py        (only if used)
│   └── 05_bertopic_analysis.py         (only if used)
│
├── notebooks/
│   └── Geographic_variation_analysis_VISUALS.ipynb
│
├── figures/
│   ├── figure1.png
│   ├── figure2.png
│   └── figure3.png
│
│
├── Presentation/
│   ├── presentation_slides.pdf
│   └── research_design_presentation.pdf
│
├── dissertation/
│   ├── main.tex
│   ├── introduction.tex
│   ├── literature.tex
│   ├── methodology.tex
│   ├── results.tex
│   ├── discussion.tex
│   ├── conclusion.tex
│   ├── references.bib
│   └── appendices/
│
└── docs/
    ├── repository_structure.md
    ├── reproducibility_checklist.md
    └── weekly_journal.md
