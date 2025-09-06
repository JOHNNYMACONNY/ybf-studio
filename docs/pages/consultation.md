# Consultation Page

This page presents consultation offerings and a modal booking form, standardized to the premium dark theme and 3D-spline visual system used across the app.

## Files
- `pages/consultation.tsx`: Page layout, hero, package grid, value props, process, and CTA. Uses `card-3d-spline` sections, `text-3d-spline-text-*` colors, and shared `Button`.
- `components/consultation/ConsultationBookingForm.tsx`: Modal booking form built with shared `Modal`, `Input`, `Select`, `Textarea`, `Button`. Loads active packages from `/api/consultation-packages`.

## UX Notes
- Buttons use `variant="primary"` for main CTAs. Secondary/neutral actions use `variant="secondary"`.
- Success and error feedback use the global toast system (`ToastProvider` in `_app.tsx`). Page-consuming callbacks (`onSuccess`, `onError`) trigger toasts.
- Typography uses `text-3d-spline-text-primary` (headings) and `text-3d-spline-text-secondary`/`-muted` (body/captions) for harmony with the services page.

## Booking Form Fields
- First/Last Name, Email (required), Phone/Company (optional)
- Package (optional but pre-populates duration if selected)
- Preferred Date & Time (`datetime-local`), Duration (defaults to 60m; syncs to selected package)
- Budget, Timeline, Referral Source (optional selects)
- Project Details, Notes (optional textareas)

## Submission
- Submits to `POST /api/consultations` and calls `onSuccess` with the created consultation.
```
{
  client_email,
  client_first_name,
  client_last_name,
  client_phone?,
  client_company?,
  project_details?,
  budget_range?,
  timeline?,
  referral_source?,
  package_id?,
  start_at: ISO,
  end_at: ISO,
  duration_minutes,
  notes?
}
```
- Server validates email, dates, and duration. On success, confirmation and admin notification emails are sent. Errors surface via toast.

## Style
- Sections: `card-3d-spline rounded-2xl p-8 mb-12`
- Grids: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Package cards: `card-3d-spline` with accent price and muted detail text


