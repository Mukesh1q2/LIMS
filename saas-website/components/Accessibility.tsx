'use client';

import { useEffect, useRef } from 'react';

// Skip to main content link
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}

// Focus trap for modals and dialogs
export function useFocusTrap(isActive: boolean, onEscape?: () => void) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus first element
    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }

      if (e.key === 'Escape' && onEscape) {
        onEscape();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, onEscape]);

  return containerRef;
}

// Screen reader only content
export function ScreenReaderOnly({ 
  children,
  as: Component = 'span'
}: {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}) {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  );
}

// Accessible button with proper ARIA attributes
export function AccessibleButton({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  onClick,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
  onClick?: () => void;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 focus:ring-neutral-500',
    ghost: 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 focus:ring-neutral-500',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

// Accessible link component
export function AccessibleLink({
  children,
  href,
  variant = 'default',
  className = '',
  'aria-label': ariaLabel,
  ...props
}: {
  children: React.ReactNode;
  href: string;
  variant?: 'default' | 'primary' | 'secondary';
  className?: string;
  'aria-label'?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const variantClasses = {
    default: 'text-neutral-600 hover:text-neutral-900',
    primary: 'text-primary-600 hover:text-primary-700',
    secondary: 'text-neutral-500 hover:text-neutral-700',
  };

  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={`${variantClasses[variant]} transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

// Form field with proper accessibility
export function AccessibleFormField({
  label,
  id,
  error,
  required = false,
  children,
  helpText,
  ...props
}: {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  helpText?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const errorId = `${id}-error`;
  const helpTextId = `${id}-help`;

  return (
    <div className="space-y-1" {...props}>
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-neutral-700"
      >
        {label}
        {required && (
          <span className="text-rose-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {children}
      
      {helpText && !error && (
        <p id={helpTextId} className="text-sm text-neutral-500">
          {helpText}
        </p>
      )}
      
      {error && (
        <p 
          id={errorId} 
          className="text-sm text-rose-600"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// Live region for dynamic content updates
export function LiveRegion({
  children,
  level = 'polite',
  atomic = 'false'
}: {
  children: React.ReactNode;
  level?: 'polite' | 'assertive';
  atomic?: 'true' | 'false';
}) {
  return (
    <div 
      aria-live={level}
      aria-atomic={atomic}
      className="sr-only"
    >
      {children}
    </div>
  );
}