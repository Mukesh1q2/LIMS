'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface FeeFiltersProps {
  onSearch: (term: string) => void;
  onStatusFilter: (status: string) => void;
  onCategoryFilter: (category: string) => void;
  statuses: string[];
  categories: string[];
  selectedStatus: string;
  selectedCategory: string;
}

export function FeeFilters({
  onSearch,
  onStatusFilter,
  onCategoryFilter,
  statuses,
  categories,
  selectedStatus,
  selectedCategory,
}: FeeFiltersProps) {
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
            placeholder="Search by student name or enrollment..."
            onChange={(e) => onSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryFilter(e.target.value)}
            className="input-field"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Filter Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
          Paid
        </button>
        <button className="px-3 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full border border-amber-200">
          Pending
        </button>
        <button className="px-3 py-1 text-xs font-medium bg-rose-100 text-rose-800 rounded-full border border-rose-200">
          Overdue
        </button>
        <button className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200">
          This Month
        </button>
      </div>
    </div>
  );
}