import pytest
from unittest.mock import MagicMock
from model.job import Job, JobSchema
from model.job import Skill
from index import app  # Import the actual Flask app

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

    # Create a mock Job object
    mock_job = MagicMock(spec=Job)
    mock_job.title = "Test Job"
    mock_job.company = "Test Company"
    mock_job.skills = [mock_skill1, mock_skill2]

    # Mock the database query to return a list containing the mock job
    mocker.patch('model.job.Job.query.all', return_value=[mock_job])

    # Mock the JobSchema serialization
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
=