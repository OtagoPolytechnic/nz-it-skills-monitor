from itemadapter import ItemAdapter
from index import app
from model import db
from model.job import Job, Skill

SYNONYMS = {
    "python3": "python",
    "py": "python",
    "c#": "csharp",
    "c-sharp": "csharp",
    "c sharp": "csharp",
    "c++": "cplusplus",
    "cpp": "cplusplus",
    "js": "javascript",
    "java script": "javascript",
    "react.js": "react",
    "reactjs": "react",
    "react js": "react",
    "node.js": "node",
    "nodejs": "node",
    "node js": "node",
    "vue.js": "vue",
    "vuejs": "vue",
    "angular.js": "angular",
    "angularjs": "angular",
    "aws cloud": "aws",
    "amazon web services": "aws",
    "gcp": "google cloud",
    "google cloud platform": "google cloud",
    "ms azure": "azure",
}

def normalize_skill_name(name: str) -> str:
    """Normalize skill names (case + synonyms)."""
    if not name:
        return ""
    cleaned = name.strip().lower()
    return SYNONYMS.get(cleaned, cleaned)

class JobDatabasePipeline:
    def process_item(self, item, spider=None):
        if not item.get('title') or not item.get('company') or not item.get('location'):
            if spider:
                spider.logger.info(f"Skipping item due to missing required fields: {item}")
            else:
                print(f"Skipping item due to missing required fields: {item}")
            return None

        with app.app_context():
            try:
                job_data = item.copy()
                skills = job_data.pop('skills', [])

                existing_job = Job.query.filter_by(source=job_data.get('source')).first()

                if existing_job:
                    if spider:
                        spider.logger.info(f"Duplicate job found from source: {job_data['source']}. Skipping.")
                    else:
                        print(f"Duplicate job found from source: {job_data['source']}. Skipping.")
                    return None

                job = Job(**job_data)
                db.session.add(job)
                db.session.flush()

                for skill in skills:
                    normalized_name = normalize_skill_name(skill.get("name", ""))  # <-- new function
                    if not normalized_name:
                        continue
                    skill["name"] = normalized_name
                    db.session.add(Skill(job_id=job.id, **skill))
                db.session.commit()

                if spider:
                    spider.logger.info(f"Job {job.id} added to the database.")
                else:
                    print(f"Job {job.id} added to the database.")

                return item
            except Exception as e:
                db.session.rollback()
                if spider:
                    spider.logger.error(f"Error adding job to database: {e}")
                else:
                    print(f"Error adding job to database: {e}")
                return None
