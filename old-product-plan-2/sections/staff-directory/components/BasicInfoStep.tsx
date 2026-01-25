import { useState } from 'react'
import { Camera, Plus, Trash2, Phone, MapPin } from 'lucide-react'
import type { Employee, PhoneNumber, Address } from '@/../product/sections/staff-directory/types'

interface BasicInfoStepProps {
  data: Omit<Employee, 'id'>
  onChange: (updates: Partial<Omit<Employee, 'id'>>) => void
}

const PHONE_LABELS = ['Mobile', 'Home', 'Work', 'Emergency', 'Other']
const ADDRESS_LABELS = ['Current', 'Permanent', 'Office', 'Other']

export function BasicInfoStep({ data, onChange }: BasicInfoStepProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(data.photo)

  // Generate initials for avatar preview
  const initials = data.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?'

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPhotoPreview(result)
        onChange({ photo: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const updatePhone = (index: number, updates: Partial<PhoneNumber>) => {
    const newPhones = [...data.phoneNumbers]
    newPhones[index] = { ...newPhones[index], ...updates }
    onChange({ phoneNumbers: newPhones })
  }

  const addPhone = () => {
    const usedLabels = data.phoneNumbers.map(p => p.label)
    const nextLabel = PHONE_LABELS.find(l => !usedLabels.includes(l)) || 'Other'
    onChange({ phoneNumbers: [...data.phoneNumbers, { number: '', label: nextLabel }] })
  }

  const removePhone = (index: number) => {
    if (data.phoneNumbers.length > 1) {
      onChange({ phoneNumbers: data.phoneNumbers.filter((_, i) => i !== index) })
    }
  }

  const updateAddress = (index: number, updates: Partial<Address>) => {
    const newAddresses = [...data.addresses]
    newAddresses[index] = { ...newAddresses[index], ...updates }
    onChange({ addresses: newAddresses })
  }

  const addAddress = () => {
    const usedLabels = data.addresses.map(a => a.label)
    const nextLabel = ADDRESS_LABELS.find(l => !usedLabels.includes(l)) || 'Other'
    onChange({ addresses: [...data.addresses, { address: '', label: nextLabel }] })
  }

  const removeAddress = (index: number) => {
    if (data.addresses.length > 1) {
      onChange({ addresses: data.addresses.filter((_, i) => i !== index) })
    }
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          Basic Information
        </h2>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Enter the staff member's personal details and contact information
        </p>
      </div>

      {/* Photo & Name Section */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* Photo Upload */}
        <div className="flex-shrink-0">
          <label className="block cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <div className="relative">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Staff photo"
                  className="w-28 h-28 rounded-2xl object-cover ring-4 ring-amber-100 dark:ring-amber-900/50 group-hover:ring-amber-200 dark:group-hover:ring-amber-800 transition-all"
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center ring-4 ring-amber-100 dark:ring-amber-900/50 group-hover:ring-amber-200 dark:group-hover:ring-amber-800 transition-all">
                  <span className="text-3xl font-bold text-white">{initials}</span>
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 flex items-center justify-center shadow-lg group-hover:border-amber-300 dark:group-hover:border-amber-700 transition-colors">
                <Camera className="w-5 h-5 text-stone-500 dark:text-stone-400" />
              </div>
            </div>
          </label>
          <p className="mt-3 text-xs text-center text-stone-500 dark:text-stone-400">
            Click to upload
          </p>
        </div>

        {/* Name Input */}
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Enter full name"
            className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Phone Numbers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Phone Numbers
            </h3>
          </div>
          <button
            type="button"
            onClick={addPhone}
            className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Phone
          </button>
        </div>

        <div className="space-y-3">
          {data.phoneNumbers.map((phone, index) => (
            <div key={index} className="flex gap-3">
              <select
                value={phone.label}
                onChange={(e) => updatePhone(index, { label: e.target.value })}
                className="w-32 px-3 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              >
                {PHONE_LABELS.map(label => (
                  <option key={label} value={label}>{label}</option>
                ))}
              </select>
              <input
                type="tel"
                value={phone.number}
                onChange={(e) => updatePhone(index, { number: e.target.value })}
                placeholder="+91 98765 43210"
                className="flex-1 px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
              {data.phoneNumbers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePhone(index)}
                  className="p-3 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Addresses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Addresses
            </h3>
          </div>
          <button
            type="button"
            onClick={addAddress}
            className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Address
          </button>
        </div>

        <div className="space-y-3">
          {data.addresses.map((address, index) => (
            <div key={index} className="flex gap-3">
              <select
                value={address.label}
                onChange={(e) => updateAddress(index, { label: e.target.value })}
                className="w-32 px-3 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              >
                {ADDRESS_LABELS.map(label => (
                  <option key={label} value={label}>{label}</option>
                ))}
              </select>
              <input
                type="text"
                value={address.address}
                onChange={(e) => updateAddress(index, { address: e.target.value })}
                placeholder="Enter full address"
                className="flex-1 px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
              {data.addresses.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAddress(index)}
                  className="p-3 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Validation Hint */}
      {!data.name.trim() && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Please enter the staff member's name to continue.
          </p>
        </div>
      )}
    </div>
  )
}
