-- Blog posts table schema for YBF Studio admin dashboard
-- This schema supports blog management with rich text content

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    featured_image TEXT DEFAULT '/images/default-blog.jpg',
    meta_title TEXT,
    meta_description TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    author_id UUID REFERENCES auth.users(id),
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE, -- Soft delete
    
    -- Constraints
    CONSTRAINT blog_posts_title_slug_unique UNIQUE (title, slug, deleted_at)
);

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#3B82F6',
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create blog_post_categories junction table
CREATE TABLE IF NOT EXISTS blog_post_categories (
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES blog_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (post_id, category_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_deleted_at ON blog_posts(deleted_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_deleted_at ON blog_categories(deleted_at);
CREATE INDEX IF NOT EXISTS idx_blog_post_categories_post_id ON blog_post_categories(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_categories_category_id ON blog_post_categories(category_id);

-- Create full-text search index for blog posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_search ON blog_posts USING gin(to_tsvector('english', title || ' ' || COALESCE(excerpt, '') || ' ' || COALESCE(content, '')));

-- Create trigger to automatically update updated_at for blog_posts
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to automatically update updated_at for blog_categories
DROP TRIGGER IF EXISTS update_blog_categories_updated_at ON blog_categories;
CREATE TRIGGER update_blog_categories_updated_at
    BEFORE UPDATE ON blog_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'))
           || '-' || 
           extract(epoch from now())::integer;
END;
$$ LANGUAGE plpgsql;

-- Create function to validate slug format
CREATE OR REPLACE FUNCTION validate_slug(slug TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN slug ~ '^[a-z0-9-]+$';
END;
$$ LANGUAGE plpgsql;

-- Add slug validation constraint
ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_slug_valid 
    CHECK (validate_slug(slug));

-- Create view for published blog posts
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

-- Create view for active categories
CREATE OR REPLACE VIEW active_blog_categories AS
SELECT * FROM blog_categories WHERE deleted_at IS NULL;

-- Create function to get blog statistics
CREATE OR REPLACE FUNCTION get_blog_stats()
RETURNS TABLE(
    total_posts BIGINT,
    published_posts BIGINT,
    draft_posts BIGINT,
    total_categories BIGINT,
    avg_words_per_post DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_posts,
        COUNT(*) FILTER (WHERE status = 'published') as published_posts,
        COUNT(*) FILTER (WHERE status = 'draft') as draft_posts,
        (SELECT COUNT(*) FROM blog_categories WHERE deleted_at IS NULL) as total_categories,
        AVG(array_length(regexp_split_to_array(content, '\s+'), 1)) as avg_words_per_post
    FROM blog_posts 
    WHERE deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Insert default categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
('Music Production', 'music-production', 'Tips and tutorials for music production', '#3B82F6'),
('Beat Making', 'beat-making', 'Beat making techniques and tutorials', '#10B981'),
('Mixing & Mastering', 'mixing-mastering', 'Mixing and mastering guides', '#F59E0B'),
('Industry News', 'industry-news', 'Latest music industry news and updates', '#EF4444'),
('Artist Interviews', 'artist-interviews', 'Interviews with successful artists', '#8B5CF6'),
('Gear Reviews', 'gear-reviews', 'Reviews of music production equipment', '#06B6D4')
ON CONFLICT (name) DO NOTHING;

-- Insert sample blog posts for testing
INSERT INTO blog_posts (title, slug, content, excerpt, meta_title, meta_description, status, published_at) VALUES
('How to Create Professional Beats: A Complete Guide', 'how-to-create-professional-beats-complete-guide', 
'<h1>How to Create Professional Beats: A Complete Guide</h1><p>Creating professional-quality beats requires a combination of technical skill, creativity, and attention to detail...</p>', 
'Learn the essential techniques for creating professional-quality beats that stand out in today''s competitive music industry.',
'How to Create Professional Beats: Complete Guide for Producers',
'Master the art of beat making with our comprehensive guide covering everything from basic techniques to advanced production methods.',
'published', NOW() - INTERVAL '2 days'),

('The Ultimate Guide to Mixing Hip-Hop Vocals', 'ultimate-guide-mixing-hip-hop-vocals',
'<h1>The Ultimate Guide to Mixing Hip-Hop Vocals</h1><p>Hip-hop vocals require special attention during the mixing process...</p>',
'Discover the secrets to mixing hip-hop vocals like a professional engineer.',
'The Ultimate Guide to Mixing Hip-Hop Vocals',
'Learn professional techniques for mixing hip-hop vocals including EQ, compression, effects, and more.',
'published', NOW() - INTERVAL '1 day'),

('5 Essential Plugins Every Producer Needs', '5-essential-plugins-every-producer-needs',
'<h1>5 Essential Plugins Every Producer Needs</h1><p>Having the right plugins can make or break your production workflow...</p>',
'Discover the five must-have plugins that will take your productions to the next level.',
'5 Essential Plugins Every Producer Needs in 2024',
'Explore the top 5 plugins that every music producer should have in their toolkit for professional results.',
'draft', NULL)
ON CONFLICT (slug) DO NOTHING;

-- Grant necessary permissions (adjust based on your Supabase setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON blog_posts TO authenticated;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON blog_categories TO authenticated;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON blog_post_categories TO authenticated;
-- GRANT SELECT ON published_blog_posts TO authenticated;
-- GRANT SELECT ON active_blog_categories TO authenticated;
-- GRANT EXECUTE ON FUNCTION get_blog_stats() TO authenticated;

-- Comments for documentation
COMMENT ON TABLE blog_posts IS 'Stores blog post information for the YBF Studio content management system';
COMMENT ON TABLE blog_categories IS 'Stores blog categories for organizing content';
COMMENT ON TABLE blog_post_categories IS 'Junction table linking blog posts to categories';
COMMENT ON COLUMN blog_posts.slug IS 'URL-friendly version of the title for routing';
COMMENT ON COLUMN blog_posts.status IS 'Post status: draft, published, or archived';
COMMENT ON COLUMN blog_posts.published_at IS 'Timestamp when post was published (NULL for drafts)';
COMMENT ON COLUMN blog_posts.deleted_at IS 'Soft delete timestamp - NULL means active, timestamp means deleted'; 