import scrapy
import random

class SeekspiderSpider(scrapy.Spider):
    name = "seekspider"
    allowed_domains = ["www.seek.co.nz"]
    start_urls = ["https://www.seek.co.nz/jobs-in-information-communication-technology"]
    
    user_agent_list = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
        'Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.1)',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36 Edg/87.0.664.75',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18363',
    ]

    def parse(self, response):
        jobs = response.css('div.tm-search-results__listing')
        jobs.pop(0)
        jobs.pop(0)
        for job in jobs:
            yield{
                'url': job.css('a').attrib['href']
            }
            
        # next_page = response.xpath("/html/body/tm-root/div[1]/main/div/tm-jobs-search-results/div/div/div[3]/tm-flex-search-results/div/div[2]/tg-pagination/nav/ul/li[8]/tg-pagination-link/a/@href").get()

        # if next_page is not None:
        #     next_page_url = 'https://www.trademe.co.nz' + next_page
        #     print("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ")
        #     print(next_page_url)
        #     yield response.follow(next_page_url, callback= self.parse)


# jobs = response.css('div.tm-search-results__listing')
# First 2 are not real
# job = jobs[2]
# url =  job.css('a').attrib['href']

