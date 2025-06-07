export function updateUiBeforeProcess() {
    const spinner = document.getElementById('spinner');
    const captureButton = document.getElementById('capture-button');
    const speakAllButton = document.getElementById('speak-all-button');

    // Show spinner
    spinner.style.display = 'block';
    
    // Disable the "Capture" button
    captureButton.disabled = true;
    captureButton.style.filter = 'grayscale(100%)';
    captureButton.style.cursor = 'not-allowed';

    // Disable the "Speak All Text" button
    speakAllButton.disabled = true;
    speakAllButton.style.filter = 'grayscale(100%)';
    speakAllButton.style.cursor = 'not-allowed';
}

export function updateUiAfterProcess() {
    const spinner = document.getElementById('spinner');
    const resumeButton = document.getElementById('resume-button');
    const captureButton = document.getElementById('capture-button');
    const speakAllButton = document.getElementById('speak-all-button');
    
    // Hide spinner
    spinner.style.display = 'none';

    // Show resume button
    resumeButton.style.display = 'block';

    // Hide "Capture" button
    captureButton.disabled = true;
    captureButton.style.filter = 'grayscale(100%)';
    captureButton.style.cursor = 'not-allowed';
    captureButton.style.display = 'none';

    // Enable the "Speak All Text" button
    speakAllButton.disabled = false;
    speakAllButton.style.filter = 'none';
    speakAllButton.style.cursor = 'pointer';
}

export async function init_camera(facingMode = 'environment') {
    const constraints = {
        video: { facingMode: facingMode }
    };

    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const video = document.getElementById('video');
        video.srcObject = stream;
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Error accessing camera: ' + err.message);
    }
}

export async function fetchModel(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch model: ${response.statusText}`);
        }
        return new Uint8Array(await response.arrayBuffer());
    } catch (error) {
        console.error('Error fetching model:', error);
        throw error;
    }
}