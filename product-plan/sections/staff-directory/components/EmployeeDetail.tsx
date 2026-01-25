import { useState } from 'react'
import { ArrowLeft, Pencil, Archive, Phone, MapPin, Briefcase, Calendar, Wallet, FileText, Plus, Trash2, ExternalLink, Clock, Tag, StickyNote, X, Upload, Palmtree } from 'lucide-react'
import type { EmployeeDetailProps, Document as DocType } from '../types'

export function EmployeeDetail({
  employee,
  onEdit,
  onArchive,
  onBack,
  onUploadDocument,
  onDeleteDocument,
  onAddCustomProperty,
  onRemoveCustomProperty,
  onAddNote,
  onDeleteNote
}: EmployeeDetailProps) {
  const [showAddNote, setShowAddNote] = useState(false)
  const [newNoteContent, setNewNoteContent] = useState('')
  const [showAddProperty, setShowAddProperty] = useState(false)
  const [newPropertyName, setNewPropertyName] = useState('')
  const [newPropertyValue, setNewPropertyValue] = useState('')
  const [showUploadDoc, setShowUploadDoc] = useState(false)
  const [uploadCategory, setUploadCategory] = useState<DocType['category']>('ID')
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false)

  // Get current role
  const currentRole = (employee.employmentHistory || []).find(e => e.endDate === null)
  // Get current salary
  const currentSalary = (employee.salaryHistory || [])[0]

  // Generate initials
  const initials = employee.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      onAddNote?.(newNoteContent.trim())
      setNewNoteContent('')
      setShowAddNote(false)
    }
  }

  const handleAddProperty = () => {
    if (newPropertyName.trim() && newPropertyValue.trim()) {
      onAddCustomProperty?.({ name: newPropertyName.trim(), value: newPropertyValue.trim() })
      setNewPropertyName('')
      setNewPropertyValue('')
      setShowAddProperty(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUploadDocument?.(file, uploadCategory)
      setShowUploadDoc(false)
    }
  }

  // Group documents by category
  const documentsByCategory = {
    ID: employee.documents.filter(d => d.category === 'ID'),
    Contract: employee.documents.filter(d => d.category === 'Contract'),
    Certificate: employee.documents.filter(d => d.category === 'Certificate')
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-stone-600 dark:text-stone-400" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
            Employee Profile
          </h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden mb-6">
          {/* Banner */}
          <div className="h-24 sm:h-32 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-16">
              {/* Avatar */}
              {employee.photo ? (
                <img
                  src={employee.photo}
                  alt={employee.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 ring-white dark:ring-stone-900 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center ring-4 ring-white dark:ring-stone-900 shadow-lg">
                  <span className="text-3xl sm:text-4xl font-bold text-white">{initials}</span>
                </div>
              )}

              {/* Name & Role */}
              <div className="flex-1 sm:pb-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                    {employee.name}
                  </h2>
                  <span
                    className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${employee.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                      }
                    `}
                  >
                    {employee.status === 'active' ? 'Active' : 'Archived'}
                  </span>
                </div>
                {currentRole && (
                  <p className="text-amber-600 dark:text-amber-400 font-medium mt-1">
                    {currentRole.role} • {currentRole.department}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:pb-2">
                <button
                  onClick={onEdit}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => setShowArchiveConfirm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium rounded-xl transition-colors"
                >
                  <Archive className="w-4 h-4" />
                  {employee.status === 'archived' ? 'Restore' : 'Archive'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <section className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6">
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-amber-500" />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Phone Numbers */}
                <div>
                  <h4 className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3">
                    Phone Numbers
                  </h4>
                  <div className="space-y-2">
                    {employee.phoneNumbers.map((phone, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950">
                          <Phone className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                            {phone.number}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-stone-400">
                            {phone.label}
                          </p>
                        </div>
                      </div>
                    ))}
                    {employee.phoneNumbers.length === 0 && (
                      <p className="text-sm text-stone-500 dark:text-stone-400 italic">
                        No phone numbers added
                      </p>
                    )}
                  </div>
                </div>

                {/* Addresses */}
                <div>
                  <h4 className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3">
                    Addresses
                  </h4>
                  <div className="space-y-3">
                    {employee.addresses.map((addr, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950">
                          <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm text-stone-900 dark:text-stone-100">
                            {addr.address}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-stone-400">
                            {addr.label}
                          </p>
                        </div>
                      </div>
                    ))}
                    {employee.addresses.length === 0 && (
                      <p className="text-sm text-stone-500 dark:text-stone-400 italic">
                        No addresses added
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Employment History */}
            <section className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6">
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-500" />
                Employment History
              </h3>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-stone-200 dark:bg-stone-700" />

                <div className="space-y-4">
                  {(employee.employmentHistory || []).map((record, idx) => (
                    <div key={idx} className="relative flex gap-4">
                      {/* Timeline dot */}
                      <div
                        className={`
                          relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                          ${record.endDate === null
                            ? 'bg-amber-500 text-white'
                            : 'bg-stone-200 dark:bg-stone-700 text-stone-500'
                          }
                        `}
                      >
                        <Briefcase className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-stone-900 dark:text-stone-100">
                            {record.role}
                          </p>
                          {record.endDate === null && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-stone-500 dark:text-stone-400">
                          {record.department}
                        </p>
                        <p className="text-xs text-stone-400 dark:text-stone-500 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(record.startDate)} — {record.endDate ? formatDate(record.endDate) : 'Present'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Salary History */}
            <section className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6">
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-500" />
                Salary History
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-stone-700">
                      <th className="text-left text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider pb-3">
                        Effective Date
                      </th>
                      <th className="text-left text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider pb-3">
                        Amount
                      </th>
                      <th className="text-left text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider pb-3">
                        Payment Method
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {(employee.salaryHistory || []).map((record, idx) => (
                      <tr key={idx}>
                        <td className="py-3 text-sm text-stone-600 dark:text-stone-400">
                          {formatDate(record.effectiveDate)}
                          {idx === 0 && (
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                              Current
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-sm font-semibold text-stone-900 dark:text-stone-100">
                          {formatSalary(record.amount)}
                          <span className="text-xs font-normal text-stone-500">/mo</span>
                        </td>
                        <td className="py-3 text-sm text-stone-600 dark:text-stone-400">
                          {record.paymentMethod}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Documents */}
            <section className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" />
                  Documents
                </h3>
                <button
                  onClick={() => setShowUploadDoc(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950 rounded-lg transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
              </div>

              <div className="space-y-6">
                {(['ID', 'Contract', 'Certificate'] as const).map((category) => (
                  <div key={category}>
                    <h4 className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3">
                      {category === 'ID' ? 'ID Documents' : category + 's'}
                    </h4>
                    {documentsByCategory[category].length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {documentsByCategory[category].map((doc, idx) => (
                          <div
                            key={idx}
                            className="group flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-750 transition-colors"
                          >
                            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                              <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                                {doc.name}
                              </p>
                              <p className="text-xs text-stone-500 dark:text-stone-400">
                                Added {formatDate(doc.uploadedAt)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700"
                              >
                                <ExternalLink className="w-4 h-4 text-stone-500" />
                              </a>
                              <button
                                onClick={() => onDeleteDocument?.(doc.name)}
                                className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-stone-500 dark:text-stone-400 italic">
                        No {category.toLowerCase()} documents
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Holiday Balance Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Palmtree className="w-5 h-5 text-emerald-100" />
                <p className="text-sm text-emerald-100">Holiday Balance</p>
              </div>
              <p className="text-3xl font-bold">{employee.holidayBalance} days</p>
              <p className="text-sm text-emerald-100 mt-1">remaining this year</p>
            </div>

            {/* Current Salary Card */}
            {currentSalary && (
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-5 h-5 text-amber-100" />
                  <p className="text-sm text-amber-100">Current Salary</p>
                </div>
                <p className="text-3xl font-bold">{formatSalary(currentSalary.amount)}</p>
                <p className="text-sm text-amber-100 mt-1">per month • {currentSalary.paymentMethod}</p>
              </div>
            )}

            {/* Custom Properties */}
            <section className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-amber-500" />
                  Custom Fields
                </h3>
                <button
                  onClick={() => setShowAddProperty(true)}
                  className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <Plus className="w-4 h-4 text-stone-500" />
                </button>
              </div>

              <div className="space-y-3">
                {employee.customProperties.map((prop, idx) => (
                  <div
                    key={idx}
                    className="group flex items-start justify-between gap-2 p-3 bg-stone-50 dark:bg-stone-800 rounded-xl"
                  >
                    <div>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{prop.name}</p>
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{prop.value}</p>
                    </div>
                    <button
                      onClick={() => onRemoveCustomProperty?.(prop.name)}
                      className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                ))}
                {employee.customProperties.length === 0 && (
                  <p className="text-sm text-stone-500 dark:text-stone-400 italic text-center py-4">
                    No custom fields added
                  </p>
                )}
              </div>
            </section>

            {/* Notes */}
            <section className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <StickyNote className="w-5 h-5 text-amber-500" />
                  Notes
                </h3>
                <button
                  onClick={() => setShowAddNote(true)}
                  className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <Plus className="w-4 h-4 text-stone-500" />
                </button>
              </div>

              <div className="space-y-3">
                {employee.notes.map((note, idx) => (
                  <div
                    key={idx}
                    className="group relative p-3 bg-stone-50 dark:bg-stone-800 rounded-xl"
                  >
                    <p className="text-sm text-stone-700 dark:text-stone-300 pr-6">
                      {note.content}
                    </p>
                    <p className="text-xs text-stone-400 dark:text-stone-500 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(note.createdAt)}
                    </p>
                    <button
                      onClick={() => onDeleteNote?.(note.createdAt)}
                      className="absolute top-2 right-2 p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                ))}
                {employee.notes.length === 0 && (
                  <p className="text-sm text-stone-500 dark:text-stone-400 italic text-center py-4">
                    No notes added
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Add Note Modal */}
      {showAddNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50">
          <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
              Add Note
            </h3>
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Write your note here..."
              className="w-full h-32 px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => { setShowAddNote(false); setNewNoteContent('') }}
                className="px-4 py-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={!newNoteContent.trim()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Property Modal */}
      {showAddProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50">
          <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
              Add Custom Field
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Field Name
                </label>
                <input
                  type="text"
                  value={newPropertyName}
                  onChange={(e) => setNewPropertyName(e.target.value)}
                  placeholder="e.g., Blood Group"
                  className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Value
                </label>
                <input
                  type="text"
                  value={newPropertyValue}
                  onChange={(e) => setNewPropertyValue(e.target.value)}
                  placeholder="e.g., B+"
                  className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setShowAddProperty(false); setNewPropertyName(''); setNewPropertyValue('') }}
                className="px-4 py-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProperty}
                disabled={!newPropertyName.trim() || !newPropertyValue.trim()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
              >
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50">
          <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
              Upload Document
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as DocType['category'])}
                  className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="ID">ID Document</option>
                  <option value="Contract">Contract</option>
                  <option value="Certificate">Certificate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                  File
                </label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowUploadDoc(false)}
                className="px-4 py-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal */}
      {showArchiveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50">
          <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
              {employee.status === 'archived' ? 'Restore Employee?' : 'Archive Employee?'}
            </h3>
            <p className="text-stone-600 dark:text-stone-400 mb-6">
              {employee.status === 'archived'
                ? `Are you sure you want to restore ${employee.name}? They will appear in the active staff list again.`
                : `Are you sure you want to archive ${employee.name}? Their data will be preserved but they will be hidden from the active list.`
              }
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowArchiveConfirm(false)}
                className="px-4 py-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { onArchive?.(); setShowArchiveConfirm(false) }}
                className={`
                  px-4 py-2 font-medium rounded-xl transition-colors
                  ${employee.status === 'archived'
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                  }
                `}
              >
                {employee.status === 'archived' ? 'Restore' : 'Archive'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
