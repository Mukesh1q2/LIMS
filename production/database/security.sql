-- LIMS SaaS Platform - Security Policies (RLS Implementation)
-- Generated: 2025-12-14 23:30:58

-- Enable Row Level Security on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE seat_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_statistics ENABLE ROW LEVEL SECURITY;

-- Helper function to get current organization ID
CREATE OR REPLACE FUNCTION get_current_organization_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT organization_id FROM users WHERE id = auth.uid();
$$;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT role = 'admin' FROM users WHERE id = auth.uid();
$$;

-- Helper function to check if user has specific permission
CREATE OR REPLACE FUNCTION has_permission(permission_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND organization_id = get_current_organization_id()
    AND (permissions @> ('["' || permission_name || '"]')::jsonb
         OR role = 'admin')
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

-- Students policies
CREATE POLICY students_org_isolation ON students
  FOR ALL USING (
    organization_id = get_current_organization_id()
  );

-- Categories policies
CREATE POLICY categories_org_isolation ON categories
  FOR ALL USING (
    organization_id = get_current_organization_id()
  );

-- Books policies
CREATE POLICY books_org_isolation ON books
  FOR ALL USING (
    organization_id = get_current_organization_id()
  );

-- Fee categories policies
CREATE POLICY fee_categories_org_isolation ON fee_categories
  FOR ALL USING (
    organization_id = get_current_organization_id()
  );

-- Fee records policies
CREATE POLICY fee_records_org_isolation ON fee_records
  FOR ALL USING (
    organization_id = get_current_organization_id()
  );

-- Seats policies
CREATE POLICY seats_org_isolation ON seats
  FOR ALL USING (
    organization_id = get_current_organization_id()
  );

-- Seat assignments policies
CREATE POLICY seat_assignments_org_isolation ON seat_assignments
  FOR ALL USING (
    organization_id = get_current_organization_id()
  );

-- Book issues policies
CREATE POLICY book_issues_org_isolation ON book_issues
  FOR ALL USING (
    organization_id = get_current_organization_id()
  );

-- Attendance policies
CREATE POLICY attendance_org_isolation ON attendance_records
  FOR ALL USING (
    organization_id = get_current_organization_id()
  );

-- Notifications policies
CREATE POLICY notifications_org_isolation ON notifications
  FOR ALL USING (
    organization_id = get_current_organization_id()
  );

-- Audit logs policies
CREATE POLICY audit_logs_org_isolation ON audit_logs
  FOR ALL USING (
    organization_id = get_current_organization_id()
  );

-- Login logs policies
CREATE POLICY login_logs_org_isolation ON login_logs
  FOR ALL USING (
    organization_id = get_current_organization_id()
  );

-- Usage statistics policies
CREATE POLICY usage_statistics_org_isolation ON usage_statistics
  FOR ALL USING (
    organization_id = get_current_organization_id()
  );

-- Security functions for rate limiting and monitoring
CREATE OR REPLACE FUNCTION track_login_attempt(login_email citext, login_ip inet)
RETURNS table(allowed boolean, attempts_count integer, locked_until timestamp)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_record users%ROWTYPE;
    recent_attempts integer;
    lock_duration interval := interval '15 minutes';
BEGIN
    -- Get user record
    SELECT * INTO user_record FROM users WHERE email = login_email;
    
    -- Count recent failed attempts
    SELECT COUNT(*) INTO recent_attempts 
    FROM login_logs 
    WHERE email = login_email 
    AND success = false 
    AND created_at > now() - interval '15 minutes';
    
    -- Check if account is locked
    IF user_record.account_locked_until IS NOT NULL AND user_record.account_locked_until > now() THEN
        RETURN QUERY SELECT false, recent_attempts, user_record.account_locked_until;
        RETURN;
    END IF;
    
    -- Allow if less than 5 failed attempts
    IF recent_attempts < 5 THEN
        RETURN QUERY SELECT true, recent_attempts, null::timestamp;
    ELSE
        -- Lock account for 15 minutes
        UPDATE users 
        SET account_locked_until = now() + lock_duration,
            failed_login_attempts = failed_login_attempts + 1
        WHERE email = login_email;
        
        RETURN QUERY SELECT false, recent_attempts, now() + lock_duration;
    END IF;
END;
$$;

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Insert audit record
    INSERT INTO audit_logs (
        organization_id,
        user_id,
        table_name,
        record_id,
        action,
        old_values,
        new_values,
        ip_address,
        user_agent
    ) VALUES (
        COALESCE(NEW.organization_id, OLD.organization_id),
        auth.uid(),
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
        inet_client_addr(),
        current_setting('request.headers', true)::jsonb->>'user-agent'
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Apply audit triggers to all tables
CREATE TRIGGER audit_organizations_trigger
  AFTER INSERT OR UPDATE OR DELETE ON organizations
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_users_trigger
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_students_trigger
  AFTER INSERT OR UPDATE OR DELETE ON students
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_books_trigger
  AFTER INSERT OR UPDATE OR DELETE ON books
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_fee_records_trigger
  AFTER INSERT OR UPDATE OR DELETE ON fee_records
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_seat_assignments_trigger
  AFTER INSERT OR UPDATE OR DELETE ON seat_assignments
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_book_issues_trigger
  AFTER INSERT OR UPDATE OR DELETE ON book_issues
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Function to test tenant isolation
CREATE OR REPLACE FUNCTION test_tenant_isolation(test_org_id uuid)
RETURNS table(test_name text, passed boolean, details text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    test_user_id uuid;
    result boolean;
BEGIN
    -- Test 1: Users can only see their organization data
    SELECT id INTO test_user_id FROM users WHERE organization_id = test_org_id LIMIT 1;
    
    PERFORM set_config('request.jwt.claim.user_id', test_user_id::text, true);
    
    SELECT COUNT(*) = 0 INTO result
    FROM users 
    WHERE organization_id != test_org_id;
    
    RETURN QUERY SELECT 'Cross-tenant data access prevention', result, 
           CASE WHEN result THEN 'PASSED' ELSE 'FAILED' END;
    
    -- Test 2: Students data isolation
    SELECT COUNT(*) = 0 INTO result
    FROM students s
    JOIN users u ON s.user_id = u.id
    WHERE s.organization_id != test_org_id;
    
    RETURN QUERY SELECT 'Student data isolation', result, 
           CASE WHEN result THEN 'PASSED' ELSE 'FAILED' END;
    
    -- Test 3: Books data isolation
    SELECT COUNT(*) = 0 INTO result
    FROM books 
    WHERE organization_id != test_org_id;
    
    RETURN QUERY SELECT 'Books data isolation', result, 
           CASE WHEN result THEN 'PASSED' ELSE 'FAILED' END;
    
    -- Reset
    PERFORM set_config('request.jwt.claim.user_id', '', true);
    
    RETURN;
END;
$$;

-- Function to clean up old data (GDPR compliance)
CREATE OR REPLACE FUNCTION cleanup_old_data(retention_days integer DEFAULT 365)
RETURNS table(cleaned_table text, records_deleted bigint)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_count bigint;
BEGIN
    -- Clean up old login logs
    DELETE FROM login_logs WHERE created_at < now() - interval '1 day' * retention_days;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN QUERY SELECT 'login_logs', deleted_count;
    
    -- Clean up old usage statistics (keep aggregated data)
    DELETE FROM usage_statistics 
    WHERE created_at < now() - interval '1 day' * retention_days
    AND hour IS NOT NULL; -- Keep daily aggregated data
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN QUERY SELECT 'usage_statistics', deleted_count;
    
    -- Clean up read notifications older than 30 days
    DELETE FROM notifications 
    WHERE is_read = true 
    AND created_at < now() - interval '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN QUERY SELECT 'old_notifications', deleted_count;
END;
$$;