'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Sidebar';
import { BookCatalog } from '@/components/library/BookCatalog';
import { BookFilters } from '@/components/library/BookFilters';
import { AddBookModal } from '@/components/library/AddBookModal';
import { IssueBookModal } from '@/components/library/IssueBookModal';
import { mockLibraryBooks, mockBookIssues } from '@/lib/mockData';
import { LibraryBook, BookIssue } from '@/types';
import { 
  BookOpenIcon,
  PlusIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export default function LibraryPage() {
  const [books] = useState<LibraryBook[]>(mockLibraryBooks);
  const [bookIssues] = useState<BookIssue[]>(mockBookIssues);
  const [filteredBooks, setFilteredBooks] = useState<LibraryBook[]>(mockLibraryBooks);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterBooks(term, selectedCategory);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterBooks(searchTerm, category);
  };

  const filterBooks = (search: string, category: string) => {
    let filtered = books;

    if (search) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase()) ||
        book.isbn.includes(search)
      );
    }

    if (category) {
      filtered = filtered.filter(book => book.category === category);
    }

    setFilteredBooks(filtered);
  };

  const categories = Array.from(new Set(books.map(b => b.category))).sort();
  const totalBooks = books.reduce((sum, book) => sum + book.totalCopies, 0);
  const availableBooks = books.reduce((sum, book) => sum + book.availableCopies, 0);
  const issuedBooks = totalBooks - availableBooks;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Library Management</h1>
            <p className="text-neutral-600 mt-1">
              Manage books, issues, and returns
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsIssueModalOpen(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowPathIcon className="w-5 h-5" />
              <span>Issue/Return</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Book</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                <BookOpenIcon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-neutral-500">Total Books</h3>
                <p className="text-2xl font-semibold text-neutral-900">{totalBooks}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                <BookOpenIcon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-neutral-500">Available</h3>
                <p className="text-2xl font-semibold text-neutral-900">{availableBooks}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                <BookOpenIcon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-neutral-500">Issued</h3>
                <p className="text-2xl font-semibold text-neutral-900">{issuedBooks}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
                <BookOpenIcon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-neutral-500">Overdue</h3>
                <p className="text-2xl font-semibold text-neutral-900">
                  {bookIssues.filter(issue => issue.status === 'overdue').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <BookFilters
          onSearch={handleSearch}
          onCategoryFilter={handleCategoryFilter}
          categories={categories}
          selectedCategory={selectedCategory}
        />

        {/* Book Catalog */}
        <BookCatalog books={filteredBooks} />

        {/* Modals */}
        <AddBookModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />

        <IssueBookModal
          isOpen={isIssueModalOpen}
          onClose={() => setIsIssueModalOpen(false)}
        />
      </div>
    </Layout>
  );
}