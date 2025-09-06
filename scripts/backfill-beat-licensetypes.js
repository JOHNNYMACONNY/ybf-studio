/*
  Backfill licensetypes for existing rows in `beats`.
  - If `licensetypes` is null/empty, derive from `price` or defaults.
  - Defaults: mp3:19, wav:29, premium:49, exclusive:199
  Env: SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
*/

const { createClient } = require('@supabase/supabase-js');

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing environment variable: ${name}`);
  }
  return value;
}

function deriveLicenses(basePrice) {
  const price = typeof basePrice === 'number' && basePrice > 0 ? basePrice : 29;
  return {
    mp3: Math.max(0, Math.round((price - 10) * 100) / 100) || 19,
    wav: Math.max(0, Math.round(price * 100) / 100) || 29,
    premium: Math.max(0, Math.round((price + 20) * 100) / 100) || 49,
    exclusive: 199,
  };
}

async function main() {
  const SUPABASE_URL = getEnv('SUPABASE_URL') || getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const SERVICE_ROLE_KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY');

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('Aborting: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  console.log('Fetching beats...');
  const { data: beats, error } = await supabase
    .from('beats')
    .select('id, licensetypes')
    .limit(10000);

  if (error) {
    console.error('Fetch error:', error.message);
    process.exit(1);
  }

  const updates = [];
  for (const beat of beats || []) {
    if (!beat.licensetypes || Object.keys(beat.licensetypes || {}).length === 0) {
      const licenses = deriveLicenses(undefined);
      updates.push({ id: beat.id, licensetypes: licenses });
    }
  }

  if (updates.length === 0) {
    console.log('No rows to backfill.');
    return;
  }

  console.log(`Backfilling ${updates.length} beats...`);
  const { data: upserted, error: upErr } = await supabase
    .from('beats')
    .upsert(updates, { onConflict: 'id' })
    .select('id');

  if (upErr) {
    console.error('Backfill error:', upErr.message);
    process.exit(1);
  }

  console.log(`Backfilled ${upserted?.length || 0} beats.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


