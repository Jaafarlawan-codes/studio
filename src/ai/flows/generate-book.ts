'use server';
/**
 * @fileOverview This file defines Genkit flows for generating a book outline and individual chapters.
 *
 * - generateOutline - Generates a chapter-by-chapter outline for a book.
 * - GenerateOutlineInput - The input type for the generateOutline function.
 * - GenerateOutlineOutput - The return type for the generateOutline function.
 *
 * - generateChapter - Generates the content for a single chapter.
 * - GenerateChapterInput - The input type for the generateChapter function.
 * - GenerateChapterOutput - The return type for the generateChapter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Schemas for Chapter Outline Generation
const GenerateOutlineInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  description: z.string().describe('A short description of the book.'),
  details: z.string().describe('A detailed synopsis or prompt for the book content.'),
});
export type GenerateOutlineInput = z.infer<typeof GenerateOutlineInputSchema>;

const ChapterOutlineSchema = z.object({
  title: z.string().describe('The title of the chapter.'),
  description: z.string().describe('A brief summary of what happens in this chapter.'),
});

const GenerateOutlineOutputSchema = z.object({
  chapters: z.array(ChapterOutlineSchema).describe('The chapter outline for the book.'),
});
export type GenerateOutlineOutput = z.infer<typeof GenerateOutlineOutputSchema>;

// Schemas for Single Chapter Generation
const ChapterSchema = z.object({
  title: z.string().describe('The title of the chapter.'),
  content: z.string().describe('The full content of the chapter.'),
});
export type Chapter = z.infer<typeof ChapterSchema>;

const GenerateChapterInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  description: z.string().describe('A short description of the book.'),
  chapterOutline: z.array(ChapterOutlineSchema).describe('The full outline of the book.'),
  targetChapter: ChapterOutlineSchema.describe('The specific chapter from the outline to be written.'),
  previousChapters: z.array(ChapterSchema).describe('The content of the chapters that have already been written.'),
});
export type GenerateChapterInput = z.infer<typeof GenerateChapterInputSchema>;

export type GenerateChapterOutput = z.infer<typeof ChapterSchema>;

// Exported Flow Functions
export async function generateOutline(input: GenerateOutlineInput): Promise<GenerateOutlineOutput> {
  return generateOutlineFlow(input);
}

export async function generateChapter(input: GenerateChapterInput): Promise<GenerateChapterOutput> {
  return generateChapterFlow(input);
}


// Genkit Outline Flow
const outlinePrompt = ai.definePrompt({
  name: 'generateOutlinePrompt',
  input: {schema: GenerateOutlineInputSchema},
  output: {schema: GenerateOutlineOutputSchema},
  prompt: `You are an expert author who creates compelling chapter outlines for Amazon KDP books. Based on the provided details, generate a chapter-by-chapter outline. For each chapter, provide a title and a brief description of its contents.

Book Title: {{{title}}}
Book Description: {{{description}}}
Detailed Synopsis: {{{details}}}

Create the chapter outline now.`,
});

const generateOutlineFlow = ai.defineFlow(
  {
    name: 'generateOutlineFlow',
    inputSchema: GenerateOutlineInputSchema,
    outputSchema: GenerateOutlineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


// Genkit Chapter Generation Flow
const chapterPrompt = ai.definePrompt({
  name: 'generateChapterPrompt',
  input: {schema: GenerateChapterInputSchema},
  output: {schema: ChapterSchema},
  prompt: `You are an expert author writing a book for Amazon KDP. Your task is to write the full content for a single chapter based on the provided book details and outline.

Book Title: {{{title}}}
Book Description: {{{description}}}

Full Chapter Outline:
{{#each chapterOutline}}
- {{title}}: {{description}}
{{/each}}

You have already written the following chapters:
{{#if previousChapters}}
  {{#each previousChapters}}
  Chapter: {{title}}
  ---
  {{content}}
  ---
  {{/each}}
{{else}}
This is the first chapter.
{{/if}}

Now, please write the complete content for the following chapter:
Chapter to write: "{{targetChapter.title}}"
Chapter Description: "{{targetChapter.description}}"

Write the full chapter content. Ensure it flows logically from the previous chapters (if any) and aligns with the overall book outline. Output only the content for this single chapter.`,
});

const generateChapterFlow = ai.defineFlow(
  {
    name: 'generateChapterFlow',
    inputSchema: GenerateChapterInputSchema,
    outputSchema: ChapterSchema,
  },
  async input => {
    const {output} = await chapterPrompt(input);
    return output!;
  }
);
