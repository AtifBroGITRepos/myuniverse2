import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { AIProjectIdeaGeneratorSection } from '@/components/sections/AIProjectIdeaGeneratorSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { PROJECTS_DATA, ATIF_PORTFOLIO_DESCRIPTION } from '@/data/constants';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <ProjectsSection projects={PROJECTS_DATA} />
        <AIProjectIdeaGeneratorSection atifPortfolioDescription={ATIF_PORTFOLIO_DESCRIPTION} />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
