import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { AIProjectIdeaGeneratorSection } from '@/components/sections/AIProjectIdeaGeneratorSection';
import { AISkillExplainerSection } from '@/components/sections/AISkillExplainerSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { PROJECTS_DATA, TESTIMONIALS_DATA, ATIF_PORTFOLIO_DESCRIPTION } from '@/data/constants';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
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
