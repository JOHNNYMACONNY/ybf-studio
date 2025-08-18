## Booking flow (Services -> Service Requests)

1. User clicks Book Now on `/services`, opening `ServiceBookingModal`.
2. Modal submits to `POST /api/service-requests` with basic details and price.
3. API handler uses `supabaseAdmin` (service role) to insert into `service_requests`.
4. If user is signed in with NextAuth, we attach `session.user.id` to `user_id` (nullable FK).

Notes
- RLS policies in `docs/database/services_schema.sql` require auth for inserts; using `supabaseAdmin` bypasses this securely on the server.
- NextAuth session includes `user.id = token.sub` to allow optional linkage.
- Environment
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server only)

References
- Supabase service role: https://supabase.com/docs/guides/api#service-key
- NextAuth callbacks: https://next-auth.js.org/configuration/callbacks


## Payment extension (validated)

1. Admin or workflow triggers `POST /api/service-checkout` with `{ requestId }`.
   - Server loads the request joined with `services` to retrieve canonical `name` and `price`.
   - Creates a Stripe Checkout session (unit amount from DB, not client input) with metadata `{ serviceRequestId, serviceId }`.
   - Returns `{ sessionId }` for redirect via Stripe.js.
2. Stripe webhook at `POST /api/stripe-webhook` updates `service_requests.payment_status`:
   - `checkout.session.completed` → `paid` (stores `stripe_payment_intent_id`).
   - `charge.refunded` → `refunded`.

Environment
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL` or `NEXTAUTH_URL` for success/cancel URLs

Security
- Price is sourced from the `services` table; request body cannot tamper price.
- IP rate limiting remains in `POST /api/service-requests`.


