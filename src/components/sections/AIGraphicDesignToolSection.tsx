
"use client";

import { useState } from 'react';
import { Container } from '@/components/shared/Container';
import { ScrollAnimationWrapper } from '@/components/shared/ScrollAnimationWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { suggestGraphicDesignIdeas, type SuggestGraphicDesignIdeasInput } from '@/ai/flows/suggest-graphic-design-ideas-flow';
import { Palette, Sparkles, Brush } from 'lucide-react';

interface AIGraphicDesignToolSectionProps {
  atifPortfolioDescription: string;
}

export function AIGraphicDesignToolSection({ atifPortfolioDescription }: AIGraphicDesignToolSectionProps) {
  const [projectType, setProjectType] = useState('');
  const [brandKeywords, setBrandKeywords] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [designIdeas, setDesignIdeas] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectType.trim()) {
      toast({ title: 'Project Type is required', description: 'Please specify the type of design project.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setDesignIdeas(null);
    try {
      const input: SuggestGraphicDesignIdeasInput = {
        projectType,
        brandKeywords: brandKeywords.split(',').map(k => k.trim()).filter(k => k),
        targetAudience,
        additionalInfo,
        atifPortfolioContext: atifPortfolioDescription,
      };
      const result = await suggestGraphicDesignIdeas(input);
      setDesignIdeas(result.designIdeas);
      toast({ title: 'Graphic Design Ideas Generated!', description: 'AI has brainstormed some visual concepts for you.', variant: 'default' });
    } catch (error) {
      console.error('Error generating graphic design ideas:', error);
      toast({ title: 'AI Error', description: 'Failed to generate design ideas. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <Container>
        <ScrollAnimationWrapper animationClassName="animate-fade-in-up" delay="600ms">
          <Card className="max-w-2xl mx-auto bg-card shadow-xl mt-12">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-headline text-foreground">
                <Brush className="h-7 w-7 mr-3 text-primary" />
                AI Graphic Design Idea Spark
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Need a creative boost for a graphics project? Describe the project, and let AI suggest some initial design directions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="project-type" className="text-foreground mb-2 block font-medium">
                    Project Type
                  </Label>
                  <Input
                    id="project-type"
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    placeholder="e.g., Logo Design, Brochure, Social Media Ad"
                    className="bg-input text-foreground border-border focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="brand-keywords" className="text-foreground mb-2 block font-medium">
                    Brand Keywords/Style (comma-separated)
                  </Label>
                  <Input
                    id="brand-keywords"
                    value={brandKeywords}
                    onChange={(e) => setBrandKeywords(e.target.value)}
                    placeholder="e.g., Modern, Minimalist, Playful, Corporate"
                    className="bg-input text-foreground border-border focus:ring-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="target-audience" className="text-foreground mb-2 block font-medium">
                    Target Audience (Optional)
                  </Label>
                  <Input
                    id="target-audience"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., Startups, Young Adults, Luxury Market"
                    className="bg-input text-foreground border-border focus:ring-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="additional-info" className="text-foreground mb-2 block font-medium">
                    Additional Info/Preferences (Optional)
                  </Label>
                  <Textarea
                    id="additional-info"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="e.g., Prefers dark themes, needs to incorporate a specific icon..."
                    rows={3}
                    className="bg-input text-foreground border-border focus:ring-primary"
                  />
                </div>
                <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
                  {isLoading ? (
                    'Sparking Ideas...'
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Suggest Design Ideas
                    </>
                  )}
                </Button>
              </form>

              {designIdeas && (
                <div className="mt-8 p-6 border border-primary/50 rounded-lg bg-primary/10">
                  <h3 className="text-xl font-semibold text-primary mb-4">AI Suggested Design Ideas:</h3>
                  <div className="whitespace-pre-wrap text-foreground prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1">
                     {designIdeas.split('\n').map((line, index) => (
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
