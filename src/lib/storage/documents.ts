import { supabase } from '../../supabase'

const BUCKET_NAME = 'employee-documents'
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png']

/**
 * Generate a unique filename using UUID
 */
function generateFilename(originalFilename: string): string {
  const uuid = crypto.randomUUID()
  // Sanitize original filename
  const sanitized = originalFilename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .substring(0, 100) // Limit length
  const extension = originalFilename.substring(originalFilename.lastIndexOf('.'))
  return `${uuid}-${sanitized}${extension}`
}

/**
 * Validate file before upload
 */
function validateFile(file: File, allowedTypes: string[]): void {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`)
  }
}

/**
 * Ensure the storage bucket exists
 */
async function ensureBucketExists(): Promise<void> {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()

  if (listError) {
    throw new Error(`Failed to list buckets: ${listError.message}`)
  }

  const bucketExists = buckets?.some((b) => b.name === BUCKET_NAME)

  if (!bucketExists) {
    // Note: Bucket creation typically requires admin privileges
    // In production, create the bucket via Supabase dashboard or CLI
    console.warn(`Bucket ${BUCKET_NAME} does not exist. Please create it via Supabase dashboard.`)
  }
}

/**
 * Upload employee photo
 */
export async function uploadPhoto(employeeId: string, file: File): Promise<string> {
  validateFile(file, ALLOWED_IMAGE_TYPES)

  await ensureBucketExists()

  const filename = generateFilename(file.name)
  const filePath = `${employeeId}/photos/${filename}`

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    throw new Error(`Failed to upload photo: ${error.message}`)
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

  return publicUrl
}

/**
 * Upload employee document
 */
export async function uploadDocument(
  employeeId: string,
  file: File,
  category: 'ID' | 'Contract' | 'Certificate'
): Promise<string> {
  validateFile(file, ALLOWED_DOCUMENT_TYPES)

  await ensureBucketExists()

  const filename = generateFilename(file.name)
  const filePath = `${employeeId}/documents/${category}/${filename}`

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    throw new Error(`Failed to upload document: ${error.message}`)
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

  return publicUrl
}

/**
 * Delete a document from storage
 */
export async function deleteDocument(url: string): Promise<void> {
  try {
    // Extract file path from URL
    // URL format: https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const bucketIndex = pathParts.indexOf('public')
    if (bucketIndex === -1 || bucketIndex === pathParts.length - 1) {
      throw new Error('Invalid storage URL format')
    }

    const filePath = pathParts.slice(bucketIndex + 2).join('/') // Skip 'public' and bucket name

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath])

    if (error) {
      throw new Error(`Failed to delete document: ${error.message}`)
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes('Invalid storage URL')) {
      throw err
    }
    // If URL parsing fails, try to extract path differently
    const match = url.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/)
    if (match) {
      const filePath = match[1]
      const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath])
      if (error) {
        throw new Error(`Failed to delete document: ${error.message}`)
      }
    } else {
      throw new Error('Invalid storage URL format')
    }
  }
}

/**
 * Get public URL for a document
 */
export function getDocumentUrl(filePath: string): string {
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)
  return publicUrl
}

/**
 * Extract file path from a Supabase storage URL
 */
function extractFilePathFromUrl(url: string): string | null {
  try {
    // Handle blob URLs (for pending uploads) - return null to indicate it's not a storage URL
    if (url.startsWith('blob:')) {
      return null
    }

    // Handle public URL format: https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
    const publicMatch = url.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/)
    if (publicMatch) {
      return publicMatch[1]
    }

    // Handle signed URL format: https://{project}.supabase.co/storage/v1/object/sign/{bucket}/{path}?...
    const signedMatch = url.match(/\/storage\/v1\/object\/sign\/[^/]+\/(.+?)(?:\?|$)/)
    if (signedMatch) {
      return signedMatch[1]
    }

    // Try parsing as URL and extracting path
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const bucketIndex = pathParts.findIndex(part => part === 'public' || part === 'sign')
    if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
      return pathParts.slice(bucketIndex + 2).join('/')
    }

    return null
  } catch {
    return null
  }
}

/**
 * Get signed URL for a document from a storage URL
 * Returns the original URL if it's a blob URL or if path extraction fails
 */
export async function getSignedDocumentUrl(url: string, expireIn: number = 3600): Promise<string> {
  // If it's a blob URL (pending upload), return it as-is
  if (url.startsWith('blob:')) {
    return url
  }

  // Extract file path from URL
  const filePath = extractFilePathFromUrl(url)
  if (!filePath) {
    // If we can't extract the path, return the original URL
    // This handles edge cases where the URL format is unexpected
    console.warn('Could not extract file path from URL:', url)
    return url
  }

  // Generate signed URL
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, expireIn)

  if (error) {
    console.error('Failed to create signed URL:', error)
    throw new Error(`Failed to generate document URL: ${error.message}`)
  }

  if (!data?.signedUrl) {
    throw new Error('Failed to generate document URL: No signed URL returned')
  }

  return data.signedUrl
}

/**
 * Get signed URL for a photo from a storage URL
 * Returns the original URL if it's a blob URL or if path extraction fails
 */
export async function getSignedPhotoUrl(url: string | null, expireIn: number = 3600): Promise<string | null> {
  if (!url) {
    return null
  }

  // If it's a blob URL (pending upload), return it as-is
  if (url.startsWith('blob:')) {
    return url
  }

  // Extract file path from URL
  const filePath = extractFilePathFromUrl(url)
  if (!filePath) {
    // If we can't extract the path, return the original URL
    // This handles edge cases where the URL format is unexpected
    console.warn('Could not extract file path from URL:', url)
    return url
  }

  // Generate signed URL
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, expireIn)

  if (error) {
    console.error('Failed to create signed URL:', error)
    throw new Error(`Failed to generate photo URL: ${error.message}`)
  }

  if (!data?.signedUrl) {
    throw new Error('Failed to generate photo URL: No signed URL returned')
  }

  return data.signedUrl
}

/**
 * Download a document with a custom filename
 */
export async function downloadDocument(url: string, filename: string): Promise<void> {
  const signedUrl = await getSignedDocumentUrl(url)
  const response = await fetch(signedUrl)
  
  if (!response.ok) {
    throw new Error(`Failed to download document: ${response.statusText}`)
  }
  
  const blob = await response.blob()
  const blobUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = blobUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(blobUrl)
}
