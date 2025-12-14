'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Sidebar';
import { SeatMap } from '@/components/seating/SeatMap';
import { SeatList } from '@/components/seating/SeatList';
import { SeatFilters } from '@/components/seating/SeatFilters';
import { AssignSeatModal } from '@/components/seating/AssignSeatModal';
import { mockSeats, mockStudents } from '@/lib/mockData';
import { Seat } from '@/types';
import { 
  MapIcon,
  ListBulletIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

export default function SeatingPage() {
  const [seats] = useState<Seat[]>(mockSeats);
  const [filteredSeats, setFilteredSeats] = useState<Seat[]>(mockSeats);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterSeats(term, selectedRoom, selectedStatus);
  };

  const handleRoomFilter = (room: string) => {
    setSelectedRoom(room);
    filterSeats(searchTerm, room, selectedStatus);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    filterSeats(searchTerm, selectedRoom, status);
  };

  const filterSeats = (search: string, room: string, status: string) => {
    let filtered = seats;

    if (search) {
      filtered = filtered.filter(seat =>
        seat.seatNumber.toLowerCase().includes(search.toLowerCase()) ||
        seat.student?.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (room) {
      filtered = filtered.filter(seat => seat.room === room);
    }

    if (status) {
      filtered = filtered.filter(seat => seat.status === status);
    }

    setFilteredSeats(filtered);
  };

  const handleSeatClick = (seat: Seat) => {
    setSelectedSeat(seat);
    if (seat.status === 'available') {
      setIsAssignModalOpen(true);
    }
  };

  const rooms = Array.from(new Set(seats.map(s => s.room))).sort();
  const statuses = ['available', 'occupied', 'disabled'];

  // Calculate stats
  const totalSeats = seats.length;
  const occupiedSeats = seats.filter(s => s.status === 'occupied').length;
  const availableSeats = seats.filter(s => s.status === 'available').length;
  const occupancyRate = Math.round((occupiedSeats / totalSeats) * 100);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Seating Management</h1>
            <p className="text-neutral-600 mt-1">
              Manage seat allocation and locker assignments
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex bg-neutral-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'map'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <MapIcon className="w-4 h-4 inline mr-2" />
                Map View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <ListBulletIcon className="w-4 h-4 inline mr-2" />
                List View
              </button>
            </div>
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Assign Seat</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                <MapIcon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-neutral-500">Total Seats</h3>
                <p className="text-2xl font-semibold text-neutral-900">{totalSeats}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                <MapIcon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-neutral-500">Occupied</h3>
                <p className="text-2xl font-semibold text-neutral-900">{occupiedSeats}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                <MapIcon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-neutral-500">Available</h3>
                <p className="text-2xl font-semibold text-neutral-900">{availableSeats}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-purple-50 text-purple-600 border border-purple-200">
                <MapIcon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-neutral-500">Occupancy</h3>
                <p className="text-2xl font-semibold text-neutral-900">{occupancyRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <SeatFilters
          onSearch={handleSearch}
          onRoomFilter={handleRoomFilter}
          onStatusFilter={handleStatusFilter}
          rooms={rooms}
          statuses={statuses}
          selectedRoom={selectedRoom}
          selectedStatus={selectedStatus}
        />

        {/* Seating Content */}
        {viewMode === 'map' ? (
          <SeatMap seats={filteredSeats} onSeatClick={handleSeatClick} />
        ) : (
          <SeatList seats={filteredSeats} onSeatClick={handleSeatClick} />
        )}

        {/* Assign Seat Modal */}
        <AssignSeatModal
          isOpen={isAssignModalOpen}
          onClose={() => {
            setIsAssignModalOpen(false);
            setSelectedSeat(null);
          }}
          seat={selectedSeat}
        />
      </div>
    </Layout>
  );
}