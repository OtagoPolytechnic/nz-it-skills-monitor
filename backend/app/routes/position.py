from flask import Flask, json, jsonify, request, Blueprint, render_template

app = Blueprint('main', __name__)

positions = [
 { 'id': 1, 'jobTitle': 'QA', 'company': 'Google', 'location': 'Mountain View, CA', 
  'salary': 34000, 'description':'fbh', 'date_listed':'31st june' , 
  'applications_close':'1st july' }]
 
nextPositionId = 1

def position_is_valid(position):
    required_keys = ["jobTitle", "company", "location", "salary", "description", 
                     "date_listed", "applications_close"]
    return all(key in position for key in required_keys)

def get_position(id):
    for position in positions:
        if position["id"] == id:
            return position
    return None

@app.route('/')
@app.route('/positions')
def index():
    return "Welcome to the IT Skills API!"

@app.route('/positions', methods=['POST'])
def create_position():
    global nextPositionId
    position = json.loads(request.data)
    if not position_is_valid(position):
        return jsonify({'error': 'Invalid position properties.'}), 400

    position['id'] = nextPositionId
    nextPositionId += 1
    positions.append(position)

    return '', 201, {'location': f'/positions/{position["id"]}'}

@app.route('/positions', methods=['GET'])
def get_positions():
    return jsonify(positions)

@app.route('/positions/<int:id>', methods=['PUT'])
def update_position(id):
    position = get_position(id)
    if position is None:
        return jsonify({'error': 'Position does not exist.'}), 404

    updated_position = json.loads(request.data)
    if not position_is_valid(updated_position):
        return jsonify({'error': 'Invalid position properties.'}), 400

    position.update(updated_position)

    return jsonify(position)

@app.route('/positions/<int:id>', methods=['DELETE'])
def delete_position(id):
    global positions
    position = get_position(id)
    if position is None:
        return jsonify({'error': 'Position does not exist.'}), 404

    positions = [p for p in positions if p['id'] != id]
    return jsonify(position), 200

