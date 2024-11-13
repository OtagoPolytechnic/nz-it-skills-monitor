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
        print(description)
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
                                       """
                You are a computer science graduate reviewing job advertisements. Your task is to extract IT skill information and salary details from the description and assign a job category. Follow these rules strictly:

                1. Skill Extraction:
                   - Extract only if the skill falls under one of these categories:
                     language, framework, tool, certification, platform, protocol, database, soft skill, methodology.
                     Example: name: javascript, type: language.
                   - Exclude operating systems (e.g., Windows, Linux).
                   - If a skill doesn't fit any category, ignore it.

                2. Soft Skills:
                   - Only include the following:
                     communication, teamwork, problem solving, adaptability, time management, customer service, leadership, critical thinking, conflict resolution, creativity.
                   - Avoid using "skill" or hyphens (e.g., communication, not communication skills).

                3. Acronym Handling:
                   - Expand acronyms like:
                     oscp → offensive security certified professional, aws → amazon web services.

                4. SQL:
                   - Always treat SQL as a language.

                5. Salary Extraction:
                   - For salary ranges (e.g., 100,000 - 120,000), return the highest value (120,000).
                   - For hourly rates, convert to annual: hourly rate × 40 × 52.
                   - If no salary is provided, return 0.

                6. Job Category Assignment:
                   - Assign one of the following categories:
                     business & systems analysts, systems engineers, testing, programming & development, project management, other, networking & storage, sales & pre-sales, service desk, telecommunications, security, architects, web design, database development & administration, consultant.

                Output:
                - Skills: Each skill as name: [skill], type: [category].
                - Salary: Annual integer value.
                - Job Category: One of the provided categories.
                - Format: All text in lowercase.
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