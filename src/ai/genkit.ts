import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Import flows directly into the main genkit configuration file.
import './flows/generate-book';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
  api: {
    path: '/api/genkit',
  },
  ui: {
    path: '/genkit-ui',
  },
});
