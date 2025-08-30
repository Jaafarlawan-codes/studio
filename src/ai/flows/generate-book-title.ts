'use server';

/**
 * @fileOverview Book title generation flow.
 *
 * - generateBookTitle - A function that generates a book title based on a description.
 * - GenerateBookTitleInput - The input type for the generateBookTitle function.
 * - GenerateBookTitleOutput - The return type for the generateBookTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBookTitleInputSchema = z.object({
  description: z.string().describe('A short description of the book.'),
});

export type GenerateBookTitleInput = z.infer<typeof GenerateBookTitleInputSchema>;

const GenerateBookTitleOutputSchema = z.object({
  title: z.string().describe('The generated book title.'),
});

export type GenerateBookTitleOutput = z.infer<typeof GenerateBookTitleOutputSchema>;

export async function generateBookTitle(input: GenerateBookTitleInput): Promise<GenerateBookTitleOutput> {
  return generateBookTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBookTitlePrompt',
  input: {schema: GenerateBookTitleInputSchema},
  output: {schema: GenerateBookTitleOutputSchema},
  prompt: `You are a book title generator. Generate a creative and compelling book title based on the following description: {{{description}}}`,
});

const generateBookTitleFlow = ai.defineFlow(
  {
    name: 'generateBookTitleFlow',
    inputSchema: GenerateBookTitleInputSchema,
    outputSchema: GenerateBookTitleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
