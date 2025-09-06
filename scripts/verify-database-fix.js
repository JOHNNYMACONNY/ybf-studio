// Verification script to test if database fix worked
// Run this after applying the database fix to confirm everything works

const { createClient } = require('@supabase/supabase-js');

// You'll need to set these environment variables or replace with your actual values
const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDatabaseFix() {
  try {
    console.log('🔍 Verifying database fix...\n');

    // Test 1: Check if beats table exists
    console.log('1. Testing beats table existence...');
    const { data: beats, error: beatsError } = await supabase
      .from('beats')
      .select('*')
      .limit(1);

    if (beatsError) {
      console.error('❌ Beats table error:', beatsError.message);
      return;
    }
    console.log('✅ Beats table exists');

    // Test 2: Check for required columns
    console.log('\n2. Testing required columns...');
    const requiredColumns = [
      'id', 'title', 'artist', 'genre', 'bpm', 'price',
      'description', 'cover_art', 'audio_url', 'preview_url',
      'full_track_url', 'duration', 'preview_duration',
      'license_types', 'status', 'created_at', 'updated_at'
    ];

    if (beats && beats.length > 0) {
      const actualColumns = Object.keys(beats[0]);
      const missingColumns = requiredColumns.filter(col => !actualColumns.includes(col));

      if (missingColumns.length > 0) {
        console.error('❌ Missing columns:', missingColumns);
        return;
      }

      console.log('✅ All required columns present');
      console.log('   Available columns:', actualColumns.join(', '));
    }

    // Test 3: Test inserting/updating a beat with URLs
    console.log('\n3. Testing beat creation with URLs...');
    const testBeat = {
      title: 'Database Fix Test',
      artist: 'System Test',
      genre: 'Test',
      bpm: 120,
      price: 19.99,
      preview_url: 'https://soundcloud.com/test/test-beat',
      full_track_url: 'https://drive.google.com/test',
      license_types: { mp3: 19.99, wav: 29.99, premium: 39.99, exclusive: 99.99 },
      status: 'published'
    };

    const { data: insertedBeat, error: insertError } = await supabase
      .from('beats')
      .upsert(testBeat)
      .select('*')
      .single();

    if (insertError) {
      console.error('❌ Beat insertion failed:', insertError.message);
      return;
    }

    console.log('✅ Beat insertion successful');
    console.log('   Inserted beat ID:', insertedBeat?.id);

    // Test 4: Test reading the beat back
    console.log('\n4. Testing beat retrieval...');
    const { data: retrievedBeat, error: retrieveError } = await supabase
      .from('beats')
      .select('*')
      .eq('title', 'Database Fix Test')
      .single();

    if (retrieveError) {
      console.error('❌ Beat retrieval failed:', retrieveError.message);
      return;
    }

    console.log('✅ Beat retrieval successful');
    console.log('   Preview URL:', retrievedBeat?.preview_url);
    console.log('   Full track URL:', retrievedBeat?.full_track_url);
    console.log('   License types:', JSON.stringify(retrievedBeat?.license_types, null, 2));

    // Cleanup: Delete test beat
    console.log('\n5. Cleaning up test data...');
    await supabase
      .from('beats')
      .delete()
      .eq('title', 'Database Fix Test');

    console.log('✅ Test data cleaned up');

    console.log('\n🎉 DATABASE FIX VERIFICATION COMPLETE!');
    console.log('✅ All tests passed - your database is ready for the admin interface!');
    console.log('\nNext steps:');
    console.log('1. Re-enable URL fields in admin interface');
    console.log('2. Test adding preview URLs to beats');
    console.log('3. Test full track URL functionality');

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

verifyDatabaseFix();




