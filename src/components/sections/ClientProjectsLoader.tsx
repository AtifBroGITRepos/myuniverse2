
"use client";

import { useState, useEffect } from 'react';
import { ProjectsSection } from '@/components/sections/ProjectsSection'; 
import { PROJECTS_DATA, LOCALSTORAGE_PROJECTS_KEY, type Project, type ProjectImage } from '@/data/constants';
import { Container } from '@/components/shared/Container';

interface ClientProjectsLoaderProps {
  sectionId?: string;
  title?: string;
  description?: string;
  isGalleryPage?: boolean; 
}

export function ClientProjectsLoader({ 
    sectionId, 
    title = "My Creations", 
    description = "Here's a selection of projects...",
    isGalleryPage = false
}: ClientProjectsLoaderProps) {
  const [projectsToDisplay, setProjectsToDisplay] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let loadedProjects: Project[] = PROJECTS_DATA.map(p => {
        // Ensure default structure for default data
        const images = (p.images && p.images.length > 0) 
          ? p.images 
          : (p.imageUrl ? [{ url: p.imageUrl, hint: p.imageHint || 'project image' }] : [{ url: 'https://placehold.co/800x450.png', hint: 'project placeholder' }]);
        const { imageUrl, imageHint, ...restOfP } = p;
        return {
          ...restOfP,
          images,
          showLiveUrlButton: p.showLiveUrlButton === undefined ? true : p.showLiveUrlButton,
          showSourceUrlButton: p.showSourceUrlButton === undefined ? true : p.showSourceUrlButton,
        };
    });

    try {
      const storedProjectsString = localStorage.getItem(LOCALSTORAGE_PROJECTS_KEY);
      if (storedProjectsString) {
        const storedProjects: Project[] = JSON.parse(storedProjectsString);
        
        if (Array.isArray(storedProjects)) {
           const projectsWithMigrationAndDefaults = storedProjects.map(p => {
              let currentImages: ProjectImage[] = p.images || [];
              // Migrate old single image structure to new multiple image structure
              if (p.imageUrl && (!p.images || p.images.length === 0)) {
                  currentImages = [{ url: p.imageUrl, hint: p.imageHint || 'migrated image' }];
              }
              // Ensure there's at least one placeholder image if array is empty
              if (currentImages.length === 0) {
                  currentImages = [{ url: 'https://placehold.co/800x450.png', hint: 'project placeholder' }];
              }
              
              // Remove deprecated fields to avoid confusion
              const { imageUrl, imageHint, ...restOfP } = p;

              return {
                ...restOfP,
                images: currentImages,
                showLiveUrlButton: p.showLiveUrlButton === undefined ? true : p.showLiveUrlButton,
                showSourceUrlButton: p.showSourceUrlButton === undefined ? true : p.showSourceUrlButton,
              };
          });

          if (projectsWithMigrationAndDefaults.length > 0 && projectsWithMigrationAndDefaults.every(p => typeof p.id === 'string')) {
             loadedProjects = projectsWithMigrationAndDefaults;
          } else if (projectsWithMigrationAndDefaults.length === 0) {
            loadedProjects = []; 
          }
        } else {
          console.warn("Stored projects data is not an array. Using default projects.");
        }
      }
    } catch (error) {
      console.error("Error loading projects from localStorage. Using default projects:", error);
    }
    setProjectsToDisplay(loadedProjects);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <section id={sectionId} className="py-16 md:py-24 bg-secondary/10">
        <Container className="text-center">
          <p className="text-muted-foreground">Loading projects...</p>
        </Container>
      </section>
    );
  }

  return <ProjectsSection projects={projectsToDisplay} sectionId={sectionId} title={title} description={description} isGalleryPage={isGalleryPage} />;
}
