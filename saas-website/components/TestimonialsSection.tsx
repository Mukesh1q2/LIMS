'use client';

import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ChevronLeftIcon, ChevronRightIcon, QuoteIcon } from 'lucide-react';
import { testimonials } from '@/lib/content';
import { clsx } from 'clsx';

export function TestimonialsSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className={clsx(
          "text-center mb-16",
          inView ? "animate-fade-in" : "opacity-0"
        )}>
          <h2 className="font-display text-h1 text-neutral-900 mb-6">
            Trusted by Leading
            <span className="text-gradient block mt-2">Educational Institutes</span>
          </h2>
          <p className="text-body-lg text-neutral-600 max-w-3xl mx-auto">
            See how institutes like yours are transforming their operations and 
            achieving better outcomes with LIMS.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Testimonial */}
            <div className="bg-white rounded-2xl p-8 lg:p-12 border border-neutral-200 shadow-card">
              <div className="text-center">
                {/* Quote Icon */}
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <QuoteIcon className="w-8 h-8 text-primary-600" />
                </div>

                {/* Quote */}
                <blockquote className="text-xl lg:text-2xl text-neutral-700 font-medium leading-relaxed mb-8 italic">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center justify-center space-x-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {testimonials[currentTestimonial].author.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-neutral-900">
                      {testimonials[currentTestimonial].author.name}
                    </div>
                    <div className="text-neutral-600">
                      {testimonials[currentTestimonial].author.title}
                    </div>
                    <div className="text-neutral-500 text-sm">
                      {testimonials[currentTestimonial].author.company}
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {testimonials[currentTestimonial].metrics.map((metric, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-primary-600 mb-1">
                        {metric.value}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 bg-white rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors duration-200"
              >
                <ChevronLeftIcon className="w-6 h-6 text-neutral-600" />
              </button>

              {/* Dots Indicator */}
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={clsx(
                      "w-3 h-3 rounded-full transition-colors duration-200",
                      index === currentTestimonial
                        ? "bg-primary-500"
                        : "bg-neutral-300 hover:bg-neutral-400"
                    )}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="w-12 h-12 bg-white rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors duration-200"
              >
                <ChevronRightIcon className="w-6 h-6 text-neutral-600" />
              </button>
            </div>
          </div>
        </div>

        {/* All Testimonials Grid */}
        <div className="mt-20">
          <h3 className="text-center text-xl font-semibold text-neutral-900 mb-12">
            More Success Stories
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={clsx(
                  "bg-white rounded-xl p-6 border border-neutral-200 cursor-pointer transition-all duration-200 hover:shadow-hover",
                  inView && "animate-fade-in"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setCurrentTestimonial(index)}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {testimonial.author.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-neutral-900 text-sm">
                      {testimonial.author.name}
                    </div>
                    <div className="text-neutral-500 text-xs">
                      {testimonial.author.company}
                    </div>
                  </div>
                </div>

                <blockquote className="text-neutral-700 text-sm mb-4 line-clamp-3">
                  "{testimonial.quote}"
                </blockquote>

                <div className="grid grid-cols-2 gap-2">
                  {testimonial.metrics.slice(0, 2).map((metric, metricIndex) => (
                    <div key={metricIndex} className="text-center">
                      <div className="text-lg font-bold text-primary-600">
                        {metric.value}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 bg-white px-8 py-4 rounded-full border border-neutral-200 shadow-sm">
            <div className="text-neutral-700">
              Ready to join our success stories?
            </div>
            <button className="btn-primary">
              Start Your Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}