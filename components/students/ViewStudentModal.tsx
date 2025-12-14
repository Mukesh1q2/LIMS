'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { Student } from '@/types';
import { formatDate, getInitials, getAvatarColor } from '@/lib/utils';

interface ViewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export function ViewStudentModal({ isOpen, onClose, student }: ViewStudentModalProps) {
  if (!isOpen || !student) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose}></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-neutral-900">
                Student Details
              </h3>
              <button
                type="button"
                onClick={handleClose}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white px-6 py-4">
            <div className="space-y-6">
              {/* Student Profile Header */}
              <div className="flex items-center space-x-6">
                <div className={`flex-shrink-0 h-20 w-20 rounded-full flex items-center justify-center text-white text-xl font-medium ${getAvatarColor(student.name)}`}>
                  {getInitials(student.name)}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-neutral-900">{student.name}</h4>
                  <p className="text-neutral-600">{student.enrollmentNumber}</p>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      student.shift === 'morning'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}>
                      {student.shift === 'morning' ? 'Morning' : 'Evening'} Shift
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      student.status === 'active'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {student.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Student Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Class & Batch</h5>
                    <p className="mt-1 text-lg font-medium text-neutral-900">{student.class}</p>
                    <p className="text-neutral-600">{student.batch}</p>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Date of Joining</h5>
                    <p className="mt-1 text-lg font-medium text-neutral-900">{formatDate(student.dateOfJoining)}</p>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Seat Number</h5>
                    <p className="mt-1 text-lg font-medium text-neutral-900">{student.seatNumber || 'Not assigned'}</p>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Locker</h5>
                    <p className="mt-1 text-lg font-medium text-neutral-900">{student.lockerAssigned || 'Not assigned'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Guardian Name</h5>
                    <p className="mt-1 text-lg font-medium text-neutral-900">{student.guardianName}</p>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Guardian Phone</h5>
                    <p className="mt-1 text-lg font-medium text-neutral-900">{student.guardianPhone}</p>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Student Phone</h5>
                    <p className="mt-1 text-lg font-medium text-neutral-900">{student.phone}</p>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Email</h5>
                    <p className="mt-1 text-lg font-medium text-neutral-900">{student.email || 'Not provided'}</p>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Address</h5>
                    <p className="mt-1 text-lg font-medium text-neutral-900">{student.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-neutral-50 px-6 py-4 flex items-center justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}