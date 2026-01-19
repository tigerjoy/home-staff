import { useState } from 'react'
import { Upload, FileText, Trash2, Eye, X, File, FileCheck, FileBadge } from 'lucide-react'
import type { Employee, Document } from '@/../product/sections/staff-directory/types'

interface DocumentsStepProps {
  data: Omit<Employee, 'id'>
  onChange: (updates: Partial<Omit<Employee, 'id'>>) => void
}

const DOCUMENT_CATEGORIES: { value: Document['category']; label: string; icon: typeof FileText; color: string }[] = [
  { value: 'ID', label: 'ID Proof', icon: FileBadge, color: 'blue' },
  { value: 'Contract', label: 'Contract', icon: FileCheck, color: 'green' },
  { value: 'Certificate', label: 'Certificate', icon: File, color: 'purple' },
]

export function DocumentsStep({ data, onChange }: DocumentsStepProps) {
  const [selectedCategory, setSelectedCategory] = useState<Document['category']>('ID')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    const newDocuments: Document[] = []
    const today = new Date().toISOString().split('T')[0]

    Array.from(files).forEach(file => {
      // In a real app, you'd upload to a server and get a URL
      // For demo, we'll use a fake URL
      newDocuments.push({
        name: file.name,
        url: URL.createObjectURL(file),
        category: selectedCategory,
        uploadedAt: today,
      })
    })

    onChange({ documents: [...data.documents, ...newDocuments] })
    e.target.value = '' // Reset input
  }

  const removeDocument = (index: number) => {
    onChange({ documents: data.documents.filter((_, i) => i !== index) })
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
      <div className="p-6 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/30">
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
        <label className="block cursor-pointer group">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="py-8 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Click to upload or drag and drop
              </p>
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                PDF, JPG, PNG, DOC up to 10MB each
              </p>
            </div>
          </div>
        </label>
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
                            onClick={() => setPreviewUrl(doc.url)}
                            className="p-2 rounded-lg text-stone-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
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
                onClick={() => setPreviewUrl(null)}
                className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>
            <div className="p-4 max-h-[calc(90vh-80px)] overflow-auto">
              {previewUrl.endsWith('.pdf') ? (
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
                />
              )}
            </div>
          </div>
        </div>
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
