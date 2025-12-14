'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface StudentFiltersProps {
  onSearch: (term: string) => void;
  onClassFilter: (classValue: string) => void;
  onShiftFilter: (shiftValue: string) => void;
  classes: string[];
  shifts: string[];
  selectedClass: string;
  selectedShift: string;
}

export function StudentFilters({
  onSearch,
  onClassFilter,
  onShiftFilter,
  classes,
  shifts,
  selectedClass,
  selectedShift,
}: StudentFiltersProps) {
  return (
    <div className="card p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, enrollment, or phone..."
            onChange={(e) => onSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Class Filter */}
        <div>
          <select
            value={selectedClass}
            onChange={(e) => onClassFilter(e.target.value)}
            className="input-field"
          >
            <option value="">All Classes</option>
            {classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>

        {/* Shift Filter */}
        <div>
          <select
            value={selectedShift}
            onChange={(e) => onShiftFilter(e.target.value)}
            className="input-field"
          >
            <option value="">All Shifts</option>
            {shifts.map((shift) => (
              <option key={shift} value={shift}>
                {shift === 'morning' ? 'Morning' : 'Evening'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 flex items-center space-x-6 text-sm text-neutral-600">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span>Morning Shift</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
          <span>Evening Shift</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
          <span>Active Students</span>
        </div>
      </div>
    </div>
  );
}