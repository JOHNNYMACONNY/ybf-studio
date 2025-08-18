-- =====================================================
-- SETTINGS & CONFIGURATION DATABASE SCHEMA
-- Phase 7: Settings & Configuration System
-- =====================================================

-- =====================================================
-- SITE SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'text', -- text, number, boolean, json, email, url
    category VARCHAR(50) DEFAULT 'general', -- general, email, payment, social, seo, security
    description TEXT,
    is_public BOOLEAN DEFAULT false, -- whether this setting can be exposed to frontend
    is_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- USER MANAGEMENT TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin', -- admin, editor, viewer
    permissions JSONB DEFAULT '{}', -- specific permissions
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- SYSTEM BACKUPS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS system_backups (
    id SERIAL PRIMARY KEY,
    backup_name VARCHAR(255) NOT NULL,
    backup_type VARCHAR(50) DEFAULT 'full', -- full, partial, settings_only
    file_path VARCHAR(500),
    file_size BIGINT,
    backup_data JSONB, -- backup metadata
    created_by INTEGER REFERENCES admin_users(id),
    status VARCHAR(50) DEFAULT 'completed', -- pending, in_progress, completed, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE -- when backup should be deleted
);

-- =====================================================
-- SYSTEM LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS system_logs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(20) DEFAULT 'info', -- debug, info, warning, error, critical
    category VARCHAR(50) DEFAULT 'system', -- system, admin, user, security, performance
    message TEXT NOT NULL,
    details JSONB,
    user_id INTEGER REFERENCES admin_users(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_site_settings_category ON site_settings(category);
CREATE INDEX IF NOT EXISTS idx_site_settings_public ON site_settings(is_public);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);

CREATE INDEX IF NOT EXISTS idx_system_backups_type ON system_backups(backup_type);
CREATE INDEX IF NOT EXISTS idx_system_backups_status ON system_backups(status);
CREATE INDEX IF NOT EXISTS idx_system_backups_created_at ON system_backups(created_at);

CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_category ON system_logs(category);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON system_logs(user_id);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_settings_updated_at 
    BEFORE UPDATE ON site_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Active site settings view
CREATE OR REPLACE VIEW active_site_settings AS
SELECT * FROM site_settings 
WHERE deleted_at IS NULL 
ORDER BY category, setting_key;

-- Public site settings view (for frontend)
CREATE OR REPLACE VIEW public_site_settings AS
SELECT setting_key, setting_value, setting_type 
FROM site_settings 
WHERE deleted_at IS NULL AND is_public = true 
ORDER BY category, setting_key;

-- Admin users summary view
CREATE OR REPLACE VIEW admin_users_summary AS
SELECT 
    id,
    email,
    name,
    role,
    is_active,
    last_login,
    login_count,
    created_at
FROM admin_users 
WHERE deleted_at IS NULL 
ORDER BY created_at DESC;

-- System logs summary view
CREATE OR REPLACE VIEW system_logs_summary AS
SELECT 
    level,
    category,
    COUNT(*) as count,
    MAX(created_at) as latest_log
FROM system_logs 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY level, category
ORDER BY count DESC;

-- =====================================================
-- FUNCTIONS FOR SETTINGS MANAGEMENT
-- =====================================================

-- Function to get setting value
CREATE OR REPLACE FUNCTION get_setting(setting_key_param VARCHAR(100))
RETURNS TEXT AS $$
DECLARE
    setting_value_result TEXT;
BEGIN
    SELECT setting_value INTO setting_value_result
    FROM site_settings 
    WHERE setting_key = setting_key_param AND deleted_at IS NULL;
    
    RETURN setting_value_result;
END;
$$ LANGUAGE plpgsql;

-- Function to set setting value
CREATE OR REPLACE FUNCTION set_setting(
    setting_key_param VARCHAR(100),
    setting_value_param TEXT,
    setting_type_param VARCHAR(50) DEFAULT 'text',
    category_param VARCHAR(50) DEFAULT 'general',
    description_param TEXT DEFAULT NULL,
    is_public_param BOOLEAN DEFAULT false
)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO site_settings (setting_key, setting_value, setting_type, category, description, is_public)
    VALUES (setting_key_param, setting_value_param, setting_type_param, category_param, description_param, is_public_param)
    ON CONFLICT (setting_key) 
    DO UPDATE SET 
        setting_value = EXCLUDED.setting_value,
        setting_type = EXCLUDED.setting_type,
        category = EXCLUDED.category,
        description = EXCLUDED.description,
        is_public = EXCLUDED.is_public,
        updated_at = NOW();
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to get settings by category
CREATE OR REPLACE FUNCTION get_settings_by_category(category_param VARCHAR(50))
RETURNS TABLE(
    setting_key VARCHAR(100),
    setting_value TEXT,
    setting_type VARCHAR(50),
    description TEXT,
    is_public BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT ss.setting_key, ss.setting_value, ss.setting_type, ss.description, ss.is_public
    FROM site_settings ss
    WHERE ss.category = category_param AND ss.deleted_at IS NULL
    ORDER BY ss.setting_key;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Site Configuration
INSERT INTO site_settings (setting_key, setting_value, setting_type, category, description, is_public) VALUES
('site_name', 'AudioServiceApp', 'text', 'general', 'Website name', true),
('site_description', 'Professional audio services and beat marketplace', 'text', 'general', 'Website description', true),
('site_url', 'https://audioserviceapp.com', 'url', 'general', 'Website URL', true),
('contact_email', 'admin@audioserviceapp.com', 'email', 'general', 'Contact email address', true),
('contact_phone', '+1 (555) 123-4567', 'text', 'general', 'Contact phone number', false),
('business_address', '123 Music Street, Audio City, AC 12345', 'text', 'general', 'Business address', false),
('timezone', 'America/New_York', 'text', 'general', 'Default timezone', false),
('currency', 'USD', 'text', 'general', 'Default currency', true),
('language', 'en', 'text', 'general', 'Default language', true),
('maintenance_mode', 'false', 'boolean', 'general', 'Maintenance mode status', false),
('maintenance_message', 'Site is under maintenance. Please check back soon.', 'text', 'general', 'Maintenance mode message', true),

-- Email Configuration
('email_provider', 'sendgrid', 'text', 'email', 'Email service provider', false),
('email_from_name', 'AudioServiceApp', 'text', 'email', 'From name for emails', false),
('email_from_address', 'noreply@audioserviceapp.com', 'email', 'email', 'From email address', false),
('email_smtp_host', 'smtp.sendgrid.net', 'text', 'email', 'SMTP host', false),
('email_smtp_port', '587', 'number', 'email', 'SMTP port', false),
('email_smtp_username', '', 'text', 'email', 'SMTP username', false),
('email_smtp_password', '', 'text', 'email', 'SMTP password', false),
('email_encryption', 'tls', 'text', 'email', 'Email encryption type', false),

-- Payment Configuration
('stripe_publishable_key', '', 'text', 'payment', 'Stripe publishable key', false),
('stripe_secret_key', '', 'text', 'payment', 'Stripe secret key', false),
('stripe_webhook_secret', '', 'text', 'payment', 'Stripe webhook secret', false),
('payment_currency', 'USD', 'text', 'payment', 'Payment currency', true),
('payment_methods', '["card", "paypal"]', 'json', 'payment', 'Accepted payment methods', true),
('tax_rate', '0.08', 'number', 'payment', 'Default tax rate', false),
('tax_enabled', 'true', 'boolean', 'payment', 'Enable tax calculation', false),

-- Social Media
('social_facebook', 'https://facebook.com/audioserviceapp', 'url', 'social', 'Facebook page URL', true),
('social_twitter', 'https://twitter.com/audioserviceapp', 'url', 'social', 'Twitter profile URL', true),
('social_instagram', 'https://instagram.com/audioserviceapp', 'url', 'social', 'Instagram profile URL', true),
('social_youtube', 'https://youtube.com/audioserviceapp', 'url', 'social', 'YouTube channel URL', true),
('social_linkedin', 'https://linkedin.com/company/audioserviceapp', 'url', 'social', 'LinkedIn company page', true),

-- SEO Configuration
('seo_title_template', '{page_title} | AudioServiceApp', 'text', 'seo', 'SEO title template', false),
('seo_description_template', '{page_description} - Professional audio services', 'text', 'seo', 'SEO description template', false),
('seo_keywords', 'audio, music, beats, production, services', 'text', 'seo', 'Default SEO keywords', false),
('google_analytics_id', '', 'text', 'seo', 'Google Analytics ID', false),
('google_tag_manager_id', '', 'text', 'seo', 'Google Tag Manager ID', false),

-- Security Configuration
('session_timeout', '3600', 'number', 'security', 'Session timeout in seconds', false),
('max_login_attempts', '5', 'number', 'security', 'Maximum login attempts', false),
('password_min_length', '8', 'number', 'security', 'Minimum password length', false),
('require_strong_password', 'true', 'boolean', 'security', 'Require strong passwords', false),
('enable_two_factor', 'false', 'boolean', 'security', 'Enable two-factor authentication', false),
('allowed_file_types', '["mp3", "wav", "aiff", "flac", "jpg", "png", "pdf"]', 'json', 'security', 'Allowed file upload types', false),
('max_file_size', '10485760', 'number', 'security', 'Maximum file size in bytes (10MB)', false),

-- System Configuration
('backup_frequency', 'daily', 'text', 'system', 'Backup frequency', false),
('backup_retention_days', '30', 'number', 'system', 'Backup retention period in days', false),
('log_retention_days', '90', 'number', 'system', 'Log retention period in days', false),
('cache_enabled', 'true', 'boolean', 'system', 'Enable caching', false),
('cache_duration', '3600', 'number', 'system', 'Cache duration in seconds', false),
('debug_mode', 'false', 'boolean', 'system', 'Enable debug mode', false),
('performance_monitoring', 'true', 'boolean', 'system', 'Enable performance monitoring', false)
ON CONFLICT (setting_key) DO NOTHING;

-- Admin Users (initial admin)
INSERT INTO admin_users (email, name, role, permissions) VALUES
('admin@audioserviceapp.com', 'System Administrator', 'admin', '{"all": true}'),
('editor@audioserviceapp.com', 'Content Editor', 'editor', '{"beats": true, "blog": true, "services": true, "orders": true, "analytics": true}'),
('viewer@audioserviceapp.com', 'Viewer', 'viewer', '{"analytics": true, "orders": true}')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================
COMMENT ON TABLE site_settings IS 'Stores all site configuration settings';
COMMENT ON TABLE admin_users IS 'Stores admin user accounts and permissions';
COMMENT ON TABLE system_backups IS 'Tracks system backup files and metadata';
COMMENT ON TABLE system_logs IS 'Stores system activity logs';

COMMENT ON FUNCTION get_setting(VARCHAR) IS 'Retrieves a setting value by key';
COMMENT ON FUNCTION set_setting(VARCHAR, TEXT, VARCHAR, VARCHAR, TEXT, BOOLEAN) IS 'Sets or updates a setting value';
COMMENT ON FUNCTION get_settings_by_category(VARCHAR) IS 'Retrieves all settings for a specific category'; 