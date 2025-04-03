import json
import os

# Load the job data file
with open("job_details.json", "r", encoding="utf-8") as f:
    jobs = json.load(f)

# Make sure folder exists
folder_name = "jobs_folder"
os.makedirs(folder_name, exist_ok=True)

# Save each job to its own JSON file
for job in jobs:
    job_id = job.get("job_id", "no_id")
    title = job.get("title", "no_title").replace(" ", "_").replace("/", "-")
    filename = f"{job_id}_{title[:30]}.json"
    path = os.path.join(folder_name, filename)

    with open(path, "w", encoding="utf-8") as out_file:
        json.dump(job, out_file, indent=4, ensure_ascii=False)

print(f"✅ Split {len(jobs)} jobs into {folder_name}/")
