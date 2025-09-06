## Services Page Architecture

This page outlines how the `/services` page is organized and how to extend it.

### Data sources
- Services: fetched from the `active_services` view via `lib/services.ts#getActiveServices()`.
- FAQs: fetched from the `active_faqs` view via `lib/services.ts#getActiveFaqs()`.

Data is retrieved at build time with Incremental Static Regeneration (ISR), revalidating every 5 minutes.

### Composition
Key components used on the page:
- `components/services/ServiceComparison`
- `components/services/ServiceHighlights`
- `components/services/ServiceGrid` (static showcase; dynamic DB-driven cards are rendered directly in the page)
- `components/ServiceBookingModal`

Sections rendered by `pages/services.tsx`:
1. Hero (image + heading)
2. Services grid (DB-driven)
3. Process steps
4. Service comparison (lazy-loaded)
5. FAQs (from DB)
6. CTA buttons

Enhancements (2025-08-31):
- Grid uses `lg:grid-cols-4` with `auto-rows-fr`; each card is `flex flex-col h-full` so CTAs align.
- A subtle `panel-3d-surface` underlay evens loud background streaks.
- Buttons use brand variants (`spline-primary`, `spline-secondary`) for consistency.
- Comparison chart updated to parse features robustly and added a "Stems Supported" row.
- Comparison row labels include tooltips via `components/ui/Tooltip` for quick explanations.

### Adding a new service
1. Insert or update the record in your `services` table so it appears in `active_services`.
2. Ensure fields required by `types/service.ts` are present (e.g., `name`, `price`).
3. The page will update automatically on the next ISR revalidate.

### Adding an FAQ
1. Insert/update an item that appears in `active_faqs`.
2. The page will update on the next ISR revalidate.

### Notes
- Avoid adding components under the root `services/` folder; canonical components live in `components/services/`.
- Use dynamic imports for heavy sections to optimize performance.
- If adding new comparison features, update `ServiceComparison.tsx` helpers:
  - `featureIncludes(pkg, [...])`
  - `getStemsSupported(pkg)`
  And extend `SERVICE_PACKAGES` in `lib/pricing-config.ts` accordingly.


