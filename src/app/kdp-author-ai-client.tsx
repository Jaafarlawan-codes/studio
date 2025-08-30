"use client";

import { aiPoweredWritingAssistance } from "@/ai/flows/ai-powered-writing-assistance";
import { generateBookTitle } from "@/ai/flows/generate-book-title";
import { generateChapterOutline } from "@/ai/flows/generate-chapter-outline";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Bold, Download, Italic, Loader2, Sparkles } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";

export default function KdpAuthorAiClient() {
  const [title, setTitle] = useState("Untitled Book");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [outline, setOutline] = useState("");

  const [isLoadingTitle, setIsLoadingTitle] = useState(false);
  const [isLoadingOutline, setIsLoadingOutline] = useState(false);
  const [isLoadingEnhance, setIsLoadingEnhance] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const handleGenerateTitle = useCallback(async () => {
    if (!summary) {
      toast({
        variant: "destructive",
        title: "Summary is empty",
        description: "Please provide a summary to generate a title.",
      });
      return;
    }
    setIsLoadingTitle(true);
    try {
      const result = await generateBookTitle({ description: summary });
      setTitle(result.title);
      toast({
        title: "Title generated!",
        description: "A new title has been set.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error generating title",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoadingTitle(false);
    }
  }, [summary, toast]);

  const handleGenerateOutline = useCallback(async () => {
    if (!synopsis) {
      toast({
        variant: "destructive",
        title: "Synopsis is empty",
        description: "Please provide a synopsis to generate an outline.",
      });
      return;
    }
    setIsLoadingOutline(true);
    try {
      const result = await generateChapterOutline({ synopsis });
      setOutline(result.outline);
      toast({
        title: "Outline generated!",
        description: "Check the 'Chapter Outline' section.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error generating outline",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoadingOutline(false);
    }
  }, [synopsis, toast]);

  const applyFormatting = useCallback((formatType: "bold" | "italic") => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    if (!selectedText) {
      toast({
        variant: "destructive",
        title: "No text selected",
        description: "Please select the text you want to format.",
      });
      return;
    }

    const markers = formatType === "bold" ? "**" : "*";
    const formattedText = `${markers}${selectedText}${markers}`;
    const newContent =
      content.substring(0, start) + formattedText + content.substring(end);

    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + markers.length, end + markers.length);
    }, 0);
  }, [content, toast]);

  const handleEnhanceText = useCallback(async () => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    if (!selectedText) {
      toast({
        variant: "destructive",
        title: "No text selected",
        description: "Please select the text you want to enhance.",
      });
      return;
    }

    setIsLoadingEnhance(true);
    try {
      const result = await aiPoweredWritingAssistance({ text: selectedText });
      const newContent =
        content.substring(0, start) +
        result.enhancedText +
        content.substring(end);
      setContent(newContent);
      toast({
        title: "Text enhanced!",
        description: "Your selected text has been improved by AI.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error enhancing text",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoadingEnhance(false);
    }
  }, [content, toast]);

  const handleDownload = () => {
    const filename = `${title.replace(/ /g, "_") || "manuscript"}.md`;
    const fullContent = `# ${title}\n\n${content}`;
    const blob = new Blob([fullContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 text-primary">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-headline font-semibold">KDP Author AI</h1>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarGroup>
            <div className="space-y-2">
              <Label htmlFor="summary">Book Summary for Title</Label>
              <Textarea
                id="summary"
                placeholder="e.g., A sci-fi story about a lone astronaut on Mars."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="min-h-[100px]"
              />
              <Button onClick={handleGenerateTitle} disabled={isLoadingTitle} className="w-full bg-accent hover:bg-accent/80 text-accent-foreground">
                {isLoadingTitle ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Sparkles />
                )}
                Generate Title
              </Button>
            </div>
          </SidebarGroup>
          <SidebarGroup>
            <div className="space-y-2">
              <Label htmlFor="synopsis">Book Synopsis for Outline</Label>
              <Textarea
                id="synopsis"
                placeholder="A detailed synopsis of your book's plot, characters, and themes."
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                className="min-h-[150px]"
              />
              <Button onClick={handleGenerateOutline} disabled={isLoadingOutline} className="w-full bg-accent hover:bg-accent/80 text-accent-foreground">
                {isLoadingOutline ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Sparkles />
                )}
                Generate Outline
              </Button>
            </div>
          </SidebarGroup>
          {outline && (
            <SidebarGroup>
               <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Chapter Outline</AccordionTrigger>
                  <AccordionContent>
                    <pre className="whitespace-pre-wrap font-body text-sm">{outline}</pre>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </SidebarGroup>
          )}
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="flex flex-col h-screen">
        <header className="flex items-center gap-4 p-4 border-b bg-card">
          <SidebarTrigger className="md:hidden" />
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-headline font-bold border-0 focus-visible:ring-0 shadow-none p-0 h-auto"
            placeholder="Your Book Title"
          />
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={() => applyFormatting("bold")}><Bold /></Button>
            <Button variant="outline" size="sm" onClick={() => applyFormatting("italic")}><Italic /></Button>
            <Button variant="outline" size="sm" onClick={handleEnhanceText} disabled={isLoadingEnhance} className="bg-accent/30 text-accent-foreground">
              {isLoadingEnhance ? <Loader2 className="animate-spin"/> : <Sparkles />}
            </Button>
            <Button size="sm" onClick={handleDownload}><Download /> Download</Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Textarea
            ref={editorRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your masterpiece..."
            className="w-full h-full resize-none border-0 focus:ring-0 focus-visible:ring-0 p-6 text-base leading-relaxed bg-transparent font-body"
          />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
