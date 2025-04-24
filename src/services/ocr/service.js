import fetch from 'node-fetch';
import sharp from 'sharp';
import { createWorker } from 'tesseract.js';

const runOCR = async (imageUrl) => {
    const worker = await createWorker('eng');

    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const originalBuffer = Buffer.from(arrayBuffer);

    // ✅ Convert to a clean PNG buffer
    const cleanPngBuffer = await sharp(originalBuffer).png().toBuffer();

    // Run OCR on the cleaned buffer
    const { data } = await worker.recognize(cleanPngBuffer);
    await worker.terminate();

    return data.text;
};

export default runOCR;
