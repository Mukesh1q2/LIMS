'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SeatFiltersProps {
  onSearch: (term: string) => void;
  onRoomFilter: (room: string) => void;
  onStatusFilter: (status: string) => void;
  rooms: string[];
  statuses: string[];
  selectedRoom: string;
  selectedStatus: string;
}

export function SeatFilters({
  onSearch,
  onRoomFilter,
  onStatusFilter,
  rooms,
  statuses,
  selectedRoom,
  selectedStatus,
}: SeatFiltersProps) {
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
            placeholder="Search by seat number or student name..."
            onChange={(e) => onSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Room Filter */}
        <div>
          <select
            value={selectedRoom}
            onChange={(e) => onRoomFilter(e.target.value)}
            className="input-field"
          >
            <option value="">All Rooms</option>
            {rooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>
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
      </div>

      {/* Quick Filter Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
          Available Only
        </button>
        <button className="px-3 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full border border-amber-200">
          Occupied
        </button>
        <button className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200">
          With Lockers
        </button>
        <button className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full border border-purple-200">
          High Occupancy
        </button>
      </div>
    </div>
  );
}