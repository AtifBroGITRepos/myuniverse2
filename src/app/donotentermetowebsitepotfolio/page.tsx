
"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent, useRef } from 'react';
import Image from 'next/image';
import { Container } from '@/components/shared/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  ATIF_PORTFOLIO_DESCRIPTION, KEY_SKILLS, SERVICES_DATA, PROJECTS_DATA, CONTACT_INFO, TESTIMONIALS_DATA, HEADER_NAV_ITEMS_DATA,
  LOCALSTORAGE_MESSAGES_KEY, LOCALSTORAGE_TESTIMONIALS_KEY, LOCALSTORAGE_HEADER_NAV_KEY, LOCALSTORAGE_PROJECTS_KEY,
  DEFAULT_EMAIL_TEMPLATES, LOCALSTORAGE_EMAIL_TEMPLATES_KEY, type EmailTemplates,
  DEFAULT_SITE_INFO, LOCALSTORAGE_SITE_INFO_KEY, type SiteInfo,
  type Service, type Project, type ProjectImage, type ContactDetails, type ServiceIconName, type AdminMessage, type Testimonial, type NavItem,
  LOCALSTORAGE_ABOUT_KEY, LOCALSTORAGE_SERVICES_KEY, LOCALSTORAGE_CONTACT_KEY, 
} from '@/data/constants';
import { generateAboutText, type GenerateAboutTextInput } from '@/ai/flows/generate-about-text-flow';
import { summarizeMessages, type SummarizeMessagesInput } from '@/ai/flows/summarize-messages-flow';
import { summarizeSingleMessage, type SummarizeSingleMessageInput } from '@/ai/flows/summarize-single-message-flow';
import { generateHeroText, type GenerateHeroTextInput } from '@/ai/flows/generate-hero-text-flow';
import { generateServiceItem, type GenerateServiceItemInput } from '@/ai/flows/generate-service-item-flow';
import { generateProjectHighlight, type GenerateProjectHighlightInput } from '@/ai/flows/generate-project-highlight-flow';
import { suggestSectionStructure, type SuggestSectionStructureInput } from '@/ai/flows/suggest-section-structure-flow';
import { generateEmailContent, type GenerateEmailContentInput } from '@/ai/flows/generate-email-content-flow';
import { sendAdminComposedEmail } from '@/app/actions/send-admin-email';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


import { Sparkles, Lock, Unlock, Trash2, PlusCircle, UserSquare, Briefcase, LayoutGrid, Mail, BotMessageSquare, FileText, Send, Star, MenuSquareIcon, Crop, Lightbulb, Layers, Settings, MailPlus, LayoutTemplate, MessageCircleQuestion, RefreshCw, Globe, UploadCloud, Link as LinkIcon, Eye, EyeOff, ExternalLink, View, ImagePlus, XCircle } from 'lucide-react';

const ADMIN_SECRET_KEY = "ilovegfxm";


function AboutEditor() {
  const [aboutText, setAboutText] = useState(ATIF_PORTFOLIO_DESCRIPTION);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();
  const isInitialMount = useRef(true);

  useEffect(() => {
    const storedAboutText = localStorage.getItem(LOCALSTORAGE_ABOUT_KEY);
    if (storedAboutText) {
      setAboutText(storedAboutText);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem(LOCALSTORAGE_ABOUT_KEY, aboutText);
  }, [aboutText]);

  const handleReset = () => {
    setAboutText(ATIF_PORTFOLIO_DESCRIPTION);
    localStorage.removeItem(LOCALSTORAGE_ABOUT_KEY);
    toast({ title: "Reset Successful", description: "About Me text reset to default." });
  };

  const handleGenerateWithAI = async () => {
    setIsAiLoading(true);
    try {
      const input: GenerateAboutTextInput = {
        currentText: aboutText,
        keywords: KEY_SKILLS.slice(0, 5),
        tone: 'professional',
      };
      const result = await generateAboutText(input);
      if (result.suggestedText) {
        setAboutText(result.suggestedText);
        toast({ title: "AI Suggestion Applied!", description: "New About Me text generated and autosaved." });
      } else {
        toast({ title: "AI Suggestion", description: "AI did not provide a new suggestion.", variant: "default" });
      }
    } catch (error) {
      console.error("Error generating about text with AI:", error);
      toast({ title: "AI Error", description: "Could not generate text. Please try again.", variant: "destructive" });
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>About Me Editor</CardTitle>
        <CardDescription>Edit the "About Me" section text. Changes are saved automatically.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={aboutText}
          onChange={(e) => setAboutText(e.target.value)}
          rows={10}
          className="bg-input text-foreground border-border focus:ring-primary"
          placeholder="Enter your About Me description..."
        />
         <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleGenerateWithAI} disabled={isAiLoading} className="flex-1">
            <Sparkles className="mr-2 h-4 w-4" />
            {isAiLoading ? "Generating with AI..." : "Suggest with AI"}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>Reset to Default</Button>
      </CardFooter>
    </Card>
  );
}

const serviceIconOptions: ServiceIconName[] = ['Server', 'Palette', 'Briefcase', 'Brain'];

function ServicesEditor() {
  const [services, setServices] = useState<Service[]>(SERVICES_DATA);
  const { toast } = useToast();
  const isInitialMount = useRef(true);

  useEffect(() => {
    const storedServices = localStorage.getItem(LOCALSTORAGE_SERVICES_KEY);
    if (storedServices) {
      try {
        setServices(JSON.parse(storedServices));
      } catch (e) {
        console.error("Error parsing services from localStorage", e);
        setServices(SERVICES_DATA);
        toast({ title: "Load Error", description: "Could not load saved services, reset to default.", variant: "destructive" });
      }
    } else {
      setServices(SERVICES_DATA);
    }
  }, [toast]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem(LOCALSTORAGE_SERVICES_KEY, JSON.stringify(services));
  }, [services]);

  const handleServiceChange = (index: number, field: keyof Service, value: string) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setServices(updatedServices);
  };

  const handleIconChange = (index: number, value: ServiceIconName) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], iconName: value };
    setServices(updatedServices);
  };

  const handleAddService = () => {
    setServices([...services, { id: `service-${Date.now()}`, title: '', description: '', iconName: 'Server' }]);
    toast({ title: "Service Added", description: "A new service template has been added." });
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
    toast({ title: "Service Removed", description: "The service has been removed.", variant: "default" });
  };

  const handleReset = () => {
    setServices(SERVICES_DATA);
    localStorage.removeItem(LOCALSTORAGE_SERVICES_KEY);
    toast({ title: "Reset Successful", description: "Services data reset to default." });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Services Editor</CardTitle>
        <CardDescription>Edit the services offered. Changes are saved automatically.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {services.map((service, index) => (
          <Card key={service.id} className="p-4 bg-secondary/20">
            <div className="space-y-3">
              <div>
                <Label htmlFor={`service-title-${index}`}>Service Title</Label>
                <Input
                  id={`service-title-${index}`}
                  value={service.title}
                  onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                  className="bg-input text-foreground border-border"
                />
              </div>
              <div>
                <Label htmlFor={`service-desc-${index}`}>Description</Label>
                <Textarea
                  id={`service-desc-${index}`}
                  value={service.description}
                  onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                  rows={3}
                  className="bg-input text-foreground border-border"
                />
              </div>
              <div>
                <Label htmlFor={`service-icon-${index}`}>Icon</Label>
                <Select
                  value={service.iconName}
                  onValueChange={(value: ServiceIconName) => handleIconChange(index, value)}
                >
                  <SelectTrigger id={`service-icon-${index}`} className="bg-input text-foreground border-border">
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceIconOptions.map(iconName => (
                      <SelectItem key={iconName} value={iconName}>{iconName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button variant="destructive" size="sm" onClick={() => handleRemoveService(index)} className="mt-3">
              <Trash2 className="mr-2 h-4 w-4" /> Remove Service
            </Button>
          </Card>
        ))}
        <Button variant="outline" onClick={handleAddService} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>Reset to Default</Button>
      </CardFooter>
    </Card>
  );
}

function ProjectsEditor() {
  const [projects, setProjects] = useState<Project[]>([]);
  const { toast } = useToast();
  const isInitialMount = useRef(true);

  useEffect(() => {
    let initialProjects = PROJECTS_DATA.map(p => ({
      ...p,
      images: p.images && p.images.length > 0 ? p.images : [{ url: 'https://placehold.co/600x400.png', hint: 'project placeholder' }],
      showLiveUrlButton: p.showLiveUrlButton === undefined ? true : p.showLiveUrlButton,
      showSourceUrlButton: p.showSourceUrlButton === undefined ? true : p.showSourceUrlButton,
    }));

    try {
      const storedProjectsString = localStorage.getItem(LOCALSTORAGE_PROJECTS_KEY);
      if (storedProjectsString) {
        const storedProjects: Project[] = JSON.parse(storedProjectsString);
        initialProjects = storedProjects.map(p => {
          let currentImages = p.images || [];
          if (p.imageUrl && (!p.images || p.images.length === 0)) {
              currentImages = [{ url: p.imageUrl, hint: p.imageHint || 'migrated image' }];
          }
          if (currentImages.length === 0) {
              currentImages = [{ url: 'https://placehold.co/600x400.png', hint: 'project placeholder' }];
          }
          
          const { imageUrl, imageHint, ...restOfP } = p;
          
          return {
            ...restOfP,
            images: currentImages,
            showLiveUrlButton: p.showLiveUrlButton === undefined ? true : p.showLiveUrlButton,
            showSourceUrlButton: p.showSourceUrlButton === undefined ? true : p.showSourceUrlButton,
          };
        });
      }
    } catch (e) {
      console.error("Error parsing projects from localStorage", e);
      toast({ title: "Load Error", description: "Could not load saved projects, reset to default.", variant: "destructive" });
    }
    setProjects(initialProjects);
  }, [toast]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem(LOCALSTORAGE_PROJECTS_KEY, JSON.stringify(projects));
  }, [projects]);

  const handleProjectChange = (projIndex: number, field: keyof Project, value: any) => {
    const updatedProjects = [...projects];
    updatedProjects[projIndex] = { ...updatedProjects[projIndex], [field]: value };
    setProjects(updatedProjects);
  };

  const handleImageChange = (projIndex: number, imgIndex: number, field: keyof ProjectImage, value: string) => {
    const updatedProjects = [...projects];
    const projectImages = [...(updatedProjects[projIndex].images || [])];
    projectImages[imgIndex] = { ...projectImages[imgIndex], [field]: value };
    updatedProjects[projIndex].images = projectImages;
    setProjects(updatedProjects);
  };

  const handleImageFileChange = (projIndex: number, imgIndex: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleImageChange(projIndex, imgIndex, 'url', reader.result as string);
        toast({ title: "Image Preview Ready", description: `Image ${imgIndex + 1} for project '${projects[projIndex].title}' updated.` });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageToProject = (projIndex: number) => {
    const updatedProjects = [...projects];
    const projectImages = [...(updatedProjects[projIndex].images || [])];
    projectImages.push({ url: 'https://placehold.co/600x400.png', hint: 'new image' });
    updatedProjects[projIndex].images = projectImages;
    setProjects(updatedProjects);
    toast({ title: "Image Slot Added", description: `Added new image slot to '${projects[projIndex].title}'.` });
  };

  const handleRemoveImageFromProject = (projIndex: number, imgIndex: number) => {
    const updatedProjects = [...projects];
    let projectImages = [...(updatedProjects[projIndex].images || [])];
    projectImages.splice(imgIndex, 1);
    if (projectImages.length === 0) {
        projectImages.push({ url: 'https://placehold.co/600x400.png', hint: 'project placeholder' });
    }
    updatedProjects[projIndex].images = projectImages;
    setProjects(updatedProjects);
    toast({ title: "Image Removed", description: `Image ${imgIndex + 1} removed from '${projects[projIndex].title}'.` });
  };

  const handleAddProject = () => {
    setProjects(prevProjects => [...prevProjects, {
      id: `project-${Date.now()}`,
      title: 'New Project',
      description: 'Short description for new project.',
      longDescription: 'Detailed description for new project.',
      images: [{ url: 'https://placehold.co/600x400.png', hint: 'new project' }],
      tags: ['New Tag'],
      liveUrl: '',
      showLiveUrlButton: true,
      sourceUrl: '',
      showSourceUrlButton: true,
    }]);
    toast({ title: "Project Added", description: "A new project template has been added." });
  };

  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
    toast({ title: "Project Removed", description: "The project has been removed.", variant: "default" });
  };

  const handleReset = () => {
    const defaultFormattedProjects = PROJECTS_DATA.map(p => ({
        ...p,
        images: p.images && p.images.length > 0 ? p.images : [{ url: 'https://placehold.co/600x400.png', hint: 'project placeholder' }],
        showLiveUrlButton: p.showLiveUrlButton === undefined ? true : p.showLiveUrlButton,
        showSourceUrlButton: p.showSourceUrlButton === undefined ? true : p.showSourceUrlButton,
    }));
    setProjects(defaultFormattedProjects);
    localStorage.removeItem(LOCALSTORAGE_PROJECTS_KEY);
    toast({ title: "Reset Successful", description: "Projects data reset to default." });
  };

  return (
     <Card className="w-full">
      <CardHeader>
        <CardTitle>Projects Editor</CardTitle>
        <CardDescription>Edit project details. Changes are saved automatically. Manage multiple images per project. Toggle visibility of Live Demo and Source buttons.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {projects.map((project, projIndex) => (
          <Card key={project.id} className="p-4 bg-secondary/20 space-y-3">
            <div>
              <Label htmlFor={`project-title-${projIndex}`}>Title</Label>
              <Input id={`project-title-${projIndex}`} value={project.title} onChange={(e) => handleProjectChange(projIndex, 'title', e.target.value)} className="bg-input"/>
            </div>
            <div>
              <Label htmlFor={`project-desc-${projIndex}`}>Short Description</Label>
              <Textarea id={`project-desc-${projIndex}`} value={project.description} onChange={(e) => handleProjectChange(projIndex, 'description', e.target.value)} rows={2} className="bg-input"/>
            </div>
            <div>
              <Label htmlFor={`project-longdesc-${projIndex}`}>Long Description (for Detail Page)</Label>
              <Textarea id={`project-longdesc-${projIndex}`} value={project.longDescription} onChange={(e) => handleProjectChange(projIndex, 'longDescription', e.target.value)} rows={4} className="bg-input"/>
            </div>

            <div className="space-y-4 mt-4 border-t border-border pt-4">
              <Label className="text-md font-semibold">Project Images</Label>
              {(project.images || []).map((img, imgIndex) => (
                <Card key={`project-${projIndex}-img-${imgIndex}`} className="p-3 bg-card/50 space-y-2">
                  <Label htmlFor={`project-${projIndex}-imgurl-${imgIndex}`}>Image {imgIndex + 1}</Label>
                  <Input id={`project-${projIndex}-imgurl-${imgIndex}`} type="file" accept="image/*" onChange={(e) => handleImageFileChange(projIndex, imgIndex, e)} className="bg-input"/>
                  {img.url && (
                    <div className="mt-2 relative w-full aspect-video max-w-xs">
                      <Image src={img.url} alt={`Preview ${imgIndex+1}`} fill className="object-contain rounded"/>
                    </div>
                  )}
                  <Label htmlFor={`project-${projIndex}-imghint-${imgIndex}`}>Image AI Hint (1-2 words)</Label>
                  <Input id={`project-${projIndex}-imghint-${imgIndex}`} value={img.hint || ""} onChange={(e) => handleImageChange(projIndex, imgIndex, 'hint', e.target.value)} className="bg-input"/>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveImageFromProject(projIndex, imgIndex)} className="text-destructive hover:text-destructive/80">
                    <XCircle className="mr-1 h-4 w-4"/> Remove Image {imgIndex + 1}
                  </Button>
                </Card>
              ))}
              <Button variant="outline" size="sm" onClick={() => handleAddImageToProject(projIndex)}>
                <ImagePlus className="mr-2 h-4 w-4"/>
                {(project.images || []).length === 0 ? 'Add Image' : 'Add Another Image'}
              </Button>
            </div>

            <div>
              <Label htmlFor={`project-tags-${projIndex}`}>Tags (comma-separated)</Label>
              <Input id={`project-tags-${projIndex}`} value={(project.tags || []).join(', ')} onChange={(e) => handleProjectChange(projIndex, 'tags', e.target.value.split(',').map(tag => tag.trim()))} className="bg-input"/>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`project-live-${projIndex}`}>Live Demo URL</Label>
              <Input id={`project-live-${projIndex}`} value={project.liveUrl || ''} onChange={(e) => handleProjectChange(projIndex, 'liveUrl', e.target.value)} className="bg-input"/>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`project-showLive-${projIndex}`}
                  checked={project.showLiveUrlButton}
                  onCheckedChange={(checked) => handleProjectChange(projIndex, 'showLiveUrlButton', Boolean(checked))}
                />
                <Label htmlFor={`project-showLive-${projIndex}`} className="text-sm font-normal">Show Live Demo Button</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`project-source-${projIndex}`}>Source Code URL</Label>
              <Input id={`project-source-${projIndex}`} value={project.sourceUrl || ''} onChange={(e) => handleProjectChange(projIndex, 'sourceUrl', e.target.value)} className="bg-input"/>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`project-showSource-${projIndex}`}
                  checked={project.showSourceUrlButton}
                  onCheckedChange={(checked) => handleProjectChange(projIndex, 'showSourceUrlButton', Boolean(checked))}
                />
                <Label htmlFor={`project-showSource-${projIndex}`} className="text-sm font-normal">Show Source Code Button</Label>
              </div>
            </div>

            <Button variant="destructive" size="sm" onClick={() => handleRemoveProject(projIndex)} className="mt-3">
              <Trash2 className="mr-2 h-4 w-4" /> Remove Project
            </Button>
          </Card>
        ))}
        <Button variant="outline" onClick={handleAddProject} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>Reset to Default</Button>
      </CardFooter>
    </Card>
  );
}

function TestimonialsEditor() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS_DATA);
  const { toast } = useToast();
  const isInitialMount = useRef(true);

  useEffect(() => {
    const storedTestimonials = localStorage.getItem(LOCALSTORAGE_TESTIMONIALS_KEY);
    if (storedTestimonials) {
       try {
        setTestimonials(JSON.parse(storedTestimonials));
      } catch (e) {
        console.error("Error parsing testimonials from localStorage", e);
        setTestimonials(TESTIMONIALS_DATA);
        toast({ title: "Load Error", description: "Could not load saved testimonials, reset to default.", variant: "destructive" });
      }
    } else {
      setTestimonials(TESTIMONIALS_DATA);
    }
  }, [toast]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem(LOCALSTORAGE_TESTIMONIALS_KEY, JSON.stringify(testimonials));
  }, [testimonials]);

  const handleTestimonialChange = (index: number, field: keyof Testimonial, value: string) => {
    const updatedTestimonials = [...testimonials];
    updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value };
    setTestimonials(updatedTestimonials);
  };

  const handleAvatarFileChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleTestimonialChange(index, 'avatarUrl', reader.result as string);
        toast({ title: "Avatar Preview Ready", description: "Image updated." });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTestimonial = () => {
    setTestimonials([...testimonials, {
      id: `testimonial-${Date.now()}`,
      quote: '',
      author: '',
      role: '',
      company: '',
      avatarUrl: 'https://placehold.co/100x100.png',
      avatarHint: 'person',
    }]);
    toast({ title: "Testimonial Added", description: "New testimonial template added." });
  };

  const handleRemoveTestimonial = (index: number) => {
    setTestimonials(testimonials.filter((_, i) => i !== index));
    toast({ title: "Testimonial Removed", description: "Testimonial removed.", variant: "default" });
  };

  const handleReset = () => {
    setTestimonials(TESTIMONIALS_DATA);
    localStorage.removeItem(LOCALSTORAGE_TESTIMONIALS_KEY);
    toast({ title: "Reset Successful", description: "Testimonials data reset to default." });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Testimonials Editor</CardTitle>
        <CardDescription>Manage client and colleague testimonials. Changes are saved automatically. Avatar images are saved as Data URIs.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {testimonials.map((testimonial, index) => (
          <Card key={testimonial.id} className="p-4 bg-secondary/20 space-y-3">
            <div>
              <Label htmlFor={`testimonial-quote-${index}`}>Quote</Label>
              <Textarea id={`testimonial-quote-${index}`} value={testimonial.quote} onChange={(e) => handleTestimonialChange(index, 'quote', e.target.value)} rows={3} className="bg-input"/>
            </div>
            <div>
              <Label htmlFor={`testimonial-author-${index}`}>Author</Label>
              <Input id={`testimonial-author-${index}`} value={testimonial.author} onChange={(e) => handleTestimonialChange(index, 'author', e.target.value)} className="bg-input"/>
            </div>
            <div>
              <Label htmlFor={`testimonial-role-${index}`}>Role</Label>
              <Input id={`testimonial-role-${index}`} value={testimonial.role} onChange={(e) => handleTestimonialChange(index, 'role', e.target.value)} className="bg-input"/>
            </div>
            <div>
              <Label htmlFor={`testimonial-company-${index}`}>Company (Optional)</Label>
              <Input id={`testimonial-company-${index}`} value={testimonial.company || ''} onChange={(e) => handleTestimonialChange(index, 'company', e.target.value)} className="bg-input"/>
            </div>
            <div>
              <Label htmlFor={`testimonial-avatar-${index}`}>Avatar Image</Label>
              <Input id={`testimonial-avatar-${index}`} type="file" accept="image/*" onChange={(e) => handleAvatarFileChange(index, e)} className="bg-input"/>
               <p className="text-xs text-muted-foreground mt-1">
                <Crop className="inline-block h-3 w-3 mr-1" />
                Recommended: 1:1 aspect ratio (e.g., 100x100).
              </p>
              {testimonial.avatarUrl && (
                <div className="mt-2 relative w-24 h-24">
                  <Image src={testimonial.avatarUrl} alt="Avatar Preview" fill className="rounded-full object-cover"/>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor={`testimonial-avatarhint-${index}`}>Avatar AI Hint (1-2 words)</Label>
              <Input id={`testimonial-avatarhint-${index}`} value={testimonial.avatarHint || ""} onChange={(e) => handleTestimonialChange(index, 'avatarHint', e.target.value)} className="bg-input"/>
            </div>
            <Button variant="destructive" size="sm" onClick={() => handleRemoveTestimonial(index)} className="mt-3">
              <Trash2 className="mr-2 h-4 w-4" /> Remove Testimonial
            </Button>
          </Card>
        ))}
        <Button variant="outline" onClick={handleAddTestimonial} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Testimonial
        </Button>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>Reset to Default</Button>
      </CardFooter>
    </Card>
  );
}


function ContactEditor() {
  const [contactInfo, setContactInfo] = useState<ContactDetails>(CONTACT_INFO);
  const { toast } = useToast();
  const isInitialMount = useRef(true);

  useEffect(() => {
    const storedContactInfo = localStorage.getItem(LOCALSTORAGE_CONTACT_KEY);
    if (storedContactInfo) {
       try {
        const parsedInfo = JSON.parse(storedContactInfo);
        if (parsedInfo.phone && !parsedInfo.whatsappNumber) {
            parsedInfo.whatsappNumber = parsedInfo.phone;
        }
        setContactInfo(parsedInfo);
      } catch (e) {
        console.error("Error parsing contact info from localStorage", e);
        setContactInfo(CONTACT_INFO); 
        toast({ title: "Load Error", description: "Could not load saved contact info, reset to default.", variant: "destructive" });
      }
    } else {
      setContactInfo(CONTACT_INFO); 
    }
  }, [toast]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem(LOCALSTORAGE_CONTACT_KEY, JSON.stringify(contactInfo));
  }, [contactInfo]);

  const handleChange = (field: keyof ContactDetails | `socials.${keyof ContactDetails['socials']}`, value: string) => {
    if (field.startsWith('socials.')) {
      const socialKey = field.split('.')[1] as keyof ContactDetails['socials'];
      setContactInfo(prev => ({
        ...prev,
        socials: { ...prev.socials, [socialKey]: value }
      }));
    } else {
      setContactInfo(prev => ({ ...prev, [field as keyof ContactDetails]: value }));
    }
  };

  const handleReset = () => {
    setContactInfo(CONTACT_INFO);
    localStorage.removeItem(LOCALSTORAGE_CONTACT_KEY);
    toast({ title: "Reset Successful", description: "Contact info reset to default." });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Contact Information Editor</CardTitle>
        <CardDescription>Edit contact details and social media links. Changes are saved automatically.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" value={contactInfo.email} onChange={e => handleChange('email', e.target.value)} className="bg-input"/>
        </div>
        <div>
          <Label htmlFor="contact-whatsapp">WhatsApp Number</Label>
          <Input
            id="contact-whatsapp"
            value={contactInfo.whatsappNumber}
            onChange={e => handleChange('whatsappNumber', e.target.value)}
            className="bg-input"
            placeholder="e.g., 15551234567 (country code + number)"
          />
        </div>
        <div>
          <Label htmlFor="contact-location">Location</Label>
          <Input id="contact-location" value={contactInfo.location} onChange={e => handleChange('location', e.target.value)} className="bg-input"/>
        </div>
        <h4 className="font-medium pt-2">Social Links</h4>
        <div>
          <Label htmlFor="contact-github">GitHub URL</Label>
          <Input id="contact-github" value={contactInfo.socials.github} onChange={e => handleChange('socials.github', e.target.value)} className="bg-input"/>
        </div>
        <div>
          <Label htmlFor="contact-linkedin">LinkedIn URL</Label>
          <Input id="contact-linkedin" value={contactInfo.socials.linkedin} onChange={e => handleChange('socials.linkedin', e.target.value)} className="bg-input"/>
        </div>
        <div>
          <Label htmlFor="contact-twitter">Twitter URL</Label>
          <Input id="contact-twitter" value={contactInfo.socials.twitter} onChange={e => handleChange('socials.twitter', e.target.value)} className="bg-input"/>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>Reset to Default</Button>
      </CardFooter>
    </Card>
  );
}

function HeaderNavEditor() {
  const [navItems, setNavItems] = useState<NavItem[]>(HEADER_NAV_ITEMS_DATA);
  const { toast } = useToast();
  const isInitialMount = useRef(true);

  useEffect(() => {
    const storedNavItems = localStorage.getItem(LOCALSTORAGE_HEADER_NAV_KEY);
    if (storedNavItems) {
      try {
        setNavItems(JSON.parse(storedNavItems));
      } catch (e) {
         console.error("Error parsing nav items from localStorage", e);
        setNavItems(HEADER_NAV_ITEMS_DATA);
        toast({ title: "Load Error", description: "Could not load saved navigation items, reset to default.", variant: "destructive" });
      }
    } else {
      setNavItems(HEADER_NAV_ITEMS_DATA);
    }
  }, [toast]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem(LOCALSTORAGE_HEADER_NAV_KEY, JSON.stringify(navItems));
  }, [navItems]);

  const handleNavItemChange = (index: number, field: keyof NavItem, value: string | boolean) => {
    const updatedNavItems = [...navItems];
     if (field === 'isExternal') {
      updatedNavItems[index] = { ...updatedNavItems[index], [field]: Boolean(value) };
    } else {
      updatedNavItems[index] = { ...updatedNavItems[index], [field]: String(value) };
    }
    setNavItems(updatedNavItems);
  };

  const handleAddNavItem = () => {
    setNavItems([...navItems, { name: 'New Item', href: '#', isExternal: false }]);
    toast({ title: "Nav Item Added", description: "A new navigation item has been added." });
  };

  const handleRemoveNavItem = (index: number) => {
    setNavItems(navItems.filter((_, i) => i !== index));
    toast({ title: "Nav Item Removed", description: "Navigation item removed." });
  };

  const handleReset = () => {
    setNavItems(HEADER_NAV_ITEMS_DATA);
    localStorage.removeItem(LOCALSTORAGE_HEADER_NAV_KEY);
    toast({ title: "Reset Successful", description: "Header navigation items reset to default." });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Header Navigation Editor</CardTitle>
        <CardDescription>Edit the text, links, and target for the main site navigation. Changes are saved automatically.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {navItems.map((item, index) => (
          <Card key={`navitem-${index}`} className="p-4 bg-secondary/20 space-y-3">
            <div>
              <Label htmlFor={`navitem-name-${index}`}>Item Name</Label>
              <Input
                id={`navitem-name-${index}`}
                value={item.name}
                onChange={(e) => handleNavItemChange(index, 'name', e.target.value)}
                className="bg-input"
              />
            </div>
            <div>
              <Label htmlFor={`navitem-href-${index}`}>Link (href)</Label>
              <Input
                id={`navitem-href-${index}`}
                value={item.href}
                onChange={(e) => handleNavItemChange(index, 'href', e.target.value)}
                className="bg-input"
                placeholder="e.g., #about, /blog, or https://example.com"
              />
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                  id={`navitem-external-${index}`}
                  checked={item.isExternal || false}
                  onCheckedChange={(checked) => handleNavItemChange(index, 'isExternal', Boolean(checked))}
                />
                <Label htmlFor={`navitem-external-${index}`} className="text-sm font-normal">Open in new tab (External Link)</Label>
            </div>
            <Button variant="destructive" size="sm" onClick={() => handleRemoveNavItem(index)} className="mt-2">
              <Trash2 className="mr-2 h-4 w-4" /> Remove Item
            </Button>
          </Card>
        ))}
         <Button variant="outline" onClick={handleAddNavItem} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Navigation Item
        </Button>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>Reset to Default</Button>
      </CardFooter>
    </Card>
  );
}


function MessagesManager() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [newMessage, setNewMessage] = useState({ name: '', email: '', message: '' });
  const [overallSummary, setOverallSummary] = useState<string | null>(null);
  const [isLoadingOverallSummary, setIsLoadingOverallSummary] = useState(false);
  const { toast } = useToast();

  const [isLoadingIndividualSummary, setIsLoadingIndividualSummary] = useState<string | null>(null);
  const [individualSummaries, setIndividualSummaries] = useState<Record<string, string>>({});

  useEffect(() => {
    const storedMessages = localStorage.getItem(LOCALSTORAGE_MESSAGES_KEY);
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        parsedMessages.sort((a: AdminMessage, b: AdminMessage) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
        setMessages(parsedMessages);
      } catch (e) {
        console.error("Error parsing messages from localStorage", e);
        setMessages([]);
        toast({ title: "Load Error", description: "Could not load saved messages, cleared local messages.", variant: "destructive" });
      }
    }
  }, [toast]);

  const handleSaveMessages = (updatedMessages: AdminMessage[]) => {
    updatedMessages.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
    localStorage.setItem(LOCALSTORAGE_MESSAGES_KEY, JSON.stringify(updatedMessages));
    setMessages(updatedMessages);
  };

  const handleAddMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.name || !newMessage.email || !newMessage.message) {
      toast({ title: "Missing fields", description: "Please fill in all fields for the message.", variant: "destructive" });
      return;
    }
    const messageToAdd: AdminMessage = {
      ...newMessage,
      id: `msg-${Date.now()}`,
      receivedAt: new Date().toISOString(),
    };
    const updatedMessages = [messageToAdd, ...messages];
    handleSaveMessages(updatedMessages);
    setNewMessage({ name: '', email: '', message: '' });
    toast({ title: "Message Added", description: "Mock message saved to local storage." });
  };

  const handleRemoveMessage = (id: string) => {
    const updatedMessages = messages.filter(msg => msg.id !== id);
    handleSaveMessages(updatedMessages);
    setIndividualSummaries(prev => {
      const newSummaries = {...prev};
      delete newSummaries[id];
      return newSummaries;
    });
    toast({ title: "Message Removed", variant: "default" });
  };

  const handleClearAllMessages = () => {
    handleSaveMessages([]);
    setOverallSummary(null);
    setIndividualSummaries({});
    toast({ title: "All Messages Cleared", description: "All mock messages have been removed from local storage.", variant: "default" });
  };

  const handleSummarizeAll = async () => {
    if (messages.length === 0) {
      toast({ title: "No Messages", description: "Add some messages before summarizing.", variant: "default" });
      return;
    }
    setIsLoadingOverallSummary(true);
    setOverallSummary(null);
    try {
      const input: SummarizeMessagesInput = { messages };
      const result = await summarizeMessages(input);
      setOverallSummary(result.summary);
      toast({ title: "AI Overall Summary Generated!", description: "Messages summarized successfully.", variant: "default" });
    } catch (error: any) {
      console.error("Error summarizing all messages:", error);
      let errorMessage = "Could not generate overall summary.";
      if (error && typeof error.message === 'string') {
          errorMessage = error.message;
      }
      setOverallSummary(`Error: ${errorMessage}`);
      toast({ title: "AI Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoadingOverallSummary(false);
    }
  };

  const handleSummarizeSingle = async (message: AdminMessage) => {
    if (!message.message.trim()) {
      toast({ title: "No Content", description: "This message has no content to summarize.", variant: "default" });
      return;
    }
    setIsLoadingIndividualSummary(message.id);
    try {
      const input: SummarizeSingleMessageInput = {
        messageContent: message.message,
        senderName: message.name,
      };
      const result = await summarizeSingleMessage(input);
      setIndividualSummaries(prev => ({ ...prev, [message.id]: result.summary }));
      toast({ title: "AI Quick Summary Generated!", description: `Summary for message from ${message.name} created.`, variant: "default" });
    } catch (error: any) {
      console.error(`Error summarizing message ${message.id}:`, error);
      let errorMessage = "Could not generate quick summary for this message.";
       if (error && typeof error.message === 'string') {
          errorMessage = error.message;
      }
      setIndividualSummaries(prev => ({ ...prev, [message.id]: `Error: ${errorMessage}` }));
      toast({ title: "AI Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoadingIndividualSummary(null);
    }
  };


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Messages & AI Summaries</CardTitle>
        <CardDescription>Manage mock user messages. Use AI to summarize all messages or individual ones. Data is saved locally.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAddMessage} className="p-4 border rounded-lg space-y-3 bg-secondary/20">
          <h4 className="text-lg font-medium text-foreground">Add New Mock Message</h4>
          <div>
            <Label htmlFor="msg-name">Name</Label>
            <Input id="msg-name" value={newMessage.name} onChange={e => setNewMessage({...newMessage, name: e.target.value})} placeholder="John Doe" className="bg-input"/>
          </div>
          <div>
            <Label htmlFor="msg-email">Email</Label>
            <Input id="msg-email" type="email" value={newMessage.email} onChange={e => setNewMessage({...newMessage, email: e.target.value})} placeholder="john@example.com" className="bg-input"/>
          </div>
          <div>
            <Label htmlFor="msg-content">Message</Label>
            <Textarea id="msg-content" value={newMessage.message} onChange={e => setNewMessage({...newMessage, message: e.target.value})} placeholder="Inquiry about project..." rows={3} className="bg-input"/>
          </div>
          <Button type="submit" size="sm"><PlusCircle className="mr-2 h-4 w-4"/> Add Message</Button>
        </form>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <h4 className="text-lg font-medium text-foreground">Current Messages ({messages.length})</h4>
            <div className="flex gap-2 flex-wrap">
              {messages.length > 0 && (
                 <Button onClick={handleSummarizeAll} disabled={isLoadingOverallSummary || messages.length === 0} size="sm">
                    <BotMessageSquare className="mr-2 h-4 w-4" />
                    {isLoadingOverallSummary ? "Summarizing All..." : "Summarize All with AI"}
                </Button>
              )}
              {messages.length > 0 && (
                <Button variant="outline" onClick={handleClearAllMessages} size="sm">
                  <Trash2 className="mr-2 h-4 w-4"/> Clear All Messages
                </Button>
              )}
            </div>
          </div>
          {overallSummary && (
            <Alert className="bg-primary/10 border-primary/50">
                <Sparkles className="h-5 w-5 text-primary" />
                <AlertTitle className="text-primary">AI Overall Summary:</AlertTitle>
                <AlertDescription className="text-foreground whitespace-pre-wrap text-sm">{overallSummary}</AlertDescription>
            </Alert>
          )}

          {messages.length === 0 && <p className="text-muted-foreground">No messages yet. Add some using the form above.</p>}
          <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2">
            {messages.map(msg => (
              <Card key={msg.id} className="p-3 bg-card shadow-md">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-muted-foreground"><strong>From:</strong> {msg.name} ({msg.email})</p>
                        <p className="text-xs text-muted-foreground"><strong>Received:</strong> {new Date(msg.receivedAt).toLocaleString()}</p>
                    </div>
                    <Button variant="ghost" size="xs" onClick={() => handleRemoveMessage(msg.id)} className="text-destructive hover:text-destructive/80 p-1">
                        <Trash2 className="h-4 w-4"/>
                    </Button>
                </div>
                <p className="mt-2 text-foreground whitespace-pre-wrap text-sm">{msg.message}</p>

                <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleSummarizeSingle(msg)}
                    disabled={isLoadingIndividualSummary === msg.id}
                    className="mt-3 text-xs"
                >
                    {isLoadingIndividualSummary === msg.id ? <RefreshCw className="mr-1 h-3 w-3 animate-spin"/> : <Sparkles className="mr-1 h-3 w-3"/>}
                    {isLoadingIndividualSummary === msg.id ? "Summarizing..." : "AI Quick Summary"}
                </Button>

                {individualSummaries[msg.id] && (
                    <Card className="mt-2 p-3 bg-secondary/30 border-secondary/50">
                        <CardTitle className="text-xs font-medium text-primary mb-1 flex items-center">
                            <Sparkles className="h-3 w-3 mr-1.5"/> AI Quick Summary
                        </CardTitle>
                        <CardDescription className="text-xs text-foreground whitespace-pre-wrap">
                            {individualSummaries[msg.id]}
                        </CardDescription>
                    </Card>
                )}
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type AIContentBlockType = 'hero' | 'about' | 'service' | 'project' | 'section_structure';

interface AIOutput {
  title?: string;
  text?: string;
  json?: string;
}

function AIContentIdeasGenerator() {
  const [blockType, setBlockType] = useState<AIContentBlockType>('hero');
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [output, setOutput] = useState<AIOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | string[]) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setOutput(null);
    try {
      let result: any;
      if (blockType === 'hero') {
        const heroInput: GenerateHeroTextInput = {
          topic: inputs.topic || 'Atif R.',
          keywords: inputs.keywords?.split(',').map((k: string) => k.trim()) || KEY_SKILLS.slice(0,3),
          tone: inputs.tone || 'engaging',
          roleFocus: inputs.roleFocus || 'Full-Stack Developer',
        };
        result = await generateHeroText(heroInput);
        setOutput({ title: "Generated Hero Text", json: JSON.stringify(result, null, 2) });
      } else if (blockType === 'about') {
        const aboutInput: GenerateAboutTextInput = {
          currentText: inputs.currentText || '',
          keywords: inputs.keywords?.split(',').map((k: string) => k.trim()) || KEY_SKILLS.slice(0,5),
          tone: inputs.tone || 'professional',
        };
        result = await generateAboutText(aboutInput);
        setOutput({ title: "Generated About Paragraph", text: result.suggestedText });
      } else if (blockType === 'service') {
        const serviceInput: GenerateServiceItemInput = {
          serviceFocus: inputs.serviceFocus || 'Web Development',
          targetAudience: inputs.targetAudience || '',
          keyBenefits: inputs.keyBenefits?.split(',').map((k: string) => k.trim()) || [],
          tone: inputs.tone || 'professional',
        };
        result = await generateServiceItem(serviceInput);
        setOutput({ title: "Generated Service Item", json: JSON.stringify(result, null, 2) });
      } else if (blockType === 'project') {
        const projectInput: GenerateProjectHighlightInput = {
          projectCategory: inputs.projectCategory || 'E-commerce Platform',
          coreTechnologies: inputs.coreTechnologies?.split(',').map((k: string) => k.trim()) || [],
          uniqueSellingPoints: inputs.uniqueSellingPoints?.split(',').map((k: string) => k.trim()) || [],
          clientIndustry: inputs.clientIndustry || '',
        };
        result = await generateProjectHighlight(projectInput);
        setOutput({ title: "Generated Project Highlight", json: JSON.stringify(result, null, 2) });
      } else if (blockType === 'section_structure') {
        const sectionInput: SuggestSectionStructureInput = {
          sectionTopic: inputs.sectionTopic || 'A new portfolio section',
          targetAudience: inputs.targetAudience || '',
          desiredTone: inputs.desiredTone || 'professional',
          keyElementsToInclude: inputs.keyElementsToInclude?.split(',').map((k: string) => k.trim()) || [],
        };
        result = await suggestSectionStructure(sectionInput);
        setOutput({ title: "Generated Section Structure Suggestion", json: JSON.stringify(result, null, 2) });
      }
      toast({ title: "AI Content Generated!", description: `Content for ${blockType.replace('_', ' ')} generated successfully.` });
    } catch (error) {
      console.error(`Error generating AI content for ${blockType}:`, error);
      toast({ title: "AI Error", description: `Could not generate content for ${blockType.replace('_', ' ')}. Please try again.`, variant: "destructive" });
      setOutput({ title: `Error generating ${blockType.replace('_', ' ')} content`, text: "An error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputs = () => {
    switch (blockType) {
      case 'hero':
        return (
          <>
            <Input placeholder="Topic (e.g., Atif R.)" value={inputs.topic || ''} onChange={e => handleInputChange('topic', e.target.value)} className="bg-input" />
            <Input placeholder="Keywords (comma-separated, e.g., Full-Stack,UI/UX)" value={inputs.keywords || ''} onChange={e => handleInputChange('keywords', e.target.value)} className="bg-input" />
            <Input placeholder="Primary Role Focus (e.g., Graphics Designer)" value={inputs.roleFocus || ''} onChange={e => handleInputChange('roleFocus', e.target.value)} className="bg-input" />
            <Select value={inputs.tone || 'engaging'} onValueChange={value => handleInputChange('tone', value)}>
              <SelectTrigger className="bg-input"><SelectValue placeholder="Select Tone" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="engaging">Engaging</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="innovative">Innovative</SelectItem>
              </SelectContent>
            </Select>
          </>
        );
      case 'about':
        return (
          <>
            <Textarea placeholder="Current text (optional, for refinement)" value={inputs.currentText || ''} onChange={e => handleInputChange('currentText', e.target.value)} className="bg-input" rows={3}/>
            <Input placeholder="Keywords (comma-separated)" value={inputs.keywords || ''} onChange={e => handleInputChange('keywords', e.target.value)} className="bg-input" />
            <Select value={inputs.tone || 'professional'} onValueChange={value => handleInputChange('tone', value)}>
              <SelectTrigger className="bg-input"><SelectValue placeholder="Select Tone" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="innovative">Innovative</SelectItem>
              </SelectContent>
            </Select>
          </>
        );
      case 'service':
        return (
          <>
            <Input placeholder="Service Focus (e.g., Web Development)" value={inputs.serviceFocus || ''} onChange={e => handleInputChange('serviceFocus', e.target.value)} className="bg-input" />
            <Input placeholder="Target Audience (optional)" value={inputs.targetAudience || ''} onChange={e => handleInputChange('targetAudience', e.target.value)} className="bg-input" />
            <Input placeholder="Key Benefits (comma-separated)" value={inputs.keyBenefits || ''} onChange={e => handleInputChange('keyBenefits', e.target.value)} className="bg-input" />
             <Select value={inputs.tone || 'professional'} onValueChange={value => handleInputChange('tone', value)}>
              <SelectTrigger className="bg-input"><SelectValue placeholder="Select Tone" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="approachable">Approachable</SelectItem>
              </SelectContent>
            </Select>
          </>
        );
      case 'project':
        return (
          <>
            <Input placeholder="Project Category (e.g., E-commerce Platform)" value={inputs.projectCategory || ''} onChange={e => handleInputChange('projectCategory', e.target.value)} className="bg-input" />
            <Input placeholder="Core Technologies (comma-separated)" value={inputs.coreTechnologies || ''} onChange={e => handleInputChange('coreTechnologies', e.target.value)} className="bg-input" />
            <Input placeholder="Unique Selling Points (comma-separated)" value={inputs.uniqueSellingPoints || ''} onChange={e => handleInputChange('uniqueSellingPoints', e.target.value)} className="bg-input" />
            <Input placeholder="Client Industry (optional)" value={inputs.clientIndustry || ''} onChange={e => handleInputChange('clientIndustry', e.target.value)} className="bg-input" />
          </>
        );
      case 'section_structure':
        return (
          <>
            <Textarea placeholder="Main topic or purpose of the section (e.g., Showcase my AI skills)" value={inputs.sectionTopic || ''} onChange={e => handleInputChange('sectionTopic', e.target.value)} className="bg-input" rows={2}/>
            <Input placeholder="Target Audience (optional, e.g., Startups)" value={inputs.targetAudience || ''} onChange={e => handleInputChange('targetAudience', e.target.value)} className="bg-input" />
            <Select value={inputs.desiredTone || 'professional'} onValueChange={value => handleInputChange('desiredTone', value)}>
              <SelectTrigger className="bg-input"><SelectValue placeholder="Select Desired Tone" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Key elements to include (comma-separated, optional)" value={inputs.keyElementsToInclude || ''} onChange={e => handleInputChange('keyElementsToInclude', e.target.value)} className="bg-input" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Content Ideas Generator</CardTitle>
        <CardDescription>Generate content snippets or section structure ideas for your portfolio. The output can be copied and adapted.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="block-type-select">Content / Structure Type</Label>
          <Select value={blockType} onValueChange={(value) => { setBlockType(value as AIContentBlockType); setInputs({}); setOutput(null); }}>
            <SelectTrigger id="block-type-select" className="bg-input">
              <SelectValue placeholder="Select block type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hero">Hero Text Block</SelectItem>
              <SelectItem value="about">About Paragraph Block</SelectItem>
              <SelectItem value="service">Service Item Block</SelectItem>
              <SelectItem value="project">Project Highlight Block</SelectItem>
              <SelectItem value="section_structure">Section Structure Suggestion</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 p-4 border rounded-md bg-secondary/20">
          <h4 className="font-medium">Inputs for {blockType.replace('_', ' ').charAt(0).toUpperCase() + blockType.replace('_', ' ').slice(1)}:</h4>
          {renderInputs()}
        </div>

        <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? `Generating ${blockType.replace('_', ' ')}...` : `Generate ${blockType.replace('_', ' ').charAt(0).toUpperCase() + blockType.replace('_', ' ').slice(1)}`}
        </Button>

        {output && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg text-primary">{output.title || "Generated Output"}</CardTitle>
            </CardHeader>
            <CardContent>
              {output.text && <p className="whitespace-pre-wrap text-sm">{output.text}</p>}
              {output.json && <Textarea value={output.json} readOnly rows={15} className="bg-input/50 text-xs font-mono" />}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}

function SmtpConfigViewer() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>SMTP Configuration Viewer</CardTitle>
        <CardDescription>
          Displays information about the email sending configuration.
          Sensitive details like passwords are managed securely on the server and are not shown here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 border rounded-lg bg-secondary/20">
          <h4 className="text-lg font-medium text-foreground mb-2">Email Sending Status</h4>
          <p className="text-sm text-muted-foreground">
            The email system uses SMTP settings defined in the server's environment variables (`.env` file).
            This ensures your credentials remain secure. Email sending is active if all required SMTP variables are set.
          </p>
        </div>
        <div className="p-4 border rounded-lg bg-secondary/20">
          <h4 className="text-lg font-medium text-foreground mb-2">Key Configuration Points (from Server Environment)</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li><strong>SMTP Host, Port, User, Password, Secure Flag:</strong> Set via server environment variables. Not displayed here for security.</li>
            <li><strong>Default "From" Address for System Emails (`EMAIL_FROM`):</strong> All emails sent by the system (e.g., inquiry confirmations) will originate from this address.</li>
            <li><strong>Admin Notification Recipient (`ADMIN_EMAIL`):</strong> Admin notifications for new inquiries are sent to this email address.</li>
          </ul>
           <p className="text-xs text-muted-foreground mt-2">
            If these environment variables are not set correctly on the server, email functionality will not work.
          </p>
        </div>
         <div className="p-4 border rounded-lg bg-secondary/20">
          <h4 className="text-lg font-medium text-foreground mb-2">To Change SMTP Settings:</h4>
           <p className="text-sm text-muted-foreground">
            You need to update the `.env` file on your server and restart the application.
            Direct editing of these settings from the admin panel is not permitted for security reasons.
          </p>
        </div>
      </CardContent>
       <CardFooter>
        <p className="text-xs text-muted-foreground">
          This viewer provides a high-level overview. For detailed SMTP setup, refer to your server configuration and the `.env` file.
        </p>
      </CardFooter>
    </Card>
  );
}

function AdminMailSender() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [aiUserPrompt, setAiUserPrompt] = useState('');
  const [aiTone, setAiTone] = useState<GenerateEmailContentInput['tone']>('professional');
  const [aiLength, setAiLength] = useState<GenerateEmailContentInput['lengthHint']>('medium');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const handleGenerateEmailWithAI = async () => {
    if (!aiUserPrompt.trim()) {
      toast({ title: "Prompt Required", description: "Please enter your core message for the AI.", variant: "destructive" });
      return;
    }
    setIsAiGenerating(true);
    try {
      const input: GenerateEmailContentInput = {
        userPrompt: aiUserPrompt,
        tone: aiTone,
        lengthHint: aiLength,
      };
      const result = await generateEmailContent(input);
      setBody(result.suggestedHtmlBody);
      toast({ title: "AI Email Content Generated!", description: "The email body has been updated." });
      setIsAiDialogOpen(false);
      setAiUserPrompt('');
    } catch (error) {
      console.error("Error generating email content with AI:", error);
      toast({ title: "AI Error", description: "Could not generate email content. Please try again.", variant: "destructive" });
    } finally {
      setIsAiGenerating(false);
    }
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!to || !subject || !body) {
      toast({ title: "Missing Fields", description: "Please fill in To, Subject, and Message Body.", variant: "destructive" });
      return;
    }
    setIsSending(true);
    try {
      const result = await sendAdminComposedEmail({ to, subject, htmlBody: body });
      if (result.success) {
        toast({ title: "Email Sent!", description: `Successfully sent email to ${to}.` });
        setTo('');
        setSubject('');
        setBody('');
      } else {
        toast({ title: "Email Error", description: result.error || "Failed to send email. Check server logs.", variant: "destructive" });
      }
    } catch (error: any) {
      console.error("Error sending admin email:", error);
      toast({ title: "Email Error", description: error.message || "An unexpected error occurred. Please try again.", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Compose & Send Email</CardTitle>
        <CardDescription>
          Send an email directly from the admin panel. The email will be sent using the website's configured SMTP settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="mail-to">To:</Label>
            <Input
              id="mail-to"
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              required
              className="bg-input"
            />
          </div>
          <div>
            <Label htmlFor="mail-subject">Subject:</Label>
            <Input
              id="mail-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email Subject"
              required
              className="bg-input"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="mail-body">Message Body (HTML):</Label>
              <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" size="sm">
                    <Sparkles className="mr-2 h-4 w-4" /> Compose with AI
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-card">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Compose Email Body with AI</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Provide a prompt and select a tone, and AI will help draft the email body.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="ai-user-prompt" className="text-foreground">What do you want to say? (AI Prompt)</Label>
                      <Textarea
                        id="ai-user-prompt"
                        value={aiUserPrompt}
                        onChange={(e) => setAiUserPrompt(e.target.value)}
                        placeholder="e.g., Follow up on our last meeting, propose new project X..."
                        rows={3}
                        className="bg-input mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ai-tone" className="text-foreground">Tone</Label>
                      <Select value={aiTone} onValueChange={(v) => setAiTone(v as any)}>
                        <SelectTrigger id="ai-tone" className="bg-input mt-1">
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="concise">Concise</SelectItem>
                          <SelectItem value="persuasive">Persuasive</SelectItem>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="informal">Informal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                     <div>
                      <Label htmlFor="ai-length" className="text-foreground">Approximate Length</Label>
                      <Select value={aiLength} onValueChange={(v) => setAiLength(v as any)}>
                        <SelectTrigger id="ai-length" className="bg-input mt-1">
                          <SelectValue placeholder="Select length" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="long">Long</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" onClick={handleGenerateEmailWithAI} disabled={isAiGenerating}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      {isAiGenerating ? "Generating..." : "Generate Body"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Textarea
              id="mail-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type your HTML message here, or use AI to compose..."
              rows={10}
              required
              className="bg-input font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground mt-1">Enter raw HTML. Use &lt;br/&gt; for line breaks. AI generator will also produce HTML.</p>
          </div>
          <Button type="submit" disabled={isSending} className="w-full">
            <Send className="mr-2 h-4 w-4" />
            {isSending ? "Sending..." : "Send Email"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}


function EmailTemplatesEditor() {
  const [templates, setTemplates] = useState<EmailTemplates>(DEFAULT_EMAIL_TEMPLATES);
  const { toast } = useToast();
  const isInitialMount = useRef(true);

  useEffect(() => {
    const storedTemplates = localStorage.getItem(LOCALSTORAGE_EMAIL_TEMPLATES_KEY);
    if (storedTemplates) {
      try {
        setTemplates(JSON.parse(storedTemplates));
      } catch (e) {
        console.error("Error parsing email templates from localStorage", e);
        setTemplates(DEFAULT_EMAIL_TEMPLATES);
        toast({ title: "Load Error", description: "Could not load saved email templates, reset to default from constants.ts.", variant: "destructive" });
      }
    } else {
      setTemplates(DEFAULT_EMAIL_TEMPLATES);
    }
  }, [toast]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem(LOCALSTORAGE_EMAIL_TEMPLATES_KEY, JSON.stringify(templates));
  }, [templates]);

  const handleTemplateChange = (templateName: keyof EmailTemplates, value: string) => {
    setTemplates(prev => ({ ...prev, [templateName]: value }));
  };

  const handleReset = () => {
    setTemplates(DEFAULT_EMAIL_TEMPLATES);
    localStorage.removeItem(LOCALSTORAGE_EMAIL_TEMPLATES_KEY);
    toast({ title: "Reset Successful", description: "Email templates reset to default values." });
  };

  const availablePlaceholders = [
    { name: "{{siteName}}", desc: "Your website's name (from send-inquiry-email.ts)." },
    { name: "{{currentYear}}", desc: "The current year (from send-inquiry-email.ts)." },
    { name: "{{userName}}", desc: "The name of the person who submitted the form." },
    { name: "{{userEmail}}", desc: "The email of the person who submitted the form." },
    { name: "{{userMessageHTML}}", desc: "HTML version of general contact message (newlines converted to <br/>)." },
    { name: "{{projectTitleForEmail}}", desc: "The project title for service inquiries (or 'our services')." },
    { name: "{{clientProjectIdeaHTML}}", desc: "HTML version of client's project idea (user confirmation email; newlines to <br/>)." },
    { name: "{{aiSuggestedProjectIdeasHTML}}", desc: "HTML block for AI suggested project ideas (admin notification; newlines to <br/>)." },
    { name: "{{aiGeneratedSummaryHTML}}", desc: "HTML block for AI generated summary of user's message/idea (user and admin emails; newlines to <br/>)." },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Email Template Editor</CardTitle>
        <CardDescription className="space-y-1">
          <div>
            Customize the HTML templates for emails sent by the system. Changes are saved automatically.
          </div>
          <div className="font-semibold text-primary/90 p-2 border border-primary/30 rounded-md bg-primary/10">
            <MessageCircleQuestion className="inline-block h-4 w-4 mr-1 text-primary"/>
            <strong>Important Workflow:</strong> To make these templates live for actual emails, you must:
            <ol className="list-decimal list-inside ml-4 mt-1 text-sm">
              <li>Edit and save templates here (they are stored in your browser).</li>
              <li>Manually copy the HTML from each textarea below.</li>
              <li>Paste it into the corresponding HTML string variable within the <code className="text-xs bg-muted p-1 rounded">src/app/actions/send-inquiry-email.ts</code> file on your server.</li>
              <li>Redeploy your application for the changes to take effect on the server.</li>
            </ol>
            This editor helps you design and manage the templates locally before updating the server code.
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h4 className="font-medium text-lg mb-2">Available Placeholders:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground columns-1 md:columns-2">
            {availablePlaceholders.map(p => <li key={p.name}><strong>{p.name}</strong>: {p.desc}</li>)}
          </ul>
           <p className="text-xs text-primary/80 mt-2">
             Note: The actual replacement logic is in `send-inquiry-email.ts`.
           </p>
        </div>

        {(Object.keys(templates) as Array<keyof EmailTemplates>).map((templateName) => (
          <div key={templateName} className="space-y-2">
            <Label htmlFor={`template-${templateName}`} className="text-base font-semibold capitalize">
              {templateName.replace(/([A-Z])/g, ' $1').replace(/HTML$/, '').trim()} Template
            </Label>
            <Textarea
              id={`template-${templateName}`}
              value={templates[templateName]}
              onChange={(e) => handleTemplateChange(templateName, e.target.value)}
              rows={15}
              className="bg-input text-foreground border-border focus:ring-primary font-mono text-xs"
              placeholder={`Enter HTML for ${templateName.replace(/([A-Z])/g, ' $1').trim()}...`}
            />
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>Reset to Defaults</Button>
      </CardFooter>
    </Card>
  );
}

function SiteSettingsEditor() {
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(DEFAULT_SITE_INFO);
  const { toast } = useToast();
  const isInitialMount = useRef(true);

  useEffect(() => {
    const storedSiteInfo = localStorage.getItem(LOCALSTORAGE_SITE_INFO_KEY);
    if (storedSiteInfo) {
      try {
        setSiteInfo(JSON.parse(storedSiteInfo));
      } catch (e) {
        console.error("Error parsing site info from localStorage", e);
        setSiteInfo(DEFAULT_SITE_INFO);
        toast({ title: "Load Error", description: "Could not load site settings, reset to default.", variant: "destructive" });
      }
    } else {
      setSiteInfo(DEFAULT_SITE_INFO);
    }
  }, [toast]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem(LOCALSTORAGE_SITE_INFO_KEY, JSON.stringify(siteInfo));
  }, [siteInfo]);


  const handleChange = (field: keyof SiteInfo, value: string) => {
    setSiteInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setSiteInfo(DEFAULT_SITE_INFO);
    localStorage.removeItem(LOCALSTORAGE_SITE_INFO_KEY);
    toast({ title: "Reset Successful", description: "Site settings reset to default." });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Site Information & SEO Settings</CardTitle>
        <CardDescription>
          Manage general website information and default SEO settings. These settings are saved automatically and applied dynamically.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="websiteName">Website Name</Label>
          <Input
            id="websiteName"
            value={siteInfo.websiteName}
            onChange={e => handleChange('websiteName', e.target.value)}
            className="bg-input"
          />
          <p className="text-xs text-muted-foreground mt-1">
            This name appears in the site header.
          </p>
        </div>
        <div>
          <Label htmlFor="defaultSeoTitle">Default SEO Title</Label>
          <Input
            id="defaultSeoTitle"
            value={siteInfo.defaultSeoTitle}
            onChange={e => handleChange('defaultSeoTitle', e.target.value)}
            className="bg-input"
            placeholder="e.g., My Awesome Portfolio"
          />
          <p className="text-xs text-muted-foreground mt-1">
            The default title tag for your website pages.
          </p>
        </div>
        <div>
          <Label htmlFor="defaultSeoDescription">Default SEO Description</Label>
          <Textarea
            id="defaultSeoDescription"
            value={siteInfo.defaultSeoDescription}
            onChange={e => handleChange('defaultSeoDescription', e.target.value)}
            rows={3}
            className="bg-input"
            placeholder="e.g., Discover the projects and skills of..."
          />
          <p className="text-xs text-muted-foreground mt-1">
            The default meta description for search engines and social sharing.
          </p>
        </div>
        <div>
          <Label htmlFor="ogImageUrl">Default Open Graph Image URL</Label>
          <Input
            id="ogImageUrl"
            value={siteInfo.ogImageUrl || ''}
            onChange={e => handleChange('ogImageUrl', e.target.value)}
            className="bg-input"
            placeholder="e.g., https://yourdomain.com/og-image.png"
          />
          <p className="text-xs text-muted-foreground mt-1">
            URL for the default image used when sharing links on social media (e.g., 1200x630px).
          </p>
        </div>
         <div>
          <Label className="text-foreground font-medium">Favicon Management</Label>
           <Alert variant="default" className="bg-secondary/30 border-secondary/50 mt-1">
              <UploadCloud className="h-5 w-5 text-muted-foreground" />
              <AlertTitle className="text-sm font-semibold text-foreground">How to Change Your Favicon</AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground space-y-1">
                <p>To update your site's favicon, replace the favicon files in the <code className="text-xs bg-muted px-1 rounded">public/</code> directory and redeploy.</p>
              </AlertDescription>
            </Alert>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>Reset to Defaults</Button>
      </CardFooter>
    </Card>
  );
}


function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground">Admin Dashboard</h2>
        <p className="text-muted-foreground">Manage your portfolio content here. Changes are saved automatically.</p>
      </div>

      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 mb-6 h-auto flex-wrap justify-start">
          <TabsTrigger value="about" className="py-2"><UserSquare className="mr-2 h-5 w-5"/>About</TabsTrigger>
          <TabsTrigger value="services" className="py-2"><Briefcase className="mr-2 h-5 w-5"/>Services</TabsTrigger>
          <TabsTrigger value="projects" className="py-2"><LayoutGrid className="mr-2 h-5 w-5"/>Projects</TabsTrigger>
          <TabsTrigger value="testimonials" className="py-2"><Star className="mr-2 h-5 w-5"/>Testimonials</TabsTrigger>
          <TabsTrigger value="contact" className="py-2"><Mail className="mr-2 h-5 w-5"/>Contact Info</TabsTrigger>
          <TabsTrigger value="navigation" className="py-2"><MenuSquareIcon className="mr-2 h-5 w-5"/>Navigation</TabsTrigger>
          <TabsTrigger value="messages" className="py-2"><BotMessageSquare className="mr-2 h-5 w-5"/>Messages</TabsTrigger>
          <TabsTrigger value="ai_content" className="py-2"><Lightbulb className="mr-2 h-5 w-5"/>AI Content</TabsTrigger>
          <TabsTrigger value="smtp_config" className="py-2"><Settings className="mr-2 h-5 w-5"/>SMTP Config</TabsTrigger>
          <TabsTrigger value="mail_sender" className="py-2"><MailPlus className="mr-2 h-5 w-5"/>Mail Sender</TabsTrigger>
          <TabsTrigger value="email_templates" className="py-2"><LayoutTemplate className="mr-2 h-5 w-5"/>Email Templates</TabsTrigger>
          <TabsTrigger value="site_settings" className="py-2"><Globe className="mr-2 h-5 w-5"/>Site Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="about">
          <AboutEditor />
        </TabsContent>
        <TabsContent value="services">
          <ServicesEditor />
        </TabsContent>
        <TabsContent value="projects">
          <ProjectsEditor />
        </TabsContent>
         <TabsContent value="testimonials">
          <TestimonialsEditor />
        </TabsContent>
        <TabsContent value="contact">
          <ContactEditor />
        </TabsContent>
        <TabsContent value="navigation">
          <HeaderNavEditor />
        </TabsContent>
        <TabsContent value="messages">
          <MessagesManager />
        </TabsContent>
         <TabsContent value="ai_content">
          <AIContentIdeasGenerator />
        </TabsContent>
         <TabsContent value="smtp_config">
          <SmtpConfigViewer />
        </TabsContent>
        <TabsContent value="mail_sender">
          <AdminMailSender />
        </TabsContent>
        <TabsContent value="email_templates">
          <EmailTemplatesEditor />
        </TabsContent>
         <TabsContent value="site_settings">
          <SiteSettingsEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}


function AdminPanelClient() {
  const [secretKey, setSecretKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
     if(sessionStorage.getItem('adminAuthenticated') === 'true') {
       setIsAuthenticated(true);
     }
  },[]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (secretKey === ADMIN_SECRET_KEY) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuthenticated', 'true');
      toast({ title: "Access Granted", description: "Welcome to the Admin Panel!", variant: "default" });
    } else {
      toast({ title: "Access Denied", description: "Incorrect secret key.", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuthenticated');
    setSecretKey('');
    toast({title: "Logged Out", description: "You have been logged out of the admin panel."});
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <Container className="max-w-md w-full">
          <Card className="bg-card shadow-xl">
            <CardHeader className="text-center">
              <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl font-headline text-foreground">Admin Panel Access</CardTitle>
              <CardDescription className="text-muted-foreground">Enter the secret key to proceed.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="secret-key" className="text-foreground">Secret Key</Label>
                  <Input
                    id="secret-key"
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    className="mt-1 bg-input text-foreground border-border focus:ring-primary"
                    placeholder="********"
                  />
                </div>
                <Button type="submit" className="w-full font-semibold">
                  <Unlock className="mr-2 h-5 w-5" />
                  Unlock
                </Button>
              </form>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/10 p-4 md:p-8">
      <Container>
        <Button onClick={handleLogout} variant="outline" className="mb-6">
          <Lock className="mr-2 h-4 w-4" /> Logout from Admin
        </Button>
        <AdminDashboard />
      </Container>
    </div>
  );
}


export default function AdminPage() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }
  
  return <AdminPanelClient />;
}
