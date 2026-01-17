## Supabase Storage best practices

- **Bucket Creation**: Create storage buckets in Supabase Dashboard or via Supabase client - organize buckets by content type (e.g., `avatars`, `documents`, `images`)
- **Access Control Policies**: Set up Storage policies in Supabase Dashboard to control who can read, write, and delete files - use `auth.uid()` for user-specific access
- **Public vs Private Buckets**: Use public buckets for publicly accessible content (e.g., avatars, public images) and private buckets for user-specific files
- **File Upload Patterns**: Use `supabase.storage.from('bucket-name').upload(path, file)` to upload files - always handle upload errors and validate file types/sizes
- **File Download**: Use `supabase.storage.from('bucket-name').download(path)` to download files - create public URLs for public buckets using `.getPublicUrl(path)`
- **File Organization**: Use structured path patterns (e.g., `user-{id}/{filename}` or `{date}/{filename}`) to organize files in buckets
- **Image Optimization**: Leverage Supabase Storage CDN and image transformation features for optimized image delivery
- **File Size Limits**: Be aware of file size limits (varies by plan) - use resumable uploads for large files via `supabase.storage.from().upload()` with appropriate options
- **File Metadata**: Store additional file metadata in your database tables linked to storage paths - maintain referential integrity
- **Error Handling**: Always handle storage errors (file too large, invalid type, permission denied) with user-friendly error messages
- **Progress Tracking**: Implement upload progress tracking for better UX - use browser File API for client-side uploads
- **Cleanup**: Implement cleanup logic to delete orphaned files when database records are deleted - use database triggers or application logic
- **Signed URLs**: Use `supabase.storage.from().createSignedUrl()` for time-limited access to private files
- **File Validation**: Validate file types, sizes, and names on both client and server side before upload
