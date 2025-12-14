'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Handle smooth scrolling for anchor links
    const handleClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      const href = target.getAttribute('href');
      
      if (href?.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };

    // Add event listener for all anchor links
    const links = document.querySelectorAll('a[href^=\"#\"]');
    links.forEach(link => {
      link.addEventListener('click', handleClick);
    });

    // Cleanup
    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleClick);
      });
    };
  }, []);

  return (
    <>
      {/* Import all sections - these will be handled by the main page component */}
      <div id="home" className="min-h-screen" />
      <div id="features" className="min-h-screen" />
      <div id="benefits" className="min-h-screen" />
      <div id="process" className="min-h-screen" />
      <div id="pricing" className="min-h-screen" />
      <div id="testimonials" className="min-h-screen" />
      <div id="faq" className="min-h-screen" />
      <div id="contact" className="min-h-screen" />
    </>
  );
}