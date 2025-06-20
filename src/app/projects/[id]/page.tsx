
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { PROJECTS_DATA, LOCALSTORAGE_PROJECTS_KEY, type Project, type ProjectImage } from '@/data/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { ScrollAnimationWrapper } from '@/components/shared/ScrollAnimationWrapper';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Assuming this path will be valid after user runs `npx shadcn-ui@latest add carousel`

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null | undefined>(undefined); 

  useEffect(() => {
    if (projectId) {
      let projectsToSearch: Project[] = PROJECTS_DATA.map(p => {
        // Ensure default structure for default data
        const images = (p.images && p.images.length > 0) 
          ? p.images 
          : (p.imageUrl ? [{ url: p.imageUrl, hint: p.imageHint || 'project image' }] : [{ url: 'https://placehold.co/800x450.png', hint: 'project placeholder' }]);
        return {
          ...p,
          images,
          showLiveUrlButton: p.showLiveUrlButton === undefined ? true : p.showLiveUrlButton,
          showSourceUrlButton: p.showSourceUrlButton === undefined ? true : p.showSourceUrlButton,
        };
      });

      try {
        const storedProjectsString = localStorage.getItem(LOCALSTORAGE_PROJECTS_KEY);
        if (storedProjectsString) {
          const storedProjects: Project[] = JSON.parse(storedProjectsString);
          if (Array.isArray(storedProjects) && storedProjects.length > 0) {
             projectsToSearch = storedProjects.map(p => {
                // Migrate old single image structure to new multiple image structure
                let currentImages = p.images || [];
                if (p.imageUrl && (!p.images || p.images.length === 0)) {
                    currentImages = [{ url: p.imageUrl, hint: p.imageHint || 'migrated image' }];
                }
                if (currentImages.length === 0) {
                    currentImages = [{ url: 'https://placehold.co/800x450.png', hint: 'project placeholder' }];
                }
                const { imageUrl, imageHint, ...restOfProject } = p; // remove deprecated fields
                return {
                    ...restOfProject,
                    images: currentImages,
                    showLiveUrlButton: p.showLiveUrlButton === undefined ? true : p.showLiveUrlButton,
                    showSourceUrlButton: p.showSourceUrlButton === undefined ? true : p.showSourceUrlButton,
                };
            });
          }
        }
      } catch (error) {
        console.error("Error loading projects from localStorage for detail page:", error);
      }
      
      const foundProject = projectsToSearch.find(p => p.id === projectId);
      setProject(foundProject || null); 
    }
  }, [projectId]);

  if (project === undefined) {
    return (
      <>
        <Header />
        <main className="flex-grow">
          <Container className="py-16 md:py-24 text-center">
            <p className="text-muted-foreground">Loading project details...</p>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  if (project === null) {
    useEffect(() => {
        router.replace('/projects'); 
    }, [router]);
    return (
         <>
            <Header />
            <main className="flex-grow">
            <Container className="py-16 md:py-24 text-center">
                <h1 className="text-2xl font-bold text-destructive mb-4">Project Not Found</h1>
                <p className="text-muted-foreground mb-6">The project you are looking for does not exist or could not be loaded.</p>
                <Button asChild>
                    <Link href="/projects"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Gallery</Link>
                </Button>
            </Container>
            </main>
            <Footer />
        </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-grow bg-background">
        <Container className="py-12 md:py-20">
          <ScrollAnimationWrapper animationClassName="animate-fade-in">
            <Button variant="outline" asChild className="mb-8 group">
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Gallery
              </Link>
            </Button>
          </ScrollAnimationWrapper>

          <article className="bg-card p-6 sm:p-8 md:p-10 rounded-lg shadow-xl">
            <ScrollAnimationWrapper animationClassName="animate-fade-in-up" delay="100ms">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-primary mb-6">
                {project.title}
              </h1>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper animationClassName="animate-fade-in-up" delay="200ms">
              {project.images && project.images.length > 0 ? (
                <div className="mb-8 shadow-lg rounded-md overflow-hidden max-w-2xl mx-auto">
                   <Carousel className="w-full" opts={{ loop: true }}>
                    <CarouselContent>
                      {project.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="relative w-full aspect-video">
                            <Image
                              src={image.url}
                              alt={`${project.title} - Image ${index + 1}`}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
                              className="object-contain rounded-md" // object-contain to show full image
                              data-ai-hint={image.hint || 'project image detail'}
                              priority={index === 0} 
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {project.images.length > 1 && (
                      <>
                        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background text-foreground" />
                        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background text-foreground" />
                      </>
                    )}
                  </Carousel>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Note: If you don't see the Carousel UI component, you may need to run: <code className="text-xs bg-muted px-1 rounded">npx shadcn-ui@latest add carousel</code> in your project terminal.
                  </p>
                </div>
              ) : (
                <div className="relative w-full aspect-video rounded-md overflow-hidden mb-8 shadow-lg bg-muted max-w-2xl mx-auto flex items-center justify-center">
                    <p className="text-muted-foreground">No images available for this project.</p>
                </div>
              )}
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper animationClassName="animate-fade-in-up" delay="300ms">
              <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-muted-foreground leading-relaxed mb-8">
                <div dangerouslySetInnerHTML={{ __html: project.longDescription.replace(/\n/g, '<br />') }} />
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper animationClassName="animate-fade-in-up" delay="400ms">
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-3">Technologies & Skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper animationClassName="animate-fade-in-up" delay="500ms">
              <div className="flex flex-wrap gap-3">
                {(project.showLiveUrlButton === undefined || project.showLiveUrlButton) && project.liveUrl && (
                  <Button asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                    </a>
                  </Button>
                )}
                {(project.showSourceUrlButton === undefined || project.showSourceUrlButton) && project.sourceUrl && (
                  <Button variant="outline" asChild>
                    <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" /> View Source
                    </a>
                  </Button>
                )}
              </div>
            </ScrollAnimationWrapper>
          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
}
