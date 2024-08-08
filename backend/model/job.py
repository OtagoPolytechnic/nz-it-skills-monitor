from datetime import date
from typing import List
import json
from marshmallow import Schema, fields

class Job:
    def __init__(self, title, desc, salary, location, company, date_list, date_end):
        self.title = title
        self.desc = desc
        self.salary = salary
        self.location = location
        self.company = company
        self.date_list = date_list
        self.date_end = date_end

class Skill:
    def __init__(self, name):
        self.name = name

class JobSchema(Schema):
    title = fields.Str()
    desc = fields.Str()
    salary = fields.Int()
    location = fields.Str()
    company = fields.Str()
    date_list = fields.Date()
    date_end = fields.Date()

class SkillSchema(Schema):
    name = fields.List(fields.Nested(SkillSchema))