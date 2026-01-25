import { useState } from 'react'
import { Upload, FileText, Trash2, Eye, X, File, FileCheck, FileBadge, Loader2, Edit2 } from 'lucide-react'
import type { UIEmployee, Document } from '../../types'
import { uploadDocument, getSignedDocumentUrl } from '../../lib/storage/documents'

interface DocumentsStepProps {
  data: Omit<UIEmployee, 'id' | 'householdId' | 'status' | 'holidayBalance'>
  onChange: (updates: Partial<Omit<UIEmployee, 'id' | 'householdId' | 'status' | 'holidayBalance'>>) => void
  employeeId?: string // Optional: if provided, upload immediately; otherwise store files for later upload
  onFilesChange?: (files: Map<string, { file: File; category: Document['category'] }>) => void // Callback to store File objects for later upload
  onDocumentUploaded?: (documents: Document[]) => Promise<void> // Callback to persist documents to database immediately
  onRenameDocument?: (documentUrl: string, newName: string) => Promise<void> // Callback to rename document
}

const DOCUMENT_CATEGORIES: { value: Document['category']; label: string; icon: typeof FileText; color: string }[] = [
  { value: 'ID', label: 'ID Proof', icon: FileBadge, color: 'blue' },
  { value: 'Contract', label: 'Contract', icon: FileCheck, color: 'green' },
  { value: 'Certificate', label: 'Certificate', icon: File, color: 'purple' },
]

export function DocumentsStep({ data, onChange, employeeId, onFilesChange, onDocumentUploaded, onRenameDocument }: DocumentsStepProps) {
  const [selectedCategory, setSelectedCategory] = useState<Document['category']>('ID')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadErrors, setUploadErrors] = useState<string[]>([])
  const [pendingFiles, setPendingFiles] = useState<Map<string, { file: File; category: Document['category'] }>>(new Map())
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [renamingDoc, setRenamingDoc] = useState<{ url: string; currentName: string } | null>(null)
  const [newDocName, setNewDocName] = useState('')

  const processFiles = async (files: FileList | File[]) => {
    if (!files?.length) return

    setUploading(true)
    setUploadErrors([])
    const today = new Date().toISOString().split('T')[0]
    const newDocuments: Document[] = []
    const errors: string[] = []
    const newPendingFiles = new Map(pendingFiles)

    // Validate file types
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']
    const validFiles = Array.from(files).filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase()
      return allowedExtensions.includes(extension)
    })

    if (validFiles.length === 0) {
      setUploadErrors(['Please upload files with valid extensions: PDF, JPG, PNG, DOC, DOCX'])
      setUploading(false)
      return
    }

    // If we have an employeeId, upload immediately to storage
    // Otherwise, store files for later upload
    if (employeeId) {
      // Upload each file to Supabase Storage
      for (const file of validFiles) {
        try {
          const url = await uploadDocument(employeeId, file, selectedCategory)
          newDocuments.push({
            name: file.name,
            url,
            category: selectedCategory,
            uploadedAt: today,
          })
        } catch (error) {
          console.error('Error uploading document:', error)
          errors.push(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }

      // Immediately persist to database if callback is provided
      if (newDocuments.length > 0 && onDocumentUploaded) {
        try {
          await onDocumentUploaded(newDocuments)
        } catch (error) {
          console.error('Error persisting documents to database:', error)
          errors.push('Failed to save documents to database')
        }
      }
    } else {
      // For new employees, create temporary blob URLs and store File objects
      validFiles.forEach(file => {
        const blobUrl = URL.createObjectURL(file)
        newDocuments.push({
          name: file.name,
          url: blobUrl, // Temporary blob URL
          category: selectedCategory,
          uploadedAt: today,
        })
        // Store File object for later upload
        newPendingFiles.set(blobUrl, { file, category: selectedCategory })
      })
      setPendingFiles(newPendingFiles)
      // Notify parent component about pending files
      onFilesChange?.(newPendingFiles)
    }

    if (newDocuments.length > 0) {
      onChange({ documents: [...data.documents, ...newDocuments] })
    }

    if (errors.length > 0) {
      setUploadErrors(errors)
    }

    setUploading(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    await processFiles(files)
    e.target.value = '' // Reset input
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files?.length) {
      await processFiles(files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    // Only set dragging to false if we're leaving the drop zone itself
    // (not just moving to a child element)
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragging(false)
    }
  }

  const removeDocument = (index: number) => {
    const doc = data.documents[index]
    // If it's a blob URL, remove from pending files
    if (doc.url.startsWith('blob:')) {
      const newPendingFiles = new Map(pendingFiles)
      newPendingFiles.delete(doc.url)
      setPendingFiles(newPendingFiles)
      onFilesChange?.(newPendingFiles)
      // Revoke blob URL to free memory
      URL.revokeObjectURL(doc.url)
    }
    onChange({ documents: data.documents.filter((_, i) => i !== index) })
  }

  const handleRenameDocument = async () => {
    if (!renamingDoc || !newDocName.trim()) return

    try {
      if (onRenameDocument) {
        // For existing employees, call API to update database
        await onRenameDocument(renamingDoc.url, newDocName.trim())
      } else {
        // For new employees, just update local state
        const updatedDocuments = data.documents.map(doc =>
          doc.url === renamingDoc.url ? { ...doc, name: newDocName.trim() } : doc
        )
        onChange({ documents: updatedDocuments })
      }
      setRenamingDoc(null)
      setNewDocName('')
    } catch (error) {
      console.error('Error renaming document:', error)
      // Error handling is done by the parent component
    }
  }

  const getCategoryStyle = (category: Document['category']) => {
    switch (category) {
      case 'ID':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case 'Contract':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      case 'Certificate':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
      default:
        return 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
    }
  }

  const getCategoryIcon = (category: Document['category']) => {
    const cat = DOCUMENT_CATEGORIES.find(c => c.value === category)
    return cat?.icon || FileText
  }

  const groupedDocuments = data.documents.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = []
    acc[doc.category].push(doc)
    return acc
  }, {} as Record<Document['category'], Document[]>)

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          Documents
        </h2>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Upload and organize ID proofs, contracts, and certificates
        </p>
      </div>

      {/* Upload Area */}
      <div className={`p-6 rounded-2xl border-2 border-dashed transition-all ${
        isDragging
          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
          : 'border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/30'
      }`}>
        {/* Category Selection */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {DOCUMENT_CATEGORIES.map(cat => {
            const Icon = cat.icon
            const isSelected = selectedCategory === cat.value
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${isSelected
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-700'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Drop Zone */}
        <label
          className={`block cursor-pointer group ${uploading ? 'opacity-50 cursor-wait' : ''}`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            multiple
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          <div className="py-8 flex flex-col items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all ${
              isDragging
                ? 'bg-amber-200 dark:bg-amber-900/50 scale-110'
                : 'bg-amber-100 dark:bg-amber-900/30'
            }`}>
              {uploading ? (
                <Loader2 className="w-8 h-8 text-amber-600 dark:text-amber-400 animate-spin" />
              ) : (
                <Upload className={`w-8 h-8 ${
                  isDragging
                    ? 'text-amber-700 dark:text-amber-300'
                    : 'text-amber-600 dark:text-amber-400'
                }`} />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                {uploading ? 'Uploading...' : isDragging ? 'Drop to upload' : 'Click to upload or drag and drop'}
              </p>
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                PDF, JPG, PNG, DOC up to 10MB each
              </p>
            </div>
          </div>
        </label>
        
        {/* Upload Errors */}
        {uploadErrors.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
            {uploadErrors.map((error, idx) => (
              <p key={idx} className="text-sm text-red-600 dark:text-red-400">{error}</p>
            ))}
          </div>
        )}
      </div>

      {/* Document List */}
      {data.documents.length > 0 ? (
        <div className="space-y-6">
          {DOCUMENT_CATEGORIES.map(category => {
            const docs = groupedDocuments[category.value] || []
            if (docs.length === 0) return null

            const Icon = category.icon

            return (
              <div key={category.value}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-1.5 rounded-lg ${getCategoryStyle(category.value)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    {category.label}s ({docs.length})
                  </h3>
                </div>

                <div className="space-y-2">
                  {docs.map((doc, idx) => {
                    const originalIndex = data.documents.findIndex(d => d === doc)
                    const DocIcon = getCategoryIcon(doc.category)

                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 group hover:border-amber-300 dark:hover:border-amber-700 transition-colors"
                      >
                        {/* Icon */}
                        <div className={`p-2 rounded-lg ${getCategoryStyle(doc.category)}`}>
                          <DocIcon className="w-5 h-5" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                            {doc.name}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-stone-400">
                            Uploaded {new Date(doc.uploadedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={async () => {
                              setPreviewLoading(true)
                              setPreviewError(null)
                              try {
                                const signedUrl = await getSignedDocumentUrl(doc.url)
                                setPreviewUrl(signedUrl)
                              } catch (error) {
                                console.error('Error generating signed URL:', error)
                                setPreviewError(error instanceof Error ? error.message : 'Failed to load document preview')
                              } finally {
                                setPreviewLoading(false)
                              }
                            }}
                            disabled={previewLoading}
                            className="p-2 rounded-lg text-stone-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Preview"
                          >
                            {previewLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRenamingDoc({ url: doc.url, currentName: doc.name })
                              setNewDocName(doc.name)
                            }}
                            className="p-2 rounded-lg text-stone-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors"
                            title="Rename"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeDocument(originalIndex)}
                            className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="p-6 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-center">
          <FileText className="w-10 h-10 mx-auto text-stone-300 dark:text-stone-600 mb-3" />
          <p className="text-sm text-stone-500 dark:text-stone-400">
            No documents uploaded yet
          </p>
          <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
            Documents are optional but recommended for record-keeping
          </p>
        </div>
      )}

      {/* Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700">
              <h3 className="font-medium text-stone-900 dark:text-stone-100">
                Document Preview
              </h3>
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl(null)
                  setPreviewError(null)
                }}
                className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>
            <div className="p-4 max-h-[calc(90vh-80px)] overflow-auto">
              {previewError ? (
                <div className="p-6 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-center">
                  <p className="text-sm text-red-600 dark:text-red-400">{previewError}</p>
                </div>
              ) : previewUrl ? (
                previewUrl.endsWith('.pdf') || previewUrl.includes('.pdf') ? (
                  <iframe
                    src={previewUrl}
                    className="w-full h-[600px] rounded-lg"
                    title="Document preview"
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Document preview"
                    className="max-w-full h-auto mx-auto rounded-lg"
                    onError={() => setPreviewError('Failed to load document image')}
                  />
                )
              ) : (
                <div className="flex items-center justify-center h-[600px]">
                  <Loader2 className="w-8 h-8 text-stone-400 animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rename Document Modal */}
      {renamingDoc && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-sm"
            onClick={() => {
              setRenamingDoc(null)
              setNewDocName('')
            }}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
                Rename Document
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Document Name
                  </label>
                  <input
                    type="text"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    placeholder="Enter document name"
                    className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newDocName.trim()) {
                        handleRenameDocument()
                      } else if (e.key === 'Escape') {
                        setRenamingDoc(null)
                        setNewDocName('')
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setRenamingDoc(null)
                    setNewDocName('')
                  }}
                  className="px-4 py-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRenameDocument}
                  disabled={!newDocName.trim()}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
                >
                  Rename
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Info Note */}
      <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
        <p className="text-sm text-stone-600 dark:text-stone-400">
          <strong className="text-stone-900 dark:text-stone-100">Tip:</strong>{' '}
          Upload important documents like Aadhaar cards, PAN cards, employment contracts,
          police verification certificates, and training certifications for easy reference.
        </p>
      </div>
    </div>
  )
}
