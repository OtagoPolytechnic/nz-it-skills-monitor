import os
from flask_cors import CORS
from dotenv import load_dotenv
from flask import Flask, jsonify, request, g
from sqlalchemy import text, inspect, select, case
from sqlalchemy.orm import selectinload, load_only, subqueryload
from flask_migrate import Migrate
from model import db
from model.job import JobSchema, Job
from model.job import Skill, SkillSchema
import jwt
from flask_bcrypt import Bcrypt
import datetime
import subprocess
import threading
from flask_sock import Sock
from functools import wraps
import sys
from subprocess import run

import logging
from flask_sqlalchemy import SQLAlchemy

load_dotenv()

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)

sock = Sock(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_pre_ping': True}

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['ADMIN_USERNAME'] = os.getenv('ADMIN_USERNAME')
app.config['ADMIN_PASSWORD'] = os.getenv('ADMIN_PASSWORD')

db.init_app(app)
migrate = Migrate(app, db)

# logging.basicConfig(level=logging.DEBUG)
# logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

def generate_jwt_token(username):
    token = jwt.encode(
        {
            'username': username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        },
        app.config['SECRET_KEY'],
        algorithm='HS256'
    )
    return token

def verify_jwt_token(token):
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        logging.warning("Token has expired")
        return None
    except jwt.InvalidTokenError:
        logging.warning("Invalid token")
        return None

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Token is missing!"}), 403
        try:
            token = token.split()[1]
            decoded_token = verify_jwt_token(token)
            if not decoded_token:
                return jsonify({"error": "Invalid or expired token"}), 403
            g.user = decoded_token
            return f(*args, **kwargs)
        except Exception as e:
            logging.error(f"Exception occurred in token verification: {e}", exc_info=True)
            return jsonify({"error": "Invalid token format"}), 400
    return decorated_function

@app.route("/")
def hello_world():
    return "Hello, World!"

@app.route('/jobs', methods=['GET'])
def get_jobs():
    title = request.args.get('title')
    location = request.args.get('location')
    company = request.args.get('company')
    skill = request.args.get('skill')

    latest_scrape_id = db.session.query(db.func.max(Job.scrape_id)).scalar()
    query = Job.query.options(subqueryload(Job.skills))
    if latest_scrape_id:
        query = query.filter(Job.scrape_id == latest_scrape_id)

    if title:
        query = query.filter(Job.title.ilike(f'%{title}%'))
    if location:
        query = query.filter(Job.location.ilike(f'%{location}%'))
    if company:
        query = query.filter(Job.company.ilike(f'%{company}%'))
    if skill:
        query = query.filter(Job.skills.any(name=skill))

    jobs = query.all()
    job_schema = JobSchema(many=True, exclude=["description"])
    jobs_data = job_schema.dump(jobs)

    return jsonify(jobs_data)

@app.route('/jobs-over-time', methods=['GET'])
def get_jobs_over_time():
    try:
        latest_scrape_id = (
            db.session.query(Job.scrape_id)
            .filter(Job.scrape_id.isnot(None))
            .order_by(Job.scrape_id.desc())
            .limit(1)
            .scalar()
        )

        query = db.session.query(Job.date, db.func.count(Job.id))
        if latest_scrape_id:
            query = query.filter(Job.scrape_id == latest_scrape_id)

        results = (
            query.group_by(Job.date)
            .order_by(Job.date.asc())
            .all()
        )

        jobs_per_day = [
            {"date": d.isoformat(), "count": c}
            for d, c in results if d
        ]
        return jsonify(jobs_per_day), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/summary-metrics', methods=['GET'])
def summary_metrics():
    try:
        source = request.args.get('source')

        # 1) Get latest scrape_id (ignoring NULLs)
        latest_scrape_id = (
            db.session.query(db.func.max(Job.scrape_id))
            .filter(Job.scrape_id.isnot(None))
            .scalar()
        )

        base = db.session.query(Job)

        if source:
            base = base.filter(Job.source == source)

        # 2) Scope to the latest batch
        if latest_scrape_id is not None:
            # Normal path: use scrape_id
            base = base.filter(Job.scrape_id == latest_scrape_id)
        else:
            # Fallback: use latest Job.date (mimics old client logic)
            latest_date = (
                db.session.query(db.func.max(Job.date))
                .filter(Job.date.isnot(None))
            )
            if source:
                latest_date = latest_date.filter(Job.source == source)
            latest_date = latest_date.scalar()

            if latest_date is not None:
                base = base.filter(Job.date == latest_date)
            # If even date is None, base stays unfiltered (edge case: empty table)

        # --- totals ---
        total = base.with_entities(db.func.count(Job.id)).scalar() or 0

        # --- average salary ---
        avg_salary = (
            base.with_entities(db.func.avg(Job.salary))
            .filter(Job.salary.isnot(None), Job.salary > 0)
            .scalar()
        )
        avg_salary = int(round(avg_salary)) if avg_salary else None

        # --- helper for top fields ---
        def top_for(col):
            row = (
                base.with_entities(col.label("val"), db.func.count().label("cnt"))
                .filter(col.isnot(None), db.func.lower(col) != 'none')
                .group_by(col)
                .order_by(db.func.count().desc())
                .first()
            )
            return {"value": row.val, "count": int(row.cnt)} if row and row.val else None

        location    = top_for(Job.location)
        category    = top_for(Job.category)
        top_title   = top_for(Job.title)
        top_company = top_for(Job.company)

        # --- top skill ---
        skill_q = (
            db.session.query(Skill.name.label("val"), db.func.count().label("cnt"))
            .join(Job, Skill.job_id == Job.id)
        )
        if source:
            skill_q = skill_q.filter(Job.source == source)

        # reuse the same scope as `base`
        if latest_scrape_id is not None:
            skill_q = skill_q.filter(Job.scrape_id == latest_scrape_id)
        else:
            # if we fell back to date, mirror that
            latest_date_for_skills = (
                db.session.query(db.func.max(Job.date))
                .filter(Job.date.isnot(None))
            )
            if source:
                latest_date_for_skills = latest_date_for_skills.filter(Job.source == source)
            latest_date_for_skills = latest_date_for_skills.scalar()
            if latest_date_for_skills is not None:
                skill_q = skill_q.filter(Job.date == latest_date_for_skills)

        skill_row = (
            skill_q.group_by(Skill.name)
            .order_by(db.func.count().desc())
            .first()
        )
        top_skill = {"value": skill_row.val, "count": int(skill_row.cnt)} if skill_row and skill_row.val else None

        # --- scrape date helper (reporting only) ---
        scrape_date = (
            base.with_entities(db.func.max(Job.date)).scalar()
        )
        scrape_date = scrape_date.isoformat() if scrape_date else None

        return jsonify({
            "source": source,
            "scrapeId": int(latest_scrape_id) if latest_scrape_id is not None else None,
            "scrapeDate": scrape_date,
            "total": int(total),
            "avgSalary": avg_salary,
            "location": location,
            "category": category,
            "topSkill": top_skill,
            "topTitle": top_title,
            "topCompany": top_company,
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/salary-distribution', methods=['GET'])
def salary_distribution():
    try:
        # latest scrape id that actually exists
        latest_scrape_id = (
            db.session.query(Job.scrape_id)
            .filter(Job.scrape_id.isnot(None))
            .order_by(Job.scrape_id.desc())
            .limit(1)
            .scalar()
        )

        band = case(
            (Job.salary < 50000,  '0-50k'),
            (Job.salary < 75000,  '50k-75k'),
            (Job.salary < 100000, '75k-100k'),
            (Job.salary < 125000, '100k-125k'),
            (Job.salary < 150000, '125k-150k'),
            (Job.salary < 200000, '150k-200k'),
            else_='200k+'
        ).label('band')

        q = db.session.query(band, db.func.count(Job.id)).filter(Job.salary.isnot(None))
        if latest_scrape_id:
            q = q.filter(Job.scrape_id == latest_scrape_id)

        rows = q.group_by(band).all()

        order = ['0-50k','50k-75k','75k-100k','100k-125k','125k-150k','150k-200k','200k+']
        counts = {k: 0 for k in order}
        for b, c in rows:
            counts[b] = c

        data = [{'band': k, 'count': counts[k]} for k in order]
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/skills', methods=['GET'])
def get_skills_by_type():
    skill_type = request.args.get('type')
    if not skill_type:
        return jsonify({'error': 'Skill type is required'}), 400

    try:
        skills = Skill.query.filter_by(type=skill_type).all()
        skill_schema = SkillSchema(many=True)
        return jsonify(skill_schema.dump(skills)), 200
    except Exception as e:
        logging.error(f"Failed to fetch skills by type: {e}", exc_info=True)
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/skills-summary', methods=['GET'])
def get_skills_summary():
    try:
        latest_scrape_id = db.session.query(db.func.max(Job.scrape_id)).scalar()

        results = (
            db.session.query(Skill.type, Skill.name, db.func.count().label("count"))
            .join(Job)
        )

        if latest_scrape_id:
            results = results.filter(Job.scrape_id == latest_scrape_id)

        results = (
            results.group_by(Skill.type, Skill.name)
            .order_by(Skill.type, db.func.count().desc())
            .all()
        )

        summary = []
        for skill_type, skill_name, count in results:
            summary.append({
                "type": skill_type,
                "skill": skill_name,
                "count": count
            })

        return jsonify(summary), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if username == app.config['ADMIN_USERNAME'] and password == app.config['ADMIN_PASSWORD']:
        token = generate_jwt_token(username)
        return jsonify({"token": token}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

@app.route('/admin', methods=['GET'])
@token_required
def admin():
    return jsonify({"message": "Welcome to the admin panel!"}), 200

@app.route('/run-spiders', methods=['POST'])
@token_required
def run_spiders():
    print("🧠 g.user:", g.user)
    print("🔐 ADMIN_USERNAME from env:", app.config['ADMIN_USERNAME'])

    if g.user["username"] != app.config['ADMIN_USERNAME']:
        print("❌ Not authorized!")
        return jsonify({"message": "Unauthorized"}), 403

    def start():
        script_path = os.path.join(os.path.dirname(__file__), 'seekscraper', 'run_spiders.py')
        print("🚀 Running script:", script_path)
        subprocess.run([sys.executable, script_path])

    thread = threading.Thread(target=start)
    thread.start()

    return jsonify({"message": "Spiders are running"}), 200

def run_spider():
    spider_name = "job_spider"
    project_dir = os.path.dirname(__file__)
    script_path = os.path.join(project_dir, 'seekscraper', 'run_spiders.py')
    try:
        process = subprocess.Popen(
            [sys.executable, script_path],  # Use current Python interpreter
            cwd=project_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        processes[spider_name] = process
        with process.stdout:
            for line in iter(process.stdout.readline, ''):
                message = f"{spider_name}: {line.strip()}"
                with clients_lock:
                    for ws in clients:
                        ws.send(message)
        process.wait()
        if spider_name in processes:
            del processes[spider_name]
    except Exception as e:
        with clients_lock:
            for ws in clients:
                ws.send(f"Error running spider {spider_name}: {e}")

clients = set()
clients_lock = threading.Lock()
processes = {}

@sock.route('/scrape-status')
def scrape_status(ws):
    with clients_lock:
        clients.add(ws)
    try:
        while True:
            data = ws.receive()
            if data is None:
                break
    finally:
        with clients_lock:
            clients.remove(ws)

@app.route('/stop-spiders', methods=['GET'])
@token_required
def stop_spiders():
    for spider_name, process in processes.items():
        process.terminate()
    processes.clear()
    return jsonify({'message': 'Spiders stopped'}), 200

@app.route('/job-locations', methods=['GET'])
def job_locations():
    latest_scrape_id = db.session.query(db.func.max(Job.scrape_id)).scalar()
    jobs = Job.query
    if latest_scrape_id:
        jobs = jobs.filter(Job.scrape_id == latest_scrape_id)
    jobs = jobs.all()

    CITY_COORDINATES = {
        'Auckland': [-36.8485, 174.7633],
        'Wellington': [-41.2865, 174.7762],
        'Christchurch': [-43.5321, 172.6306],
        'Dunedin': [-45.8788, 170.5036],
        'Hamilton': [-37.7870, 175.2793],
        'Tauranga': [-37.6860, 176.1674],
        'Napier': [-39.4928, 176.9120],
        'Nelson': [-41.2706, 173.2839],
        'Rotorua': [-38.1368, 176.2497],
        'Queenstown': [-45.0312, 168.6626]
    }

    city_counts = {}
    for job in jobs:
        city = job.location.strip() if job.location else ''
        for known_city in CITY_COORDINATES.keys():
            if known_city.lower() in city.lower():
                city_counts[known_city] = city_counts.get(known_city, 0) + 1
                break

    heatmap_points = []
    for city, count in city_counts.items():
        lat, lng = CITY_COORDINATES[city]
        heatmap_points.append([lat, lng, count])

    return jsonify(heatmap_points)

@app.route('/location-summary', methods=['GET'])
def get_location_summary():
    try:
        latest_scrape_id = db.session.query(db.func.max(Job.scrape_id)).scalar()
        results = db.session.query(Job.location, db.func.count().label("count"))

        if latest_scrape_id:
            results = results.filter(Job.scrape_id == latest_scrape_id)

        results = (
            results.group_by(Job.location)
            .order_by(db.func.count().desc())
            .all()
        )

        summary = []
        for location, count in results:
            if location and location.lower() != 'none':
                summary.append({
                    "location": location,
                    "count": count
                })

        return jsonify(summary), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.after_request
def add_no_store(resp):
    resp.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    resp.headers["Pragma"] = "no-cache"
    return resp

if __name__ == '__main__':
    app.run(debug=True)
