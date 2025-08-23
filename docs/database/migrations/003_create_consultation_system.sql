-- Migration: Create Consultation System
-- File: 003_create_consultation_system.sql
-- Description: Creates the consultation system tables with proper relationships and indexes
-- Date: December 2024

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(255),
    project_details TEXT,
    budget_range VARCHAR(50),
    timeline VARCHAR(100),
    referral_source VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create consultation_packages table
CREATE TABLE IF NOT EXISTS consultation_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    price_cents INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    features JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create consultations table
CREATE TABLE IF NOT EXISTS consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    package_id UUID REFERENCES consultation_packages(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
    start_at TIMESTAMP WITH TIME ZONE NOT NULL,
    end_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    meeting_link VARCHAR(500),
    notes TEXT,
    admin_notes TEXT,
    rescheduled_from UUID REFERENCES consultations(id),
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_status CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
    CONSTRAINT valid_duration CHECK (duration_minutes > 0 AND duration_minutes <= 480), -- Max 8 hours
    CONSTRAINT valid_time_range CHECK (end_at > start_at)
);

-- Create consultation_emails table for tracking
CREATE TABLE IF NOT EXISTS consultation_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    email_type VARCHAR(50) NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'sent',
    error_message TEXT,
    
    CONSTRAINT valid_email_type CHECK (email_type IN ('confirmation', 'reminder_24h', 'reminder_1h', 'reschedule', 'cancellation', 'follow_up'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at);
CREATE INDEX IF NOT EXISTS idx_consultations_client_id ON consultations(client_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_start_at ON consultations(start_at);
CREATE INDEX IF NOT EXISTS idx_consultations_package_id ON consultations(package_id);
CREATE INDEX IF NOT EXISTS idx_consultation_emails_consultation_id ON consultation_emails(consultation_id);
CREATE INDEX IF NOT EXISTS idx_consultation_emails_type_status ON consultation_emails(email_type, status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultation_packages_updated_at BEFORE UPDATE ON consultation_packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default consultation packages
INSERT INTO consultation_packages (name, description, duration_minutes, price_cents, features) VALUES
('Discovery Call', 'Initial consultation to discuss your project needs and goals', 30, 0, '["Project discussion", "Goal setting", "Timeline planning", "Budget discussion"]'::jsonb),
('Strategy Session', 'In-depth consultation to develop your project strategy and roadmap', 60, 5000, '["Detailed project analysis", "Strategy development", "Timeline creation", "Resource planning", "Risk assessment"]'::jsonb),
('Technical Review', 'Technical consultation for existing projects or technical questions', 45, 3500, '["Code review", "Technical guidance", "Best practices", "Performance optimization", "Architecture review"]'::jsonb),
('Project Planning', 'Comprehensive project planning and scoping consultation', 90, 7500, '["Full project scoping", "Requirements gathering", "Timeline planning", "Budget planning", "Team planning", "Risk mitigation"]'::jsonb);

-- NOTE: RLS policies are intentionally omitted here to avoid coupling to auth schema
-- API routes use the service role key for all operations. Add fine-grained RLS later if exposing direct client access.

-- Create view for admin consultation overview
CREATE OR REPLACE VIEW admin_consultation_overview AS
SELECT 
    c.id,
    c.status,
    c.start_at,
    c.end_at,
    c.duration_minutes,
    c.meeting_link,
    c.notes,
    c.admin_notes,
    c.created_at,
    c.updated_at,
    cl.email as client_email,
    cl.first_name as client_first_name,
    cl.last_name as client_last_name,
    cl.phone as client_phone,
    cl.company as client_company,
    cp.name as package_name,
    cp.price_cents as package_price_cents
FROM consultations c
JOIN clients cl ON c.client_id = cl.id
LEFT JOIN consultation_packages cp ON c.package_id = cp.id
ORDER BY c.start_at DESC;

-- Grant access to the view
GRANT SELECT ON admin_consultation_overview TO authenticated;

-- Create function to get upcoming consultations
CREATE OR REPLACE FUNCTION get_upcoming_consultations(hours_ahead INTEGER DEFAULT 24)
RETURNS TABLE (
    id UUID,
    client_email VARCHAR(255),
    client_name VARCHAR(255),
    start_at TIMESTAMP WITH TIME ZONE,
    package_name VARCHAR(255),
    meeting_link VARCHAR(500)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        cl.email,
        CONCAT(cl.first_name, ' ', cl.last_name),
        c.start_at,
        COALESCE(cp.name, 'Custom Consultation'),
        c.meeting_link
    FROM consultations c
    JOIN clients cl ON c.client_id = cl.id
    LEFT JOIN consultation_packages cp ON c.package_id = cp.id
    WHERE c.status = 'confirmed'
    AND c.start_at BETWEEN NOW() AND NOW() + INTERVAL '1 hour' * hours_ahead
    ORDER BY c.start_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_upcoming_consultations(INTEGER) TO authenticated;
