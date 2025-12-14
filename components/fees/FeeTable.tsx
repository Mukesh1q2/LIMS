'use client';

import { FeeStructure } from '@/types';
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils';
import { 
  CurrencyRupeeIcon,
  DocumentTextIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface FeeTableProps {
  fees: FeeStructure[];
  onPayment: (fee: FeeStructure) => void;
}

export function FeeTable({ fees, onPayment }: FeeTableProps) {
  if (fees.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="text-neutral-400 mb-4">
          <CurrencyRupeeIcon className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">No fee records found</h3>
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
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Paid
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Remaining
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {fees.map((fee) => (
              <tr key={fee.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-neutral-900">
                      {fee.student?.name || 'Unknown Student'}
                    </div>
                    <div className="text-sm text-neutral-500">
                      {fee.student?.enrollmentNumber || 'N/A'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-900">{fee.category.name}</div>
                  <div className="text-sm text-neutral-500">{fee.category.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-neutral-900">
                    {formatCurrency(fee.amount)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-900">{formatDate(fee.dueDate)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`status-badge ${getStatusColor(fee.status)}`}>
                    {fee.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-900">
                    {formatCurrency(fee.paidAmount)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    fee.remainingAmount > 0 ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    {formatCurrency(fee.remainingAmount)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      className="text-primary-600 hover:text-primary-900 p-1"
                      title="View Details"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      className="text-emerald-600 hover:text-emerald-900 p-1"
                      title="Generate Receipt"
                    >
                      <DocumentTextIcon className="w-4 h-4" />
                    </button>
                    {fee.remainingAmount > 0 && (
                      <button
                        onClick={() => onPayment(fee)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Record Payment"
                      >
                        <CurrencyRupeeIcon className="w-4 h-4" />
                      </button>
                    )}
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
              <span className="text-neutral-600">Total Records: </span>
              <span className="font-medium text-neutral-900">{fees.length}</span>
            </div>
            <div>
              <span className="text-neutral-600">Total Amount: </span>
              <span className="font-medium text-neutral-900">
                {formatCurrency(fees.reduce((sum, fee) => sum + fee.amount, 0))}
              </span>
            </div>
            <div>
              <span className="text-neutral-600">Total Collected: </span>
              <span className="font-medium text-emerald-600">
                {formatCurrency(fees.reduce((sum, fee) => sum + fee.paidAmount, 0))}
              </span>
            </div>
            <div>
              <span className="text-neutral-600">Total Pending: </span>
              <span className="font-medium text-rose-600">
                {formatCurrency(fees.reduce((sum, fee) => sum + fee.remainingAmount, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}