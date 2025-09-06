-- Migration script to create/update beats table with correct schema
-- Run this in your Supabase SQL editor or database client

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop the table if it exists with wrong schema (uncomment if needed)
-- DROP TABLE IF EXISTS beats CASCADE;

-- Create beats table with correct schema
CREATE TABLE IF NOT EXISTS beats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    genre TEXT NOT NULL,
    bpm INTEGER NOT NULL DEFAULT 140 CHECK (bpm >= 60 AND bpm <= 200),
    price DECIMAL(10,2) NOT NULL DEFAULT 29.99 CHECK (price > 0),
    description TEXT,
    cover_art TEXT DEFAULT '/images/default-cover.jpg',
    audio_url TEXT, -- Legacy field (deprecated)
    preview_url TEXT, -- SoundCloud snippet URL (30-60 seconds)
    full_track_url TEXT, -- Google Drive full track URL
    duration TEXT DEFAULT '3:00',
    preview_duration TEXT DEFAULT '0:30',
    license_types JSONB DEFAULT '{"mp3": 29.99, "wav": 49.99, "premium": 49.99, "exclusive": 199.99}'::jsonb,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Add missing columns if table exists but is missing them
DO $$
BEGIN
    -- Add status column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beats' AND column_name = 'status') THEN
        ALTER TABLE beats ADD COLUMN status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published'));
    END IF;

    -- Add preview_url column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beats' AND column_name = 'preview_url') THEN
        ALTER TABLE beats ADD COLUMN preview_url TEXT;
    END IF;

    -- Add full_track_url column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beats' AND column_name = 'full_track_url') THEN
        ALTER TABLE beats ADD COLUMN full_track_url TEXT;
    END IF;

    -- Add license_types column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beats' AND column_name = 'license_types') THEN
        ALTER TABLE beats ADD COLUMN license_types JSONB DEFAULT '{"mp3": 29.99, "wav": 49.99, "premium": 49.99, "exclusive": 199.99}'::jsonb;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_beats_status ON beats(status);
CREATE INDEX IF NOT EXISTS idx_beats_genre ON beats(genre);
CREATE INDEX IF NOT EXISTS idx_beats_created_at ON beats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_beats_deleted_at ON beats(deleted_at);

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

-- Insert sample data if table is empty
INSERT INTO beats (title, artist, genre, bpm, price, description, status) VALUES
('What About It', 'Johnny Maconny', 'Hip-Hop', 98, 29.99, 'Test beat with preview functionality', 'published'),
('Midnight Drive', 'YBF Studio', 'Hip-Hop', 140, 29.99, 'Classic hip-hop beat', 'published')
ON CONFLICT (title, artist) DO NOTHING;

-- Grant permissions (adjust based on your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON beats TO authenticated;
-- GRANT SELECT ON beats TO anon;

-- Comments for documentation
COMMENT ON TABLE beats IS 'Stores beat information for the AudioServiceApp marketplace';
COMMENT ON COLUMN beats.preview_url IS 'SoundCloud URL for 30-60 second preview snippet';
COMMENT ON COLUMN beats.full_track_url IS 'Google Drive URL for full track download after purchase';
COMMENT ON COLUMN beats.license_types IS 'JSON object containing pricing for different license types';

SELECT 'Beats table created/updated successfully!' as result;




