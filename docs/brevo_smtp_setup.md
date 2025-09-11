# Brevo SMTP Setup (Production + Development)

> Use this guide to configure Brevo (Sendinblue) SMTP for YBF Studio and verify sending via `/api/test-email` and the 24h reminder cron.

---

## Environment Variables

Add these to your environment (local: `.env.local`, production: Vercel → Settings → Environment Variables):

```bash
# Brevo SMTP
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_smtp_login
SMTP_PASS=your_brevo_smtp_key

# Mail From
FROM_EMAIL=jmaconny@ybfstudio.com
FROM_NAME=Your Name

# Cron
CRON_SECRET=your-cron-secret
```

Notes:
- Use port 587 with secure=false (default in our `lib/mailer.ts`) or port 465 with secure=true.
- `FROM_EMAIL` should be on your authenticated domain (e.g., `jmaconny@ybfstudio.com`).

---

## Domain Authentication (DNS)

In Brevo: Settings → Senders & domains → Domains → Add/Authenticate your domain.
- Follow the DNS records shown by Brevo (SPF, DKIM, Tracking CNAME, optional DMARC).
- In Namecheap → Advanced DNS, add records exactly as shown (no quotes, correct hosts).
- Wait 5–60 minutes, then click “Verify” in Brevo.

Optional DMARC example:
```txt
Host: _dmarc
Value: v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com
```

---

## Local Test

Restart dev server after adding env vars.

```bash
# default recipient is FROM_EMAIL if not provided
curl -i "http://localhost:3000/api/test-email"

# specify recipient/subject/body
curl -i "http://localhost:3000/api/test-email?to=jmaconny@ybfstudio.com&subject=Brevo%20Test&text=Hello"
```

Expected: 200 with a messageId.

If you see `502 5.7.0 Please authenticate first`:
- Double-check `SMTP_USER` and `SMTP_PASS` (use SMTP key, not account password)
- Try `SMTP_PORT=465` and ensure secure=true (our code auto-detects port 465)

---

## Production Test

1) Add vars in Vercel; redeploy.
2) Test:
```bash
curl -i "https://your-custom-domain/api/test-email?to=jmaconny@ybfstudio.com&subject=Brevo%20Prod%20Test&text=Hello"
```
3) Trigger cron (must have upcoming consultations 23–25h away):
```bash
curl -i -X POST https://your-custom-domain/api/cron/24h-reminders \
  -H "Authorization: Bearer $CRON_SECRET"
```

Check Brevo → Transactional → Logs if you don’t see an email.

---

## Reference

- App mailer: `lib/mailer.ts` (Nodemailer transport)
- Test route: `pages/api/test-email.ts`
- Cron: `pages/api/cron/24h-reminders.ts`

This doc supersedes previous SendGrid notes for sending.
