import scrapy


class TrademespiderSpider(scrapy.Spider):
    name = "trademespider"
    allowed_domains = ["www.trademe.co.nz"]
    start_urls = ["https://www.trademe.co.nz/a/jobs/it"]

    def parse(self, response):
        jobs = response.css('div.tm-search-results__listing')
        jobs.pop(0)
        jobs.pop(0)
        for job in jobs:
            yield{
                'url': job.css('a').attrib['href']
            }
        pass



# jobs = response.css('div.tm-search-results__listing')
# First 2 are not real
# job = jobs[2]
# url =  job.css('a').attrib['href']