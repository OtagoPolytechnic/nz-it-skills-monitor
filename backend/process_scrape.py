import json
from model import db
from model.job import Job, JobSchema, Skill

with open('trademejobdata 1.json', 'r') as file:
    scraped_data = json.load(file)