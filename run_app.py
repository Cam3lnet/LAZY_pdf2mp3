import os
import webbrowser
from waitress import serve
from app import app

if __name__ == "__main__":
    # Open browser to the application
    webbrowser.open("http://localhost:8080")
    
    # Run the app with waitress (production WSGI server)
    print("PDF to MP3 Converter running at http://localhost:8080")
    print("Press Ctrl+C to exit")
    serve(app, host="0.0.0.0", port=8080)
