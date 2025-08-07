from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .job import Job, Skill  # Import models to register with SQLAlchemy
