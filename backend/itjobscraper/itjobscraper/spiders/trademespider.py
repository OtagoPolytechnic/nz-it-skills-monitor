import scrapy
from itjobscraper.items import ItjobscraperItem

class TrademespiderSpider(scrapy.Spider):
    name = "trademespider"
    allowed_domains = ["www.trademe.co.nz"]
    start_urls = ["https://www.trademe.co.nz/a/jobs/it"]
    
    def parse(self, response):
        #Top level job item response 
        jobs = response.css('div.tm-search-results__listing.tm-search-results__listing--sticky.ng-star-inserted:not(.ad-card)')

        #into each job, based on job type 
        for job in jobs:

            if job.css('a.tm-jobs-search-card__link ::attr(href)').get() is not None:
                relative_url = job.css('a.tm-jobs-search-card__link ::attr(href)').get()

            if job.css('a.tm-promoted-listing-card__link.tm-promoted-listing-card__link--branded.o-card.ng-star-inserted ::attr(href)').get() is not None:
                relative_url = job.css('a.tm-promoted-listing-card__link.tm-promoted-listing-card__link--branded.o-card.ng-star-inserted ::attr(href)').get()

            if job.css('a.tm-promoted-listing-card__link.tm-promoted-listing-card__link--image.o-card.ng-star-inserted ::attr(href)').get() is not None:
                relative_url = job.css('a.tm-promoted-listing-card__link.tm-promoted-listing-card__link--image.o-card.ng-star-inserted ::attr(href)').get()

            job_url = 'https://www.trademe.co.nz/a/' + relative_url
            yield response.follow(job_url, callback= self.parse_job_page) 
        
        #pagination scraping
        next_page = response.xpath("/html/body/tm-root/div[1]/main/div/tm-jobs-search-results/div/div/div[3]/tm-flex-search-results/div/div[2]/tg-pagination/nav/ul/li[last()]/tg-pagination-link/a/@href").get()
        if next_page is not None:
            next_page_url = 'https://www.trademe.co.nz' + next_page
            yield response.follow(next_page_url, callback= self.parse)
        else:
            print("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
            print("No next page")
            
    ## Builds the job object from xpaths and css selectors        
    def parse_job_page(self, response):
        job_item = ItjobscraperItem()
        
        job_item['title'] = response.css('.jb-listing__header-details h1::text').get(),
        job_item['description'] = response.css('.tm-jobs-listing-body__item-content ::text').getall(),
        job_item['location'] = response.xpath("/html/body/tm-root/div[1]/main/div/ng-component/div/div[4]/div/div[1]/div/tg-row/tg-col/tm-jobs-listing-body/tm-key-details-rack/tg-rack/tg-rack-item[1]/div/div/tg-rack-item-secondary/text()").get(),
        job_item['company'] = response.css('h2.p-h3.jb-listing__company-name ::text').get(),
        job_item['type'] = response.xpath("/html/body/tm-root/div[1]/main/div/ng-component/div/div[4]/div/div[1]/div/tg-row/tg-col/tm-jobs-listing-body/tm-key-details-rack/tg-rack/tg-rack-item[2]/div/div/tg-rack-item-secondary/text()").get(),
        job_item['duration'] = response.xpath("/html/body/tm-root/div[1]/main/div/ng-component/div/div[4]/div/div[1]/div/tg-row/tg-col/tm-jobs-listing-body/tm-key-details-rack/tg-rack/tg-rack-item[3]/div/div/tg-rack-item-secondary/text()").get()
        job_item['category'] = response.xpath("/html/body/tm-root/div[1]/main/div/ng-component/div/div[2]/tm-listing-breadcrumbs/div/div/tg-rack/tg-rack-item/div/div/tg-rack-item-primary/div/tm-breadcrumbs/ol/li[4]/a/span/text()").get()
        yield job_item