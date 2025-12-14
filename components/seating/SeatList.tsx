'use client';

import { Seat } from '@/types';
import { formatDateTime, getInitials, getAvatarColor, getStatusColor } from '@/lib/utils';
import { 
  MapPinIcon,
  UserIcon,
  LockClosedIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface SeatListProps {
  seats: Seat[];
  onSeatClick: (seat: Seat) => void;
}

export function SeatList({ seats, onSeatClick }: SeatListProps) {
  if (seats.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="text-neutral-400 mb-4">
          <MapPinIcon className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">No seats found</h3>
        <p className="text-neutral-600">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Seat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Occupant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Features
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Last Modified
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {seats.map((seat) => (
              <tr 
                key={seat.id} 
                className="hover:bg-neutral-50 cursor-pointer"
                onClick={() => onSeatClick(seat)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-700">
                        {seat.seatNumber}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-neutral-900">
                        Seat {seat.seatNumber}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-neutral-600">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    <div>
                      <div className="font-medium">{seat.room}</div>
                      <div className="text-neutral-500">{seat.section}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`status-badge ${getStatusColor(seat.status)}`}>
                    {seat.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {seat.student ? (
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${getAvatarColor(seat.student.name)}`}>
                        {getInitials(seat.student.name)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-neutral-900">
                          {seat.student.name}
                        </div>
                        <div className="text-sm text-neutral-500">
                          {seat.student.enrollmentNumber}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-neutral-400">Unassigned</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {seat.hasLocker && (
                      <div className="flex items-center text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                        <LockClosedIcon className="w-3 h-3 mr-1" />
                        Locker
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                  {formatDateTime(seat.lastModified)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSeatClick(seat);
                      }}
                      className="text-primary-600 hover:text-primary-900 p-1"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="text-rose-600 hover:text-rose-900 p-1"
                      title="Remove Assignment"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div>
              <span className="text-neutral-600">Total Seats: </span>
              <span className="font-medium text-neutral-900">{seats.length}</span>
            </div>
            <div>
              <span className="text-neutral-600">Occupied: </span>
              <span className="font-medium text-amber-600">
                {seats.filter(s => s.status === 'occupied').length}
              </span>
            </div>
            <div>
              <span className="text-neutral-600">Available: </span>
              <span className="font-medium text-emerald-600">
                {seats.filter(s => s.status === 'available').length}
              </span>
            </div>
            <div>
              <span className="text-neutral-600">With Lockers: </span>
              <span className="font-medium text-neutral-900">
                {seats.filter(s => s.hasLocker).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}