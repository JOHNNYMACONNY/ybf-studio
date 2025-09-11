const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const defaultCategories = [
  { name: 'Music Production', description: 'Tips and tutorials for music production', color: '#3B82F6' },
  { name: 'Beat Making', description: 'Beat making techniques and tutorials', color: '#10B981' },
  { name: 'Mixing & Mastering', description: 'Mixing and mastering guides', color: '#F59E0B' },
  { name: 'Industry News', description: 'Latest music industry news and updates', color: '#EF4444' },
  { name: 'Artist Interviews', description: 'Interviews with successful artists', color: '#8B5CF6' },
  { name: 'Tutorials', description: 'Step-by-step tutorials and guides', color: '#06B6D4' },
  { name: 'Gear Reviews', description: 'Reviews of music equipment and software', color: '#84CC16' },
  { name: 'Business', description: 'Music business and career advice', color: '#F97316' }
];

async function setupCategories() {
  console.log('Setting up blog categories...');

  for (const category of defaultCategories) {
    const slug = category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    try {
      // Check if category already exists
      const { data: existing } = await supabase
        .from('blog_categories')
        .select('id')
        .eq('name', category.name)
        .is('deleted_at', null)
        .single();

      if (existing) {
        console.log(`✓ Category "${category.name}" already exists`);
        continue;
      }

      // Create category
      const { data, error } = await supabase
        .from('blog_categories')
        .insert({
          name: category.name,
          slug,
          description: category.description,
          color: category.color
        })
        .select()
        .single();

      if (error) {
        console.error(`✗ Error creating category "${category.name}":`, error.message);
      } else {
        console.log(`✓ Created category "${category.name}" with ID: ${data.id}`);
      }
    } catch (error) {
      console.error(`✗ Error processing category "${category.name}":`, error.message);
    }
  }

  console.log('Category setup complete!');
}

setupCategories().catch(console.error);
