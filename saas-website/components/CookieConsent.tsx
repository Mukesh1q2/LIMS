'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface CookieConsentProps {
  className?: string;
}

export function CookieConsent({ className }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = localStorage.getItem('cookie-consent');
    if (!hasConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('cookie-consent', 'accepted');
      localStorage.setItem('cookie-consent-date', new Date().toISOString());
      
      // Initialize analytics if needed
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      }
      
      setIsVisible(false);
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={clsx(
      "fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-lg",
      "transform transition-transform duration-300 ease-out",
      className
    )}>
      <div className="container-custom py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-900 mb-2">
              We use cookies to enhance your experience
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              We use cookies and similar technologies to analyze website traffic, 
              personalize content, and provide social media features. By clicking "Accept All", 
              you consent to our use of cookies. 
              <a 
                href="#privacy" 
                className="text-primary-600 hover:text-primary-700 underline ml-1"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#privacy')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn more about our Privacy Policy
              </a>
            </p>
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={handleDecline}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={handleAccept}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Loading...' : 'Accept All'}
            </button>
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="p-2 text-neutral-400 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md transition-colors"
              aria-label="Close cookie banner"
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook to check cookie consent status
export function useCookieConsent() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    setHasConsent(consent === 'accepted');
  }, []);

  const updateConsent = (accepted: boolean) => {
    localStorage.setItem('cookie-consent', accepted ? 'accepted' : 'declined');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setHasConsent(accepted);
  };

  return {
    hasConsent,
    updateConsent,
    hasMadeChoice: hasConsent !== null
  };
}