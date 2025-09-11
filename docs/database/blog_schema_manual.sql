-- MANUAL BLOG SCHEMA DEPLOYMENT
-- Copy and execute these statements one by one in Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- Step 1: Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Step 3: Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT DEFAULT '/assets/blog-beat-selection.jpg',
  meta_title TEXT,
  meta_description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  author_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Step 4: Create junction table
CREATE TABLE IF NOT EXISTS blog_post_categories (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES blog_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (post_id, category_id)
);

-- Step 5: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_deleted_at ON blog_categories(deleted_at);

-- Step 6: Insert sample categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
('Music Production', 'music-production', 'Tips and tutorials for music production', '#3B82F6'),
('Beat Making', 'beat-making', 'Beat making techniques and tutorials', '#10B981'),
('Mixing & Mastering', 'mixing-mastering', 'Mixing and mastering guides', '#F59E0B'),
('Industry News', 'industry-news', 'Latest music industry news and updates', '#EF4444'),
('Artist Interviews', 'artist-interviews', 'Interviews with successful artists', '#8B5CF6'),
('Gear Reviews', 'gear-reviews', 'Reviews of music production equipment', '#06B6D4')
ON CONFLICT (name) DO NOTHING;

-- Step 7: Insert sample blog posts
INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, meta_title, meta_description, status, published_at) VALUES
('How to Create Professional Beats: A Complete Guide', 'how-to-create-professional-beats-complete-guide',
'<h1>How to Create Professional Beats: A Complete Guide</h1><p>Creating professional-quality beats requires a combination of technical skill, creativity, and attention to detail. This comprehensive guide covers everything from basic beat making techniques to advanced production methods that will take your music to the next level.</p><h2>Essential Tools</h2><p>Every beat maker needs a solid foundation of tools and software. Start with a reliable DAW (Digital Audio Workstation) like FL Studio, Ableton Live, or Logic Pro X.</p><h2>Basic Beat Structure</h2><p>A good beat follows a clear structure: intro, build-up, drop, breakdown, and outro. Each section serves a specific purpose in keeping the listener engaged.</p>',
'Learn the essential techniques for creating professional-quality beats that stand out in today''s competitive music industry.',
'/assets/blog-beat-selection.jpg',
'How to Create Professional Beats: Complete Guide for Producers',
'Master the art of beat making with our comprehensive guide covering everything from basic techniques to advanced production methods.',
'published', NOW() - INTERVAL '2 days'),

('The Ultimate Guide to Mixing Hip-Hop Vocals', 'ultimate-guide-mixing-hip-hop-vocals',
'<h1>The Ultimate Guide to Mixing Hip-Hop Vocals</h1><p>Hip-hop vocals require special attention during the mixing process. From EQ and compression to reverb and effects, this guide covers all the techniques you need to make your vocals sound professional.</p><h2>Step 1: Clean Up the Audio</h2><p>Start by removing any unwanted noise, clicks, or background sounds using careful editing and noise reduction techniques.</p><h2>Step 2: EQ for Clarity</h2><p>Use EQ to cut out muddiness in the low-mids (around 200-500Hz) and add presence in the high-mids (around 3-5kHz) to make the vocals cut through the mix.</p><h2>Step 3: Compression</h2><p>Apply gentle compression to even out the dynamics. Aim for 3-6dB of gain reduction with a medium attack and release time.</p>',
'Discover the secrets to mixing hip-hop vocals like a professional engineer.',
'/assets/blog-vocals.jpg',
'The Ultimate Guide to Mixing Hip-Hop Vocals',
'Learn professional techniques for mixing hip-hop vocals including EQ, compression, effects, and more.',
'published', NOW() - INTERVAL '1 day'),

('5 Essential Plugins Every Producer Needs', '5-essential-plugins-every-producer-needs',
'<h1>5 Essential Plugins Every Producer Needs</h1><p>Having the right plugins can make or break your production workflow. Here are five must-have plugins that will take your productions to the next level.</p><h2>1. EQ Plugin</h2><p>A good EQ is the foundation of any mixing chain. Look for something with surgical precision and musical curves. FabFilter Pro-Q 3 or the stock EQ in your DAW are great starting points.</p><h2>2. Compressor</h2><p>Compression controls dynamics and adds punch to your tracks. Try FabFilter Pro-C 2 or stock compressors with sidechain capabilities.</p><h2>3. Reverb</h2><p>Reverb adds space and depth to your mixes. Valhalla Room or vintage reverbs like the EMT 140 plate are excellent choices.</p><h2>4. Delay</h2><p>Delay creates rhythmic interest and space. Digital delays like Soundtoys EchoBoy or tape-style delays work great for creative effects.</p><h2>5. Limiter</h2><p>A transparent limiter protects against clipping and maximizes loudness. Use it as the final step in your master chain.</p>',
'Discover the five must-have plugins that will take your productions to the next level.',
'/assets/blog-mastering.jpg',
'5 Essential Plugins Every Producer Needs in 2024',
'Explore the top 5 plugins that every music producer should have in their toolkit for professional results.',
'draft', NULL)
ON CONFLICT (slug) DO NOTHING;

-- Step 8: Create the published blog posts view (optional - for advanced queries)
CREATE OR REPLACE VIEW published_blog_posts AS
SELECT
  bp.*,
  array_agg(bc.name) as categories
FROM blog_posts bp
LEFT JOIN blog_post_categories bpc ON bp.id = bpc.post_id
LEFT JOIN blog_categories bc ON bpc.category_id = bc.id
WHERE bp.deleted_at IS NULL
  AND bp.status = 'published'
  AND bp.published_at IS NOT NULL
  AND bp.published_at <= NOW()
GROUP BY bp.id;

-- Step 9: Grant permissions (optional - adjust based on your needs)
-- GRANT SELECT ON published_blog_posts TO anon;
-- GRANT ALL ON blog_posts TO authenticated;
-- GRANT ALL ON blog_categories TO authenticated;
-- GRANT ALL ON blog_post_categories TO authenticated;

-- Verification queries (run these after deployment):
-- SELECT COUNT(*) as total_posts FROM blog_posts;
-- SELECT COUNT(*) as total_categories FROM blog_categories;
-- SELECT * FROM published_blog_posts LIMIT 3;
