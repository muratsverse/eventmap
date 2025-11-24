# Cloud Image Storage Setup Guide

This guide explains how to set up cloud storage for event images using Supabase Storage (with AWS S3 and Cloudflare R2 alternatives).

## Features Implemented

✅ **Automatic Image Optimization**
- Resizes images to max 1920px width
- Compresses to 85% quality (JPEG)
- Reduces file size before upload

✅ **File Validation**
- Maximum file size: 5MB
- Allowed formats: JPEG, PNG, WEBP
- Client-side validation before upload

✅ **Secure Upload**
- Files organized by user ID (folder per user)
- RLS policies enforce user can only upload to their own folder
- Public read access for event images

✅ **Presigned URL Support**
- Direct browser-to-storage uploads (bypasses server)
- Temporary signed URLs (60 seconds validity)
- Reduces server bandwidth

✅ **Storage Management**
- Delete images when events are deleted
- Automatic cleanup of old images
- Storage quota tracking per user

## Option 1: Supabase Storage (Recommended)

### Step 1: Run SQL Setup Script

1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Run the script: `supabase/setup-image-storage.sql`

This creates:
- `event-images` bucket (public read access)
- RLS policies for secure uploads
- User folder structure

### Step 2: Configure Bucket Settings

1. Go to **Storage** in Supabase Dashboard
2. Click on `event-images` bucket
3. Go to **Settings**
4. Configure:
   - **File size limit**: 5242880 bytes (5MB)
   - **Allowed MIME types**:
     - `image/jpeg`
     - `image/jpg`
     - `image/png`
     - `image/webp`

### Step 3: Verify Supabase Configuration

Your `.env` should already have:

```bash
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 4: Test Upload

1. Start the app: `npm run dev`
2. Login as a user
3. Try creating an event with an image
4. Check Supabase Dashboard > Storage > event-images
5. You should see: `{user_id}/{timestamp}-{random}.jpg`

### Step 5: Storage Pricing

Supabase Storage pricing (as of 2024):
- **Free tier**: 1GB storage, 2GB bandwidth
- **Pro**: $25/month includes 100GB storage, 200GB bandwidth
- **Additional**: $0.021/GB storage, $0.09/GB bandwidth

**Estimated costs for EventMap:**
- 1000 events × 500KB avg = 500MB storage
- 10,000 views/month × 500KB = 5GB bandwidth
- **Cost**: Free tier sufficient, or ~$2/month on Pro

## Option 2: AWS S3 (Alternative)

### Setup Steps

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://eventmap-images --region us-east-1
   ```

2. **Configure CORS**
   ```json
   {
     "CORSRules": [{
       "AllowedOrigins": ["https://yourdomain.com"],
       "AllowedMethods": ["GET", "PUT", "POST"],
       "AllowedHeaders": ["*"]
     }]
   }
   ```

3. **Create IAM User with S3 permissions**
   - Policy: `AmazonS3FullAccess` (or custom policy)
   - Get Access Key ID and Secret Access Key

4. **Update `.env`**
   ```bash
   VITE_AWS_S3_BUCKET=eventmap-images
   VITE_AWS_REGION=us-east-1
   VITE_AWS_ACCESS_KEY_ID=your_key
   VITE_AWS_SECRET_ACCESS_KEY=your_secret
   ```

5. **Install AWS SDK**
   ```bash
   npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
   ```

6. **Update `src/lib/storage.ts`** to use S3 SDK instead of Supabase

### S3 Pricing
- **Storage**: $0.023/GB/month
- **Requests**: $0.005 per 1000 PUT, $0.0004 per 1000 GET
- **Bandwidth**: $0.09/GB out (first 1GB free)

## Option 3: Cloudflare R2 (Zero Egress Fees)

### Setup Steps

1. **Create R2 Bucket**
   - Go to Cloudflare Dashboard > R2
   - Click "Create bucket"
   - Name: `eventmap-images`
   - Location: Automatic

2. **Enable Public Access**
   - Go to bucket settings
   - Enable "Public access"
   - Note the public URL

3. **Create API Token**
   - Go to R2 > Manage R2 API Tokens
   - Create token with "Object Read & Write" permissions
   - Save Access Key ID and Secret Access Key

4. **Update `.env`**
   ```bash
   VITE_R2_ACCOUNT_ID=your_account_id
   VITE_R2_ACCESS_KEY_ID=your_key
   VITE_R2_SECRET_ACCESS_KEY=your_secret
   VITE_R2_BUCKET=eventmap-images
   ```

5. **Install S3-compatible SDK**
   ```bash
   npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
   ```

6. **Update storage.ts** with R2 endpoint:
   ```typescript
   const endpoint = `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`
   ```

### R2 Pricing (Best for High Traffic)
- **Storage**: $0.015/GB/month (cheaper than S3)
- **Operations**: $4.50 per million Class A (write), $0.36 per million Class B (read)
- **Egress**: **FREE** (major advantage over S3)

**Estimated costs:**
- 10GB storage + 1M views/month = ~$0.15 + $0.36 = $0.51/month

## Image Optimization Details

### Client-Side Optimization (Before Upload)

The app automatically:
1. **Resizes** images if width > 1920px
2. **Compresses** to 85% quality JPEG
3. **Converts** formats to JPEG for consistency

Example: 5MB PNG → Optimized → ~800KB JPEG

### Implementation

```typescript
// In src/lib/storage.ts
export async function optimizeImage(file: File, maxWidth: number = 1920): Promise<File> {
  // Creates canvas, resizes, compresses, returns optimized File
}
```

### Benefits
- **Faster uploads**: Smaller files upload quicker
- **Lower bandwidth costs**: Save on egress fees
- **Better UX**: Faster page loads with smaller images
- **Storage savings**: 5-10x reduction in storage needs

## Presigned URLs (Direct Upload)

### How It Works

1. **Client** requests presigned URL from backend
2. **Backend** generates signed URL (valid 60 seconds)
3. **Client** uploads directly to storage (S3/R2/Supabase)
4. **Storage** validates signature and accepts upload
5. **Client** receives public URL

### Benefits
- ✅ Bypasses backend (reduces server load)
- ✅ Faster uploads (direct to CDN)
- ✅ Scalable (no backend bottleneck)
- ✅ Secure (temporary signed URLs)

### Usage

```typescript
// Get presigned URL
const { url, path } = await getPresignedUploadUrl(filename, userId);

// Upload directly to storage
const result = await uploadViaPresignedUrl(file, url);

console.log(result.url); // Public URL
```

## Security Best Practices

### 1. Row Level Security (RLS)

Ensure users can only:
- Upload to their own folder (`{user_id}/...`)
- Read all public images
- Delete only their own images

```sql
-- Example RLS policy
CREATE POLICY "Users can only upload to own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### 2. File Validation

Always validate:
- ✅ File size (max 5MB)
- ✅ File type (JPEG, PNG, WEBP only)
- ✅ Image dimensions (reject suspicious dimensions)
- ✅ File content (check magic bytes, not just extension)

### 3. Rate Limiting

Limit uploads per user:
- Max 10 uploads per hour
- Max 50 uploads per day
- Combine with event creation rate limits

### 4. Malware Scanning (Production)

For production, consider:
- **ClamAV** for virus scanning
- **AWS Macie** for sensitive data detection
- **Cloudflare R2 + Workers** for automatic scanning

### 5. HTTPS Only

Always use HTTPS for uploads:
- Prevents man-in-the-middle attacks
- Required for presigned URLs
- Encrypts upload traffic

## Storage Organization

### Folder Structure

```
event-images/
├── user-{uuid-1}/
│   ├── 1699123456789-a1b2c3.jpg
│   ├── 1699123567890-d4e5f6.jpg
│   └── 1699123678901-g7h8i9.jpg
├── user-{uuid-2}/
│   └── 1699123789012-j0k1l2.jpg
└── ...
```

### Benefits
- Easy to find user's images
- Simplifies quota tracking
- Enables bulk deletion per user
- RLS policies based on folder name

## Cleanup & Maintenance

### Delete Orphaned Images

Images not linked to any event:

```typescript
// Find images in storage
const { data: files } = await supabase.storage.from('event-images').list();

// Find images in database
const { data: events } = await supabase.from('events').select('image_url');

// Delete orphans
const orphans = files.filter(file => !events.find(e => e.image_url.includes(file.name)));
for (const orphan of orphans) {
  await deleteImageFromSupabase(orphan.name);
}
```

### Scheduled Cleanup (Cron)

Run weekly via Supabase Edge Function or GitHub Actions:

```typescript
// supabase/functions/cleanup-images/index.ts
Deno.cron("cleanup-images", "0 0 * * 0", async () => {
  // Delete images older than 90 days with no linked events
  // Log cleanup stats
});
```

## Monitoring & Analytics

### Track Storage Usage

```sql
-- Total storage per user
SELECT
  (storage.foldername(name))[1] as user_id,
  COUNT(*) as file_count,
  SUM(metadata->>'size')::bigint as total_bytes
FROM storage.objects
WHERE bucket_id = 'event-images'
GROUP BY user_id;
```

### Monitor Upload Success Rate

```typescript
// Track in application
let uploadAttempts = 0;
let uploadSuccesses = 0;

// After each upload
uploadAttempts++;
if (result.success) uploadSuccesses++;

console.log(`Success rate: ${(uploadSuccesses/uploadAttempts*100).toFixed(1)}%`);
```

## Testing Checklist

- [ ] Upload JPEG image (should succeed)
- [ ] Upload PNG image (should succeed & convert to JPEG)
- [ ] Upload WEBP image (should succeed)
- [ ] Upload 10MB image (should fail - too large)
- [ ] Upload PDF file (should fail - wrong type)
- [ ] Upload image without auth (should fail)
- [ ] Upload to another user's folder (should fail)
- [ ] View image URL in browser (should work - public read)
- [ ] Delete own image (should succeed)
- [ ] Delete another user's image (should fail)

## Troubleshooting

### Upload Fails: "Invalid file size"

**Cause**: File exceeds 5MB limit

**Solution**:
1. Check file size before upload
2. Image optimization should prevent this
3. If optimization fails, show error to user

### Upload Fails: "Invalid file type"

**Cause**: File is not JPEG/PNG/WEBP

**Solution**:
1. Check MIME type: `file.type`
2. Update validation in `storage.ts`
3. Update allowed types in Supabase bucket settings

### Upload Succeeds but Image Not Visible

**Cause**: RLS policy blocking public read

**Solution**:
1. Check bucket is marked as "public"
2. Verify public read policy exists
3. Test public URL in incognito window

### "RLS policy violation" Error

**Cause**: User trying to upload to wrong folder

**Solution**:
1. Ensure folder name = user ID: `${userId}/...`
2. Check user is authenticated
3. Verify RLS policies in Supabase Dashboard

### Images Loading Slowly

**Cause**: Not using CDN, large file sizes

**Solution**:
1. Enable Supabase CDN (automatic)
2. Verify image optimization is working
3. Consider using `srcset` for responsive images
4. Add lazy loading: `loading="lazy"`

## Next Steps

1. ✅ **Implement CDN caching**
   - Supabase Storage includes CDN
   - Add `Cache-Control` headers

2. **Add image transformation**
   - Generate thumbnails (200x200)
   - Create multiple sizes for responsive images
   - Use Supabase Image Transformation API

3. **Implement soft delete**
   - Don't immediately delete images
   - Keep for 30 days in "trash"
   - Allow restoration

4. **Add WebP conversion**
   - Convert all uploads to WebP (better compression)
   - Fallback to JPEG for older browsers

5. **Monitor costs**
   - Set up billing alerts
   - Track storage growth
   - Optimize for cost efficiency

## Production Deployment

### Environment Variables

Ensure these are set in production:

```bash
# Supabase (Option 1)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...

# AWS S3 (Option 2)
VITE_AWS_S3_BUCKET=eventmap-images
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=AKIA...
VITE_AWS_SECRET_ACCESS_KEY=xxx

# Cloudflare R2 (Option 3)
VITE_R2_ACCOUNT_ID=xxx
VITE_R2_BUCKET=eventmap-images
VITE_R2_ACCESS_KEY_ID=xxx
VITE_R2_SECRET_ACCESS_KEY=xxx
```

### Security Headers

Add to your hosting provider:

```
Content-Security-Policy: img-src 'self' https://*.supabase.co https://*.amazonaws.com https://*.r2.cloudflarestorage.com;
X-Content-Type-Options: nosniff
```

### Final Checks

- [ ] RLS policies enabled
- [ ] File size limits configured
- [ ] MIME type restrictions active
- [ ] Public read access working
- [ ] Upload rate limiting active
- [ ] Storage monitoring set up
- [ ] Backup strategy defined
- [ ] CDN caching enabled
- [ ] HTTPS enforced
- [ ] Error logging active

## Support

For issues with:
- **Supabase**: https://supabase.com/docs/guides/storage
- **AWS S3**: https://docs.aws.amazon.com/s3/
- **Cloudflare R2**: https://developers.cloudflare.com/r2/
