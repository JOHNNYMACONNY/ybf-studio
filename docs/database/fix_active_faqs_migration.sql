-- Migration to fix missing active_faqs table/view
-- This addresses the build error: relation "public.active_faqs" does not exist

-- First, ensure the faqs table exists (from services_schema.sql)
CREATE TABLE IF NOT EXISTS faqs (
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
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_status ON faqs(status);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_faqs_updated_at ON faqs;
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create the active_faqs view
CREATE OR REPLACE VIEW active_faqs AS
SELECT * FROM faqs
WHERE status = 'active'
ORDER BY category, sort_order, question;

-- Insert some sample FAQs if the table is empty
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
)
ON CONFLICT (question) DO NOTHING;

-- Grant necessary permissions (adjust based on your Supabase setup)
-- GRANT SELECT ON active_faqs TO authenticated;
-- GRANT SELECT ON active_faqs TO anon;




