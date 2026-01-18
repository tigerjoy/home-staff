import { supabase } from '../supabase/client'
import type { Document } from '../../types'

const BUCKET_NAME = 'employee-documents'

// Signed URLs expire after 1 year (31536000 seconds)
const SIGNED_URL_EXPIRY = 31536000

/**
 * Upload a document file to Supabase Storage
 * @returns Signed URL of the uploaded file
 */
export async function uploadDocument(
  file: File,
  employeeId: number,
  category: Document['category']
): Promise<string> {
  // Create file path: employees/{employeeId}/documents/{category}/{filename}
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `employees/${employeeId}/documents/${category}/${fileName}`

  // Upload file
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new Error(`Failed to upload document: ${error.message}`)
  }

  // Get signed URL
  const { data: signedUrlData, error: urlError } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, SIGNED_URL_EXPIRY)

  if (urlError || !signedUrlData) {
    throw new Error(`Failed to create signed URL: ${urlError?.message}`)
  }

  return signedUrlData.signedUrl
}

/**
 * Upload an employee photo
 * @returns Signed URL of the uploaded photo
 */
export async function uploadPhoto(file: File, employeeId: number): Promise<string> {
  // Create file path: employees/{employeeId}/photo.{ext}
  const fileExt = file.name.split('.').pop() || 'jpg'
  const filePath = `employees/${employeeId}/photo.${fileExt}`

  // Upload file (overwrite existing photo)
  const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
    cacheControl: '3600',
    upsert: true,
  })

  if (error) {
    throw new Error(`Failed to upload photo: ${error.message}`)
  }

  // Get signed URL
  const { data: signedUrlData, error: urlError } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, SIGNED_URL_EXPIRY)

  if (urlError || !signedUrlData) {
    throw new Error(`Failed to create signed URL: ${urlError?.message}`)
  }

  return signedUrlData.signedUrl
}

/**
 * Delete a document from Supabase Storage
 * @param url - Signed URL or file path
 */
export async function deleteDocument(url: string): Promise<void> {
  // Extract file path from URL
  // Signed URL format: https://{project}.supabase.co/storage/v1/object/sign/{bucket}/{path}?token=...
  // Try to extract path from signed URL or treat as direct path
  let filePath: string

  if (url.includes('/storage/v1/object/sign/')) {
    // Extract from signed URL
    const urlParts = url.split('/storage/v1/object/sign/')
    if (urlParts.length !== 2) {
      throw new Error('Invalid signed URL format')
    }
    const pathAndToken = urlParts[1].split('?')[0]
    const pathParts = pathAndToken.split('/')
    if (pathParts[0] !== BUCKET_NAME) {
      throw new Error('Invalid bucket name in URL')
    }
    filePath = pathParts.slice(1).join('/')
  } else if (url.includes('/storage/v1/object/public/')) {
    // Legacy public URL format
    const urlParts = url.split('/storage/v1/object/public/')
    if (urlParts.length !== 2) {
      throw new Error('Invalid document URL')
    }
    const pathParts = urlParts[1].split('/')
    if (pathParts[0] !== BUCKET_NAME) {
      throw new Error('Invalid bucket name')
    }
    filePath = pathParts.slice(1).join('/')
  } else {
    // Assume it's already a file path
    filePath = url
  }

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath])

  if (error) {
    throw new Error(`Failed to delete document: ${error.message}`)
  }
}

/**
 * Get a signed URL for an existing file path
 * Useful for regenerating expired signed URLs
 * @param filePath - Path to the file in storage
 * @param expiresIn - Expiration time in seconds (default: 1 year)
 * @returns Signed URL
 */
export async function getSignedUrl(filePath: string, expiresIn: number = SIGNED_URL_EXPIRY): Promise<string> {
  const { data: signedUrlData, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, expiresIn)

  if (error || !signedUrlData) {
    throw new Error(`Failed to create signed URL: ${error?.message}`)
  }

  return signedUrlData.signedUrl
}
