
"use client";

import { useState, useEffect } from 'react';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { SERVICES_DATA, LOCALSTORAGE_SERVICES_KEY, type Service } from '@/data/constants';

export function ClientServicesLoader() {
  // Initialize with default data to ensure SSR compatibility and a fallback
  const [servicesToDisplay, setServicesToDisplay] = useState<Service[]>(SERVICES_DATA);

  useEffect(() => {
    // This effect runs only on the client side after hydration
    try {
      const storedServicesString = localStorage.getItem(LOCALSTORAGE_SERVICES_KEY);
      if (storedServicesString) {
        const storedServices: Service[] = JSON.parse(storedServicesString);
        
        // Validate the structure of the stored services
        if (Array.isArray(storedServices)) {
          if (storedServices.length > 0) {
            const isValidStructure = storedServices.every(
              s => typeof s.id === 'string' && 
                   typeof s.title === 'string' && 
                   typeof s.description === 'string' && 
                   typeof s.iconName === 'string' 
                   // Add more checks if necessary, e.g., for valid iconName values
            );
            if (isValidStructure) {
              setServicesToDisplay(storedServices);
            } else {
              console.warn("Services data from localStorage is malformed. Using default services.");
              setServicesToDisplay(SERVICES_DATA); // Fallback if structure is invalid
            }
          } else {
            // If an empty array is explicitly saved in localStorage, honor it.
            setServicesToDisplay([]);
          }
        } else {
          // If it's not an array, data is malformed.
          console.warn("Stored services data is not an array. Using default services.");
          setServicesToDisplay(SERVICES_DATA);
        }
      }
      // If storedServicesString is null (no item in localStorage), 
      // servicesToDisplay remains SERVICES_DATA from the initial useState.
    } catch (error) {
      console.error("Error loading services from localStorage. Using default services:", error);
      // Fallback to default if JSON.parse fails or any other error occurs
      setServicesToDisplay(SERVICES_DATA);
    }
  }, []); // Empty dependency array ensures this effect runs once on mount

  return <ServicesSection services={servicesToDisplay} />;
}
