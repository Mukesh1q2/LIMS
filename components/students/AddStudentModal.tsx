'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { StudentFormData } from '@/types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id?: string;
    name?: string;
    enrollmentNumber?: string;
    class?: string;
    batch?: string;
    guardianName?: string;
    guardianPhone?: string;
    phone?: string;
    email?: string;
    shift?: 'morning' | 'evening';
    seatNumber?: string;
    lockerAssigned?: string;
    status?: string;
    dateOfJoining?: string;
  };
}

export function AddStudentModal({ isOpen, onClose, initialData }: AddStudentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = !!initialData?.id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm<StudentFormData>();

  // Set initial values when the modal opens with initial data
  useEffect(() => {
    if (initialData && isOpen) {
      Object.keys(initialData).forEach(key => {
        const typedKey = key as keyof typeof initialData;
        if (initialData[typedKey] !== undefined) {
          setValue(typedKey as any, initialData[typedKey] as any);
        }
      });
    } else if (!isOpen) {
      // Reset form when modal is closed
      reset();
    }
  }, [initialData, isOpen, setValue, reset]);

  const onSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);

    try {
      // Prepare student data
      const studentData = {
        ...data,
        id: initialData?.id, // Include ID if editing
      };

      // Make API call based on whether it's add or edit
      let response;
      if (isEdit && initialData?.id) {
        // PUT request to update student
        response = await fetch(`/api/students/${initialData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(studentData),
        });
      } else {
        // POST request to create new student
        response = await fetch('/api/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(studentData),
        });
      }

      const result = await response.json();

      if (result.success) {
        toast.success(isEdit ? 'Student updated successfully!' : 'Student added successfully!');
        reset();
        onClose();
      } else {
        throw new Error(result.error || (isEdit ? 'Failed to update student' : 'Failed to add student'));
      }
    } catch (error: any) {
      console.error(isEdit ? 'Error updating student:' : 'Error adding student:', error);
      toast.error(isEdit ? 'Failed to update student. Please try again.' : 'Failed to add student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

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
                  {isEdit ? 'Edit Student' : 'Add New Student'}
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
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    type="text"
                    className="input-field"
                    placeholder="Enter student's full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-rose-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Enrollment Number */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Enrollment Number *
                  </label>
                  <input
                    {...register('enrollmentNumber', { required: 'Enrollment number is required' })}
                    type="text"
                    className="input-field"
                    placeholder="e.g., STU001"
                  />
                  {errors.enrollmentNumber && (
                    <p className="mt-1 text-sm text-rose-600">{errors.enrollmentNumber.message}</p>
                  )}
                </div>

                {/* Class and Batch */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Class *
                    </label>
                    <select
                      {...register('class', { required: 'Class is required' })}
                      className="input-field"
                    >
                      <option value="">Select Class</option>
                      <option value="9th">9th</option>
                      <option value="10th">10th</option>
                      <option value="11th">11th</option>
                      <option value="12th">12th</option>
                    </select>
                    {errors.class && (
                      <p className="mt-1 text-sm text-rose-600">{errors.class.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Batch *
                    </label>
                    <input
                      {...register('batch', { required: 'Batch is required' })}
                      type="text"
                      className="input-field"
                      placeholder="2024-25"
                    />
                    {errors.batch && (
                      <p className="mt-1 text-sm text-rose-600">{errors.batch.message}</p>
                    )}
                  </div>
                </div>

                {/* Guardian Details */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Guardian Name *
                  </label>
                  <input
                    {...register('guardianName', { required: 'Guardian name is required' })}
                    type="text"
                    className="input-field"
                    placeholder="Enter guardian's name"
                  />
                  {errors.guardianName && (
                    <p className="mt-1 text-sm text-rose-600">{errors.guardianName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Guardian Phone *
                  </label>
                  <input
                    {...register('guardianPhone', { 
                      required: 'Guardian phone is required',
                      pattern: {
                        value: /^[+]?[91]?[6-9]\d{9}$/,
                        message: 'Please enter a valid phone number'
                      }
                    })}
                    type="tel"
                    className="input-field"
                    placeholder="+91 9876543210"
                  />
                  {errors.guardianPhone && (
                    <p className="mt-1 text-sm text-rose-600">{errors.guardianPhone.message}</p>
                  )}
                </div>

                {/* Student Contact */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Student Phone *
                  </label>
                  <input
                    {...register('phone', { 
                      required: 'Student phone is required',
                      pattern: {
                        value: /^[+]?[91]?[6-9]\d{9}$/,
                        message: 'Please enter a valid phone number'
                      }
                    })}
                    type="tel"
                    className="input-field"
                    placeholder="+91 9876543211"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-rose-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Student Email
                  </label>
                  <input
                    {...register('email', {
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    type="email"
                    className="input-field"
                    placeholder="student@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-rose-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Shift */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Shift *
                  </label>
                  <select
                    {...register('shift', { required: 'Shift is required' })}
                    className="input-field"
                  >
                    <option value="">Select Shift</option>
                    <option value="morning">Morning</option>
                    <option value="evening">Evening</option>
                  </select>
                  {errors.shift && (
                    <p className="mt-1 text-sm text-rose-600">{errors.shift.message}</p>
                  )}
                </div>
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
                {isSubmitting ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Student' : 'Add Student')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}