// Types for LIMS SaaS Website

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
}

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  cta: string;
  maxStudents?: string;
  maxStaff?: string;
  support?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: {
    name: string;
    title: string;
    company: string;
    image?: string;
  };
  metrics: {
    label: string;
    value: string;
  }[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'pricing' | 'technical' | 'support';
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string;
  stat?: string;
  statLabel?: string;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'payment' | 'communication' | 'analytics' | 'security';
  logo?: string;
}

export interface NavItem {
  name: string;
  href: string;
  children?: NavItem[];
}

export interface CTA {
  text: string;
  href: string;
  style: 'primary' | 'secondary' | 'ghost';
}

export interface HeroContent {
  headline: string;
  subheadline: string;
  primaryCTA: CTA;
  secondaryCTA: CTA;
  stats: {
    label: string;
    value: string;
  }[];
}