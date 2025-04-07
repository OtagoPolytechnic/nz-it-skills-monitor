# seek-scrape-prototype

Create virtual environment
```
py -m venv .venv
```

Activate the virtual environment
```
.venv\Scripts\activate
````

Install packages stored in the `requirements.txt`

```
pip install -r requirements.txt
```

Save packages to `requirements.txt`
```
pip freeze > requirements.txt
```

Run scraper
```
scrapy crawl fetch_html
```
