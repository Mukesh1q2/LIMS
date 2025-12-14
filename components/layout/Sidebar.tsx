'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CurrencyRupeeIcon,
  BookOpenIcon,
  MapIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { cn, getInitials, getAvatarColor } from '@/lib/utils';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    permission: { resource: 'dashboard', action: 'read' },
  },
  {
    name: 'Students',
    href: '/students',
    icon: UserGroupIcon,
    permission: { resource: 'students', action: 'read' },
  },
  {
    name: 'Attendance',
    href: '/attendance',
    icon: ClipboardDocumentListIcon,
    permission: { resource: 'attendance', action: 'read' },
  },
  {
    name: 'Fees',
    href: '/fees',
    icon: CurrencyRupeeIcon,
    permission: { resource: 'fees', action: 'read' },
  },
  {
    name: 'Library',
    href: '/library',
    icon: BookOpenIcon,
    permission: { resource: 'library', action: 'read' },
  },
  {
    name: 'Seating',
    href: '/seating',
    icon: MapIcon,
    permission: { resource: 'seating', action: 'read' },
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: ChartBarIcon,
    permission: { resource: 'reports', action: 'read' },
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Cog6ToothIcon,
    permission: { resource: 'settings', action: 'read' },
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { hasPermission } = useAuth();

  const filteredItems = navigationItems.filter(item => 
    hasPermission(item.permission.resource, item.permission.action)
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-6 border-b border-neutral-800">
          <h1 className="text-xl font-bold text-white">LIMS</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200",
                  isActive
                    ? "bg-primary-900 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-neutral-800">
          <div className="flex items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium",
              getAvatarColor('Admin User')
            )}>
              AU
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-neutral-400">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface HeaderProps {
  onMenuClick: () => void;
  showEnhancedHeader?: boolean;
}

export function Header({ onMenuClick, showEnhancedHeader = false }: HeaderProps) {
  const { user, logout } = useAuth();

  // If enhanced header is requested, return enhanced version
  if (showEnhancedHeader) {
    return (
      <div className="bg-white border-b border-neutral-200">
        {/* Enhanced header is handled by EnhancedTopNavbar component */}
        {/* This placeholder ensures backward compatibility */}
      </div>
    );
  }

  // Original simple header for backward compatibility
  return (
    <header className="bg-white border-b border-neutral-200 h-16">
      <div className="flex items-center justify-between h-full px-6">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        {/* Page title */}
        <div className="flex-1 lg:flex-none">
          <h1 className="text-xl font-semibold text-neutral-900">
            Library & Institute Management System
          </h1>
        </div>

        {/* User menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM15 17H9a4 4 0 01-4-4V5a4 4 0 014-4h6a4 4 0 014 4v8a4 4 0 01-4 4z" />
            </svg>
          </button>

          {/* User dropdown */}
          <div className="relative">
            <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-50">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium",
                getAvatarColor(user?.name || 'User')
              )}>
                {getInitials(user?.name || 'User')}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
                <p className="text-xs text-neutral-500 capitalize">{user?.role.replace('_', ' ')}</p>
              </div>
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 rounded-full"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}