"use client";

import { useState } from 'react';
import { Container } from '@/components/shared/Container';
import { ScrollAnimationWrapper } from '@/components/shared/ScrollAnimationWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Changed from Textarea for single-line skill input
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { explainSkill, type ExplainSkillInput } from '@/ai/flows/explain-skill-flow';
import { BrainCircuit, Sparkles, Wand2 } from 'lucide-react'; // Added Wand2 for a different icon

interface AISkillExplainerSectionProps {
  atifPortfolioDescription: string;
}

export function AISkillExplainerSection({ atifPortfolioDescription }: AISkillExplainerSectionProps) {
  const [skillQuery, setSkillQuery] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillQuery.trim()) {
      toast({ title: 'Skill query is required', description: 'Please enter a skill or technology to learn more about.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setExplanation(null);
    try {
      const input: ExplainSkillInput = {
        skillQuery,
        atifPortfolio: atifPortfolioDescription,
      };
      const result = await explainSkill(input);
      setExplanation(result.explanation);
      toast({ title: 'Skill Explained!', description: `AI has provided insights on ${skillQuery}.`, variant: 'default' });
    } catch (error) {
      console.error('Error explaining skill:', error);
      toast({ title: 'Error', description: 'Failed to generate explanation. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <Container>
        {/* Intentionally not adding main title for this section as it follows AIProjectIdeaGeneratorSection under "AI Hub" */}
        <ScrollAnimationWrapper animationClassName="animate-fade-in-up" delay="400ms">
          <Card className="max-w-2xl mx-auto bg-card shadow-xl mt-12">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-headline text-foreground">
                <BrainCircuit className="h-7 w-7 mr-3 text-primary" />
                AI Skill Explainer
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Curious about a specific skill or technology in my portfolio? Ask AI for an explanation of how I apply it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="skill-query" className="text-foreground mb-2 block font-medium">
                    Skill or Technology
                  </Label>
                  <Input
                    id="skill-query"
                    type="text"
                    value={skillQuery}
                    onChange={(e) => setSkillQuery(e.target.value)}
                    placeholder="e.g., Prompt Engineering, Next.js, UI/UX Design..."
                    className="bg-input text-foreground border-border focus:ring-primary"
                    required
                  />
                </div>
                <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
                  {isLoading ? (
                    'Generating Explanation...'
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-5 w-5" />
                      Explain Skill
                    </>
                  )}
                </Button>
              </form>

              {explanation && (
                <div className="mt-8 p-6 border border-primary/50 rounded-lg bg-primary/10">
                  <h3 className="text-xl font-semibold text-primary mb-4">AI Explanation for "{skillQuery}":</h3>
                  <div className="whitespace-pre-wrap text-foreground prose prose-sm max-w-none prose-p:my-2">
                     {explanation.split('\n').map((line, index) => (
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
