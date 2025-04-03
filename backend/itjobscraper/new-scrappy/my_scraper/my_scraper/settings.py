BOT_NAME = "my_scraper"

SPIDER_MODULES = ["my_scraper.spiders"]
NEWSPIDER_MODULE = "my_scraper.spiders"

# Obey robots.txt rules
ROBOTSTXT_OBEY = False

# Download delay to avoid detection
DOWNLOAD_DELAY = 3
RETRY_ENABLED = True
RETRY_TIMES = 3

# Default headers
DEFAULT_REQUEST_HEADERS = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
    'Connection': 'keep-alive',
    'DNT': '1',
    'Referer': 'https://www.google.com/',
    'Upgrade-Insecure-Requests': '1',
}

# Rotating user-agents manually (in spider)
USER_AGENTS_LIST = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13.3; rv:124.0) Gecko/20100101 Firefox/124.0',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0',
    'Mozilla/5.0 (Android 13; Mobile; rv:124.0) Gecko/124.0 Firefox/124.0',
]

# You can randomly choose one in the spider using:
# import random
# self.headers = { ... 'User-Agent': random.choice(self.settings.get('USER_AGENTS_LIST')) }

# Middlewares
DOWNLOADER_MIDDLEWARES = {
    # Custom logic in spider will handle rotating agents
    'scrapy.downloadermiddlewares.useragent.UserAgentMiddleware': None,
}

# Twisted and encoding settings
TWISTED_REACTOR = "twisted.internet.asyncioreactor.AsyncioSelectorReactor"
FEED_EXPORT_ENCODING = "utf-8"
