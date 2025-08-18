/*
  Upsert canonical service packages into Supabase `services` table.
  - Reads canonical data from lib/pricing-config.js (SERVICE_PACKAGES)
  - Uses SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from environment
  - Upserts by unique slug
  - Deactivates legacy 'stereo-mix' if present
*/

const { createClient } = require('@supabase/supabase-js');
const { SERVICE_PACKAGES } = require('../lib/pricing-config.js');

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function main() {
  const SUPABASE_URL = getEnv('SUPABASE_URL') || getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const SERVICE_ROLE_KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY');

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('Aborting: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // Map config to DB row shape
  const rows = SERVICE_PACKAGES.map((pkg, index) => ({
    name: pkg.name,
    slug: pkg.id, // use config id as slug
    description: pkg.description,
    short_description: pkg.description,
    price: pkg.price,
    original_price: pkg.originalPrice ?? null,
    features: pkg.features || [],
    turnaround_time: pkg.turnaround,
    // Map bundle -> bundles to match category seed naming
    category: pkg.category === 'bundle' ? 'bundles' : pkg.category,
    status: 'active',
    sort_order: index + 1,
  }));

  console.log('Upserting service packages:', rows.map(r => r.slug));
  const { data, error } = await supabase
    .from('services')
    .upsert(rows, { onConflict: 'slug' })
    .select('id, name, slug, status');

  if (error) {
    console.error('Upsert error:', error);
    process.exit(1);
  }

  console.log('Upserted services:', data);

  // Deactivate legacy entry if present
  const { error: deactivateError } = await supabase
    .from('services')
    .update({ status: 'inactive' })
    .eq('slug', 'stereo-mix');

  if (deactivateError) {
    console.warn('Warning: could not deactivate legacy stereo-mix:', deactivateError.message);
  } else {
    console.log('Legacy stereo-mix deactivated (if it existed).');
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


