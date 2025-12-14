'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EnhancedLayout } from '@/components/layout/EnhancedLayout';
import { 
  UserGroupIcon, 
  ClockIcon, 
  CalendarIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

// Mock data for attendance
const mockAttendanceData = [
  { id: '1', studentId: 'STU001', studentName: 'Rahul Kumar', class: 'B.Tech CS', date: '2025-12-14', morning: true, evening: false, remarks: 'Late for evening session' },
  { id: '2', studentId: 'STU002', studentName: 'Priya Sharma', class: 'B.Tech CS', date: '2025-12-14', morning: true, evening: true, remarks: '-' },
  { id: '3', studentId: 'STU003', studentName: 'Amit Patel', class: 'B.Tech ECE', date: '2025-12-14', morning: false, evening: false, remarks: 'Absent all day' },
  { id: '4', studentId: 'STU004', studentName: 'Sneha Gupta', class: 'B.Tech ECE', date: '2025-12-14', morning: true, evening: false, remarks: 'Emergency leave' },
  { id: '5', studentId: 'STU005', studentName: 'Vikash Singh', class: 'B.Tech ME', date: '2025-12-14', morning: true, evening: true, remarks: '-' },
];

export default function AttendancePage() {
  const { user, hasPermission } = useAuth();
  const [attendanceData, setAttendanceData] = useState(mockAttendanceData);
  const [filteredData, setFilteredData] = useState(mockAttendanceData);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [shiftFilter, setShiftFilter] = useState('all');

  // Check permissions
  const canRead = hasPermission('attendance', 'read');
  const canCreate = hasPermission('attendance', 'create');
  const canUpdate = hasPermission('attendance', 'update');

  // Filter data based on search and filters
  useEffect(() => {
    let result = attendanceData;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(item => 
        item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.class.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date filter
    if (dateFilter) {
      result = result.filter(item => item.date === dateFilter);
    }

    // Apply shift filter
    if (shiftFilter !== 'all') {
      if (shiftFilter === 'morning') {
        result = result.filter(item => item.morning);
      } else if (shiftFilter === 'evening') {
        result = result.filter(item => item.evening);
      } else if (shiftFilter === 'absent') {
        result = result.filter(item => !item.morning && !item.evening);
      }
    }

    setFilteredData(result);
  }, [searchTerm, dateFilter, shiftFilter, attendanceData]);

  // Check if user has permission to access this page
  if (!canRead) {
    return (
      <EnhancedLayout>
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">Access Denied</h2>
            <p className="text-neutral-600 mb-4">
              You don't have permission to access the attendance records.
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
          <h1 className="text-2xl font-bold text-neutral-900">Attendance Management</h1>
          <p className="text-neutral-600">Track and manage student attendance records</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-neutral-900">Total Students</h3>
                <p className="text-2xl font-bold text-neutral-900">1,245</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-neutral-900">Present Today</h3>
                <p className="text-2xl font-bold text-neutral-900">1,120</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-neutral-900">Absent Today</h3>
                <p className="text-2xl font-bold text-neutral-900">125</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-neutral-900">Late Entries</h3>
                <p className="text-2xl font-bold text-neutral-900">45</p>
              </div>
            </div>
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
                  placeholder="Search students, classes, dates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-neutral-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <select
                value={shiftFilter}
                onChange={(e) => setShiftFilter(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Shifts</option>
                <option value="morning">Morning Only</option>
                <option value="evening">Evening Only</option>
                <option value="absent">Absent</option>
              </select>

              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FunnelIcon className="w-5 h-5 mr-2" />
                Filter
              </button>

              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Morning
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Evening
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Remarks
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredData.map((record) => (
                  <tr key={record.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {record.studentName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">{record.studentName}</div>
                          <div className="text-sm text-neutral-500">{record.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">{record.class}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {record.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.morning ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {record.morning ? 'Present' : 'Absent'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.evening ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {record.evening ? 'Present' : 'Absent'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-900">
                      {record.remarks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className={`mr-3 ${canUpdate ? 'text-blue-600 hover:text-blue-900' : 'text-gray-400 cursor-not-allowed'}`}
                        disabled={!canUpdate}
                      >
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <ClockIcon className="w-12 h-12 text-neutral-400 mx-auto" />
              <h3 className="mt-2 text-sm font-medium text-neutral-900">No attendance records found</h3>
              <p className="mt-1 text-sm text-neutral-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </EnhancedLayout>
  );
}