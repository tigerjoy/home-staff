import type { HouseholdHolidayRuleInput } from '../../types'

export interface PresetOption {
  id: string
  label: string
  description: string
}

export interface OnboardingPresets {
  holidayRules: PresetOption[]
  attendance: PresetOption[]
}

/**
 * Preset options for holiday rules
 */
export const holidayRulePresets: PresetOption[] = [
  {
    id: 'p1',
    label: '4 Days per Month',
    description: 'Standard flexible entitlement.',
  },
  {
    id: 'p2',
    label: 'Every Sunday Off',
    description: 'Weekly recurring holiday.',
  },
  {
    id: 'p3',
    label: 'Custom',
    description: 'Set your own rules later.',
  },
]

/**
 * Preset options for attendance tracking
 */
export const attendancePresets: PresetOption[] = [
  {
    id: 'a1',
    label: 'Present by Default',
    description: 'Only mark absences (Recommended).',
  },
  {
    id: 'a2',
    label: 'Manual Entry',
    description: 'Mark attendance for every person daily.',
  },
]

/**
 * Get all presets for onboarding
 */
export function getOnboardingPresets(): OnboardingPresets {
  return {
    holidayRules: holidayRulePresets,
    attendance: attendancePresets,
  }
}

/**
 * Map preset ID to full recurrence pattern structure
 * Returns null for "custom" preset (p3)
 */
export function mapPresetToRecurrencePattern(
  presetId: string
): HouseholdHolidayRuleInput | null {
  switch (presetId) {
    case 'p1': // "4 Days per Month"
      return {
        ruleType: 'days_per_month',
        recurrenceIntervalUnit: 'month',
        recurrenceIntervalValue: 1,
        daysPerMonth: 4,
        endsType: 'never',
      }

    case 'p2': // "Every Sunday Off"
      return {
        ruleType: 'recurring',
        recurrenceIntervalUnit: 'week',
        recurrenceIntervalValue: 1,
        repeatOnDaysOfWeek: [0], // 0 = Sunday
        endsType: 'never',
      }

    case 'p3': // "Custom"
      return null // User will configure later

    default:
      throw new Error(`Unknown preset ID: ${presetId}`)
  }
}

/**
 * Get preset option by ID
 */
export function getPresetOption(presetId: string, type: 'holiday' | 'attendance'): PresetOption | null {
  const presets = type === 'holiday' ? holidayRulePresets : attendancePresets
  return presets.find((p) => p.id === presetId) || null
}
