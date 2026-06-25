# Data Collection

### Gemini Model

Responses were collected using Google's Gemini 1.5 Flash model via the Gemini API. Gemini 1.5 Flash is a lightweight, instruction-tuned large language model developed by Google and designed to provide fast, efficient, and cost-effective text generation while maintaining strong conversational capabilities. The model is optimised for low-latency inference, making it suitable for large-scale automated data collection involving repeated prompt submissions.

In this study, the **Gemini 1.5 Flash** model was used to generate responses to mental health help-seeking prompts across 20 geographically diverse cities. Each prompt described the same mental health scenario but varied only in the user's stated location. This enabled a systematic examination of whether the model's responses differed by geographic context.

Data collection was fully automated using Python and the Gemini API. A total of **160 prompts** (20 cities × 8 scenarios) were submitted sequentially to the model. The temperature parameter was fixed at **0.0** to minimise randomness and improve response consistency across prompts. Each response was recorded immediately after generation without manual editing or modification. Along with the generated response, metadata, including the city, country, WHO region, World Bank income category, scenario identifier, model name, collection timestamp, and collection status, were stored in CSV format for subsequent qualitative and quantitative analysis.

The final Gemini dataset contained **160 successfully collected responses**, representing all city–scenario combinations with no missing or duplicate observations.

### llama-3.3-70b-versatile
Responses were collected using the Llama 3.3 70B Versatile large language model accessed through the Groq API. The model was selected because it provided stable API access and enabled the collection of a complete dataset without interruptions caused by usage restrictions or subscription requirements.

The study dataset comprised 20 cities across different World Health Organisation (WHO) regions and World Bank income categories, combined with eight mental health help-seeking scenarios. This yielded 160 unique prompts (20 cities × 8 scenarios).

Each prompt followed a standardised format in which the city and country were embedded within the scenario text (e.g., “I live in Tokyo, Japan…”). All prompts were submitted programmatically through the Groq API using the `llama-3.3-70b-versatile` model. A temperature setting of 0.0 was used to minimise randomness and maximise consistency across responses.

Responses were collected automatically and stored in CSV format, along with metadata such as city, country, income category, WHO region, scenario identifier, timestamp, model name, and response text. No manual editing or modification of model outputs was performed after collection. The final dataset contained 160 successful responses, representing all city–scenario combinations included in the study.

### The Qwen 3 32B model
A second dataset was collected using the Qwen 3 32B model (`qwen/qwen3-32b`) accessed through the Groq API. The same experimental matrix, prompt templates, metadata structure, and collection procedure used for the Llama dataset were applied to ensure comparability across models.

The dataset comprised 20 cities across different World Health Organisation (WHO) regions and World Bank income categories, combined with 8 mental health help-seeking scenarios, yielding 160 city–scenario combinations. Each prompt was submitted programmatically via the Groq API with a temperature of 0.0 to reduce response variability.

Responses were automatically stored in CSV format, along with metadata such as city, country, income category, WHO region, scenario identifier, timestamp, model name, and response text. No manual editing or modification of model outputs was performed after collection. The final Qwen dataset contained 160 successful responses, representing all city–scenario combinations included in the study.

