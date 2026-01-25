import { useState } from 'react'
import { Plus, Trash2, Settings2, StickyNote, Clock } from 'lucide-react'
import type { UIEmployee, CustomProperty, Note } from '../../types'

interface CustomFieldsStepProps {
  data: Omit<UIEmployee, 'id' | 'householdId' | 'status' | 'holidayBalance'>
  onChange: (updates: Partial<Omit<UIEmployee, 'id' | 'householdId' | 'status' | 'holidayBalance'>>) => void
  employeeId?: string // Optional: if provided, save immediately; otherwise store for later save
  onCustomPropertyAdded?: (property: CustomProperty) => Promise<void> // Callback to persist custom property to database immediately
  onNoteAdded?: (note: Note) => Promise<void> // Callback to persist note to database immediately
}

const SUGGESTED_PROPERTIES = [
  'Blood Group',
  'Emergency Contact',
  'Languages',
  'Vehicle Assigned',
  'License Expiry',
  'Speciality',
  'Allergies',
  'Previous Employer',
]

export function CustomFieldsStep({ data, onChange, employeeId, onCustomPropertyAdded, onNoteAdded }: CustomFieldsStepProps) {
  const [newPropertyName, setNewPropertyName] = useState('')
  const [newPropertyValue, setNewPropertyValue] = useState('')
  const [newNote, setNewNote] = useState('')
  const [propertyError, setPropertyError] = useState<string | null>(null)
  const [noteError, setNoteError] = useState<string | null>(null)

  const addCustomProperty = async () => {
    if (!newPropertyName.trim() || !newPropertyValue.trim()) return

    const newProperty: CustomProperty = {
      name: newPropertyName.trim(),
      value: newPropertyValue.trim(),
    }

    // Update local state immediately for UI feedback
    onChange({ customProperties: [...data.customProperties, newProperty] })
    setNewPropertyName('')
    setNewPropertyValue('')
    setPropertyError(null)

    // If we have an employeeId, save immediately to database
    if (employeeId && onCustomPropertyAdded) {
      try {
        await onCustomPropertyAdded(newProperty)
      } catch (error) {
        console.error('Error persisting custom property to database:', error)
        setPropertyError(error instanceof Error ? error.message : 'Failed to save custom property to database')
        // Keep the property in local state - user can retry or remove it
      }
    }
  }

  const addSuggestedProperty = (name: string) => {
    if (data.customProperties.some(p => p.name === name)) return
    setNewPropertyName(name)
  }

  const removeCustomProperty = (index: number) => {
    onChange({ customProperties: data.customProperties.filter((_, i) => i !== index) })
  }

  const addNote = async () => {
    if (!newNote.trim()) return

    const note: Note = {
      content: newNote.trim(),
      createdAt: new Date().toISOString(),
    }

    // Update local state immediately for UI feedback
    onChange({ notes: [note, ...data.notes] })
    setNewNote('')
    setNoteError(null)

    // If we have an employeeId, save immediately to database
    if (employeeId && onNoteAdded) {
      try {
        await onNoteAdded(note)
      } catch (error) {
        console.error('Error persisting note to database:', error)
        setNoteError(error instanceof Error ? error.message : 'Failed to save note to database')
        // Keep the note in local state - user can retry or remove it
      }
    }
  }

  const removeNote = (index: number) => {
    onChange({ notes: data.notes.filter((_, i) => i !== index) })
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const usedPropertyNames = data.customProperties.map(p => p.name)
  const availableSuggestions = SUGGESTED_PROPERTIES.filter(p => !usedPropertyNames.includes(p))

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          Custom Fields & Notes
        </h2>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Add custom properties and notes for flexible record-keeping
        </p>
      </div>

      {/* Custom Properties Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Settings2 className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300">
            Custom Properties
          </h3>
        </div>

        {/* Suggestions */}
        {availableSuggestions.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">
              Quick add:
            </p>
            <div className="flex flex-wrap gap-2">
              {availableSuggestions.slice(0, 6).map(prop => (
                <button
                  key={prop}
                  type="button"
                  onClick={() => addSuggestedProperty(prop)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-700 dark:hover:text-amber-300 border border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-700 transition-all"
                >
                  + {prop}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add New Property */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 mb-4">
          <input
            type="text"
            value={newPropertyName}
            onChange={(e) => setNewPropertyName(e.target.value)}
            placeholder="Property name"
            className="flex-1 px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          />
          <input
            type="text"
            value={newPropertyValue}
            onChange={(e) => setNewPropertyValue(e.target.value)}
            placeholder="Value"
            onKeyDown={(e) => e.key === 'Enter' && addCustomProperty()}
            className="flex-1 px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          />
          <button
            type="button"
            onClick={addCustomProperty}
            disabled={!newPropertyName.trim() || !newPropertyValue.trim()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-amber-500 text-white hover:bg-amber-600 disabled:hover:bg-amber-500"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Property Error */}
        {propertyError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
            <p className="text-sm text-red-600 dark:text-red-400">{propertyError}</p>
          </div>
        )}

        {/* Properties List */}
        {data.customProperties.length > 0 ? (
          <div className="space-y-2">
            {data.customProperties.map((prop, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 group hover:border-amber-300 dark:hover:border-amber-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  <Settings2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                    {prop.name}
                  </p>
                  <p className="text-sm text-stone-600 dark:text-stone-400 truncate">
                    {prop.value}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeCustomProperty(index)}
                  className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-center">
            <Settings2 className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600 mb-2" />
            <p className="text-sm text-stone-500 dark:text-stone-400">
              No custom properties added yet
            </p>
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <StickyNote className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300">
            Notes
          </h3>
        </div>

        {/* Add Note */}
        <div className="mb-4">
          <div className="relative">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note about this staff member..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
            />
          </div>
          {newNote.trim() && (
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={addNote}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Note
              </button>
            </div>
          )}
        </div>

        {/* Note Error */}
        {noteError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
            <p className="text-sm text-red-600 dark:text-red-400">{noteError}</p>
          </div>
        )}

        {/* Notes List */}
        {data.notes.length > 0 ? (
          <div className="space-y-3">
            {data.notes.map((note, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap">
                    {note.content}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeNote(index)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-stone-500 dark:text-stone-400">
                  <Clock className="w-3 h-3" />
                  {formatDate(note.createdAt)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-center">
            <StickyNote className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600 mb-2" />
            <p className="text-sm text-stone-500 dark:text-stone-400">
              No notes added yet
            </p>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
              Add observations, reminders, or other relevant information
            </p>
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
        <p className="text-sm text-stone-600 dark:text-stone-400">
          <strong className="text-stone-900 dark:text-stone-100">Almost done!</strong>{' '}
          Custom properties and notes help you track additional information unique to each
          staff member. Click "Add Staff Member" when you're ready to save.
        </p>
      </div>
    </div>
  )
}
