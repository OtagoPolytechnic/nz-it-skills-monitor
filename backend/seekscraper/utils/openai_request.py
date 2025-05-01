from openai import OpenAI
import os
import json

from dotenv import load_dotenv
load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI')
if not OPENAI_API_KEY:
    raise Exception("OPENAI environment variable is not set. Please set it before running.")
client = OpenAI(api_key=OPENAI_API_KEY)

def structured_output(job_text: str) -> dict:
    response = client.responses.create(
    model="gpt-4o-mini",
    input=[
        {
        "role": "system",
        "content": [
            {
            "type": "input_text",
            "text": "Extract the job information and skills"
            }
        ]
        },
        {
        "role": "user",
        "content": [
            {
            "type": "input_text",
            "text": job_text
            }
        ]
        },
    ],
    text={
        "format": {
        "type": "json_schema",
        "name": "job_posting",
        "schema": {
            "type": "object",
            "required": [
            "category",
            "company",
            "date",
            "duration",
            "id",
            "location",
            "salary",
            "skills",
            "title",
            "type"
            ],
            "properties": {
            "id": {
                "type": "number",
                "description": "Unique identifier for the job posting."
            },
            "date": {
                "type": "string",
                "description": "Today's date."
            },
            "type": {
                "type": "string",
                "description": "Type of the position (e.g., Full time, Part time)."
            },
            "title": {
                "type": "string",
                "description": "Title of the job position."
            },
            "salary": {
                "type": "number",
                "description": "Salary offered for the position."
            },
            "skills": {
                "type": "array",
                "items": {
                "type": "object",
                "required": [
                    "name",
                    "type"
                ],
                "properties": {
                    "name": {
                    "type": "string",
                    "description": "Name of the skill."
                    },
                    "type": {
                    "type": "string",
                    "description": "Type of skill (e.g., soft skill, tool, language, platform)."
                    }
                },
                "additionalProperties": False
                },
                "description": "List of skills required for the job position."
            },
            "company": {
                "type": "string",
                "description": "Name of the company offering the position."
            },
            "category": {
                "type": "string",
                "description": "The category of the job position."
            },
            "duration": {
                "type": "string",
                "description": "Duration of the position (e.g., Permanent, Contract)."
            },
            "location": {
                "type": "string",
                "description": "Location of the job position simplified to the closest region in New Zealand."
            }
            },
            "additionalProperties": False
        },
        "strict": True
        }
    },
    reasoning={},
    tools=[],
    temperature=1,
    max_output_tokens=2048,
    top_p=1,
    store=True
)
        # Extract the answer from the response
    try:
        answer = response.choices[0].message.content
        result_json = json.loads(answer)
        return result_json
    except Exception as e:
        raise Exception(f"Error parsing OpenAI response: {e}")
