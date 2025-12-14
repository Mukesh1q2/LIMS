'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EnhancedLayout } from '@/components/layout/EnhancedLayout';
import { 
  UserGroupIcon,
  BookOpenIcon,
  CurrencyRupeeIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ChartCard } from '@/components/dashboard/ChartCard';

// Role-based dashboard types
interface RoleDashboardProps {
  userRole: string;
  userId: string;
}

// Admin Dashboard Component
const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalStudents: 1250,
    totalFeesCollected: 1250000,
    pendingFees: 85000,
    booksIssuedToday: 45,
    overdueBooks: 8,
    seatsOccupied: 280,
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Admin Dashboard</h2>
        <p className="text-neutral-600">Complete overview of your institute operations</p>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value={stats.totalStudents.toLocaleString()}
          change="+12% from last month"
          changeType="increase"
          icon={<UserGroupIcon className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard
          title="Fees Collected"
          value={`₹${(stats.totalFeesCollected / 100000).toFixed(1)}L`}
          change="+15% from last month"
          changeType="increase"
          icon={<CurrencyRupeeIcon className="w-6 h-6" />}
          color="emerald"
        />
        <StatsCard
          title="Pending Fees"
          value={`₹${(stats.pendingFees / 1000).toFixed(0)}K`}
          change="12 students"
          changeType="neutral"
          icon={<CurrencyRupeeIcon className="w-6 h-6" />}
          color="amber"
        />
        <StatsCard
          title="Overdue Books"
          value={stats.overdueBooks.toString()}
          change="Require attention"
          changeType="increase"
          icon={<BookOpenIcon className="w-6 h-6" />}
          color="rose"
        />
      </div>

      {/* Charts for Admin */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Student Attendance Trends"
          description="Daily attendance for the past 30 days"
          chartType="line"
        />
        <ChartCard
          title="Fee Collection"
          description="Monthly fee collection trends"
          chartType="bar"
        />
      </div>
    </div>
  );
};

// Librarian Dashboard Component
const LibrarianDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    booksIssuedToday: 45,
    overdueBooks: 8,
    booksReturnedToday: 38,
    libraryExpenses: 15000,
    totalBooks: 2500,
    availableBooks: 2100,
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Librarian Dashboard</h2>
        <p className="text-neutral-600">Library management and book tracking</p>
      </div>

      {/* Librarian Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Books Issued Today"
          value={stats.booksIssuedToday.toString()}
          change="+5 from yesterday"
          changeType="increase"
          icon={<BookOpenIcon className="w-6 h-6" />}
          color="purple"
        />
        <StatsCard
          title="Books Returned"
          value={stats.booksReturnedToday.toString()}
          change="+3 from yesterday"
          changeType="increase"
          icon={<CheckCircleIcon className="w-6 h-6" />}
          color="green"
        />
        <StatsCard
          title="Overdue Books"
          value={stats.overdueBooks.toString()}
          change="Require attention"
          changeType="increase"
          icon={<BookOpenIcon className="w-6 h-6" />}
          color="rose"
        />
        <StatsCard
          title="Available Books"
          value={`${stats.availableBooks}/${stats.totalBooks}`}
          change="84% available"
          changeType="neutral"
          icon={<BookOpenIcon className="w-6 h-6" />}
          color="blue"
        />
      </div>

      {/* Quick Actions for Librarian */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Library Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 rounded-lg border border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all">
            <BookOpenIcon className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-sm font-medium">Issue Book</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border border-neutral-200 hover:border-green-300 hover:shadow-md transition-all">
            <CheckCircleIcon className="w-8 h-8 text-green-500 mb-2" />
            <span className="text-sm font-medium">Return Book</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border border-neutral-200 hover:border-purple-300 hover:shadow-md transition-all">
            <BookOpenIcon className="w-8 h-8 text-purple-500 mb-2" />
            <span className="text-sm font-medium">Add Book</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border border-neutral-200 hover:border-orange-300 hover:shadow-md transition-all">
            <BookOpenIcon className="w-8 h-8 text-orange-500 mb-2" />
            <span className="text-sm font-medium">View Reports</span>
          </button>
        </div>
      </div>

      {/* Library Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Book Usage Statistics"
          description="Books issued, returned, overdue, and reserved"
          chartType="pie"
        />
        <ChartCard
          title="Library Expenses"
          description="Monthly library expenses breakdown"
          chartType="bar"
        />
      </div>
    </div>
  );
};

// Accountant Dashboard Component
const AccountantDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalFeesCollected: 1250000,
    pendingFees: 85000,
    pendingFeesCount: 12,
    advancePayments: 45000,
    receiptsGenerated: 145,
    monthlyCollection: 950000,
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Accountant Dashboard</h2>
        <p className="text-neutral-600">Financial management and fee tracking</p>
      </div>

      {/* Accountant Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Fees Collected"
          value={`₹${(stats.totalFeesCollected / 100000).toFixed(1)}L`}
          change="+15% from last month"
          changeType="increase"
          icon={<CurrencyRupeeIcon className="w-6 h-6" />}
          color="emerald"
        />
        <StatsCard
          title="Pending Fees"
          value={`₹${(stats.pendingFees / 1000).toFixed(0)}K`}
          change={`${stats.pendingFeesCount} students`}
          changeType="neutral"
          icon={<CurrencyRupeeIcon className="w-6 h-6" />}
          color="amber"
        />
        <StatsCard
          title="Advance Payments"
          value={`₹${(stats.advancePayments / 1000).toFixed(0)}K`}
          change="+8% from last month"
          changeType="increase"
          icon={<CurrencyRupeeIcon className="w-6 h-6" />}
          color="teal"
        />
        <StatsCard
          title="Receipts Generated"
          value={stats.receiptsGenerated.toString()}
          change="This month"
          changeType="neutral"
          icon={<CheckCircleIcon className="w-6 h-6" />}
          color="blue"
        />
      </div>

      {/* Financial Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Financial Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 rounded-lg border border-neutral-200 hover:border-green-300 hover:shadow-md transition-all">
            <CurrencyRupeeIcon className="w-8 h-8 text-green-500 mb-2" />
            <span className="text-sm font-medium">Record Payment</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all">
            <CurrencyRupeeIcon className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-sm font-medium">Generate Receipt</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border border-neutral-200 hover:border-purple-300 hover:shadow-md transition-all">
            <CurrencyRupeeIcon className="w-8 h-8 text-purple-500 mb-2" />
            <span className="text-sm font-medium">Send Reminder</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border border-neutral-200 hover:border-orange-300 hover:shadow-md transition-all">
            <CurrencyRupeeIcon className="w-8 h-8 text-orange-500 mb-2" />
            <span className="text-sm font-medium">View Reports</span>
          </button>
        </div>
      </div>

      {/* Financial Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Monthly Fee Collection"
          description="Fee collection trends by month"
          chartType="bar"
        />
        <ChartCard
          title="Payment Methods"
          description="Distribution of payment methods used"
          chartType="pie"
        />
      </div>
    </div>
  );
};

// Teacher/Staff Dashboard Component
const TeacherDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalStudents: 1250,
    presentToday: 1180,
    morningPresent: 720,
    eveningPresent: 460,
    averageAttendance: 94.4,
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Teacher Dashboard</h2>
        <p className="text-neutral-600">Student management and attendance tracking</p>
      </div>

      {/* Teacher Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value={stats.totalStudents.toLocaleString()}
          change="Registered students"
          changeType="neutral"
          icon={<UserGroupIcon className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard
          title="Present Today"
          value={stats.presentToday.toString()}
          change={`${stats.averageAttendance}% attendance`}
          changeType="increase"
          icon={<UserIcon className="w-6 h-6" />}
          color="green"
        />
        <StatsCard
          title="Morning Shift"
          value={stats.morningPresent.toString()}
          change={`${Math.round((stats.morningPresent / stats.totalStudents) * 100)}% present`}
          changeType="neutral"
          icon={<ClipboardDocumentListIcon className="w-6 h-6" />}
          color="purple"
        />
        <StatsCard
          title="Evening Shift"
          value={stats.eveningPresent.toString()}
          change={`${Math.round((stats.eveningPresent / stats.totalStudents) * 100)}% present`}
          changeType="neutral"
          icon={<ClipboardDocumentListIcon className="w-6 h-6" />}
          color="indigo"
        />
      </div>

      {/* Teaching Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Daily Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 rounded-lg border border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all">
            <ClipboardDocumentListIcon className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-sm font-medium">Mark Attendance</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border border-neutral-200 hover:border-green-300 hover:shadow-md transition-all">
            <UserGroupIcon className="w-8 h-8 text-green-500 mb-2" />
            <span className="text-sm font-medium">View Students</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border border-neutral-200 hover:border-purple-300 hover:shadow-md transition-all">
            <ClipboardDocumentListIcon className="w-8 h-8 text-purple-500 mb-2" />
            <span className="text-sm font-medium">Generate Report</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border border-neutral-200 hover:border-orange-300 hover:shadow-md transition-all">
            <UserIcon className="w-8 h-8 text-orange-500 mb-2" />
            <span className="text-sm font-medium">Student Details</span>
          </button>
        </div>
      </div>

      {/* Attendance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Daily Attendance"
          description="Attendance trends for the past 30 days"
          chartType="line"
        />
        <ChartCard
          title="Shift Distribution"
          description="Morning vs Evening shift attendance"
          chartType="pie"
        />
      </div>
    </div>
  );
};

// Student Dashboard Component (Portal)
const StudentDashboard: React.FC<{ studentId: string }> = ({ studentId }) => {
  const [stats, setStats] = useState({
    currentBooksIssued: 3,
    overdueBooks: 0,
    totalFeesPaid: 25000,
    pendingFees: 5000,
    attendanceRate: 96.5,
    lastPaymentDate: '2025-12-01',
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Student Portal</h2>
        <p className="text-neutral-600">Your academic information and activities</p>
      </div>

      {/* Student Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Books Issued"
          value={stats.currentBooksIssued.toString()}
          change="Currently borrowed"
          changeType="neutral"
          icon={<BookOpenIcon className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard
          title="Fees Status"
          value={`₹${stats.totalFeesPaid.toLocaleString()}`}
          change="Total paid"
          changeType="neutral"
          icon={<CurrencyRupeeIcon className="w-6 h-6" />}
          color="green"
        />
        <StatsCard
          title="Pending Fees"
          value={`₹${stats.pendingFees.toLocaleString()}`}
          change="Due amount"
          changeType="increase"
          icon={<CurrencyRupeeIcon className="w-6 h-6" />}
          color="amber"
        />
        <StatsCard
          title="Attendance"
          value={`${stats.attendanceRate}%`}
          change="This semester"
          changeType="increase"
          icon={<ClipboardDocumentListIcon className="w-6 h-6" />}
          color="purple"
        />
      </div>

      {/* Student Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 rounded-lg border border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all">
            <BookOpenIcon className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-sm font-medium">My Books</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border border-neutral-200 hover:border-green-300 hover:shadow-md transition-all">
            <CurrencyRupeeIcon className="w-8 h-8 text-green-500 mb-2" />
            <span className="text-sm font-medium">Pay Fees</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border border-neutral-200 hover:border-purple-300 hover:shadow-md transition-all">
            <ClipboardDocumentListIcon className="w-8 h-8 text-purple-500 mb-2" />
            <span className="text-sm font-medium">Attendance</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border border-neutral-200 hover:border-orange-300 hover:shadow-md transition-all">
            <UserIcon className="w-8 h-8 text-orange-500 mb-2" />
            <span className="text-sm font-medium">Profile</span>
          </button>
        </div>
      </div>

      {/* Student Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Books Currently Issued</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">Data Structures</span>
              <span className="text-xs text-blue-600">Due: Dec 25, 2025</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Algorithms</span>
              <span className="text-xs text-green-600">Due: Dec 28, 2025</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium">Database Systems</span>
              <span className="text-xs text-purple-600">Due: Jan 02, 2026</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Fee Payment History</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">December 2025</span>
              <span className="text-sm font-medium text-green-600">₹5,000</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">November 2025</span>
              <span className="text-sm font-medium text-green-600">₹5,000</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
              <span className="text-sm font-medium">October 2025</span>
              <span className="text-sm font-medium text-amber-600">₹5,000 (Pending)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Role-based Dashboard Component
export function RoleBasedDashboard({ userRole, userId }: RoleDashboardProps) {
  const renderDashboard = () => {
    switch (userRole) {
      case 'admin':
      case 'super_admin':
        return <AdminDashboard />;
      case 'librarian':
        return <LibrarianDashboard />;
      case 'accountant':
        return <AccountantDashboard />;
      case 'teacher':
      case 'staff':
        return <TeacherDashboard />;
      case 'student':
        return <StudentDashboard studentId={userId} />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <EnhancedLayout>
      {renderDashboard()}
    </EnhancedLayout>
  );
}