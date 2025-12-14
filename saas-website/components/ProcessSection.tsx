'use client';

import { useInView } from 'react-intersection-observer';
import { 
  Rocket,
  Users,
  Globe,
  TrendingUp,
} from 'lucide-react';
import { processSteps } from '@/lib/content';
import { clsx } from 'clsx';

const iconMap = {
  Rocket,
  Users,
  Globe,
  TrendingUp,
};

export function ProcessSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section id="process" className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className={clsx(
          "text-center mb-16",
          inView ? "animate-fade-in" : "opacity-0"
        )}>
          <h2 className="font-display text-h1 text-neutral-900 mb-6">
            Get Started in
            <span className="text-gradient block mt-2">4 Simple Steps</span>
          </h2>
          <p className="text-body-lg text-neutral-600 max-w-3xl mx-auto">
            Our streamlined onboarding process ensures you're up and running quickly 
            with minimal disruption to your institute's operations.
          </p>
        </div>

        {/* Process Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500 transform -translate-y-1/2 z-0" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {processSteps.map((step, index) => {
                const IconComponent = iconMap[step.icon as keyof typeof iconMap];
                
                return (
                  <div
                    key={step.id}
                    className={clsx(
                      "text-center group",
                      inView ? "animate-slide-up" : "opacity-0"
                    )}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    {/* Step Number & Icon */}
                    <div className="relative mb-6">
                      {/* Step Number Background */}
                      <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                      
                      {/* Step Number Badge */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-neutral-200">
                        <span className="text-sm font-bold text-primary-600">
                          {step.id}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="font-semibold text-xl text-neutral-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-neutral-600">
                      {step.description}
                    </p>

                    {/* Arrow (Desktop only) */}
                    {index < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-neutral-200">
                          <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Implementation Timeline */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-neutral-50 to-primary-50 rounded-2xl p-8 lg:p-12 border border-neutral-200">
            <div className="text-center mb-8">
              <h3 className="font-semibold text-2xl text-neutral-900 mb-4">
                Typical Implementation Timeline
              </h3>
              <p className="text-neutral-600">
                Most institutes are fully operational within 1-2 weeks
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">1</span>
                </div>
                <h4 className="font-medium text-neutral-900 mb-2">Day 1-3</h4>
                <p className="text-sm text-neutral-600">Setup and initial configuration</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">2</span>
                </div>
                <h4 className="font-medium text-neutral-900 mb-2">Day 4-7</h4>
                <p className="text-sm text-neutral-600">Data migration and staff training</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">3</span>
                </div>
                <h4 className="font-medium text-neutral-900 mb-2">Day 8-10</h4>
                <p className="text-sm text-neutral-600">Testing and optimization</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">4</span>
                </div>
                <h4 className="font-medium text-neutral-900 mb-2">Day 11+</h4>
                <p className="text-sm text-neutral-600">Go live and ongoing support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Promise */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-6 bg-white px-8 py-6 rounded-full border border-neutral-200 shadow-sm">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-semibold text-neutral-900">Dedicated Implementation Team</div>
              <div className="text-sm text-neutral-600">Your success is our priority - we ensure smooth transition</div>
            </div>
            <button className="btn-primary">
              Talk to Implementation Expert
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}