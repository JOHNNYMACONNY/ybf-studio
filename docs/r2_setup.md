### Cloudflare R2 for Full Beat Downloads

Steps:
- Create an R2 bucket and get credentials
  - Account ID, Access Key ID, Secret Access Key, Bucket name
  - Optional: set up a custom domain via Cloudflare for static hosting (not required for presigned URLs)

- Configure env vars (local and prod):
  - `R2_ACCOUNT_ID`
  - `R2_ACCESS_KEY_ID`
  - `R2_SECRET_ACCESS_KEY`
  - `R2_BUCKET`
  - `R2_PUBLIC_BASE_URL` (optional; not used for signing)

- Upload files to R2 using any S3-compatible tool
  - Recommended keys: `<beatId>/mp3/<filename>`, `<beatId>/wav/<filename>`, `<beatId>/premium/<filename>`

- In Supabase `public.beats`, set `external_downloads` JSON per beat, e.g.:
```json
{
  "mp3": "beat123/mp3/beat123.mp3",
  "wav": "beat123/wav/beat123.wav",
  "premium": "beat123/premium/beat123.zip"
}
```

- Webhook behavior
  - If R2 is configured AND `external_downloads[license]` exists, the webhook issues a signed URL using `lib/r2.ts` for 24h
  - Else, falls back to `utils/download-links.ts` legacy generator

- Testing
  - Complete a test checkout
  - Verify the email contains an R2 signed URL (`...r2.cloudflarestorage.com/...`)
  - Confirm the link downloads successfully before it expires


