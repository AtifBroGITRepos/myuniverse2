
'use client';

import { useState, type FormEvent } from 'react';
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
import { suggestProjectIdeas, type SuggestProjectIdeasInput } from '@/ai/flows/suggest-project-ideas';
import { ExternalLink, Github, Sparkles, MessageSquare, Lightbulb, Send, Palette } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ATIF_PORTFOLIO_DESCRIPTION, LOCALSTORAGE_MESSAGES_KEY, type AdminMessage } from '@/data/constants';

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [clientNeedsForTestimonial, setClientNeedsForTestimonial] = useState('');
  const [generatedTestimonial, setGeneratedTestimonial] = useState('');
  const [isLoadingTestimonial, setIsLoadingTestimonial] = useState(false);

  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryProjectIdea, setInquiryProjectIdea] = useState('');
  const [aiGeneratedIdeas, setAiGeneratedIdeas] = useState<string | null>(null);
  const [isLoadingServiceIdeas, setIsLoadingServiceIdeas] = useState(false);

  const { toast } = useToast();

  const handleGenerateTestimonial = async () => {
    if (!clientNeedsForTestimonial.trim()) {
      toast({ title: 'Client needs are required', description: 'Please describe the client\'s needs to generate a testimonial.', variant: 'destructive' });
      return;
    }
    setIsLoadingTestimonial(true);
    setGeneratedTestimonial('');
    try {
      const input: GenerateTestimonialsInput = {
        projectDescription: project.longDescription || project.description,
        clientNeeds: clientNeedsForTestimonial,
      };
      const result = await generateTestimonials(input);
      setGeneratedTestimonial(result.testimonial);
      toast({ title: 'Testimonial Generated!', description: 'AI has crafted a personalized testimonial.', variant: 'default' });
    } catch (error) {
      console.error('Error generating testimonial:', error);
      toast({ title: 'Error', description: 'Failed to generate testimonial. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoadingTestimonial(false);
    }
  };

  const handleGenerateServiceIdeas = async () => {
    if (!inquiryProjectIdea.trim()) {
      toast({ title: 'Project idea is required', description: 'Please describe your initial project idea first.', variant: 'destructive' });
      return;
    }
    setIsLoadingServiceIdeas(true);
    setAiGeneratedIdeas(null);
    try {
      const input: SuggestProjectIdeasInput = {
        businessNeeds: inquiryProjectIdea,
        atifPortfolio: ATIF_PORTFOLIO_DESCRIPTION, // Using the general portfolio description
        projectContext: project.title, // Context of the current project
      };
      const result = await suggestProjectIdeas(input);
      setAiGeneratedIdeas(result.projectIdeas);
      toast({ title: 'AI Project Ideas Generated!', description: 'AI has brainstormed some ideas based on your input.', variant: 'default' });
    } catch (error) {
      console.error('Error generating service ideas:', error);
      toast({ title: 'AI Error', description: 'Failed to generate project ideas. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoadingServiceIdeas(false);
    }
  };

  const handleServiceInquirySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim() || !inquiryProjectIdea.trim()) {
      toast({ title: 'Missing Fields', description: 'Please fill in your name, email, and project idea.', variant: 'destructive' });
      return;
    }

    const messageContent = `
      Service Inquiry regarding project: "${project.title}"
      Client Name: ${inquiryName}
      Client Email: ${inquiryEmail}
      Client Project Idea/Requirements:
      ${inquiryProjectIdea}
      ${aiGeneratedIdeas ? `\nAI Suggested Ideas (for reference):\n${aiGeneratedIdeas}` : ''}
    `.trim();

    const newMessage: AdminMessage = {
      id: `inquiry-${Date.now()}`,
      name: inquiryName,
      email: inquiryEmail,
      message: messageContent,
      receivedAt: new Date().toISOString(),
    };

    try {
      const storedMessages = localStorage.getItem(LOCALSTORAGE_MESSAGES_KEY);
      const messages: AdminMessage[] = storedMessages ? JSON.parse(storedMessages) : [];
      messages.push(newMessage);
      localStorage.setItem(LOCALSTORAGE_MESSAGES_KEY, JSON.stringify(messages));

      toast({ title: 'Inquiry Submitted!', description: 'Thank you for your interest. Atif will get back to you soon.' });
      setInquiryName('');
      setInquiryEmail('');
      setInquiryProjectIdea('');
      setAiGeneratedIdeas(null);
      setIsServiceModalOpen(false);
    } catch (error) {
      console.error('Error saving inquiry to localStorage:', error);
      toast({ title: 'Submission Error', description: 'Could not save your inquiry. Please try again.', variant: 'destructive' });
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
        <CardFooter className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center flex-wrap">
          <div className="flex gap-2 flex-wrap">
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
          
          <div className="flex gap-2 flex-wrap mt-2 sm:mt-0">
            <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="w-full sm:w-auto">
                  <Palette className="mr-2 h-4 w-4" /> Get Service
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg bg-card">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Inquire about: {project.title}</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Interested in a service related to this project? Describe your needs below.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleServiceInquirySubmit} className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="inquiry-project-idea" className="text-foreground">Your Project Idea / Requirements</Label>
                    <Textarea
                      id="inquiry-project-idea"
                      value={inquiryProjectIdea}
                      onChange={(e) => setInquiryProjectIdea(e.target.value)}
                      className="mt-1 bg-input text-foreground border-border focus:ring-primary"
                      placeholder="e.g., I need a similar e-commerce platform but for selling handmade crafts..."
                      rows={4}
                    />
                  </div>
                  <Button type="button" variant="outline" onClick={handleGenerateServiceIdeas} disabled={isLoadingServiceIdeas || !inquiryProjectIdea.trim()} className="w-full">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    {isLoadingServiceIdeas ? 'Getting AI Ideas...' : 'Get AI Ideas (Optional)'}
                  </Button>
                  {aiGeneratedIdeas && (
                    <Card className="p-4 bg-primary/10 border-primary/50">
                      <CardTitle className="text-md text-primary mb-2">AI Suggested Ideas:</CardTitle>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{aiGeneratedIdeas}</p>
                    </Card>
                  )}
                  <div>
                    <Label htmlFor="inquiry-name" className="text-foreground">Your Name</Label>
                    <Input
                      id="inquiry-name"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="mt-1 bg-input text-foreground border-border focus:ring-primary"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inquiry-email" className="text-foreground">Your Email</Label>
                    <Input
                      id="inquiry-email"
                      type="email"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="mt-1 bg-input text-foreground border-border focus:ring-primary"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full">
                     <Send className="mr-2 h-4 w-4" /> Submit Inquiry
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isTestimonialModalOpen} onOpenChange={setIsTestimonialModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full sm:w-auto border-accent text-accent hover:bg-accent/10">
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
                    <Label htmlFor="client-needs-testimonial" className="text-right text-foreground">
                      Client Needs
                    </Label>
                    <Textarea
                      id="client-needs-testimonial"
                      value={clientNeedsForTestimonial}
                      onChange={(e) => setClientNeedsForTestimonial(e.target.value)}
                      className="col-span-3 bg-input text-foreground border-border focus:ring-primary"
                      placeholder="e.g., Needs a scalable e-commerce solution with great UX."
                    />
                  </div>
                </div>
                {generatedTestimonial && (
                  <div className="mt-4 p-4 border border-primary/50 rounded-md bg-primary/10">
                    <h4 className="font-semibold text-primary mb-2 flex items-center"><MessageSquare className="h-5 w-5 mr-2" />Generated Testimonial:</h4>
                    <p className="text-sm text-foreground">{generatedTestimonial}</p>
                  </div>
                )}
                <DialogFooter>
                  <Button type="button" onClick={handleGenerateTestimonial} disabled={isLoadingTestimonial}>
                    {isLoadingTestimonial ? 'Generating...' : 'Generate'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
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

    

    