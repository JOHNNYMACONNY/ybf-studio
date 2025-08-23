-- Orders table for beat purchases
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_email text not null,
  stripe_session_id text not null,
  items jsonb not null,
  total bigint,
  status text default 'completed'
);

-- Unique constraint to avoid duplicate inserts for the same session
create unique index if not exists orders_stripe_session_id_key on public.orders (stripe_session_id);

-- Helpful index for customer lookups
create index if not exists orders_customer_email_idx on public.orders (customer_email);


