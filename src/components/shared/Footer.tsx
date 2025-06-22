"use client";

import { useState, useEffect } from 'react';
import { Container } from '@/components/shared/Container';
import { CONTACT_INFO, LOCALSTORAGE_CONTACT_KEY, type ContactDetails, type SocialPlatform } from '@/data/constants';
import { Github, Linkedin, Twitter, Instagram, Facebook, Youtube, Link as LinkIcon, type LucideIcon } from 'lucide-react';

const iconMap: Record<SocialPlatform, LucideIcon> = {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Other: LinkIcon,
};

export function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactDetails>(CONTACT_INFO);

  useEffect(() => {
    try {
      const storedContactInfo = localStorage.getItem(LOCALSTORAGE_CONTACT_KEY);
      if (storedContactInfo) {
        const parsedInfo = JSON.parse(storedContactInfo);
        // Basic validation
        if (parsedInfo && Array.isArray(parsedInfo.socials)) {
          setContactInfo(parsedInfo);
        }
      }
    } catch (error) {
      console.error("Error loading contact info from localStorage for Footer:", error);
    }
  }, []);

  return (
    <footer className="border-t border-border/40 bg-background">
      <Container className="py-8 text-center md:flex md:items-center md:justify-between">
        <div className="flex justify-center space-x-6 md:order-2">
            {contactInfo.socials.map((social) => {
              const Icon = iconMap[social.platform] || LinkIcon;
              return (
                <a 
                  key={social.id} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.platform}
                >
                    <Icon className="h-6 w-6" />
                </a>
              );
            })}
        </div>
        <p className="mt-8 text-sm text-muted-foreground md:order-1 md:mt-0">
          &copy; {new Date().getFullYear()} Atif's Universe. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
