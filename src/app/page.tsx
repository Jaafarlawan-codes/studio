
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Feather, Zap } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();

  const handleGetStartedClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.open('https://otieu.com/4/9277631', '_blank');
    router.push('/editor');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <header className="flex items-center gap-3 p-4 border-b bg-background">
        <div className="p-2 rounded-lg bg-primary/20 text-primary">
          <BookOpen className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-headline font-semibold">KDP Author AI</h1>
      </header>
      <main className="flex-1">
        <section className="relative w-full h-[60vh] flex items-center justify-center text-center text-white">
          <Image 
            src="https://picsum.photos/1200/800"
            alt="Author writing a book"
            fill
            style={{ objectFit: 'cover' }}
            className="absolute inset-0 z-0"
            data-ai-hint="writing book"
          />
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="relative z-20 p-4 space-y-4">
            <h2 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
              Bring Your Book to Life with AI
            </h2>
            <p className="max-w-2xl mx-auto text-lg md:text-xl">
              Your personal AI assistant for writing, outlining, and publishing on Amazon KDP.
            </p>
            <Button size="lg" className="text-lg" onClick={handleGetStartedClick}>
              Get Started
              <Feather className="ml-2" />
            </Button>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 md:grid-cols-3">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/20 text-primary p-3 rounded-full w-fit">
                    <Zap className="w-8 h-8" />
                  </div>
                  <CardTitle className="mt-4">AI-Powered Generation</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Provide a title, description, and synopsis, and our advanced AI will write a complete, chapter-by-chapter book for you in moments.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/20 text-primary p-3 rounded-full w-fit">
                    <Feather className="w-8 h-8" />
                  </div>
                  <CardTitle className="mt-4">Focus on Story</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Let the AI handle the heavy lifting of drafting. You can focus on the creative process, refining the plot, and developing your characters.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/20 text-primary p-3 rounded-full w-fit">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <CardTitle className="mt-4">KDP Ready</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Download your manuscript as a clean text file, ready to be formatted and published directly to Amazon Kindle Direct Publishing.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="p-4 text-center border-t text-sm text-muted-foreground">
        © {new Date().getFullYear()} KDP Author AI. All rights reserved.
      </footer>
    </div>
  );
}
