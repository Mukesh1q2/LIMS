'use client';

import Link from 'next/link';
import { 
  UserPlusIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

const quickActions = [
  {
    title: 'Add Student',
    description: 'Register a new student',
    href: '/students/add',
    icon: UserPlusIcon,
    color: 'bg-blue-500 hover:bg-blue-600',
    permission: { resource: 'students', action: 'create' },
  },
  {
    title: 'Generate Receipt',
    description: 'Create fee receipt',
    href: '/fees/receipt',
    icon: DocumentTextIcon,
    color: 'bg-emerald-500 hover:bg-emerald-600',
    permission: { resource: 'fees', action: 'create' },
  },
  {
    title: 'Mark Attendance',
    description: 'Record daily attendance',
    href: '/attendance/mark',
    icon: ClipboardDocumentListIcon,
    color: 'bg-amber-500 hover:bg-amber-600',
    permission: { resource: 'attendance', action: 'create' },
  },
  {
    title: 'Issue Book',
    description: 'Issue book to student',
    href: '/library/issue',
    icon: BookOpenIcon,
    color: 'bg-purple-500 hover:bg-purple-600',
    permission: { resource: 'library', action: 'create' },
  },
];

export function QuickActions() {
  const { hasPermission } = useAuth();

  const filteredActions = quickActions.filter(action =>
    hasPermission(action.permission.resource, action.permission.action)
  );

  if (filteredActions.length === 0) {
    return null;
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredActions.map((action) => {
          const IconComponent = action.icon;
          
          return (
            <Link
              key={action.title}
              href={action.href}
              className="group block p-4 rounded-lg border border-neutral-200 hover:border-neutral-300 hover:shadow-hover transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg text-white ${action.color} transition-colors`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 group-hover:text-primary-600">
                    {action.title}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}