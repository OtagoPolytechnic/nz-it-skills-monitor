import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
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

@app.route('/test-db')
def get_db_version():
    try:
        with db.engine.connect() as connection:
            result = connection.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            return jsonify({"database_version": version})
    except Exception as e:
        return jsonify({"error": str(e)}), 500