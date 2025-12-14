'use client';

import React, { useState } from 'react';
import { Attendance, Student } from '@/types';
import { mockAttendance, mockStudents } from '@/lib/mockData';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  UserGroupIcon,
  CalendarIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface AttendanceTableProps {
  date?: string;
  showDatePicker?: boolean;
}

export function AttendanceTable({ date = '2025-12-13', showDatePicker = true }: AttendanceTableProps) {
  const [selectedDate, setSelectedDate] = useState(date);
  const [filter, setFilter] = useState<'all' | 'present' | 'absent' | 'late'>('all');
  const [shift, setShift] = useState<'all' | 'morning' | 'evening'>('all');

  // Filter attendance based on date, filter, and shift
  const filteredAttendance = mockAttendance.filter(record => {
    if (record.date !== selectedDate) return false;
    
    // Filter by shift
    if (shift !== 'all') {
      const student = mockStudents.find(s => s.id === record.studentId);
      if (!student || student.shift !== shift) return false;
    }
    
    // Filter by status
    if (filter === 'present') {
      return record.morningPresent || record.eveningPresent;
    } else if (filter === 'absent') {
      return !record.morningPresent && !record.eveningPresent;
    } else if (filter === 'late') {
      return !record.morningPresent && record.eveningPresent;
    }
    
    return true;
  });

  const getAttendanceStatus = (record: Attendance) => {
    const morningPresent = record.morningPresent;
    const eveningPresent = record.eveningPresent;
    
    if (morningPresent && eveningPresent) {
      return { status: 'present', label: 'Present', color: 'text-green-600 bg-green-50' };
    } else if (!morningPresent && eveningPresent) {
      return { status: 'late', label: 'Late', color: 'text-yellow-600 bg-yellow-50' };
    } else {
      return { status: 'absent', label: 'Absent', color: 'text-red-600 bg-red-50' };
    }
  };

  const getShiftIcon = (shift: 'morning' | 'evening') => {
    return shift === 'morning' ? '🌅' : '🌆';
  };

  const presentCount = filteredAttendance.filter(r => 
    r.morningPresent || r.eveningPresent
  ).length;
  
  const totalCount = filteredAttendance.length;
  const absentCount = filteredAttendance.filter(r => 
    !r.morningPresent && !r.eveningPresent
  ).length;
  
  const lateCount = filteredAttendance.filter(r => 
    !r.morningPresent && r.eveningPresent
  ).length;

  return (
    <div className="space-y-6">
      {/* Header with filters and stats */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Attendance Management</h3>
            <p className="text-sm text-neutral-500">Track and manage student attendance</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Date Picker */}
            {showDatePicker && (
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 text-neutral-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="appearance-none px-4 py-2 pr-8 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">All Students</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
            
            {/* Shift Filter */}
            <div className="relative">
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as any)}
                className="appearance-none px-4 py-2 pr-8 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">All Shifts</option>
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Students</p>
                <p className="text-2xl font-bold text-blue-900">{totalCount}</p>
              </div>
              <UserGroupIcon className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Present</p>
                <p className="text-2xl font-bold text-green-900">{presentCount}</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Late</p>
                <p className="text-2xl font-bold text-yellow-900">{lateCount}</p>
              </div>
              <ClockIcon className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Absent</p>
                <p className="text-2xl font-bold text-red-900">{absentCount}</p>
              </div>
              <XCircleIcon className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h4 className="text-lg font-semibold text-neutral-900">Daily Attendance</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Shift
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Morning
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Evening
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredAttendance.map((record) => {
                const student = mockStudents.find(s => s.id === record.studentId);
                const status = getAttendanceStatus(record);
                
                if (!student) return null;
                
                return (
                  <tr key={record.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {student.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">{student.name}</div>
                          <div className="text-sm text-neutral-500">{student.enrollmentNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">{student.class}</div>
                      <div className="text-sm text-neutral-500">{student.batch}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getShiftIcon(student.shift)} {student.shift}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {record.morningPresent ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {record.eveningPresent ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        status.color
                      )}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredAttendance.length === 0 && (
          <div className="text-center py-12">
            <UserGroupIcon className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">No attendance records found for the selected criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}