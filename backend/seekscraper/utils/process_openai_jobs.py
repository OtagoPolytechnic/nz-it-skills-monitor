import csv
import json
import os
import logging
from openai_request import structured_output

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger(__name__)

# === File paths ===
CSV_FILE = 'job_text.csv'
JSON_FILE = 'openai_responses.json'

# === Create JSON file if it doesn't exist ===
if not os.path.exists(JSON_FILE):
    with open(JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump([], f, indent=2)
    logger.info(f"Created new JSON file: {JSON_FILE}")

# === Load existing data ===
with open(JSON_FILE, 'r', encoding='utf-8') as f:
    try:
        openai_data = json.load(f)
        logger.info(f"Loaded {len(openai_data)} existing jobs from {JSON_FILE}")
    except json.JSONDecodeError:
        openai_data = []
        logger.warning(f"JSON decode error in {JSON_FILE}, starting with empty list.")

# === Process each job from CSV ===
with open(CSV_FILE, 'r', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for i, row in enumerate(reader, 1):
        job_text = str(row.get('description') or "")
        job_source = str(row.get('source') or "")

        if not job_text or not job_text.strip():
            logger.info(f"Skipping row {i}: empty job text.")
            continue

        is_duplicate = any(
            job.get('source') == job_source
            for job in openai_data
        )

        if is_duplicate:
            logger.info(f"Duplicate found in row {i}: '{job_source}' — Skipping.")
            continue

        try:
            merged_job = structured_output(job_text, job_source)
            openai_data.append(merged_job)
            logger.info(f"Processed job {i}: '{job_source}'")
        except Exception as e:
            logger.error(f"Failed to process row {i}: {e}")

# === Save updated data to JSON ===
with open(JSON_FILE, 'w', encoding='utf-8') as f:
    json.dump(openai_data, f, indent=2, ensure_ascii=False)
    logger.info(f"Saved {len(openai_data)} jobs to {JSON_FILE}")

print(f"\n Done! All results saved to {JSON_FILE}")
