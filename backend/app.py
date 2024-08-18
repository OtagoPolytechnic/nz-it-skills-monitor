from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate ,MigrateCommand
from flask_script import Manager
from .app.routes.position import positions

# Initialize the database
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # Configuration settings
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)
    migrate = Migrate(app, db)

    # Import and register the API routes
    from app.routes.position import api_blueprint
    app.register_blueprint(positions, url_prefix='/api')

    return app

app = create_app()

# Setup Flask-Script manager
manager = Manager(app)
manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
