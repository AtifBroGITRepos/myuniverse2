import { Container } from '@/components/shared/Container';
import { ScrollAnimationWrapper } from '@/components/shared/ScrollAnimationWrapper';
import { ATIF_PORTFOLIO_DESCRIPTION } from '@/data/constants';
import Image from 'next/image';
import { Award, Briefcase, Users } from 'lucide-react';

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
      </Container>
    </section>
  );
}
