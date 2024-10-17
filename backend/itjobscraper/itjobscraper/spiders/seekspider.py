import scrapy
from itjobscraper.items import ItjobscraperItem

class SeekspiderSpider(scrapy.Spider):
    name = "seekspider"
    allowed_domains = ["www.seek.co.nz"]
    start_urls = ["https://www.seek.co.nz/jobs-in-information-communication-technology"]
    
    def parse(self, response):
        # Top level job item response 
        jobs = response.xpath('//*[@id="app"]/div/div[3]/div/section/div[2]/div/div/div[1]/div/div/div[1]/div/div/div[1]/div[3]/div')

        # Iterate through each job
        for job in jobs:
            # Use relative XPath within the 'job' context
            relative_url = job.xpath('.//div[2]/a/@href').get()
            
            if relative_url:
                job_url = f'https://www.seek.co.nz{relative_url}'
                yield response.follow(job_url, callback=self.parse_job_page)
    
    def parse_job_page(self, response):
        job_item = ItjobscraperItem()
        img = response.xpath('/html/body/div[1]/div/div[3]/div/div/div[2]/div[2]/div/div/div/div[1]/div/div[1]/div/div/div/div[1]/div/div/div/div/div/img')

        job_item['title'] = response.xpath('//*[@id="app"]/div/div[3]/div/div/div[2]/div[2]/div/div/div/div[1]/div/div[2]/div/div/div/div[1]/h1/text()').get(),
        job_item['description'] = response.xpath('string(/html/body/div[1]/div/div[3]/div/div/div[2]/div[2]/div/div/div/div[2]/div/div[1]/section/div/div/div/div)').get().strip()
        job_item['location'] = response.xpath('//*[@id="app"]/div/div[3]/div/div/div[2]/div[2]/div/div/div/div[1]/div/div[3]/div/div[1]/div/div[1]/div/div[2]/div/div/div/span/text()').get(),
        job_item['company'] = response.xpath('/html/body/div[1]/div/div[3]/div/div/div[2]/div[2]/div/div/div/div[1]/div/div[2]/div/div/div/div[2]/div/div/div[1]/button/span/text()').get(),
        job_item['duration'] = response.xpath('/html/body/div[1]/div/div[3]/div/div/div[2]/div[2]/div/div/div/div[1]/div/div[3]/div/div[1]/div/div[3]/div/div[2]/div/div/div/span/text()').get()
        job_item['category'] = response.xpath('//*[@id="app"]/div/div[3]/div/div/div[2]/div[2]/div/div/div/div[1]/div/div[3]/div/div[1]/div/div[2]/div/div[2]/div/div/div/span/text()').get()


        #     job_item['title'] = response.xpath('/html/body/div[1]/div/div[3]/div/div/div[2]/div[2]/div/div/div/div[1]/div/div[1]/div/div/div/div[1]/div/div/div[1]/h1/text()').get(),
        #     job_item['description'] = response.xpath('/html/body/div[1]/div/div[3]/div/div/div[2]/div[2]/div/div/div/div[2]/div/div[1]/section/div/div/div/div').getall(),
        #     job_item['location'] = response.xpath('/html/body/div[1]/div/div[3]/div/div/div[2]/div[2]/div/div/div/div[1]/div/div[2]/div/div[1]/div/div[1]/div/div[2]/div/div/div/span/text()').get(),
        #     job_item['company'] = response.xpath('/html/body/div[1]/div/div[3]/div/div/div[2]/div[2]/div/div/div/div[1]/div/div[1]/div/div/div/div[1]/div/div/div[2]/div/div/div[1]/button/span/text()').get(),
        #     job_item['duration'] = response.xpath('/html/body/div[1]/div/div[3]/div/div/div[2]/div[2]/div/div/div/div[1]/div/div[2]/div/div[1]/div/div[3]/div/div[2]/div/div/div/span/text()').get()
        #     job_item['category'] = response.xpath('/html/body/div[1]/div/div[3]/div/div/div[2]/div[2]/div/div/div/div[1]/div/div[2]/div/div[1]/div/div[2]/div/div[2]/div/div/div/span/text()').get()
        
        yield job_item

        