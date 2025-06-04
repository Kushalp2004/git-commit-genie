import * as dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function getCommitMessageFromGemini(diff: string): Promise<string> {
	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) {
		console.error('Gemini API key missing.');
		return 'chore: update code';
	}

	const genAI = new GoogleGenerativeAI(apiKey);
	const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

	const prompt = `
Generate a concise, one-line Git commit message for the following code diff:
---
${diff}
---
Use a helpful prefix (feat:, fix:, refactor:, docs:). Only return the commit message.
`;

	try {
		const result = await model.generateContent(prompt);
		const response = result.response;
		return response.text().trim() || 'chore: update code';
	} catch (err: any) {
		console.error('Gemini Error:', err.message || err);
		return 'chore: update code';
	}
}
