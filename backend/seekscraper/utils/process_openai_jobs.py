import csv
import json
import os
from openai_request import structured_output

# === File paths ===
CSV_FILE = 'job_text.csv'
JSON_FILE = 'openai_responses.json'

# === Create JSON file if it doesn't exist ===
if not os.path.exists(JSON_FILE):
    with open(JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump([], f, indent=2)

# === Load existing data ===
with open(JSON_FILE, 'r', encoding='utf-8') as f:
    try:
        openai_data = json.load(f)
    except json.JSONDecodeError:
        openai_data = []

# === Process each job from CSV ===
with open(CSV_FILE, 'r', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for i, row in enumerate(reader, 1):
        job_text = row.get('description') or row.get('text') or ''
        job_source = row.get('source') or 'seek.com'
        job_title = row.get('title') or 'Untitled'

        if not job_text.strip():
            print(f" Skipping row {i}: empty job text.")
            continue

        # Check for duplicates based on title + description
        is_duplicate = any(
            job.get('title') == job_title and job.get('description') == job_text
            for job in openai_data
        )

        if is_duplicate:
            print(f" Duplicate found in row {i}: '{job_title}' — Skipping.")
            continue

        try:
            merged_job = structured_output(job_text, job_source)
            openai_data.append(merged_job)
            print(f" Processed job {i}: '{job_title}'")
        except Exception as e:
            print(f" Failed to process row {i}: {e}")

# === Save updated data to JSON ===
with open(JSON_FILE, 'w', encoding='utf-8') as f:
    json.dump(openai_data, f, indent=2, ensure_ascii=False)

print(f"\n Done! All results saved to {JSON_FILE}")
