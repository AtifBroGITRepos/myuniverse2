
"use client";

import { useState } from 'react';
import { Container } from '@/components/shared/Container';
import { ScrollAnimationWrapper } from '@/components/shared/ScrollAnimationWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { sendInquiryEmails } from '@/app/actions/send-inquiry-email';
import { summarizeSingleMessage } from '@/ai/flows/summarize-single-message-flow'; // Import summarizer
import { Send, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { LOCALSTORAGE_MESSAGES_KEY, type AdminMessage } from '@/data/constants';


export function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // Do not block submission if summary fails
    }
    
    const inquiryDataForAction = {
      ...formData,
      type: 'General Contact' as const,
      messageSummary: messageSummaryForEmail, // Pass the summary
    };

    // Save to localStorage (for admin panel message viewing)
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
      messages.push(originalMessageForAdminPanel); // Add to the beginning (or end if preferred)
      messages.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()); // Re-sort after adding
      localStorage.setItem(LOCALSTORAGE_MESSAGES_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving contact message to localStorage:', error);
    }

    // Attempt to send emails
    const emailResult = await sendInquiryEmails(inquiryDataForAction);

    if (emailResult.success || emailResult.adminEmailFailed) { // Consider success if user email sent, even if admin failed
      toast({
        title: "Message Sent!",
        description: "We've received your message and will reply to you soon.",
      });
      setFormData({ name: '', email: '', message: '' }); // Clear form

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

  const contactInfo = [
    { icon: Mail, text: "atif.codes@example.com", href: "mailto:atif.codes@example.com" },
    { icon: Phone, text: "+1 (555) 123-4567", href: "tel:+15551234567" },
    { icon: MapPin, text: "Cyberjaya, Malaysia" },
  ];

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
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <info.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  {info.href ? (
                    <a href={info.href} className="text-muted-foreground hover:text-primary transition-colors">
                      {info.text}
                    </a>
                  ) : (
                    <p className="text-muted-foreground">{info.text}</p>
                  )}
                </div>
              ))}
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

