import scrapy
import random

class SeekspiderSpider(scrapy.Spider):
    name = "seekspider"
    allowed_domains = ["www.seek.co.nz"]
    start_urls = ["https://www.seek.co.nz/jobs-in-information-communication-technology"]
    
    def parse(self, response):
       pass

