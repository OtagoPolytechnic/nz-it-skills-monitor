# nz-it-skills-monitor
## scrapy set up
- activate chosen virtual enviroment
- pip install the followoing packages:
  - scrapy
  - ipython
  - openai
  - python-dotenv
  - psycopg2-binary
- put env file into root directory
- cd into backend/itjobscraper/itjobscraper
- to run spiders use command "scrapy crawl trademespider" or "scrapy crawl seekspider"
- both trademe and seek scraped data will output to trademedata.json file, this file is overwritten at the start of a crawl.

## Knowen issues
- currently, seek spider misses some unused data categories, this data will return as "None". 
