'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EnhancedLayout } from '@/components/layout/EnhancedLayout';
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  ArrowDownTrayIcon,
  FunnelIcon,
  CalendarIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  BookOpenIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { ChartCard } from '@/components/dashboard/ChartCard';

// Mock data for reports
const mockReports = [
  { id: '1', name: 'Student Master Report', type: 'student_master', generatedAt: '2025-12-14', generatedBy: 'Admin', format: 'pdf' },
  { id: '2', name: 'Attendance Report', type: 'attendance', generatedAt: '2025-12-14', generatedBy: 'Teacher', format: 'excel' },
  { id: '3', name: 'Fee Collection Report', type: 'fees', generatedAt: '2025-12-13', generatedBy: 'Accountant', format: 'pdf' },
  { id: '4', name: 'Library Usage Report', type: 'library', generatedAt: '2025-12-12', generatedBy: 'Librarian', format: 'excel' },
  { id: '5', name: 'Expenses Report', type: 'expenses', generatedAt: '2025-12-11', generatedBy: 'Admin', format: 'pdf' },
];

const mockStats = {
  totalStudents: 1245,
  activeStudents: 1120,
  totalFees: 2500000,
  pendingFees: 150000,
  booksIssued: 850,
  overdueBooks: 25
};

export default function ReportsPage() {
  const { user, hasPermission } = useAuth();
  const [reports, setReports] = useState(mockReports);
  const [stats, setStats] = useState(mockStats);
  const [filteredReports, setFilteredReports] = useState(mockReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Check permissions
  const canRead = hasPermission('reports', 'read');
  const canCreate = hasPermission('reports', 'create');

  // Filter reports based on search and filters
  useEffect(() => {
    let result = reports;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.generatedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date filter
    if (dateFrom && dateTo) {
      result = result.filter(item => 
        item.generatedAt >= dateFrom && item.generatedAt <= dateTo
      );
    } else if (dateFrom) {
      result = result.filter(item => item.generatedAt >= dateFrom);
    } else if (dateTo) {
      result = result.filter(item => item.generatedAt <= dateTo);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(item => item.type === typeFilter);
    }

    setFilteredReports(result);
  }, [searchTerm, dateFrom, dateTo, typeFilter, reports]);

  // Check if user has permission to access this page
  if (!canRead) {
    return (
      <EnhancedLayout>
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DocumentTextIcon className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">Access Denied</h2>
            <p className="text-neutral-600 mb-4">
              You don't have permission to access reports.
            </p>
          </div>
        </div>
      </EnhancedLayout>
    );
  }

  return (
    <EnhancedLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Reports & Analytics</h1>
          <p className="text-neutral-600">Generate and view comprehensive reports for your institute</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-neutral-900">Total Students</h3>
                <p className="text-2xl font-bold text-neutral-900">{stats.totalStudents.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CurrencyRupeeIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-neutral-900">Total Fees Collected</h3>
                <p className="text-2xl font-bold text-neutral-900">₹{stats.totalFees.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <CurrencyRupeeIcon className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-neutral-900">Pending Fees</h3>
                <p className="text-2xl font-bold text-neutral-900">₹{stats.pendingFees.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Student Distribution</h3>
            <ChartCard
              title=""
              description=""
              chartType="pie"
              height={300}
            />
          </div>

          {/* Fee Collection Trends */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Fee Collection Trends</h3>
            <ChartCard
              title=""
              description=""
              chartType="bar"
              height={300}
            />
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-neutral-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="From"
              />

              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="To"
              />

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Report Types</option>
                <option value="student_master">Student Master</option>
                <option value="attendance">Attendance</option>
                <option value="fees">Fees</option>
                <option value="library">Library</option>
                <option value="expenses">Expenses</option>
              </select>

              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FunnelIcon className="w-5 h-5 mr-2" />
                Filter
              </button>

              {canCreate && (
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <DocumentTextIcon className="w-5 h-5 mr-2" />
                  Generate Report
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900">Generated Reports</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Report Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Generated At
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Generated By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Format
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900">{report.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900 capitalize">{report.type.replace('_', ' ')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {report.generatedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {report.generatedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        .{report.format}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                      <button className="text-green-600 hover:text-green-900 mr-3">Download</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <DocumentTextIcon className="w-12 h-12 text-neutral-400 mx-auto" />
              <h3 className="mt-2 text-sm font-medium text-neutral-900">No reports found</h3>
              <p className="mt-1 text-sm text-neutral-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </EnhancedLayout>
  );
}