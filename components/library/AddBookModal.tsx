'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { BookFormData } from '@/types';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddBookModal({ isOpen, onClose }: AddBookModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookFormData>();

  const onSubmit = async (data: BookFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('New book data:', data);
      toast.success('Book added successfully!');
      reset();
      onClose();
    } catch (error) {
      toast.error('Failed to add book. Please try again.');
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
                  Add New Book
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
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Book Title *
                  </label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    type="text"
                    className="input-field"
                    placeholder="Enter book title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-rose-600">{errors.title.message}</p>
                  )}
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Author *
                  </label>
                  <input
                    {...register('author', { required: 'Author is required' })}
                    type="text"
                    className="input-field"
                    placeholder="Enter author name"
                  />
                  {errors.author && (
                    <p className="mt-1 text-sm text-rose-600">{errors.author.message}</p>
                  )}
                </div>

                {/* ISBN */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    ISBN *
                  </label>
                  <input
                    {...register('isbn', { required: 'ISBN is required' })}
                    type="text"
                    className="input-field"
                    placeholder="978-0000000000"
                  />
                  {errors.isbn && (
                    <p className="mt-1 text-sm text-rose-600">{errors.isbn.message}</p>
                  )}
                </div>

                {/* Edition and Publisher */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Edition *
                    </label>
                    <input
                      {...register('edition', { required: 'Edition is required' })}
                      type="text"
                      className="input-field"
                      placeholder="2023"
                    />
                    {errors.edition && (
                      <p className="mt-1 text-sm text-rose-600">{errors.edition.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Publisher *
                    </label>
                    <input
                      {...register('publisher', { required: 'Publisher is required' })}
                      type="text"
                      className="input-field"
                      placeholder="Publisher name"
                    />
                    {errors.publisher && (
                      <p className="mt-1 text-sm text-rose-600">{errors.publisher.message}</p>
                    )}
                  </div>
                </div>

                {/* Category and Total Copies */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Category *
                    </label>
                    <select
                      {...register('category', { required: 'Category is required' })}
                      className="input-field"
                    >
                      <option value="">Select Category</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="English">English</option>
                      <option value="History">History</option>
                      <option value="Geography">Geography</option>
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-rose-600">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Total Copies *
                    </label>
                    <input
                      {...register('totalCopies', { 
                        required: 'Total copies is required',
                        min: { value: 1, message: 'Must be at least 1' }
                      })}
                      type="number"
                      min="1"
                      className="input-field"
                      placeholder="10"
                    />
                    {errors.totalCopies && (
                      <p className="mt-1 text-sm text-rose-600">{errors.totalCopies.message}</p>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Purchase Price *
                  </label>
                  <input
                    {...register('price', { 
                      required: 'Price is required',
                      min: { value: 1, message: 'Price must be positive' }
                    })}
                    type="number"
                    min="1"
                    step="0.01"
                    className="input-field"
                    placeholder="500"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-rose-600">{errors.price.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="input-field"
                    placeholder="Brief description of the book..."
                  />
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
                {isSubmitting ? 'Adding...' : 'Add Book'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}