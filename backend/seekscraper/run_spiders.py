import subprocess
import sys

# fetch all jobids from seek
subprocess.run([sys.executable, '-m', 'scrapy', 'crawl', 'fetch_html'])

# fetch full description for each job
subprocess.run([sys.executable, '-m', 'scrapy', 'crawl', 'job_spider'])

# send to ChatGPT
subprocess.run([sys.executable, 'seekscraper/utils/process_openai_jobs.py'])

# save to database
subprocess.run([sys.executable, 'seekscraper/commit_openai_responses.py'])
