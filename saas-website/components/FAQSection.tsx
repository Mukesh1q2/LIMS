'use client';

import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { faqs } from '@/lib/content';
import { clsx } from 'clsx';

const categoryColors = {
  general: 'bg-blue-50 text-blue-700 border-blue-200',
  pricing: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  technical: 'bg-purple-50 text-purple-700 border-purple-200',
  support: 'bg-amber-50 text-amber-700 border-amber-200',
};

const categoryNames = {
  general: 'General',
  pricing: 'Pricing',
  technical: 'Technical',
  support: 'Support',
};

export function FAQSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section id="faq" className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className={clsx(
          "text-center mb-16",
          inView ? "animate-fade-in" : "opacity-0"
        )}>
          <h2 className="font-display text-h1 text-neutral-900 mb-6">
            Frequently Asked
            <span className="text-gradient block mt-2">Questions</span>
          </h2>
          <p className="text-body-lg text-neutral-600 max-w-3xl mx-auto">
            Find answers to common questions about LIMS. Can't find what you're looking for? 
            Our support team is here to help.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Category Filter */}
          <div className={clsx(
            "flex flex-wrap justify-center gap-2 mb-12",
            inView && "animate-fade-in animation-delay-200"
          )}>
            <button
              onClick={() => setSelectedCategory('all')}
              className={clsx(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                selectedCategory === 'all'
                  ? "bg-primary-500 text-white"
                  : "bg-white text-neutral-600 border border-neutral-200 hover:border-primary-300"
              )}
            >
              All Questions
            </button>
            {Object.entries(categoryNames).map(([key, name]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={clsx(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  selectedCategory === key
                    ? "bg-primary-500 text-white"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:border-primary-300"
                )}
              >
                {name}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div
                key={faq.id}
                className={clsx(
                  "bg-white rounded-xl border border-neutral-200 overflow-hidden",
                  inView ? "animate-slide-up" : "opacity-0"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={clsx(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                        categoryColors[faq.category]
                      )}>
                        {categoryNames[faq.category]}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg text-neutral-900 pr-4">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0">
                    {openFAQ === faq.id ? (
                      <ChevronUpIcon className="w-6 h-6 text-neutral-400" />
                    ) : (
                      <ChevronDownIcon className="w-6 h-6 text-neutral-400" />
                    )}
                  </div>
                </button>

                {openFAQ === faq.id && (
                  <div className="px-6 pb-6">
                    <div className="pt-4 border-t border-neutral-100">
                      <p className="text-neutral-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                No questions found
              </h3>
              <p className="text-neutral-600">
                Try selecting a different category or contact our support team.
              </p>
            </div>
          )}
        </div>

        {/* Support CTA */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p-8 text-center border border-primary-200">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-xl text-neutral-900 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
              Our friendly support team is here to help. Get in touch and we'll 
              respond within 2 hours during business hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-secondary">
                Contact Support
              </button>
              <button className="btn-primary">
                Schedule a Call
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          <div className={clsx(
            inView && "animate-fade-in animation-delay-400"
          )}>
            <div className="text-3xl font-bold text-primary-600 mb-2">
              2 hrs
            </div>
            <div className="text-neutral-600 font-medium">
              Average Response Time
            </div>
          </div>
          
          <div className={clsx(
            inView && "animate-fade-in animation-delay-600"
          )}>
            <div className="text-3xl font-bold text-emerald-600 mb-2">
              98%
            </div>
            <div className="text-neutral-600 font-medium">
              Customer Satisfaction
            </div>
          </div>
          
          <div className={clsx(
            inView && "animate-fade-in animation-delay-800"
          )}>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              24/7
            </div>
            <div className="text-neutral-600 font-medium">
              Support Available
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}