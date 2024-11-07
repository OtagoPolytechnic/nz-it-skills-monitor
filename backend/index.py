import os
from flask_cors import CORS
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from sqlalchemy import text, inspect, select
from sqlalchemy.orm import selectinload, load_only, subqueryload
from flask_migrate import Migrate
from flask_socketio import SocketIO, emit
from model import init_app, db
from model.job import JobSchema, Job
import jwt
from flask_bcrypt import Bcrypt
import datetime
import subprocess
from flask_sock import Sock

import logging
from flask_sqlalchemy import SQLAlchemy

load_dotenv()

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)

sock = Sock(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

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
    # Query all jobs from the Job table
    jobs = Job.query.options(subqueryload(Job.skills)).all()
    # Serialize the data using the JobSchema
    job_schema = JobSchema(many=True, exclude=["description"])
    jobs_data = job_schema.dump(jobs)

    return jsonify(jobs_data)

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


def run_spider(spider_name):
    cwd = os.path.join(os.path.dirname(__file__), 'itjobscraper', 'itjobscraper')
    if not os.path.exists(cwd):
        socketio.emit('scraper_output', {'error': f"Directory not found: {cwd}"})
        return
    process = subprocess.Popen(
        ['scrapy', 'crawl', spider_name],
        cwd=cwd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    try:
        for line in iter(process.stdout.readline, ''):
            socketio.emit('scraper_output', {'data': line})
        process.wait()
    except Exception as e:
        socketio.emit('scraper_output', {'error': str(e)})
    finally:
        process.stdout.close()

if __name__ == '__main__':
    socketio.run(app, debug=True)
    
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