from openai import OpenAI
from pydantic import BaseModel, Field
from enum import Enum
import os
from datetime import date
import logging
import asyncio

from dotenv import load_dotenv
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger(__name__)

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    raise Exception("OPENAI environment variable is not set. Please set it before running.")
client = OpenAI(api_key=OPENAI_API_KEY)

class Duration(str, Enum):
    Permanent = "Permanent"
    Contract = "Contract"

class Job(BaseModel):
    date: str = Field(..., description="Leave empty.")
    type: str = Field(..., description="Type of the position (e.g., Full time, Part time).")
    title: str = Field(..., description="Title of the job position.")
    salary: int = Field(..., description="Salary offered for the position.")
    company: str = Field(..., description="Name of the company offering the position.")
    category: str = Field(..., description="The category of the job position.")
    duration: Duration = Field(..., description="Duration of the position (e.g., Permanent, Contract).")
    location: str = Field(..., description="Location of the job position simplified to the closest large city in New Zealand (e.g., Auckland, Wellington, Christchurch, Hamilton, Tauranga, Napier, Hastings, Dunedin, Palmerston North, Nelson, Rotorua, New Plymouth, Whangārei, Invercargill, Whanganui).")
    remote: bool = Field(..., description="Whether the job is remote or not.")
    sector: str = Field(..., description="Sector of the job position, found in brackets ().")
    source: str = Field(..., description="Leave empty.")
    description: str = Field(..., description="Entire description of the job position")

    class Skill(BaseModel):
      name: str = Field(..., description="Name of the skill.")
      type: str = Field(..., description="Type of skill (e.g., soft skill, tool, programming language, platform, methodology, databases, frameworks).")

    skills: list[Skill] = Field(..., description="List of skills required for the job position.")


system_prompts = [
    # 0 Base extraction (single main schema)
    """Extract job fields strictly matching the provided schema.
    • Keep original job title and company names.
    • Salary → integer only; 0 if missing.
    • Location → nearest NZ city from schema list.
    • Category (text before '(') and Sector (inside '()').
    • Remote = true if mentions 'Remote', 'Work from Home', 'Flexible'.
    • Return full job description verbatim.""",

    # 1 Soft skills
    """Extract ≤10 soft skills from description.
    • Split on 'and','or','/',' ,' and remove duplicates.
    • Simplify phrases; no words 'skill'/'skills'.
    • Replace hyphens with spaces.
    • Type = soft skill.""",

    # 2 Programming languages
    """Extract programming languages appearing in description.
    • Valid list: Python, JavaScript, Java, C, C#, C++, TypeScript,
      Go, Rust, PHP, Lua, Swift, Haskell.
    • Exclude HTML, CSS, SQL, markup or styling languages.
    • Type = programming language.""",

    # 3 Frameworks
    """Extract frameworks only if in list:
    ITIL, COBIT, TOGAF, Zachman Framework, NIST CSF, MITRE ATT&CK,
    CIS Controls, ISO/IEC 27001, ISO/IEC 20000, MOF, CMMI,
    React, Angular, Vue.js, Node.js, Express.js, Django, Flask, FastAPI,
    Spring Boot, ASP.NET Core, .NET, Laravel, Ruby on Rails,
    Next.js, Nuxt.js, NestJS, Svelte, Flutter, Qt, Electron,
    React Native, Ionic, TensorFlow, PyTorch, Unity, Unreal Engine, Godot.
    • Exclude Agile, Scrum, Kanban, DevOps, etc. (they're methodologies).
    • Type = framework.""",

    # 4 Databases
    """Extract mentioned databases if in list:
    MySQL, PostgreSQL, MongoDB, SQLite, Oracle Database,
    SQL Server, Redis, MariaDB, DynamoDB, Elasticsearch,
    Cassandra, Firestore, Firebase Realtime Database,
    Aurora, RDS, Redshift, BigQuery, Azure SQL Database,
    Snowflake, Neo4j, Couchbase, ClickHouse, InfluxDB, TimescaleDB.
    • Type = databases.""",

    # 5 Tools
    """Extract tools/utilities (e.g., Git, Docker, Kubernetes, Jenkins, Terraform).
    • Do NOT include frameworks or languages.
    • Type = tool.""",

    # 6 Platforms
    """Extract hosting/platform services (e.g., AWS, Azure, GCP, Firebase, Vercel).
    • Type = platform.""",

    # 7 Methodologies
    """Extract software-development methodologies:
    Agile, Scrum, Kanban, Waterfall, Lean, XP, DevOps, SAFe,
    RAD, FDD, TDD, BDD, DDD, Six Sigma, ITIL, PRINCE2, PMBOK, RUP.
    • Type = methodology."""
]


async def _async_parse(prompt, job_text):
    # If OpenAI client supports async, use await client.responses.parse(...)
    # Otherwise, run in executor
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        None,
        lambda: client.responses.parse(
            model="gpt-4.1-mini",
            input=[
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "input_text",
                            "text": prompt
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
            text_format=Job,
            reasoning={},
            tools=[],
            temperature=0,
            max_output_tokens=4092,
            top_p=0.8,
            store=True
        )
    )

async def structured_output(job_text: str, job_source: str) -> dict:
    def clean_skills(skills):
        type_priority = {
            "programming language": 1,
            "framework": 2,
            "platform": 3,
            "tool": 4,
            "databases": 5,
            "database": 5,
            "methodology": 6,
            "soft skill": 7,
        }
        filtered = [
            s for s in skills
            if s.type.strip().lower() != "skill"
        ]
        deduped = {}
        for s in filtered:
            name = s.name.strip().lower()
            typ = s.type.strip().lower()
            key = name
            current_priority = type_priority.get(typ, 100)
            if key not in deduped or current_priority < type_priority.get(deduped[key].type.lower(), 100):
                deduped[key] = s
        return list(deduped.values())

    # Run all prompts concurrently
    tasks = [
        _async_parse(prompt, job_text)
        for prompt in system_prompts
    ]
    responses = await asyncio.gather(*tasks)

    # Merge all skills into one array, deduplicating by name+type
    all_skills = []
    seen = set()
    for resp in responses:
        if resp is None or not hasattr(resp, "output_parsed") or resp.output_parsed is None:
            logger.warning("A response was None or missing output_parsed and will be skipped.")
            continue
        if not hasattr(resp.output_parsed, "skills") or resp.output_parsed.skills is None:
            logger.warning("output_parsed has no skills attribute or is None, skipping.")
            continue
        for skill in resp.output_parsed.skills:
            key = (skill.name, skill.type)
            if key not in seen:
                seen.add(key)
                all_skills.append(skill)
                logger.info(f"Added skill: {skill}")

    all_skills = clean_skills(all_skills)

    try:
        logger.info("Merging OpenAI responses into a single job object.")
        merged_job = responses[0].output_parsed.copy(update={"skills": all_skills, "source": job_source, "date": str(date.today())})
        logger.info(f"Merged job created with {len(all_skills)} skills, source: {job_source}, date: {str(date.today())}")
        return merged_job.dict()
    except Exception as e:
        logger.error(f"Error parsing OpenAI response: {e}")
        raise Exception(f"Error parsing OpenAI response: {e}")
