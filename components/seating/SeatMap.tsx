'use client';

import { Seat } from '@/types';
import { getInitials, getAvatarColor } from '@/lib/utils';
import { UserIcon } from '@heroicons/react/24/outline';

interface SeatMapProps {
  seats: Seat[];
  onSeatClick: (seat: Seat) => void;
}

export function SeatMap({ seats, onSeatClick }: SeatMapProps) {
  // Group seats by room and section for better organization
  const groupedSeats = seats.reduce((acc, seat) => {
    const key = `${seat.room}-${seat.section}`;
    if (!acc[key]) {
      acc[key] = {
        room: seat.room,
        section: seat.section,
        seats: [],
      };
    }
    acc[key].seats.push(seat);
    return acc;
  }, {} as Record<string, { room: string; section: string; seats: Seat[] }>);

  const getSeatColor = (seat: Seat) => {
    switch (seat.status) {
      case 'occupied':
        return 'bg-amber-100 border-amber-300 text-amber-800';
      case 'available':
        return 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100';
      case 'disabled':
        return 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed';
      default:
        return 'bg-white border-gray-200 text-gray-600';
    }
  };

  const getSeatIcon = (seat: Seat) => {
    if (seat.status === 'occupied' && seat.student) {
      return (
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium ${getAvatarColor(seat.student.name)}`}>
          {getInitials(seat.student.name)}
        </div>
      );
    }
    if (seat.status === 'occupied') {
      return <UserIcon className="w-4 h-4" />;
    }
    return null;
  };

  if (seats.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="text-neutral-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">No seats found</h3>
        <p className="text-neutral-600">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedSeats).map(([groupKey, group]) => (
        <div key={groupKey} className="card p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">
              {group.room} - {group.section}
            </h3>
            <p className="text-sm text-neutral-600">
              {group.seats.filter(s => s.status === 'occupied').length} of {group.seats.length} seats occupied
            </p>
          </div>

          {/* Seat Grid */}
          <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-3">
            {group.seats
              .sort((a, b) => {
                // Sort by seat number (A01, A02, etc.)
                return a.seatNumber.localeCompare(b.seatNumber, undefined, { numeric: true });
              })
              .map((seat) => (
                <div
                  key={seat.id}
                  onClick={() => seat.status !== 'disabled' && onSeatClick(seat)}
                  className={`
                    relative w-12 h-12 rounded-lg border-2 flex items-center justify-center cursor-pointer
                    transition-all duration-200 hover:scale-105
                    ${getSeatColor(seat)}
                  `}
                  title={`${seat.seatNumber} - ${seat.status}${seat.student ? ` (${seat.student.name})` : ''}`}
                >
                  {/* Seat Number */}
                  <span className="text-xs font-medium">
                    {seat.seatNumber.replace(/^[A-Z]/, '')}
                  </span>

                  {/* Student Avatar/Icon */}
                  <div className="absolute -top-1 -right-1">
                    {getSeatIcon(seat)}
                  </div>

                  {/* Locker Indicator */}
                  {seat.hasLocker && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border border-white"></div>
                  )}

                  {/* Selection Indicator */}
                  <div className="absolute inset-0 rounded-lg border-2 border-primary-500 opacity-0 hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center space-x-6 text-xs">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-emerald-50 border border-emerald-200 rounded mr-2"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-amber-100 border border-amber-300 rounded mr-2"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded mr-2"></div>
              <span>Disabled</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-amber-400 rounded-full mr-2"></div>
              <span>Locker Available</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}