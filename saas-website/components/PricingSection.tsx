'use client';

import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { CheckIcon, XMarkIcon } from 'lucide-react';
import { pricingTiers } from '@/lib/content';
import { clsx } from 'clsx';

export function PricingSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  return (
    <section id="pricing" className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className={clsx(
          "text-center mb-16",
          inView ? "animate-fade-in" : "opacity-0"
        )}>
          <h2 className="font-display text-h1 text-neutral-900 mb-6">
            Simple, Transparent
            <span className="text-gradient block mt-2">Pricing</span>
          </h2>
          <p className="text-body-lg text-neutral-600 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your institute. All plans include core features, 
            24/7 support, and unlimited updates. No hidden fees, ever.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-neutral-100 rounded-lg p-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={clsx(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                billingPeriod === 'monthly'
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={clsx(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                billingPeriod === 'annual'
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              Annual
              <span className="ml-2 bg-success text-white text-xs px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => {
            const price = billingPeriod === 'annual' ? Math.round(tier.price * 0.8) : tier.price;
            const isPopular = tier.isPopular;
            
            return (
              <div
                key={tier.id}
                className={clsx(
                  "relative",
                  inView ? "animate-slide-up" : "opacity-0",
                  isPopular && "transform scale-105"
                )}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className={clsx(
                  "h-full bg-white rounded-2xl border-2 p-8",
                  isPopular 
                    ? "border-primary-500 shadow-hover" 
                    : "border-neutral-200 shadow-card hover:shadow-hover"
                )}>
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className="font-semibold text-xl text-neutral-900 mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-neutral-600 text-sm mb-6">
                      {tier.description}
                    </p>
                    
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-neutral-900">
                        ₹{price.toLocaleString()}
                      </span>
                      <span className="text-neutral-500 ml-2">/{tier.period}</span>
                    </div>

                    {billingPeriod === 'annual' && (
                      <div className="text-sm text-success font-medium">
                        Save ₹{(tier.price - price).toLocaleString()} per year
                      </div>
                    )}
                  </div>

                  {/* Plan Limits */}
                  <div className="space-y-2 mb-8 text-sm">
                    {tier.maxStudents && (
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Students</span>
                        <span className="font-medium text-neutral-900">{tier.maxStudents}</span>
                      </div>
                    )}
                    {tier.maxStaff && (
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Staff Members</span>
                        <span className="font-medium text-neutral-900">{tier.maxStaff}</span>
                      </div>
                    )}
                    {tier.support && (
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Support</span>
                        <span className="font-medium text-neutral-900">{tier.support}</span>
                      </div>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <CheckIcon className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button 
                    className={clsx(
                      "w-full py-3 px-6 rounded-lg font-medium transition-all duration-200",
                      isPopular
                        ? "bg-primary-500 hover:bg-primary-600 text-white"
                        : "bg-neutral-900 hover:bg-neutral-800 text-white"
                    )}
                  >
                    {tier.cta}
                  </button>

                  {/* Additional Info */}
                  <div className="text-center mt-4">
                    <span className="text-xs text-neutral-500">
                      14-day free trial • No credit card required
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-neutral-50 to-primary-50 rounded-2xl p-8 border border-neutral-200 max-w-4xl mx-auto">
            <h3 className="font-semibold text-xl text-neutral-900 mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-neutral-600 mb-6">
              For large institutions with multiple campuses or specific requirements, 
              we offer custom enterprise solutions with dedicated support and training.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-secondary">
                Contact Sales Team
              </button>
              <button className="btn-primary">
                Schedule Enterprise Demo
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="mt-12 text-center">
          <p className="text-neutral-600">
            Have questions about our pricing?{' '}
            <a href="#faq" className="text-primary-600 font-medium hover:underline">
              Check our FAQ
            </a>
            {' '}or{' '}
            <a href="#contact" className="text-primary-600 font-medium hover:underline">
              contact our sales team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}