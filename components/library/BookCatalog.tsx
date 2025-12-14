'use client';

import { LibraryBook } from '@/types';
import { formatDate, getStatusColor } from '@/lib/utils';
import { 
  BookOpenIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

interface BookCatalogProps {
  books: LibraryBook[];
}

export function BookCatalog({ books }: BookCatalogProps) {
  if (books.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="text-neutral-400 mb-4">
          <BookOpenIcon className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">No books found</h3>
        <p className="text-neutral-600">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => {
        const usagePercentage = ((book.totalCopies - book.availableCopies) / book.totalCopies) * 100;
        
        return (
          <div key={book.id} className="card p-6 hover:shadow-hover transition-all duration-200">
            {/* Book Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-sm text-neutral-600 mb-1">{book.author}</p>
                <p className="text-xs text-neutral-500">{book.publisher}</p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <span className={`status-badge ${getStatusColor(book.availableCopies > 0 ? 'available' : 'unavailable')}`}>
                  {book.availableCopies > 0 ? 'Available' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Book Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-neutral-600">
                <TagIcon className="w-4 h-4 mr-2" />
                <span>{book.category} • {book.edition} Edition</span>
              </div>
              <div className="flex items-center text-sm text-neutral-600">
                <BookOpenIcon className="w-4 h-4 mr-2" />
                <span>ISBN: {book.isbn}</span>
              </div>
              <div className="flex items-center text-sm text-neutral-600">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span>Purchased: {formatDate(book.purchaseDate)}</span>
              </div>
            </div>

            {/* Availability Stats */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-neutral-600">Availability</span>
                <span className="font-medium text-neutral-900">
                  {book.availableCopies} / {book.totalCopies}
                </span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    usagePercentage > 80 ? 'bg-rose-500' :
                    usagePercentage > 50 ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`}
                  style={{ width: `${usagePercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>Used: {book.totalCopies - book.availableCopies}</span>
                <span>{Math.round(usagePercentage)}% utilized</span>
              </div>
            </div>

            {/* Price and Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              <div className="text-sm">
                <span className="text-neutral-600">Price: </span>
                <span className="font-semibold text-neutral-900">₹{book.price}</span>
              </div>
              <div className="flex space-x-2">
                <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                  View Details
                </button>
                {book.availableCopies > 0 && (
                  <button className="text-emerald-600 hover:text-emerald-900 text-sm font-medium">
                    Issue Book
                  </button>
                )}
              </div>
            </div>

            {/* Description */}
            {book.description && (
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <p className="text-sm text-neutral-600 line-clamp-2">
                  {book.description}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}