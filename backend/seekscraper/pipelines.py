from itemadapter import ItemAdapter
from index import app
from model import db
from model.job import Job, Skill

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

                existing_job = Job.query.filter_by(
    title=job_data.get('title'),
    company=job_data.get('company'),
    date=job_data.get('date'),
    location=job_data.get('location')
).first()


                if existing_job:
                    if spider:
                        spider.logger.info(f"Duplicate job found: {job_data['title']} at {job_data['company']} on {job_data['date']}. Skipping.")
                    else:
                        print(f"Duplicate job found: {job_data['title']} at {job_data['company']} on {job_data['date']}. Skipping.")
                    return None

                job = Job(**job_data)
                db.session.add(job)
                db.session.flush()

                for skill in skills:
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
