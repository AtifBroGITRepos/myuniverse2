
"use client";

import { useState, useEffect } from 'react';
import { Container } from '@/components/shared/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ATIF_PORTFOLIO_DESCRIPTION, KEY_SKILLS } from '@/data/constants';
import { generateAboutText, type GenerateAboutTextInput } from '@/ai/flows/generate-about-text-flow';
import { Sparkles, Lock, Unlock } from 'lucide-react';

const ADMIN_SECRET_KEY = "ilovegfxm";
const LOCALSTORAGE_ABOUT_KEY = "admin_about_text";

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
        keywords: KEY_SKILLS.slice(0, 5), // Use some key skills as keywords
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
  
  // Placeholder for other editors. More can be added here.
  // For example, Services, Projects, Contact info editors.

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>About Me Editor</CardTitle>
        <CardDescription>Edit the "About Me" section text. Changes are saved locally in your browser.</CardDescription>
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


function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-foreground">Admin Dashboard</h2>
      <AboutEditor />
      {/* Future editors can be added here:
      <ServicesEditor />
      <ProjectsEditor />
      <ContactEditor /> 
      */}
      <Card>
        <CardHeader><CardTitle>More Editors Coming Soon!</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">Editors for Services, Projects, and Contact Information will be added here.</p></CardContent>
      </Card>
    </div>
  );
}


export default function AdminPage() {
  const [secretKey, setSecretKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const handleLogin = () => {
    if (secretKey === ADMIN_SECRET_KEY) {
      setIsAuthenticated(true);
      toast({ title: "Access Granted", description: "Welcome to the Admin Panel!", variant: "default" });
    } else {
      toast({ title: "Access Denied", description: "Incorrect secret key.", variant: "destructive" });
    }
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
        <AdminDashboard />
      </Container>
    </div>
  );
}
