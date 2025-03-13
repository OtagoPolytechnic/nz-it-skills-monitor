import scrapy

class SeekSpider(scrapy.Spider):
    name = "seekspider"
    allowed_domains = ["seek.co.nz"]
    start_urls = [f"https://www.seek.co.nz/jobs-in-information-communication-technology?page={i}" for i in range(1, 31)]

    def parse(self, response):
        """Extract job listings from Seek.co.nz"""

        # Loop through job listings on the page
        for job in response.css("article"):  # Update this selector if needed
            yield {
                "title": job.css("a[data-automation='jobTitle']::text").get(default="N/A"),  # Job Title
                "company": job.css("span[data-automation='jobCompany']::text").get(default="N/A"),  # Company Name
                "location": job.css("span[data-automation='jobLocation']::text").get(default="N/A"),  # Job Location
                "salary": job.css("span[data-automation='jobSalary']::text").get(default="N/A"),  # Salary
                "description": job.css("div[data-automation='jobShortDescription']::text").get(default="N/A"),  # Job Description
                "link": response.urljoin(job.css("a[data-automation='jobTitle']::attr(href)").get(default="N/A")),  # Job Link
            }

        # Check for "Next Page" button and follow it
        next_page = response.css("a[aria-label='Next']::attr(href)").get()
        if next_page:
            yield response.follow(next_page, callback=self.parse)
