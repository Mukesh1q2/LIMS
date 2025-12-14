// Icon component library for LIMS features
import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const LIMSLogo: React.FC<IconProps> = ({ className = '', size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="limsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: '#2563EB', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: '#7C3AED', stopOpacity: 1}} />
      </linearGradient>
    </defs>
    <path d="M8 8V32L12 32L12 16L24 16L24 12L12 12L12 8L8 8Z" fill="url(#limsGradient)"/>
    <rect x="26" y="8" width="6" height="8" rx="1" fill="url(#limsGradient)" opacity="0.8"/>
    <rect x="28" y="10" width="2" height="4" rx="0.5" fill="white" opacity="0.9"/>
    <rect x="8" y="20" width="16" height="1" fill="url(#limsGradient)" opacity="0.6}/>
  </svg>
);

export const DashboardIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
  </svg>
);

export const StudentsIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.997 2.997 0 0 0 17.01 6H16c-.8 0-1.54.31-2.09.83L12.36 8.39c-.13.13-.25.27-.36.42L10.44 10.37c-.55.75-.87 1.65-.87 2.63v8h12z" fill="currentColor"/>
    <circle cx="12" cy="8" r="3" fill="currentColor" opacity="0.7"/>
  </svg>
);

export const AttendanceIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const FeesIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
    <circle cx="12" cy="12" r="3" fill="white"/>
  </svg>
);

export const LibraryIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" fill="currentColor"/>
    <path d="M8 8h8v2H8V8zm0 3h8v2H8v-2zm0 3h8v2H8v-2z" fill="currentColor" opacity="0.7"/>
  </svg>
);

export const SeatingIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
    <circle cx="12" cy="9" r="1.5" fill="white"/>
  </svg>
);

export const AnalyticsIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
    <circle cx="18" cy="6" r="2" fill="currentColor"/>
    <circle cx="14" cy="12" r="2" fill="currentColor" opacity="0.7"/>
    <circle cx="10" cy="16" r="2" fill="currentColor" opacity="0.5"/>
  </svg>
);

export const MobileIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" fill="currentColor"/>
    <circle cx="12" cy="17" r="1" fill="white"/>
    <rect x="10" y="6" width="4" height="8" rx="0.5" fill="white" opacity="0.7"/>
  </svg>
);

export const SecurityIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="currentColor"/>
    <circle cx="12" cy="11" r="1.5" fill="white"/>
  </svg>
);

export const IntegrationIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" opacity="0.8"/>
    <circle cx="12" cy="12" r="3" fill="currentColor"/>
    <path d="M8 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Export all icons as a mapping for dynamic usage
export const iconMap = {
  'dashboard': DashboardIcon,
  'students': StudentsIcon,
  'attendance': AttendanceIcon,
  'fees': FeesIcon,
  'library': LibraryIcon,
  'seating': SeatingIcon,
  'analytics': AnalyticsIcon,
  'mobile': MobileIcon,
  'security': SecurityIcon,
  'integration': IntegrationIcon,
};