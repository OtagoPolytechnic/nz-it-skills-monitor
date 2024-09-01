from openai import OpenAI
from pydantic import BaseModel
from itemadapter import ItemAdapter
from itertools import chain
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv('OPENAI')
client = OpenAI(api_key=api_key)

class Skills(BaseModel):
    name:str
    
class SkillsParse(BaseModel):
    salary: str
    skills: list[Skills]

class ItjobscraperPipeline:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        
        # Enter default nulls
        adapter['skills'] = 'NULL'
        adapter['salary'] = 'NULL'

        # Turn description into one string, remove encoded characters, convert to lowercase
        description_array = adapter.get('description')
        flat_description = list(chain.from_iterable(description_array))
        full_description = " ".join(flat_description).replace("\n", "")
        adapter['description'] = full_description.lower()
        
        # Strip white space, and convert to string for other fields
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
            
        # Remove region from location
        location_string = adapter.get('location')

        if isinstance(location_string, tuple):
            location_string = ", ".join(location_string)  

        split_location_array = location_string.split(',')

        if len(split_location_array) == 2:
            # Remove "city"
            city_name = split_location_array[0].split(" ")
            if len(city_name) == 2:
                adapter['location'] = city_name[0]
            else:
                adapter['location'] = city_name[0]   
        
        # Get skills from description
        description = adapter.get('description')
        if description:
            openai_response = self.call_openai(description)
            adapter['skills'] = openai_response.skills
            adapter['salary'] = openai_response.salary

        return item

    def call_openai(self, description):
        try:
            response = client.beta.chat.completions.parse(
                model="gpt-4o-mini-2024-07-18",  # Ensure you are using the correct model name
                messages=[
                    {"role": "system", "content": "Extract the IT skill information and the salary information. skills should be a list of IT frameworks and language names. The salary infomration should be an integer with the largest value being given if it is a range, or left null if no information is availbale."},
                    {"role": "user", "content": f"{description}"}
                ],
                response_format=SkillsParse,
                max_tokens=150  # Adjust the max_tokens parameter based on your needs
            )
            print('-----------------------------------AIRESPONSE--------------------------------------')
            print(response.choices[0].message.parsed)
            return response.choices[0].message.parsed
        except Exception as e:
            # Handle API errors
            print(f"Error calling OpenAI API: {e}")
            return "Error in API call"
