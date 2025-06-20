
"use client"; 

import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { Button } from '@/components/ui/button';
import { Rocket, Menu, X } from 'lucide-react';
import { HEADER_NAV_ITEMS_DATA, type NavItem } from '@/data/constants';
import { useSiteInfo } from '@/components/shared/SiteInfoProvider'; 
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export function Header() {
  const navItems: NavItem[] = HEADER_NAV_ITEMS_DATA;
  const { siteInfo } = useSiteInfo(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false); // Close mobile menu on route change
  }, [pathname]);

  const isHomePage = pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center justify-between py-4">
        <Link href="/" className="flex items-center space-x-2">
          <Rocket className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold text-foreground">
            {siteInfo.websiteName} 
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => (
            <Button 
              key={item.name} 
              variant="link" 
              asChild 
              className={cn(
                "text-foreground hover:text-primary transition-colors text-sm lg:text-base px-2 lg:px-3",
                ((isHomePage && item.href.startsWith('/#') && pathname === '/') || pathname === item.href) && "text-primary font-semibold"
              )}
            >
              <Link href={item.href} target={item.isExternal ? '_blank' : undefined} rel={item.isExternal ? 'noopener noreferrer' : undefined}>
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-foreground" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background p-6">
              <div className="flex flex-col space-y-4 pt-8">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.name}>
                     <Link 
                      href={item.href} 
                      target={item.isExternal ? '_blank' : undefined} 
                      rel={item.isExternal ? 'noopener noreferrer' : undefined}
                      className={cn(
                        "text-lg text-foreground hover:text-primary transition-colors py-2",
                        ((isHomePage && item.href.startsWith('/#') && pathname === '/') || pathname === item.href) && "text-primary font-semibold"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
