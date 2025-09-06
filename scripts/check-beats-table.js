// Script to check if beats table exists and has correct columns
const { createClient } = require('@supabase/supabase-js');

// This won't work without proper environment variables, but shows the structure
const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBeatsTable() {
  try {
    console.log('Checking beats table...');

    // Try to select from beats table
    const { data, error } = await supabase
      .from('beats')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error accessing beats table:', error);
      return;
    }

    console.log('Beats table exists. Sample data:', data);

    // Check the structure by examining the first row
    if (data && data.length > 0) {
      console.log('Table structure (from first row):', Object.keys(data[0]));
    }

  } catch (error) {
    console.error('Script error:', error);
  }
}

checkBeatsTable();




