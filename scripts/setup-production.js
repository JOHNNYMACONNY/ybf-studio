#!/usr/bin/env node

/**
 * YBF Studio Production Setup Script
 * Automates the production environment configuration
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('🚀 YBF Studio Production Setup\n');
console.log('This script will help you configure your production environment.\n');

async function setupProduction() {
  try {
    // Check if template exists
    const templatePath = path.join(__dirname, '../env.production.template');
    const envPath = path.join(__dirname, '../.env.production.local');

    if (!fs.existsSync(templatePath)) {
      console.error('❌ env.production.template not found!');
      process.exit(1);
    }

    // Check if already exists
    if (fs.existsSync(envPath)) {
      const overwrite = await question('⚠️  .env.production.local already exists. Overwrite? (y/N): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('Setup cancelled.');
        process.exit(0);
      }
    }

    console.log('📋 Collecting production configuration...\n');

    // Collect configuration values
    const config = {};

    console.log('🔐 Authentication Configuration:');
    config.NEXTAUTH_URL = await question('NextAuth URL (https://yourdomain.com): ');
    config.NEXTAUTH_SECRET = await question('NextAuth Secret Key: ');

    console.log('\n🗄️  Supabase Configuration:');
    config.NEXT_PUBLIC_SUPABASE_URL = await question('Supabase Project URL: ');
    config.NEXT_PUBLIC_SUPABASE_ANON_KEY = await question('Supabase Anon Key: ');
    config.SUPABASE_SERVICE_ROLE_KEY = await question('Supabase Service Role Key: ');

    console.log('\n💳 Stripe Configuration:');
    config.STRIPE_SECRET_KEY = await question('Stripe Secret Key (sk_live_...): ');
    config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = await question('Stripe Publishable Key (pk_live_...): ');
    config.STRIPE_WEBHOOK_SECRET = await question('Stripe Webhook Secret: ');

    console.log('\n📧 Email Configuration:');
    config.BREVO_API_KEY = await question('Brevo API Key: ');
    config.FROM_EMAIL = await question('From Email (jmaconny@ybfstudio.com): ');
    config.ADMIN_NOTIFICATIONS_EMAIL = await question('Admin Notifications Email (jmaconny@ybfstudio.com): ');

    console.log('\n☁️  Cloudflare R2 Configuration (Optional):');
    const useR2 = await question('Configure Cloudflare R2? (y/N): ');
    if (useR2.toLowerCase() === 'y') {
      config.R2_ACCOUNT_ID = await question('R2 Account ID: ');
      config.R2_ACCESS_KEY_ID = await question('R2 Access Key ID: ');
      config.R2_SECRET_ACCESS_KEY = await question('R2 Secret Access Key: ');
      config.R2_BUCKET = await question('R2 Bucket Name: ');
      config.R2_PUBLIC_BASE_URL = await question('R2 Public Base URL: ');
    }

    console.log('\n📊 Analytics Configuration (Optional):');
    const useGA = await question('Configure Google Analytics? (y/N): ');
    if (useGA.toLowerCase() === 'y') {
      config.NEXT_PUBLIC_GA_ID = await question('Google Analytics ID (G-XXXXXXXXXX): ');
    }

    // Read template
    let template = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholders
    Object.entries(config).forEach(([key, value]) => {
      if (value) {
        template = template.replace(`your-${key.toLowerCase().replace(/_/g, '-')}`, value);
      }
    });

    // Write environment file
    fs.writeFileSync(envPath, template);

    console.log('\n✅ Production environment configured successfully!');
    console.log(`📄 File created: .env.production.local`);
    console.log('\n🔒 Important: Never commit this file to version control.');
    console.log('📤 Upload these environment variables to your hosting platform.');

    // Show next steps
    console.log('\n📋 Next Steps:');
    console.log('1. Test your build locally: npm run build');
    console.log('2. Configure environment variables in Vercel/Netlify');
    console.log('3. Deploy to production');
    console.log('4. Test all functionality in production');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setupProduction();


