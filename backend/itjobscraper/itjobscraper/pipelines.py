from openai import OpenAI
from pydantic import BaseModel
from itemadapter import ItemAdapter
from itertools import chain
from dotenv import load_dotenv
import os
import psycopg2
from psycopg2.extras import execute_values
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
    category: str
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
        # description_array = adapter.get('description')
        # flat_description = list(chain.from_iterable(description_array))
        # full_description = " ".join(flat_description).replace("\n", "")
        # adapter['description'] = full_description.lower()
        
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
        
        ##remove region from location
        source = adapter.get('source')
        location_string = adapter.get('location')
        
        #trademe
        if source == "trademe":
            if isinstance(location_string, tuple):
                location_string = ", ".join(location_string)  

            split_location_array = location_string.split(',')

            if len(split_location_array) == 2:
                # Remove "city"
                city_name = split_location_array[0].split(" ")

                if len(city_name) == 2:
                    adapter['location'] = city_name[0]
                else:
                    adapter['location'] = split_location_array[0]
        
        #seek
        if source == "seek":
            if isinstance(location_string, tuple):
                location_string = ", ".join(location_string)  

            # Split by spaces to extract the first word only
            first_word = location_string.split()[0]

            adapter['location'] = first_word
        
        # Get skills and salary from description via OpenAI API
        description = adapter.get('description')
        if description:
            openai_response = self.call_openai(description)
            if openai_response:
                adapter['skills'] = json.dumps([skill.dict() for skill in openai_response.skills])
                adapter['salary'] = openai_response.salary
                adapter['category'] = openai_response.category
        
        return item

    # Function to send description to OpenAI API and parse skills and salary
    def call_openai(self, description):
        try:
            response = client.beta.chat.completions.parse(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": 
                        """You are a computer science graduate looking at job advertisements, 
                        extract IT skill information and salary information from the description and assign a category for the job, skills must be categorized by the following options: 
                        language, framework, tool, certification, platform, protocol, database, soft skill, methodology.
                        Only include the following soft skills: Communication, Teamwork, Problem-solving, Adaptability, Time Management, Customer Service, Emotional Intelligence, Leadership, Critical Thinking, Conflict Resolution, Creativity.
                        Soft skills should not include the word skill or - characters, example: use communication not communication skills, use "problem solving" not "problem-solving".
                        If a skill does not fit into one of these catagories do not include it. Set the type of each skill as one of the following options: 
                        language, framework, tool, certification, platform, protocol, database, soft skill, methodology example: name: javascript, type: language. 
                        Convert acronyms of certifications to their full name example example: oscp to offensive security certified professional. 
                        Salary information should be an integer, if a range is given example: 100,000 - 120,000 return the highest number,
                        if an hourly rate is given, calculate the yearly salary based on a 40hr work week, if no salary figure is given return 0.
                        Return all in lowercase.
                        For the job category, assign one of the following categories: Business & systems analysts, Systems engineers, Testing, Programming & development, Project management, 
                        Other, Networking & storage, Sales & pre-sales, Service desk, Telecommunications, Management, Security, Architects, Web design, Database Development & Administration
                        """
                    },
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
        # Connect to the PostgreSQL database using psycopg2
        self.conn = psycopg2.connect(
            dbname=os.getenv('PGDATABASE'),
            user=os.getenv('PGUSER'),
            password=os.getenv('PGPASSWORD'),
            host=os.getenv('PGHOST'),
            port=os.getenv('PGPORT')
        )
        self.cur = self.conn.cursor()

    def close_spider(self, spider):
        # Close the cursor and connection when the spider is done
        self.cur.close()
        self.conn.close()

    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        
        # Prepare data for the Job
        job_data = (
            adapter.get('title'),
            adapter.get('description'),
            adapter.get('category'),
            adapter.get('salary'),
            adapter.get('location'),
            adapter.get('type'),
            adapter.get('duration'),
            adapter.get('company'),
            adapter.get('date', str(date.today()))  # Default to today's date if not present
        )

        # SQL query to insert a job into the 'jobs' table
        insert_job_query = """
        INSERT INTO jobs (title, description, category, salary, location, type, duration, company, date)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
        """

        try:
            # Insert the job and retrieve the job ID
            self.cur.execute(insert_job_query, job_data)
            job_id_row = self.cur.fetchone()

            # Check if fetchone() returned None
            if job_id_row is None:
                raise ValueError("Failed to retrieve job ID after insertion.")

            # Extract the job ID from the returned tuple
            job_id = job_id_row[0]

            # Parse and insert skills if they exist
            skills = json.loads(adapter.get('skills', '[]'))
            if skills:
                skill_data = [(job_id, skill['name'], skill.get('type', 'Unknown')) for skill in skills]
                # SQL query to insert skills into the 'skills' table
                insert_skill_query = """
                INSERT INTO skills (job_id, name, type)
                VALUES %s
                """
                # Bulk insert skills
                execute_values(self.cur, insert_skill_query, skill_data)

            # Commit the transaction
            self.conn.commit()

        except Exception as e:
            print(f"Error inserting job and skills into the database: {e}")
            self.conn.rollback()  # Rollback in case of error

        return item

    def insert_job(self, job_data):
        """
        Insert a single job entry and return the job ID.
        """
        insert_job_query = """
        INSERT INTO jobs (title, description, category, salary, location, type, duration, company, date)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
        """
        try:
            self.cur.execute(insert_job_query, job_data)
            job_id = self.cur.fetchone()[0]
            self.conn.commit()
            return job_id
        except Exception as e:
            self.conn.rollback()
            print(f"Error inserting job: {e}")
            return None

    def insert_skills(self, job_id, skills):
        """
        Insert multiple skills related to a job.
        """
        skill_data = [(job_id, skill['name'], skill.get('type', 'Unknown')) for skill in skills]
        insert_skill_query = """
        INSERT INTO skills (job_id, name, type)
        VALUES %s
        """
        try:
            execute_values(self.cur, insert_skill_query, skill_data)
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            print(f"Error inserting skills: {e}")