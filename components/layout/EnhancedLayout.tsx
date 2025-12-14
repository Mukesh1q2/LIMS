'use client';

import { useState } from 'react';
import { EnhancedTopNavbar } from './EnhancedTopNavbar';
import { Sidebar } from './Sidebar';

interface EnhancedLayoutProps {
  children: React.ReactNode;
  showEnhancedHeader?: boolean;
}

export function EnhancedLayout({ children, showEnhancedHeader = true }: EnhancedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('EN');

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Implement global search functionality
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    // Implement language change functionality
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        {/* Enhanced Top Navbar */}
        <div className="sticky top-0 z-30">
          <EnhancedTopNavbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            notifications={notifications}
            darkMode={darkMode}
            onToggleDarkMode={handleToggleDarkMode}
            language={language}
            onLanguageChange={handleLanguageChange}
          />
        </div>
        
        <main className="p-6 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}