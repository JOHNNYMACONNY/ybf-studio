const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfcmvmnkncgyjfpykdia.supabase.co',
  'sb_secret_2ZJ6dcREvtKLZAobXjKmqA_JOM5zQ7A'
);

async function setupBlogSchema() {
  try {
    console.log('Setting up blog database schema...');

    // Create blog_categories table
    console.log('Creating blog_categories table...');
    const { error: categoriesError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS blog_categories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL UNIQUE,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          color TEXT DEFAULT '#3B82F6',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          deleted_at TIMESTAMP WITH TIME ZONE
        );
      `
    });

    if (categoriesError) {
      console.log('Categories table creation failed, trying alternative approach...');

      // Try direct insert approach for existing tables
      const { error: insertCategories } = await supabase
        .from('blog_categories')
        .insert([
          { name: 'Music Production', slug: 'music-production', description: 'Tips and tutorials for music production', color: '#3B82F6' },
          { name: 'Beat Making', slug: 'beat-making', description: 'Beat making techniques and tutorials', color: '#10B981' },
          { name: 'Mixing & Mastering', slug: 'mixing-mastering', description: 'Mixing and mastering guides', color: '#F59E0B' }
        ])
        .select();

      if (insertCategories) {
        console.log('Categories insert failed:', insertCategories.message);
      } else {
        console.log('Categories inserted successfully');
      }
    } else {
      console.log('Categories table created successfully');
    }

    // Create blog_posts table
    console.log('Creating blog_posts table...');
    const { error: postsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS blog_posts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
      `
    });

    if (postsError) {
      console.log('Posts table creation failed, trying alternative approach...');

      // Try direct insert for sample posts
      const { error: insertPosts } = await supabase
        .from('blog_posts')
        .insert([
          {
            title: 'How to Create Professional Beats: A Complete Guide',
            slug: 'how-to-create-professional-beats-complete-guide',
            content: '<h1>How to Create Professional Beats: A Complete Guide</h1><p>Creating professional-quality beats requires a combination of technical skill, creativity, and attention to detail...</p>',
            excerpt: 'Learn the essential techniques for creating professional-quality beats that stand out in today\'s competitive music industry.',
            featured_image: '/assets/blog-beat-selection.jpg',
            meta_title: 'How to Create Professional Beats: Complete Guide for Producers',
            meta_description: 'Master the art of beat making with our comprehensive guide covering everything from basic techniques to advanced production methods.',
            status: 'published',
            published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            title: 'The Ultimate Guide to Mixing Hip-Hop Vocals',
            slug: 'ultimate-guide-mixing-hip-hop-vocals',
            content: '<h1>The Ultimate Guide to Mixing Hip-Hop Vocals</h1><p>Hip-hop vocals require special attention during the mixing process...</p>',
            excerpt: 'Discover the secrets to mixing hip-hop vocals like a professional engineer.',
            featured_image: '/assets/blog-vocals.jpg',
            meta_title: 'The Ultimate Guide to Mixing Hip-Hop Vocals',
            meta_description: 'Learn professional techniques for mixing hip-hop vocals including EQ, compression, effects, and more.',
            status: 'published',
            published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ])
        .select();

      if (insertPosts) {
        console.log('Posts insert failed:', insertPosts.message);
      } else {
        console.log('Sample posts inserted successfully');
      }
    } else {
      console.log('Posts table created successfully');
    }

    console.log('Schema setup completed!');

  } catch (error) {
    console.error('Schema setup failed:', error.message);
  }
}

setupBlogSchema();
