# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class ItjobscraperItem(scrapy.Item):
    title = scrapy.Field()
    description = scrapy.Field()
    location = scrapy.Field()
    company = scrapy.Field()
    type = scrapy.Field()
    skills = scrapy.Field()
    salary = scrapy.Field()
    duration = scrapy.Field()
