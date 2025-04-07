import scrapy
from bs4 import BeautifulSoup
import json
import random
import time
from ..utils.file_io import save_cleaned_html, save_job_ids, wipe_job_ids
from ..utils.browser_config import CUSTOM_HEADERS, USER_AGENTS
from ..utils.url_utils import get_current_page, get_next_page_url

class FetchHtmlSpider(scrapy.Spider):
    name = 'fetch_html'

    # Default parameters
    max_pages = 2  # Default: scrape up to 2 pages
    max_job_ids = 30  # Default: collect up to 30 job IDs per page

    start_urls = ['https://www.seek.co.nz/jobs-in-information-communication-technology']  # Starting URL for listings

    custom_headers = CUSTOM_HEADERS
    user_agents = USER_AGENTS

    def __init__(self, max_pages=None, max_job_ids=None, *args, **kwargs):
        super(FetchHtmlSpider, self).__init__(*args, **kwargs)

        # Set max_pages and max_job_ids from the command-line arguments if provided
        if max_pages is not None:
            self.max_pages = int(max_pages)
        if max_job_ids is not None:
            self.max_job_ids = int(max_job_ids)

    def start_requests(self):
        headers = self.custom_headers.copy()
        headers['User-Agent'] = random.choice(self.user_agents)
        print(f"USING USER AGENT: {headers['User-Agent']}")
        yield scrapy.Request(self.start_urls[0], headers=headers)

    def parse(self, response):
        # Add random delay between requests
        time.sleep(random.uniform(2, 5))

        # Step 1: Clean the HTML by removing unwanted elements
        soup = BeautifulSoup(response.text, 'html.parser')

        # Remove unnecessary tags like script, style, nav, footer, header, svg, head
        for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'svg', 'head', 'img']):
            tag.decompose()

        for tag in soup.find_all(True):
            tag.attrs = {key: value for key, value in tag.attrs.items() if key not in ["class", "id"]}

        formatted_html = soup.prettify()
        save_cleaned_html(formatted_html)

        # Step 2: Extract job IDs from the page
        job_listings = self.extract_job_ids(soup)

        # Debugging: Log the extracted job IDs to see what is being captured
        self.logger.debug(f"Extracted job listings: {job_listings}")

        # Step 3: If no job IDs are found, stop the scrape
        if not job_listings:
            self.logger.info("No job IDs found on this page, ending the scrape.")
            return  # Stops the spider from continuing to the next page

        # Step 4: Save the job IDs to a file
        save_job_ids(job_listings)

        # Step 5: Handle pagination by incrementing the page number
        current_page = get_current_page(response.url)
        if current_page >= self.max_pages:
            self.logger.info(f"Reached the maximum number of pages ({self.max_pages}), stopping.")
            return  # Stop if we've reached the max number of pages

        next_page_url = get_next_page_url(response.url)
        if next_page_url:
            headers = self.custom_headers.copy()
            headers['User-Agent'] = random.choice(self.user_agents)
            yield scrapy.Request(
                next_page_url, 
                callback=self.parse,
                headers=headers,
                dont_filter=True,
                meta={
                    'dont_retry': False,
                    'max_retries': 3
                }
            )

    def extract_job_ids(self, soup):
        """Extract job listings from tags containing both 'jobid' and 'token'."""
        def contains_both_jobid_and_token(tag):
            """Check if a tag contains both 'jobid' and 'token' in any attribute value."""
            found_jobid = found_token = False

            for attr_value in tag.attrs.values():
                if isinstance(attr_value, str):  # Ensure the attribute value is a string
                    lower_attr = attr_value.lower()
                    if "jobid" in lower_attr:
                        found_jobid = True
                    if "token" in lower_attr:
                        found_token = True

                if found_jobid and found_token:  # Stop early if both are found
                    return True

            return False

        # Find all tags that contain both "jobid" and "token"
        matching_tags = soup.find_all(contains_both_jobid_and_token)

        job_listings = []
        for tag in matching_tags:
            try:
                # Attempt to parse JSON from the tag's attributes if applicable
                for attr_value in tag.attrs.values():
                    if isinstance(attr_value, str) and "jobid" in attr_value.lower() and "token" in attr_value.lower():
                        meta_data = json.loads(attr_value)
                        job_listing = {
                            'jobId': meta_data['jobId'],
                            'searchRequestToken': meta_data['searchRequestToken'].replace('-', '')
                        }
                        job_listings.append(job_listing)

                        # Stop if max_job_ids is reached
                        if len(job_listings) >= self.max_job_ids:
                            return job_listings
            except (json.JSONDecodeError, KeyError) as e:
                self.logger.error(f"Error processing tag: {e}")

        return job_listings
