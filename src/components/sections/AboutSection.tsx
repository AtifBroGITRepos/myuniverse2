import { Container } from '@/components/shared/Container';
import { ScrollAnimationWrapper } from '@/components/shared/ScrollAnimationWrapper';
import { ATIF_PORTFOLIO_DESCRIPTION, KEY_SKILLS } from '@/data/constants';
import Image from 'next/image';
import { Award, Briefcase, Users, Brain, Code } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function AboutSection() {
  const stats = [
    { value: "5+", label: "Years Experience", icon: Briefcase },
    { value: "50+", label: "Projects Completed", icon: Award },
    { value: "30+", label: "Happy Clients", icon: Users },
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <Container>
        <ScrollAnimationWrapper>
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-center mb-12">
            About <span className="text-primary">Me</span>
          </h2>
        </ScrollAnimationWrapper>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <ScrollAnimationWrapper animationClassName="animate-fade-in" delay="100ms">
            <div className="relative aspect-square max-w-md mx-auto rounded-lg overflow-hidden shadow-2xl group">
              <Image
                src="https://placehold.co/600x600.png"
                alt="Atif - Portrait"
                width={600}
                height={600}
                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                data-ai-hint="professional portrait"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            </div>
          </ScrollAnimationWrapper>
          
          <div className="space-y-6">
            <ScrollAnimationWrapper animationClassName="animate-fade-in-up" delay="200ms">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {ATIF_PORTFOLIO_DESCRIPTION.split('. ').slice(0,3).join('. ') + '.'}
              </p>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper animationClassName="animate-fade-in-up" delay="300ms">
               <p className="text-lg text-muted-foreground leading-relaxed">
                {ATIF_PORTFOLIO_DESCRIPTION.split('. ').slice(3).join('. ')}
              </p>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper animationClassName="animate-fade-in-up" delay="400ms">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-card p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
                    <stat.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                    <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>

        <ScrollAnimationWrapper animationClassName="animate-fade-in-up" delay="500ms" id="skills">
          <div className="mt-16 md:mt-24">
            <h3 className="text-3xl md:text-4xl font-headline font-bold text-center mb-10">
              Key <span className="text-primary">Skills</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-3xl mx-auto">
              {KEY_SKILLS.map((skill) => (
                <Badge 
                  key={skill} 
                  variant="secondary" 
                  className="px-4 py-2 text-sm md:text-base bg-card border-primary/30 text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-default"
                >
                  {skill.toLowerCase().includes('ai') || skill.toLowerCase().includes('prompt') ? (
                    <Brain className="mr-2 h-4 w-4 text-primary/80" />
                  ) : (
                    <Code className="mr-2 h-4 w-4 text-primary/80" />
                  )}
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </ScrollAnimationWrapper>
      </Container>
    </section>
  );
}
