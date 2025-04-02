from flask import Flask, render_template, request, send_file, jsonify
from PyPDF2 import PdfReader
from gtts import gTTS
import os
import uuid

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['OUTPUT_FOLDER'] = 'outputs'

# Create directories if they don't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['OUTPUT_FOLDER'], exist_ok=True)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/convert', methods=['POST'])
def convert():
    if 'pdf_file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
        
    file = request.files['pdf_file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Only PDF files are allowed'}), 400

    try:
        # Create necessary directories
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        os.makedirs(app.config['OUTPUT_FOLDER'], exist_ok=True)

        # Generate unique filenames
        unique_id = str(uuid.uuid4())
        pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{unique_id}.pdf")
        mp3_path = os.path.join(app.config['OUTPUT_FOLDER'], f"{unique_id}.mp3")

        # Save uploaded file
        file.save(pdf_path)

        # Extract text from PDF
        text = extract_text_from_pdf(pdf_path)
        if not text.strip():
            raise ValueError("No text found in PDF document")

        # Convert text to speech
        tts = gTTS(text=text, lang='en')
        tts.save(mp3_path)

        return jsonify({
            'success': True,
            'filename': f"{unique_id}.mp3"
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up uploaded PDF
        if os.path.exists(pdf_path):
            os.remove(pdf_path)

def allowed_file(filename):
    return '.' in filename and filename.lower().endswith('.pdf')

def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, 'rb') as pdf_file:
        pdf_reader = PdfReader(pdf_file)
        for page in pdf_reader.pages:
            text += page.extract_text() or ""  # Handle empty pages
    return text


@app.route('/download/<filename>')
def download(filename):
    return send_file(
        os.path.join(app.config['OUTPUT_FOLDER'], filename),
        as_attachment=True,
        download_name="converted_audio.mp3"
    )
    finally:
        # Clean up uploaded mp3
        if os.path.exists(mp3_path):
            os.remove(mp3_path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
