## Cover Art Audit (Beats)

Date: 2025-09-06

### Summary
- Cover art is stored as a URL string on the DB column `beats.cover_art` and mapped in-app to `Beat.coverArt`.
- Rendering uses Next Image across Beat cards, Admin cards, Global audio player, and Cart.
- Fallbacks use 4 static images at `/assets/beatCovers/*`. Random selection occurs in multiple places.
- Admin UI shows a "Cover Art (JPG/PNG)" file picker but does not upload or persist; cover art is effectively URL-only today.
- One checkout API path selects camelCase columns from Supabase, which will not resolve; this breaks cover art in Stripe checkout metadata.

### Data Model
- DB: `beats.cover_art TEXT` (defaults vary across files; see Gaps below)
- App type: `types/beat.ts → Beat.coverArt: string`
- Mappings:
  - `pages/beats.tsx#getServerSideProps`: maps `row.cover_art → beat.coverArt`, applies `sanitizeUrl()` which returns a random fallback if invalid
  - `pages/api/beats.ts`: maps `b.cover_art → coverArt` with random fallback if missing
  - `pages/api/admin/beats.ts` (POST/PUT): accepts `cover_art` or `coverArt` and stores as `cover_art`

### Rendering Surfaces
- `components/BeatCard.tsx`: uses `beat.coverArt` with a single-image fallback `'/assets/beatCovers/beat_cover_1.png'`
- `components/admin/BeatAdminCard.tsx`: uses `beat.coverArt`
- `components/audio/GlobalAudioPlayer.tsx`: if playing a Beat, uses `currentBeat.coverArt`
- `components/ui/CartDrawer.tsx` and `components/beats/Cart.tsx`: show `item.beat.coverArt`
- Note: `components/beats/BeatCard.tsx` references a different `Beat` shape (`beat.cover`) and appears unused; see Gaps

### Fallbacks/Placeholders
- Static assets: `/public/assets/beatCovers/beat_cover_{1..4}.png`
- Random fallback helpers are duplicated:
  - `pages/beats.tsx` and `pages/api/beats.ts` both define BEAT_COVER_IMAGES + `getRandomCoverArt()`
- Behavior:
  - SSR mapping in `pages/beats.tsx` picks a random image when `cover_art` is invalid/empty. This can change between requests, causing inconsistent cover art per page load for those beats.
  - Client components sometimes use a single static fallback image (non-random), creating inconsistent behavior across surfaces.

### APIs/Services
- `pages/api/admin/beats.ts`: Upsert uses `cover_art` (snake) from either `cover_art` or `coverArt` (camel). OK.
- `pages/api/beats.ts`: Public list endpoint maps `cover_art → coverArt` and supplies random fallback. OK.
- `pages/api/checkout_sessions.ts`: SELECT uses camelCase (`coverArt, licenseTypes`) against Supabase; DB uses snake_case. This will return null columns, breaking cover art in Stripe product images and pricing reads.

### Gaps & Inconsistencies
1. No cover art upload integration
   - Admin form shows a file input via `SimpleFileUpload`, but the selected image is not uploaded nor persisted; there is no `coverArt` URL field in the form, nor a storage step (e.g., R2/Supabase Storage). Cover art must be pre-hosted and written manually to `cover_art` for persistence today.
2. Random fallback instability
   - SSR selects random fallback per request for invalid `cover_art`, causing visual churn. Client fallback sometimes uses a fixed image, leading to inconsistent UI.
3. Duplicated fallback code
   - BEAT_COVER_IMAGES and logic are duplicated in multiple files.
4. Schema default mismatch
   - `docs/database/beats_schema.sql`: default `'/images/default-cover.jpg'`
   - `scripts/fix-beats-database.sql`: default `'/assets/beatCovers/beat_cover_1.png'`
   - `scripts/create-beats-table.sql`: `'/images/default-cover.jpg'`
5. Unused/legacy component shape
   - `components/beats/BeatCard.tsx` expects `beat.cover` not `beat.coverArt`; appears unused and can confuse future work.
6. Checkout session bug (critical)
   - `pages/api/checkout_sessions.ts` selects camelCase columns from Supabase (`coverArt`, `licenseTypes`), which do not exist; must use snake_case and map.

### Recommendations
- Implement cover art upload + persistence:
  - Option A: Add `Cover Art URL` input in admin form; keep manual hosting.
  - Option B: Integrate image upload to R2/Supabase Storage in admin, return public URL, save to `cover_art`.
- Centralize cover art utilities:
  - Create `utils/coverArt.ts` with `BEAT_COVER_IMAGES`, `getRandomCoverArt()`, and `getEffectiveCoverArt(coverArt: string | null | undefined, beatId?: string)`.
  - Use deterministic fallback for stability, e.g., hash `beat.id` to index fallback list.
- Fix checkout sessions query (high priority):
  - Change SELECT to `id, title, genre, bpm, cover_art, license_types, status` and map to camelCase in code before using.
- Align schema defaults to `/assets/beatCovers/beat_cover_1.png` (or the chosen default) across all SQL/docs.
- Remove or refactor `components/beats/BeatCard.tsx` to use the canonical `Beat` type and `coverArt`.
- Replace ad-hoc fallback in `components/BeatCard.tsx` with centralized util usage for consistency.

### Implementation updates (Home Featured Beats)
- Home page Featured Beats now reuse `components/BeatCard.tsx` with a `variant='glass'` style wrapper for glassmorphic tiles.
- Featured beats are fetched via the internal `/api/beats` endpoint in `getServerSideProps` and sliced to 4, ensuring normalized camelCase fields and fallback cover art.
- This makes Featured Beats functionally consistent with the Beats page (preview, cart, pricing, robust cover fallbacks).

### Implementation updates (Beats Page)
- Public beats grid now passes `variant='glass'` to `components/BeatCard.tsx`, aligning its glassmorphic background with the home page Featured Beats.

This makes Featured Beats functionally consistent with the Beats page (preview, cart, pricing, robust cover fallbacks).

### Quick References
- Type: `types/beat.ts`
- Admin page: `pages/admin/beats.tsx`
- Admin card: `components/admin/BeatAdminCard.tsx`
- Public beats page: `pages/beats.tsx`
- Public list API: `pages/api/beats.ts`
- Admin upsert API: `pages/api/admin/beats.ts`
- Checkout session API: `pages/api/checkout_sessions.ts` (needs snake_case fix)
- Assets: `public/assets/beatCovers/*`

### Validation Checklist
- Cover art displays on:
  - Beat grid cards, Admin grid cards, Global audio player, Cart.
- Stripe checkout product images show the expected cover.
- Beats without `cover_art` render a stable deterministic fallback.
- Admin can set or upload cover art and see it persisted in DB.

