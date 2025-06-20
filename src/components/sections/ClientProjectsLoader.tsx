
"use client";

import { useState, useEffect } from 'react';
import { ProjectsSection } from '@/components/sections/ProjectsSection'; // This component will now be simpler
import { PROJECTS_DATA, LOCALSTORAGE_PROJECTS_KEY, type Project } from '@/data/constants';
import { Container } from '@/components/shared/Container';

interface ClientProjectsLoaderProps {
  sectionId?: string;
  title?: string;
  description?: string;
  isGalleryPage?: boolean; // To control "View Details" button visibility in ProjectCard
}

export function ClientProjectsLoader({ 
    sectionId, 
    title = "My Creations", 
    description = "Here's a selection of projects...",
    isGalleryPage = false
}: ClientProjectsLoaderProps) {
  const [projectsToDisplay, setProjectsToDisplay] = useState<Project[]>(PROJECTS_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedProjectsString = localStorage.getItem(LOCALSTORAGE_PROJECTS_KEY);
      if (storedProjectsString) {
        const storedProjects: Project[] = JSON.parse(storedProjectsString);
        
        if (Array.isArray(storedProjects)) {
          // Ensure boolean flags have default values if missing from localStorage
           const projectsWithDefaults = storedProjects.map(p => ({
            ...p,
            showLiveUrlButton: p.showLiveUrlButton === undefined ? true : p.showLiveUrlButton,
            showSourceUrlButton: p.showSourceUrlButton === undefined ? true : p.showSourceUrlButton,
          }));

          if (projectsWithDefaults.length > 0 && projectsWithDefaults.every(p => typeof p.id === 'string')) {
             setProjectsToDisplay(projectsWithDefaults);
          } else if (projectsWithDefaults.length === 0) {
            setProjectsToDisplay([]); // Honor empty array if explicitly saved
          } else {
            console.warn("Projects data from localStorage is malformed or incomplete. Using default projects.");
            setProjectsToDisplay(PROJECTS_DATA);
          }
        } else {
          console.warn("Stored projects data is not an array. Using default projects.");
          setProjectsToDisplay(PROJECTS_DATA);
        }
      } else {
         // No data in local storage, use defaults
         setProjectsToDisplay(PROJECTS_DATA);
      }
    } catch (error) {
      console.error("Error loading projects from localStorage. Using default projects:", error);
      setProjectsToDisplay(PROJECTS_DATA);
    }
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

  // ProjectsSection will now be simpler, mostly for layout, and will receive projects from here.
  // The title and description are passed to ProjectsSection, which is now a more generic display component.
  return <ProjectsSection projects={projectsToDisplay} sectionId={sectionId} title={title} description={description} isGalleryPage={isGalleryPage} />;
}
