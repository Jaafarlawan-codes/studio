"use client";

import {
  generateOutline,
  generateChapter,
} from "@/ai/flows/generate-book";
import type {
  GenerateOutlineInput,
  GenerateOutlineOutput,
  Chapter,
} from "@/ai/flows/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Download, Loader2, Sparkles, Wand2 } from "lucide-react";
import React, { useState } from "react";

type ChapterOutline = GenerateOutlineOutput["chapters"][0];

export default function KdpAuthorAiClient() {
  const [formData, setFormData] = useState<GenerateOutlineInput>({ title: "", description: "", details: "" });
  const [outline, setOutline] = useState<GenerateOutlineOutput | null>(null);
  const [generatedChapters, setGeneratedChapters] = useState<Chapter[]>([]);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [writingChapterIndex, setWritingChapterIndex] = useState<number | null>(null);

  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleGenerateOutline = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.details) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out all fields to generate the outline.",
      });
      return;
    }

    setIsGeneratingOutline(true);
    setOutline(null);
    setGeneratedChapters([]);

    try {
      const result = await generateOutline(formData);
      setOutline(result);
      toast({
        title: "Outline Generated!",
        description: "Your chapter outline is ready. You can now write each chapter.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error Generating Outline",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  const handleGenerateChapter = async (targetChapter: ChapterOutline, index: number) => {
    if (!outline) return;
    setWritingChapterIndex(index);
    try {
      const result = await generateChapter({
        title: formData.title,
        description: formData.description,
        chapterOutline: outline.chapters,
        targetChapter: targetChapter,
        previousChapters: generatedChapters,
      });

      setGeneratedChapters(prev => {
        const newChapters = [...prev];
        const existingIndex = newChapters.findIndex(c => c.title === result.title);
        if (existingIndex > -1) {
          newChapters[existingIndex] = result;
        } else {
          newChapters.push(result);
        }
        // This sort might be too simple, but for now it will work if titles are somewhat ordered
        newChapters.sort((a, b) => {
          const aIndex = outline.chapters.findIndex(oc => oc.title === a.title);
          const bIndex = outline.chapters.findIndex(oc => oc.title === b.title);
          return aIndex - bIndex;
        });
        return newChapters;
      });

      toast({
        title: `Chapter "${result.title}" Written!`,
        description: "The chapter has been added to your manuscript.",
      });

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error Writing Chapter",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setWritingChapterIndex(null);
    }
  }

  const handleDownload = () => {
    if (generatedChapters.length === 0 || !formData.title) return;

    const bookContent = generatedChapters.map(chapter => {
      return `## ${chapter.title}\n\n${chapter.content}`;
    }).join('\n\n\n');

    const fullContent = `# ${formData.title}\n\n${bookContent}`;

    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = formData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${fileName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isLoading = isGeneratingOutline || writingChapterIndex !== null;
  const isFormDisabled = isLoading || outline !== null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <header className="flex items-center gap-3 p-4 border-b bg-background">
        <a href="/" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 text-primary">
            <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-headline font-semibold">KDP Author AI</h1>
        </a>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto grid gap-8">
            <Card className="w-full">
              <form onSubmit={handleGenerateOutline}>
                <CardHeader>
                  <CardTitle>Create Your Next Bestseller</CardTitle>
                  <CardDescription>Provide the details for your book, and let our AI create a chapter outline.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Book Title</Label>
                    <Input id="title" placeholder="e.g., The Last Starlight" value={formData.title} onChange={handleInputChange} disabled={isFormDisabled} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Book Description</Label>
                    <Textarea id="description" placeholder="A short, catchy summary of your book." value={formData.description} onChange={handleInputChange} disabled={isFormDisabled} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="details">Synopsis & Details</Label>
                    <Textarea id="details" placeholder="Provide a detailed plot outline, character descriptions, and any specific instructions for the AI." rows={10} value={formData.details} onChange={handleInputChange} disabled={isFormDisabled}/>
                  </div>
                </CardContent>
                <CardFooter>
                   <Button type="submit" disabled={isLoading || outline !== null} className="ml-auto">
                    {isGeneratingOutline ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2" />}
                    Generate Outline
                  </Button>
                </CardFooter>
              </form>
            </Card>

          {isGeneratingOutline && (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-card rounded-lg shadow-sm">
                <Loader2 className="w-12 h-12 mb-4 animate-spin text-primary" />
                <p className="font-semibold text-lg">Generating your outline...</p>
                <p className="text-muted-foreground">This may take a moment.</p>
            </div>
          )}

          {outline && !isGeneratingOutline && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Your Book Outline</CardTitle>
                        <CardDescription>Generate the content for each chapter below.</CardDescription>
                    </div>
                     <Button onClick={handleDownload} variant="outline" disabled={generatedChapters.length === 0}>
                        <Download className="mr-2" />
                        Download ({generatedChapters.length} / {outline.chapters.length} chapters)
                    </Button>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple" className="w-full">
                        {outline.chapters.map((chapterOutline, index) => {
                            const writtenChapter = generatedChapters.find(c => c.title === chapterOutline.title);
                            return (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger>
                                        <div className="flex items-center justify-between w-full pr-4">
                                            <div className="text-left">
                                                <p className="font-semibold">{chapterOutline.title}</p>
                                                <p className="text-sm text-muted-foreground font-normal">{chapterOutline.description}</p>
                                            </div>
                                            {writingChapterIndex !== index && !writtenChapter && (
                                                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleGenerateChapter(chapterOutline, index); }}>
                                                    <Wand2 className="mr-2" /> Write Chapter
                                                </Button>
                                            )}
                                            {writingChapterIndex === index && <Loader2 className="animate-spin" />}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      {writtenChapter ? (
                                        <div className="p-4 border rounded-md bg-gray-50 whitespace-pre-wrap font-body">
                                            <p>{writtenChapter.content}</p>
                                        </div>
                                      ) : (
                                        <p className="p-4 text-muted-foreground">Click "Write Chapter" to generate the content for this chapter.</p>
                                      )}
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })}
                    </Accordion>
                </CardContent>
              </Card>
          )}
        </div>
      </main>
    </div>
  );
}
