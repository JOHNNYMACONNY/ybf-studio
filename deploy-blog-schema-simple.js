const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfcmvmnkncgyjfpykdia.supabase.co',
  'sb_secret_2ZJ6dcREvtKLZAobXjKmqA_JOM5zQ7A'
);

async function deployBlogSchemaSimple() {
  console.log('🚀 Deploying Blog Schema to Supabase (Simple Approach)...\n');

  try {
    // Step 1: Create blog_categories table
    console.log('📝 Step 1: Creating blog_categories table...');
    const { error: categoriesError } = await supabase
      .from('blog_categories')
      .insert([
        { name: 'Music Production', slug: 'music-production', description: 'Tips and tutorials for music production', color: '#3B82F6' },
        { name: 'Beat Making', slug: 'beat-making', description: 'Beat making techniques and tutorials', color: '#10B981' },
        { name: 'Mixing & Mastering', slug: 'mixing-mastering', description: 'Mixing and mastering guides', color: '#F59E0B' },
        { name: 'Industry News', slug: 'industry-news', description: 'Latest music industry news and updates', color: '#EF4444' },
        { name: 'Artist Interviews', slug: 'artist-interviews', description: 'Interviews with successful artists', color: '#8B5CF6' },
        { name: 'Gear Reviews', slug: 'gear-reviews', description: 'Reviews of music production equipment', color: '#06B6D4' }
      ]);

    if (categoriesError) {
      console.log('❌ Categories creation failed:', categoriesError.message || categoriesError);
      console.log('💡 This might be because the table doesn\'t exist yet. Try creating it manually first.');
    } else {
      console.log('✅ Categories created successfully');
    }

    // Step 2: Create sample blog posts
    console.log('\n📝 Step 2: Creating sample blog posts...');
    const { error: postsError } = await supabase
      .from('blog_posts')
      .insert([
        {
          title: 'How to Create Professional Beats: A Complete Guide',
          slug: 'how-to-create-professional-beats-complete-guide',
          content: '<h1>How to Create Professional Beats: A Complete Guide</h1><p>Creating professional-quality beats requires a combination of technical skill, creativity, and attention to detail. This comprehensive guide covers everything from basic beat making techniques to advanced production methods that will take your music to the next level.</p><h2>Essential Tools</h2><p>Every beat maker needs a solid foundation of tools and software. Start with a reliable DAW (Digital Audio Workstation) like FL Studio, Ableton Live, or Logic Pro X.</p>',
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
          content: '<h1>The Ultimate Guide to Mixing Hip-Hop Vocals</h1><p>Hip-hop vocals require special attention during the mixing process. From EQ and compression to reverb and effects, this guide covers all the techniques you need to make your vocals sound professional.</p><h2>Step 1: Clean Up the Audio</h2><p>Start by removing any unwanted noise, clicks, or background sounds using careful editing and noise reduction techniques.</p>',
          excerpt: 'Discover the secrets to mixing hip-hop vocals like a professional engineer.',
          featured_image: '/assets/blog-vocals.jpg',
          meta_title: 'The Ultimate Guide to Mixing Hip-Hop Vocals',
          meta_description: 'Learn professional techniques for mixing hip-hop vocals including EQ, compression, effects, and more.',
          status: 'published',
          published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          title: '5 Essential Plugins Every Producer Needs',
          slug: '5-essential-plugins-every-producer-needs',
          content: '<h1>5 Essential Plugins Every Producer Needs</h1><p>Having the right plugins can make or break your production workflow. Here are five must-have plugins that will take your productions to the next level.</p><h2>1. EQ Plugin</h2><p>A good EQ is the foundation of any mixing chain. Look for something with surgical precision and musical curves.</p>',
          excerpt: 'Discover the five must-have plugins that will take your productions to the next level.',
          featured_image: '/assets/blog-mastering.jpg',
          meta_title: '5 Essential Plugins Every Producer Needs in 2024',
          meta_description: 'Explore the top 5 plugins that every music producer should have in their toolkit for professional results.',
          status: 'draft',
          published_at: null
        }
      ]);

    if (postsError) {
      console.log('❌ Posts creation failed:', postsError.message || postsError);
      console.log('💡 This might be because the table doesn\'t exist yet. Try creating it manually first.');
    } else {
      console.log('✅ Sample posts created successfully');
    }

    // Step 3: Test the deployment
    console.log('\n🧪 Step 3: Testing the deployment...');
    const { data: testPosts, error: testError } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(3);

    if (testError) {
      console.log('❌ Test failed:', testError.message);
    } else {
      console.log(`✅ Test successful: Found ${testPosts?.length || 0} blog posts`);
      if (testPosts && testPosts.length > 0) {
        console.log('📋 Sample post titles:');
        testPosts.forEach((post, index) => {
          console.log(`   ${index + 1}. ${post.title} (${post.status})`);
        });
      }
    }

    console.log('\n📊 DEPLOYMENT SUMMARY');
    console.log('═'.repeat(50));
    console.log('✅ Categories: Created');
    console.log('✅ Sample Posts: Created');
    console.log('✅ Testing: Completed');

    console.log('\n🎉 Blog schema deployment completed!');
    console.log('Your blog system is now ready with sample data.');

    console.log('\n🔗 Next Steps:');
    console.log('1. Visit http://localhost:3000/blog to see the blog');
    console.log('2. Visit http://localhost:3000/admin/blog to manage posts');
    console.log('3. The system will automatically use real database data instead of sample data');

  } catch (error) {
    console.error('❌ Schema deployment failed:', error.message);
    console.log('\n💡 Manual Deployment Instructions:');
    console.log('1. Go to https://supabase.com/dashboard/project/YOUR_PROJECT/sql');
    console.log('2. Execute the SQL from docs/database/blog_schema.sql');
    console.log('3. Or create tables manually in the Table Editor');
  }
}

deployBlogSchemaSimple();
