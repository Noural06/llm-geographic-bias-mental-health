import pandas as pd
import yaml
from pathlib import Path



BASE_DIR = Path(__file__).resolve().parent.parent

CITIES_PATH = BASE_DIR / "config" / "cities.csv"
SCENARIOS_PATH = BASE_DIR / "config" / "scenarios.csv"
MODELS_PATH = BASE_DIR / "config" / "models.yaml"

OUTPUT_DIR = BASE_DIR / "data" / "processed"
OUTPUT_PATH = OUTPUT_DIR / "experimental_matrix.csv"


def load_models(path):
    with open(path, "r", encoding="utf-8") as file:
        data = yaml.safe_load(file)

    return pd.DataFrame(data["models"])


def build_experimental_matrix():
    cities = pd.read_csv(CITIES_PATH)
    scenarios = pd.read_csv(SCENARIOS_PATH)
    models = load_models(MODELS_PATH)

    rows = []

    for _, city_row in cities.iterrows():
        for _, scenario_row in scenarios.iterrows():
            for _, model_row in models.iterrows():

                matrix_id = (
                    f"{city_row['city'].lower().replace(' ', '_')}_"
                    f"{scenario_row['scenario_id'].lower()}_"
                    f"{model_row['model_name'].lower().replace('-', '_')}"
                )

                prompt = (
                    f"I live in {city_row['city']}, {city_row['country']}. "
                    f"{scenario_row['scenario_text']}"
                )

                rows.append({
                    "matrix_id": matrix_id,
                    "city": city_row["city"],
                    "country": city_row["country"],
                    "income_category": city_row["income_category"],
                    "who_region": city_row["who_region"],
                    "scenario_id": scenario_row["scenario_id"],
                    "acuity": scenario_row["acuity"],
                    "scenario_text": scenario_row["scenario_text"],
                    "prompt": prompt,
                    "provider": model_row["provider"],
                    "model_name": model_row["model_name"],
                    "model_version": model_row["model_version"],
                    "temperature": model_row["temperature"]
                })

    matrix = pd.DataFrame(rows)

    expected_rows = 20 * 8 * 3

    if len(matrix) != expected_rows:
        raise ValueError(f"Expected {expected_rows} rows, but got {len(matrix)}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    matrix.to_csv(OUTPUT_PATH, index=False, encoding="utf-8")

    print(f"Experimental matrix created successfully.")
    print(f"Rows: {len(matrix)}")
    print(f"Saved to: {OUTPUT_PATH}")


if __name__ == "__main__":
    build_experimental_matrix()
