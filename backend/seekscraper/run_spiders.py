import subprocess
import sys

# fetch all jobids from seek
subprocess.run([sys.executable, '-m', 'scrapy', 'crawl', 'fetch_html'])

subprocess.run([sys.executable, '-m', 'scrapy', 'crawl', 'job_spider'])

subprocess.run([sys.executable, 'seekscraper/utils/process_openai_jobs.py'])

subprocess.run([sys.executable, 'seekscraper/commit_openai_responses.py'])