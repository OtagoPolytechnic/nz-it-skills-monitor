import scrapy

class SeekFetchSpider(scrapy.Spider):
    name = "seek_html"
    allowed_domains = ["seek.co.nz"]
    start_urls = ["https://www.seek.co.nz/jobs-in-information-communication-technology"]

    def parse(self, response):
        with open("seek_it_jobs.html", "w", encoding="utf-8") as f:
            f.write(response.text)
        self.log("Page HTML saved as seek_it_jobs.html")
