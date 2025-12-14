// User Roles and Types
export type UserRole = 'super_admin' | 'admin' | 'accountant' | 'librarian' | 'teacher' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

// Student Types
export interface Student {
  id: string;
  enrollmentNumber: string;
  name: string;
  class: string;
  batch: string;
  guardianName: string;
  guardianPhone: string;
  phone: string;
  email?: string;
  shift: 'morning' | 'evening';
  seatNumber?: string;
  lockerAssigned?: string;
  status: 'active' | 'inactive';
  dateOfJoining: string;
  dateOfExit?: string;
  profileImage?: string;
  address?: string;
  emergencyContact?: string;
}

// Attendance Types
export interface Attendance {
  id: string;
  studentId: string;
  student: Student;
  date: string;
  morningPresent: boolean;
  eveningPresent: boolean;
  markedBy: string;
  markedAt: string;
}

// Fee Management Types
export interface FeeCategory {
  id: string;
  name: string;
  description: string;
  amount: number;
  isRecurring: boolean;
  dueDay: number;
}

export interface FeeStructure {
  id: string;
  studentId: string;
  student?: Student;
  categoryId: string;
  category: FeeCategory;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'partial' | 'overdue';
  paidAmount: number;
  remainingAmount: number;
}

export interface Payment {
  id: string;
  studentId: string;
  feeStructureId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'card' | 'online' | 'cheque';
  receiptNumber: string;
  notes?: string;
  receivedBy: string;
}

export interface FeeReceipt {
  id: string;
  receiptNumber: string;
  studentId: string;
  student: Student;
  paymentId: string;
  totalAmount: number;
  paymentDate: string;
  generatedBy: string;
  qrCode: string;
}

// Library Types
export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  edition: string;
  publisher: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  purchaseDate: string;
  price: number;
  description?: string;
  coverImage?: string;
}

export interface BookIssue {
  id: string;
  bookId: string;
  book: LibraryBook;
  studentId: string;
  student: Student;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fineAmount: number;
  status: 'issued' | 'returned' | 'overdue';
  issuedBy: string;
  returnedBy?: string;
}

export interface LibraryExpense {
  id: string;
  type: 'books' | 'maintenance' | 'software' | 'stationery' | 'miscellaneous';
  description: string;
  amount: number;
  date: string;
  receipt?: string;
  addedBy: string;
}

// Seating Types
export interface Seat {
  id: string;
  seatNumber: string;
  room: string;
  section: string;
  hasLocker: boolean;
  isOccupied: boolean;
  occupiedBy?: string;
  student?: Student;
  status: 'available' | 'occupied' | 'disabled';
  lastModified: string;
}

export interface Locker {
  id: string;
  lockerNumber: string;
  linkedSeatId: string;
  seat: Seat;
  assignedStudentId?: string;
  student?: Student;
  isAssigned: boolean;
  accessLog: AccessLog[];
}

export interface AccessLog {
  id: string;
  lockerId: string;
  studentId: string;
  action: 'open' | 'close';
  timestamp: string;
  location: string;
}

// Dashboard Types
export interface DashboardStats {
  totalStudents: number;
  newAdmissions: number;
  studentsLeft: number;
  morningShiftCount: number;
  eveningShiftCount: number;
  totalFeesCollected: number;
  pendingFees: number;
  advancePayments: number;
  libraryExpenses: {
    monthly: number;
    total: number;
  };
  overdueBooks: number;
  pendingFeesCount: number;
  booksIssuedToday: number;
  seatsOccupied: number;
  lockersAssigned: number;
  lockerTotal: number;
  seatTotal: number;
}

export interface Alert {
  id: string;
  type: 'overdue_books' | 'pending_fees' | 'low_attendance' | 'general';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: string;
  isRead: boolean;
  actionUrl?: string;
}

// Report Types
export interface Report {
  id: string;
  name: string;
  type: 'student_master' | 'attendance' | 'fees' | 'library' | 'expenses';
  filters: Record<string, any>;
  generatedAt: string;
  generatedBy: string;
  format: 'pdf' | 'excel' | 'csv';
  downloadUrl?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface StudentFormData {
  name: string;
  enrollmentNumber: string;
  class: string;
  batch: string;
  guardianName: string;
  guardianPhone: string;
  phone: string;
  email?: string;
  shift: 'morning' | 'evening';
  address?: string;
  emergencyContact?: string;
}

export interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  edition: string;
  publisher: string;
  category: string;
  totalCopies: number;
  price: number;
  description?: string;
}

export interface PaymentFormData {
  studentId: string;
  feeStructureId: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'online' | 'cheque';
  notes?: string;
}

// Navigation Types
export interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  children?: NavItem[];
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}