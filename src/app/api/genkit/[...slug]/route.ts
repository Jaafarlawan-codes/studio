/**
 * @fileoverview Genkit API route for Next.js.
 */

import {createApiHandler} from '@genkit-ai/next';
import {ai} from '@/ai/genkit';

export const {GET, POST, OPTIONS} = createApiHandler(ai);
