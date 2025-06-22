
"use client";

import { useState, useEffect } from 'react';
import { AboutSection } from '@/components/sections/AboutSection';
import { DEFAULT_ABOUT_CONTENT, LOCALSTORAGE_ABOUT_KEY, type AboutContent } from '@/data/constants';
import { Container } from '@/components/shared/Container';
import { Skeleton } from '../ui/skeleton';

export function ClientAboutSectionLoader() {
  const [aboutContent, setAboutContent] = useState<AboutContent>(DEFAULT_ABOUT_CONTENT);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedContentString = localStorage.getItem(LOCALSTORAGE_ABOUT_KEY);
      if (storedContentString) {
        const storedContent: AboutContent = JSON.parse(storedContentString);
        if (storedContent && storedContent.text && storedContent.imageUrl) {
          setAboutContent(storedContent);
        }
      }
    } catch (error) {
      console.error("Error loading about content from localStorage. Using default content:", error);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <section id="about" className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Skeleton className="relative aspect-square max-w-md mx-auto rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return <AboutSection content={aboutContent} />;
}

    