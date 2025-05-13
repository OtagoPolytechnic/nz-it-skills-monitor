import subprocess

# fetch all jobids from seek
subprocess.run(['scrapy', 'crawl', 'fetch_html'])

subprocess.run(['scrapy', 'crawl', 'job_spider'])