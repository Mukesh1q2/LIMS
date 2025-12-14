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

export const heroContent: HeroContent = {
  headline: "The Intelligent OS for Modern Educational Institutes",
  subheadline: "Streamline admissions, fees, library, and student data in one unified platform. Transform your institute's operations with AI-powered automation and real-time insights.",
  primaryCTA: {
    text: "Start Free Trial",
    href: "#pricing",
    style: "primary"
  },
  secondaryCTA: {
    text: "Book Demo",
    href: "#contact",
    style: "secondary"
  },
  stats: [
    { label: "Institutions Trust Us", value: "500+" },
    { label: "Students Managed", value: "100K+" },
    { label: "Time Saved Monthly", value: "70%" },
  ]
};

export const features: Feature[] = [
  {
    id: "dashboard",
    title: "Intelligent Dashboard & Analytics",
    description: "Get real-time insights into your institute's performance with AI-powered analytics and predictive reporting.",
    icon: "BarChart3",
    benefits: [
      "Real-time student and fee analytics",
      "Predictive attendance modeling",
      "Automated anomaly detection",
      "Custom KPI tracking"
    ]
  },
  {
    id: "students",
    title: "Complete Student Management",
    description: "From enrollment to graduation, manage every aspect of student lifecycle with automated workflows.",
    icon: "Users",
    benefits: [
      "Digital enrollment processing",
      "Automated ID card generation",
      "Parent communication portal",
      "Academic progress tracking"
    ]
  },
  {
    id: "attendance",
    title: "Smart Attendance System",
    description: "Track attendance patterns with IoT integration and automated alerts for low attendance.",
    icon: "Clock",
    benefits: [
      "Biometric & QR code integration",
      "Automated parent notifications",
      "Attendance analytics & trends",
      "Leave management system"
    ]
  },
  {
    id: "fees",
    title: "Automated Fee Management",
    description: "Streamline fee collection with automated reminders, online payments, and financial reporting.",
    icon: "CreditCard",
    benefits: [
      "Automated payment reminders",
      "Multiple payment gateway integration",
      "Real-time fee reconciliation",
      "Financial analytics & reports"
    ]
  },
  {
    id: "library",
    title: "Digital Library Management",
    description: "Modernize your library with digital cataloging, automated issue/return, and usage analytics.",
    icon: "BookOpen",
    benefits: [
      "Digital book catalog",
      "Automated fine calculation",
      "Reading analytics",
      "E-book integration"
    ]
  },
  {
    id: "seating",
    title: "Smart Seating & Locker Allocation",
    description: "Optimize space utilization with AI-powered seat allocation and locker management system.",
    icon: "MapPin",
    benefits: [
      "Visual seat allocation map",
      "Automated locker assignment",
      "Space optimization analytics",
      "Student preference matching"
    ]
  }
];

export const benefits: Benefit[] = [
  {
    id: "efficiency",
    title: "70% Reduction in Administrative Overhead",
    description: "Automate routine tasks and focus on what matters most - education.",
    icon: "Zap",
    stat: "70%",
    statLabel: "Less Admin Time"
  },
  {
    id: "retention",
    title: "Improved Student Retention",
    description: "Better engagement through improved communication and streamlined processes.",
    icon: "TrendingUp",
    stat: "25%",
    statLabel: "Better Retention"
  },
  {
    id: "collection",
    title: "Enhanced Fee Collection",
    description: "Automated reminders and multiple payment options increase collection rates.",
    icon: "DollarSign",
    stat: "40%",
    statLabel: "Faster Collections"
  },
  {
    id: "insights",
    title: "Data-Driven Decision Making",
    description: "Make informed decisions with comprehensive analytics and reporting.",
    icon: "Brain",
    stat: "100%",
    statLabel: "Data Visibility"
  }
];

export const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: 999,
    period: "month",
    description: "Perfect for small coaching institutes and tuition centers",
    maxStudents: "Up to 200 students",
    maxStaff: "Up to 5 staff members",
    support: "Email support",
    features: [
      "Student Management",
      "Basic Attendance Tracking",
      "Simple Fee Management",
      "Library Management",
      "Basic Reporting",
      "Mobile App Access",
      "Email Support"
    ],
    cta: "Start Free Trial"
  },
  {
    id: "professional",
    name: "Professional",
    price: 2499,
    period: "month",
    description: "Ideal for medium-sized institutes and schools",
    maxStudents: "Up to 1000 students",
    maxStaff: "Up to 20 staff members",
    support: "Priority support",
    features: [
      "Everything in Starter",
      "Advanced Analytics Dashboard",
      "Automated Fee Collection",
      "Parent Mobile App",
      "Advanced Reporting",
      "API Access",
      "Biometric Integration",
      "Priority Support",
      "Custom Branding"
    ],
    isPopular: true,
    cta: "Get Started"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 4999,
    period: "month",
    description: "For large institutions and multi-campus organizations",
    maxStudents: "Unlimited students",
    maxStaff: "Unlimited staff",
    support: "Dedicated account manager",
    features: [
      "Everything in Professional",
      "Multi-campus Management",
      "Advanced AI Analytics",
      "Custom Integrations",
      "White-label Solution",
      "Dedicated Account Manager",
      "24/7 Phone Support",
      "Custom Training",
      "SLA Guarantee"
    ],
    cta: "Contact Sales"
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote: "LIMS transformed our institute completely. We've reduced administrative work by 70% and our fee collection has improved significantly. The automation features are incredible.",
    author: {
      name: "Dr. Priya Sharma",
      title: "Director",
      company: "Excellence Coaching Institute"
    },
    metrics: [
      { label: "Admin Time Reduced", value: "70%" },
      { label: "Fee Collection Improved", value: "40%" },
      { label: "Student Satisfaction", value: "95%" }
    ]
  },
  {
    id: "2",
    quote: "The student management system is so intuitive. Our staff learned it in days, not weeks. The parent app has improved communication tremendously.",
    author: {
      name: "Rajesh Kumar",
      title: "Principal",
      company: "Vidyapeeth Academy"
    },
    metrics: [
      { label: "Setup Time", value: "3 days" },
      { label: "Staff Training", value: "2 hours" },
      { label: "Parent Engagement", value: "85%" }
    ]
  },
  {
    id: "3",
    quote: "Best investment we've made. The analytics help us make data-driven decisions and the automated systems save us countless hours every month.",
    author: {
      name: "Anita Gupta",
      title: "Administrator",
      company: "Success Learning Center"
    },
    metrics: [
      { label: "ROI", value: "300%" },
      { label: "Time Saved Monthly", value: "40 hours" },
      { label: "Error Reduction", value: "90%" }
    ]
  }
];

export const processSteps: ProcessStep[] = [
  {
    id: "1",
    title: "Quick Setup",
    description: "Import your existing data or start fresh. Our guided setup takes less than 30 minutes.",
    icon: "Rocket"
  },
  {
    id: "2",
    title: "Team Training",
    description: "Get your team up to speed with our comprehensive training program and ongoing support.",
    icon: "Users"
  },
  {
    id: "3",
    title: "Go Live",
    description: "Launch with confidence knowing our support team is here to ensure smooth operations.",
    icon: "Globe"
  },
  {
    id: "4",
    title: "Scale & Optimize",
    description: "Leverage advanced features and analytics to continuously improve your institute's performance.",
    icon: "TrendingUp"
  }
];

export const integrations: Integration[] = [
  {
    id: "razorpay",
    name: "Razorpay",
    description: "Secure payment processing with multiple payment methods",
    category: "payment"
  },
  {
    id: "payu",
    name: "PayU",
    description: "Comprehensive payment gateway with local payment options",
    category: "payment"
  },
  {
    id: "twilio",
    name: "Twilio",
    description: "SMS and voice communication with parents and students",
    category: "communication"
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    description: "Reliable email delivery for important notifications",
    category: "communication"
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Advanced website and app analytics tracking",
    category: "analytics"
  },
  {
    id: "auth0",
    name: "Auth0",
    description: "Enterprise-grade authentication and security",
    category: "security"
  }
];

export const faqs: FAQ[] = [
  {
    id: "1",
    question: "How long does implementation take?",
    answer: "Most institutes are up and running within 1-2 weeks. We provide guided setup, data migration assistance, and comprehensive training to ensure a smooth transition.",
    category: "general"
  },
  {
    id: "2",
    question: "Is my data secure?",
    answer: "Absolutely. We use enterprise-grade security with 256-bit encryption, regular security audits, and comply with international data protection standards. Your data is hosted on secure cloud infrastructure.",
    category: "technical"
  },
  {
    id: "3",
    question: "Can I migrate from my existing system?",
    answer: "Yes! We provide free data migration assistance. Our team will help you transfer all student records, fee data, and other important information seamlessly.",
    category: "technical"
  },
  {
    id: "4",
    question: "What kind of support do you provide?",
    answer: "We offer multiple support channels including email, phone, and live chat. Professional and Enterprise plans include priority support and dedicated account managers.",
    category: "support"
  },
  {
    id: "5",
    question: "Can I customize the system for my institute?",
    answer: "Yes! Professional and Enterprise plans include customization options, custom branding, and API access for integrations with your existing systems.",
    category: "technical"
  },
  {
    id: "6",
    question: "Is there a free trial?",
    answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start your trial.",
    category: "pricing"
  },
  {
    id: "7",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, UPI, net banking, and can arrange for bank transfers for annual plans. All payments are processed securely.",
    category: "pricing"
  },
  {
    id: "8",
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time. We'll provide 30 days notice and help you export all your data before cancellation.",
    category: "pricing"
  }
];