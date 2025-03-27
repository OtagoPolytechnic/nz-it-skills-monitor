import scrapy

class SeekSpider(scrapy.Spider):
    name = "seekspider"
    allowed_domains = ["seek.co.nz"]
    start_urls = [
        f"https://www.seek.co.nz/jobs-in-information-communication-technology?page={i}"
        for i in range(1, 6)
    ]

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(
                url,
                meta={"playwright": True},
                callback=self.parse
            )

    def parse(self, response):
        for job in response.css("article"):
            job_link = response.urljoin(job.css("a[data-automation='jobTitle']::attr(href)").get())
            yield scrapy.Request(
                job_link,
                meta={"playwright": True},
                callback=self.parse_job_detail
            )

    def parse_job_detail(self, response):
        salary = response.css("span[data-automation='job-detail-salary']::text").get(default="N/A")
        print("💵 Scraped salary (from detail):", salary)

        yield {
            "title": response.css("h1 span[data-automation='job-detail-title']::text").get(default="N/A"),
            "company": response.css("span[data-automation='advertiser-name']::text").get(default="N/A"),
            "location": response.css("span[data-automation='job-detail-location']::text").get(default="N/A"),
            "salary": salary,
            "description": ' '.join(response.css("div[data-automation='jobAdDetails'] *::text").getall()).strip(),
            "link": response.url,
            "source": "seek",
        }
