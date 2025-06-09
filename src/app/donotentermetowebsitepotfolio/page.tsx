
"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import { Container } from '@/components/shared/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from '@/hooks/use-toast';
import { 
  ATIF_PORTFOLIO_DESCRIPTION, KEY_SKILLS, SERVICES_DATA, PROJECTS_DATA, CONTACT_INFO, TESTIMONIALS_DATA, HEADER_NAV_ITEMS_DATA,
  LOCALSTORAGE_MESSAGES_KEY, LOCALSTORAGE_TESTIMONIALS_KEY, LOCALSTORAGE_HEADER_NAV_KEY,
  type Service, type Project, type ContactDetails, type ServiceIconName, type AdminMessage, type Testimonial, type NavItem
} from '@/data/constants';
import { generateAboutText, type GenerateAboutTextInput } from '@/ai/flows/generate-about-text-flow';
import { summarizeMessages, type SummarizeMessagesInput } from '@/ai/flows/summarize-messages-flow';
import { Sparkles, Lock, Unlock, Trash2, PlusCircle, UserSquare, Briefcase, LayoutGrid, Mail, BotMessageSquare, FileText, Send, Star, MenuSquareIcon } from 'lucide-react';

const ADMIN_SECRET_KEY = "ilovegfxm";
const LOCALSTORAGE_ABOUT_KEY = "admin_about_text";
const LOCALSTORAGE_SERVICES_KEY = "admin_services_data";
const LOCALSTORAGE_PROJECTS_KEY = "admin_projects_data";
const LOCALSTORAGE_CONTACT_KEY = "admin_contact_info";


function AboutEditor() {
  const [aboutText, setAboutText] = useState(ATIF_PORTFOLIO_DESCRIPTION);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedAboutText = localStorage.getItem(LOCALSTORAGE_ABOUT_KEY);
    if (storedAboutText) {
      setAboutText(storedAboutText);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(LOCALSTORAGE_ABOUT_KEY, aboutText);
    toast({ title: "Success!", description: "About Me text saved to local storage." });
  };

  const handleReset = () => {
    setAboutText(ATIF_PORTFOLIO_DESCRIPTION);
    localStorage.removeItem(LOCALSTORAGE_ABOUT_KEY);
    toast({ title: "Reset", description: "About Me text reset to default." });
  }

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
        toast({ title: "AI Suggestion Applied!", description: "New About Me text generated." });
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
        <CardDescription>Edit the "About Me" section text. Changes are saved locally.</CardDescription>
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
        <Button onClick={handleSave}>Save to Local Storage</Button>
      </CardFooter>
    </Card>
  );
}

const serviceIconOptions: ServiceIconName[] = ['Server', 'Palette', 'Briefcase', 'Brain'];

function ServicesEditor() {
  const [services, setServices] = useState<Service[]>(SERVICES_DATA);
  const { toast } = useToast();

  useEffect(() => {
    const storedServices = localStorage.getItem(LOCALSTORAGE_SERVICES_KEY);
    if (storedServices) {
      setServices(JSON.parse(storedServices));
    } else {
      setServices(SERVICES_DATA); 
    }
  }, []);

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
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    localStorage.setItem(LOCALSTORAGE_SERVICES_KEY, JSON.stringify(services));
    toast({ title: "Success!", description: "Services data saved to local storage." });
  };

  const handleReset = () => {
    setServices(SERVICES_DATA);
    localStorage.removeItem(LOCALSTORAGE_SERVICES_KEY);
    toast({ title: "Reset", description: "Services data reset to default." });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Services Editor</CardTitle>
        <CardDescription>Edit the services offered. Changes are saved locally.</CardDescription>
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
        <Button onClick={handleSave}>Save to Local Storage</Button>
      </CardFooter>
    </Card>
  );
}

function ProjectsEditor() {
  const [projects, setProjects] = useState<Project[]>(PROJECTS_DATA);
  const { toast } = useToast();

  useEffect(() => {
    const storedProjects = localStorage.getItem(LOCALSTORAGE_PROJECTS_KEY);
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      setProjects(PROJECTS_DATA);
    }
  }, []);

  const handleProjectChange = (index: number, field: keyof Project, value: string | string[]) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setProjects(updatedProjects);
  };

  const handleImageFileChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleProjectChange(index, 'imageUrl', reader.result as string);
        toast({ title: "Image Preview Ready", description: "Image will be saved as Data URI on save."})
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddProject = () => {
    setProjects([...projects, { 
      id: `project-${Date.now()}`, 
      title: '', 
      description: '', 
      longDescription: '', 
      imageUrl: 'https://placehold.co/600x400.png', 
      tags: [], 
      imageHint: 'new project',
      liveUrl: '',
      sourceUrl: ''
    }]);
  };

  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    localStorage.setItem(LOCALSTORAGE_PROJECTS_KEY, JSON.stringify(projects));
    toast({ title: "Success!", description: "Projects data saved to local storage." });
  };

  const handleReset = () => {
    setProjects(PROJECTS_DATA);
    localStorage.removeItem(LOCALSTORAGE_PROJECTS_KEY);
    toast({ title: "Reset", description: "Projects data reset to default." });
  };

  return (
     <Card className="w-full">
      <CardHeader>
        <CardTitle>Projects Editor</CardTitle>
        <CardDescription>Edit project details. Images are saved as Data URIs in local storage.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {projects.map((project, index) => (
          <Card key={project.id} className="p-4 bg-secondary/20 space-y-3">
            <div>
              <Label htmlFor={`project-title-${index}`}>Title</Label>
              <Input id={`project-title-${index}`} value={project.title} onChange={(e) => handleProjectChange(index, 'title', e.target.value)} className="bg-input"/>
            </div>
            <div>
              <Label htmlFor={`project-desc-${index}`}>Short Description</Label>
              <Textarea id={`project-desc-${index}`} value={project.description} onChange={(e) => handleProjectChange(index, 'description', e.target.value)} rows={2} className="bg-input"/>
            </div>
            <div>
              <Label htmlFor={`project-longdesc-${index}`}>Long Description</Label>
              <Textarea id={`project-longdesc-${index}`} value={project.longDescription} onChange={(e) => handleProjectChange(index, 'longDescription', e.target.value)} rows={4} className="bg-input"/>
            </div>
            <div>
              <Label htmlFor={`project-imageurl-${index}`}>Image</Label>
              <Input id={`project-imageurl-${index}`} type="file" accept="image/*" onChange={(e) => handleImageFileChange(index, e)} className="bg-input"/>
              {project.imageUrl && (
                <div className="mt-2 relative w-full aspect-video max-w-xs">
                  <Image src={project.imageUrl} alt="Preview" layout="fill" objectFit="contain" className="rounded"/>
                </div>
              )}
            </div>
             <div>
              <Label htmlFor={`project-imagehint-${index}`}>Image AI Hint (1-2 words)</Label>
              <Input id={`project-imagehint-${index}`} value={project.imageHint || ""} onChange={(e) => handleProjectChange(index, 'imageHint', e.target.value)} className="bg-input"/>
            </div>
            <div>
              <Label htmlFor={`project-tags-${index}`}>Tags (comma-separated)</Label>
              <Input id={`project-tags-${index}`} value={project.tags.join(', ')} onChange={(e) => handleProjectChange(index, 'tags', e.target.value.split(',').map(tag => tag.trim()))} className="bg-input"/>
            </div>
            <div>
              <Label htmlFor={`project-live-${index}`}>Live URL</Label>
              <Input id={`project-live-${index}`} value={project.liveUrl || ''} onChange={(e) => handleProjectChange(index, 'liveUrl', e.target.value)} className="bg-input"/>
            </div>
            <div>
              <Label htmlFor={`project-source-${index}`}>Source URL</Label>
              <Input id={`project-source-${index}`} value={project.sourceUrl || ''} onChange={(e) => handleProjectChange(index, 'sourceUrl', e.target.value)} className="bg-input"/>
            </div>
            <Button variant="destructive" size="sm" onClick={() => handleRemoveProject(index)} className="mt-3">
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
        <Button onClick={handleSave}>Save to Local Storage</Button>
      </CardFooter>
    </Card>
  );
}

function TestimonialsEditor() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS_DATA);
  const { toast } = useToast();

  useEffect(() => {
    const storedTestimonials = localStorage.getItem(LOCALSTORAGE_TESTIMONIALS_KEY);
    if (storedTestimonials) {
      setTestimonials(JSON.parse(storedTestimonials));
    } else {
      setTestimonials(TESTIMONIALS_DATA);
    }
  }, []);

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
        toast({ title: "Avatar Preview Ready", description: "Image will be saved as Data URI." });
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
  };

  const handleRemoveTestimonial = (index: number) => {
    setTestimonials(testimonials.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    localStorage.setItem(LOCALSTORAGE_TESTIMONIALS_KEY, JSON.stringify(testimonials));
    toast({ title: "Success!", description: "Testimonials data saved to local storage." });
  };

  const handleReset = () => {
    setTestimonials(TESTIMONIALS_DATA);
    localStorage.removeItem(LOCALSTORAGE_TESTIMONIALS_KEY);
    toast({ title: "Reset", description: "Testimonials data reset to default." });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Testimonials Editor</CardTitle>
        <CardDescription>Manage client and colleague testimonials. Avatar images are saved as Data URIs.</CardDescription>
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
              {testimonial.avatarUrl && (
                <div className="mt-2 relative w-24 h-24">
                  <Image src={testimonial.avatarUrl} alt="Avatar Preview" layout="fill" objectFit="cover" className="rounded-full"/>
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
        <Button onClick={handleSave}>Save to Local Storage</Button>
      </CardFooter>
    </Card>
  );
}


function ContactEditor() {
  const [contactInfo, setContactInfo] = useState<ContactDetails>(CONTACT_INFO);
  const { toast } = useToast();

  useEffect(() => {
    const storedContactInfo = localStorage.getItem(LOCALSTORAGE_CONTACT_KEY);
    if (storedContactInfo) {
      setContactInfo(JSON.parse(storedContactInfo));
    } else {
      setContactInfo(CONTACT_INFO);
    }
  }, []);

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

  const handleSave = () => {
    localStorage.setItem(LOCALSTORAGE_CONTACT_KEY, JSON.stringify(contactInfo));
    toast({ title: "Success!", description: "Contact info saved to local storage." });
  };

  const handleReset = () => {
    setContactInfo(CONTACT_INFO);
    localStorage.removeItem(LOCALSTORAGE_CONTACT_KEY);
    toast({ title: "Reset", description: "Contact info reset to default." });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Contact Information Editor</CardTitle>
        <CardDescription>Edit contact details and social media links.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" value={contactInfo.email} onChange={e => handleChange('email', e.target.value)} className="bg-input"/>
        </div>
        <div>
          <Label htmlFor="contact-phone">Phone</Label>
          <Input id="contact-phone" value={contactInfo.phone} onChange={e => handleChange('phone', e.target.value)} className="bg-input"/>
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
        <Button onClick={handleSave}>Save to Local Storage</Button>
      </CardFooter>
    </Card>
  );
}

function HeaderNavEditor() {
  const [navItems, setNavItems] = useState<NavItem[]>(HEADER_NAV_ITEMS_DATA);
  const { toast } = useToast();

  useEffect(() => {
    const storedNavItems = localStorage.getItem(LOCALSTORAGE_HEADER_NAV_KEY);
    if (storedNavItems) {
      setNavItems(JSON.parse(storedNavItems));
    } else {
      setNavItems(HEADER_NAV_ITEMS_DATA);
    }
  }, []);

  const handleNavItemChange = (index: number, field: keyof NavItem, value: string) => {
    const updatedNavItems = [...navItems];
    updatedNavItems[index] = { ...updatedNavItems[index], [field]: value };
    setNavItems(updatedNavItems);
  };

  const handleSave = () => {
    localStorage.setItem(LOCALSTORAGE_HEADER_NAV_KEY, JSON.stringify(navItems));
    toast({ title: "Success!", description: "Header navigation items saved to local storage." });
  };

  const handleReset = () => {
    setNavItems(HEADER_NAV_ITEMS_DATA);
    localStorage.removeItem(LOCALSTORAGE_HEADER_NAV_KEY);
    toast({ title: "Reset", description: "Header navigation items reset to default." });
  };
  
  // Cannot add/remove nav items in this simple editor, only edit existing ones.

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Header Navigation Editor</CardTitle>
        <CardDescription>Edit the text and links for the main site navigation. Changes are saved locally.</CardDescription>
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
                placeholder="e.g., #about or /blog"
              />
            </div>
          </Card>
        ))}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>Reset to Default</Button>
        <Button onClick={handleSave}>Save to Local Storage</Button>
      </CardFooter>
    </Card>
  );
}


function MessagesManager() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [newMessage, setNewMessage] = useState({ name: '', email: '', message: '' });
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedMessages = localStorage.getItem(LOCALSTORAGE_MESSAGES_KEY);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  const handleSaveMessages = (updatedMessages: AdminMessage[]) => {
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
    const updatedMessages = [...messages, messageToAdd];
    handleSaveMessages(updatedMessages);
    setNewMessage({ name: '', email: '', message: '' });
    toast({ title: "Message Added", description: "Mock message saved to local storage." });
  };

  const handleRemoveMessage = (id: string) => {
    const updatedMessages = messages.filter(msg => msg.id !== id);
    handleSaveMessages(updatedMessages);
    toast({ title: "Message Removed" });
  };
  
  const handleClearAllMessages = () => {
    handleSaveMessages([]);
    setSummary(null);
    toast({ title: "All Messages Cleared" });
  };

  const handleSummarize = async () => {
    if (messages.length === 0) {
      toast({ title: "No Messages", description: "Add some messages before summarizing.", variant: "default" });
      return;
    }
    setIsLoadingSummary(true);
    setSummary(null);
    try {
      const input: SummarizeMessagesInput = { messages };
      const result = await summarizeMessages(input);
      setSummary(result.summary);
      toast({ title: "AI Summary Generated!", variant: "default" });
    } catch (error) {
      console.error("Error summarizing messages:", error);
      toast({ title: "AI Error", description: "Could not summarize messages.", variant: "destructive" });
    } finally {
      setIsLoadingSummary(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Messages & AI Summary</CardTitle>
        <CardDescription>Manage mock user messages and use AI to summarize them.</CardDescription>
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
          <h4 className="text-lg font-medium text-foreground">Current Messages ({messages.length})</h4>
          {messages.length === 0 && <p className="text-muted-foreground">No messages yet. Add some using the form above.</p>}
          <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
            {messages.map(msg => (
              <Card key={msg.id} className="p-3 bg-card">
                <p className="text-sm text-muted-foreground"><strong>From:</strong> {msg.name} ({msg.email})</p>
                <p className="text-sm text-muted-foreground"><strong>Received:</strong> {new Date(msg.receivedAt).toLocaleString()}</p>
                <p className="mt-1 text-foreground">{msg.message}</p>
                <Button variant="destructive" size="xs" onClick={() => handleRemoveMessage(msg.id)} className="mt-2">
                  <Trash2 className="mr-1 h-3 w-3"/> Remove
                </Button>
              </Card>
            ))}
          </div>
           {messages.length > 0 && (
            <Button variant="outline" onClick={handleClearAllMessages} size="sm">
              <Trash2 className="mr-2 h-4 w-4"/> Clear All Messages
            </Button>
          )}
        </div>
       
        <div className="space-y-2">
            <Button onClick={handleSummarize} disabled={isLoadingSummary || messages.length === 0} className="w-full">
                <BotMessageSquare className="mr-2 h-5 w-5" />
                {isLoadingSummary ? "Summarizing with AI..." : "Summarize Messages with AI"}
            </Button>
            {summary && (
            <Card className="p-4 bg-primary/10 border-primary/50">
                <CardTitle className="text-md text-primary mb-2">AI Summary:</CardTitle>
                <p className="text-sm text-foreground whitespace-pre-wrap">{summary}</p>
            </Card>
            )}
        </div>

      </CardContent>
       <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleClearAllMessages}>Clear Messages from Local Storage</Button>
      </CardFooter>
    </Card>
  );
}


function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground">Admin Dashboard</h2>
        <p className="text-muted-foreground">Manage your portfolio content here. Changes are saved to local storage.</p>
      </div>

      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 mb-6 h-auto flex-wrap">
          <TabsTrigger value="about" className="py-2"><UserSquare className="mr-2 h-5 w-5"/>About</TabsTrigger>
          <TabsTrigger value="services" className="py-2"><Briefcase className="mr-2 h-5 w-5"/>Services</TabsTrigger>
          <TabsTrigger value="projects" className="py-2"><LayoutGrid className="mr-2 h-5 w-5"/>Projects</TabsTrigger>
          <TabsTrigger value="testimonials" className="py-2"><Star className="mr-2 h-5 w-5"/>Testimonials</TabsTrigger>
          <TabsTrigger value="contact" className="py-2"><Mail className="mr-2 h-5 w-5"/>Contact</TabsTrigger>
          <TabsTrigger value="navigation" className="py-2"><MenuSquareIcon className="mr-2 h-5 w-5"/>Navigation</TabsTrigger>
          <TabsTrigger value="messages" className="py-2"><BotMessageSquare className="mr-2 h-5 w-5"/>Messages</TabsTrigger>
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
      </Tabs>
    </div>
  );
}


export default function AdminPage() {
  const [secretKey, setSecretKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
     if(sessionStorage.getItem('adminAuthenticated') === 'true') {
       setIsAuthenticated(true);
     }
  },[])

  const handleLogin = () => {
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
    toast({title: "Logged Out", description: "You have been logged out of the admin panel."});
  }

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
            <CardContent className="space-y-4">
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
              <Button onClick={handleLogin} className="w-full font-semibold">
                <Unlock className="mr-2 h-5 w-5" />
                Unlock
              </Button>
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

