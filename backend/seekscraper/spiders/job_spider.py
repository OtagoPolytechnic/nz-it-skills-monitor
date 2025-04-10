import json
import scrapy
from bs4 import BeautifulSoup
from ..utils.browser_config import CUSTOM_HEADERS

class JobSpider(scrapy.Spider):
    name = "job_spider"

    custom_headers = CUSTOM_HEADERS

    def start_requests(self):
        # Read job id from job_ids.json
        with open('job_ids.json', 'r', encoding='utf-8') as f:
            job_ids = json.load(f)

        if job_ids:
            job_entry = job_ids[0]
            job_id = job_entry['jobId']

            headers = self.custom_headers.copy()
            headers['User-Agent'] = self.settings.get('USER_AGENT')
            print(f"USING USER AGENT: {headers['User-Agent']}")

            url = f"https://www.seek.co.nz/job/{job_id}?type=standard&ref=search-standalone"
            self.logger.info(f"Fetching URL: {url}")
            yield scrapy.Request(url, callback=self.parse, meta={'job_id': job_id}, headers=headers)
        else:
            self.logger.error("No job IDs found in the file.")

    def parse(self, response):
        soup = BeautifulSoup(response.text, 'html.parser')

        for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'svg', 'head', 'img']):
            tag.decompose()

        job_id = response.meta.get('job_id', 'unknown')
        self.logger.info("Page fetched successfully.")
        file_name = f"job_{job_id}.html"
        with open(file_name, 'w', encoding='utf-8') as f:
            f.write(soup.get_text(separator=" ", strip=True))
        self.logger.info(f"HTML content saved to {file_name}")