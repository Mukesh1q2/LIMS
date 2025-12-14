'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';

interface LazyImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  placeholder = 'empty',
  blurDataURL,
  priority = false,
  quality = 75,
  sizes,
  onLoad,
  onError,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div
        className={clsx(
          'flex items-center justify-center bg-neutral-100 text-neutral-400',
          className
        )}
        style={{ width, height }}
      >
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-2 text-sm">Image failed to load</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={imgRef} className="relative overflow-hidden">
      {isInView ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={clsx(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          priority={priority}
          quality={quality}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        <div
          className={clsx(
            'bg-neutral-100 animate-pulse',
            className
          )}
          style={{ width, height }}
        />
      )}
    </div>
  );
}

interface LazyComponentProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  placeholder?: React.ReactNode;
}

export function LazyComponent({
  children,
  className,
  threshold = 0.1,
  rootMargin = '50px 0px',
  placeholder,
}: LazyComponentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div ref={componentRef} className={className}>
      {isVisible ? children : (placeholder || <div className="min-h-[200px] bg-neutral-100 animate-pulse" />)}
    </div>
  );
}

interface PreloadResourceProps {
  href: string;
  as?: string;
  type?: string;
  crossOrigin?: string;
}

export function PreloadResource({ href, as, type, crossOrigin }: PreloadResourceProps) {
  return (
    <link
      rel="preload"
      href={href}
      as={as}
      type={type}
      crossOrigin={crossOrigin}
    />
  );
}

interface PerformanceMetricsProps {
  onMetrics?: (metrics: PerformanceMetrics) => void;
}

export function PerformanceMonitor({ onMetrics }: PerformanceMetricsProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Track Core Web Vitals
    const measureWebVitals = async () => {
      try {
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
        
        const metrics = {
          cls: 0,
          fid: 0,
          fcp: 0,
          lcp: 0,
          ttfb: 0,
        };

        getCLS((metric) => {
          metrics.cls = metric.value;
          onMetrics?.(metrics);
        });

        getFID((metric) => {
          metrics.fid = metric.value;
          onMetrics?.(metrics);
        });

        getFCP((metric) => {
          metrics.fcp = metric.value;
          onMetrics?.(metrics);
        });

        getLCP((metric) => {
          metrics.lcp = metric.value;
          onMetrics?.(metrics);
        });

        getTTFB((metric) => {
          metrics.ttfb = metric.value;
          onMetrics?.(metrics);
        });
      } catch (error) {
        console.warn('Failed to measure web vitals:', error);
      }
    };

    measureWebVitals();
  }, [onMetrics]);

  return null;
}

interface CodeSplittingWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function CodeSplittingWrapper({ children, fallback }: CodeSplittingWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return fallback || <div className="min-h-[200px] bg-neutral-100 animate-pulse" />;
  }

  return <>{children}</>;
}

// Bundle analyzer helper
export function analyzeBundleSize() {
  if (typeof window === 'undefined') return;

  // Log bundle information for optimization insights
  const perfEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  
  if (perfEntries.length > 0) {
    const navigation = perfEntries[0];
    console.log('Page Load Performance:', {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      totalTime: navigation.loadEventEnd - navigation.navigationStart,
    });
  }
}