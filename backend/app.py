from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Initialize the database
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # Configuration settings
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///your-database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)

    # Import and register the API routes
    from app.routes.position import api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api')

    return app
