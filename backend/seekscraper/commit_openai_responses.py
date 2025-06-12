import os
import sys

# This forces Python to see project root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from seekscraper.pipelines import JobDatabasePipeline
from index import app
from model import db

import json

# Path to your openai_responses.json file (relative to backend/)
JSON_FILE = 'openai_responses.json'

pipeline = JobDatabasePipeline()

def load_json():
    with open(JSON_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def process_json_file():
    items = load_json()
    for item in items:
        pipeline.process_item(item, spider=None)

if __name__ == '__main__':
    with app.app_context():
        process_json_file()
