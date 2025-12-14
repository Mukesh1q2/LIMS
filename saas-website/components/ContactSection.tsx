'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { 
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from 'lucide-react';
import { clsx } from 'clsx';
import { analytics, useAnalytics } from './Analytics';
import { 
  FormField, 
  TextAreaField, 
  SelectField, 
  useFieldValidation, 
  validationRules 
} from './FormValidation';

export function ContactSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { isTrackingEnabled } = useAnalytics();

  // Track section view
  useEffect(() => {
    if (inView && isTrackingEnabled) {
      analytics.trackContactFormView();
    }
  }, [inView, isTrackingEnabled]);

  // Individual field validation using enhanced hooks
  const nameField = useFieldValidation({
    rules: {
      ...validationRules.name,
      ...validationRules.required,
    },
    validateOnChange: true,
  });

  const emailField = useFieldValidation({
    rules: {
      ...validationRules.email,
      ...validationRules.required,
    },
    validateOnChange: true,
  });

  const phoneField = useFieldValidation({
    rules: {
      ...validationRules.phone,
    },
    validateOnChange: true,
  });

  const instituteField = useFieldValidation({
    rules: {
      ...validationRules.institute,
      ...validationRules.required,
    },
    validateOnChange: true,
  });

  const studentsField = useFieldValidation({
    rules: {
      ...validationRules.students,
      ...validationRules.required,
    },
    validateOnChange: true,
  });

  const messageField = useFieldValidation({
    rules: {
      minLength: 10,
      maxLength: 500,
    },
    validateOnChange: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Check if all required fields are valid
    const requiredFields = [nameField, emailField, instituteField, studentsField];
    const allValid = requiredFields.every(field => field.validation.isValid);

    if (!allValid) {
      setSubmitStatus('error');
      setSubmitMessage('Please fix the errors in the form before submitting.');
      setIsSubmitting(false);
      return;
    }

    const formData = {
      name: nameField.value,
      email: emailField.value,
      phone: phoneField.value,
      institute: instituteField.value,
      students: studentsField.value,
      message: messageField.value,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage(result.message);
        
        // Track successful form submission
        if (isTrackingEnabled) {
          analytics.trackContactFormSubmit(true);
        }
        
        // Reset all fields on success
        nameField.reset();
        emailField.reset();
        phoneField.reset();
        instituteField.reset();
        studentsField.reset();
        messageField.reset();
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.error || 'Something went wrong. Please try again.');
        
        // Track failed form submission
        if (isTrackingEnabled) {
          analytics.trackContactFormSubmit(false);
        }
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please check your connection and try again.');
      
      // Track error form submission
      if (isTrackingEnabled) {
        analytics.trackContactFormSubmit(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className={clsx(
          "text-center mb-16",
          inView ? "animate-fade-in" : "opacity-0"
        )}>
          <h2 className="font-display text-h1 text-neutral-900 mb-6">
            Ready to Transform
            <span className="text-gradient block mt-2">Your Institute?</span>
          </h2>
          <p className="text-body-lg text-neutral-600 max-w-3xl mx-auto">
            Join hundreds of educational institutions that have already modernized 
            their operations with LIMS. Get started today with a free consultation.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className={clsx(
            inView ? "animate-slide-up" : "opacity-0"
          )}>
            <div className="bg-background rounded-2xl p-8 border border-neutral-200">
              <h3 className="font-semibold text-xl text-neutral-900 mb-6">
                Get Your Free Consultation
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    label="Full Name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your full name"
                    value={nameField.value}
                    onChange={nameField.handleChange}
                    onBlur={nameField.handleBlur}
                    validation={nameField.validation}
                    rules={nameField.validation}
                  />
                  
                  <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={emailField.value}
                    onChange={emailField.handleChange}
                    onBlur={emailField.handleBlur}
                    validation={emailField.validation}
                    rules={emailField.validation}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={phoneField.value}
                    onChange={phoneField.handleChange}
                    onBlur={phoneField.handleBlur}
                    validation={phoneField.validation}
                    rules={phoneField.validation}
                  />
                  
                  <SelectField
                    label="Number of Students"
                    name="students"
                    required
                    placeholder="Select range"
                    value={studentsField.value}
                    onChange={studentsField.handleChange}
                    onBlur={studentsField.handleBlur}
                    validation={studentsField.validation}
                    options={[
                      { value: '', label: 'Select range' },
                      { value: '1-50', label: '1-50 students' },
                      { value: '51-200', label: '51-200 students' },
                      { value: '201-500', label: '201-500 students' },
                      { value: '501-1000', label: '501-1000 students' },
                      { value: '1000+', label: '1000+ students' },
                    ]}
                  />
                </div>

                <FormField
                  label="Institute Name"
                  name="institute"
                  type="text"
                  required
                  placeholder="Your institute name"
                  value={instituteField.value}
                  onChange={instituteField.handleChange}
                  onBlur={instituteField.handleBlur}
                  validation={instituteField.validation}
                  rules={instituteField.validation}
                />

                <TextAreaField
                  label="How can we help?"
                  name="message"
                  placeholder="Tell us about your requirements..."
                  rows={4}
                  maxLength={500}
                  showCharCount
                  value={messageField.value}
                  onChange={messageField.handleChange}
                  onBlur={messageField.handleBlur}
                  validation={messageField.validation}
                  helpText="Please describe your requirements and any specific features you need."
                />

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-emerald-700 text-sm font-medium">{submitMessage}</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-rose-700 text-sm font-medium">{submitMessage}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Schedule Free Demo'
                  )}
                </button>

                <p className="text-sm text-neutral-500 text-center">
                  We'll get back to you within 2 hours during business hours
                </p>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className={clsx(
            "space-y-8",
            inView && "animate-slide-up animation-delay-200"
          )}>
            {/* Contact Methods */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <PhoneIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-1">Phone Support</h4>
                  <p className="text-neutral-600 mb-2">Speak directly with our experts</p>
                  <p className="text-primary-600 font-medium">+91 9876543210</p>
                  <p className="text-sm text-neutral-500">Mon-Sat, 9 AM - 6 PM IST</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <EnvelopeIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-1">Email Support</h4>
                  <p className="text-neutral-600 mb-2">Send us your questions anytime</p>
                  <p className="text-primary-600 font-medium">support@lims.com</p>
                  <p className="text-sm text-neutral-500">Response within 2 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPinIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-1">Office Location</h4>
                  <p className="text-neutral-600 mb-2">Visit us for in-person consultation</p>
                  <p className="text-neutral-700">
                    LIMS Technologies Pvt Ltd<br />
                    Tech Park, Sector 62<br />
                    Noida, UP 201301
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ClockIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-1">Business Hours</h4>
                  <p className="text-neutral-600 mb-2">When we're available to help</p>
                  <div className="text-neutral-700 space-y-1">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl p-6 border border-primary-200">
              <h4 className="font-semibold text-neutral-900 mb-4">
                Need Immediate Help?
              </h4>
              <div className="space-y-3">
                <button className="w-full btn-secondary text-left justify-start">
                  Start Free Trial (14 days)
                </button>
                <button className="w-full btn-ghost text-left justify-start">
                  Download Product Brochure
                </button>
                <button className="w-full btn-ghost text-left justify-start">
                  Watch Video Demo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="font-display text-3xl font-bold mb-4">
              Ready to Modernize Your Institute?
            </h3>
            <p className="text-neutral-300 mb-8 max-w-2xl mx-auto">
              Join the educational revolution. Thousands of institutes trust LIMS 
              to streamline their operations and improve outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary bg-white text-neutral-900 hover:bg-neutral-100">
                Start Free Trial
              </button>
              <button className="btn-secondary border-white text-white hover:bg-white hover:text-neutral-900">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}