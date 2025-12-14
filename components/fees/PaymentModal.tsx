'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { FeeStructure } from '@/types';
import { formatCurrency, generateReceiptNumber, generateQRData } from '@/lib/utils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  feeStructure: FeeStructure | null;
}

interface PaymentFormData {
  amount: number;
  paymentMethod: 'cash' | 'card' | 'online' | 'cheque';
  notes?: string;
}

export function PaymentModal({ isOpen, onClose, feeStructure }: PaymentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PaymentFormData>();

  const paymentAmount = watch('amount') || 0;

  const onSubmit = async (data: PaymentFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const receiptNumber = generateReceiptNumber();
      const qrData = generateQRData(feeStructure?.studentId || '', receiptNumber);
      
      console.log('Payment data:', {
        ...data,
        feeStructureId: feeStructure?.id,
        receiptNumber,
        qrData,
      });
      
      toast.success('Payment recorded successfully!');
      setPaymentComplete(true);
      
      // Auto close after showing success
      setTimeout(() => {
        reset();
        setPaymentComplete(false);
        onClose();
      }, 2000);
      
    } catch (error) {
      toast.error('Failed to record payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setPaymentComplete(false);
    onClose();
  };

  if (!isOpen || !feeStructure) return null;

  const maxAmount = feeStructure.remainingAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose}></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {!paymentComplete ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Header */}
              <div className="bg-white px-6 py-4 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-neutral-900">
                    Record Payment
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
                {/* Student and Fee Info */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Payment Details</h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p><strong>Student:</strong> {feeStructure.student?.name || 'Unknown'}</p>
                    <p><strong>Fee Category:</strong> {feeStructure.category.name}</p>
                    <p><strong>Total Amount:</strong> {formatCurrency(feeStructure.amount)}</p>
                    <p><strong>Already Paid:</strong> {formatCurrency(feeStructure.paidAmount)}</p>
                    <p><strong>Remaining:</strong> {formatCurrency(feeStructure.remainingAmount)}</p>
                    <p><strong>Due Date:</strong> {feeStructure.dueDate}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Payment Amount */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Payment Amount *
                    </label>
                    <input
                      {...register('amount', { 
                        required: 'Amount is required',
                        min: { value: 1, message: 'Amount must be positive' },
                        max: { value: maxAmount, message: `Maximum amount is ${formatCurrency(maxAmount)}` }
                      })}
                      type="number"
                      min="1"
                      max={maxAmount}
                      step="0.01"
                      className="input-field"
                      placeholder="Enter payment amount"
                    />
                    {errors.amount && (
                      <p className="mt-1 text-sm text-rose-600">{errors.amount.message}</p>
                    )}
                    <p className="mt-1 text-xs text-neutral-500">
                      Maximum: {formatCurrency(maxAmount)}
                    </p>
                  </div>

                  {/* Quick Amount Buttons */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Quick Amounts
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[maxAmount, maxAmount * 0.75, maxAmount * 0.5].map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => {
                            // This would need to be handled differently with react-hook-form
                            // For demo purposes, just show the amount
                          }}
                          className="px-3 py-2 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50"
                        >
                          {formatCurrency(amount)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Payment Method *
                    </label>
                    <select
                      {...register('paymentMethod', { required: 'Payment method is required' })}
                      className="input-field"
                    >
                      <option value="">Select payment method</option>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="online">Online Transfer</option>
                      <option value="cheque">Cheque</option>
                    </select>
                    {errors.paymentMethod && (
                      <p className="mt-1 text-sm text-rose-600">{errors.paymentMethod.message}</p>
                    )}
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

                  {/* Payment Summary */}
                  {paymentAmount > 0 && (
                    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                      <h4 className="text-sm font-medium text-neutral-900 mb-2">Payment Summary</h4>
                      <div className="space-y-1 text-sm text-neutral-700">
                        <div className="flex justify-between">
                          <span>Payment Amount:</span>
                          <span className="font-medium">{formatCurrency(paymentAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Remaining After Payment:</span>
                          <span className="font-medium">
                            {formatCurrency(maxAmount - paymentAmount)}
                          </span>
                        </div>
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
                  disabled={isSubmitting || !paymentAmount}
                >
                  {isSubmitting ? 'Processing...' : 'Record Payment'}
                </button>
              </div>
            </form>
          ) : (
            /* Success State */
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Payment Successful!</h3>
              <p className="text-neutral-600 mb-4">Payment has been recorded successfully.</p>
              <div className="text-sm text-neutral-500">
                Redirecting...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}