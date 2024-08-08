from flask import Flask
from routes.position import create_bp

app = Flask(__name__)

app.position_blueprint(create_bp)

if __name__ == '__main__':
    app.run(debug=True)
