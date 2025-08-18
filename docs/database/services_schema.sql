-- Services Database Schema
-- Phase 4: Service Management System
-- Created: 2024

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Services table for mixing/mastering packages
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    features JSONB DEFAULT '[]',
    turnaround_time TEXT,
    category TEXT DEFAULT 'mixing',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    featured_image TEXT,
    before_audio_url TEXT,
    after_audio_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Service categories table
CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service requests table (for customer orders)
CREATE TABLE service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    project_name TEXT,
    project_description TEXT,
    reference_track_url TEXT,
    stems_upload_url TEXT,
    additional_files_url TEXT,
    special_instructions TEXT,
    admin_notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'review', 'completed', 'cancelled')),
    price_paid DECIMAL(10,2) NOT NULL,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    stripe_payment_intent_id TEXT,
    estimated_completion_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQ table for service-related questions
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    sort_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_service_requests_user_id ON service_requests(user_id);
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_service_requests_payment_status ON service_requests(payment_status);
CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_status ON faqs(status);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_categories_updated_at BEFORE UPDATE ON service_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default service categories
INSERT INTO service_categories (name, slug, description, sort_order) VALUES
('Mixing', 'mixing', 'Professional audio mixing services', 1),
('Mastering', 'mastering', 'Industry-standard mastering services', 2),
('Bundles', 'bundles', 'Combined mixing and mastering packages', 3);

-- Insert sample services
INSERT INTO services (name, slug, description, short_description, price, original_price, features, turnaround_time, category, status, sort_order) VALUES
(
    'Basic Mix',
    'basic-mix',
    'Professional mixing for up to 16 stems',
    'Professional mixing for up to 16 stems',
    99.00,
    NULL,
    '["Professional mixing", "Up to 16 stems", "2 revision rounds", "Stem delivery", "Reference track analysis"]',
    '3-5 business days',
    'mixing',
    'active',
    1
),
(
    'Advanced Mix',
    'advanced-mix',
    'Professional mixing with unlimited stems',
    'Professional mixing with unlimited stems',
    199.00,
    NULL,
    '["Professional mixing", "Unlimited stems", "Unlimited revisions", "Stem delivery", "Reference track analysis", "Vocal tuning included"]',
    '1-3 business days',
    'mixing',
    'active',
    2
),
(
    'Stereo Master',
    'stereo-master',
    'Industry-standard mastering',
    'Industry-standard mastering for all platforms',
    50.00,
    75.00,
    '["Industry-standard mastering", "Loudness optimization", "Frequency balancing", "Stereo enhancement", "1 revision round"]',
    '1-2 business days',
    'mastering',
    'active',
    3
),
(
    'Mix & Master Bundle',
    'mix-master-bundle',
    'Complete mixing and mastering package',
    'Complete mixing and mastering package',
    180.00,
    249.00,
    '["Professional mixing", "Industry-standard mastering", "Unlimited stems", "Unlimited revisions", "Stem + mastered delivery", "Reference track analysis"]',
    '3-5 business days',
    'bundles',
    'active',
    4
);

-- Insert sample FAQs
INSERT INTO faqs (question, answer, category, sort_order) VALUES
(
    'What file formats should I send?',
    'For mixing: Send individual stems as WAV files (24-bit, 44.1kHz or higher). For mastering: Send your final mix as a WAV file (24-bit, 44.1kHz or higher). Avoid MP3 files for the best quality.',
    'technical',
    1
),
(
    'What is the turnaround time?',
    'Standard turnaround is 3-5 business days for mixing and 1-2 business days for mastering. Rush delivery options are available for an additional fee.',
    'timing',
    2
),
(
    'How many revisions are included?',
    'Our mixing packages include 2 free revisions, and mastering includes 1 free revision. Additional revisions can be purchased if needed.',
    'revisions',
    3
),
(
    'Do you work with all genres?',
    'Yes! We have experience working with all genres including hip-hop, R&B, pop, rock, electronic, country, and more. Our engineers are versatile and can adapt to any style.',
    'general',
    4
),
(
    'Can I hear examples of your work?',
    'Absolutely! Check out our portfolio section to hear before/after examples of our mixing and mastering work. You can also request specific genre examples.',
    'general',
    5
);

-- Create RLS (Row Level Security) policies
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Services policies
CREATE POLICY "Services are viewable by everyone" ON services FOR SELECT USING (true);
CREATE POLICY "Services are insertable by admins" ON services FOR INSERT WITH CHECK (auth.jwt() ->> 'isAdmin' = 'true');
CREATE POLICY "Services are updatable by admins" ON services FOR UPDATE USING (auth.jwt() ->> 'isAdmin' = 'true');
CREATE POLICY "Services are deletable by admins" ON services FOR DELETE USING (auth.jwt() ->> 'isAdmin' = 'true');

-- Service categories policies
CREATE POLICY "Service categories are viewable by everyone" ON service_categories FOR SELECT USING (true);
CREATE POLICY "Service categories are insertable by admins" ON service_categories FOR INSERT WITH CHECK (auth.jwt() ->> 'isAdmin' = 'true');
CREATE POLICY "Service categories are updatable by admins" ON service_categories FOR UPDATE USING (auth.jwt() ->> 'isAdmin' = 'true');
CREATE POLICY "Service categories are deletable by admins" ON service_categories FOR DELETE USING (auth.jwt() ->> 'isAdmin' = 'true');

-- Service requests policies
CREATE POLICY "Service requests are viewable by owner or admin" ON service_requests FOR SELECT USING (
    auth.uid() = user_id OR auth.jwt() ->> 'isAdmin' = 'true'
);
CREATE POLICY "Service requests are insertable by authenticated users" ON service_requests FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Service requests are updatable by owner or admin" ON service_requests FOR UPDATE USING (
    auth.uid() = user_id OR auth.jwt() ->> 'isAdmin' = 'true'
);
CREATE POLICY "Service requests are deletable by admins" ON service_requests FOR DELETE USING (auth.jwt() ->> 'isAdmin' = 'true');

-- FAQs policies
CREATE POLICY "FAQs are viewable by everyone" ON faqs FOR SELECT USING (true);
CREATE POLICY "FAQs are insertable by admins" ON faqs FOR INSERT WITH CHECK (auth.jwt() ->> 'isAdmin' = 'true');
CREATE POLICY "FAQs are updatable by admins" ON faqs FOR UPDATE USING (auth.jwt() ->> 'isAdmin' = 'true');
CREATE POLICY "FAQs are deletable by admins" ON faqs FOR DELETE USING (auth.jwt() ->> 'isAdmin' = 'true');

-- Create views for easier querying
CREATE VIEW active_services AS
SELECT * FROM services 
WHERE status = 'active' AND deleted_at IS NULL
ORDER BY sort_order, name;

CREATE VIEW service_requests_summary AS
SELECT 
    sr.id,
    sr.customer_name,
    sr.customer_email,
    sr.project_name,
    sr.status,
    sr.payment_status,
    sr.price_paid,
    sr.created_at,
    s.name as service_name
FROM service_requests sr
LEFT JOIN services s ON sr.service_id = s.id
WHERE sr.deleted_at IS NULL
ORDER BY sr.created_at DESC;

CREATE VIEW active_faqs AS
SELECT * FROM faqs 
WHERE status = 'active'
ORDER BY category, sort_order, question; 