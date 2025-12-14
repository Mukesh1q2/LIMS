'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import { handleNavClick, useScrollSpy } from '@/lib/scroll-utils';
import { SkipLink, ScreenReaderOnly, useAriaLabel } from './Accessibility';
import { CookieConsent } from './CookieConsent';
import { GoogleAnalytics } from './Analytics';

const navigationItems = [
  { name: 'Features', href: 'features' },
  { name: 'Pricing', href: 'pricing' },
  { name: 'How it Works', href: 'process' },
  { name: 'Testimonials', href: 'testimonials' },
  { name: 'FAQ', href: 'faq' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Get active section for navigation highlighting
  const sectionIds = navigationItems.map(item => item.href);
  const activeSection = useScrollSpy(sectionIds);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-neutral-200">
      <nav className="container-custom" role="navigation" aria-label="Main navigation">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="font-display font-bold text-xl text-neutral-900">
                LIMS
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={`#${item.href}`}
                onClick={(e) => handleNavClick(e, `#${item.href}`)}
                className={clsx(
                  "text-neutral-600 hover:text-neutral-900 font-medium transition-colors duration-200 relative",
                  activeSection === item.href && "text-primary-600"
                )}
              >
                {item.name}
                {activeSection === item.href && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="#contact" className="btn-ghost" onClick={(e) => handleNavClick(e, '#contact')}>
              Contact Sales
            </Link>
            <Link href="#pricing" className="btn-primary" onClick={(e) => handleNavClick(e, '#pricing')}>
              Start Free Trial
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Open main menu"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-50 bg-white"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
          >
            <h2 id="mobile-menu-title" className="sr-only">Mobile navigation menu</h2>
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">L</span>
                  </div>
                  <span className="font-display font-bold text-xl text-neutral-900">
                    LIMS
                  </span>
                </Link>
                <button
                  type="button"
                  className="p-2 rounded-md text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close mobile menu"
                >
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="space-y-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={`#${item.href}`}
                    className="block text-lg font-medium text-neutral-900 hover:text-primary-600 transition-colors duration-200"
                    onClick={(e) => {
                      handleNavClick(e, `#${item.href}`);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                <Link 
                  href="#contact" 
                  className="block w-full btn-secondary text-center"
                  onClick={(e) => {
                    handleNavClick(e, '#contact');
                    setMobileMenuOpen(false);
                  }}
                >
                  Contact Sales
                </Link>
                <Link 
                  href="#pricing" 
                  className="block w-full btn-primary text-center"
                  onClick={(e) => {
                    handleNavClick(e, '#pricing');
                    setMobileMenuOpen(false);
                  }}
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={clsx("bg-neutral-900 text-white", className)}>
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="font-display font-bold text-xl">LIMS</span>
            </div>
            <p className="text-neutral-400 mb-6 max-w-md">
              The intelligent management system for modern educational institutes. 
              Streamline operations, enhance student experience, and drive growth with AI-powered automation.
            </p>
            <div className="flex space-x-4">
              {/* Social links would go here */}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <nav role="navigation" aria-label="Product links">
            <ul className="space-y-3 text-neutral-400">
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#testimonials" className="hover:text-white transition-colors">Testimonials</Link></li>
              <li><Link href="#faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
            </nav>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <nav role="navigation" aria-label="Company links">
            <ul className="space-y-3 text-neutral-400">
              <li><Link href="#about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="#privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
            </nav>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm">
              © 2025 LIMS. All rights reserved.
            </p>
            <p className="text-neutral-400 text-sm mt-4 md:mt-0">
              Made with ❤️ for educational institutions worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const mainHeading = useAriaLabel('Main content', 'Main content area containing page information');
  
  return (
    <div className="min-h-screen">
      {/* Google Analytics - Will only load with user consent */}
      <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
      
      {/* Skip Links for Keyboard Navigation */}
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#main-navigation">Skip to main navigation</SkipLink>
      
      <Header />
      <main id="main-content" className="outline-none" role="main">
        <ScreenReaderOnly>
          <h1>{mainHeading}</h1>
        </ScreenReaderOnly>
        {children}
      </main>
      <Footer />
      
      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
}