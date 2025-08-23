### Beat Purchase Client Flow
- Testing tips:
  - Use Stripe CLI or `node scripts/test-webhook.js http://localhost:3000/api/stripe` to simulate webhooks locally.
  - Or run the npm script: `npm run test:webhook`
  - Ensure `STRIPE_WEBHOOK_SECRET` matches in both the script env and your app.
  - Verify `orders` rows appear in Supabase after a completed session event.

- Beat display and purchase UI: `components/BeatCard.tsx` with `LicenseSelectModal` for license choice.
- Cart state: `components/ui/CartContext.tsx` with localStorage persistence and totals computed from selected license prices.
- Cart UI and checkout trigger: `components/ui/CartDrawer.tsx` calls `/api/checkout_sessions` and redirects via Stripe.js.
- Checkout session API: `pages/api/checkout_sessions.ts` validates items against Supabase, derives license pricing server-side, and creates Stripe Checkout Sessions with cart metadata.
- Success/Cancel pages: `pages/success.tsx` clears cart; `pages/cancel.tsx` preserves cart.
- Stripe client loader: `lib/stripe.ts` uses `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.

Required env vars:
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET` (used by the webhook handler)
- `NEXT_PUBLIC_SITE_URL` (used for success/cancel URLs)

Notes:
- Prices are taken from `beat.licenseTypes[license]` server-side (do not trust client data).
- Webhook handler at `pages/api/stripe.ts` verifies signatures, saves orders, generates download links, and emails users (via Brevo API).

