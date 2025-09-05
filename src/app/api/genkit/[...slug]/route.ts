/**
 * @fileoverview Genkit API route for Next.js.
 */
import {ai} from '@/ai/genkit';
import {createApiHandler} from '@genkit-ai/next/server';

export const {POST} = createApiHandler({ai});
