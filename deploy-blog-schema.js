const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://tfcmvmnkncgyjfpykdia.supabase.co',
  'sb_secret_2ZJ6dcREvtKLZAobXjKmqA_JOM5zQ7A'
);

async function deployBlogSchema() {
  console.log('🚀 Deploying Blog Schema to Supabase...\n');

  try {
    // Read the schema file
    const schemaSQL = fs.readFileSync('./docs/database/blog_schema.sql', 'utf8');

    // Split the SQL into individual statements (excluding comments and empty lines)
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📋 Found ${statements.length} SQL statements to execute`);

    let successCount = 0;
    let errorCount = 0;

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`\n⚡ Executing statement ${i + 1}/${statements.length}...`);
          console.log(`   SQL: ${statement.substring(0, 100)}${statement.length > 100 ? '...' : ''}`);

          // Try to execute the statement directly
          const { data, error } = await supabase.rpc('exec_sql', { sql: statement });

          if (error) {
            console.log(`   ❌ Error: ${error.message}`);

            // If exec_sql doesn't work, try alternative approaches
            if (statement.includes('CREATE EXTENSION')) {
              console.log('   ℹ️  Extension creation may require manual execution in Supabase dashboard');
            } else if (statement.includes('CREATE TRIGGER')) {
              console.log('   ℹ️  Trigger creation may require manual execution or function setup');
            } else if (statement.includes('CREATE OR REPLACE FUNCTION')) {
              console.log('   ℹ️  Function creation may require manual execution');
            }

            errorCount++;
          } else {
            console.log(`   ✅ Success`);
            successCount++;
          }
        } catch (err) {
          console.log(`   ❌ Exception: ${err.message}`);

          // Try to determine what type of statement this is and provide guidance
          if (statement.includes('CREATE TABLE')) {
            console.log('   💡 Try creating this table manually in Supabase SQL Editor');
          } else if (statement.includes('INSERT INTO')) {
            console.log('   💡 Try inserting this data manually in Supabase Table Editor');
          } else if (statement.includes('CREATE INDEX')) {
            console.log('   💡 Try creating this index manually in Supabase SQL Editor');
          }

          errorCount++;
        }
      }
    }

    console.log('\n📊 DEPLOYMENT SUMMARY');
    console.log('═'.repeat(50));
    console.log(`✅ Successful statements: ${successCount}`);
    console.log(`❌ Failed statements: ${errorCount}`);
    console.log(`📋 Total statements: ${statements.length}`);

    if (errorCount > 0) {
      console.log('\n🔧 MANUAL EXECUTION REQUIRED');
      console.log('═'.repeat(50));
      console.log('Some statements may need to be executed manually in the Supabase SQL Editor:');
      console.log('1. Go to https://supabase.com/dashboard/project/YOUR_PROJECT/sql');
      console.log('2. Copy and execute the failed statements from docs/database/blog_schema.sql');
      console.log('3. Pay special attention to:');
      console.log('   - CREATE EXTENSION statements (may need admin privileges)');
      console.log('   - CREATE TRIGGER statements (may need function dependencies)');
      console.log('   - CREATE OR REPLACE FUNCTION statements');
    }

    console.log('\n🎉 Schema deployment attempt completed!');
    console.log('Check the results above and execute any failed statements manually if needed.');

  } catch (error) {
    console.error('❌ Schema deployment failed:', error.message);
    console.log('\n💡 Try executing the schema manually in Supabase SQL Editor');
  }
}

deployBlogSchema();

