# LAZY_pdf2mp3
A simple phyton pdf to mp3 converter app for Windows

#FILE STRUCTURE
pdf_to_mp3_app/
├── app.py
├── templates/
│   └── index.html
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
└── uploads/
└── outputs/

#For packaging the app
(internal notes for developing)
Package the Application
Create the executable with PyInstaller:

bash
pyinstaller --onefile --add-data "templates;templates" --add-data "static;static" --name PDF_to_MP3_Converter run_app.py
This command:

Creates a single executable file

Includes the templates and static directories

Names the output "PDF_to_MP3_Converter.exe"