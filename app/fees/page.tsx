'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EnhancedLayout } from '@/components/layout/EnhancedLayout';
import { FeeTable } from '@/components/fees/FeeTable';
import { FeeFilters } from '@/components/fees/FeeFilters';
import { PaymentModal } from '@/components/fees/PaymentModal';
import { mockFeeStructures, mockStudents } from '@/lib/mockData';
import { FeeStructure } from '@/types';
import {
  CurrencyRupeeIcon,
  PlusIcon,
  DocumentTextIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export default function FeesPage() {
  const { hasPermission } = useAuth();
  const [feeStructures] = useState<FeeStructure[]>(mockFeeStructures);
  const [filteredFees, setFilteredFees] = useState<FeeStructure[]>(mockFeeStructures);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedFeeStructure, setSelectedFeeStructure] = useState<FeeStructure | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Check permissions
  const canRead = hasPermission('fees', 'read');
  const canCreate = hasPermission('fees', 'create');
  const canUpdate = hasPermission('fees', 'update');

  // Check if user has permission to access this page
  if (!canRead) {
    return (
      <EnhancedLayout>
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CurrencyRupeeIcon className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">Access Denied</h2>
            <p className="text-neutral-600 mb-4">
              You don't have permission to access the fee management.
            </p>
          </div>
        </div>
      </EnhancedLayout>
    );
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterFees(term, selectedStatus, selectedCategory);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    filterFees(searchTerm, status, selectedCategory);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterFees(searchTerm, selectedStatus, category);
  };

  const filterFees = (search: string, status: string, category: string) => {
    let filtered = feeStructures;

    if (search) {
      const student = mockStudents.find(s => 
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.enrollmentNumber.toLowerCase().includes(search.toLowerCase())
      );
      if (student) {
        filtered = filtered.filter(fee => fee.studentId === student.id);
      }
    }

    if (status) {
      filtered = filtered.filter(fee => fee.status === status);
    }

    if (category) {
      filtered = filtered.filter(fee => fee.categoryId === category);
    }

    setFilteredFees(filtered);
  };

  const handlePayment = (feeStructure: FeeStructure) => {
    setSelectedFeeStructure(feeStructure);
    setIsPaymentModalOpen(true);
  };

  const statuses = ['paid', 'pending', 'partial', 'overdue'];
  const categories = Array.from(new Set(feeStructures.map(f => f.categoryId))).filter(Boolean);

  // Calculate totals
  const totalCollected = feeStructures
    .filter(f => f.status === 'paid')
    .reduce((sum, f) => sum + f.paidAmount, 0);
  
  const totalPending = feeStructures
    .filter(f => f.status === 'pending' || f.status === 'partial')
    .reduce((sum, f) => sum + f.remainingAmount, 0);

  const totalOverdue = feeStructures
    .filter(f => f.status === 'overdue')
    .reduce((sum, f) => sum + f.remainingAmount, 0);

  return (
    <EnhancedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Fee Management</h1>
            <p className="text-neutral-600 mt-1">
              Manage fee collection and payments
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="btn-secondary flex items-center space-x-2">
              <DocumentTextIcon className="w-5 h-5" />
              <span>Generate Report</span>
            </button>
            {canCreate && (
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Record Payment</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                <CurrencyRupeeIcon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-neutral-500">Collected</h3>
                <p className="text-2xl font-semibold text-neutral-900">
                  ₹{(totalCollected / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                <CurrencyRupeeIcon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-neutral-500">Pending</h3>
                <p className="text-2xl font-semibold text-neutral-900">
                  ₹{(totalPending / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
                <CurrencyRupeeIcon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-neutral-500">Overdue</h3>
                <p className="text-2xl font-semibold text-neutral-900">
                  ₹{(totalOverdue / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                <ArrowPathIcon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-neutral-500">Success Rate</h3>
                <p className="text-2xl font-semibold text-neutral-900">
                  {Math.round((feeStructures.filter(f => f.status === 'paid').length / feeStructures.length) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <FeeFilters
          onSearch={handleSearch}
          onStatusFilter={handleStatusFilter}
          onCategoryFilter={handleCategoryFilter}
          statuses={statuses}
          categories={categories}
          selectedStatus={selectedStatus}
          selectedCategory={selectedCategory}
        />

        {/* Fee Table */}
        <FeeTable
          fees={filteredFees}
          onPayment={canUpdate ? handlePayment : undefined}
        />

        {/* Payment Modal */}
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedFeeStructure(null);
          }}
          feeStructure={selectedFeeStructure}
        />
      </div>
    </EnhancedLayout>
  );
}