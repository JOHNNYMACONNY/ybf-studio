// Local Stripe webhook test helper
// Usage: node scripts/test-webhook.js http://localhost:3000/api/stripe
const crypto = require('crypto');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

function loadEnvIfMissing() {
  if (process.env.STRIPE_WEBHOOK_SECRET) return;
  const candidates = ['.env.local', '.env'];
  for (const file of candidates) {
    const full = path.join(process.cwd(), file);
    try {
      if (fs.existsSync(full)) {
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
        if (process.env.STRIPE_WEBHOOK_SECRET) return;
      }
    } catch {}
  }
}

function createSignatureHeader(payload, secret, timestamp = Math.floor(Date.now() / 1000)) {
  const signedPayload = `${timestamp}.${payload}`;
  const signature = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
  return `t=${timestamp},v1=${signature}`;
}

async function main() {
  loadEnvIfMissing();
  const url = process.argv[2] || 'http://localhost:3000/api/stripe';
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET');
    process.exit(1);
  }

  const testEvent = {
    id: 'evt_test_123',
    object: 'event',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test_123',
        object: 'checkout.session',
        customer_details: { email: 'test@example.com' },
        metadata: {
          cartItems: JSON.stringify([
            { beatId: '1', license: 'mp3' }
          ])
        },
        amount_total: 1000
      }
    }
  };

  const body = JSON.stringify(testEvent);
  const sigHeader = createSignatureHeader(body, secret);

  const isHttps = url.startsWith('https://');
  const client = isHttps ? https : http;
  const req = client.request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Stripe-Signature': sigHeader,
      'Content-Length': Buffer.byteLength(body)
    }
  }, (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      console.log('Body:', data);
    });
  });

  req.on('error', (e) => console.error('Request error:', e));
  req.write(body);
  req.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});



