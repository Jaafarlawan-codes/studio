'use server';
/**
 * @fileOverview This file defines a Genkit flow for AI-powered writing assistance.
 *
 * - aiPoweredWritingAssistance - A function that takes a piece of text and enhances it using AI.
 * - AiPoweredWritingAssistanceInput - The input type for the aiPoweredWritingAssistance function.
 * - AiPoweredWritingAssistanceOutput - The return type for the aiPoweredWritingAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPoweredWritingAssistanceInputSchema = z.object({
  text: z.string().describe('The text to be enhanced by the AI.'),
});
export type AiPoweredWritingAssistanceInput = z.infer<typeof AiPoweredWritingAssistanceInputSchema>;

const AiPoweredWritingAssistanceOutputSchema = z.object({
  enhancedText: z.string().describe('The AI-enhanced version of the input text.'),
});
export type AiPoweredWritingAssistanceOutput = z.infer<typeof AiPoweredWritingAssistanceOutputSchema>;

export async function aiPoweredWritingAssistance(input: AiPoweredWritingAssistanceInput): Promise<AiPoweredWritingAssistanceOutput> {
  return aiPoweredWritingAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredWritingAssistancePrompt',
  input: {schema: AiPoweredWritingAssistanceInputSchema},
  output: {schema: AiPoweredWritingAssistanceOutputSchema},
  prompt: `You are an AI writing assistant chatbot for authors. A user is asking for help with their book. Your task is to provide a helpful and creative response.

User's message: {{{text}}}

Your response:`,
});

const aiPoweredWritingAssistanceFlow = ai.defineFlow(
  {
    name: 'aiPoweredWritingAssistanceFlow',
    inputSchema: AiPoweredWritingAssistanceInputSchema,
    outputSchema: AiPoweredWritingAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {enhancedText: output!.enhancedText};
  }
);
