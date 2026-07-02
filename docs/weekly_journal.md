# Weekly Progress Report
## Dissertation Title

# Does Where You Are Shape What You Get? Geographic Variation in Large Language Model Responses to Mental Health Queries

## Objectives Completed This Week
Completed automated collection of the full experimental dataset.
Cleaned all responses prior to Natural Language Processing (NLP) analysis.

## Dataset
20 Cities
8 Mental Health Scenarios
7 Large Language Models
1,120 AI-generated responses


#  Geographic Variation in Large Language Model Responses to Mental Health Queries.
## Weekly Journal

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


 






