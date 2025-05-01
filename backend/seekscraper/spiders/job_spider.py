import json
import scrapy
from bs4 import BeautifulSoup
from ..utils.browser_config import CUSTOM_HEADERS
from ..utils.openai_request import structured_output

class JobSpider(scrapy.Spider):
    name = "job_spider"

    custom_headers = CUSTOM_HEADERS

    def start_requests(self):
        try:
            # Read job id from job_ids.json
            with open('job_ids.json', 'r', encoding='utf-8') as f:
                job_ids = json.load(f)
                
        except Exception as e:
            self.logger.error(f"Error reading job_ids.json: {e}")
            return

        if job_ids:
            for job_entry in job_ids:
                try:
                    job_id = job_entry['jobId']

                    headers = self.custom_headers.copy()
                    headers['User-Agent'] = self.settings.get('USER_AGENT')
                    print(f"USING USER AGENT: {headers['User-Agent']}")

                    url = f"https://www.seek.co.nz/job/{job_id}?type=standard&ref=search-standalone"
                    self.logger.info(f"Fetching URL: {url}")
                    yield scrapy.Request(url, callback=self.parse, meta={'job_id': job_id}, headers=headers)
                    
                except Exception as e:
                    self.logger.error(f"Error processing job ID {job_entry}: {e}")
        else:
            self.logger.error("No job IDs found in the file.")

    def parse(self, response):
        try:
            soup = BeautifulSoup(response.text, 'html.parser')

            for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'svg', 'head', 'img']):
                tag.decompose()
                
        except Exception as e:
            self.logger.error(f"Error parsing response for job ID {response.meta.get('job_id', 'unknown')}: {e}")
            return

        job_id = response.meta.get('job_id', 'unknown')
        self.logger.info("Page fetched successfully.")

        job_text = soup.get_text(separator=" ", strip=True)

        try:
            res = structured_output(job_text)
            self.logger.info(f"Structured output for job ID {job_id}: {res}")
            yield res
        except Exception as e:
            self.logger.error(f"Error processing structured output for job ID {job_id}: {e}")
            