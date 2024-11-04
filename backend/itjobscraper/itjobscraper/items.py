# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy

# defines the job object that will be build during the scraping process 
class ItjobscraperItem(scrapy.Item):
    title = scrapy.Field()
    description = scrapy.Field()
    location = scrapy.Field()
    company = scrapy.Field()
    type = scrapy.Field()
    skills = scrapy.Field()
    date = scrapy.Field()
    salary = scrapy.Field()
    duration = scrapy.Field()
    category = scrapy.Field()
    source = scrapy.Field()