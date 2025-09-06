## Admin Beats Workflow

This guide shows how to add, edit, and delete beats in the admin panel.

Prerequisites:
- You must be signed in as an admin (your email must be in `ADMIN_EMAILS`).

Steps:
1. Navigate to `/admin/beats`.
2. Click "Add New Beat" to open the form.
3. Fill in required fields (Title, Artist, BPM). Optionally add SoundCloud preview and Google Drive full track URLs.
4. Upload custom cover art (optional) - if not provided, a random cover from the fallback system will be used.
5. Set per-license pricing (MP3, WAV, Premium, Exclusive) and choose status (Draft/Published).
6. Save the beat. A toast will confirm the action.
7. To edit or delete, hover a beat card and use the action buttons.

Notes:
- Per-license pricing is stored in `licensetypes` JSON on the `beats` table.
- Status controls visibility and can be toggled in the form.
- Cover Art: Custom cover art can be uploaded, otherwise the system uses randomized fallback images from `/assets/beatCovers/` (4 options available).
- Cover Art Fallback: Ensures all beats display professional-looking cover art even without custom uploads.

Screenshots: (add when available)
- admin_beats_list.png
- admin_beats_form.png
- admin_beats_toast.png


