'use server';

/**
 * @fileOverview A chapter outline generation AI agent.
 *
 * - generateChapterOutline - A function that handles the chapter outline generation process.
 * - GenerateChapterOutlineInput - The input type for the generateChapterOutline function.
 * - GenerateChapterOutlineOutput - The return type for the generateChapterOutline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChapterOutlineInputSchema = z.object({
  synopsis: z.string().describe('The synopsis of the book.'),
});
export type GenerateChapterOutlineInput = z.infer<typeof GenerateChapterOutlineInputSchema>;

const GenerateChapterOutlineOutputSchema = z.object({
  outline: z.string().describe('The generated chapter outline.'),
});
export type GenerateChapterOutlineOutput = z.infer<typeof GenerateChapterOutlineOutputSchema>;

export async function generateChapterOutline(input: GenerateChapterOutlineInput): Promise<GenerateChapterOutlineOutput> {
  return generateChapterOutlineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChapterOutlinePrompt',
  input: {schema: GenerateChapterOutlineInputSchema},
  output: {schema: GenerateChapterOutlineOutputSchema},
  prompt: `You are an experienced author and editor. Please generate a detailed chapter outline for the book based on the following synopsis:\n\nSynopsis: {{{synopsis}}}\n\nOutline:`, 
});

const generateChapterOutlineFlow = ai.defineFlow(
  {
    name: 'generateChapterOutlineFlow',
    inputSchema: GenerateChapterOutlineInputSchema,
    outputSchema: GenerateChapterOutlineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
