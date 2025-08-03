import os
import sys

# Add project root to system path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from seekscraper.pipelines import JobDatabasePipeline
from index import app
from model import db, Job

import json

# Path to the JSON file relative to backend/
JSON_FILE = 'openai_responses.json'

pipeline = JobDatabasePipeline()

def load_json():
    with open(JSON_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def process_json_file():
    items = load_json()
    saved_count = 0
    skipped_count = 0

    for item in items:
        # Check if a job with the same source already exists
        existing_job = db.session.query(Job).filter_by(source=item.get("source")).first()
        if existing_job:
            print(f"⚠️  Skipped: Job with source {item.get('source')} already exists in the database.")
            skipped_count += 1
            continue

        pipeline.process_item(item, spider=None)
        print(f"✅ Saved job: {item.get('title') or 'UNKNOWN'} to database.")
        saved_count += 1

    print(f"\nDone. {saved_count} jobs saved. {skipped_count} duplicates skipped.")

if __name__ == '__main__':
    with app.app_context():
        process_json_file()
