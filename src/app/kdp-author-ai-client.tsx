"use client";

import { aiPoweredWritingAssistance } from "@/ai/flows/ai-powered-writing-assistance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Loader2, Send, User, Bot } from "lucide-react";
import React, { useCallback, useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function KdpAuthorAiClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await aiPoweredWritingAssistance({ text: input });
      const assistantMessage: Message = { role: 'assistant', content: result.enhancedText };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error getting response",
        description: "An unexpected error occurred. Please try again.",
      });
      // remove the user message if the assistant fails to respond
      setMessages(prev => prev.slice(0, prev.length -1));
    } finally {
      setIsLoading(false);
    }
  }, [input, toast]);


  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-3 p-4 border-b bg-card">
        <div className="p-2 rounded-lg bg-primary/20 text-primary">
          <BookOpen className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-headline font-semibold">KDP Author AI Chatbot</h1>
      </header>
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-6 space-y-6">
            {messages.map((message, index) => (
              <div key={index} className={cn("flex items-start gap-4", message.role === 'user' ? 'justify-end' : '')}>
                {message.role === 'assistant' && (
                   <Avatar className="w-8 h-8 border">
                    <AvatarFallback><Bot size={20}/></AvatarFallback>
                  </Avatar>
                )}
                <div className={cn("max-w-xl rounded-lg p-4", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card')}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                 {message.role === 'user' && (
                  <Avatar className="w-8 h-8 border">
                    <AvatarFallback><User size={20} /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-4">
                <Avatar className="w-8 h-8 border">
                  <AvatarFallback><Bot size={20}/></AvatarFallback>
                </Avatar>
                <div className="max-w-xl rounded-lg p-4 bg-card flex items-center">
                  <Loader2 className="animate-spin" />
                </div>
              </div>
            )}
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-muted-foreground">
                <p>Start a conversation with the AI author assistant!</p>
                <p className="text-sm">You can ask it to write a chapter, suggest plot ideas, or help with character development.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </main>
      <footer className="p-4 border-t bg-card">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the AI to help you write..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
          </Button>
        </form>
      </footer>
    </div>
  );
}
