"use client";

import Image from 'next/image';
import { Container } from '@/components/shared/Container';
import { ScrollAnimationWrapper } from '@/components/shared/ScrollAnimationWrapper';
import type { Testimonial } from '@/data/constants';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessagesSquare, Quote } from 'lucide-react';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="h-full flex flex-col bg-card shadow-xl hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="relative pb-4">
        <Quote className="absolute top-4 left-4 h-10 w-10 text-primary/30 transform -translate-x-1 -translate-y-1" />
        <p className="text-muted-foreground italic leading-relaxed pt-6 pl-6">
          "{testimonial.quote}"
        </p>
      </CardHeader>
      <CardContent className="flex-grow"></CardContent>
      <CardFooter className="flex items-center gap-4 pt-4 border-t border-border/40">
        {testimonial.avatarUrl && (
          <Avatar className="h-12 w-12">
            <AvatarImage src={testimonial.avatarUrl} alt={testimonial.author} data-ai-hint={testimonial.avatarHint || "person"} />
            <AvatarFallback>{testimonial.author.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
        <div>
          <p className="font-semibold text-foreground">{testimonial.author}</p>
          <p className="text-sm text-muted-foreground">
            {testimonial.role}{testimonial.company && `, ${testimonial.company}`}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-secondary/10">
      <Container>
        <ScrollAnimationWrapper>
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-center mb-6">
            Words From <span className="text-primary">Collaborators</span>
          </h2>
          <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto mb-16">
            Hear what clients and colleagues have to say about working with me and the impact of my contributions.
          </p>
        </ScrollAnimationWrapper>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <ScrollAnimationWrapper key={testimonial.id} animationClassName="animate-fade-in-up" delay={`${index * 100}ms`}>
              <TestimonialCard testimonial={testimonial} />
            </ScrollAnimationWrapper>
          ))}
        </div>
      </Container>
    </section>
  );
}
