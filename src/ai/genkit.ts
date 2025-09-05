import {genkit, type Genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {nextPlugin} from '@genkit-ai/next';

// Import flows directly into the main genkit configuration file.
import './flows/generate-book';

export const ai: Genkit = genkit({
  plugins: [googleAI(), nextPlugin()],
});
