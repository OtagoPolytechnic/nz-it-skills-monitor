import os
from flask_cors import CORS
from dotenv import load_dotenv
from flask import Flask, jsonify, request, g
from sqlalchemy import text, inspect, select
from sqlalchemy.orm import selectinload, load_only, subqueryload
from flask_migrate import Migrate
from model import init_app, db
from model.job import JobSchema, Job
from model.job import Skill, SkillSchema
import jwt
from flask_bcrypt import Bcrypt
import datetime
import subprocess
import threading
from flask_sock import Sock
from functools import wraps

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

init_app(app)
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

    query = Job.query.options(subqueryload(Job.skills))

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

@app.route('/run-spiders', methods=['GET'])
@token_required
def run_spiders():
    try:
        logging.info("Starting spiders...")
        threading.Thread(target=start_crawlers).start()
        return jsonify({'message': 'Spiders started'}), 200
    except Exception as e:
        logging.error(f"Exception occurred while starting spiders: {e}", exc_info=True)
        return jsonify({"error": "Failed to start spiders"}), 500

def start_crawlers():
    run_spider()

def run_spider():
    project_dir = os.path.dirname(__file__)
    script_path = os.path.join(project_dir, 'seekscraper', 'run_spiders.py')
    try:
        process = subprocess.Popen(
            ['python', script_path],
            cwd=project_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        processes['run_spiders'] = process
        with process.stdout:
            for line in iter(process.stdout.readline, ''):
                message = f"run_spiders: {line.strip()}"
                with clients_lock:
                    for ws in clients:
                        ws.send(message)
        process.wait()
        if 'run_spiders' in processes:
            del processes['run_spiders']
    except Exception as e:
        with clients_lock:
            for ws in clients:
                ws.send(f"Error running run_spiders.py: {e}")

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
    jobs = Job.query.all()

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

if __name__ == '__main__':
    app.run(debug=True)