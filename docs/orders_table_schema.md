### Orders Table Schema (Supabase)

Recommended columns for `orders` table:

- id: uuid (primary key, default uuid_generate_v4())
- created_at: timestamp with time zone (default now())
- customer_email: text (indexed)
- stripe_session_id: text (unique)
- items: jsonb
- total: bigint (Stripe amount in cents)
- status: text (e.g., 'completed', 'refunded')

Example jsonb for `items`:
[
  {
    "beatId": "123",
    "license": "mp3",
    "downloadUrl": "https://drive.google.com/uc?export=download&id=...",
    "expiresAt": "2025-01-31T12:00:00.000Z"
  }
]

Indexes:
- create index on customer_email for quick lookups
- unique index on stripe_session_id


