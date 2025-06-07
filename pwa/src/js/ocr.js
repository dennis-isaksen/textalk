import { updateUiAfterProcess } from './ui.js';
import { capture_and_ocr } from '../../pkg/text_talk.js';

export async function processImage(file, detectionModel, recognitionModel, ocrResult, selectedLanguage) {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    // Ensure the canvas is visible
    canvas.style.display = 'block';

    try {
        // Load the image into an HTMLImageElement
        const img = new Image();
        img.onload = async () => {
            // Set canvas dimensions to match the image
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the image on the canvas
            context.drawImage(img, 0, 0, img.width, img.height);

            // Perform OCR
            const result = await capture_and_ocr(detectionModel, recognitionModel);
            ocrResult.result = JSON.parse(result); // Assign the result to the global variable

            // Display OCR result
            const ocrResultElement = document.getElementById('ocr-result');
            ocrResultElement.innerText = ocrResult.result.map(line => line.text).join('\n');
            
            // Draw rectangles and text on the canvas
            context.strokeStyle = 'rgba(0, 255, 0, 1)'; // Green border
            context.lineWidth = 2;
            context.font = '16px Arial';
            context.fillStyle = 'rgba(0, 255, 0, 0.2)'; // Transparent green fill

            ocrResult.result.forEach(line => {
                line.words.forEach(word => {
                    const rect = word.vertices;
                    if (rect.length === 4) {
                        const [p1, p2, p3, p4] = rect;

                        // Draw the filled rectangle
                        context.beginPath();
                        context.moveTo(p1.x, p1.y);
                        context.lineTo(p2.x, p2.y);
                        context.lineTo(p3.x, p3.y);
                        context.lineTo(p4.x, p4.y);
                        context.closePath();
                        context.fill(); // Fill the rectangle with the transparent color
                        context.stroke(); // Draw the border
                    }
                });
            });

            // Define the click event listener function
            const canvasClickListener = (event) => {
                const rect = canvas.getBoundingClientRect();

                // Calculate the scaling factor between the canvas's internal size and its displayed size
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;

                // Adjust the click coordinates to match the canvas's internal coordinate system
                const x = (event.clientX - rect.left) * scaleX;
                const y = (event.clientY - rect.top) * scaleY;

                // Check if the click is within any of the rectangles
                ocrResult.result.forEach(line => {
                    line.words.forEach(word => {
                        const rect = word.vertices;
                        if (rect.length === 4) {
                            const [p1, p2, p3, p4] = rect;
                            if (
                                x >= Math.min(p1.x, p2.x, p3.x, p4.x) &&
                                x <= Math.max(p1.x, p2.x, p3.x, p4.x) &&
                                y >= Math.min(p1.y, p2.y, p3.y, p4.y) &&
                                y <= Math.max(p1.y, p2.y, p3.y, p4.y)
                            ) {
                                // Read out the text using the Web Speech API
                                const utterance = new SpeechSynthesisUtterance(word.text);
                                utterance.lang = selectedLanguage.code;
                                window.speechSynthesis.speak(utterance);
                            }
                        }
                    });
                });
            };

            // Add the click event listener to the canvas
            canvas.addEventListener('click', canvasClickListener);

            // Update UI after processing
            updateUiAfterProcess();
        };

        // Read the file as a data URL and set it as the image source
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } catch (err) {
        console.error('Error processing image:', err);
        document.getElementById('ocr-result').innerText = 'Error processing image';
    }
}
