import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format date and time
export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Generate receipt number
export function generateReceiptNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 5);
  return `REC${timestamp.slice(-6)}${random.toUpperCase()}`;
}

// Calculate days between dates
export function daysBetween(date1: string | Date, date2: string | Date): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Check if date is overdue
export function isOverdue(dueDate: string | Date): boolean {
  const today = new Date();
  const due = new Date(dueDate);
  return due < today;
}

// Calculate fine for overdue books
export function calculateFine(issueDate: string | Date, dueDate: string | Date, returnDate?: string): number {
  const due = new Date(dueDate);
  const returnD = returnDate ? new Date(returnDate) : new Date();
  
  if (returnD <= due) return 0;
  
  const daysOverdue = Math.ceil((returnD.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  const finePerDay = 5; // ₹5 per day
  
  return daysOverdue * finePerDay;
}

// Generate QR code data (mock)
export function generateQRData(studentId: string, receiptNumber: string): string {
  return `LIMS:${studentId}:${receiptNumber}:${Date.now()}`;
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number (Indian)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[91]?[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
}

// Get status color
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    paid: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    pending: 'text-amber-600 bg-amber-50 border-amber-200',
    partial: 'text-blue-600 bg-blue-50 border-blue-200',
    overdue: 'text-rose-600 bg-rose-50 border-rose-200',
    active: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    inactive: 'text-gray-600 bg-gray-50 border-gray-200',
    issued: 'text-blue-600 bg-blue-50 border-blue-200',
    returned: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    available: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    occupied: 'text-amber-600 bg-amber-50 border-amber-200',
    disabled: 'text-gray-600 bg-gray-50 border-gray-200',
  };
  
  return statusColors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
}

// Get severity color
export function getSeverityColor(severity: string): string {
  const severityColors: Record<string, string> = {
    low: 'text-blue-600 bg-blue-50 border-blue-200',
    medium: 'text-amber-600 bg-amber-50 border-amber-200',
    high: 'text-rose-600 bg-rose-50 border-rose-200',
  };
  
  return severityColors[severity] || 'text-gray-600 bg-gray-50 border-gray-200';
}

// Format enrollment number
export function formatEnrollmentNumber(number: string): string {
  return number.toUpperCase();
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Generate random color for avatars
export function getAvatarColor(name: string): string {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  
  const hash = name.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
}

// Calculate attendance percentage
export function calculateAttendancePercentage(present: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((present / total) * 100);
}

// Format percentage
export function formatPercentage(value: number): string {
  return `${value}%`;
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Sort array by date
export function sortByDate<T>(array: T[], dateKey: keyof T, ascending = false): T[] {
  return array.sort((a, b) => {
    const dateA = new Date(a[dateKey] as string).getTime();
    const dateB = new Date(b[dateKey] as string).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

// Debounce function
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}