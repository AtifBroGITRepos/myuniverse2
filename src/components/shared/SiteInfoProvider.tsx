
"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { DEFAULT_SITE_INFO, LOCALSTORAGE_SITE_INFO_KEY, type SiteInfo } from '@/data/constants';

interface SiteInfoContextType {
  siteInfo: SiteInfo;
  setSiteInfo: (info: SiteInfo) => void;
}

const SiteInfoContext = createContext<SiteInfoContextType | undefined>(undefined);

export const SiteInfoProvider = ({ children }: { children: ReactNode }) => {
  const [siteInfo, setSiteInfoState] = useState<SiteInfo>(DEFAULT_SITE_INFO);
  // Removed isLoaded state.
  // Server will use DEFAULT_SITE_INFO.
  // Client will update with localStorage info in useEffect.

  useEffect(() => {
    // This effect runs only on the client.
    try {
      const storedInfo = localStorage.getItem(LOCALSTORAGE_SITE_INFO_KEY);
      if (storedInfo) {
        // Ensure that we only update if the stored info is different from the default
        // to avoid unnecessary re-renders if localStorage is empty or matches default.
        const parsedInfo = JSON.parse(storedInfo);
        if (JSON.stringify(parsedInfo) !== JSON.stringify(siteInfo)) {
            setSiteInfoState(parsedInfo);
        }
      }
      // If nothing in localStorage, it remains DEFAULT_SITE_INFO from useState.
    } catch (error) {
      console.error("Error loading site info from localStorage:", error);
      // Fallback to default if parsing fails and it's different from current
      if (JSON.stringify(DEFAULT_SITE_INFO) !== JSON.stringify(siteInfo)) {
        setSiteInfoState(DEFAULT_SITE_INFO);
      }
    }
  // Only depend on siteInfo itself if you need to re-run if it changes externally,
  // but for initial load, empty array is typical.
  // However, to ensure it reacts if DEFAULT_SITE_INFO changes during dev HMR or similar,
  // or to re-verify if siteInfo somehow got out of sync, we can compare.
  // For this specific purpose (load from localStorage once), an empty dependency array is fine.
  }, []);

  const setSiteInfoContext = (newInfo: SiteInfo) => {
    setSiteInfoState(newInfo);
    try {
      localStorage.setItem(LOCALSTORAGE_SITE_INFO_KEY, JSON.stringify(newInfo));
    } catch (error) {
      console.error("Error saving site info to localStorage:", error);
    }
  };

  return (
    <SiteInfoContext.Provider value={{ siteInfo, setSiteInfo: setSiteInfoContext }}>
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
