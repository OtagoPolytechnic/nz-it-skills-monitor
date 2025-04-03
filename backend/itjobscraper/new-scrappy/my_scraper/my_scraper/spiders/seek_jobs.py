import scrapy
import random
# Reusable XPaths for job details
XPATHS = {
    "title": '//h1[@data-automation="job-detail-title"]/text()',
    "company": '//span[@data-automation="advertiser-name"]/text()',
    "location": '//a[@data-automation="job-detail-location"]/text()',
    "description": '//div[@data-automation="jobAdDetails"]//text()',
    "job_links": '//a[@data-automation="jobTitle"]/@href',
}

def clean_html(text_list):
    return " ".join(" ".join(text_list).split())

import scrapy

class SeekJobsSpider(scrapy.Spider):
    name = "seek_jobs"
    allowed_domains = ["seek.co.nz"]
    start_urls = [
        "https://www.seek.co.nz/jobs-in-information-communication-technology"
    ]

    def start_requests(self):
        url = "https://www.seek.co.nz/jobs-in-information-communication-technology"
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
        job_titles = response.xpath('//a[@data-automation="jobTitle"]/text()').getall()
        job_links = response.xpath('//a[@data-automation="jobTitle"]/@href').getall()

        for title, link in zip(job_titles, job_links):
            job_id = link.split("/job/")[1].split("?")[0]
            full_link = response.urljoin(link)
            yield {
                "job_id": job_id,
                "title": title,
                "link": full_link
            }
