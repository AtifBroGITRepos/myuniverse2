import { Container } from '@/components/shared/Container';
import { Github, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <Container className="py-8 text-center md:flex md:items-center md:justify-between">
        <div className="flex justify-center space-x-6 md:order-2">
            <a href="https://github.com/atif" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-6 w-6" />
            </a>
            <a href="https://linkedin.com/in/atif" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-6 w-6" />
            </a>
            <a href="https://twitter.com/atif" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-6 w-6" />
            </a>
        </div>
        <p className="mt-8 text-sm text-muted-foreground md:order-1 md:mt-0">
          &copy; {new Date().getFullYear()} Atif's Universe. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
