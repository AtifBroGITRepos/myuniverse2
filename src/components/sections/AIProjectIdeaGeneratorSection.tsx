"use client";

import { useState } from 'react';
import { Container } from '@/components/shared/Container';
import { ScrollAnimationWrapper } from '@/components/shared/ScrollAnimationWrapper';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { suggestProjectIdeas, type SuggestProjectIdeasInput } from '@/ai/flows/suggest-project-ideas';
import { Lightbulb, Sparkles } from 'lucide-react';
import { ATIF_PORTFOLIO_DESCRIPTION } from '@/data/constants';

interface AIProjectIdeaGeneratorSectionProps {
  atifPortfolioDescription: string;
}

export function AIProjectIdeaGeneratorSection({ atifPortfolioDescription }: AIProjectIdeaGeneratorSectionProps) {
  const [businessNeeds, setBusinessNeeds] = useState('');
  const [projectIdeas, setProjectIdeas] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessNeeds.trim()) {
      toast({ title: 'Business needs are required', description: 'Please describe the business needs to generate project ideas.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setProjectIdeas(null);
    try {
      const input: SuggestProjectIdeasInput = {
        businessNeeds,
        atifPortfolio: atifPortfolioDescription,
      };
      const result = await suggestProjectIdeas(input);
      setProjectIdeas(result.projectIdeas);
      toast({ title: 'Project Ideas Generated!', description: 'AI has brainstormed some ideas for you.', variant: 'default' });
    } catch (error) {
      console.error('Error generating project ideas:', error);
      toast({ title: 'Error', description: 'Failed to generate project ideas. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="ai-tools" className="py-16 md:py-24 bg-background">
      <Container>
        <ScrollAnimationWrapper>
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-center mb-6">
            AI <span className="text-primary">Inspiration</span> Hub
          </h2>
          <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Leverage the power of AI to brainstorm project ideas tailored to specific business needs, based on my portfolio and expertise.
          </p>
        </ScrollAnimationWrapper>

        <ScrollAnimationWrapper animationClassName="animate-fade-in-up" delay="200ms">
          <Card className="max-w-2xl mx-auto bg-card shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-headline text-foreground">
                <Lightbulb className="h-7 w-7 mr-3 text-primary" />
                Project Idea Generator
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Describe the potential client's business needs, and let AI suggest relevant project ideas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="business-needs" className="text-foreground mb-2 block font-medium">
                    Client's Business Needs
                  </Label>
                  <Textarea
                    id="business-needs"
                    value={businessNeeds}
                    onChange={(e) => setBusinessNeeds(e.target.value)}
                    placeholder="e.g., A startup in the eco-friendly product space needs a way to engage customers and showcase their commitment to sustainability..."
                    rows={5}
                    className="bg-input text-foreground border-border focus:ring-primary"
                    required
                  />
                </div>
                <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
                  {isLoading ? (
                    'Generating Ideas...'
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Suggest Project Ideas
                    </>
                  )}
                </Button>
              </form>

              {projectIdeas && (
                <div className="mt-8 p-6 border border-primary/50 rounded-lg bg-primary/10">
                  <h3 className="text-xl font-semibold text-primary mb-4">Suggested Project Ideas:</h3>
                  <div className="whitespace-pre-wrap text-foreground prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1">
                    {projectIdeas.split('\n').map((line, index) => (
                      line.trim().startsWith('- ') || line.trim().startsWith('* ') ? 
                      <p key={index} className="ml-4 list-item list-disc">{line.replace(/^-|^\* /, '')}</p> :
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </ScrollAnimationWrapper>
      </Container>
    </section>
  );
}
