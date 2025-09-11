-- Beats table schema for YBF Studio admin dashboard
-- This schema supports the snippet + full track download system

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create beats table
CREATE TABLE IF NOT EXISTS beats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    genre TEXT NOT NULL,
    bpm INTEGER NOT NULL CHECK (bpm >= 60 AND bpm <= 200),
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    description TEXT,
    cover_art TEXT DEFAULT '/images/default-cover.jpg',
    audio_url TEXT, -- Legacy field (deprecated)
    preview_url TEXT, -- SoundCloud snippet URL (30-60 seconds)
    full_track_url TEXT, -- Google Drive full track URL
    duration TEXT DEFAULT '3:00',
    preview_duration TEXT DEFAULT '0:30',
    license_types JSONB DEFAULT '{"mp3": 29.99, "wav": 49.99, "exclusive": 299.99}'::jsonb,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE, -- Soft delete
    
    -- Constraints
    CONSTRAINT beats_title_artist_unique UNIQUE (title, artist, deleted_at)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_beats_deleted_at ON beats(deleted_at);
CREATE INDEX IF NOT EXISTS idx_beats_genre ON beats(genre);
CREATE INDEX IF NOT EXISTS idx_beats_created_at ON beats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_beats_title_artist ON beats(title, artist);
CREATE INDEX IF NOT EXISTS idx_beats_bpm ON beats(bpm);
CREATE INDEX IF NOT EXISTS idx_beats_price ON beats(price);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_beats_search ON beats USING gin(to_tsvector('english', title || ' ' || artist || ' ' || COALESCE(description, '')));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_beats_updated_at ON beats;
CREATE TRIGGER update_beats_updated_at
    BEFORE UPDATE ON beats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to validate URLs
CREATE OR REPLACE FUNCTION validate_url(url TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN url IS NULL OR url ~ '^https?://.+';
END;
$$ LANGUAGE plpgsql;

-- Add URL validation constraints
ALTER TABLE beats ADD CONSTRAINT beats_preview_url_valid 
    CHECK (validate_url(preview_url));

ALTER TABLE beats ADD CONSTRAINT beats_full_track_url_valid 
    CHECK (validate_url(full_track_url));

-- Create view for active beats (non-deleted)
CREATE OR REPLACE VIEW active_beats AS
SELECT * FROM beats WHERE deleted_at IS NULL;

-- Create function to get beat statistics
CREATE OR REPLACE FUNCTION get_beat_stats()
RETURNS TABLE(
    total_beats BIGINT,
    total_genres BIGINT,
    avg_price DECIMAL(10,2),
    min_bpm INTEGER,
    max_bpm INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_beats,
        COUNT(DISTINCT genre) as total_genres,
        AVG(price) as avg_price,
        MIN(bpm) as min_bpm,
        MAX(bpm) as max_bpm
    FROM beats 
    WHERE deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for testing
INSERT INTO beats (title, artist, genre, bpm, price, description, preview_url, full_track_url, cover_art) VALUES
('Midnight Dreams', 'ProducerX', 'Trap', 140, 29.99, 'Dark trap beat with heavy 808s and atmospheric melodies', 'https://soundcloud.com/producerx/midnight-dreams-preview', 'https://drive.google.com/file/d/sample1/view', '/images/beat_cover_1.png'),
('Urban Flow', 'ProducerY', 'Hip-Hop', 135, 24.99, 'Smooth hip-hop beat with jazzy samples and laid-back drums', 'https://soundcloud.com/producery/urban-flow-preview', 'https://drive.google.com/file/d/sample2/view', '/images/beat_cover_2.png'),
('Electric Nights', 'ProducerZ', 'Synthwave', 128, 34.99, 'Retro synthwave beat with analog synths and driving bass', 'https://soundcloud.com/producerz/electric-nights-preview', 'https://drive.google.com/file/d/sample3/view', '/images/beat_cover_3.png')
ON CONFLICT (title, artist, deleted_at) DO NOTHING;

-- Grant necessary permissions (adjust based on your Supabase setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON beats TO authenticated;
-- GRANT SELECT ON active_beats TO authenticated;
-- GRANT EXECUTE ON FUNCTION get_beat_stats() TO authenticated;

-- Comments for documentation
COMMENT ON TABLE beats IS 'Stores beat information for the YBF Studio marketplace';
COMMENT ON COLUMN beats.preview_url IS 'SoundCloud URL for 30-60 second preview snippet';
COMMENT ON COLUMN beats.full_track_url IS 'Google Drive URL for full track download after purchase';
COMMENT ON COLUMN beats.license_types IS 'JSON object containing pricing for different license types';
COMMENT ON COLUMN beats.deleted_at IS 'Soft delete timestamp - NULL means active, timestamp means deleted'; 