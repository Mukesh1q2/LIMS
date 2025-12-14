'use client';

import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { 
  ArrowRightIcon,
  PlayIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { heroContent } from '@/lib/content';
import { clsx } from 'clsx';

export function HeroSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section 
      ref={ref}
      className="relative bg-background overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <svg 
          className="absolute inset-0 h-full w-full" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="hero-pattern"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle 
                cx="1" 
                cy="1" 
                r="1" 
                fill="currentColor" 
                className="text-neutral-200"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>
      </div>

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className={clsx(
            "space-y-8",
            inView ? "animate-slide-up" : "opacity-0"
          )}>
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
              <span>Now in Beta - Limited Time Pricing</span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="font-display text-display lg:text-6xl text-neutral-900 text-balance leading-tight">
                {heroContent.headline}
              </h1>
              <p className="text-body-lg text-neutral-600 mt-6 max-w-2xl">
                {heroContent.subheadline}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href={heroContent.primaryCTA.href}
                className="btn-primary inline-flex items-center justify-center group"
              >
                {heroContent.primaryCTA.text}
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="btn-secondary inline-flex items-center justify-center group">
                <PlayIcon className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-6 pt-8">
              <div className="text-sm text-neutral-500">
                Trusted by leading institutes:
              </div>
              <div className="flex items-center space-x-4">
                {/* Placeholder for institute logos */}
                <div className="flex items-center space-x-1">
                  <CheckCircleIcon className="h-4 w-4 text-success" />
                  <span className="text-sm text-neutral-600">Excellence Coaching</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircleIcon className="h-4 w-4 text-success" />
                  <span className="text-sm text-neutral-600">Vidyapeeth Academy</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-neutral-200">
              {heroContent.stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className={clsx(
                    "text-center",
                    inView && "animate-fade-in"
                  )}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="text-2xl lg:text-3xl font-bold text-primary-600">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-500 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div className={clsx(
            "relative",
            inView ? "animate-float" : "opacity-0"
          )}>
            {/* Main Dashboard Mockup */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-floating p-8 border border-neutral-200">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Institute Dashboard</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Total Students</div>
                    <div className="text-2xl font-bold text-blue-900">1,247</div>
                    <div className="text-xs text-blue-600">+12% this month</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg">
                    <div className="text-sm text-emerald-600 font-medium">Fee Collection</div>
                    <div className="text-2xl font-bold text-emerald-900">₹1.2L</div>
                    <div className="text-xs text-emerald-600">+8% vs last month</div>
                  </div>
                </div>

                {/* Chart Placeholder */}
                <div className="bg-neutral-50 rounded-lg p-4 h-32 flex items-center justify-center">
                  <div className="text-center text-neutral-500">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium">Analytics Dashboard</div>
                    <div className="text-xs">Real-time insights</div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-neutral-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-neutral-900">Attendance</div>
                    <div className="text-xs text-neutral-500">98% today</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 border border-neutral-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-neutral-900">Fee Status</div>
                    <div className="text-xs text-neutral-500">₹45K collected</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}