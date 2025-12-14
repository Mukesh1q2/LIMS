'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface BookFiltersProps {
  onSearch: (term: string) => void;
  onCategoryFilter: (category: string) => void;
  categories: string[];
  selectedCategory: string;
}

export function BookFilters({
  onSearch,
  onCategoryFilter,
  categories,
  selectedCategory,
}: BookFiltersProps) {
  return (
    <div className="card p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            onChange={(e) => onSearch(e.target.value)}
            className="input-field pl-10"
          />
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
        <button className="px-3 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full border border-primary-200">
          All Books
        </button>
        <button className="px-3 py-1 text-xs font-medium bg-neutral-100 text-neutral-700 rounded-full border border-neutral-200 hover:bg-neutral-200">
          Available Only
        </button>
        <button className="px-3 py-1 text-xs font-medium bg-neutral-100 text-neutral-700 rounded-full border border-neutral-200 hover:bg-neutral-200">
          Recently Added
        </button>
        <button className="px-3 py-1 text-xs font-medium bg-neutral-100 text-neutral-700 rounded-full border border-neutral-200 hover:bg-neutral-200">
          Popular
        </button>
      </div>
    </div>
  );
}