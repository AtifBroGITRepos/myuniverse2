
"use client";

import { Container } from '@/components/shared/Container';
import { ScrollAnimationWrapper } from '@/components/shared/ScrollAnimationWrapper';
import type { Service } from '@/data/constants'; // Service interface still imported for type safety
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Server, Palette, Briefcase, Brain, type LucideIcon } from 'lucide-react'; // Import icons here

interface ServicesSectionProps {
  services: Array<Omit<Service, 'iconName'> & { iconName: string }>; // Adjusted prop type
}

const iconMap: Record<string, LucideIcon> = {
  Server,
  Palette,
  Briefcase,
  Brain,
};

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section id="services" className="py-16 md:py-24 bg-background">
      <Container>
        <ScrollAnimationWrapper>
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-center mb-12">
            My <span className="text-primary">Services</span>
          </h2>
          <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto mb-16">
            I offer a range of services to bring your digital projects to life, focusing on quality, innovation, and user satisfaction.
          </p>
        </ScrollAnimationWrapper>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.iconName];
            return (
              <ScrollAnimationWrapper 
                key={service.id} 
                animationClassName="animate-fade-in-up" 
                delay={`${index * 100}ms`}
              >
                <Card className="h-full flex flex-col text-center bg-card shadow-xl hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="items-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4 inline-block">
                      {IconComponent ? <IconComponent className="h-10 w-10 text-primary" /> : null}
                    </div>
                    <CardTitle className="font-headline text-2xl text-foreground">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </ScrollAnimationWrapper>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
