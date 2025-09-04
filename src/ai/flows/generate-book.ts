'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a book.
 *
 * - generateBook - A function that takes book details and generates a complete book.
 * - GenerateBookInput - The input type for the generateBook function.
 * - GenerateBookOutput - The return type for the generateBook function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBookInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  description: z.string().describe('A short description of the book.'),
  details: z.string().describe('A detailed synopsis or prompt for the book content.'),
});
export type GenerateBookInput = z.infer<typeof GenerateBookInputSchema>;

const ChapterSchema = z.object({
  title: z.string().describe('The title of the chapter.'),
  content: z.string().describe('The content of the chapter.'),
});

const GenerateBookOutputSchema = z.object({
  chapters: z.array(ChapterSchema).describe('The chapters of the generated book.'),
});
export type GenerateBookOutput = z.infer<typeof GenerateBookOutputSchema>;

export async function generateBook(input: GenerateBookInput): Promise<GenerateBookOutput> {
  return generateBookFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBookPrompt',
  input: {schema: GenerateBookInputSchema},
  output: {schema: GenerateBookOutputSchema},
  prompt: `You are an expert author tasked with writing a complete book for Amazon KDP based on the provided details. The book should be well-structured, engaging, and ready for publishing.

Book Title: {{{title}}}

Book Description: {{{description}}}

Detailed Synopsis:
{{{details}}}

Please now write the full content of the book. Ensure it has a clear beginning, middle, and end. The book must be structured into chapters, each with a title and content. The output should be a JSON object containing a list of chapters.`,
});

const generateBookFlow = ai.defineFlow(
  {
    name: 'generateBookFlow',
    inputSchema: GenerateBookInputSchema,
    outputSchema: GenerateBookOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {chapters: output!.chapters};
  }
);
