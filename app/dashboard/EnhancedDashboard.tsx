'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon,
  UserPlusIcon,
  UserMinusIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  BookOpenIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  ArchiveBoxIcon,
  BellIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartPieIcon,
  MapIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { Layout } from '@/components/layout/Sidebar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { AlertsList } from '@/components/dashboard/AlertsList';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { mockDashboardStats, mockAlerts } from '@/lib/mockData';
import { Alert, DashboardStats } from '@/types';

// Types for enhanced dashboard
interface ActivityItem {
  id: string;
  type: 'admission' | 'payment' | 'book' | 'seat' | 'locker' | 'attendance' | 'alert';
  description: string;
  timestamp: Date;
  user?: string;
  amount?: number;
}

interface QuickAction {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  action: () => void;
  color: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'admission',
    description: 'New student admission - Rahul Kumar (Morning Shift)',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    user: 'Admin User',
  },
  {
    id: '2',
    type: 'payment',
    description: 'Fee payment received - ₹2,500 from Priya Sharma',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    amount: 2500,
    user: 'Accountant',
  },
  {
    id: '3',
    type: 'book',
    description: 'Book issued - "Data Structures" to Student ID 1234',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    user: 'Librarian',
  },
  {
    id: '4',
    type: 'seat',
    description: 'Seat assigned - Seat A-15 to student 1235',
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    user: 'Admin User',
  },
  {
    id: '5',
    type: 'alert',
    description: 'Overdue book reminder sent to 8 students',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
  },
];



const mockQuickActions: QuickAction[] = [
  {
    id: 'add-student',
    title: 'Add New Student',
    icon: UserPlusIcon,
    action: () => console.log('Add student'),
    color: 'bg-blue-500',
  },
  {
    id: 'mark-attendance',
    title: 'Mark Attendance',
    icon: ClipboardDocumentListIcon,
    action: () => console.log('Mark attendance'),
    color: 'bg-green-500',
  },
  {
    id: 'add-fee',
    title: 'Add Fee Payment',
    icon: CurrencyRupeeIcon,
    action: () => console.log('Add fee payment'),
    color: 'bg-emerald-500',
  },
  {
    id: 'issue-book',
    title: 'Issue a Book',
    icon: BookOpenIcon,
    action: () => console.log('Issue book'),
    color: 'bg-purple-500',
  },
  {
    id: 'assign-seat',
    title: 'Assign Seat',
    icon: MapIcon,
    action: () => console.log('Assign seat'),
    color: 'bg-orange-500',
  },
  {
    id: 'add-expense',
    title: 'Add Library Expense',
    icon: ArchiveBoxIcon,
    action: () => console.log('Add expense'),
    color: 'bg-red-500',
  },
];

// Enhanced components
const TopNavbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="bg-white border-b border-neutral-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search students, books, invoices, seats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4 ml-6">
          {/* Global Notifications */}
          <button className="relative p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 rounded-full">
            <BellIcon className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button className="flex items-center space-x-1 p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 rounded-lg">
              <GlobeAltIcon className="w-5 h-5" />
              <span className="text-sm font-medium">{language}</span>
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 rounded-full"
          >
            {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-50"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                AU
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-neutral-900">Admin User</p>
                <p className="text-xs text-neutral-500">Super Admin</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 z-50">
                <div className="py-2">
                  <a href="#" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">Profile Settings</a>
                  <a href="#" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">Account Settings</a>
                  <a href="#" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">Help & Support</a>
                  <hr className="my-2" />
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral-50">Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const KPICards: React.FC<{ stats: DashboardStats }> = ({ stats }) => {
  const kpiCards = [
    // Row 1
    {
      title: 'Total Students',
      value: stats.totalStudents.toString(),
      change: '+12% from last month',
      changeType: 'increase' as const,
      icon: UserGroupIcon,
      color: 'blue',
    },
    {
      title: 'Morning Shift (Today)',
      value: stats.morningShiftCount.toString(),
      change: `${Math.round((stats.morningShiftCount / stats.totalStudents) * 100)}% of total`,
      changeType: 'neutral' as const,
      icon: ClockIcon,
      color: 'green',
    },
    {
      title: 'Evening Shift (Today)',
      value: stats.eveningShiftCount.toString(),
      change: `${Math.round((stats.eveningShiftCount / stats.totalStudents) * 100)}% of total`,
      changeType: 'neutral' as const,
      icon: ClockIcon,
      color: 'purple',
    },
    {
      title: 'Students Who Left',
      value: stats.studentsLeft.toString(),
      change: '-3 from last month',
      changeType: 'decrease' as const,
      icon: UserMinusIcon,
      color: 'red',
    },

    // Row 2
    {
      title: 'Total Fees Collected',
      value: `₹${(stats.totalFeesCollected / 100000).toFixed(1)}L`,
      change: '+15% from last month',
      changeType: 'increase' as const,
      icon: CurrencyRupeeIcon,
      color: 'emerald',
    },
    {
      title: 'Pending Fees',
      value: `₹${(stats.pendingFees / 1000).toFixed(0)}K`,
      change: `${stats.pendingFeesCount} students`,
      changeType: 'neutral' as const,
      icon: ExclamationTriangleIcon,
      color: 'amber',
    },
    {
      title: 'Advance Payments',
      value: `₹${(stats.advancePayments / 1000).toFixed(0)}K`,
      change: '+8% from last month',
      changeType: 'increase' as const,
      icon: CurrencyRupeeIcon,
      color: 'teal',
    },
    {
      title: 'Library Expenses',
      value: `₹${(stats.libraryExpenses.monthly / 1000).toFixed(0)}K`,
      change: 'This month',
      changeType: 'neutral' as const,
      icon: BookOpenIcon,
      color: 'indigo',
    },

    // Row 3
    {
      title: 'Books Issued Today',
      value: stats.booksIssuedToday.toString(),
      change: '+5 from yesterday',
      changeType: 'increase' as const,
      icon: BookOpenIcon,
      color: 'cyan',
    },
    {
      title: 'Books Overdue',
      value: stats.overdueBooks.toString(),
      change: 'Require attention',
      changeType: 'increase' as const,
      icon: ExclamationTriangleIcon,
      color: 'rose',
    },
    {
      title: 'Seats Occupied',
      value: stats.seatsOccupied.toString(),
      change: `${Math.round((stats.seatsOccupied / 300) * 100)}% capacity`,
      changeType: 'neutral' as const,
      icon: MapIcon,
      color: 'orange',
    },
    {
      title: 'Lockers Assigned',
      value: stats.lockersAssigned.toString(),
      change: `${Math.round((stats.lockersAssigned / 200) * 100)}% of lockers`,
      changeType: 'neutral' as const,
      icon: ArchiveBoxIcon,
      color: 'lime',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.slice(0, 4).map((card, index) => (
          <StatsCard 
            key={index} 
            title={card.title}
            value={card.value}
            change={card.change}
            changeType={card.changeType}
            icon={<card.icon className="w-6 h-6" />}
            color={card.color as any}
          />
        ))}
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.slice(4, 8).map((card, index) => (
          <StatsCard 
            key={index + 4}
            title={card.title}
            value={card.value}
            change={card.change}
            changeType={card.changeType}
            icon={<card.icon className="w-6 h-6" />}
            color={card.color as any}
          />
        ))}
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.slice(8, 12).map((card, index) => (
          <StatsCard 
            key={index + 8}
            title={card.title}
            value={card.value}
            change={card.change}
            changeType={card.changeType}
            icon={<card.icon className="w-6 h-6" />}
            color={card.color as any}
          />
        ))}
      </div>
    </div>
  );
};

const ChartsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Attendance Trends */}
      <div className="lg:col-span-2">
        <ChartCard
          title="Attendance Trends"
          description="Daily attendance for the past 30 days (Morning vs Evening)"
          chartType="line"
        />
      </div>

      {/* Fee Collection */}
      <ChartCard
        title="Fee Collection"
        description="Monthly fee collection trends"
        chartType="bar"
      />

      {/* Library Usage */}
      <ChartCard
        title="Library Usage Statistics"
        description="Books issued, returned, overdue, and reserved"
        chartType="pie"
      />

      {/* Seat & Locker Utilization */}
      <ChartCard
        title="Seat & Locker Utilization"
        description="Current utilization by type"
        chartType="pie"
      />

      {/* Expense Breakdown */}
      <ChartCard
        title="Expense Breakdown"
        description="Monthly expense categories"
        chartType="bar"
      />
    </div>
  );
};

const RecentActivityFeed: React.FC<{ activities: ActivityItem[] }> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'admission': return UserPlusIcon;
      case 'payment': return CurrencyRupeeIcon;
      case 'book': return BookOpenIcon;
      case 'seat': return MapIcon;
      case 'locker': return ArchiveBoxIcon;
      case 'attendance': return ClipboardDocumentListIcon;
      case 'alert': return ExclamationTriangleIcon;
      default: return ClockIcon;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'admission': return 'text-green-500 bg-green-50';
      case 'payment': return 'text-blue-500 bg-blue-50';
      case 'book': return 'text-purple-500 bg-purple-50';
      case 'seat': return 'text-orange-500 bg-orange-50';
      case 'locker': return 'text-indigo-500 bg-indigo-50';
      case 'attendance': return 'text-teal-500 bg-teal-50';
      case 'alert': return 'text-red-500 bg-red-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">Recent Activity</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          const colorClass = getActivityColor(activity.type);

          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-900">{activity.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs text-neutral-500">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                  {activity.user && (
                    <>
                      <span className="text-xs text-neutral-300">•</span>
                      <p className="text-xs text-neutral-500">{activity.user}</p>
                    </>
                  )}
                  {activity.amount && (
                    <>
                      <span className="text-xs text-neutral-300">•</span>
                      <p className="text-xs font-medium text-green-600">₹{activity.amount}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AlertsPanel: React.FC<{ alerts: Alert[] }> = ({ alerts }) => {
  const getAlertColor = (type: string, severity: string) => {
    if (severity === 'high') return 'border-l-red-500 bg-red-50';
    if (severity === 'medium') return 'border-l-orange-500 bg-orange-50';
    if (severity === 'low') return 'border-l-blue-500 bg-blue-50';
    return 'border-l-gray-500 bg-gray-50';
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'overdue_books': return ExclamationTriangleIcon;
      case 'pending_fees': return ClockIcon;
      case 'low_attendance': return UserGroupIcon;
      case 'general': return BellIcon;
      default: return BellIcon;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">Alerts & Notifications</h3>
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {alerts.filter(a => a.severity === 'high' && !a.isRead).length} Action Required
        </span>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => {
          const Icon = getAlertIcon(alert.type);
          const colorClass = getAlertColor(alert.type, alert.severity);

          return (
            <div key={alert.id} className={`p-4 border-l-4 rounded-r-lg ${colorClass}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Icon className="w-5 h-5 mt-0.5 text-neutral-600" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-neutral-900">{alert.title}</h4>
                    <p className="text-sm text-neutral-600 mt-1">{alert.message}</p>
                    <p className="text-xs text-neutral-500 mt-2">
                      {formatTimeAgo(new Date(alert.createdAt))}
                    </p>
                  </div>
                </div>
                {alert.severity === 'high' && !alert.isRead && (
                  <button className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full hover:bg-red-200 transition-colors">
                    Action
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-200">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All Notifications
        </button>
      </div>
    </div>
  );
};

const QuickActionsPanel: React.FC<{ actions: QuickAction[] }> = ({ actions }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-6">Quick Actions</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          
          return (
            <button
              key={action.id}
              onClick={action.action}
              className="flex flex-col items-center p-4 rounded-lg border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all duration-200 group"
            >
              <div className={`p-3 rounded-full ${action.color} text-white mb-3 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-neutral-900 text-center leading-tight">
                {action.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const InteractiveWidgets: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Student Distribution Map */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Student Distribution</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Morning Shift</span>
            <span className="text-sm font-medium text-green-600">750 (60%)</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Evening Shift</span>
            <span className="text-sm font-medium text-purple-600">500 (40%)</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '40%' }}></div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Dropped Out</span>
            <span className="text-sm font-medium text-red-600">25 (2%)</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div className="bg-red-500 h-2 rounded-full" style={{ width: '2%' }}></div>
          </div>
        </div>
      </div>

      {/* Seat Map Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Seat Map Preview</h3>
        <div className="grid grid-cols-6 gap-1">
          {Array.from({ length: 30 }, (_, i) => {
            const isOccupied = Math.random() > 0.3;
            const isLocker = Math.random() > 0.8;
            return (
              <div
                key={i}
                className={`w-6 h-6 rounded border ${
                  isOccupied 
                    ? 'bg-red-300 border-red-400' 
                    : isLocker 
                    ? 'bg-blue-300 border-blue-400' 
                    : 'bg-green-300 border-green-400'
                }`}
                title={isOccupied ? 'Occupied' : isLocker ? 'Locker Seat' : 'Available'}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-300 border border-green-400 rounded mr-1"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-300 border border-red-400 rounded mr-1"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-300 border border-blue-400 rounded mr-1"></div>
            <span>Locker</span>
          </div>
        </div>
      </div>

      {/* Fee Due Calendar */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Upcoming Due Dates</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
            <div>
              <p className="text-sm font-medium text-red-900">Monthly Fee</p>
              <p className="text-xs text-red-600">Due: Dec 20, 2025</p>
            </div>
            <CalendarIcon className="w-5 h-5 text-red-500" />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div>
              <p className="text-sm font-medium text-orange-900">Library Fee</p>
              <p className="text-xs text-orange-600">Due: Dec 25, 2025</p>
            </div>
            <CalendarIcon className="w-5 h-5 text-orange-500" />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div>
              <p className="text-sm font-medium text-yellow-900">Exam Fee</p>
              <p className="text-xs text-yellow-600">Due: Jan 05, 2026</p>
            </div>
            <CalendarIcon className="w-5 h-5 text-yellow-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function EnhancedDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(mockDashboardStats);
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [quickActions] = useState<QuickAction[]>(mockQuickActions);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new activity
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: 'payment',
        description: 'Fee payment received - ₹3,000 from Student XYZ',
        timestamp: new Date(),
        amount: 3000,
        user: 'Accountant',
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50">
        {/* Top Navbar */}
        <TopNavbar />

        {/* Main Dashboard Content */}
        <div className="p-6 space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Dashboard Overview</h1>
            <p className="text-neutral-600">
              Welcome back! Here's what's happening at your institute today.
            </p>
          </div>

          {/* KPI Cards Section */}
          <KPICards stats={stats} />

          {/* Charts and Analytics Section */}
          <ChartsSection />

          {/* Interactive Widgets */}
          <InteractiveWidgets />

          {/* Quick Actions */}
          <QuickActionsPanel actions={quickActions} />

          {/* Recent Activity and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivityFeed activities={activities} />
            <AlertsPanel alerts={alerts} />
          </div>
        </div>
      </div>
    </Layout>
  );
}