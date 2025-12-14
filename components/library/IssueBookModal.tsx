'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { mockStudents, mockLibraryBooks } from '@/lib/mockData';
import { Student, LibraryBook } from '@/types';

interface IssueBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IssueFormData {
  studentId: string;
  bookId: string;
  issueDate: string;
  dueDate: string;
  notes?: string;
}

export function IssueBookModal({ isOpen, onClose }: IssueBookModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedBook, setSelectedBook] = useState<LibraryBook | null>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<IssueFormData>();

  const watchedStudentId = watch('studentId');
  const watchedBookId = watch('bookId');

  // Update selected student and book when form values change
  useEffect(() => {
    if (watchedStudentId) {
      const student = mockStudents.find(s => s.id === watchedStudentId);
      setSelectedStudent(student || null);
    }
  }, [watchedStudentId]);

  useEffect(() => {
    if (watchedBookId) {
      const book = mockLibraryBooks.find(b => b.id === watchedBookId);
      setSelectedBook(book || null);
    }
  }, [watchedBookId]);

  const onSubmit = async (data: IssueFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Book issue data:', data);
      toast.success('Book issued successfully!');
      reset();
      onClose();
    } catch (error) {
      toast.error('Failed to issue book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedStudent(null);
    setSelectedBook(null);
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
                  Issue Book
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
                {/* Student Selection */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Select Student *
                  </label>
                  <select
                    {...register('studentId', { required: 'Student is required' })}
                    className="input-field"
                  >
                    <option value="">Choose a student</option>
                    {mockStudents.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.enrollmentNumber})
                      </option>
                    ))}
                  </select>
                  {errors.studentId && (
                    <p className="mt-1 text-sm text-rose-600">{errors.studentId.message}</p>
                  )}
                </div>

                {/* Selected Student Info */}
                {selectedStudent && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Student Information</h4>
                    <div className="space-y-1 text-sm text-blue-800">
                      <p><strong>Name:</strong> {selectedStudent.name}</p>
                      <p><strong>Class:</strong> {selectedStudent.class} - {selectedStudent.batch}</p>
                      <p><strong>Shift:</strong> {selectedStudent.shift}</p>
                      <p><strong>Phone:</strong> {selectedStudent.phone}</p>
                    </div>
                  </div>
                )}

                {/* Book Selection */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Select Book *
                  </label>
                  <select
                    {...register('bookId', { required: 'Book is required' })}
                    className="input-field"
                  >
                    <option value="">Choose a book</option>
                    {mockLibraryBooks.map((book) => (
                      <option 
                        key={book.id} 
                        value={book.id}
                        disabled={book.availableCopies === 0}
                      >
                        {book.title} by {book.author} ({book.availableCopies} available)
                      </option>
                    ))}
                  </select>
                  {errors.bookId && (
                    <p className="mt-1 text-sm text-rose-600">{errors.bookId.message}</p>
                  )}
                </div>

                {/* Selected Book Info */}
                {selectedBook && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <h4 className="text-sm font-medium text-emerald-900 mb-2">Book Information</h4>
                    <div className="space-y-1 text-sm text-emerald-800">
                      <p><strong>Title:</strong> {selectedBook.title}</p>
                      <p><strong>Author:</strong> {selectedBook.author}</p>
                      <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
                      <p><strong>Category:</strong> {selectedBook.category}</p>
                      <p><strong>Available:</strong> {selectedBook.availableCopies} / {selectedBook.totalCopies}</p>
                    </div>
                  </div>
                )}

                {/* Issue and Due Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Issue Date *
                    </label>
                    <input
                      {...register('issueDate', { required: 'Issue date is required' })}
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="input-field"
                    />
                    {errors.issueDate && (
                      <p className="mt-1 text-sm text-rose-600">{errors.issueDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Due Date *
                    </label>
                    <input
                      {...register('dueDate', { required: 'Due date is required' })}
                      type="date"
                      defaultValue={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      className="input-field"
                    />
                    {errors.dueDate && (
                      <p className="mt-1 text-sm text-rose-600">{errors.dueDate.message}</p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="input-field"
                    placeholder="Any additional notes..."
                  />
                </div>

                {/* Issue Summary */}
                {selectedStudent && selectedBook && (
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                    <h4 className="text-sm font-medium text-neutral-900 mb-2">Issue Summary</h4>
                    <div className="space-y-1 text-sm text-neutral-700">
                      <p><strong>Student:</strong> {selectedStudent.name}</p>
                      <p><strong>Book:</strong> {selectedBook.title}</p>
                      <p><strong>Due Date:</strong> {watch('dueDate')}</p>
                      <p><strong>Fine:</strong> ₹5 per day after due date</p>
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
                disabled={isSubmitting || !selectedStudent || !selectedBook}
              >
                {isSubmitting ? 'Issuing...' : 'Issue Book'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}