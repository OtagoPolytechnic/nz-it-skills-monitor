from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_app(app):
    db.init_app(app)

from .job import Job, Skill  # Import models to register with SQLAlchemy
