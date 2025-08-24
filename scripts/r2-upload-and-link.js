// Upload a file to Cloudflare R2 and update Supabase beats.external_downloads
// Usage:
// node scripts/r2-upload-and-link.js <beatId> <license:mp3|wav|premium> <localFilePath> [r2Key]

const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

function ensureEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function loadEnv() {
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
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) value = value.slice(1, -1);
        if (!process.env[key]) process.env[key] = value;
      });
    } catch {}
  }
}

async function main() {
  loadEnv();

  const beatId = process.argv[2];
  const license = process.argv[3];
  const filePath = process.argv[4];
  const keyArg = process.argv[5];

  if (!beatId || !license || !filePath) {
    console.error('Usage: node scripts/r2-upload-and-link.js <beatId> <license:mp3|wav|premium> <localFilePath> [r2Key]');
    process.exit(1);
  }
  if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);

  // R2 client
  const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
  const R2_ACCOUNT_ID = ensureEnv('R2_ACCOUNT_ID');
  const R2_ACCESS_KEY_ID = ensureEnv('R2_ACCESS_KEY_ID');
  const R2_SECRET_ACCESS_KEY = ensureEnv('R2_SECRET_ACCESS_KEY');
  const R2_BUCKET = ensureEnv('R2_BUCKET');

  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  });

  const filename = path.basename(filePath);
  const defaultKey = `${beatId}/${license}/${filename}`;
  const key = keyArg || defaultKey;
  const contentType = mime.lookup(filename) || 'application/octet-stream';

  const body = fs.readFileSync(filePath);
  await s3.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: body, ContentType: contentType }));

  // Update Supabase beat.external_downloads
  const { createClient } = require('@supabase/supabase-js');
  const supa = createClient(ensureEnv('NEXT_PUBLIC_SUPABASE_URL'), ensureEnv('SUPABASE_SERVICE_ROLE_KEY'));

  // Fetch current downloads
  const { data: beats, error: fetchErr } = await supa.from('beats').select('id, external_downloads').eq('id', beatId).limit(1);
  if (fetchErr) throw fetchErr;
  if (!beats || beats.length === 0) throw new Error(`Beat not found: ${beatId}`);
  const current = beats[0].external_downloads || {};
  current[license] = key;

  const { error: updErr } = await supa.from('beats').update({ external_downloads: current }).eq('id', beatId);
  if (updErr) throw updErr;

  console.log(JSON.stringify({ ok: true, beatId, license, key }, null, 2));
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }, null, 2));
  process.exit(1);
});


