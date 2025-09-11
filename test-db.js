const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfcmvmnkncgyjfpykdia.supabase.co',
  'sb_secret_2ZJ6dcREvtKLZAobXjKmqA_JOM5zQ7A'
);

async function testDatabase() {
  try {
    console.log('Testing database connection...');

    // Check if blog_posts table exists
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(1);

    console.log('Blog posts table exists:', !postsError);
    if (postsError) console.log('Blog posts error:', postsError.message);

    // Check if published_blog_posts view exists
    const { data: publishedPosts, error: publishedError } = await supabase
      .from('published_blog_posts')
      .select('*')
      .limit(1);

    console.log('Published blog posts view exists:', !publishedError);
    if (publishedError) console.log('Published posts error:', publishedError.message);

    // Check if blog_categories table exists
    const { data: categories, error: categoriesError } = await supabase
      .from('blog_categories')
      .select('*')
      .limit(1);

    console.log('Blog categories table exists:', !categoriesError);
    if (categoriesError) console.log('Categories error:', categoriesError.message);

  } catch (error) {
    console.error('Database test failed:', error.message);
  }
}

testDatabase();

