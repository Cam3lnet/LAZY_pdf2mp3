document.getElementById('upload-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById('pdf-file');
    const file = fileInput.files[0];
    const progressSection = document.getElementById('progress-section');
    const downloadSection = document.getElementById('download-section');
    
    if (!file) {
        alert('Please select a PDF file first!');
        return;
    }

    const formData = new FormData();
    formData.append('pdf_file', file);

    // Show progress
    document.getElementById('upload-section').classList.add('hidden');
    progressSection.classList.remove('hidden');

    fetch('/convert', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const downloadLink = document.getElementById('download-link');
            downloadLink.href = `/download/${data.filename}`;
            progressSection.classList.add('hidden');
            downloadSection.classList.remove('hidden');
        } else {
            alert('Error: ' + data.error);
            progressSection.classList.add('hidden');
            document.getElementById('upload-section').classList.remove('hidden');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during conversion');
        progressSection.classList.add('hidden');
        document.getElementById('upload-section').classList.remove('hidden');
    });
});
