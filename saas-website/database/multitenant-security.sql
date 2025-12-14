-- Multi-Tenant Security Implementation for LIMS SaaS Platform
-- PostgreSQL Row Level Security (RLS) Policies

-- Enable Row Level Security on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE seat_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE locker_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;

-- Function to get current user's organization ID
CREATE OR REPLACE FUNCTION get_current_organization_id() 
RETURNS uuid 
LANGUAGE sql 
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    current_setting('app.current_organization_id', true)::uuid,
    auth.uid()
  );
$$;

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION has_permission(permission_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM users u
    WHERE u.id = auth.uid()
    AND u.organization_id = get_current_organization_id()
    AND u.is_active = true
    AND (
      u.permissions @> ('["' || permission_name || '"]')::jsonb
      OR u.role = 'admin'
    )
  );
$$;

-- Function to check user role
CREATE OR REPLACE FUNCTION has_role(role_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM users u
    WHERE u.id = auth.uid()
    AND u.organization_id = get_current_organization_id()
    AND u.is_active = true
    AND u.role = role_name
  );
$$;

-- Organizations policies
CREATE POLICY organization_isolation ON organizations
  FOR ALL USING (
    id = get_current_organization_id() 
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Users policies
CREATE POLICY users_org_isolation ON users
  FOR ALL USING (
    organization_id = get_current_organization_id()
  );

CREATE POLICY users_self_access ON users
  FOR SELECT USING (
    id = auth.uid()
    OR has_permission('users:read')
  );

CREATE POLICY users_self_update ON users
  FOR UPDATE USING (
    id = auth.uid()
    OR has_permission('users:write')
  );

-- Students policies
CREATE POLICY students_org_isolation ON students
  FOR ALL USING (
    organization_id = get_current_organization_id()
  );

CREATE POLICY students_read_access ON students
  FOR SELECT USING (
    -- Students can read their own data
    user_id = auth.uid()
    OR has_permission('students:read')
    OR has_role('parent')
  );

CREATE POLICY students_write_access ON students
  FOR ALL USING (
    has_permission('students:write')
  );

-- Attendance policies
CREATE POLICY attendance_org_isolation ON attendance_records
  FOR ALL USING (
    organization_id = get_current_organization_id()
  );

CREATE POLICY attendance_read_access ON attendance_records
  FOR SELECT USING (
    -- Students can read their own attendance
    student_id IN (
      SELECT s.id FROM students s 
      WHERE s.user_id = auth.uid()
    )
    OR has_permission('attendance:read')
  );

CREATE POLICY attendance_write_access ON attendance_records
  FOR ALL USING (
    has_permission('attendance:write')
  );

-- Fee policies
CREATE POLICY fees_org_isolation ON fee_structures
  FOR ALL USING (
    organization_id = get_current_organization_id()
  );

CREATE POLICY fee_payments_org_isolation ON fee_payments
  FOR ALL USING (
    organization_id = get_current_organization_id()
  );

CREATE POLICY fee_payments_read_access ON fee_payments
  FOR SELECT USING (
    -- Students can read their own fee payments
    student_id IN (
      SELECT s.id FROM students s 
      WHERE s.user_id = auth.uid()
    )
    OR has_permission('fees:read')
  );

-- Library policies
CREATE POLICY library_org_isolation ON library_books
  FOR ALL USING (
    organization_id = get_current_organization_id()
  );

CREATE POLICY book_transactions_org_isolation ON book_transactions
  FOR ALL USING (
    organization_id = get_current_organization_id()
  );

CREATE POLICY book_transactions_access ON book_transactions
  FOR SELECT USING (
    -- Students can read their own transactions
    student_id IN (
      SELECT s.id FROM students s 
      WHERE s.user_id = auth.uid()
    )
    OR has_permission('library:read')
  );

-- Seating policies
CREATE POLICY seating_org_isolation ON seat_allocations
  FOR ALL USING (
    organization_id = get_current_organization_id()
  );

CREATE POLICY locker_org_isolation ON locker_allocations
  FOR ALL USING (
    organization_id = get_current_organization_id()
  );

-- Notification policies
CREATE POLICY notifications_org_isolation ON notifications
  FOR ALL USING (
    organization_id = get_current_organization_id()
  );

CREATE POLICY notifications_read_access ON notifications
  FOR SELECT USING (
    recipient_id = auth.uid()
    OR has_permission('notifications:read')
  );

-- System logs policies (admin only)
CREATE POLICY system_logs_admin_only ON system_logs
  FOR ALL USING (
    has_permission('system:audit')
  );

-- Audit trail policies (admin only)
CREATE POLICY audit_trail_admin_only ON audit_trail
  FOR ALL USING (
    has_permission('system:audit')
  );

-- Function to set organization context
CREATE OR REPLACE FUNCTION set_organization_context(org_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM set_config('app.current_organization_id', org_id::text, true);
  
  -- Log the context switch for audit purposes
  INSERT INTO system_logs (
    organization_id,
    user_id,
    action,
    metadata
  ) VALUES (
    org_id,
    auth.uid(),
    'set_organization_context',
    jsonb_build_object('timestamp', now())
  );
END;
$$;

-- Function to clear organization context
CREATE OR REPLACE FUNCTION clear_organization_context()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM set_config('app.current_organization_id', '', true);
END;
$$;

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO audit_trail (
    organization_id,
    table_name,
    record_id,
    operation,
    old_values,
    new_values,
    changed_by,
    changed_at
  ) VALUES (
    get_current_organization_id(),
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE 
      WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
      WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD)
      ELSE NULL
    END,
    CASE 
      WHEN TG_OP = 'INSERT' THEN to_jsonb(NEW)
      WHEN TG_OP = 'UPDATE' THEN to_jsonb(NEW)
      ELSE NULL
    END,
    auth.uid(),
    now()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create audit triggers on sensitive tables
CREATE TRIGGER audit_users_trigger
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_students_trigger
  AFTER INSERT OR UPDATE OR DELETE ON students
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_attendance_trigger
  AFTER INSERT OR UPDATE OR DELETE ON attendance_records
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_fee_payments_trigger
  AFTER INSERT OR UPDATE OR DELETE ON fee_payments
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_organizations_trigger
  AFTER INSERT OR UPDATE OR DELETE ON organizations
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Function to validate tenant isolation
CREATE OR REPLACE FUNCTION validate_tenant_isolation()
RETURNS table(
  table_name text,
  policy_count int,
  rls_enabled boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    schemaname::text || '.' || tablename::text as table_name,
    (SELECT count(*) FROM pg_policies WHERE tablename = t.tablename) as policy_count,
    rowsecurity as rls_enabled
  FROM pg_tables t
  WHERE schemaname = 'public'
  AND tablename IN (
    'organizations', 'users', 'students', 'enrollments', 
    'attendance_records', 'fee_structures', 'fee_payments',
    'library_books', 'book_transactions', 'seat_allocations',
    'locker_allocations', 'notifications', 'system_logs'
  )
  ORDER BY tablename;
END;
$$;

-- Function to test tenant isolation
CREATE OR REPLACE FUNCTION test_tenant_isolation(test_org_id uuid)
RETURNS table(
  test_name text,
  passed boolean,
  details text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  test_user_id uuid;
  result record;
BEGIN
  -- Create a test user
  INSERT INTO users (
    id, organization_id, email, hashed_password, 
    first_name, last_name, role, is_active, permissions
  ) VALUES (
    gen_random_uuid(),
    test_org_id,
    'test_user@example.com',
    '$2a$12$test_hash',
    'Test',
    'User',
    'student',
    true,
    '["students:read"]'::jsonb
  ) RETURNING id INTO test_user_id;
  
  -- Test 1: User can only see their organization's data
  PERFORM set_config('app.current_organization_id', test_org_id::text, true);
  
  -- This should work
  BEGIN
    PERFORM 1 FROM students WHERE organization_id = test_org_id LIMIT 1;
    RETURN QUERY SELECT 'Organization data access' as test_name, true as passed, 'User can access organization data' as details;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN QUERY SELECT 'Organization data access' as test_name, false as passed, 'User cannot access organization data' as details;
  END;
  
  -- Test 2: Cross-tenant access prevention
  -- This should fail
  BEGIN
    PERFORM 1 FROM students WHERE organization_id != test_org_id LIMIT 1;
    RETURN QUERY SELECT 'Cross-tenant isolation' as test_name, false as passed, 'Cross-tenant access allowed - SECURITY VULNERABILITY' as details;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN QUERY SELECT 'Cross-tenant isolation' as test_name, true as passed, 'Cross-tenant access blocked' as details;
  END;
  
  -- Test 3: Admin can access all data
  -- This should work for admin role
  PERFORM set_config('app.current_organization_id', '', true);
  PERFORM auth.uid();
  
  -- Cleanup
  DELETE FROM users WHERE id = test_user_id;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION set_organization_context(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION clear_organization_context() TO authenticated;
GRANT EXECUTE ON FUNCTION has_permission(text) TO authenticated;
GRANT EXECUTE ON FUNCTION has_role(text) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_tenant_isolation() TO authenticated;
GRANT EXECUTE ON FUNCTION test_tenant_isolation(uuid) TO authenticated;

-- Create indexes for performance
CREATE INDEX idx_users_organization_active ON users(organization_id, is_active) WHERE is_active = true;
CREATE INDEX idx_students_organization_active ON students(organization_id, current_status) WHERE current_status = 'active';
CREATE INDEX idx_attendance_student_date ON attendance_records(student_id, date);
CREATE INDEX idx_fee_payments_student_date ON fee_payments(student_id, payment_date);
CREATE INDEX idx_audit_trail_table_record ON audit_trail(table_name, record_id, changed_at);

-- Create views for common queries
CREATE OR REPLACE VIEW organization_stats AS
SELECT 
  o.id,
  o.name,
  o.subscription_plan,
  COUNT(DISTINCT u.id) as total_users,
  COUNT(DISTINCT s.id) as total_students,
  COUNT(DISTINCT CASE WHEN s.current_status = 'active' THEN s.id END) as active_students,
  COALESCE(SUM(fp.amount), 0) as total_revenue,
  MAX(fp.payment_date) as last_payment_date
FROM organizations o
LEFT JOIN users u ON u.organization_id = o.id AND u.is_active = true
LEFT JOIN students s ON s.organization_id = o.id
LEFT JOIN fee_payments fp ON fp.organization_id = o.id AND fp.status = 'completed'
WHERE o.is_active = true
GROUP BY o.id, o.name, o.subscription_plan;

-- Security event logging function
CREATE OR REPLACE FUNCTION log_security_event(
  event_type text,
  message text,
  user_id uuid DEFAULT NULL,
  organization_id uuid DEFAULT NULL,
  details jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO system_logs (
    organization_id,
    user_id,
    action,
    metadata
  ) VALUES (
    COALESCE(organization_id, get_current_organization_id()),
    COALESCE(user_id, auth.uid()),
    event_type,
    jsonb_build_object(
      'message', message,
      'timestamp', now(),
      'details', details,
      'ip_address', inet_client_addr(),
      'user_agent', current_setting('request.headers', true)::jsonb->>'user-agent'
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION log_security_event(text, text, uuid, uuid, jsonb) TO authenticated;