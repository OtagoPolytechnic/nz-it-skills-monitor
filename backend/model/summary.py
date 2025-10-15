from . import db

class SummaryJobsOverTime(db.Model):
    __tablename__ = 'summary_jobs_over_time'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    job_count = db.Column(db.Integer, nullable=False)


class SummarySkills(db.Model):
    __tablename__ = 'summary_skills'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    job_count = db.Column(db.Integer, nullable=False)


class SummaryLocations(db.Model):
    __tablename__ = 'summary_locations'
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(255), nullable=False)
    job_count = db.Column(db.Integer, nullable=False)


class SummarySalaryDistribution(db.Model):
    __tablename__ = 'summary_salary_distribution'
    id = db.Column(db.Integer, primary_key=True)
    salary_band = db.Column(db.String(50), nullable=False)
    job_count = db.Column(db.Integer, nullable=False)


class SummaryTopCompanies(db.Model):
    __tablename__ = 'summary_top_companies'
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(255), nullable=False)
    job_count = db.Column(db.Integer, nullable=False)

class SummaryAverageSalaryOverTime(db.Model):
    __tablename__ = 'summary_average_salary_over_time'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    avg_salary = db.Column(db.Float, nullable=False)

