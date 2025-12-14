'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole, Permission } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Permission mapping based on user roles
const rolePermissions: Record<UserRole, Permission[]> = {
  super_admin: [
    { resource: 'students', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'attendance', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'fees', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'library', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'seating', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'reports', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'settings', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'dashboard', actions: ['read'] },
  ],
  admin: [
    { resource: 'students', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'attendance', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'fees', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'library', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'seating', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'reports', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'dashboard', actions: ['read'] },
  ],
  accountant: [
    { resource: 'fees', actions: ['create', 'read', 'update'] },
    { resource: 'reports', actions: ['read'] },
    { resource: 'dashboard', actions: ['read'] },
  ],
  librarian: [
    { resource: 'library', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'students', actions: ['read'] },
    { resource: 'reports', actions: ['read'] },
    { resource: 'dashboard', actions: ['read'] },
  ],
  teacher: [
    { resource: 'students', actions: ['read'] },
    { resource: 'attendance', actions: ['create', 'read', 'update'] },
    { resource: 'reports', actions: ['read'] },
    { resource: 'dashboard', actions: ['read'] },
  ],
  student: [
    { resource: 'profile', actions: ['read', 'update'] },
    { resource: 'library', actions: ['read'] },
    { resource: 'dashboard', actions: ['read'] },
  ],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock authentication - in real app, this would be an API call
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'admin@institute.com',
          name: 'Admin User',
          role: 'super_admin',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          email: 'accountant@institute.com',
          name: 'Accountant User',
          role: 'accountant',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          email: 'librarian@institute.com',
          name: 'Librarian User',
          role: 'librarian',
          createdAt: new Date().toISOString(),
        },
        {
          id: '4',
          email: 'teacher@institute.com',
          name: 'Teacher User',
          role: 'teacher',
          createdAt: new Date().toISOString(),
        },
        {
          id: '5',
          email: 'student@institute.com',
          name: 'Student User',
          role: 'student',
          createdAt: new Date().toISOString(),
        },
      ];

      const foundUser = mockUsers.find(u => u.email === email);
      
      if (foundUser && password === 'password123') {
        const userWithLogin = {
          ...foundUser,
          lastLogin: new Date().toISOString(),
        };
        setUser(userWithLogin);
        localStorage.setItem('user', JSON.stringify(userWithLogin));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;
    
    const permissions = rolePermissions[user.role];
    const resourcePermission = permissions.find(p => p.resource === resource);
    
    return resourcePermission?.actions.includes(action as any) || false;
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      hasPermission,
      hasRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}