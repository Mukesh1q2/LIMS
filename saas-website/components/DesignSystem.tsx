'use client';

import React from 'react';
import { 
  Feature, 
  PricingTier, 
  Testimonial, 
  FAQ, 
  Benefit, 
  ProcessStep, 
  HeroContent,
  Integration 
} from '@/types';
import { LIMSLogo, iconMap } from '@/components/Icons';

interface FeatureCardProps {
  feature: Feature;
  index: number;
  inView: boolean;
}

export function FeatureCard({ feature, index, inView }: FeatureCardProps) {
  const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || iconMap.dashboard;
  
  return (
    <div 
      className={`group relative bg-white rounded-2xl p-8 border border-neutral-200 hover:border-primary-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        inView ? 'animate-slide-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" 
           style={{ padding: '1px' }}>
        <div className="w-full h-full bg-white rounded-2xl" />
      </div>
      
      {/* Icon */}
      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <IconComponent size={24} className="text-white" />
      </div>
      
      {/* Content */}
      <h3 className="text-xl font-semibold text-neutral-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
        {feature.title}
      </h3>
      <p className="text-neutral-600 mb-6 leading-relaxed">
        {feature.description}
      </p>
      
      {/* Benefits list */}
      <ul className="space-y-3">
        {feature.benefits.map((benefit, benefitIndex) => (
          <li key={benefitIndex} className="flex items-start">
            <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
              <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm text-neutral-700">{benefit}</span>
          </li>
        ))}
      </ul>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}

interface PricingCardProps {
  tier: PricingTier;
  inView: boolean;
}

export function PricingCard({ tier, inView }: PricingCardProps) {
  return (
    <div 
      className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
        tier.isPopular 
          ? 'border-primary-500 shadow-lg shadow-primary-500/20' 
          : 'border-neutral-200 hover:border-primary-200'
      } ${inView ? 'animate-slide-up' : 'opacity-0'}`}
    >
      {/* Popular badge */}
      {tier.isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-primary-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
            Most Popular
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-neutral-900 mb-2">{tier.name}</h3>
        <p className="text-neutral-600 mb-6">{tier.description}</p>
        
        {/* Price */}
        <div className="mb-6">
          <span className="text-5xl font-bold text-neutral-900">₹{tier.price.toLocaleString()}</span>
          <span className="text-neutral-500">/{tier.period}</span>
        </div>
        
        {/* Limits */}
        <div className="space-y-2 mb-6">
          {tier.maxStudents && (
            <div className="flex items-center justify-center text-sm text-neutral-600">
              <svg className="w-4 h-4 mr-2 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {tier.maxStudents}
            </div>
          )}
          {tier.maxStaff && (
            <div className="flex items-center justify-center text-sm text-neutral-600">
              <svg className="w-4 h-4 mr-2 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {tier.maxStaff}
            </div>
          )}
          {tier.support && (
            <div className="flex items-center justify-center text-sm text-neutral-600">
              <svg className="w-4 h-4 mr-2 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {tier.support}
            </div>
          )}
        </div>
      </div>
      
      {/* Features */}
      <ul className="space-y-4 mb-8">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
              <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm text-neutral-700">{feature}</span>
          </li>
        ))}
      </ul>
      
      {/* CTA Button */}
      <button
        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
          tier.isPopular
            ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white hover:shadow-lg hover:shadow-primary-500/25 hover:scale-105'
            : 'bg-neutral-100 text-neutral-900 hover:bg-primary-50 hover:text-primary-600'
        }`}
      >
        {tier.cta}
      </button>
    </div>
  );
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  inView: boolean;
}

export function TestimonialCard({ testimonial, index, inView }: TestimonialCardProps) {
  return (
    <div 
      className={`bg-white rounded-2xl p-8 border border-neutral-200 hover:shadow-lg transition-all duration-300 ${
        inView ? 'animate-slide-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Quote */}
      <div className="mb-6">
        <svg className="w-8 h-8 text-primary-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
        </svg>
        <p className="text-lg text-neutral-700 leading-relaxed italic">
          "{testimonial.quote}"
        </p>
      </div>
      
      {/* Author */}
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
          <span className="text-white font-semibold text-lg">
            {testimonial.author.name.charAt(0)}
          </span>
        </div>
        <div>
          <h4 className="font-semibold text-neutral-900">{testimonial.author.name}</h4>
          <p className="text-sm text-neutral-600">{testimonial.author.title}, {testimonial.author.company}</p>
        </div>
      </div>
      
      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200">
        {testimonial.metrics.map((metric, metricIndex) => (
          <div key={metricIndex} className="text-center">
            <div className="text-2xl font-bold text-primary-600">{metric.value}</div>
            <div className="text-xs text-neutral-500">{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface BenefitCardProps {
  benefit: Benefit;
  index: number;
  inView: boolean;
}

export function BenefitCard({ benefit, index, inView }: BenefitCardProps) {
  const IconComponent = iconMap[benefit.icon as keyof typeof iconMap] || iconMap.analytics;
  
  return (
    <div 
      className={`text-center group ${
        inView ? 'animate-slide-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Icon */}
      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
        <IconComponent size={32} className="text-white" />
      </div>
      
      {/* Stat */}
      {benefit.stat && (
        <div className="text-4xl font-bold text-gradient mb-2">{benefit.stat}</div>
      )}
      {benefit.statLabel && (
        <div className="text-sm text-neutral-500 mb-4">{benefit.statLabel}</div>
      )}
      
      {/* Content */}
      <h3 className="text-xl font-semibold text-neutral-900 mb-4">{benefit.title}</h3>
      <p className="text-neutral-600 leading-relaxed">{benefit.description}</p>
    </div>
  );
}

interface ProcessStepCardProps {
  step: ProcessStep;
  index: number;
  inView: boolean;
  totalSteps: number;
}

export function ProcessStepCard({ step, index, inView, totalSteps }: ProcessStepCardProps) {
  const IconComponent = iconMap[step.icon as keyof typeof iconMap] || iconMap.dashboard;
  
  return (
    <div 
      className={`relative ${
        inView ? 'animate-slide-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Connection line (except for last item) */}
      {index < totalSteps - 1 && (
        <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-purple-200 transform translate-x-8 z-0" />
      )}
      
      <div className="relative z-10 text-center">
        {/* Step number */}
        <div className="w-16 h-16 bg-white border-2 border-primary-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:border-primary-500 transition-colors duration-300">
          <IconComponent size={24} className="text-primary-600" />
        </div>
        
        {/* Content */}
        <h3 className="text-xl font-semibold text-neutral-900 mb-4">{step.title}</h3>
        <p className="text-neutral-600 leading-relaxed">{step.description}</p>
      </div>
    </div>
  );
}

interface FAQItemProps {
  faq: FAQ;
  index: number;
  inView: boolean;
}

export function FAQItem({ faq, index, inView }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div 
      className={`border border-neutral-200 rounded-xl overflow-hidden ${
        inView ? 'animate-slide-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left bg-white hover:bg-neutral-50 transition-colors duration-200 flex items-center justify-between"
      >
        <h3 className="text-lg font-semibold text-neutral-900 pr-4">{faq.question}</h3>
        <svg 
          className={`w-5 h-5 text-neutral-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200">
          <p className="text-neutral-700 leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </div>
  );
}

// Export all components
export const LIMSComponents = {
  FeatureCard,
  PricingCard,
  TestimonialCard,
  BenefitCard,
  ProcessStepCard,
  FAQItem,
  LIMSLogo,
};