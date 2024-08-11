from flask import Flask

def create_app():
    app = Flask(__name__)

    # Import the routes and register them
    from .routes import main_blueprint
    app.register_blueprint(main_blueprint)

    return app
