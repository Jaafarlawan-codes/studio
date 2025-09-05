/**
 * @fileoverview Genkit API route for Next.js.
 */

import {createApiHandler} from '@/ai/genkit';

export const {GET, POST, OPTIONS} = createApiHandler();
