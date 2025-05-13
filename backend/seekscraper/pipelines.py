# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
from index import app
from model import db
from model.job import Job, Skill

class JobDatabasePipeline:
    def process_item(self, item, spider):
        max_retries = 3
        with app.app_context():
            for attempt in range(1, max_retries + 1):
                try:
                    job_data = item.copy()
                    skills = job_data.pop('skills', [])
                    # Check for duplicate job entries and skip if found
                    existing_job = Job.query.filter_by(
                        title=job_data.get('title'),
                        company=job_data.get('company'),
                        location=job_data.get('location')
                    ).first()
                    if existing_job:
                        spider.logger.info(f"Duplicate job found: {job_data['title']} at {job_data['company']} on {job_data['date']}. Skipping.")
                        return None
                    job = Job(**job_data)
                    db.session.add(job)
                    db.session.flush()
                    for skill in skills:
                        db.session.add(Skill(job_id=job.id, **skill))
                    db.session.commit()
                    spider.logger.info(f"Job {job.id} added to the database.")
                    return item
                except Exception as e:
                    db.session.rollback()
                    spider.logger.error(f"Error adding job to database (attempt {attempt}): {e}")
                    if attempt == max_retries:
                        spider.logger.error(f"Max retries reached for item: {item}")
                        return None