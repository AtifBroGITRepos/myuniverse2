
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { ScrollAnimationWrapper } from '@/components/shared/ScrollAnimationWrapper';
import { PROJECTS_DATA, LOCALSTORAGE_PROJECTS_KEY, ATIF_PORTFOLIO_DESCRIPTION, type Project, type AdminMessage, LOCALSTORAGE_MESSAGES_KEY } from '@/data/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Github, Sparkles, MessageSquare, Lightbulb, Send, Palette, View } from 'lucide-react';
import { generateTestimonials, type GenerateTestimonialsInput } from '@/ai/flows/generate-testimonials';
import { suggestProjectIdeas, type SuggestProjectIdeasInput } from '@/ai/flows/suggest-project-ideas';
import { summarizeSingleMessage } from '@/ai/flows/summarize-single-message-flow';
import { sendInquiryEmails } from '@/app/actions/send-inquiry-email';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

function ProjectCard({ project }: { project: Project }) {
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
  const [isSubmittingServiceInquiry, setIsSubmittingServiceInquiry] = useState(false);
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
        atifPortfolio: ATIF_PORTFOLIO_DESCRIPTION,
        projectContext: project.title,
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

  const handleServiceInquirySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim() || !inquiryProjectIdea.trim()) {
      toast({ title: 'Missing Fields', description: 'Please fill in your name, email, and project idea.', variant: 'destructive' });
      return;
    }
    setIsSubmittingServiceInquiry(true);

    let messageSummaryForEmail: string | null = null;
    try {
      if (inquiryProjectIdea.trim()) {
        const summaryResult = await summarizeSingleMessage({ messageContent: inquiryProjectIdea });
        messageSummaryForEmail = summaryResult.summary;
      }
    } catch (summaryError) {
      console.warn(`AI summary generation failed for project inquiry "${project.title}":`, summaryError);
    }

    const inquiryDataForAction = {
      name: inquiryName,
      email: inquiryEmail,
      message: `Service Inquiry for project: "${project.title}"`,
      type: 'Project Service Inquiry' as const,
      projectTitle: project.title,
      clientProjectIdea: inquiryProjectIdea,
      aiGeneratedIdeas: aiGeneratedIdeas,
      messageSummary: messageSummaryForEmail,
    };

    const combinedMessageForAdminPanel = `
Service Inquiry regarding project: "${project.title}"
Client's Project Idea/Requirements:
${inquiryProjectIdea}
${messageSummaryForEmail ? `\n\nAI Summary of Client Idea: ${messageSummaryForEmail}` : ''}
${aiGeneratedIdeas ? `\n\nAI Suggested Ideas (for reference):\n${aiGeneratedIdeas}` : ''}
    `.trim();

    const originalMessageForAdminPanel: AdminMessage = {
      id: `inquiry-${Date.now()}`,
      name: inquiryName,
      email: inquiryEmail,
      message: combinedMessageForAdminPanel,
      receivedAt: new Date().toISOString(),
    };

    try {
      const storedMessages = localStorage.getItem(LOCALSTORAGE_MESSAGES_KEY);
      const messages: AdminMessage[] = storedMessages ? JSON.parse(storedMessages) : [];
      messages.push(originalMessageForAdminPanel);
      messages.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
      localStorage.setItem(LOCALSTORAGE_MESSAGES_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving inquiry to localStorage:', error);
    }

    const emailResult = await sendInquiryEmails(inquiryDataForAction);

    if (emailResult.success || emailResult.adminEmailFailed) {
      toast({ title: 'Inquiry Submitted!', description: "Thank you for your interest. We've received your inquiry and will get back to you soon." });
      setInquiryName('');
      setInquiryEmail('');
      setInquiryProjectIdea('');
      setAiGeneratedIdeas(null);
      setIsServiceModalOpen(false);
      if (emailResult.adminEmailFailed && emailResult.originalInquiryData) {
        console.warn("Admin email failed for service inquiry:", emailResult.adminEmailError);
      }
    } else {
      toast({ title: 'Submission Error', description: emailResult.error || 'Could not send your inquiry. Please try again.', variant: 'destructive' });
    }
    setIsSubmittingServiceInquiry(false);
  };

  return (
    <ScrollAnimationWrapper animationClassName="animate-fade-in-up">
      <Card className="h-full flex flex-col overflow-hidden bg-card shadow-xl hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 group">
        <Link href={`/projects/${project.id}`} className="block relative w-full aspect-video overflow-hidden">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            data-ai-hint={project.imageHint || 'project technology'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
        <CardHeader>
          <Link href={`/projects/${project.id}`}>
            <CardTitle className="font-headline text-2xl text-foreground hover:text-primary transition-colors">{project.title}</CardTitle>
          </Link>
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
             <Button variant="outline" size="sm" asChild className="border-primary/50 text-primary/90 hover:bg-primary/10 hover:text-primary">
                <Link href={`/projects/${project.id}`}>
                  <View className="mr-2 h-4 w-4" /> View Details
                </Link>
              </Button>
            {(project.showLiveUrlButton === undefined || project.showLiveUrlButton) && project.liveUrl && (
              <Button variant="outline" size="sm" asChild className="border-primary text-primary hover:bg-primary/10">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                </a>
              </Button>
            )}
            {(project.showSourceUrlButton === undefined || project.showSourceUrlButton) && project.sourceUrl && (
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
                    <Label htmlFor={`inquiry-project-idea-${project.id}`} className="text-foreground">Your Project Idea / Requirements</Label>
                    <Textarea
                      id={`inquiry-project-idea-${project.id}`}
                      value={inquiryProjectIdea}
                      onChange={(e) => setInquiryProjectIdea(e.target.value)}
                      className="mt-1 bg-input text-foreground border-border focus:ring-primary"
                      placeholder="e.g., I need a similar e-commerce platform but for selling handmade crafts..."
                      rows={4}
                      required
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
                    <Label htmlFor={`inquiry-name-${project.id}`} className="text-foreground">Your Name</Label>
                    <Input
                      id={`inquiry-name-${project.id}`}
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="mt-1 bg-input text-foreground border-border focus:ring-primary"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`inquiry-email-${project.id}`} className="text-foreground">Your Email</Label>
                    <Input
                      id={`inquiry-email-${project.id}`}
                      type="email"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="mt-1 bg-input text-foreground border-border focus:ring-primary"
                      placeholder="john.doe@example.com"
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full" disabled={isSubmittingServiceInquiry}>
                     {isSubmittingServiceInquiry ? <><Sparkles className="mr-2 h-4 w-4 animate-pulse"/> Submitting...</> : <><Send className="mr-2 h-4 w-4" /> Submit Inquiry</> }
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
                    <Label htmlFor={`client-needs-testimonial-${project.id}`} className="text-right text-foreground">
                      Client Needs
                    </Label>
                    <Textarea
                      id={`client-needs-testimonial-${project.id}`}
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

function ClientProjectsView() {
  const [projects, setProjects] = useState<Project[]>(PROJECTS_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedProjectsString = localStorage.getItem(LOCALSTORAGE_PROJECTS_KEY);
      if (storedProjectsString) {
        const storedProjects: Project[] = JSON.parse(storedProjectsString);
        if (Array.isArray(storedProjects) && storedProjects.every(p => typeof p.id === 'string')) {
            // Ensure boolean flags have default values if missing from localStorage
            const projectsWithDefaults = storedProjects.map(p => ({
                ...p,
                showLiveUrlButton: p.showLiveUrlButton === undefined ? true : p.showLiveUrlButton,
                showSourceUrlButton: p.showSourceUrlButton === undefined ? true : p.showSourceUrlButton,
            }));
          setProjects(projectsWithDefaults);
        } else {
          setProjects(PROJECTS_DATA); // Fallback if structure is invalid
        }
      } else {
        setProjects(PROJECTS_DATA); // Fallback if no data in localStorage
      }
    } catch (error) {
      console.error("Error loading projects from localStorage. Using default projects:", error);
      setProjects(PROJECTS_DATA); // Fallback on any error
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <Container className="py-16 md:py-24 text-center">
        <p className="text-muted-foreground">Loading projects...</p>
      </Container>
    );
  }

  return (
    <section id="projects-gallery" className="py-16 md:py-24 bg-secondary/10">
      <Container>
        <ScrollAnimationWrapper>
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-center mb-12">
            Project <span className="text-primary">Gallery</span>
          </h2>
          <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto mb-16">
            Browse through a collection of my work. Click on any project to see more details.
          </p>
        </ScrollAnimationWrapper>

        {projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-lg">No projects available at the moment. Check back soon!</p>
        )}
      </Container>
    </section>
  );
}

export default function ProjectsPage() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <ClientProjectsView />
      </main>
      <Footer />
    </>
  );
}
