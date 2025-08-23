#!/usr/bin/env node

// Simple SendGrid smoke test
// Usage:
//   export SENDGRID_API_KEY='SG.xxx...'
//   node scripts/sendgrid-smoke.js [toEmail] [fromEmail] [fromName]

const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
if (!SENDGRID_API_KEY) {
  console.error('❌ Missing SENDGRID_API_KEY env var.');
  process.exit(1);
}
sgMail.setApiKey(SENDGRID_API_KEY);

const toEmail = process.argv[2] || 'jmaconny@ybfstudio.com';
const fromEmail = process.argv[3] || 'jmaconny@ybfstudio.com';
const fromName = process.argv[4] || 'Johnny';
// Enable sandbox mode by default to avoid consuming credits while testing.
// Set SENDGRID_SANDBOX=false to actually deliver.
const sandbox = (process.env.SENDGRID_SANDBOX || 'true').toLowerCase() === 'true';

async function main() {
  try {
    const msg = {
      to: toEmail,
      from: { email: fromEmail, name: fromName },
      subject: 'SendGrid Node.js test',
      text: 'If you see this, your key and domain are working.',
      html: '<p>If you see this, your key and domain are working.</p>',
      mailSettings: { sandboxMode: { enable: sandbox } }
    };

    await sgMail.send(msg);
    if (sandbox) {
      console.log('✅ SendGrid accepted the message (sandbox mode ON, no delivery, no credits used).');
    } else {
      console.log('✅ SendGrid accepted the message. Check your inbox/spam.');
    }
  } catch (err) {
    const body = err && err.response && err.response.body ? err.response.body : err;
    console.error('❌ Send error:', body);
    process.exit(1);
  }
}

main();
