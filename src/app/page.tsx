
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
// Import the new ClientServicesLoader instead of ServicesSection directly for this page
import { ClientServicesLoader } from '@/components/sections/ClientServicesLoader'; 
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { AIProjectIdeaGeneratorSection } from '@/components/sections/AIProjectIdeaGeneratorSection';
import { AISkillExplainerSection } from '@/components/sections/AISkillExplainerSection';
import { ContactSection } from '@/components/sections/ContactSection';
// SERVICES_DATA is no longer directly used here for the services section, but might be used by other components or as a fallback within ClientServicesLoader
import { PROJECTS_DATA, TESTIMONIALS_DATA, ATIF_PORTFOLIO_DESCRIPTION } from '@/data/constants';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        {/* Use the ClientServicesLoader to dynamically load services */}
        <ClientServicesLoader /> 
        <ProjectsSection projects={PROJECTS_DATA} />
        <TestimonialsSection testimonials={TESTIMONIALS_DATA} />
        <AIProjectIdeaGeneratorSection atifPortfolioDescription={ATIF_PORTFOLIO_DESCRIPTION} />
        <AISkillExplainerSection atifPortfolioDescription={ATIF_PORTFOLIO_DESCRIPTION} />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
