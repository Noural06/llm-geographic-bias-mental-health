import os
import time
import pandas as pd
from pathlib import Path
from datetime import datetime, timezone
from google import genai

BASE_DIR = Path(__file__).resolve().parent.parent

RESPONSES_PATH = BASE_DIR / "data" / "raw" / "responses_gemini.csv"
MODEL_NAME = "gemini-3.5-flash"
MAX_NEW_SUCCESSES = 15

def query_gemini(client, prompt):
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )
    return response.text

def main():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found.")

    client = genai.Client(api_key=api_key)

    df = pd.read_csv(RESPONSES_PATH)

    print(df["status"].value_counts())

    failed_indexes = df[df["status"] != "success"].index.tolist()
    print(f"Rows left to retry: {len(failed_indexes)}")

    new_successes = 0

    for i in failed_indexes:
        if new_successes >= MAX_NEW_SUCCESSES:
            break

        row = df.loc[i]
        print(f"Retrying {row['matrix_id']}")

        try:
            response_text = query_gemini(client, row["prompt"])
            df.loc[i, "response_text"] = response_text
            df.loc[i, "status"] = "success"
            df.loc[i, "error_message"] = ""
            df.loc[i, "collection_timestamp"] = datetime.now(timezone.utc).isoformat()
            df.loc[i, "actual_model_used"] = MODEL_NAME
            new_successes += 1
            print("success")
        except Exception as e:
            df.loc[i, "status"] = "error"
            df.loc[i, "error_message"] = str(e)
            print("error")

        df.to_csv(RESPONSES_PATH, index=False, encoding="utf-8")
        time.sleep(10)

    print("Run finished.")
    print(df["status"].value_counts())

if __name__ == "__main__":
    main()
