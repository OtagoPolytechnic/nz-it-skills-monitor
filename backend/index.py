import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text, inspect
from flask_migrate import Migrate
from model import init_app, db
from model.job import JobSchema, Job, Skill

load_dotenv()

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

init_app(app)
migrate = Migrate(app, db)

@app.route("/")
def hello_world():
    return "Hello, World!"

@app.route('/tables', methods=['GET'])
def list_tables():
    # Retrieve the list of tables from the database
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()

    # Dictionary to hold table schemas
    schemas = {}

    # Iterate over tables to get their schema
    for table in tables:
        columns = inspector.get_columns(table)
        # Convert column types to strings to make them JSON serializable
        for column in columns:
            column['type'] = str(column['type'])
        schemas[table] = columns
    
    return jsonify(schemas)


@app.route('/test-db')
def get_db_version():
    session = db.session()
    try:
        result = session.execute(text("SELECT version();"))
        version = result.fetchone()[0]
        return jsonify({"database_version": version})
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()