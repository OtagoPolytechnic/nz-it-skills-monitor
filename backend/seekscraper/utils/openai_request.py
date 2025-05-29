from openai import OpenAI
from pydantic import BaseModel, Field
from enum import Enum
import os
import json
from datetime import date

from dotenv import load_dotenv
load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI')
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

    class Skill(BaseModel):
      name: str = Field(..., description="Name of the skill.")
      type: str = Field(..., description="Type of skill (e.g., soft skill, tool, programming language, platform, methodology, databases, frameworks).")

    skills: list[Skill] = Field(..., description="List of skills required for the job position.")


system_prompts = [
  "Extract the job information and skills using the provided json_schema. This job data is being used to power a career planning and curriculum alignment tool for IT educators.\n\n# Steps\nSector:\n- Extract everything inside the brackets, trimmed of whitespace.\n\nCategory:\n- Extract everything before the first opening bracket, trimmed of whitespace, without including the brackets.\n\nTitle:\n- Extract the job title as it is written.\n- Avoid rewording, abbreviating or generalizing the title.\n\nCompany:\n- Extract the name of the company advertising the job.\n\nType:\n- Extract the type of position the job is advertising, matching types from the json_schema.\n- If the found type does not match the samples, decide the closest match.\n\nDuration:\n- Extract the duration of the job position, matching types from the json_schema.\n- Avoid listing specific time terms, keep it general.\n\nRemote:\n- Determine if the job position is a remote position (true/false).\n- If the position mentions \"Remote\", \"Work from Home\", \"WFH\", \"Flexible Location\", return true.\n\nSalary:\n- Extract salary details as a plain integer.\n- Avoid including dollar signs and comma/period delimiters in the value.\n- If there is no value listed, or the value is not clear, return 0.\n\nLocation:\n- Extract the location based on the nearest Major New Zealand city if the suburb or area is not included in the list found in the json_schema.\n- If the location is too general (e.g. New Zealand), or located outside of New Zealand, return nothing.\n\n\nDescription:\n- Extract the full body of the job description.\n- Do not summarize the content.",
  "You are an expert at recognizing soft skills.\n\nExtract all the soft skills in this job description.\n\nTake a moment to read through all of the skills.\nEnsure there are no duplicates in meaning or spelling.\nSimplify the skills to a simpler form.\nOnly collect up to the top 10 most common soft skills.\n\nRules for splitting and formatting skills:\nIf a skill contains \"and\", \"or\", \"/\", or \",\", split it into multiple skills.\nIf you cannot split a skill, do not include the skill.\nDo not include the words \"skill\" or \"skills\" in the skill.\nReplace hyphens with spaces.\n\nEvery type should be \"soft skill\".",
  "You are an expert at recognizing programming languages.\n\nExtract all of the programming languages in this job description if any exist.\n\nMatch items extracted from the description to items in this list.\nPython\nJavaScript\nJava\nC\nC#\nC++\nTypeScript\nGo\nRust\nPHP\nLua\nSwift\nHaskell\n\nIf an item does not match an item from the list, do not include it.\n\nEvery type should be programming language.",
  "You are an expert at recognizing frameworks.\n\nExtract all of the frameworks in this job description if any exist.\n\nMatch extracted skills to items in this list.\nITIL\nCOBIT\nTOGAF\nZachman Framework\nNIST Cybersecurity Framework\nMITRE ATT&CK\nCIS Controls\nISO/IEC 27001\nISO/IEC 20000\nMOF\nCMMI\nOpen FAIR\nDODAF\nETOM\nIT4IT\nReact\nAngular\nVue.js\nNode.js\nExpress.js\nDjango\nFlask\nFastAPI\nSpring Boot\nASP.NET Core\n.NET\nLaravel\nRuby on Rails\nNext.js\nNuxt.js\nNestJS\nSvelte\nFlutter\nQt\nElectron\nReact Native\nIonic\nKtor\nPhoenix\nTensorFlow\nPyTorch\nUnity\nUnreal Engine\nGodot\n\nIf an item does not match an item from the list, do not include it.\n\nEvery type should be \"framework\".",
  "You are an expert at recognizing databases.\n\nExtract all of the databases in this job description if any exist.\n\nReturn nothing if no databases are mentioned.\n\nMatch items extracted from the description to exact items in this list.\nMySQL\nPostgreSQL\nMongoDB\nSQLite\nOracle Database\nMicrosoft SQL Server\nRedis\nMariaDB\nDynamoDB\nElasticsearch\nCassandra\nFirestore\nFirebase Realtime Database\nAmazon Aurora\nAmazon RDS\nAmazon Redshift\nGoogle Cloud SQL\nGoogle BigQuery\nAzure SQL Database\nCosmos DB\nIBM Db2\nNeo4j\nCouchbase\nClickHouse\nInfluxDB\nSnowflake\nTimescaleDB\nTiDB\nMemcached\n\nEvery type should be \"databases\".",
  "You are an expert at recognizing tools.\n\nExtract all of the tools in this job description if any exist.\n\nMatch extracted skills to exact items in this list.\nHTML\nCSS\nSQL\nBash\nMarkdown\nRegex\nGit\nGitHub\nGitLab\nBitbucket\nDocker\nKubernetes\nJenkins\nCircleCI\nTravis CI\nTerraform\nAnsible\nPuppet\nChef\nPostman\ncURL\nVisual Studio Code\nIntelliJ IDEA\nPyCharm\nEclipse\nAndroid Studio\nXcode\nFigma\nAdobe XD\nJIRA\nTrello\nSlack\nZoom\nNotion\nConfluence\nVS Code Dev Containers\nSentry\nNew Relic\nDatadog\nSplunk\nPrometheus\nGrafana\nElasticsearch\nLogstash\nKibana\nAWS CLI\nAzure CLI\nkubectl\nHelm\nngrok\nWireshark\nBurp Suite\nNmap\nZAP (OWASP)\n\nReturn nothing if no tools are mentioned.\n\nEvery type should be \"tool\".",
  "You are an expert at recognizing platforms.\n\nExtract all of the platforms in this job description if any exist.\n\nReturn nothing if no platforms are mentioned.\n\nRemove items that do not match the list below.\n\nMatch extracted skills to items in this list.\nAWS\nMicrosoft Azure\nGoogle Cloud Platform (GCP)\nHeroku\nNetlify\nVercel\nFirebase\nRender\nDigitalOcean\nCloudflare\nSalesforce\nWordPress\nShopify\nOpenShift\nPlatform.sh\nIBM Cloud\nOracle Cloud\nContentful\nStrapi\nAuth0\nSupabase\n\nEvery type should be \"platform\".",
  "You are an expert at recognizing methodologies.\n\nExtract all of the methodologies in this job description if any exist.\n\nMatch skills in the job descriptions to items in this list.\nAgile\nScrum\nKanban\nWaterfall\nLean\nExtreme Programming\nDevOps\nScaled Agile Framework\nSpiral Model\nRapid Application Development\nFeature-Driven Development\nTest-Driven Development\nBehavior-Driven Development\nDomain-Driven Design\nSix Sigma\nITIL\nPRINCE2\nPMBOK\nRational Unified Process\n\nReturn nothing if no methodologies are mentioned.\n\nEvery type should be \"methodology\"."
]

def structured_output(job_text: str, job_source: str) -> dict:
    responses = []
    for prompt in system_prompts:
      response = client.responses.parse(
        model="gpt-4.1-nano",
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
        top_p=1,
        store=True
      )
      responses.append(response.output_parsed)

       # Merge all skills into one array, deduplicating by name+type
    all_skills = []
    seen = set()
    for resp in responses:
        for skill in resp.skills:
            key = (skill.name, skill.type)
            if key not in seen:
                seen.add(key)
                all_skills.append(skill)

    # Use the first response as the base, but replace its skills with the merged list
    try:
      merged_job = responses[0].copy(update={"skills": all_skills, "source": job_source, "date": str(date.today())})
      return merged_job.dict()
    
    except Exception as e:
      raise Exception(f"Error parsing OpenAI response: {e}")
