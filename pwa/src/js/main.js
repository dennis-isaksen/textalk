import { init_camera, fetchModel, updateUiBeforeProcess } from './ui.js';
import { processImage } from './ocr.js';
import init from '../../pkg/text_talk.js';

let selectedLanguage = {code: "da-DK"};
let detectionModel = null;
let recognitionModel = null;
let ocrResult = {result: ""};
let currentFacingMode = "environment";

async function run() {
    try {
        await init();
        await init_camera();

        detectionModel = await fetchModel('https://huggingface.co/dennis-isaksen/ocrs-finetuned-additional-lang/resolve/main/ocrs-detection-en-da-2025-05-13.rten?download=true');
        recognitionModel = await fetchModel('https://huggingface.co/dennis-isaksen/ocrs-finetuned-additional-lang/resolve/main/ocrs-recognition-en-da-2025-05-24.rten?download=true');

        document.getElementById('capture-button').addEventListener('click', async () => {
            const video = document.getElementById('video');
            const canvas = document.getElementById('canvas');
            const context = canvas.getContext('2d');

            // Set canvas dimensions to match video dimensions
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Pause the video and draw the current frame on the canvas
            video.pause();
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Get the image data as a Data URL
            const imageDataUrl = canvas.toDataURL('image/png');

            // Convert the Data URL to a Blob and process it
            const response = await fetch(imageDataUrl);
            const blob = await response.blob();

            // Hide the video and show the canvas
            video.style.display = 'none';

            // Update UI before processing
            updateUiBeforeProcess();
            await new Promise(resolve => requestAnimationFrame(resolve));

            // Process the image
            await processImage(blob, detectionModel, recognitionModel, ocrResult, selectedLanguage);
        });

        document.getElementById('resume-button').addEventListener('click', async () => {
            try {
                const video = document.getElementById('video');
                const canvas = document.getElementById('canvas');
                video.play();
                video.style.display = 'block';
                canvas.style.display = 'none';
                document.getElementById('capture-button').style.display = 'block';
                document.getElementById('resume-button').style.display = 'none';

                // Disable the "Speak All Text" button
                const speakAllButton = document.getElementById('speak-all-button');
                speakAllButton.disabled = true;
                speakAllButton.style.filter = 'grayscale(100%)';
                speakAllButton.style.cursor = 'not-allowed';
                
                // Enable the "Capture" button
                const captureButton = document.getElementById('capture-button');
                captureButton.disabled = false;
                captureButton.style.filter = 'none';
                captureButton.style.cursor = 'pointer';

                // Remove the click event listener from the canvas
                if (canvasClickListener) {
                    canvas.removeEventListener('click', canvasClickListener);
                }
            } catch (err) {
                console.error('Error resuming video:', err);
            }
        });

        document.getElementById('switch-camera-button').addEventListener('click', async () => {
            try {
                currentFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
                await init_camera(currentFacingMode);
            } catch (err) {
                console.error('Error switching camera:', err);
            }
        });

        document.getElementById('language-selector').addEventListener('change', (event) => {
            selectedLanguage.code = event.target.value;
        });

        document.getElementById('speak-all-button').addEventListener('click', () => {
            if (!ocrResult.result || ocrResult.result.length === 0) {
                console.log('No text available to read.');
                return;
            }

            // Read each line of the OCR result
            ocrResult.result.forEach(line => {
                const utterance = new SpeechSynthesisUtterance(line.text);
                utterance.lang = selectedLanguage.code; // Use the global selectedLanguage variable
                window.speechSynthesis.speak(utterance);
            });

        });

        // Handle window resize and orientation change
        const resizeCanvas = () => {
            const canvas = document.getElementById('canvas');
            const video = document.getElementById('video');
            const aspectRatio = video.videoWidth / video.videoHeight;

            if (window.innerWidth / window.innerHeight > aspectRatio) {
                video.style.width = '100%';
                video.style.height = 'auto';
            } else {
                video.style.width = 'auto';
                video.style.height = '100%';
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        };

        window.addEventListener('load', resizeCanvas);
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('orientationchange', resizeCanvas);

        // Initial resize
        resizeCanvas();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

run();

// Register the service worker
navigator.serviceWorker.register('./service-worker.js', { scope: './' })
    .then((registration) => {
        console.log('Service worker registered:', registration);
    })
    .catch((error) => {
        console.error('Service worker registration failed:', error);
    });

// Add to home screen prompt
let deferredPrompt;
const installButton = document.getElementById('install-button');

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    deferredPrompt = e;
    installButton.style.display = 'inline-block';
});

installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            installButton.style.display = 'none';
        }
        deferredPrompt = null;
    }
});