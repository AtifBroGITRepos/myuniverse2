
import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
import { HEADER_NAV_ITEMS_DATA, type NavItem } from '@/data/constants'; // Import nav items data

export function Header() {
  // Use the imported nav items data
  const navItems: NavItem[] = HEADER_NAV_ITEMS_DATA;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center justify-between py-4">
        <Link href="/" className="flex items-center space-x-2">
          <Rocket className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold text-foreground">
            Atif's Universe
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => (
            <Button key={item.name} variant="link" asChild className="text-foreground hover:text-primary transition-colors text-sm lg:text-base px-2 lg:px-3">
              <Link href={item.href}>{item.name}</Link>
            </Button>
          ))}
        </nav>
        {/* Mobile menu button can be added here if needed */}
      </Container>
    </header>
  );
}
