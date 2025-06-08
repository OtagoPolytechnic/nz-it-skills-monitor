import subprocess
import sys

# fetch all jobids from seek
subprocess.run([sys.executable, '-m', 'scrapy', 'crawl', 'fetch_html'])

subprocess.run([sys.executable, '-m', 'scrapy', 'crawl', 'job_spider'])