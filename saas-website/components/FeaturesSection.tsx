'use client';

import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { 
  BarChart3,
  Users,
  Clock,
  CreditCard,
  BookOpen,
  MapPin,
  ArrowRightIcon,
} from 'lucide-react';
import { features } from '@/lib/content';
import { clsx } from 'clsx';

const iconMap = {
  BarChart3,
  Users,
  Clock,
  CreditCard,
  BookOpen,
  MapPin,
};

export function FeaturesSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [selectedFeature, setSelectedFeature] = useState(features[0]);

  return (
    <section id="features" className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className={clsx(
          "text-center mb-16",
          inView ? "animate-fade-in" : "opacity-0"
        )}>
          <h2 className="font-display text-h1 text-neutral-900 mb-6">
            Everything You Need to
            <span className="text-gradient block mt-2">
              Transform Your Institute
            </span>
          </h2>
          <p className="text-body-lg text-neutral-600 max-w-3xl mx-auto">
            LIMS brings together all the essential tools your institute needs in one 
            intelligent platform. From student enrollment to fee collection, we've got you covered.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feature Cards */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const IconComponent = iconMap[feature.icon as keyof typeof iconMap];
                const isSelected = selectedFeature.id === feature.id;
                
                return (
                  <div
                    key={feature.id}
                    className={clsx(
                      "card p-6 cursor-pointer transition-all duration-300",
                      isSelected && "border-2 border-primary-500 shadow-hover",
                      inView && "animate-slide-up"
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedFeature(feature)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={clsx(
                        "flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center",
                        isSelected 
                          ? "bg-primary-500 text-white" 
                          : "bg-primary-50 text-primary-600"
                      )}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-neutral-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-neutral-600 text-sm mb-4">
                          {feature.description}
                        </p>
                        <div className="flex items-center text-primary-600 text-sm font-medium">
                          Learn more
                          <ArrowRightIcon className="ml-1 w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feature Detail */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gradient-to-br from-neutral-50 to-primary-50 rounded-2xl p-8 border border-neutral-200">
                <div className="flex items-center space-x-3 mb-6">
                  {(() => {
                    const IconComponent = iconMap[selectedFeature.icon as keyof typeof iconMap];
                    return (
                      <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    );
                  })()}
                  <h3 className="font-semibold text-xl text-neutral-900">
                    {selectedFeature.title}
                  </h3>
                </div>

                <p className="text-neutral-700 mb-6">
                  {selectedFeature.description}
                </p>

                <div className="space-y-3">
                  <h4 className="font-semibold text-neutral-900 mb-3">
                    Key Benefits:
                  </h4>
                  {selectedFeature.benefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className={clsx(
                        "flex items-center space-x-3 text-sm",
                        inView && "animate-fade-in"
                      )}
                      style={{ animationDelay: `${(index + 3) * 100}ms` }}
                    >
                      <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-neutral-700">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <button className="btn-primary w-full">
                    Explore This Feature
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 bg-primary-50 text-primary-700 px-6 py-3 rounded-full">
            <span className="text-sm font-medium">Ready to see all features in action?</span>
            <button className="text-sm font-semibold underline hover:no-underline">
              Schedule a demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}