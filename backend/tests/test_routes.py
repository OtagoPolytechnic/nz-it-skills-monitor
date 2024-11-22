import pytest
from unittest.mock import MagicMock
from model.job import Job, JobSchema
from model.job import Skill
from index import app  # Import the actual Flask app
global_token = ""
@pytest.fixture
def client(mocker):
    """Create a test client for Flask."""
    with app.app_context():  # Ensure the app context is available
        with app.test_client() as client:
            yield client

@pytest.fixture
def mock_jobs(mocker):
    # Create mock Skill objects
    mock_skill1 = MagicMock(spec=Skill)
    mock_skill1.name = "Python"
    mock_skill1.type = "Programming"

    mock_skill2 = MagicMock(spec=Skill)
    mock_skill2.name = "Django"
    mock_skill2.type = "Framework"

    mock_job = MagicMock(spec=Job)
    mock_job.title = "Test Job"
    mock_job.company = "Test Company"
    mock_job.skills = [mock_skill1, mock_skill2]

    mocker.patch('model.job.Job.query.all', return_value=[mock_job])

    mocker.patch('model.job.JobSchema.dump', return_value={
        'title': mock_job.title,
        'company': mock_job.company,
        'skills': [
            {'name': skill.name, 'type': skill.type} for skill in mock_job.skills
        ]
    })

    return mock_job


def test_get_jobs(client, mock_jobs):
    """Test the /jobs route with mocked data."""
    
    # Send a GET request to the /jobs endpoint
    response = client.get('/jobs')
    jobs = response.get_json()
    # Assert that the response status code is 200
    assert response.status_code == 200

    # Assert that the mocked job data is in the response
    assert 'Test Job' in response.data.decode('utf-8')
    assert 'Test Company' in response.data.decode('utf-8')

def test_login_success(client):
    # Test with valid credentials
    response = client.post('/login', json={'username': 'testuser', 'password': 'password123'})
    assert response.status_code == 200
    data = response.get_json()
    global_token="token"
    assert 'token' in data

def test_login_invalid_password(client):

    response = client.post('/login', json={'username': 'wrongusername', 'password': 'wrongpassword'})
    assert response.status_code == 401
    assert response.get_json() == {'error': "Invalid username or password"}

def test_login_invalid_usename(client):

    response = client.post('/login', json={'username': 'testuser', 'password': 'password123'})
    assert response.status_code == 401
    assert response.get_json() == {'error': "Invalid username or password"}


def test_login_invalid_username_and_password(client):

    response = client.post('/login', json={'username': 'wrongusername', 'password': 'wrongpassword'})
    assert response.status_code == 401
    assert response.get_json() == {'error': "Invalid username or password"}

def test_admin_with_valid_token(client):
    
    token = global_token
    
    headers = {'Authorization': 'Bearer {token}'}
    response = client.get('/admin', headers=headers)
    assert response.status_code == 200
    assert response.get_json()['message'] == 'Welcome to the admin panel!'

def test_admin_with_invalid_token(client):

    headers = {'Authorization': 'Bearer invalid-token'}
    response = client.get('/admin', headers=headers)
    assert response.status_code == 403
    assert response.get_json() == {"error": "Invalid or expired token"}

def test_admin_with_wrong_format__token(client):
    
    headers = {'Authorization': 'Bearer Wrong_format-token'}
    response = client.get('/admin', headers=headers)
    assert response.status_code == 400
    assert response.get_json() == {"error": "Invalid or expired token"}

def test_admin_without_token(client):

    response = client.get('/admin')
    assert response.status_code == 403
    assert response.get_json() == {"error": "Token is missing!"}

def test_admin_with_expired_token(client):

    headers = {'Authorization': 'Bearer expired-token'}
    response = client.get('/admin', headers=headers)
    assert response.status_code == 403
    assert response.get_json() == {"error": "Invalid or expired token"}
