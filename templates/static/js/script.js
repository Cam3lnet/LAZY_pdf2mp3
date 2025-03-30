document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('upload-form');
    const progressSection = document.getElementById('progress-section');
    const downloadSection = document.getElementById('download-section');
    const errorSection = document.getElementById('error-section');
    const downloadLink = document.getElementById('download-link');
    const errorMessage = document.getElementById('error-message');
    const progressFill = document.querySelector('.progress-fill');
    
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fileInput = document.getElementById('pdf-file');
        const file = fileInput.files[0];
        
        if (!file) {
            showError('Please select a PDF file.');
            return;
        }
        
        if (!file.name.toLowerCase().endsWith('.pdf')) {
            showError('Please upload a PDF file.');
            return;
        }
        
        const formData = new FormData();
        formData.append('pdf_file', file);
        
        // Show progress
        uploadForm.classList.add('hidden');
        progressSection.classList.remove('hidden');
        downloadSection.classList.add('hidden');
        errorSection.classList.add('hidden');
        
        // Simulate progress (actual progress not available due to server-side processing)
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 5;
            if (progress > 90) {
                clearInterval(progressInterval);
            }
            progressFill.style.width = `${progress}%`;
        }, 500);
        
        // Send conversion request
        fetch('/convert', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            clearInterval(progressInterval);
            progressFill.style.width = '100%';
            
            if (data.success) {
                downloadLink.href = `/download/${data.filename}`;
                progressSection.classList.add('hidden');
                downloadSection.classList.remove('hidden');
            } else {
                showError(data.error || 'An error occurred during conversion.');
            }
        })
        .catch(error => {
            clearInterval(progressInterval);
            showError('Network error or server unreachable.');
            console.error(error);
        });
    });
    
    function showError(message) {
        progressSection.classList.add('hidden');
        downloadSection.classList.add('hidden');
        errorSection.classList.remove('hidden');
        uploadForm.classList.remove('hidden');
        errorMessage.textContent = message;
    }
    
    // Reset form when clicking back on error
    errorSection.addEventListener('click', function() {
        errorSection.classList.add('hidden');
    });
});
