import { useState } from 'react'
import {
  X,
  Upload,
  FileText,
  ImageIcon,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  ExternalLink
} from 'lucide-react'
import type { PaymentReceipt } from '../types'

// =============================================================================
// Receipt Upload Button
// =============================================================================

interface ReceiptUploadButtonProps {
  onUpload?: (file: File) => void
  variant?: 'default' | 'compact'
  disabled?: boolean
}

export function ReceiptUploadButton({
  onUpload,
  variant = 'default',
  disabled = false
}: ReceiptUploadButtonProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      onUpload?.(file)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpload?.(file)
    }
  }

  if (variant === 'compact') {
    return (
      <label className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors
        ${disabled
          ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
        }
      `}>
        <Upload className="w-3.5 h-3.5" />
        Upload
        <input
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          disabled={disabled}
          onChange={handleChange}
        />
      </label>
    )
  }

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`
        relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all
        ${isDragging
          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
          : 'border-stone-300 dark:border-stone-700 hover:border-amber-400 dark:hover:border-amber-600 bg-stone-50 dark:bg-stone-800/50'
        }
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}
      `}
    >
      <div className={`
        p-4 rounded-full mb-4 transition-colors
        ${isDragging ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-stone-100 dark:bg-stone-800'}
      `}>
        <Upload className={`w-6 h-6 ${isDragging ? 'text-amber-600' : 'text-stone-400'}`} />
      </div>
      <p className="text-sm font-medium text-stone-900 dark:text-white mb-1">
        {isDragging ? 'Drop to upload' : 'Drop files here or click to upload'}
      </p>
      <p className="text-xs text-stone-500 dark:text-stone-400">
        PNG, JPG, or PDF up to 10MB
      </p>
      <input
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        disabled={disabled}
        onChange={handleChange}
      />
    </label>
  )
}

// =============================================================================
// Receipt Preview Thumbnail
// =============================================================================

interface ReceiptPreviewProps {
  receipt: PaymentReceipt
  onView?: () => void
  onDelete?: () => void
  showActions?: boolean
}

export function ReceiptPreview({
  receipt,
  onView,
  onDelete,
  showActions = true
}: ReceiptPreviewProps) {
  const isImage = receipt.fileType === 'image'
  const isPdf = receipt.fileType === 'pdf'

  return (
    <div className="group relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
      {/* Thumbnail */}
      {isImage ? (
        <img
          src={receipt.url}
          alt={receipt.fileName}
          className="w-full h-full object-cover"
        />
      ) : isPdf ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10">
          <FileText className="w-8 h-8 text-red-500" />
          <span className="text-[10px] font-semibold text-red-600 mt-1">PDF</span>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-stone-400" />
        </div>
      )}

      {/* Hover Overlay */}
      {showActions && (
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={onView}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            title="View"
          >
            <ZoomIn className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* File Type Badge */}
      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/50 text-[10px] font-medium text-white uppercase">
        {receipt.fileType}
      </div>
    </div>
  )
}

// =============================================================================
// Receipt Gallery Modal
// =============================================================================

interface ReceiptGalleryProps {
  receipts: PaymentReceipt[]
  initialIndex?: number
  transactionReference?: string
  onClose?: () => void
  onDelete?: (receiptId: string) => void
  onUpload?: (file: File) => void
}

export function ReceiptGallery({
  receipts,
  initialIndex = 0,
  transactionReference,
  onClose,
  onDelete,
  onUpload
}: ReceiptGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)

  const currentReceipt = receipts[currentIndex]
  const hasMultiple = receipts.length > 1

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? receipts.length - 1 : prev - 1))
    setZoom(1)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === receipts.length - 1 ? 0 : prev + 1))
    setZoom(1)
  }

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5))

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious()
    if (e.key === 'ArrowRight') goToNext()
    if (e.key === 'Escape') onClose?.()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl mx-4 bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="font-semibold text-stone-900 dark:text-white">
              Payment Receipts
            </h3>
            {transactionReference && (
              <p className="text-sm text-stone-500 dark:text-stone-400">
                {transactionReference}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {receipts.length > 0 && (
              <span className="text-sm text-stone-500 dark:text-stone-400">
                {currentIndex + 1} of {receipts.length}
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {receipts.length === 0 ? (
          <div className="p-8">
            <div className="text-center py-8">
              <ImageIcon className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-stone-900 dark:text-white mb-2">
                No receipts attached
              </h4>
              <p className="text-stone-500 dark:text-stone-400 mb-6">
                Upload a screenshot or PDF as proof of payment
              </p>
              <ReceiptUploadButton onUpload={onUpload} />
            </div>
          </div>
        ) : (
          <>
            {/* Main Viewer */}
            <div className="relative aspect-[4/3] bg-stone-100 dark:bg-stone-950 overflow-hidden">
              {currentReceipt?.fileType === 'image' ? (
                <div
                  className="w-full h-full flex items-center justify-center overflow-auto"
                  style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
                >
                  <img
                    src={currentReceipt.url}
                    alt={currentReceipt.fileName}
                    className="max-w-full max-h-full object-contain transition-transform duration-200"
                    style={{ transform: `scale(${zoom})` }}
                  />
                </div>
              ) : currentReceipt?.fileType === 'pdf' ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <FileText className="w-20 h-20 text-red-500 mb-4" />
                  <p className="text-lg font-medium text-stone-900 dark:text-white mb-2">
                    {currentReceipt.fileName}
                  </p>
                  <a
                    href={currentReceipt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open PDF
                  </a>
                </div>
              ) : null}

              {/* Navigation Arrows */}
              {hasMultiple && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-stone-800/90 hover:bg-white dark:hover:bg-stone-700 rounded-full shadow-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-stone-700 dark:text-stone-300" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-stone-800/90 hover:bg-white dark:hover:bg-stone-700 rounded-full shadow-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-stone-700 dark:text-stone-300" />
                  </button>
                </>
              )}
            </div>

            {/* Footer Toolbar */}
            <div className="flex items-center justify-between p-4 border-t border-stone-200 dark:border-stone-800">
              {/* Zoom Controls (for images) */}
              <div className="flex items-center gap-2">
                {currentReceipt?.fileType === 'image' && (
                  <>
                    <button
                      onClick={handleZoomOut}
                      disabled={zoom <= 0.5}
                      className="p-2 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-stone-500 dark:text-stone-400 min-w-[3rem] text-center">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      onClick={handleZoomIn}
                      disabled={zoom >= 3}
                      className="p-2 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* File Info */}
              <p className="text-sm text-stone-500 dark:text-stone-400 truncate max-w-[200px]">
                {currentReceipt?.fileName}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <a
                  href={currentReceipt?.url}
                  download={currentReceipt?.fileName}
                  className="p-2 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => currentReceipt && onDelete?.(currentReceipt.id)}
                  className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <label className="p-2 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) onUpload?.(file)
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {hasMultiple && (
              <div className="flex items-center gap-2 p-4 pt-0 overflow-x-auto">
                {receipts.map((receipt, index) => (
                  <button
                    key={receipt.id}
                    onClick={() => {
                      setCurrentIndex(index)
                      setZoom(1)
                    }}
                    className={`
                      flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                      ${index === currentIndex
                        ? 'border-amber-500 ring-2 ring-amber-500/20'
                        : 'border-transparent hover:border-stone-300 dark:hover:border-stone-600'
                      }
                    `}
                  >
                    {receipt.fileType === 'image' ? (
                      <img
                        src={receipt.url}
                        alt={receipt.fileName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-red-50 dark:bg-red-900/20">
                        <FileText className="w-6 h-6 text-red-500" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
