import scrapy

class SeekSpider(scrapy.Spider):
    name = "seek"
    allowed_domains = ["seek.co.nz"]
    start_urls = ["https://www.seek.co.nz/jobs-in-information-communication-technology"]

    def parse(self, response):
        for job in response.css("article"):
            yield {
                "title": job.css('a[data-automation="jobTitle"]::text').get(),
                "company": job.css('a[data-automation="jobCompany"]::text').get(),
                "location": job.css('a[data-automation="jobLocation"]::text').get(),
                "link": response.urljoin(job.css('a[data-automation="jobTitle"]::attr(href)').get()),
            }

        # Pagination: Follow the "Next" page
        next_page = response.css('a[data-automation="page-next"]::attr(href)').get()
        if next_page:
            yield response.follow(next_page, self.parse)
