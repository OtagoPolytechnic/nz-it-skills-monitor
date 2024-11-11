# nz-it-skills-monitor
## scrapy set up
- activate chosen virtual enviroment
- pip install the followoing packages:
  - scrapy
  - ipython
  - openai
  - python-dotenv
  - psycopg2-binary
  - python-dotenv
- put env file into root directory
- cd into backend/itjobscraper/itjobscraper
- to run spiders use command "scrapy crawl trademespider" or "scrapy crawl seekspider"
- both trademe and seek scraped data will output to trademedata.json file, this file is overwritten at the start of a crawl.

## Knowen issues
- currently, seek spider misses some unused data categories, this data will return as "None". 
Here’s a more polished version of your README instructions:

## Running Locally

1. Open a terminal window.
2. Navigate to the frontend folder using `cd`.
3. If this is your first time setting up the project, install the necessary dependencies by running:
   ```
   npm install
   ```
4. Once the installation is complete, start the application with:
   ```
   npm run dev
   ```
5. The terminal will display the URL where the application is running (e.g., `http://localhost:5173/`). Open this URL by holding `Ctrl` and clicking on the link.