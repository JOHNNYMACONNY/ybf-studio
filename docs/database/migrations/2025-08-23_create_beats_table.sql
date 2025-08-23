-- Beats table required by the app (pages/beats.ts and checkout validation)
create table if not exists public.beats (
  id text primary key,
  created_at timestamptz not null default now(),
  title text not null,
  artist text not null,
  genre text not null,
  bpm integer not null,
  coverArt text not null,
  audioUrl text,
  previewUrl text,
  fullTrackUrl text,
  duration text,
  previewDuration text,
  description text,
  licenseTypes jsonb not null,
  -- external download links per license (e.g., {"mp3":"https://...","wav":"https://...","premium":"https://...","exclusive":"https://..."})
  external_downloads jsonb,
  download_provider text,
  status text not null default 'published' check (status in ('draft','published','archived'))
);

-- Helpful indexes
create index if not exists beats_status_idx on public.beats (status);
create index if not exists beats_genre_idx on public.beats (genre);

