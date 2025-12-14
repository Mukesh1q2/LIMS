import Link from 'next/link';
import { 
  HomeIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <ExclamationTriangleIcon className="w-12 h-12 text-neutral-400" />
        </div>
        
        <h1 className="text-6xl font-bold text-neutral-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
          Page not found
        </h2>
        <p className="text-neutral-600 mb-8">
          Sorry, we couldn't find the page you're looking for. 
          It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="w-full btn-primary inline-flex items-center justify-center"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Go Home
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="w-full btn-secondary inline-flex items-center justify-center"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>
        
        <div className="mt-8 pt-8 border-t border-neutral-200">
          <p className="text-sm text-neutral-500 mb-4">
            Need help? Contact our support team
          </p>
          <Link 
            href="#contact"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            Contact Support →
          </Link>
        </div>
      </div>
    </div>
  );
}