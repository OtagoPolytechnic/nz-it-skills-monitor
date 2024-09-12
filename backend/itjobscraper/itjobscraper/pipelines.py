from openai import OpenAI
from pydantic import BaseModel
from itemadapter import ItemAdapter
from itertools import chain
from dotenv import load_dotenv
import os
import psycopg2
from datetime import date
import json

load_dotenv()

api_key = os.getenv('OPENAI')
client = OpenAI(api_key=api_key)

# Schema for structured response from OpenAI
class Skills(BaseModel):
    name: str
    type: str

class SkillsParse(BaseModel):
    salary: int
    skills: list[Skills]

# ItjobscraperPipeline handles processing and cleaning of scraped data
class ItjobscraperPipeline:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        
        # Default nulls for skills and salary
        adapter['skills'] = 'NULL'
        adapter['salary'] = 'NULL'
        adapter['date'] = str(date.today())
        
        # Turn description into one string, remove encoded characters, and convert to lowercase
        description_array = adapter.get('description')
        flat_description = list(chain.from_iterable(description_array))
        full_description = " ".join(flat_description).replace("\n", "")
        adapter['description'] = full_description.lower()
        
        # Strip whitespace and convert fields to strings
        field_names = adapter.field_names()
        for field_name in field_names:
            value = adapter.get(field_name)
            if isinstance(value, list):
                value = ' '.join(str(item).strip() for item in value)
            elif isinstance(value, tuple):
                if len(value) == 1:
                    value = str(value[0]).strip()
                else:
                    value = ' '.join(str(item).strip() for item in value)
            else:
                value = str(value).strip()
            adapter[field_name] = value
        
        # Get skills and salary from description via OpenAI API
        description = adapter.get('description')
        if description:
            openai_response = self.call_openai(description)
            if openai_response:
                adapter['skills'] = json.dumps([skill.dict() for skill in openai_response.skills])
                adapter['salary'] = openai_response.salary
        
        return item

    # Function to send description to OpenAI API and parse skills and salary
    def call_openai(self, description):
        try:
            response = client.beta.chat.completions.parse(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "Extract IT skills and salary information..."},
                    {"role": "user", "content": f"{description}"}
                ],
                response_format=SkillsParse,
                max_tokens=150  
            )
            return response.choices[0].message.parsed
        except Exception as e:
            print(f"Error calling OpenAI API: {e}")
            return None

# PostgresPipeline for bulk inserting data into PostgreSQL
class PostgresPipeline:
    def open_spider(self, spider):
        self.conn = psycopg2.connect(
            dbname=os.getenv('PGDATABASE'),
            user=os.getenv('PGUSER'),
            password=os.getenv('PGPASSWORD'),
            host=os.getenv('PGHOST'),
            port=os.getenv('PGPORT')
        )
