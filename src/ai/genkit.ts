'use server';
import {genkit, type Genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {defineNextjsHandler} from '@genkit-ai/next';

// Import flows directly into the main genkit configuration file.
import './flows/generate-book';

export const ai: Genkit = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});

export const POST = defineNextjsHandler({genkit: ai});
