import subprocess
import sys

def run_all_spiders():
    print("🔄 Running: fetch_html")
    subprocess.run([sys.executable, "-m", "scrapy", "crawl", "fetch_html"], check=True)

    print("🔄 Running: job_spider")
    subprocess.run([sys.executable, "-m", "scrapy", "crawl", "job_spider"], check=True)

    print("🔄 Running: process_openai_jobs.py")
    subprocess.run([sys.executable, "seekscraper/utils/process_openai_jobs.py"], check=True)

    print("🔄 Running: commit_openai_responses.py")
    subprocess.run([sys.executable, "seekscraper/commit_openai_responses.py"], check=True)

if __name__ == "__main__":
    run_all_spiders()
