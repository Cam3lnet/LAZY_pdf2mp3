// Function to update progress bar
function updateProgressBar(percentage) {
    const progressFill = document.querySelector('.progress-fill');
    const progressPercentage = document.querySelector('.progress-percentage');
    
    if (!progressFill || !progressPercentage) return;
    
    // Update the width of the progress bar fill
    progressFill.style.width = percentage + '%';
    
    // Update the text showing the percentage
    progressPercentage.textContent = percentage + '%';
    
    // Add classes for color changes at different thresholds
    if (percentage >= 80) {
        progressFill.className = 'progress-fill progress-fill-80';
    } else if (percentage >= 50) {
        progressFill.className = 'progress-fill progress-fill-50';
    } else {
        progressFill.className = 'progress-fill';
    }
}

// Function to simulate conversion progress (replace with actual progress tracking)
function simulateConversion() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        updateProgressBar(progress);
        
        if (progress >= 100) {
            clearInterval(interval);
            // Show download section or whatever comes next
            document.getElementById('progress-section').classList.add('hidden');
            document.getElementById('download-section').classList.remove('hidden');
        }
    }, 300); // Update every 300ms
}

// Call this function when starting the conversion process
document.getElementById('convert-btn').addEventListener('click', function() {
    // Show progress section
    document.getElementById('progress-section').classList.remove('hidden');
    
    // Start the progress animation
    simulateConversion();
    
    // Optionally, you can also start the actual conversion process here
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

});