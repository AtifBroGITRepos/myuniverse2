
"use client";

import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { ClientAboutSectionLoader } from '@/components/sections/ClientAboutSectionLoader';
import { ClientServicesLoader } from '@/components/sections/ClientServicesLoader'; 
import { ClientProjectsLoader } from '@/components/sections/ClientProjectsLoader';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { AIProjectIdeaGeneratorSection } from '@/components/sections/AIProjectIdeaGeneratorSection';
import { AISkillExplainerSection } from '@/components/sections/AISkillExplainerSection';
import { AIGraphicDesignToolSection } from '@/components/sections/AIGraphicDesignToolSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { TESTIMONIALS_DATA, ATIF_PORTFOLIO_DESCRIPTION } from '@/data/constants';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <ClientAboutSectionLoader />
        <ClientServicesLoader /> 
        <ClientProjectsLoader sectionId="projects" title="My Creations" description="Here's a selection of projects that showcase my skills and passion for building innovative solutions. Each project reflects my commitment to quality and user-centric design." />
        <TestimonialsSection testimonials={TESTIMONIALS_DATA} />
        <AIProjectIdeaGeneratorSection atifPortfolioDescription={ATIF_PORTFOLIO_DESCRIPTION} />
        <AISkillExplainerSection atifPortfolioDescription={ATIF_PORTFOLIO_DESCRIPTION} />
        <AIGraphicDesignToolSection atifPortfolioDescription={ATIF_PORTFOLIO_DESCRIPTION} />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

    