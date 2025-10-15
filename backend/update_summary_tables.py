import re
from model import db
from model.job import Job, Skill
from model.summary import (
    SummaryJobsOverTime,
    SummarySkills,
    SummaryLocations,
    SummarySalaryDistribution,
    SummaryTopCompanies,
    SummaryAverageSalaryOverTime,
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

def parse_salary_text(text):
    """Extract numeric salary averages from salary text (e.g. '$80k-$100k', '$90,000', '80k per year')."""
    if not text:
        return None

    # Find numbers like 90k, 100k, 90,000, etc.
    matches = re.findall(r"\$?\s*([\d.,]+)\s*([kK]?)", text)
    if not matches:
        return None

    nums = []
    for num, suffix in matches:
        try:
            # Normalize commas and dots
            n = float(num.replace(",", "").replace(" ", ""))
            # Convert 'k' to thousands
            if suffix.lower() == "k":
                n *= 1000
            nums.append(n)
        except ValueError:
            continue

    # Remove unrealistic values
    nums = [n for n in nums if 1000 < n < 500000]
    if not nums:
        return None

    # Return average
    return round(sum(nums) / len(nums), 2)


def update_summary_average_salary_over_time():
    """Recalculate and refresh average salary per scrape date from Job table."""
    print("🔄 Updating summary_average_salary_over_time ...")
    db.session.query(SummaryAverageSalaryOverTime).delete()

    jobs = db.session.query(Job.date, Job.salary, Job.description).filter(Job.date.isnot(None)).all()

    buckets = {}  # {date: [salaries]}
    for date_val, numeric_salary, desc in jobs:
        # Prefer numeric salary if valid, otherwise parse from description
        salary_val = numeric_salary or parse_salary_text(desc)
        if not salary_val or salary_val <= 0:
            continue
        buckets.setdefault(date_val, []).append(salary_val)

    # Insert averages into summary table
    for d, salaries in buckets.items():
        avg_salary = sum(salaries) / len(salaries)
        db.session.add(SummaryAverageSalaryOverTime(date=d, avg_salary=round(avg_salary, 2)))

    db.session.commit()
    print(f"✅ Updated {len(buckets)} records in summary_average_salary_over_time.")