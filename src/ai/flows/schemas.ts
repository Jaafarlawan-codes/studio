/**
 * @fileOverview This file defines the Zod schemas and TypeScript types for the book generation flows.
 * By separating these from the flow definitions, we can avoid "use server" conflicts in Next.js.
 */
import {z} from 'genkit';

// Schemas for Chapter Outline Generation
export const GenerateOutlineInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  description: z.string().describe('A short description of the book.'),
  details: z.string().describe('A detailed synopsis or prompt for the book content.'),
});
export type GenerateOutlineInput = z.infer<typeof GenerateOutlineInputSchema>;

export const ChapterOutlineSchema = z.object({
  title: z.string().describe('The title of the chapter.'),
  description: z.string().describe('A brief summary of what happens in this chapter.'),
});

export const GenerateOutlineOutputSchema = z.object({
  chapters: z.array(ChapterOutlineSchema).describe('The chapter outline for the book.'),
});
export type GenerateOutlineOutput = z.infer<typeof GenerateOutlineOutputSchema>;

// Schemas for Single Chapter Generation
export const ChapterSchema = z.object({
  title: z.string().describe('The title of the chapter.'),
  content: z.string().describe('The full content of the chapter.'),
});
export type Chapter = z.infer<typeof ChapterSchema>;

export const GenerateChapterInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  description: z.string().describe('A short description of the book.'),
  chapterOutline: z.array(ChapterOutlineSchema).describe('The full outline of the book.'),
  targetChapter: ChapterOutlineSchema.describe('The specific chapter from the outline to be written.'),
  previousChapters: z.array(ChapterSchema).describe('The content of the chapters that have already been written.'),
});
export type GenerateChapterInput = z.infer<typeof GenerateChapterInputSchema>;

export type GenerateChapterOutput = z.infer<typeof ChapterSchema>;
