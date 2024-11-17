import scrapy
from itjobscraper.items import ItjobscraperItem

class SeekspiderSpider(scrapy.Spider):
    name = "seekspider"
    allowed_domains = ["www.seek.co.nz"]
    #all these urls are here because seek 'lazy-loads' their pagination task bar. to automate this in the future use scrapy + selenium
    start_urls = ["https://www.seek.co.nz/jobs-in-information-communication-technology", 'https://www.seek.co.nz/jobs-in-information-communication-technology?page=2', 'https://www.seek.co.nz/jobs-in-information-communication-technology?page=3', 'https://www.seek.co.nz/jobs-in-information-communication-technology?page=4', 'https://www.seek.co.nz/jobs-in-information-communication-technology?page=5',
                  'https://www.seek.co.nz/jobs-in-information-communication-technology?page=6', 'https://www.seek.co.nz/jobs-in-information-communication-technology?page=7', 'https://www.seek.co.nz/jobs-in-information-communication-technology?page=8',
                  'https://www.seek.co.nz/jobs-in-information-communication-technology?page=9', 'https://www.seek.co.nz/jobs-in-information-communication-technology?page=10', 'https://www.seek.co.nz/jobs-in-information-communication-technology?page=11',
                  'https://www.seek.co.nz/jobs-in-information-communication-technology?page=12', 'https://www.seek.co.nz/jobs-in-information-communication-technology?page=13', 'https://www.seek.co.nz/jobs-in-information-communication-technology?page=14',
                  'https://www.seek.co.nz/jobs-in-information-communication-technology?page=15', 'https://www.seek.co.nz/jobs-in-information-communication-technology?page=16', 'https://www.seek.co.nz/jobs-in-information-communication-technology?page=17',
                  'https://www.seek.co.nz/jobs-in-information-communication-technology?page=18', 'https://www.seek.co.nz/jobs-in-information-communication-technology?page=19', 'https://www.seek.co.nz/jobs-in-information-communication-technology?page=20',
                  'https://www.seek.co.nz/jobs-in-information-communication-technology?page=21', 'https://www.seek.co.nz/jobs-in-information-communication-technology?page=22', 'https://www.seek.co.nz/jobs-in-information-communication-technology?page=23',
                  'https://www.seek.co.nz/jobs-in-information-communication-technology?page=24', 'https://www.seek.co.nz/jobs-in-information-communication-technology?page=25', 'https://www.seek.co.nz/jobs-in-information-communication-technology?page=26',
                  'https://www.seek.co.nz/jobs-in-information-communication-technology?page=27', 'https://www.seek.co.nz/jobs-in-information-communication-technology?page=28', 'https://www.seek.co.nz/jobs-in-information-communication-technology?page=29',
                  'https://www.seek.co.nz/jobs-in-information-communication-technology?page=30']
    
    def parse(self, response):
        # Top level job item response 
        jobs = response.xpath('//*[@id="app"]/div/div[3]/div/section/div[2]/div/div/div[1]/div/div/div[1]/div/div[1]/div[3]/div')

        #Iterate through each job
        for job in jobs:
            # Use relative XPath within the 'job' context
            relative_url = job.xpath('.//div[2]/a/@href').get()
            
            if relative_url:
                job_url = f'https://www.seek.co.nz{relative_url}'
                yield response.follow(job_url, callback=self.parse_job_page)
        
        #pagination scraping
        # next_page = response.xpath('/html/body/div[1]/div/div[3]/div/section/div[2]/div/div/div[1]/div/div/div[1]/div/div/div[4]/div/nav/ul/li[last()]/a/@href').get()
        # print("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++%$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
        # print(next_page)
        # if next_page is not None:
        #     next_page_url = 'https://www.seek.co.nz' + next_page
        #     yield response.follow(next_page_url, callback= self.parse)
            
    def parse_job_page(self, response):
        job_item = ItjobscraperItem()

        if response.xpath('//*[@id="app"]/div/div[3]/div/div/div[2]/div[2]/div/div/div[1]/div[1]/div/div[1]/div/h1/text()').get() is None:
            job_item['title'] = response.xpath('//*[@id="app"]/div/div[3]/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/h1/text()').get()
        else:
            job_item['title'] = response.xpath('//*[@id="app"]/div/div[3]/div/div/div[2]/div[2]/div/div/div[1]/div[1]/div/div[1]/div/h1/text()').get()
            
        job_item['description'] = response.xpath('string(/html/body/div[1]/div/div[3]/div/div/div[2]/div[2]/div/div/div[2]/section[1]/div/div/div)').get().strip()
        
        if response.xpath('//*[@id="app"]/div/div[3]/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div[1]/div[2]/div/span/text()').get() is None:
            job_item['location'] = response.xpath('//*[@id="app"]/div/div[3]/div/div/div[2]/div[2]/div/div/div[1]/div[3]/div/div[1]/div[2]/div/span/text()').get()
        else: 
            job_item['location'] = response.xpath('//*[@id="app"]/div/div[3]/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div[1]/div[2]/div/span/text()').get()
            
        job_item['company'] = response.xpath('/html/body/div[1]/div/div[3]/div/div/div[2]/div[2]/div/div/div[1]/div[1]/div/div[1]/div/div/button/span/text()').get()
        job_item['duration'] = response.xpath('/html/body/div[1]/div/div[3]/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div[3]/div[2]/div/span/text()').get()
        job_item['salary'] = response.xpath('/html/body/div[1]/div/div[3]/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div[4]/div[2]/div/span/text()').get()
        job_item['source'] = "seek"
  
        yield job_item