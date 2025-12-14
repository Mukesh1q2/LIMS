# Database Schema for LIMS SaaS Platform

## Overview
This document outlines the comprehensive database schema for the LIMS (Library & Institute Management System) SaaS platform, designed for scalability, security, and multi-tenancy.

## Architecture Principles
- **Multi-tenant**: Each institute is isolated in their own data space
- **Scalable**: Designed to handle thousands of institutes and millions of students
- **Audit Trail**: Complete history of all data changes
- **Security**: Role-based access control and data encryption
- **Performance**: Optimized indexes and query structures

---

## Core Tables

### 1. Organizations (Institutes)
```sql
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    domain VARCHAR(255),
    logo_url TEXT,
    subscription_plan VARCHAR(50) NOT NULL DEFAULT 'starter',
    subscription_status VARCHAR(20) NOT NULL DEFAULT 'active',
    subscription_expires_at TIMESTAMP,
    settings JSONB DEFAULT '{}',
    address JSONB,
    contact_info JSONB,
    branding JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_subscription ON organizations(subscription_plan, subscription_status);
```

### 2. Users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student',
    permissions JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    phone VARCHAR(20),
    profile_image_url TEXT,
    last_login_at TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(organization_id, role);
```

### 3. Students
```sql
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(50) NOT NULL,
    enrollment_number VARCHAR(50) NOT NULL,
    batch_year INTEGER,
    program VARCHAR(100),
    department VARCHAR(100),
    semester INTEGER,
    guardian_info JSONB,
    emergency_contact JSONB,
    medical_info JSONB,
    previous_education JSONB,
    documents JSONB,
    current_status VARCHAR(20) DEFAULT 'active',
    admission_date DATE,
    expected_graduation DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_students_org_student_id ON students(organization_id, student_id);
CREATE INDEX idx_students_enrollment ON students(organization_id, enrollment_number);
CREATE INDEX idx_students_status ON students(organization_id, current_status);
```

### 4. Courses & Subjects
```sql
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    duration_semesters INTEGER,
    credits INTEGER,
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_courses_org_code ON courses(organization_id, code);

CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    semester INTEGER,
    credits INTEGER,
    is_core BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_subjects_org_code ON subjects(organization_id, code);
CREATE INDEX idx_subjects_course ON subjects(course_id);
```

---

## Academic Management

### 5. Enrollments
```sql
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    semester INTEGER NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    status VARCHAR(20) DEFAULT 'enrolled',
    grade VARCHAR(10),
    marks_obtained DECIMAL(5,2),
    total_marks DECIMAL(5,2),
    attendance_percentage DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_enrollments_student_subject ON enrollments(student_id, subject_id);
CREATE INDEX idx_enrollments_semester ON enrollments(organization_id, academic_year, semester);
```

### 6. Attendance
```sql
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    marked_by UUID REFERENCES users(id),
    marked_at TIMESTAMP DEFAULT NOW(),
    notes TEXT,
    session_type VARCHAR(20) DEFAULT 'lecture',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_attendance_student_date ON attendance_records(student_id, date);
CREATE INDEX idx_attendance_date ON attendance_records(organization_id, date);
```

---

## Fee Management

### 7. Fee Structures
```sql
CREATE TABLE fee_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    fee_type VARCHAR(50) NOT NULL, -- tuition, library, laboratory, etc.
    frequency VARCHAR(20) NOT NULL, -- one_time, monthly, semester, annual
    due_date DATE,
    late_fee_amount DECIMAL(10,2) DEFAULT 0,
    is_mandatory BOOLEAN DEFAULT true,
    applicable_to JSONB, -- course_ids, batch_years, etc.
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_fee_structures_type ON fee_structures(organization_id, fee_type);
```

### 8. Fee Payments
```sql
CREATE TABLE fee_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    fee_structure_id UUID NOT NULL REFERENCES fee_structures(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255),
    payment_gateway VARCHAR(50),
    gateway_response JSONB,
    payment_date TIMESTAMP DEFAULT NOW(),
    due_date DATE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
    late_fee_applied DECIMAL(10,2) DEFAULT 0,
    discount_applied DECIMAL(10,2) DEFAULT 0,
    receipt_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_student ON fee_payments(organization_id, student_id);
CREATE INDEX idx_payments_date ON fee_payments(payment_date);
CREATE INDEX idx_payments_status ON fee_payments(status);
```

---

## Library Management

### 9. Library Assets
```sql
CREATE TABLE library_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    isbn VARCHAR(13),
    title VARCHAR(500) NOT NULL,
    author VARCHAR(255) NOT NULL,
    publisher VARCHAR(255),
    edition VARCHAR(100),
    publication_year INTEGER,
    category VARCHAR(100),
    subject_area VARCHAR(100),
    total_copies INTEGER NOT NULL DEFAULT 1,
    available_copies INTEGER NOT NULL DEFAULT 1,
    location VARCHAR(100), -- shelf number, section, etc.
    cost DECIMAL(10,2),
    acquisition_date DATE,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_books_isbn ON library_books(organization_id, isbn);
CREATE INDEX idx_books_title ON library_books(organization_id, title);
CREATE INDEX idx_books_category ON library_books(organization_id, category);
```

### 10. Book Transactions
```sql
CREATE TABLE book_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    issued_by UUID REFERENCES users(id),
    issued_at TIMESTAMP DEFAULT NOW(),
    due_date DATE NOT NULL,
    returned_at TIMESTAMP,
    returned_by UUID REFERENCES users(id),
    fine_amount DECIMAL(10,2) DEFAULT 0,
    fine_paid BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'issued', -- issued, returned, overdue, lost
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_book_transactions_student ON book_transactions(organization_id, student_id);
CREATE INDEX idx_book_transactions_book ON book_transactions(book_id);
CREATE INDEX idx_book_transactions_due_date ON book_transactions(due_date, status);
```

---

## Infrastructure Management

### 11. Seating Allocation
```sql
CREATE TABLE seating_layouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    room_number VARCHAR(50),
    capacity INTEGER NOT NULL,
    layout_data JSONB NOT NULL, -- seat positions, coordinates, etc.
    seat_types JSONB, -- regular, premium, disabled_accessible, etc.
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE seat_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    seating_layout_id UUID NOT NULL REFERENCES seating_layouts(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    seat_number VARCHAR(20) NOT NULL,
    allocation_date DATE NOT NULL,
    expiry_date DATE,
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, reserved
    allocated_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_seat_allocations_student_active ON seat_allocations(student_id, status) WHERE status = 'active';
CREATE INDEX idx_seat_allocations_layout ON seat_allocations(seating_layout_id);
```

### 12. Locker Management
```sql
CREATE TABLE lockers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    locker_number VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    size VARCHAR(20), -- small, medium, large
    is_available BOOLEAN DEFAULT true,
    maintenance_status VARCHAR(20) DEFAULT 'good',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE locker_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    locker_id UUID NOT NULL REFERENCES lockers(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    allocation_date DATE NOT NULL,
    expiry_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    allocated_by UUID REFERENCES users(id),
    access_code VARCHAR(10),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_locker_allocations_student_active ON locker_allocations(student_id, status) WHERE status = 'active';
CREATE INDEX idx_locker_allocations_locker ON locker_allocations(locker_id);
```

---

## Communication & Notifications

### 13. Notifications
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL, -- user_id, student_id, or custom identifier
    recipient_type VARCHAR(20) NOT NULL, -- user, student, parent
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- info, warning, success, error
   ) NOT channel VARCHAR(20 NULL, -- email, sms, push, in_app
    status VARCHAR(20) DEFAULT 'pending', -- pending, sent, delivered, failed
    scheduled_for TIMESTAMP,
    sent_at TIMESTAMP,
    delivery_data JSONB,
    read_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_recipient ON notifications(organization_id, recipient_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for);
```

---

## Analytics & Reporting

### 14. System Logs
```sql
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_system_logs_user ON system_logs(user_id);
CREATE INDEX idx_system_logs_action ON system_logs(action);
CREATE INDEX idx_system_logs_date ON system_logs(created_at);
```

---

## Subscription & Billing

### 15. Subscriptions
```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plan_name VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, cancelled, expired, suspended
    billing_cycle VARCHAR(20) NOT NULL, -- monthly, annual
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    current_period_start DATE NOT NULL,
    current_period_end DATE NOT NULL,
    trial_end DATE,
    cancelled_at TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_org ON subscriptions(organization_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

### 16. Usage Metrics
```sql
CREATE TABLE usage_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL, -- students_count, api_calls, storage_used, etc.
    metric_value DECIMAL(15,2) NOT NULL,
    metric_date DATE NOT NULL,
    period_type VARCHAR(20) NOT NULL, -- daily, monthly, yearly
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_usage_metrics_org_date_type ON usage_metrics(organization_id, metric_date, metric_type);
CREATE INDEX idx_usage_metrics_date ON usage_metrics(metric_date);
```

---

## Security & Audit

### 17. Audit Trail
```sql
CREATE TABLE audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    operation VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

CREATE INDEX idx_audit_trail_table ON audit_trail(table_name, record_id);
CREATE INDEX idx_audit_trail_date ON audit_trail(changed_at);
```

---

## Indexes and Performance

### Performance Indexes
```sql
-- Composite indexes for common query patterns
CREATE INDEX idx_students_active ON students(organization_id, current_status) WHERE current_status = 'active';
CREATE INDEX idx_attendance_date_range ON attendance_records(organization_id, date, status) WHERE status = 'present';
CREATE INDEX idx_payments_outstanding ON fee_payments(organization_id, status, due_date) WHERE status IN ('pending', 'overdue');
CREATE INDEX idx_book_issued_current ON book_transactions(organization_id, status) WHERE status = 'issued';

-- Full-text search indexes
CREATE INDEX idx_books_search ON library_books USING gin(to_tsvector('english', title || ' ' || author || ' ' || COALESCE(publisher, '')));

-- Partitioning by date for large tables
CREATE TABLE attendance_records_2024 PARTITION OF attendance_records FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
CREATE TABLE fee_payments_2024 PARTITION OF fee_payments FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

---

## Data Retention Policies

### Archive Tables
```sql
-- Archive old attendance records (older than 2 years)
CREATE TABLE attendance_records_archive (
    LIKE attendance_records INCLUDING ALL
);

-- Archive old fee payments (older than 7 years for compliance)
CREATE TABLE fee_payments_archive (
    LIKE fee_payments INCLUDING ALL
);
```

---

## Row Level Security (RLS)

### Multi-tenant Security
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;

-- Policy to ensure users can only see their organization's data
CREATE POLICY organization_isolation ON users
    FOR ALL USING (organization_id = current_setting('app.current_organization_id')::uuid);

-- Similar policies for other tables
CREATE POLICY students_org_isolation ON students
    FOR ALL USING (organization_id = current_setting('app.current_organization_id')::uuid);
```

---

This comprehensive database schema provides the foundation for a scalable, secure, and feature-rich LIMS SaaS platform with proper data isolation, audit trails, and performance optimization.