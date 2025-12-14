'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { Seat, Student } from '@/types';
import { mockStudents } from '@/lib/mockData';

interface AssignSeatModalProps {
  isOpen: boolean;
  onClose: () => void;
  seat: Seat | null;
}

interface AssignFormData {
  studentId: string;
  notes?: string;
}

export function AssignSeatModal({ isOpen, onClose, seat }: AssignSeatModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssignFormData>();

  const onSubmit = async (data: AssignFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Seat assignment data:', {
        seatId: seat?.id,
        ...data,
      });
      
      toast.success('Seat assigned successfully!');
      reset();
      onClose();
    } catch (error) {
      toast.error('Failed to assign seat. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen || !seat) return null;

  // Filter available students (not already assigned to another seat)
  const availableStudents = mockStudents.filter(student => 
    !student.seatNumber || student.seatNumber === seat.seatNumber
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose}></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-neutral-900">
                  {seat.status === 'available' ? 'Assign Seat' : 'Update Seat Assignment'}
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
              {/* Seat Information */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Seat Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
                  <div>
                    <span className="font-medium">Seat Number:</span>
                    <div className="text-lg font-bold">{seat.seatNumber}</div>
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>
                    <div>{seat.room} - {seat.section}</div>
                  </div>
                  <div className="flex items-center">
                    <LockClosedIcon className="w-4 h-4 mr-1" />
                    <span>{seat.hasLocker ? 'Locker Available' : 'No Locker'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <div className="capitalize">{seat.status}</div>
                  </div>
                </div>
              </div>

              {/* Current Assignment */}
              {seat.student && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="text-sm font-medium text-amber-900 mb-2">Current Assignment</h4>
                  <div className="text-sm text-amber-800">
                    <div className="font-medium">{seat.student.name}</div>
                    <div>{seat.student.enrollmentNumber} - {seat.student.class}</div>
                    <div>Shift: {seat.student.shift}</div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {/* Student Selection */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Select Student *
                  </label>
                  <select
                    {...register('studentId', { required: 'Student is required' })}
                    className="input-field"
                  >
                    <option value="">
                      {seat.student ? 'Change student...' : 'Choose a student'}
                    </option>
                    {availableStudents.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.enrollmentNumber}) - {student.class} - {student.shift} shift
                      </option>
                    ))}
                  </select>
                  {errors.studentId && (
                    <p className="mt-1 text-sm text-rose-600">{errors.studentId.message}</p>
                  )}
                </div>

                {/* Student Preview */}
                {watch('studentId') && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <h4 className="text-sm font-medium text-emerald-900 mb-2">Student Information</h4>
                    {(() => {
                      const selectedStudent = mockStudents.find(s => s.id === watch('studentId'));
                      return selectedStudent ? (
                        <div className="space-y-1 text-sm text-emerald-800">
                          <p><strong>Name:</strong> {selectedStudent.name}</p>
                          <p><strong>Enrollment:</strong> {selectedStudent.enrollmentNumber}</p>
                          <p><strong>Class:</strong> {selectedStudent.class} - {selectedStudent.batch}</p>
                          <p><strong>Guardian:</strong> {selectedStudent.guardianName}</p>
                          <p><strong>Phone:</strong> {selectedStudent.phone}</p>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="input-field"
                    placeholder="Any additional notes about this assignment..."
                  />
                </div>

                {/* Assignment Summary */}
                {watch('studentId') && (
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                    <h4 className="text-sm font-medium text-neutral-900 mb-2">Assignment Summary</h4>
                    <div className="space-y-1 text-sm text-neutral-700">
                      <p><strong>Seat:</strong> {seat.seatNumber} ({seat.room})</p>
                      <p><strong>Student:</strong> {mockStudents.find(s => s.id === watch('studentId'))?.name}</p>
                      <p><strong>Locker:</strong> {seat.hasLocker ? 'Will be assigned' : 'Not available'}</p>
                      <p><strong>Assignment Date:</strong> {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-neutral-50 px-6 py-4 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="btn-ghost"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Assigning...' : (seat.student ? 'Update Assignment' : 'Assign Seat')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Helper function to access form values
function watch(fieldName: string): any {
  return null; // This would be handled by react-hook-form's useWatch in a real implementation
}