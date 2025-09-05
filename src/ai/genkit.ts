import {configureGenkit, genkit, type Genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {nextPlugin} from '@genkit-ai/next';

require('dotenv').config({ path: '.env' });

// Import flows directly into the main genkit configuration file.
import './flows/generate-book';

configureGenkit({
  plugins: [googleAI(), nextPlugin()],
});

export const ai: Genkit = genkit;
