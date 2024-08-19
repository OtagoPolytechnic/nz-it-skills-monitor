## Backend setup
Make .env file in root of backend folder

```
DATABASE_URL=<url>
FLASK_APP=index.py
```

Inside Command Prompt

`.venv\Scripts\activate`

`pipenv install`

`flask --app index run`
(add --debug flag if you want hotswap)


## Database Migration
To run a new migration

`flask db migrate -m "<name of migration>"`

To apply migrations

`flask db upgrade`