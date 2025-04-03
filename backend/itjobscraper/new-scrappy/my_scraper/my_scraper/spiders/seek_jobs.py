import scrapy
import random

# Reusable XPaths for job details
XPATHS = {
    "title": '//h1[@data-automation="job-detail-title"]/text()',
    "company": '//span[@data-automation="advertiser-name"]/text()',
    "location": '//span[@data-automation="job-detail-location"]/a/text()',
    "description": '//div[@data-automation="jobAdDetails"]//text()',
    "job_links": '//a[@data-automation="jobTitle"]/@href',
}

def clean_html(text_list):
    return " ".join(" ".join(text_list).split())

class SeekJobsSpider(scrapy.Spider):
    name = "seek_jobs"
    allowed_domains = ["seek.co.nz"]
    start_urls = [
        "https://www.seek.co.nz/jobs-in-information-communication-technology"
    ]

    def start_requests(self):
        for url in self.start_urls:
            headers = {
                'User-Agent': random.choice(self.settings.get('USER_AGENTS_LIST')),
                'Accept': self.settings.get('DEFAULT_REQUEST_HEADERS')['Accept'],
                'Accept-Language': self.settings.get('DEFAULT_REQUEST_HEADERS')['Accept-Language'],
                'Referer': self.settings.get('DEFAULT_REQUEST_HEADERS')['Referer'],
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            }
            yield scrapy.Request(url=url, headers=headers, callback=self.parse)

    def parse(self, response):
        job_links = response.xpath(XPATHS["job_links"]).getall()
        for link in job_links:
            if "/job/" in link:
                job_id = link.split("/job/")[1].split("?")[0]
                full_url = response.urljoin(link)

                headers = {
                    'User-Agent': random.choice(self.settings.get('USER_AGENTS_LIST')),
                    'Referer': response.url,
                }

                yield scrapy.Request(
                    url=full_url,
                    callback=self.parse_job_details,
                    headers=headers,
                    meta={"job_id": job_id}
                )

    def parse_job_details(self, response):
        job_id = response.meta["job_id"]
        title = response.xpath(XPATHS["title"]).get()
        company = response.xpath(XPATHS["company"]).get()
        location = response.xpath(XPATHS["location"]).get()
        description = clean_html(response.xpath(XPATHS["description"]).getall())

        yield {
            "job_id": job_id,
            "title": title,
            "company": company,
            "location": location,
            "description": description,
        }
