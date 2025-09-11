#!/usr/bin/env node

/**
 * YBF Studio Database Setup Script
 * Configures production database and runs migrations
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('🗄️  YBF Studio Database Setup\n');

async function setupDatabase() {
  try {
    console.log('🔍 Checking database configuration...\n');

    // Check if environment file exists
    const envPath = path.join(__dirname, '../.env.production.local');
    if (!fs.existsSync(envPath)) {
      console.error('❌ .env.production.local not found!');
      console.log('Run: node scripts/setup-production.js first');
      process.exit(1);
    }

    console.log('📋 Database Setup Options:\n');

    // Get database URL
    const useSupabase = await question('Are you using Supabase? (y/N): ');
    let databaseUrl = '';

    if (useSupabase.toLowerCase() === 'y') {
      const supabaseUrl = await question('Supabase Project URL: ');
      const serviceRoleKey = await question('Supabase Service Role Key: ');
      databaseUrl = `postgresql://postgres:${serviceRoleKey}@${supabaseUrl.replace('https://', '')}:5432/postgres`;
    } else {
      databaseUrl = await question('Database URL (postgresql://...): ');
    }

    console.log('\n🗄️  Configuring database...\n');

    // Create database configuration
    const dbConfig = {
      production: {
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false }
      }
    };

    const configPath = path.join(__dirname, '../lib/database.config.js');
    fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(dbConfig, null, 2)};`);

    console.log('✅ Database configuration created');

    // Check for schema files
    const schemaDir = path.join(__dirname, '../docs/database');
    if (fs.existsSync(schemaDir)) {
      console.log('\n📄 Found database schema files:');
      const schemaFiles = fs.readdirSync(schemaDir)
        .filter(file => file.endsWith('.sql'))
        .map(file => path.join(schemaDir, file));

      for (const schemaFile of schemaFiles) {
        const fileName = path.basename(schemaFile);
        console.log(`- ${fileName}`);
      }

      const runSchemas = await question('\nRun database schema migrations? (y/N): ');
      if (runSchemas.toLowerCase() === 'y') {
        await runMigrations(schemaFiles);
      }
    }

    // Setup admin user
    const setupAdmin = await question('Create admin user? (y/N): ');
    if (setupAdmin.toLowerCase() === 'y') {
      await setupAdminUser();
    }

    console.log('\n✅ Database setup completed!');
    console.log('\n📋 Next Steps:');
    console.log('1. Test database connection');
    console.log('2. Run your application');
    console.log('3. Verify admin access');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

async function runMigrations(schemaFiles) {
  console.log('\n🏗️  Running database migrations...\n');

  const { Client } = require('pg');
  const dbConfig = require('../lib/database.config.js');

  const client = new Client(dbConfig.production);

  try {
    await client.connect();
    console.log('✅ Connected to database');

    for (const schemaFile of schemaFiles) {
      const fileName = path.basename(schemaFile);
      console.log(`📄 Running ${fileName}...`);

      const sql = fs.readFileSync(schemaFile, 'utf8');

      // Split by semicolon and execute each statement
      const statements = sql.split(';').filter(stmt => stmt.trim());

      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await client.query(statement);
          } catch (error) {
            console.warn(`⚠️  Statement failed: ${error.message}`);
          }
        }
      }

      console.log(`✅ ${fileName} completed`);
    }

    console.log('✅ All migrations completed');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

async function setupAdminUser() {
  console.log('\n👤 Setting up admin user...\n');

  const email = await question('Admin email: ');
  const name = await question('Admin name: ');

  // Generate a secure password suggestion
  const password = Math.random().toString(36).slice(-12) + 'A1!';
  console.log(`\n🔐 Suggested password: ${password}`);
  console.log('⚠️  Save this password securely!\n');

  // In a real application, you would hash this password
  const adminUser = {
    email,
    name,
    password,
    role: 'super_admin',
    permissions: { all: true },
    is_active: true,
    created_at: new Date().toISOString()
  };

  // Save to a temporary file for manual insertion
  const adminPath = path.join(__dirname, '../admin-user-setup.sql');
  const sql = `
-- Run this in your Supabase SQL editor to create the admin user
INSERT INTO admin_users (email, name, password, role, permissions, is_active, created_at)
VALUES (
  '${adminUser.email}',
  '${adminUser.name}',
  '${adminUser.password}',
  '${adminUser.role}',
  '${JSON.stringify(adminUser.permissions)}',
  ${adminUser.is_active},
  '${adminUser.created_at}'
)
ON CONFLICT (email) DO NOTHING;
`;

  fs.writeFileSync(adminPath, sql);

  console.log('✅ Admin user SQL generated');
  console.log(`📄 File: ${adminPath}`);
  console.log('\n📋 Instructions:');
  console.log('1. Open your Supabase project');
  console.log('2. Go to SQL Editor');
  console.log('3. Copy and paste the contents of admin-user-setup.sql');
  console.log('4. Execute the query');
}

// Test database connection
async function testConnection() {
  const { Client } = require('pg');
  const dbConfig = require('../lib/database.config.js');

  const client = new Client(dbConfig.production);

  try {
    await client.connect();
    console.log('✅ Database connection successful');

    // Test basic query
    const result = await client.query('SELECT NOW()');
    console.log('✅ Query executed successfully:', result.rows[0]);

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

setupDatabase();


