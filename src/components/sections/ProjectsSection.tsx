'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Container } from '@/components/shared/Container';
import { ScrollAnimationWrapper } from '@/components/shared/ScrollAnimationWrapper';
import type { Project } from '@/data/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateTestimonials, type GenerateTestimonialsInput } from '@/ai/flows/generate-testimonials';
import { ExternalLink, Github, Sparkles, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientNeeds, setClientNeeds] = useState('');
  const [testimonial, setTestimonial] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateTestimonial = async () => {
    if (!clientNeeds.trim()) {
      toast({ title: 'Client needs are required', description: 'Please describe the client\'s needs to generate a testimonial.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setTestimonial('');
    try {
      const input: GenerateTestimonialsInput = {
        projectDescription: project.longDescription || project.description,
        clientNeeds: clientNeeds,
      };
      const result = await generateTestimonials(input);
      setTestimonial(result.testimonial);
      toast({ title: 'Testimonial Generated!', description: 'AI has crafted a personalized testimonial.', variant: 'default' });
    } catch (error) {
      console.error('Error generating testimonial:', error);
      toast({ title: 'Error', description: 'Failed to generate testimonial. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollAnimationWrapper animationClassName="animate-fade-in-up">
      <Card className="h-full flex flex-col overflow-hidden bg-card shadow-xl hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative w-full aspect-video overflow-hidden">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            data-ai-hint={project.imageHint || 'project technology'}
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-foreground">{project.title}</CardTitle>
          <CardDescription className="text-muted-foreground h-12 overflow-hidden">{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center">
          <div className="flex gap-2">
            {project.liveUrl && (
              <Button variant="outline" size="sm" asChild className="border-primary text-primary hover:bg-primary/10">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                </a>
              </Button>
            )}
            {project.sourceUrl && (
              <Button variant="outline" size="sm" asChild className="border-primary text-primary hover:bg-primary/10">
                <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" /> Source
                </a>
              </Button>
            )}
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="w-full sm:w-auto">
                <Sparkles className="mr-2 h-4 w-4" /> AI Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card">
              <DialogHeader>
                <DialogTitle className="text-foreground">Generate AI Testimonial for {project.title}</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Describe the potential client's needs to generate a personalized testimonial.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="client-needs" className="text-right text-foreground">
                    Client Needs
                  </Label>
                  <Textarea
                    id="client-needs"
                    value={clientNeeds}
                    onChange={(e) => setClientNeeds(e.target.value)}
                    className="col-span-3 bg-input text-foreground border-border focus:ring-primary"
                    placeholder="e.g., Needs a scalable e-commerce solution with great UX."
                  />
                </div>
              </div>
              {testimonial && (
                <div className="mt-4 p-4 border border-primary/50 rounded-md bg-primary/10">
                  <h4 className="font-semibold text-primary mb-2 flex items-center"><MessageSquare className="h-5 w-5 mr-2" />Generated Testimonial:</h4>
                  <p className="text-sm text-foreground">{testimonial}</p>
                </div>
              )}
              <DialogFooter>
                <Button type="button" onClick={handleGenerateTestimonial} disabled={isLoading}>
                  {isLoading ? 'Generating...' : 'Generate'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </ScrollAnimationWrapper>
  );
}


interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-16 md:py-24 bg-secondary/10">
      <Container>
        <ScrollAnimationWrapper>
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-center mb-12">
            My <span className="text-primary">Creations</span>
          </h2>
          <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto mb-16">
            Here's a selection of projects that showcase my skills and passion for building innovative solutions. Each project reflects my commitment to quality and user-centric design.
          </p>
        </ScrollAnimationWrapper>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}
