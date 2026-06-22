### Data Collection Procedure

Data collection was conducted using three large language models: ChatGPT (OpenAI), Claude (Anthropic), and Gemini (Google).

The study employed a structured prompt matrix consisting of 20 cities and 8 mental-health scenarios. Cities were selected to represent a range of World Health Organization (WHO) regions and World Bank income categories. Each prompt followed the format:

"I live in [City], [Country]. [Mental health scenario]"

Data collection was completed in batches organised by income category:

**Batch 1 – High-Income Cities**

* London (United Kingdom)
* New York (United States)
* Tokyo (Japan)
* Sydney (Australia)
* Riyadh (Saudi Arabia)

**Batch 2 – Upper-Middle-Income Cities**

* São Paulo (Brazil)
* Beijing (China)
* Johannesburg (South Africa)
* Bogotá (Colombia)
* Belgrade (Serbia)

**Batch 3 – Lower-Middle-Income Cities**

* Lagos (Nigeria)
* Mumbai (India)
* Cairo (Egypt)
* Jakarta (Indonesia)
* Kyiv (Ukraine)

**Batch 4 – Low-Income Cities**

* Kinshasa (DR Congo)
* Kabul (Afghanistan)
* Kathmandu (Nepal)
* Antananarivo (Madagascar)
* Damascus (Syria)

For ChatGPT and Claude, responses were collected through live web-based chat sessions. Prompts were submitted sequentially within a single conversation for each model. Each response was recorded immediately after generation and stored verbatim. No responses were edited, rewritten, paraphrased, shortened, expanded, corrected, standardised, or otherwise modified after collection.

Because prompts were submitted within an ongoing conversation, the models retained awareness of previous prompts and the broader research context. Consequently, the collected outputs represent authentic model responses generated within a shared conversational environment rather than independent prompt-response transactions.

For Gemini, responses were collected programmatically through the Gemini API after successful API configuration. Prompts were submitted automatically and responses were stored directly from the API output without manual modification.

### Methodological Limitations

A limitation of the study is that responses from ChatGPT and Claude were collected in a sequential conversational context. As a result, the models may have retained information from earlier prompts and been aware that the interaction was part of a research exercise. Therefore, these responses should not be interpreted as equivalent to independent API calls or fresh-session prompt submissions.

In contrast, Gemini responses were collected through the API and therefore represent independent prompt-response transactions. This difference in collection methodology is acknowledged when interpreting results.

### Metadata Stored With Each Observation

For each response, the following metadata were stored:

* City
* Country
* Income category
* WHO region
* Scenario ID
* Acuity level
* Model provider
* Model name
* Collection method
* Prompt text
* Response text

ChatGPT Collection Method:
live_chat_sequential_unedited

Claude Collection Method:
live_chat_sequential_unedited

Gemini Collection Method:
api_independent
