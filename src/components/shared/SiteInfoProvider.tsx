
"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { DEFAULT_SITE_INFO, LOCALSTORAGE_SITE_INFO_KEY, type SiteInfo } from '@/data/constants';

interface SiteInfoContextType {
  siteInfo: SiteInfo;
  setSiteInfo: (info: SiteInfo) => void; // Allow updating site info for admin panel
}

const SiteInfoContext = createContext<SiteInfoContextType | undefined>(undefined);

export const SiteInfoProvider = ({ children }: { children: ReactNode }) => {
  const [siteInfo, setSiteInfoState] = useState<SiteInfo>(DEFAULT_SITE_INFO);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedInfo = localStorage.getItem(LOCALSTORAGE_SITE_INFO_KEY);
      if (storedInfo) {
        setSiteInfoState(JSON.parse(storedInfo));
      } else {
        setSiteInfoState(DEFAULT_SITE_INFO);
      }
    } catch (error) {
      console.error("Error loading site info from localStorage:", error);
      setSiteInfoState(DEFAULT_SITE_INFO);
    }
    setIsLoaded(true);
  }, []);

  const setSiteInfo = (newInfo: SiteInfo) => {
    setSiteInfoState(newInfo);
    try {
      localStorage.setItem(LOCALSTORAGE_SITE_INFO_KEY, JSON.stringify(newInfo));
    } catch (error) {
      console.error("Error saving site info to localStorage:", error);
    }
  };
  
  // Prevent rendering children until localStorage is loaded to avoid hydration mismatch potential
  if (!isLoaded) {
    return null; 
  }

  return (
    <SiteInfoContext.Provider value={{ siteInfo, setSiteInfo }}>
      {children}
    </SiteInfoContext.Provider>
  );
};

export const useSiteInfo = () => {
  const context = useContext(SiteInfoContext);
  if (context === undefined) {
    throw new Error('useSiteInfo must be used within a SiteInfoProvider');
  }
  return context;
};
