import scrapy
import re

class SeekJobSpider(scrapy.Spider):
    name = "seek_jobs"
    allowed_domains = ["seek.co.nz"]
    start_urls = ["https://www.seek.co.nz/jobs-in-information-communication-technology"]

    def parse(self, response):
        # Extract job links
        job_links = response.css('a[data-automation="jobTitle"]::attr(href)').getall()

        for link in job_links:
            job_id = re.search(r'/job/(\d+)', link)
            if job_id:
                full_url = response.urljoin(link)
                yield scrapy.Request(
                    url=full_url,
                    callback=self.parse_job_details,
                    meta={"job_id": job_id.group(1)}
                )

        # Handle pagination
        next_page = response.css('a[data-automation="page-next"]::attr(href)').get()
        if next_page:
            yield response.follow(next_page, self.parse)

    def parse_job_details(self, response):
        yield {
            "job_id": response.meta.get("job_id"),
            "title": response.css('h1[data-automation="job-detail-title"]::text').get(),
            "company": response.css('span[data-automation="advertiser-name"]::text').get(),
            "location": response.css('a[data-automation="job-detail-location"]::text').get(),
            "description": response.css('div[data-automation="jobAdDetails"] *::text').getall(),
            "url": response.url,
        }
