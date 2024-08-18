from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

def init_app(app):
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app, db)
    return app

from .job import Job, Skill  # Import models to register with SQLAlchemy