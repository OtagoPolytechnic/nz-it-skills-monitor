import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
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