# Data Collection

## Google Gemini

Responses were collected using **Google Gemini** via the **Google Gemini API (Google AI Studio)**. Gemini is a family of instruction-tuned large language models developed by **Google DeepMind** for conversational AI, reasoning, instruction following, and natural language generation. The specific model used in this study was **the version recorded in the final dataset metadata** (e.g., `gemini-1.5-pro` or `gemini-2.5-flash`, depending on the final API deployment).

The model generated responses to mental health help-seeking prompts across 20 geographically diverse cities. Each prompt contained the same mental health scenario, with the only intended variation being the user's stated city and country, allowing systematic examination of potential geographic variation in model behaviour.

Data collection was fully automated using Python and the Gemini API. A total of **160 prompts** (20 cities × 8 scenarios) were submitted sequentially. The temperature parameter was fixed at **0.0** to minimise response variability and maximise reproducibility. Responses were recorded immediately after generation without manual editing or post-processing. Metadata, including city, country, WHO region, World Bank income category, scenario identifier, model name, provider, timestamp, response status, and generated response, were automatically stored in CSV format.

The final Gemini dataset contained **160 successfully collected responses**, representing all city–scenario combinations without missing or duplicate observations.

---

## GPT-OSS 120B

Responses were collected using **GPT-OSS 120B** (`openai/gpt-oss-120b`), an **open-weight instruction-tuned large language model released by OpenAI** and accessed through the **Groq API**. GPT-OSS 120B is designed for conversational AI, reasoning, instruction following, and long-form text generation. The Groq platform provides accelerated inference using specialised Language Processing Unit (LPU) hardware, enabling rapid large-scale response generation.

The identical experimental design was used across all models. The dataset consisted of **20 cities** spanning multiple WHO regions and World Bank income categories, combined with **8 mental health help-seeking scenarios**, producing **160 unique prompts**.

Responses were collected automatically using Python with the temperature fixed at **0.0**. Each generated response was stored immediately, along with metadata including the city, country, WHO region, World Bank income category, scenario identifier, model name, provider, timestamp, response status, and the  generated response. No manual editing or post-processing of outputs was performed.

The final GPT-OSS 120B dataset contained **160 successfully collected responses**, representing every city–scenario combination. Temporary API rate limits occurred during collection and were resolved by retrying only the affected prompts after the provider's quota reset.

---

## Meta Llama 3.3 70B Instruct

Responses were collected using **Meta Llama 3.3 70B Instruct**, deployed through the **Groq API** under the deployment identifier **`llama-3.3-70b-versatile`**. Developed by **Meta AI**, Llama 3.3 70B is an instruction-tuned large language model designed for conversational AI, instruction following, reasoning, and natural language generation.

The same experimental matrix was used, consisting of **20 cities** and **8 mental health scenarios**, yielding **160 prompts**. All prompts were submitted programmatically using Python with the temperature fixed at **0.0**.

Responses were recorded automatically, along with metadata including the city, country, WHO region, World Bank income category, scenario identifier, model name, provider, timestamp, response status, and the generated response. No manual editing of responses was performed after collection.

The final Llama 3.3 dataset contained **160 successful responses**, representing all city–scenario combinations.

---

## Qwen 3 32B

Responses were collected using **Qwen 3 32B** (`qwen/qwen3-32b`), an instruction-tuned large language model developed by the **Qwen Team at Alibaba Cloud** and accessed through the **Groq API**. Qwen 3 32B is designed for multilingual natural language understanding, reasoning, conversational AI, and instruction following.

The same automated collection pipeline, prompt templates, metadata structure, and experimental design used for the previous models were applied to ensure comparability. The dataset consisted of **160 prompts** generated from 20 cities and 8 mental health scenarios.

The model temperature was fixed at **0.0**, and responses were collected automatically using Python. Generated responses and associated metadata were stored immediately in CSV format without manual modification.

The final Qwen dataset contained **160 successfully collected responses**, representing every city–scenario combination included in the study.

---

## Meta Llama 4 Scout 17B-16E Instruct

Responses were collected using **Meta Llama 4 Scout 17B-16E Instruct** (`meta-llama/llama-4 Scout-17b-16e-instruct`), an instruction-tuned large language model developed by **Meta AI** and accessed through the **Groq API**. Llama 4 Scout is a member of Meta's fourth-generation Llama family and is designed for instruction following, reasoning, and conversational text generation.

The model was configured with a **temperature of 0.0**, and **160 prompts** were submitted sequentially using the same automated Python collection pipeline employed throughout the study. Responses were recorded immediately after generation, along with metadata, including city, country, WHO region, World Bank income category, scenario identifier, model name, provider, timestamp, response status, and the generated response.

The final Llama 4 Scout dataset contained **160 successfully collected responses**, representing all city–scenario combinations without missing observations.

---

## NVIDIA Nemotron-3 Super 120B A12B

Responses were collected using **NVIDIA Nemotron-3 Super 120B A12B** (`nvidia/nemotron-3-super-120b-a12b`), an instruction-tuned large language model developed by **NVIDIA** and accessed through the **OpenRouter API**. OpenRouter provides unified API access to models hosted by multiple providers while maintaining a standard OpenAI-compatible interface.

Nemotron-3 Super 120B A12B is designed for conversational AI, reasoning, instruction following, and natural language generation. The same experimental matrix of **20 cities** and **8 mental health help-seeking scenarios** was used, producing **160 prompts**.

Data collection was fully automated using Python. The temperature parameter was fixed at **0.0** to maximise response consistency. Responses and associated metadata were automatically stored in CSV format immediately after generation, without manual editing or post-processing.

During collection, OpenRouter's free-tier daily request quota resulted in temporary interruptions. Collection resumed after the quota reset, with only the remaining prompts submitted on subsequent sessions until all **160 city–scenario combinations** had been successfully collected.

