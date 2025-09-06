# SoundCloud Preview Integration Guide

## Current Status
SoundCloud previews are integrated via the SoundCloud Widget and the global audio player. Clicking a Beat card's play button loads the preview into the widget and autoplays. Footer controls (play/pause/seek) now control the widget directly.

## For SoundCloud Integration

### 1. Track Requirements
- **Public (recommended)**: Use the page URL (e.g., `https://soundcloud.com/username/track-name`). Ensure embedding is allowed.
- **Private (supported if embeddable)**: Use the API track URL with secret token: `https://api.soundcloud.com/tracks/TRACK_ID?secret_token=s-XXXX` in the embed URL. If the track disallows embedding, it will not play.

### 2. How to Get Working URLs

#### Option A: Public & Embeddable Tracks
1. Go to your SoundCloud track
2. Click "Share" → "Embed"
3. Copy the URL from the embed code (it will look like: `https://soundcloud.com/username/track-name`)
4. Update your beat's `previewUrl` field in the admin panel

#### Option B: Upload Direct Audio Files
1. Upload MP3/WAV files to your `/public/audio/` directory
2. Update the `audioUrl` field with the path (e.g., `/audio/my-beat.mp3`)

### 3. Testing SoundCloud URLs
1. Open the URL in an incognito window
2. Confirm playback without logging in
3. Verify embedding is enabled in SoundCloud settings
4. For private tracks, confirm the embed code uses `api.soundcloud.com/tracks/{id}?secret_token=s-XXXX`

## Player Behavior
- **Compact widget**: The iframe uses the compact player (height 20, `visual=false`) with minimal UI.
- **Autoplay on first click**: When clicking a Beat's play button, if the widget is ready it loads and plays immediately; otherwise the URL is queued and auto-loaded on READY.
- **Footer controls**: Play/pause/seek directly control the SoundCloud widget when active.

## Fallbacks
- **Demo Preview**: Uses `/audio/demo-preview.mp3` if no `previewUrl`/`audioUrl` present.
- **Beep Tone**: Generates a tone if local audio fails.
- **Logging**: Detailed console logs in `UnifiedAudioContext`.

## Quick Fix for Testing
To test the fallback immediately:
1. Visit `/beats` page
2. Click play on any beat
3. Check browser console for detailed error logs
4. You should hear either the demo audio or a beep tone

## Database Tips
Ensure `preview_url` contains a valid, embeddable SoundCloud URL (public page URL), or an API track URL with secret token for private tracks.
```sql
-- Update existing beats with sample SoundCloud URLs (replace with your actual URLs)
UPDATE beats SET preview_url = 'https://soundcloud.com/example/artist-beat-preview'
WHERE id = 'beat_1756631751515'; -- "What About It"

-- Or add direct audio files
UPDATE beats SET audio_url = '/audio/my-beat.mp3'
WHERE id = 'beat_1756631751515';
```

## Troubleshooting
- **First click doesn’t play**: Ensure the global player is rendered (footer visible) and `https://w.soundcloud.com/player/api.js` loads; track must allow embedding.
- **Private track won’t play**: Use API track URL with `secret_token` and confirm embeddable permissions.
- **Widget blocked**: Check Content Security Policy includes `w.soundcloud.com` (script/frame) and `api-widget.soundcloud.com` (connect).
- **No audio**: Check browser console; verify network access to SoundCloud; confirm URL correctness.




