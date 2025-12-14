'use client';

import { clsx } from 'clsx';

// Skeleton component for loading states
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx('animate-pulse bg-neutral-200 rounded', className)}
      {...props}
    />
  );
}

// Loading spinner component
export function LoadingSpinner({ 
  size = 'md', 
  className = '',
  text = 'Loading...'
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className={clsx('flex flex-col items-center justify-center', className)}>
      <div className={clsx(
        'animate-spin rounded-full border-2 border-neutral-300 border-t-primary-500',
        sizeClasses[size]
      )} />
      {text && (
        <p className="mt-2 text-sm text-neutral-600">{text}</p>
      )}
    </div>
  );
}

// Skeleton for hero section
export function HeroSkeleton() {
  return (
    <div className="section-padding bg-background">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-12 w-full max-w-lg" />
              <Skeleton className="h-6 w-full max-w-2xl" />
            </div>
            <div className="flex space-x-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-24" />
            </div>
            <div className="grid grid-cols-3 gap-6 pt-8">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-14" />
            </div>
          </div>
          <div className="relative">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton for feature cards
export function FeaturesSkeleton() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <Skeleton className="h-12 w-96 mx-auto mb-6" />
          <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-start space-x-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Skeleton for pricing cards
export function PricingSkeleton() {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-16">
          <Skeleton className="h-12 w-80 mx-auto mb-6" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
        </div>
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-8">
              <div className="text-center mb-8">
                <Skeleton className="h-6 w-24 mx-auto mb-4" />
                <Skeleton className="h-4 w-48 mx-auto mb-4" />
                <Skeleton className="h-10 w-20 mx-auto" />
              </div>
              <div className="space-y-3 mb-8">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="flex items-center space-x-3">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Skeleton for testimonial cards
export function TestimonialsSkeleton() {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-16">
          <Skeleton className="h-12 w-96 mx-auto mb-6" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 lg:p-12 border border-neutral-200">
            <div className="text-center">
              <Skeleton className="w-16 h-16 rounded-full mx-auto mb-6" />
              <Skeleton className="h-8 w-full max-w-3xl mx-auto mb-8" />
              <div className="flex items-center justify-center space-x-4 mb-8">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="text-left space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="text-center">
                    <Skeleton className="h-8 w-16 mx-auto mb-2" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Loading page wrapper component
export function LoadingPage({ 
  variant = 'full',
  text = 'Loading...'
}: {
  variant?: 'full' | 'section';
  text?: string;
}) {
  if (variant === 'section') {
    return (
      <div className="section-padding bg-background">
        <div className="container-custom">
          <LoadingSpinner size="lg" text={text} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}