import scrapy


class TrademespiderSpider(scrapy.Spider):
    name = "trademespider"
    allowed_domains = ["www.trademe.co.nz"]
    start_urls = ["https://www.trademe.co.nz/a/jobs/it"]

    def parse(self, response):
        pass
