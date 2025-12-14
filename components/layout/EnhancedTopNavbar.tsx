'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  BellIcon,
  GlobeAltIcon,
  SunIcon,
  MoonIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ArrowUpIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

// Enhanced Top Navbar Component
interface TopNavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notifications: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
}

export function EnhancedTopNavbar({
  searchQuery,
  onSearchChange,
  notifications,
  darkMode,
  onToggleDarkMode,
  language,
  onLanguageChange,
}: TopNavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();

  const notificationItems = [
    { id: 1, title: 'New student admission', time: '5 min ago', read: false },
    { id: 2, title: 'Fee payment received', time: '15 min ago', read: false },
    { id: 3, title: 'Book overdue reminder', time: '1 hour ago', read: true },
    { id: 4, title: 'System backup completed', time: '2 hours ago', read: true },
  ];

  const unreadCount = notificationItems.filter(n => !n.read).length;

  return (
    <div className="bg-white border-b border-neutral-200 px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search students, books, invoices, seats, lockers, attendance..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-neutral-50 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3 ml-6">
          {/* Global Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 rounded-full transition-colors"
            >
              <BellIcon className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-neutral-200 z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-neutral-200">
                  <h3 className="text-lg font-semibold text-neutral-900">Notifications</h3>
                </div>
                <div className="py-2">
                  {notificationItems.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "px-4 py-3 hover:bg-neutral-50 cursor-pointer transition-colors",
                        !notification.read && "bg-blue-50 border-l-4 border-l-blue-500"
                      )}
                    >
                      <p className="text-sm text-neutral-900 font-medium">{notification.title}</p>
                      <p className="text-xs text-neutral-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-neutral-200">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center space-x-1 px-3 py-2 text-neutral-600 hover:text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
            >
              <GlobeAltIcon className="w-5 h-5" />
              <span className="text-sm font-medium">{language}</span>
            </button>

            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-neutral-200 z-50">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onLanguageChange('EN');
                      setShowLanguageMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      onLanguageChange('हिं');
                      setShowLanguageMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                  >
                    हिंदी
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 rounded-full transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'AU'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-neutral-900">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-neutral-500 capitalize">
                  {user?.role?.replace('_', ' ') || 'Super Admin'}
                </p>
              </div>
              <ArrowUpIcon className="w-4 h-4 text-neutral-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 z-50">
                <div className="py-2">
                  <div className="px-4 py-3 border-b border-neutral-200">
                    <p className="text-sm font-medium text-neutral-900">{user?.name || 'Admin User'}</p>
                    <p className="text-xs text-neutral-500">{user?.email || 'admin@lims.com'}</p>
                  </div>
                  <a href="/profile" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                    Profile Settings
                  </a>
                  <a href="/account" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                    Account Settings
                  </a>
                  <a href="/help" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                    Help & Support
                  </a>
                  <hr className="my-2" />
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Role-based Dashboard Access Component
interface DashboardAccessProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function DashboardAccess({ children, requiredRole = 'admin' }: DashboardAccessProps) {
  const { user, hasPermission } = useAuth();

  // Check if user has permission to access dashboard
  const hasAccess = hasPermission('dashboard', 'read');

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BellIcon className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Access Denied</h2>
          <p className="text-neutral-600 mb-4">
            You don't have permission to access the dashboard.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Global Search Component
interface GlobalSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: (query: string) => void;
}

export function GlobalSearch({ query, onQueryChange, onSearch }: GlobalSearchProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchSuggestions = [
    'Student ID 1234',
    'Rahul Kumar',
    'Fee payment December 2025',
    'Data Structures book',
    'Seat A-15',
    'Locker 25',
    'Morning attendance today',
    'Overdue books',
  ];

  useEffect(() => {
    if (query.length > 2) {
      const filtered = searchSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [query, searchSuggestions]);

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          placeholder="Search across all modules..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-neutral-50 focus:bg-white transition-colors"
        />
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-neutral-200 z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSearch(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <MagnifyingGlassIcon className="w-4 h-4 text-neutral-400" />
                <span className="text-sm text-neutral-700">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}