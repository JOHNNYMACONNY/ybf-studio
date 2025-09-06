-- Complete database fix for beats table
-- This addresses all missing columns and schema issues
-- Run this in your Supabase SQL editor (Dashboard > SQL Editor > New Query)
--
-- INSTRUCTIONS:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this entire script
-- 4. Click "Run"
-- 5. After it completes successfully, the admin interface will work with URL fields

-- Step 1: Drop and recreate the table with correct schema (uncomment if needed)
-- DROP TABLE IF EXISTS beats CASCADE;

-- Step 2: Create the beats table with ALL required columns
CREATE TABLE IF NOT EXISTS beats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    genre TEXT NOT NULL,
    bpm INTEGER NOT NULL DEFAULT 140 CHECK (bpm >= 60 AND bpm <= 200),
    price DECIMAL(10,2) NOT NULL DEFAULT 29.99 CHECK (price > 0),
    description TEXT,
    cover_art TEXT DEFAULT '/assets/beatCovers/beat_cover_1.png',
    audio_url TEXT,
    preview_url TEXT,
    full_track_url TEXT,
    duration TEXT DEFAULT '3:00',
    preview_duration TEXT DEFAULT '0:30',
    license_types JSONB DEFAULT '{"mp3": 29.99, "wav": 49.99, "premium": 49.99, "exclusive": 199.99}'::jsonb,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Step 3: Ensure all columns exist (add missing ones)
DO $$
BEGIN
    -- Basic columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beats' AND column_name = 'id') THEN
        ALTER TABLE beats ADD COLUMN id UUID PRIMARY KEY DEFAULT uuid_generate_v4();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beats' AND column_name = 'title') THEN
        ALTER TABLE beats ADD COLUMN title TEXT NOT NULL DEFAULT '';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beats' AND column_name = 'artist') THEN
        ALTER TABLE beats ADD COLUMN artist TEXT NOT NULL DEFAULT '';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beats' AND column_name = 'genre') THEN
        ALTER TABLE beats ADD COLUMN genre TEXT NOT NULL DEFAULT 'Hip-Hop';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beats' AND column_name = 'bpm') THEN
        ALTER TABLE beats ADD COLUMN bpm INTEGER DEFAULT 140 CHECK (bpm >= 60 AND bpm <= 200);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beats' AND column_name = 'price') THEN
        ALTER TABLE beats ADD COLUMN price DECIMAL(10,2) DEFAULT 29.99 CHECK (price > 0);
    END IF;

    -- Description and cover
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beats' AND column_name = 'description') THEN
        ALTER TABLE beats ADD COLUMN description TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beats' AND column_name = 'cover_art') THEN
        ALTER TABLE beats ADD COLUMN cover_art TEXT DEFAULT '/assets/beatCovers/beat_cover_1.png';
    END IF;

    -- Audio URLs
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beats' AND column_name = 'audio_url') THEN
        ALTER TABLE beats ADD COLUMN audio_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beats' AND column_name = 'preview_url') THEN
        ALTER TABLE beats ADD COLUMN preview_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beats' AND column_name = 'full_track_url') THEN
        ALTER TABLE beats ADD COLUMN full_track_url TEXT;
    END IF;

    -- Duration fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beats' AND column_name = 'duration') THEN
        ALTER TABLE beats ADD COLUMN duration TEXT DEFAULT '3:00';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beats' AND column_name = 'preview_duration') THEN
        ALTER TABLE beats ADD COLUMN preview_duration TEXT DEFAULT '0:30';
    END IF;

    -- License types (JSONB)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beats' AND column_name = 'license_types') THEN
        ALTER TABLE beats ADD COLUMN license_types JSONB DEFAULT '{"mp3": 29.99, "wav": 49.99, "premium": 49.99, "exclusive": 199.99}'::jsonb;
    END IF;

    -- Status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beats' AND column_name = 'status') THEN
        ALTER TABLE beats ADD COLUMN status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published'));
    END IF;

    -- Timestamps
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beats' AND column_name = 'created_at') THEN
        ALTER TABLE beats ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beats' AND column_name = 'updated_at') THEN
        ALTER TABLE beats ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beats' AND column_name = 'deleted_at') THEN
        ALTER TABLE beats ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Step 4: Create indexes
CREATE INDEX IF NOT EXISTS idx_beats_status ON beats(status);
CREATE INDEX IF NOT EXISTS idx_beats_genre ON beats(genre);
CREATE INDEX IF NOT EXISTS idx_beats_created_at ON beats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_beats_deleted_at ON beats(deleted_at);

-- Step 5: Create constraints (skip unique index if duplicates exist)
-- Note: Skipping unique index creation to avoid conflicts with existing duplicate data
-- You can create this manually later after cleaning up duplicates if needed:
-- CREATE UNIQUE INDEX beats_title_artist_unique_idx ON beats (title, artist) WHERE deleted_at IS NULL;

-- Step 6: Create/update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger (safe, uses CREATE OR REPLACE)
-- Note: We'll skip DROP TRIGGER to avoid any warnings
-- If the trigger exists, this will update it safely
CREATE OR REPLACE TRIGGER update_beats_updated_at
    BEFORE UPDATE ON beats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 6: Insert/update sample data (no destructive operations)
INSERT INTO beats (id, title, artist, genre, bpm, price, description, status) VALUES
('beat_1756631751515', 'What About It', 'Johnny Maconny', 'Hip-Hop', 98, 29.99, 'Test beat with preview functionality', 'published'),
('beat_1756193778541', 'm', 'm', 'Hip-Hop', 140, 29.99, 'Hip-Hop, Etherial, Hard, Chill', 'published'),
('beat_1756062939657', 'n', 'n', 'Hip-Hop', 140, 29.99, 'test, t, r, m', 'published'),
('beat_1756062824498', 'm', 'm', 'Hip-Hop', 140, 29.99, 'test, testing, x', 'published'),
('beat_001', 'Midnight Drive', 'YBF Studio', 'Hip-Hop', 140, 29.99, 'Classic hip-hop beat', 'published')
ON CONFLICT (title, artist) DO UPDATE SET
    bpm = EXCLUDED.bpm,
    price = EXCLUDED.price,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    updated_at = NOW();

-- Step 7: Create views
CREATE OR REPLACE VIEW active_beats AS
SELECT * FROM beats WHERE deleted_at IS NULL;

-- Step 8: Grant permissions (adjust based on your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON beats TO authenticated;
-- GRANT SELECT ON active_beats TO authenticated;

-- Step 9: Verify the fix
SELECT
    'Beats table columns:' as info,
    COUNT(*) as total_columns
FROM information_schema.columns
WHERE table_name = 'beats';

SELECT
    'Beats table rows:' as info,
    COUNT(*) as total_rows
FROM beats;

-- Show all columns in beats table
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'beats'
ORDER BY ordinal_position;
