
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SiteInfoProvider } from '@/components/shared/SiteInfoProvider'; // Import the provider
import { DynamicMetadata } from '@/components/shared/DynamicMetadata'; // Import the new component

// This remains the static/default metadata
export const metadata: Metadata = {
  title: "Atif's Universe", // This will be the fallback
  description: "Portfolio of Atif - Full-Stack Developer & UI/UX Enthusiast", // Fallback
  openGraph: {
    title: "Atif's Universe - Portfolio",
    description: "Portfolio of Atif - Full-Stack Developer & UI/UX Enthusiast",
    images: [{ url: 'https://placehold.co/1200x630.png', width: 1200, height: 630 }], // Default OG image
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Atif's Universe - Portfolio",
    description: "Portfolio of Atif - Full-Stack Developer & UI/UX Enthusiast",
    images: ['https://placehold.co/1200x630.png'], // Default Twitter image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Favicon links - user should manage these in public/ and update here if needed */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <SiteInfoProvider> {/* Wrap with the provider */}
          <DynamicMetadata /> {/* Add component to manage dynamic tags */}
          {children}
          <Toaster />
        </SiteInfoProvider>
      </body>
    </html>
  );
}
