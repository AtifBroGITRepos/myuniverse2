
"use client";

import { useState, useEffect } from 'react';
import { Container } from '@/components/shared/Container';
import { ScrollAnimationWrapper } from '@/components/shared/ScrollAnimationWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { sendInquiryEmails } from '@/app/actions/send-inquiry-email';
import { summarizeSingleMessage } from '@/ai/flows/summarize-single-message-flow'; 
import { Send, Mail, MapPin, MessageSquare, Sparkles, Github, Linkedin, Twitter, Instagram, Facebook, Youtube, Link as LinkIcon, type LucideIcon } from 'lucide-react';
import { LOCALSTORAGE_MESSAGES_KEY, type AdminMessage, CONTACT_INFO, LOCALSTORAGE_CONTACT_KEY, type ContactDetails, type SocialPlatform, type SocialLink } from '@/data/constants';

const iconMap: Record<SocialPlatform, LucideIcon> = {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Other: LinkIcon,
};

export function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentContactInfo, setCurrentContactInfo] = useState<ContactDetails>(CONTACT_INFO);

  useEffect(() => {
    try {
      const storedContactInfo = localStorage.getItem(LOCALSTORAGE_CONTACT_KEY);
      if (storedContactInfo) {
        const parsedInfo: ContactDetails = JSON.parse(storedContactInfo);
        if (parsedInfo && parsedInfo.email && parsedInfo.socials) {
          setCurrentContactInfo(parsedInfo);
        }
      }
    } catch (error) {
      console.error("Error parsing contact info from localStorage for ContactSection", error);
    }
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: "Missing fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    let messageSummaryForEmail: string | null = null;
    try {
      if (formData.message.trim()) {
        const summaryResult = await summarizeSingleMessage({ messageContent: formData.message });
        messageSummaryForEmail = summaryResult.summary;
      }
    } catch (summaryError) {
      console.warn("AI summary generation failed for contact form:", summaryError);
    }
    
    const inquiryDataForAction = {
      ...formData,
      type: 'General Contact' as const,
      messageSummary: messageSummaryForEmail, 
    };

    const originalMessageForAdminPanel: AdminMessage = {
      id: `contact-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      message: `General Contact Form:\n${formData.message}${messageSummaryForEmail ? `\n\nAI Summary: ${messageSummaryForEmail}` : ''}`,
      receivedAt: new Date().toISOString(),
    };
    try {
      const storedMessages = localStorage.getItem(LOCALSTORAGE_MESSAGES_KEY);
      const messages: AdminMessage[] = storedMessages ? JSON.parse(storedMessages) : [];
      messages.push(originalMessageForAdminPanel); 
      messages.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()); 
      localStorage.setItem(LOCALSTORAGE_MESSAGES_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving contact message to localStorage:', error);
    }

    const emailResult = await sendInquiryEmails(inquiryDataForAction);

    if (emailResult.success || emailResult.adminEmailFailed) { 
      toast({
        title: "Message Sent!",
        description: "We've received your message and will reply to you soon.",
      });
      setFormData({ name: '', email: '', message: '' }); 

      if (emailResult.adminEmailFailed && emailResult.originalInquiryData) {
        console.warn("Admin email failed to send for general contact. Details:", emailResult.adminEmailError);
        const failureMessage: AdminMessage = {
          id: `email-fail-${Date.now()}`,
          name: "SYSTEM ALERT - Email Failure",
          email: "N/A",
          message: `Failed to send admin notification for an inquiry.\nType: General Contact\nFrom: ${emailResult.originalInquiryData.name} (${emailResult.originalInquiryData.email})\nOriginal Message: ${emailResult.originalInquiryData.message}\nAI Summary: ${emailResult.originalInquiryData.messageSummary || 'N/A'}\nError: ${emailResult.adminEmailError}`,
          receivedAt: new Date().toISOString(),
        };
        try {
          const storedMessages = localStorage.getItem(LOCALSTORAGE_MESSAGES_KEY);
          const messages: AdminMessage[] = storedMessages ? JSON.parse(storedMessages) : [];
          messages.push(failureMessage);
          messages.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
          localStorage.setItem(LOCALSTORAGE_MESSAGES_KEY, JSON.stringify(messages));
        } catch (localError) {
          console.error('Error saving email failure message to localStorage:', localError);
        }
      }
    } else {
      toast({
        title: "Submission Error",
        description: emailResult.error || "Could not send your message. Please try again later.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-secondary/10">
      <Container>
        <ScrollAnimationWrapper>
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-center mb-12">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto mb-16">
            Have a project in mind, a question, or just want to say hi? Feel free to reach out. I'm always excited to connect and explore new opportunities.
          </p>
        </ScrollAnimationWrapper>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <ScrollAnimationWrapper animationClassName="animate-fade-in-up" delay="100ms">
            <div className="bg-card p-8 rounded-lg shadow-xl space-y-6">
              <h3 className="text-2xl font-semibold text-foreground mb-6">Contact Information</h3>
              
              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <a href={`mailto:${currentContactInfo.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                  {currentContactInfo.email}
                </a>
              </div>
              <div className="flex items-start space-x-4">
                <MessageSquare className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <a href={`https://wa.me/${currentContactInfo.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  WhatsApp: {currentContactInfo.whatsappNumber}
                </a>
              </div>
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">{currentContactInfo.location}</p>
              </div>

              {currentContactInfo.socials.length > 0 && (
                <div className="pt-6 border-t border-border">
                  <h4 className="text-xl font-semibold text-foreground mb-4">Find me on</h4>
                  <div className="flex flex-wrap gap-4">
                    {currentContactInfo.socials.map(social => {
                      const Icon = iconMap[social.platform] || LinkIcon;
                      return (
                        <a 
                          key={social.id} 
                          href={social.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-muted-foreground hover:text-primary transition-colors"
                          aria-label={social.platform}
                        >
                          <Icon className="h-7 w-7" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper animationClassName="animate-fade-in-up" delay="200ms">
            <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-lg shadow-xl">
              <div>
                <Label htmlFor="name" className="text-foreground">Full Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="mt-2 bg-input text-foreground border-border focus:ring-primary"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-foreground">Email Address</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                  className="mt-2 bg-input text-foreground border-border focus:ring-primary"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-foreground">Message</Label>
                <Textarea
                  name="message"
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message here..."
                  required
                  className="mt-2 bg-input text-foreground border-border focus:ring-primary"
                />
              </div>
              <Button type="submit" className="w-full font-semibold" disabled={isSubmitting}>
                {isSubmitting ? (
                  <> <Sparkles className="mr-2 h-5 w-5 animate-pulse" /> Sending... </>
                 ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </ScrollAnimationWrapper>
        </div>
      </Container>
    </section>
  );
}
