'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCookieConsent } from './CookieConsent';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export function GoogleAnalytics({ measurementId = 'G-XXXXXXXXXX' }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hasConsent } = useCookieConsent();

  useEffect(() => {
    // Load gtag only if consent is given
    if (hasConsent === true) {
      loadGoogleAnalytics(measurementId);
    }
  }, [hasConsent, measurementId]);

  useEffect(() => {
    // Track page views when consent is given
    if (hasConsent === true && typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', measurementId, {
        page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
      });
    }
  }, [pathname, searchParams, hasConsent, measurementId]);

  return null;
}

function loadGoogleAnalytics(measurementId: string) {
  // Check if gtag is already loaded
  if (typeof window !== 'undefined' && window.gtag) {
    return;
  }

  // Create script element
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', {
      page_title: document.title,
      page_location: window.location.href,
    });
  `;

  // Add scripts to head
  document.head.appendChild(script1);
  document.head.appendChild(script2);
}

// Analytics event tracking utilities
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Predefined event tracking functions
export const analytics = {
  // Contact form events
  trackContactFormView: () => trackEvent('view', 'contact_form', 'contact_section'),
  trackContactFormSubmit: (success: boolean) => trackEvent(
    'submit', 
    'contact_form', 
    success ? 'success' : 'error'
  ),

  // Newsletter events
  trackNewsletterView: () => trackEvent('view', 'newsletter', 'newsletter_section'),
  trackNewsletterSubscribe: (success: boolean) => trackEvent(
    'subscribe', 
    'newsletter', 
    success ? 'success' : 'error'
  ),

  // Button click events
  trackButtonClick: (buttonName: string, location: string) => 
    trackEvent('click', 'button', `${buttonName}_${location}`),

  // Feature interaction events
  trackFeatureView: (featureName: string) => 
    trackEvent('view', 'feature', featureName),

  trackFeatureClick: (featureName: string) => 
    trackEvent('click', 'feature', featureName),

  // Pricing events
  trackPricingView: () => trackEvent('view', 'pricing', 'pricing_section'),
  trackPricingClick: (planName: string) => 
    trackEvent('click', 'pricing', planName),

  // Scroll events
  trackScroll: (percentage: number) => 
    trackEvent('scroll', 'engagement', `${percentage}_percent`),

  // Time on page events
  trackTimeOnPage: (seconds: number) => 
    trackEvent('timing_complete', 'engagement', 'time_on_page', seconds),
};

// Custom hooks for analytics
export function useAnalytics() {
  const { hasConsent } = useCookieConsent();

  const isTrackingEnabled = hasConsent === true;

  const trackEventSafe = (action: string, category: string, label?: string, value?: number) => {
    if (isTrackingEnabled) {
      trackEvent(action, category, label, value);
    }
  };

  return {
    isTrackingEnabled,
    trackEvent: trackEventSafe,
    analytics,
  };
}