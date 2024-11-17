# tests/test_routes.py
import pytest
from index import app

@pytest.fixture(scope='module')
def test_client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_home_page(test_client):
    """Test the home route"""
    response = test_client.get('/')
    
    # Assert status code is 200 (OK)
    assert response.status_code == 200
    
    # Assert response data is the correct string
    assert response.data.decode('utf-8') == "Hello, World!"  # The expected plain text response


def test_jobs_page_with_mocking(test_client, mocker):
    """Test the jobs route with mocking"""
    # Mock some function or method (e.g., a database call)
    mocker.patch('index.get_jobs', return_value=[{"title": "Technical Account Manager", "description": "About the companyThis distinguished organization is a leading Atlassian Platinum Solution Partner, recognized for its exceptional track record of delivering outstanding client outcomes. With a commitment to cutting through bureaucracy, they employ a unique, agile-managed service model that drives efficiency and results.Operating primarily across New Zealand, Australia, and Singapore, the company functions as a fully remote team, ensuring flexibility and collaboration across borders. As an Atlassian Platinum Partner, they handle technically complex and diverse solutions, offering both challenge and engagement. In this role, you will have the opportunity to represent the organization’s significant value proposition and showcase Atlassian's full suite of capabilities. The role and expectations. You will:Be part of a global team delivering exceptional solutions using the Atlassian Suite, particularly Jira, Confluence and Jira Service Management.Provide expert account and positive client relationship management to foster long term satisfaction and repeat business.Understand Customer Success Management in a SaaS setting to maintain and grow the footprint.Be working with existing clients, guiding them through the maintain retention process.Handle commercial negotiations such as licence renewals and managed service contracts.Collaborate with the Technical Team pre and post sales for seamless execution and client satisfaction.Work with the internal teams to align strategies and drive continuous improvement.You will need:Deep Account Management experience with SaaS based products and a passion for user centric innovative solutions.Great client facing skills to grow positive and long-term client relations.Self-management to thrive in this high trust organisation.Project Management skills.Ability to manage ambiguity.Previous experience in a SaaS vendor organisation.Previous Atlassian experience is highly desirable but not essential.An understanding of ITSM and its value to organisations is highly desirable.About you: We are seeking a motivated individual who is eager to take on new challenges and thrive in a dynamic environment. In this role, you will work with a diverse range of clients across various industries, crafting tailored solutions to meet unique business needs.This position demands strong problem-solving abilities and a keen analytical mindset, enabling you to identify the root causes of clients' issues and propose multiple effective solutions.Beyond technical expertise, we highly value alignment with our core principles—customer service, loyalty, and honesty. We're looking for a team player who shares our passion for delivering exceptional Atlassian solutions with integrity and dedication. If you're ready to make an impact and grow with us, we want to hear from you.Ashley Sadler, [email protected] +64 (0)27 241 0884", "location": "Auckland", "company": "JOYN", "duration": "Full time", "source": "seek", "skills": "[{\"name\": \"jira\", \"type\": \"tool\"}, {\"name\": \"confluence\", \"type\": \"tool\"}, {\"name\": \"jira service management\", \"type\": \"tool\"}, {\"name\": \"customer service\", \"type\": \"soft skill\"}, {\"name\": \"problem solving\", \"type\": \"soft skill\"}, {\"name\": \"project management\", \"type\": \"methodology\"}]", "salary": 0, "date": "2024-10-21", "category": "consultant", "type": "None"},
    {"title": "Lead Data Engineer", "description": "**He Waka Eke Noa | Creating Great Together   ** \nHere at BNZ, it's about more than just banking. We work together in an agile, energising environment to create innovative solutions through our promise \"If you can imagine a better future, let's find a way.\"\nWe have an exciting opportunity for someone to provide senior and specialist support and guidance in the development and maintenance of quality data and practices for data engineering and analytics activities!\n**Mō te Tūranga | About the Role **\nWe sat down with our Head of Data Engineering, who let us know the following about the role:\nWhat are 5 day to day tasks the person in this role will complete? \n\nLead bank-wide data engineering expertise, including development of data engineering practices, standards, and frameworks.\nTake the lead when working collaboratively across teams to ensure that investment in foundational data products are delivering to the needs of the business.\nWork with the engineers to ensure all frameworks, standards and procedures adhere to BNZ requirements, are high calibre and follow governance and risk frameworks.\nLead, advise and support the development and maintenance of quality data, data infrastructure and conformed data outcomes.\nProvide guidance and support to Data Engineers through code reviews and technical leadership.\n\nWhat is the team culture and environment like?\nThe team is made up of experienced data engineers at all levels of experience who regularly share their recent projects, learnings and tips & tricks.\nIn the wider group (Data, Analytics & Strategy) we foster an open, flexible and inclusive environment that supports collaboration within the immediate team and across the teams in the wider DA&S organisation.\nWhat is your favourite thing about working for BNZ?\nThe people and culture - people are truly valued and while our data is not perfect, we strive to find a way to make things work.\nWhat attributes will this person display in order to be successful in this role?\n\nA strong background in modern data engineering practices.\nA passion for mentoring and sharing knowledge of engineering principles and practices.\nExcellent technical presentation skills.\nProven experience and competence in modern software engineering practices and tooling\n\nWhat is the most exciting thing about this opportunity?\nYou will be responsible for defining data engineering strategies and frameworks across the enterprise to deliver trusted and quality assured data assets!\nNau Mai ki te Pēke o Aotearoa | Come to the Bank of New Zealand \nIf you are keen to join a fun organisation where we are proud of our culture and how we are helping New Zealander's to 'Find their way', then please review the Job Description and show your interest by submitting your application - we can't wait to read it. \nApplications close Tuesday 15th October at 11:55pm.", "location": "Auckland", "company": "BNZ", "duration": "Full time", "source": "seek", "skills": "[{\"name\": \"data engineering\", \"type\": \"methodology\"}, {\"name\": \"agile\", \"type\": \"methodology\"}, {\"name\": \"collaboration\", \"type\": \"soft skill\"}, {\"name\": \"communication\", \"type\": \"soft skill\"}, {\"name\": \"problem solving\", \"type\": \"soft skill\"}]", "salary": 0, "date": "2024-10-21", "category": "other", "type": "None"},
    {"title": "Senior Functional Business Analyst – ServiceNow", "description": "About usThe Fletcher Building family is a community made up of people who use all their experience, skills, and individuality to do amazing work. We have businesses across New Zealand, Australia, and the South Pacific.FletcherTech is Fletcher Building’s Tech Division. The team works together to shape the futures of all Fletcher Building businesses. FletcherTech recognises that people are a team’s greatest asset. With the opportunity to help drive technological excellence for more than thirty businesses across Australia, New Zealand, and the South Pacific, FletcherTech offers one of the most interesting careers in tech.About the opportunityAs a Senior Functional Business Analyst, you will have the opportunity to join a high performing team that truly adds value to our business by helping us achieve our goals through effective use of technology such as ServiceNow. In this role, you will play a key role in the development, administration, and support of our ServiceNow platform.It’s a varied role but some of the key responsibilities include:Enable Enterprise Service Management across Fletcher Building through ServiceNowEnsure high level of service availability for our end usersIdentify process improvements and opportunities for efficiencyEnsuring stakeholder requirements are incorporated into tooling design and roadmaps where appropriateDevelop systems integration and process automation for ServiceNowCreate and configure Discovery, Orchestration, Business Rules, Policies, and other elements as required within the platformCreate and maintain Service Catalogue, Reports, and DashboardsAbout youTo make it here, we are looking for people who thrive working in a team environment, passionate about performance, put the customer first, and are always thinking about innovative ways to solve business and customer needs.For this role, we are also looking for:Excellent stakeholder management skills – builds and maintains good working relationships with Business leaders, product owners and users at all levelsNatural problem solver, analytical, and inquisitiveThorough understanding ITIL and project management processes in an IT Service Delivery environmentDesign, build, implementation, and deployment experience in an Agile delivery modelExperience as a ServiceNow System Administrator / FBA / DeveloperNext StepsOur people act with integrity, are open and honest and always looking for ways to improve. If this sounds like you, apply now!As an Equal Opportunity Employer, we strive to create an inclusive environment for all our employees. We welcome applicants from diverse backgrounds to apply to any of our vacant positions. Talk to us about our flexible working arrangements and career pathways.", "location": "Penrose,", "company": "Fletcher Building Group", "duration": "Full time", "source": "seek", "skills": "[{\"name\": \"servicenow\", \"type\": \"platform\"}, {\"name\": \"itil\", \"type\": \"certification\"}, {\"name\": \"agile\", \"type\": \"methodology\"}, {\"name\": \"problem solving\", \"type\": \"soft skill\"}, {\"name\": \"communication\", \"type\": \"soft skill\"}, {\"name\": \"teamwork\", \"type\": \"soft skill\"}]", "salary": 0, "date": "2024-10-21", "category": "business & systems analysts", "type": "None"}])

    response = test_client.get('/jobs')
    assert response.status_code == 200
    assert response.json == [
    {
        "category": "business & systems analysts",
        "company": "SKOPE Industries Ltd",
        "date": "2024-11-14",
        "duration": "None",
        "id": 354,
        "location": "None",
        "salary": 0,
        "skills": [
            {
                "name": "data analyst",
                "type": "soft skill"
            },
            {
                "name": "power bi",
                "type": "tool"
            },
            {
                "name": "sql",
                "type": "language"
            },
            {
                "name": "python",
                "type": "language"
            },
            {
                "name": "azure",
                "type": "platform"
            }
        ],
        "title": "Data Analyst",
        "type": "None"
    },
    {
        "category": "programming & development",
        "company": "Trade Me",
        "date": "2024-11-14",
        "duration": "None",
        "id": 355,
        "location": "None",
        "salary": 0,
        "skills": [
            {
                "name": "c#",
                "type": "language"
            },
            {
                "name": ".net framework",
                "type": "framework"
            },
            {
                "name": "css",
                "type": "language"
            },
            {
                "name": "javascript",
                "type": "language"
            },
            {
                "name": "angular",
                "type": "framework"
            },
            {
                "name": "sql",
                "type": "language"
            },
            {
                "name": "microsoft sql server",
                "type": "database"
            },
            {
                "name": "teamwork",
                "type": "soft skill"
            }
        ],
        "title": "Full Stack Engineer - Senior",
        "type": "None"
    }]