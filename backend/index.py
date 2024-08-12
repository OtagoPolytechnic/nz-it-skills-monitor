import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from model import init_app, db
from model.job import JobSchema, Job

load_dotenv()

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
init_app(app)

@app.route("/")
def hello_world():
    return "Hello, World!"

@app.route('/db_version', methods=['GET'])
def get_db_version():
    try:
        # Connect to the database
        with db.engine.connect() as connection:
            # Query for the database version
            result = connection.execute("SELECT version();")
            version = result.fetchone()[0]
            return jsonify({"database_version": version})
    except Exception as e:
        return jsonify({"error": str(e)}), 500