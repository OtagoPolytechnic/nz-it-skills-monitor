import subprocess

# fetch all jobids from seek
subprocess.run(['scrapy', 'crawl', 'fetch_html'])

# send one page of cleaned html to openai api and extract xpath
# subprocess.run(['python', 'scripts/get_xpath_from_html.py'])

# use xpath and run through every job page to retrieve data
# subprocess.run(['scrapy', 'crawl', 'secondspider'])