import os
from flask_cors import CORS
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from sqlalchemy import text, inspect
from flask_migrate import Migrate
from model import init_app, db
from model.job import JobSchema, Job
import jwt
from flask_bcrypt import Bcrypt
import datetime

load_dotenv()

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['ADMIN_USERNAME'] = os.getenv('ADMIN_USERNAME')
app.config['ADMIN_PASSWORD'] = os.getenv('ADMIN_PASSWORD')

init_app(app)
migrate = Migrate(app, db)

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
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


@app.route("/")
def hello_world():
    return "Hello, World!"

@app.route('/jobs', methods=['GET'])
def get_jobs():
    # Query all jobs from the Job table
    jobs = Job.query.all()

    # Serialize the data using the JobSchema
    job_schema = JobSchema(many=True)
    jobs_data = job_schema.dump(jobs)

    return jsonify(jobs_data)

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