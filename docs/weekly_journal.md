# Does Where You Are Shape What You Get?
## Geographic Variation in Large Language Model Responses to Mental Health Queries

#### Week 7/8 Progress
#####  Dataset

The final dataset contains 1,120 AI-generated responses.

|Dimension              | Value                                                       |
------------------------|-------------------------------------------------------------|
|Cities	               |20                                                           |
|Mental health scenarios|	8                                                          |
|Language models       	|7                                                            |
|Total responses       	|1,120                                                        |
|World Bank income cat. | 4 (  High-Income,  Upper-Middle,  Lower-Middle, Low-Income).|
|WHO regions           	| 6                                                           |

#### The World Health Organisation (WHO) divides the world into six regions.

| WHO Region                       | Abbreviation | Example countries                                                   |
| -------------------------------- | ------------ | ------------------------------------------------------------------- |
| **African Region**               | **AFR**      | Nigeria, South Africa, Democratic Republic of the Congo, Madagascar |
| **Region of the Americas**       | **AMR**      | United States, Brazil, Colombia, Canada                             |
| **Eastern Mediterranean Region** | **EMR**      | Saudi Arabia, Egypt, Afghanistan, Syria                             |
| **European Region**              | **EUR**      | United Kingdom, Serbia, Ukraine, Germany                            |
| **South-East Asia Region**       | **SEAR**     | India, Nepal, Indonesia, Thailand                                   |
| **Western Pacific Region**       | **WPR**      | China, Japan, Australia, Singapore                                  |

#### My dissertation cites by WHO Region

| WHO Region                             | Cities in my  dataset                      |
| -------------------------------------- | ------------------------------------------- |
| **AFR – African Region**               | Johannesburg, Lagos, Kinshasa, Antananarivo |
| **AMR – Region of the Americas**       | New York, São Paulo, Bogotá                 |
| **EMR – Eastern Mediterranean Region** | Riyadh, Cairo, Kabul, Damascus              |
| **EUR – European Region**              | London, Belgrade, Kyiv                      |
| **SEAR – South-East Asia Region**      | Mumbai, Kathmandu                           |
| **WPR – Western Pacific Region**       | Tokyo, Sydney, Beijing, Jakarta             |

#### Each response corresponds to one unique combination of:

#### city × scenario × language model
The prompt format was:

#### I live in [City], [Country]. [Mental health scenario]

Models evaluated

#### The study evaluated seven contemporary LLMs:

Google Gemma 4 26B A4B Instruct

GPT-OSS 120B

Mistral Small 2506

Meta Llama 3.3 70B Instruct

Qwen 3 32B

Meta Llama 4 Scout 17B-16E Instruct

NVIDIA Nemotron-3 Super 120B A12B

 By holding the prompt constant ("I live in [City], [Country]. [Scenario text].") and only varying the city, I have created a controlled experiment. Any variation in model responses can be attributed to the geographic identifier alone — not to differences in how the question was asked. This is precisely what the  three research questions require.
If  the prompts were rephrased  differently, I  would introduce a confounding variable: I would no longer know whether the differences in responses were due to geography or to the wording change. The current design cleanly isolates geography as the independent variable.

This week, I completed and documented the full Natural Language Processing (NLP) analysis pipeline for my dissertation. I reviewed each stage of the analytical workflow to ensure the methodology was technically accurate, reproducible, and clearly explained within the dissertation and supporting documentation.

The pipeline began with the collection of 1,120 AI-generated mental health responses from seven large language models using standardised prompts across 20 cities. The responses were then preprocessed by removing non-user-visible reasoning traces using regular expression (Regex) techniques before semantic analysis.


Next, I generated semantic embeddings for each response using the Sentence-Transformer all-MiniLM-L6-v2 model, converting every response into a 384-dimensional numerical representation that captured semantic meaning. These embeddings were reduced using UMAP to preserve semantic relationships while lowering dimensionality, allowing efficient clustering and visualisation.

I then applied HDBSCAN to identify groups of semantically similar responses automatically without specifying the number of clusters in advance. The resulting clusters were analysed using BERTopic, which generated representative keywords and identified latent themes across the dataset.

Following topic modelling, I analysed topic distributions across World Bank income categories, WHO regions, language models, scenarios, and acuity levels. Statistical analysis was performed using Chi-square tests of independence and Cramér's V to determine whether observed differences were statistically significant and to measure the strength of the associations.

In addition to topic modelling, I implemented quantitative linguistic feature extraction to measure actionability and clinical specificity. This included calculating the frequency of action verbs, professional mental health referrals, crisis referrals, locally specific resources, and overall word counts, normalised per 1,000 words to enable fair comparison across responses.

Finally, I generated the figures, heatmaps, geographic maps, UMAP projections, and supplementary visualisations for the dissertation to clearly communicate the results.

### The complete pipeline


Raw AI-generated responses
        ↓
        
Text preprocessing using Regular Expressions (Regex)

        ↓
        
Sentence Bidirectional Encoder Representations from Transformers (Sentence-BERT; all-MiniLM-L6-v2)

        ↓
        
Uniform Manifold Approximation and Projection (UMAP)

        ↓
        
Hierarchical Density-Based Spatial Clustering of Applications with Noise (HDBSCAN)

        ↓
        
BERTopic (using Class-Based Term Frequency–Inverse Document Frequency, c-TF-IDF)

        ↓
        
Topic distribution analysis

        ↓
        
Chi-square Tests of Independence and Cramér's V Effect Size

        ↓
        
Actionability and clinical specificity feature extraction

        ↓
        
Figures, heatmaps, geographic maps, and supplementary visualisations








| Stage                    | Main Library                | Algorithm                | Input              | Output                     |
| ------------------------ | --------------------------- | ------------------------ | ------------------ | -------------------------- |
| Raw Responses            | APIs                        | LLM generation           | Prompts            | 1,120 responses            |
| Text Preprocessing       | Python Regex                | Pattern matching         | Raw text           | Clean text                 |
| Embeddings               | SentenceTransformers        | all-MiniLM-L6-v2         | Text               | 384-dimensional vectors    |
| Dimensionality Reduction | UMAP                        | Manifold learning        | 384-D vectors      | Low-dimensional embeddings |
| Clustering               | HDBSCAN                     | Density-based clustering | UMAP embeddings    | Topic clusters             |
| Topic Modelling          | BERTopic                    | c-TF-IDF + HDBSCAN       | Clusters           | 24 topics                  |
| Topic Analysis           | Pandas                      | Frequency analysis       | Topics             | Distribution tables        |
| Statistics               | SciPy                       | Chi-square, Cramér's V   | Contingency tables | p-values & effect sizes    |
| Feature Extraction       | spaCy / Python dictionaries | Rule-based NLP           | Text               | Actionability metrics      |
| Visualisation            | Plotly / Matplotlib         | Charts & maps            | Results            | Figures 4.1–4.8            |


### RQ1:  Do large language models generate systematically different mental health responses across geographic contexts?
### RQ2:   Do large language models provide less actionable or less specific mental health support in lower-resource settings compared with higher-resource settings? 
### RQ3: What implicit cultural assumptions appear in geographically contextualised mental health responses generated by large language models?





#### reference table

| Abbreviation              | Full Name                                                                    | Purpose                                                                                                            |
| ------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **LLM**                   | **Large Language Model**                                                     | Generates the AI responses analysed in the study.                                                                  |
| **NLP**                   | **Natural Language Processing**                                              | Computational techniques for analysing human language.                                                             |
| **Regex**                 | **Regular Expression**                                                       | Pattern-matching method used to clean text by removing unwanted content (e.g., `<think>` tags).                    |
| **Sentence-BERT (SBERT)** | **Sentence Bidirectional Encoder Representations from Transformers**         | Converts each response into a semantic embedding that captures meaning.                                            |
| **all-MiniLM-L6-v2**      | **Sentence-Transformer model: all-MiniLM-L6-v2**                             | The pre-trained SBERT model used to generate 384-dimensional embeddings.                                           |
| **UMAP**                  | **Uniform Manifold Approximation and Projection**                            | Reduces high-dimensional embeddings into a lower-dimensional space while preserving semantic relationships.        |
| **HDBSCAN**               | **Hierarchical Density-Based Spatial Clustering of Applications with Noise** | Automatically groups semantically similar responses into clusters and identifies outliers.                         |
| **BERTopic**              | **Bidirectional Encoder Representations from Transformers Topic Modelling**  | Topic modelling framework combining transformer embeddings, UMAP, HDBSCAN, and c-TF-IDF to identify latent topics. |
| **c-TF-IDF**              | **Class-Based Term Frequency–Inverse Document Frequency**                    | Identifies the most representative keywords within each discovered topic.                                          |
| **TF-IDF**                | **Term Frequency–Inverse Document Frequency**                                | Statistical weighting method measuring how important a word is within a document relative to the corpus.           |
| **Chi-square ((\chi^2))** | **Chi-square Test of Independence**                                          | Tests whether topic distributions differ significantly across comparison groups.                                   |
| **Cramér's V**            | **Cramér's V Effect Size**                                                   | Measures the strength of association between two categorical variables.                                            |
| **API**                   | **Application Programming Interface**                                        | Used to collect responses automatically from the language models.                                                  |
| **WHO**                   | **World Health Organization**                                                | Provides the six geographic regions used in the study.                                                             |




The findings already answer all three research questions:
### RQ1:  Do large language models generate systematically different mental health responses across geographic contexts?
#### For Research Question 1, the statistical analyses confirmed that large language models generate systematically different mental health responses across geographic contexts. Chi-square tests indicated statistically significant differences in topic distributions across both World Bank income categories and WHO regions (p < 0.001), with strong effect sizes (Cramér's V = 0.675 and 0.649, respectively). These associations were substantially stronger than the effect of language model identity (Cramér's V = 0.170), indicating that geographic context had a greater influence on response content than the choice of language model.

### RQ2:   Do large language models provide less actionable or less specific mental health support in lower-resource settings compared with higher-resource settings? 
#### For Research Question 2, the quantitative linguistic analysis showed that responses generated for lower-income settings contained less clinically specific guidance. Professional mental health references declined by 27.9%, while crisis support references declined by 47.1% from High- to Low-income cities, demonstrating reduced actionability and specificity in lower-resource contexts.

### RQ3: What implicit cultural assumptions appear in geographically contextualised mental health responses generated by large language models?
### For Research Question 3, I completed the qualitative interpretation of the BERTopic results to identify implicit cultural assumptions within geographically contextualised responses. The analysis found that models frequently associated conflict-affected cities with humanitarian framing, East Asian cities with collectivist and stigma-related themes, and several Sub-Saharan African cities with community and religious coping strategies, even when these contextual factors were not mentioned in the prompts. These findings indicate that large language models incorporate implicit geographic and cultural assumptions into their mental health guidance.



### week 6 
### Weekly Journal

#### Objectives

* Finalise automated data collection across all selected large language models.
* Validate collected datasets.
* Update the dissertation methodology to reflect the final research design.

#### Work Completed

During this week, I completed data collection for several large language models, including GPT-OSS 120B, Meta Llama 3.3 70B Instruct, Meta Llama 4 Scout 17B-16E Instruct, Qwen 3 32B, Google Gemma 4 26B A4B Instruct, and Mistral Small 2506. Each completed dataset was validated to ensure it contained 160 responses covering all 20 cities and 8 mental health scenarios, with no duplicate records or missing responses.

I also continued collecting responses using NVIDIA Nemotron-3 Super 120B A12B. The collection was partially completed, although progress was temporarily interrupted by OpenRouter's free-tier daily rate limits. Progress was saved successfully, allowing data collection to resume once the quota resets.

In addition, I reorganised the project repository, uploaded the completed datasets to GitHub, generated a combined dataset, and reviewed the file structure to ensure consistency. The methodology chapter was updated to reflect the final study design, replacing the original pilot-study description with the final multi-model data collection process.

#### Challenges Encountered

The main challenge this week was API rate limiting when collecting responses from the NVIDIA Nemotron model through OpenRouter. The limitation prevented completion of the remaining responses in a single session. Progress was preserved by saving intermediate CSV files, and the collection script was designed to resume automatically from the last successfully collected prompt.

#### Skills and Knowledge Gained

This week's work strengthened my understanding of API-based large-language-model evaluation, automated data-collection pipelines, dataset validation, GitHub version control, and reproducible research practices. I also gained experience managing multiple LLM providers while ensuring a consistent experimental design across models.

#### Plan for Next Week

* Complete the remaining NVIDIA Nemotron responses.
* Validate the final combined dataset.
* Begin qualitative coding using the developed codebook.
* Generate theme frequency tables and prepare the data for statistical analysis.
* Continue writing the Results chapter.

### Week 5 
Finalising the 20 Cities: a clean distribution across WHO regions and World Bank income groups (e.g., 5 High-Income, 5 Upper-Middle, 5 Lower-Middle, 5 Low-Income).
# Expanded Dataset Plan

| Model                               |              Responses |
| ----------------------------------- | ---------------------: |
| GPT-OSS 120B                        |                    160 |
| Meta Llama 3.3 70B Instruct         |                    160 |
| Qwen 3 32B                          |                    160 |
| Meta Llama 4 Scout 17B-16E Instruct |                    160 |
| Google Gemma 4 26B A4B Instruct     |                    160 |
| Mistral Small 2506                  |                    160 |
| NVIDIA Nemotron-3 Super 120B A12B   |                    160 |





## Total responses collected so far:                                     1,120 responses

Purpose:
To evaluate geographic variation in LLM mental health responses across different World Bank income groups and WHO regions.

### Week 3/4  
#### Data Collection
Expanded the pilot dataset by collecting responses.
Prompt	Scenario

-P1	Anxiety and Depression
-P2	Panic Attacks
-P3	Loneliness and Social Isolation
-P4	Job Loss and Financial Stress
-P5	Caregiver Burden
-P6	Chronic Insomnia
Models tested:
* GPT-4o
* Gemini
* Claude
  
Locations tested:
* London, UK
* Lagos, Nigeria

  ### Total dataset:
* 6 prompts
* 2 locations
* 3 models
* 36 responses
### Work Completed
- Completed six-prompt pilot dataset.
- Collected responses from GPT-4o, Gemini, and Claude.
- Completed London and Lagos comparisons.
- Created codebook containing ten preliminary themes.
- Produced pilot findings summary.
- Created coding matrix for formal thematic coding.

### Key Findings

- Geographic context consistently influenced recommendations.
- London responses emphasised formal healthcare pathways.
- Lagos responses emphasised NGOs, community support, and accessibility-aware guidance.
- Model-specific response styles remained stable across prompts.

## Week 2
#### Literature Review

* Continued reviewing literature on geographic bias in large language models.
* Read and analysed Decoupes et al. (2025) on geographical distortions in language models.
* Reviewed studies on regional bias, healthcare AI, mental health applications of LLMs, and evaluation frameworks.
* Expanded reference database using Google Scholar and Middlesex University Library sources.

#### Methodology Development

* Refined the research design.
* Discussed the role of thematic analysis and scoring methods.
* Identified preliminary themes emerging from model responses.

#### Pilot Experiment

* Conducted pilot testing using one standardised mental health prompt.

* Compared responses across:

  * GPT-4o
  * Gemini
  * Claude

* Tested two geographic locations:

  * London, UK
  * Lagos, Nigeria

#### Preliminary Themes Identified

1. Institutional Healthcare Navigation

   * NHS services, GP referrals, and formal care pathways.

2. Support Under Resource Constraints

   * NGOs, teletherapy, community support, accessibility barriers.

3. Behavioural Self-Management

   * Sleep, exercise, routines, symptom tracking.

4. Localised Resource Referral

   * Location-specific organisations, services, and crisis support.

### Key Findings

* All three models adapted responses according to location.
* Geographic context influenced referral pathways and healthcare assumptions.
* Different models showed distinct support styles:

  * Gemini: highly localised and resource-focused.
  * GPT-4o: analytical and behavioural.
  * Claude: balanced and practical.
* Early evidence suggests both geographic context and model characteristics affect mental health guidance.
### Week 1
* Created GitHub repository.
* Invited supervisor.
* Set up Overleaf project.
* Added references and bibliography.
* Read literature on geographic bias and mental health LLMs.

### Next Steps
* Continue literature review.
* Focus on thematic analysis.
* Continue collecting responses using additional prompts.
* Refine coding framework.
* Begin drafting the Methodology chapter.


 






