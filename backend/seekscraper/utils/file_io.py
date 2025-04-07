import os
import json

def save_cleaned_html(html_content, filename='cleaned_page.html'):
    with open(filename, "w", encoding='utf-8') as f:
        f.write(html_content)

def wipe_job_ids(filename='job_ids.json'):
    if os.path.exists(filename):
        os.remove(filename)

def save_job_ids(job_listings, filename='job_ids.json'):
    existing_data = []

    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            try:
                existing_data = json.load(f)
            except json.JSONDecodeError:
                existing_data = []

    # Add only unique entries based on jobId
    existing_job_ids = {item['jobId'] for item in existing_data}
    unique_new_listings = [
        listing for listing in job_listings 
        if listing['jobId'] not in existing_job_ids
    ]

    combined_data = existing_data + unique_new_listings

    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(combined_data, f, indent=2)