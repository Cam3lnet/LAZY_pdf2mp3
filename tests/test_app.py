import os
import pytest
from app import app

@pytest.fixture()
def client():
    app.config['TESTING'] = True
    app.config['UPLOAD_FOLDER'] = 'test_uploads'
    app.config['OUTPUT_FOLDER'] = 'test_outputs'
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['OUTPUT_FOLDER'], exist_ok=True)
    yield app.test_client()
    # Cleanup after tests
    for folder in [app.config['UPLOAD_FOLDER'], app.config['OUTPUT_FOLDER']]:
        for file in os.listdir(folder):
            os.remove(os.path.join(folder, file))
        os.rmdir(folder)

def test_pdf_upload_and_conversion(client):
    """Test uploading a valid PDF and converting it to MP3."""
    pdf_path = 'sample.pdf'  # Replace with a valid sample PDF path
    with open(pdf_path, 'rb') as pdf_file:
        response = client.post('/convert', data={'pdf_file': pdf_file})
        assert response.status_code == 200
        json_data = response.get_json()
        assert json_data['success'] is True
        assert 'filename' in json_data

def test_invalid_file_upload(client):
    """Test uploading an invalid file format."""
    with open('invalid.txt', 'rb') as invalid_file:
        response = client.post('/convert', data={'pdf_file': invalid_file})
        assert response.status_code == 400
        json_data = response.get_json()
        assert json_data['error'] == 'Invalid file format'

def test_no_file_uploaded(client):
    """Test submitting the form without uploading any file."""
    response = client.post('/convert', data={})
    assert response.status_code == 400
    json_data = response.get_json()
    assert json_data['error'] == 'No file part'
