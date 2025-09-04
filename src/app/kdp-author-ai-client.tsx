"use client";

import { generateBook, GenerateBookInput, GenerateBookOutput } from "@/ai/flows/generate-book";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Download, Loader2, Sparkles } from "lucide-react";
import React, { useState } from "react";

export default function KdpAuthorAiClient() {
  const [formData, setFormData] = useState<GenerateBookInput>({ title: "", description: "", details: "" });
  const [generatedBook, setGeneratedBook] = useState<GenerateBookOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleGenerateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.details) {
       toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out all fields to generate your book.",
      });
      return;
    }

    setIsLoading(true);
    setGeneratedBook(null);

    try {
      const result = await generateBook(formData);
      setGeneratedBook(result);
      toast({
        title: "Book Generated Successfully!",
        description: "Your book is ready for review and download.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error Generating Book",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!generatedBook || !formData.title) return;

    const bookContent = generatedBook.chapters.map(chapter => {
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


  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <header className="flex items-center gap-3 p-4 border-b bg-background">
        <div className="p-2 rounded-lg bg-primary/20 text-primary">
          <BookOpen className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-headline font-semibold">KDP Author AI</h1>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto grid gap-8">
            <Card className="w-full">
              <form onSubmit={handleGenerateBook}>
                <CardHeader>
                  <CardTitle>Create Your Next Bestseller</CardTitle>
                  <CardDescription>Provide the details for your book, and let our AI bring it to life.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Book Title</Label>
                    <Input id="title" placeholder="e.g., The Last Starlight" value={formData.title} onChange={handleInputChange} disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Book Description</Label>
                    <Textarea id="description" placeholder="A short, catchy summary of your book." value={formData.description} onChange={handleInputChange} disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="details">Synopsis & Details</Label>
                    <Textarea id="details" placeholder="Provide a detailed plot outline, character descriptions, chapter breakdown, and any specific instructions for the AI." rows={10} value={formData.details} onChange={handleInputChange} disabled={isLoading}/>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading} className="ml-auto">
                    {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2" />}
                    Generate Book
                  </Button>
                </CardFooter>
              </form>
            </Card>

          {isLoading && (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-card rounded-lg shadow-sm">
                <Loader2 className="w-12 h-12 mb-4 animate-spin text-primary" />
                <p className="font-semibold text-lg">Generating your masterpiece...</p>
                <p className="text-muted-foreground">This may take a few moments. Please don't close this page.</p>
            </div>
          )}

          {generatedBook && !isLoading && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Your Generated Book</CardTitle>
                        <CardDescription>Review your book below. You can download it as a text file.</CardDescription>
                    </div>
                     <Button onClick={handleDownload} variant="outline">
                        <Download className="mr-2" />
                        Download (.txt)
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="p-4 border rounded-md bg-gray-50 max-h-[600px] overflow-y-auto whitespace-pre-wrap font-body">
                        <h2 className="text-2xl font-bold font-headline mb-4">{formData.title}</h2>
                        {generatedBook.chapters.map((chapter, index) => (
                          <div key={index} className="mb-8">
                            <h3 className="text-xl font-bold font-headline mb-2">{chapter.title}</h3>
                            <p>{chapter.content}</p>
                          </div>
                        ))}
                    </div>
                </CardContent>
              </Card>
          )}
        </div>
      </main>
    </div>
  );
}
