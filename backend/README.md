## Backend setup
Make .env file in root of backend folder, using the example file

```
DATABASE_URL=<url>
FLASK_APP=index.py
```
>[!NOTE]
>You may have to edit the database url to begin with `postgresql` instead of `postgres`

### Inside Command Prompt:

Create a virtual environment if there isn't one there

```
py -m venv .venv
```

```
.venv\Scripts\activate
```

Install packages stored in the `requirements.txt`

```
pip install -r requirements.txt
```

Save packages to `requirements.txt`
```
pip freeze > requirements.txt
```

```
flask --app index run
```

>[!NOTE]
>Append --debug flag if you want the server to enable hotswap


## Database Migration
To run a new migration

```
flask db migrate -m "<name of migration>"
```

To apply migrations

```
flask db upgrade
```

## Data Scrape Script (testing)
Inside Command Prompt with the virtual environment activated

```
pipenv run python process_scrape.py
```
