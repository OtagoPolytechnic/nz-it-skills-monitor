from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from seekscraper.spiders.job_spider import JobSpider

if __name__ == "__main__":
    process = CrawlerProcess(get_project_settings())
    process.crawl(JobSpider)
    process.start()
