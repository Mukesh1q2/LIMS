'use client';

import { useInView } from 'react-intersection-observer';
import { 
  Zap,
  TrendingUp,
  DollarSign,
  Brain,
} from 'lucide-react';
import { benefits } from '@/lib/content';
import { clsx } from 'clsx';

const iconMap = {
  Zap,
  TrendingUp,
  DollarSign,
  Brain,
};

export function BenefitsSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className={clsx(
          "text-center mb-16",
          inView ? "animate-fade-in" : "opacity-0"
        )}>
          <h2 className="font-display text-h1 text-neutral-900 mb-6">
            Why Institutes Choose
            <span className="text-gradient block mt-2">LIMS</span>
          </h2>
          <p className="text-body-lg text-neutral-600 max-w-3xl mx-auto">
            Join hundreds of educational institutions that have transformed their operations 
            and improved outcomes with our intelligent management system.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = iconMap[benefit.icon as keyof typeof iconMap];
            
            return (
              <div
                key={benefit.id}
                className={clsx(
                  "text-center group",
                  inView ? "animate-slide-up" : "opacity-0"
                )}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative mb-6">
                  {/* Icon Container */}
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Stat Badge */}
                  {benefit.stat && (
                    <div className="absolute -top-2 -right-2 bg-white rounded-full px-3 py-1 shadow-lg border border-neutral-200">
                      <div className="text-sm font-bold text-primary-600">
                        {benefit.stat}
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-xl text-neutral-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-neutral-600 mb-4">
                  {benefit.description}
                </p>
                
                {benefit.statLabel && (
                  <div className="inline-flex items-center space-x-2 bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    <span>{benefit.statLabel}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Stats */}
        <div className="mt-20 bg-white rounded-2xl p-8 lg:p-12 border border-neutral-200">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className={clsx(
              inView && "animate-fade-in animation-delay-400"
            )}>
              <div className="text-4xl lg:text-5xl font-bold text-primary-600 mb-2">
                500+
              </div>
              <div className="text-neutral-600 font-medium">
                Educational Institutes
              </div>
              <div className="text-sm text-neutral-500 mt-1">
                Trust LIMS for their operations
              </div>
            </div>
            
            <div className={clsx(
              inView && "animate-fade-in animation-delay-600"
            )}>
              <div className="text-4xl lg:text-5xl font-bold text-emerald-600 mb-2">
                100K+
              </div>
              <div className="text-neutral-600 font-medium">
                Students Managed
              </div>
              <div className="text-sm text-neutral-500 mt-1">
                Across our partner institutes
              </div>
            </div>
            
            <div className={clsx(
              inView && "animate-fade-in animation-delay-800"
            )}>
              <div className="text-4xl lg:text-5xl font-bold text-purple-600 mb-2">
                24/7
              </div>
              <div className="text-neutral-600 font-medium">
                Expert Support
              </div>
              <div className="text-sm text-neutral-500 mt-1">
                Available whenever you need us
              </div>
            </div>
          </div>
        </div>

        {/* Success Story Teaser */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-primary-50 to-purple-50 px-8 py-4 rounded-full border border-primary-200">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-semibold text-neutral-900">4.9/5 Customer Satisfaction</div>
              <div className="text-sm text-neutral-600">Based on 200+ institute reviews</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}