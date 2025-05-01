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

# logging to see why query is slow
# logging.basicConfig(level=logging.DEBUG)
# logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

def generate_jwt_token(username):
    token = jwt.encode(
        {
            'username': username,  # User information
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Expiry time
        },
        app.config['SECRET_KEY'],  # Secret to sign the token
        algorithm='HS256'  # Algorithm used for signing
    )
    return token

def verify_jwt_token(token):
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        # logging.debug(f"Token payload: {payload}")
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
            # logging.warning("Token is missing in the request headers")
            return jsonify({"error": "Token is missing!"}), 403
        try:
            # logging.debug(f"Raw token received: {token}")
            token = token.split()[1]
            # logging.debug(f"Token after split: {token}")
            decoded_token = verify_jwt_token(token)
            if not decoded_token:
                logging.warning("Invalid or expired token")
                return jsonify({"error": "Invalid or expired token"}), 403
            g.user = decoded_token  # Store the decoded token in the global context
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

    # Start building the query
    query = Job.query.options(subqueryload(Job.skills))

    # Apply filters only if they are provided
    if title:
        query = query.filter(Job.title.ilike(f'%{title}%'))
    if location:
        query = query.filter(Job.location.ilike(f'%{location}%'))
    if company:
        query = query.filter(Job.company.ilike(f'%{company}%'))
    if skill:
        # Search skills in the related Skill model
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
    
    # Check the credentials using the values from the .env file
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
        # wipe_data()
        logging.info("Starting spiders...")
        threading.Thread(target=start_crawlers).start()
        return jsonify({'message': 'Spiders started'}), 200
    except Exception as e:
        logging.error(f"Exception occurred while starting spiders: {e}", exc_info=True)
        return jsonify({"error": "Failed to start spiders"}), 500


def start_crawlers():
    logging.debug("Entered start_crawlers function")
    spiders = ['seekspider']
    threads = []
    for spider in spiders:
        logging.info(f"Starting spider thread for: {spider}")
        thread = threading.Thread(target=run_spider, args=(spider,))
        thread.start()
        threads.append(thread)
    logging.debug("Waiting for spider threads to complete")
    for thread in threads:
        thread.join()
    logging.info("All spiders have completed")

def run_spider(spider_name):
    logging.debug(f"Running spider: {spider_name}")
    project_dir = os.path.join(os.path.dirname(__file__), 'itjobscraper')
    if not os.path.exists(project_dir):
        logging.error(f"Project directory not found: {project_dir}")
        return
    try:
        process = subprocess.Popen(
            ['scrapy', 'crawl', spider_name],
            cwd=project_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        processes[spider_name] = process  # Store the process in the dictionary
        logging.info(f"Started subprocess for spider: {spider_name}")
        with process.stdout:
            for line in iter(process.stdout.readline, ''):
                message = f"{spider_name}: {line.strip()}"
                logging.debug(f"Received output from spider {spider_name}: {line.strip()}")
                with clients_lock:
                    for ws in clients:
                        ws.send(message)
        process.wait()
        logging.info(f"Subprocess for spider {spider_name} completed with exit code {process.returncode}")
        if spider_name in processes:
            del processes[spider_name]  # Remove the process from the dictionary when done
    except Exception as e:
        logging.error(f"Exception occurred while running spider {spider_name}: {e}", exc_info=True)
        with clients_lock:
            for ws in clients:
                ws.send(f"Error running spider {spider_name}: {e}")
def wipe_data():
    logging.info("Wiping the database data")
    meta = db.metadata
    for table in reversed(meta.sorted_tables):
        logging.info(f"Deleting data from table {table.name}")
        db.session.execute(table.delete())
    db.session.commit()


clients = set()
clients_lock = threading.Lock()
processes = {}  # Dictionary to keep track of running processes

@sock.route('/scrape-status')
def scrape_status(ws):
    with clients_lock:
        clients.add(ws)
    try:
        while True:
            data = ws.receive()
            if data is None:
                break  # Client disconnected
    finally:
        with clients_lock:
            clients.remove(ws)

@app.route('/stop-spiders', methods=['GET'])
@token_required
def stop_spiders():
    logging.info("Received request to stop spiders")
    for spider_name, process in processes.items():
        logging.info(f"Terminating spider: {spider_name}")
        process.terminate()  # Terminate the process
    processes.clear()  # Clear the dictionary
    return jsonify({'message': 'Spiders stopped'}), 200



# @app.route('/tables', methods=['GET'])
# def list_tables():
#     # Retrieve the list of tables from the database
#     inspector = inspect(db.engine)
#     tables = inspector.get_table_names()

#     # Dictionary to hold table schemas
#     schemas = {}

#     # Iterate over tables to get their schema
#     for table in tables:
#         columns = inspector.get_columns(table)
#         # Convert column types to strings to make them JSON serializable
#         for column in columns:
#             column['type'] = str(column['type'])
#         schemas[table] = columns
    
#     return jsonify(schemas)


# @app.route('/test-db')
# def get_db_version():
#     session = db.session()
#     try:
#         result = session.execute(text("SELECT version();"))
#         version = result.fetchone()[0]
#         return jsonify({"database_version": version})
#     except Exception as e:
#         session.rollback()
#         return jsonify({"error": str(e)}), 500
#     finally:
#         session.close()

if __name__ == '__main__':
    app.run(debug=True)