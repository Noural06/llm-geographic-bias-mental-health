#### Data Collection

Responses were collected using the Llama 3.3 70B Versatile large language model accessed through the Groq API. The model was selected because it provided stable API access and enabled the collection of a complete dataset without interruptions caused by usage restrictions or subscription requirements.

The study dataset comprised 20 cities across different World Health Organisation (WHO) regions and World Bank income categories, combined with eight mental health help-seeking scenarios. This yielded 160 unique prompts (20 cities × 8 scenarios).

Each prompt followed a standardised format in which the city and country were embedded within the scenario text (e.g., “I live in Tokyo, Japan…”). All prompts were submitted programmatically through the Groq API using the `llama-3.3-70b-versatile` model. A temperature setting of 0.0 was used to minimise randomness and maximise consistency across responses.

Responses were collected automatically and stored in CSV format, along with metadata, including city, country, income category, WHO region, scenario identifier, timestamp, model name, and response text. No manual editing or modification of model outputs was performed after collection. The final dataset contained 160 successful responses, representing all city–scenario combinations included in the study.

