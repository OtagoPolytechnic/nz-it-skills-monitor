## Backend setup
Make .env file in root of backend folder, using the example file

>[!NOTE]
>You may have to edit the database url to begin with `postgresql` instead of `postgres`

### Inside Command Prompt:

Create a virtual environment if there isn't one there

```
py -m venv .venv
```

Activate the virtual environment
```
.venv\Scripts\activate
```

>[!NOTE]
>To deactivate, use `.venv\Scripts\deactivate`

Install packages stored in the `requirements.txt`

```
pip install -r requirements.txt
```

Save packages to `requirements.txt`
```
pip freeze > requirements.txt
```


Run the development server
```
python index.py
```

## Database Migration
To run a new migration

```
flask db migrate -m "<name of migration>"
```

To apply migrations

```
flask db upgrade
```

## Run Scrapers Manually
Navigate to backend/itjobscraper/itjobscraper

```
scrapy crawl <spider> (trademespider/seekspider)
```