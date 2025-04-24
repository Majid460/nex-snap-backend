// src/snap/services/ai.service.js
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
console.log('🔐 OpenAI Key Loaded?', !!process.env.OPENAI_API_KEY);

const classifySnap = async (rawText) => {
    try {
        const prompt = `
You are a smart assistant. 
Based on the following messy OCR-extracted text from an image, do three things:
1. Classify it as one of these: task, event, expense, or note.
2. Summarize it in 1–2 clean lines.
3. Return a JSON like:
{
  "type": "task",
  "summary": "Call Ali at 5pm",
  "raw": "<original OCR text>"
}

Text:
"""
${rawText}
"""
Only return the JSON.
`;

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 200,
            temperature: 0.4,
        });

        const content = response.choices[0].message.content.trim();

        // Safe fallback parsing
        const parsed = JSON.parse(content);
        return {
            type: ['task', 'event', 'expense', 'note'].includes(parsed.type) ? parsed.type : 'note',
            summary: parsed.summary || '',
            raw: rawText,
        };
    } catch (err) {
        console.error('❌ AI Classification Error:', err.message);
        return {
            type: 'note',
            summary: 'Unclassified note',
            raw: rawText,
        };
    }
};

export default classifySnap;
