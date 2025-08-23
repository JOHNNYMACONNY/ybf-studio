// Supabase setup validator
// Usage: npm run test:supabase
const fs = require('fs');
const path = require('path');

function loadEnvIfMissing() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length === 0) return;
  for (const file of ['.env.local', '.env']) {
    const full = path.join(process.cwd(), file);
    if (!fs.existsSync(full)) continue;
    try {
      const content = fs.readFileSync(full, 'utf8');
      content.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return;
        const idx = trimmed.indexOf('=');
        const key = trimmed.slice(0, idx).trim();
        let value = trimmed.slice(idx + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = value;
      });
    } catch {}
  }
}

loadEnvIfMissing();

function ensureEnv(name) {
  const val = process.env[name];
  if (!val) throw new Error(`Missing env var: ${name}`);
  return val;
}

async function main() {
  const url = ensureEnv('NEXT_PUBLIC_SUPABASE_URL');
  const anonKey = ensureEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  const serviceKey = ensureEnv('SUPABASE_SERVICE_ROLE_KEY');

  const { createClient } = require('@supabase/supabase-js');
  const anon = createClient(url, anonKey);
  const admin = createClient(url, serviceKey);

  const result = { env: {}, anon: {}, admin: {} };

  result.env.present = true;

  // Anon read beats
  try {
    const { data, error } = await anon.from('beats').select('id').limit(1);
    result.anon.beats = { ok: !error, error: error?.message || null, count: Array.isArray(data) ? data.length : 0 };
  } catch (e) {
    result.anon.beats = { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  // Admin read beats
  try {
    const { data, error } = await admin.from('beats').select('id').limit(1);
    result.admin.beats = { ok: !error, error: error?.message || null, count: Array.isArray(data) ? data.length : 0 };
  } catch (e) {
    result.admin.beats = { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  // Admin read orders
  try {
    const { data, error } = await admin.from('orders').select('id').limit(1);
    result.admin.orders = { ok: !error, error: error?.message || null, count: Array.isArray(data) ? data.length : 0 };
  } catch (e) {
    result.admin.orders = { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  const ok = !!(result.anon.beats?.ok && result.admin.beats?.ok && result.admin.orders?.ok);
  console.log(JSON.stringify({ ok, result }, null, 2));
  process.exit(ok ? 0 : 1);
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }, null, 2));
  process.exit(1);
});


