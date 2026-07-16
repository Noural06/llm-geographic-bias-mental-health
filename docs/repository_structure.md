# Repository Structure

This repository accompanies the MSc Data Science dissertation:

**Does Where You Are Shape What You Get? Geographic Variation in Large Language Model Responses to Mental Health Queries**

## Directory Structure

```text
.
├── README.md                     # Project overview and usage instructions
├── LICENSE                       # MIT License
├── CITATION.cff                  # Citation metadata
├── requirements.txt              # Python dependencies
├── .env.example                  # Example environment variables
├── .gitignore                    # Git ignore rules
│
├── config/                       # Experimental configuration
│   ├── cities_20.csv
│   ├── scenarios.csv
│   └── models.yaml
│
├── data/
│   ├── raw/                      # Raw LLM responses
│   ├── processed/                # Processed datasets
│   ├── coding/                   # Human coding files
│   └── outputs/                  # Analysis outputs
│
├── src/
│   ├── 01_build_experimental_matrix.py
│   ├── 02_collect_responses.py
│   ├── 03_preprocess_responses.py
│   
│   
│
├── notebooks/
│   └── geographic_variation_analysis_VISUALS_IMPROVED.ipynb
│
├── figures/                      # Figures used in the dissertation
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
```

## Repository Components

### config/
Contains the experimental configuration files defining the cities, mental health scenarios, and language models evaluated.

### data/
Contains raw responses, processed datasets, coding files, and generated outputs used during the analysis.

### src/
Python scripts implementing the experimental pipeline, from experimental matrix generation through preprocessing and analysis.

### notebooks/
Contains the main Jupyter notebook used to reproduce the statistical analyses and figures reported in the dissertation.

### figures/
Contains publication-quality figures used in the dissertation.


### presentation/
Contains the MSc research slides presentation materials.

### dissertation/
Contains the LaTeX source files for the dissertation chapters and bibliography.

### docs/
Contains supporting project documentation, including repository documentation, reproducibility guidance, and the project journal.
