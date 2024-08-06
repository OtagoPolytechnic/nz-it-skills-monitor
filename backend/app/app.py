
import json

app = Flask(__name__)



@app.route('/position', methods=['GET'])
def get_position():
 return jsonify(positions)
