from model import db
from model.job import Job, Skill
from model.summary import (
    SummaryJobsOverTime,
    SummarySkills,
    SummaryLocations,
    SummarySalaryDistribution,
    SummaryTopCompanies,
)
from sqlalchemy import func, case


def update_summary_jobs_over_time():
    """Refresh the summary_jobs_over_time table."""
    db.session.query(SummaryJobsOverTime).delete()

    results = (
        db.session.query(Job.date, func.count(Job.id))
        .filter(Job.date.isnot(None))
        .group_by(Job.date)
        .order_by(Job.date.asc())
        .all()
    )

    for date_val, count in results:
        db.session.add(SummaryJobsOverTime(date=date_val, job_count=count))

    db.session.commit()
    print(f" Updated {len(results)} records in summary_jobs_over_time.")


def update_summary_skills():
    """Refresh the summary_skills table."""
    db.session.query(SummarySkills).delete()

    results = (
        db.session.query(Skill.type, Skill.name, func.count(Skill.job_id))
        .group_by(Skill.type, Skill.name)
        .order_by(Skill.type, func.count(Skill.job_id).desc())
        .all()
    )

    for skill_type, name, count in results:
        db.session.add(
            SummarySkills(type=skill_type or "Unknown", name=name or "Unknown", job_count=count)
        )

    db.session.commit()
    print(f" Updated {len(results)} records in summary_skills.")


def update_summary_locations():
    """Refresh the summary_locations table."""
    db.session.query(SummaryLocations).delete()

    results = (
        db.session.query(Job.location, func.count(Job.id))
        .filter(Job.location.isnot(None))
        .group_by(Job.location)
        .order_by(func.count(Job.id).desc())
        .all()
    )

    for location, count in results:
        db.session.add(SummaryLocations(location=location or "Unknown", job_count=count))

    db.session.commit()
    print(f" Updated {len(results)} records in summary_locations.")


def update_summary_salary_distribution():
    """Refresh the summary_salary_distribution table."""
    db.session.query(SummarySalaryDistribution).delete()

    band = case(
        (Job.salary < 50000, "0-50k"),
        (Job.salary < 75000, "50k-75k"),
        (Job.salary < 100000, "75k-100k"),
        (Job.salary < 125000, "100k-125k"),
        (Job.salary < 150000, "125k-150k"),
        (Job.salary < 200000, "150k-200k"),
        else_="200k+",
    ).label("band")

    results = (
        db.session.query(band, func.count(Job.id))
        .filter(Job.salary.isnot(None))
        .group_by(band)
        .all()
    )

    for band_label, count in results:
        db.session.add(SummarySalaryDistribution(salary_band=band_label, job_count=count))

    db.session.commit()
    print(f" Updated {len(results)} records in summary_salary_distribution.")


def update_summary_top_companies():
    """Refresh the summary_top_companies table."""
    db.session.query(SummaryTopCompanies).delete()

    results = (
        db.session.query(Job.company, func.count(Job.id))
        .filter(Job.company.isnot(None))
        .group_by(Job.company)
        .order_by(func.count(Job.id).desc())
        .limit(50)
        .all()
    )

    for company, count in results:
        db.session.add(SummaryTopCompanies(company_name=company or "Unknown", job_count=count))

    db.session.commit()
    print(f"Updated {len(results)} records in summary_top_companies.")


def update_all_summaries():
    """Run all summary refresh functions."""
    print("🔄 Updating all summary tables...")
    update_summary_jobs_over_time()
    update_summary_skills()
    update_summary_locations()
    update_summary_salary_distribution()
    update_summary_top_companies()
    print(" All summaries updated successfully.")