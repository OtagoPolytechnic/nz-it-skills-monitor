import scrapy
import random

class TrademespiderSpider(scrapy.Spider):
    name = "trademespider"
    allowed_domains = ["www.trademe.co.nz"]
    start_urls = ["https://www.trademe.co.nz/a/jobs/it"]
    
    # user_agent_list = [
    #     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
    #     'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    #     'Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.1)',
    #     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36 Edg/87.0.664.75',
    #     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18363',
    # ]

    def parse(self, response):
        jobs = response.css('div.tm-search-results__listing.tm-search-results__listing--sticky.ng-star-inserted')
        jobs.pop(0)
        jobs.pop(0)
            
        #into each job
        for job in jobs:
            relative_url = ''
            
            if job.css('a.tm-jobs-search-card__link ::attr(href)').get() is None:
                relative_url = job.css('a.tm-promoted-listing-card__link.tm-promoted-listing-card__link--branded.o-card.ng-star-inserted ::attr(href)').get()
            else:
                relative_url = job.css('a.tm-jobs-search-card__link ::attr(href)').get()
                
            job_url = 'https://www.trademe.co.nz/a/' + relative_url
            print("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ")
            print(job_url)
            yield response.follow(job_url, callback= self.parse_job_page) 
        
        #pagination
        # next_page = response.xpath("/html/body/tm-root/div[1]/main/div/tm-jobs-search-results/div/div/div[3]/tm-flex-search-results/div/div[2]/tg-pagination/nav/ul/li[8]/tg-pagination-link/a/@href").get()
        # if next_page is not None:
        #     next_page_url = 'https://www.trademe.co.nz' + next_page
        #     yield response.follow(next_page_url, callback= self.parse)
            
    def parse_job_page(self, response):
        yield{
            'title' : response.css('.jb-listing__header-details h1::text').get(),
            'description' : response.css('.tm-jobs-listing-body__item-content ::text').getall(),
            'location' : response.xpath("/html/body/tm-root/div[1]/main/div/ng-component/div/div[4]/div/div[1]/div/tg-row/tg-col/tm-jobs-listing-body/tm-key-details-rack/tg-rack/tg-rack-item[1]/div/div/tg-rack-item-secondary/text()").get(),
            'company' : response.css('h2.p-h3.jb-listing__company-name ::text').get(),
            'type': response.xpath("/html/body/tm-root/div[1]/main/div/ng-component/div/div[4]/div/div[1]/div/tg-row/tg-col/tm-jobs-listing-body/tm-key-details-rack/tg-rack/tg-rack-item[2]/div/div/tg-rack-item-secondary/text()").get(),
            'duration': response.xpath("/html/body/tm-root/div[1]/main/div/ng-component/div/div[4]/div/div[1]/div/tg-row/tg-col/tm-jobs-listing-body/tm-key-details-rack/tg-rack/tg-rack-item[3]/div/div/tg-rack-item-secondary/text()").get()
        }
            
#  if job.css('div.tm-jobs-search-card__title ::text').get() is None:
#                 title = job.css('div.tm-promoted-listing-info__title ::text').get()
#             else:
#                 title = job.css('div.tm-jobs-search-card__title ::text').get()


# jobs = response.css('div.tm-search-results__listing')
# First 2 are not real
# job = jobs[2]
# url =  job.css('a').attrib['href']