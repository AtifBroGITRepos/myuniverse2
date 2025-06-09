
"use client";

import { useEffect } from 'react';
import { useSiteInfo } from './SiteInfoProvider';

export function DynamicMetadata() {
  const { siteInfo } = useSiteInfo();

  useEffect(() => {
    if (siteInfo.defaultSeoTitle) {
      document.title = siteInfo.defaultSeoTitle;
    }

    // Update description meta tag
    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }
    if (siteInfo.defaultSeoDescription) {
      descriptionTag.setAttribute('content', siteInfo.defaultSeoDescription);
    }

    // Update Open Graph title
    let ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (!ogTitleTag) {
      ogTitleTag = document.createElement('meta');
      ogTitleTag.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitleTag);
    }
    if (siteInfo.defaultSeoTitle) {
      ogTitleTag.setAttribute('content', siteInfo.defaultSeoTitle);
    }
    
    // Update Open Graph description
    let ogDescriptionTag = document.querySelector('meta[property="og:description"]');
    if (!ogDescriptionTag) {
      ogDescriptionTag = document.createElement('meta');
      ogDescriptionTag.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescriptionTag);
    }
    if (siteInfo.defaultSeoDescription) {
      ogDescriptionTag.setAttribute('content', siteInfo.defaultSeoDescription);
    }

    // Update Open Graph image
    if (siteInfo.ogImageUrl) {
      let ogImageTag = document.querySelector('meta[property="og:image"]');
      if (!ogImageTag) {
        ogImageTag = document.createElement('meta');
        ogImageTag.setAttribute('property', 'og:image');
        document.head.appendChild(ogImageTag);
      }
      ogImageTag.setAttribute('content', siteInfo.ogImageUrl);
    }

    // Update Twitter title
    let twitterTitleTag = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitleTag) {
        twitterTitleTag = document.createElement('meta');
        twitterTitleTag.setAttribute('name', 'twitter:title');
        document.head.appendChild(twitterTitleTag);
    }
    if (siteInfo.defaultSeoTitle) {
        twitterTitleTag.setAttribute('content', siteInfo.defaultSeoTitle);
    }

    // Update Twitter description
    let twitterDescriptionTag = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDescriptionTag) {
        twitterDescriptionTag = document.createElement('meta');
        twitterDescriptionTag.setAttribute('name', 'twitter:description');
        document.head.appendChild(twitterDescriptionTag);
    }
    if (siteInfo.defaultSeoDescription) {
        twitterDescriptionTag.setAttribute('content', siteInfo.defaultSeoDescription);
    }

    // Update Twitter image
    if (siteInfo.ogImageUrl) { // Using ogImageUrl for twitter:image as well
        let twitterImageTag = document.querySelector('meta[name="twitter:image"]');
        if (!twitterImageTag) {
            twitterImageTag = document.createElement('meta');
            twitterImageTag.setAttribute('name', 'twitter:image');
            document.head.appendChild(twitterImageTag);
        }
        twitterImageTag.setAttribute('content', siteInfo.ogImageUrl);
    }


  }, [siteInfo]);

  return null; // This component does not render anything itself
}
