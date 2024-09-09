from . import db
from marshmallow import fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow_sqlalchemy.fields import Nested
from datetime import date

#   jobs table
#   | id          | title       | salary  | location    | type       | duration   | company     | description | date                 | skills      | category   |
#   | primary key | String(255) | Integer | String(255) | String(50) | String(50) | String(255) | Text        | Date (default today) | foreign key | String(50) |
           
class Job(db.Model):
    __tablename__ = 'jobs'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    salary = db.Column(db.Integer)
    location = db.Column(db.String(255))
    type = db.Column(db.String(50))
    duration = db.Column(db.String(50))
    company = db.Column(db.String(255))
    date = db.Column(db.Date, default=date.today)
    skills = db.relationship('Skill', backref='job', lazy=True, cascade="all, delete-orphan")  # If a job is deleted, all of its skills will also be deleted

#  skills table
#  | job_id   | name        | type        |
#  | combo primary key      | ########### |
#  | ######## | String(255) | String(255) |
    
class Skill(db.Model):
    __tablename__ = 'skills'    
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False, primary_key=True)
    name = db.Column(db.String(255), primary_key=True)
    type = db.Column(db.String(255))

class SkillSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Skill
        load_instance = True

class JobSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Job
        include_relationships = True
        load_instance = True

    skills = Nested(SkillSchema, many=True)
    salary = fields.Integer(required=False)
