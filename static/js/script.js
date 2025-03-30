document.getElementById('upload-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById('pdf-file');
    const file = fileInput.files[0];
    const progressSection = document.getElementById('progress-section');
    const downloadSection = document.getElementById('download-section');
    const errorSection = document.getElementById('error-section');

    if (!file) {
        showError('Please select a PDF file first!');
        return;
    }

    const formData = new FormData();
    formData.append('pdf_file', file);

    // Show progress
    toggleElements([progressSection], [downloadSection, errorSection]);

    try {
        const response = await fetch('/convert', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || 'Conversion failed');

        const downloadLink = document.getElementById('download-link');
        downloadLink.href = `/download/${data.filename}`;
        toggleElements([downloadSection], [progressSection, errorSection]);

    } catch (error) {
        showError(error.message);
        console.error('Conversion error:', error);
    }
});

function toggleElements(show = [], hide = []) {
    show.forEach(el => el.classList.remove('hidden'));
    hide.forEach(el => el.classList.add('hidden'));
}

function showError(message) {
    const errorSection = document.getElementById('error-section');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    toggleElements([errorSection], ['progress-section', 'download-section']);
}

