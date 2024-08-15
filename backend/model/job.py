from . import db
from marshmallow import fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow_sqlalchemy.fields import Nested

class Job(db.Model):
    __tablename__ = 'jobs'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    desc = db.Column(db.Text)
    salary = db.Column(db.Integer)
    location = db.Column(db.String(255))
    type = db.Column(db.String(50))
    duration = db.Column(db.String(50))
    company = db.Column(db.String(255))
    date_list = db.Column(db.Date)
    date_end = db.Column(db.Date)
    skills = db.relationship('Skill', backref='job', lazy=True)

class Skill(db.Model):
    __tablename__ = 'skills'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)

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
    date_list = fields.Date(required=False)
    date_end = fields.Date(required=False)
