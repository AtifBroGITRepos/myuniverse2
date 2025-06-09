"use client";

import { Container } from '@/components/shared/Container';
import { TypingAnimation } from '@/components/shared/TypingAnimation';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  const roles = ["Full-Stack Developer", "UI/UX Designer", "Tech Innovator", "Problem Solver", "Prompt Engineer"];

  return (
    <section id="hero" className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center text-center bg-gradient-to-br from-background via-secondary/10 to-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <Container className="relative z-10 py-20">
        <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight">
          <span className="block">Hello, I'm Atif.</span>
          <span className="block text-primary animate-text-glow">Welcome to My Universe.</span>
        </h1>
        <div className="mt-8 text-xl sm:text-2xl md:text-3xl text-muted-foreground font-medium flex items-baseline justify-center">
          <span className="mr-2">I am a</span>
          <TypingAnimation texts={roles} className="text-primary font-semibold" />
        </div>
        <p className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
          Crafting digital experiences that inspire, engage, and solve real-world problems.
          Let's build something amazing together.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button size="lg" asChild className="font-semibold">
            <Link href="#projects">View My Work</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="font-semibold border-primary hover:bg-primary/10 text-primary">
            <Link href="#contact">Get In Touch</Link>
          </Button>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <Link href="#about" aria-label="Scroll to about section">
            <ArrowDown className="h-8 w-8 text-primary animate-bounce" />
          </Link>
        </div>
      </Container>
      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--primary)) 1px, hsl(var(--background)) 1px);
          background-size: 2rem 2rem;
        }
      `}</style>
    </section>
  );
}
