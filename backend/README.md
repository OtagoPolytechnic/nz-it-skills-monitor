## Backend setup
Make .env file in root of backend folder

```
DATABASE_URL=<url>
FLASK_APP=index.py
```

You may have to edit the database url to begin with `postgresql` instead of `postgres`

Inside Command Prompt:

Create a virtual environment if there isn't one there

`py -m venv .venv`

Install packages stored in the Pipfile using pipenv

`pip install pipenv`
`pipenv install`

`.venv\Scripts\activate`

`pipenv install`

`flask --app index run`
(add --debug flag if you want hotswap)


## Database Migration
To run a new migration

`flask db migrate -m "<name of migration>"`

To apply migrations

`flask db upgrade`

## Data Scrape Script (testing)
Inside Command Prompt with the virtual environment activated

`pipenv run python process_scrape.py`