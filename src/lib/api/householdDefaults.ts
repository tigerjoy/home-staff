import { supabase } from '../../supabase'
import type {
  HouseholdHolidayRule,
  HouseholdHolidayRuleInput,
  HouseholdAttendanceSettings,
} from '../../types'
import { mapPresetToRecurrencePattern } from '../constants/onboardingPresets'

// Transform database row to HouseholdHolidayRule interface
function transformToHolidayRule(row: any): HouseholdHolidayRule {
  return {
    id: row.id,
    householdId: row.household_id,
    ruleType: row.rule_type,
    recurrenceIntervalValue: row.recurrence_interval_value,
    recurrenceIntervalUnit: row.recurrence_interval_unit,
    repeatOnDaysOfWeek: row.repeat_on_days_of_week || undefined,
    repeatOnDayOfMonth: row.repeat_on_day_of_month || undefined,
    daysPerMonth: row.days_per_month || undefined,
    endsType: row.ends_type,
    endsDate: row.ends_date || undefined,
    endsOccurrences: row.ends_occurrences || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// Transform database row to HouseholdAttendanceSettings interface
function transformToAttendanceSettings(row: any): HouseholdAttendanceSettings {
  return {
    id: row.id,
    householdId: row.household_id,
    trackingMethod: row.tracking_method,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Map preset ID to recurrence pattern and create holiday rule
 */
export async function setHolidayRulePreset(
  householdId: string,
  presetId: string
): Promise<HouseholdHolidayRule | null> {
  // If preset is "custom", don't create a rule (user will configure later)
  if (presetId === 'p3') {
    return null
  }

  // Get recurrence pattern for preset
  const pattern = mapPresetToRecurrencePattern(presetId)
  if (!pattern) {
    throw new Error(`Invalid preset ID: ${presetId}`)
  }

  // Check if rule already exists for this household
  const { data: existing } = await supabase
    .from('household_holiday_rules')
    .select('*')
    .eq('household_id', householdId)
    .single()

  const ruleData: any = {
    household_id: householdId,
    rule_type: pattern.ruleType,
    recurrence_interval_value: pattern.recurrenceIntervalValue || 1,
    recurrence_interval_unit: pattern.recurrenceIntervalUnit,
    ends_type: pattern.endsType || 'never',
  }

  if (pattern.repeatOnDaysOfWeek) {
    ruleData.repeat_on_days_of_week = pattern.repeatOnDaysOfWeek
  }
  if (pattern.repeatOnDayOfMonth) {
    ruleData.repeat_on_day_of_month = pattern.repeatOnDayOfMonth
  }
  if (pattern.daysPerMonth) {
    ruleData.days_per_month = pattern.daysPerMonth
  }
  if (pattern.endsDate) {
    ruleData.ends_date = pattern.endsDate
  }
  if (pattern.endsOccurrences) {
    ruleData.ends_occurrences = pattern.endsOccurrences
  }

  if (existing) {
    // Update existing rule
    const { data: updated, error } = await supabase
      .from('household_holiday_rules')
      .update(ruleData)
      .eq('id', existing.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update holiday rule: ${error.message}`)
    }

    return transformToHolidayRule(updated)
  } else {
    // Create new rule
    const { data: created, error } = await supabase
      .from('household_holiday_rules')
      .insert(ruleData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create holiday rule: ${error.message}`)
    }

    return transformToHolidayRule(created)
  }
}

/**
 * Set attendance preset for a household
 */
export async function setAttendancePreset(
  householdId: string,
  presetId: string
): Promise<HouseholdAttendanceSettings> {
  // Map preset ID to tracking method
  const trackingMethod = presetId === 'a1' ? 'present_by_default' : 'manual_entry'

  // Check if settings already exist
  const { data: existing } = await supabase
    .from('household_attendance_settings')
    .select('*')
    .eq('household_id', householdId)
    .single()

  if (existing) {
    // Update existing settings
    const { data: updated, error } = await supabase
      .from('household_attendance_settings')
      .update({ tracking_method: trackingMethod })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update attendance settings: ${error.message}`)
    }

    return transformToAttendanceSettings(updated)
  } else {
    // Create new settings
    const { data: created, error } = await supabase
      .from('household_attendance_settings')
      .insert({
        household_id: householdId,
        tracking_method: trackingMethod,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create attendance settings: ${error.message}`)
    }

    return transformToAttendanceSettings(created)
  }
}

/**
 * Get all defaults for a household (holiday rules and attendance settings)
 */
export async function getHouseholdDefaults(householdId: string): Promise<{
  holidayRules: HouseholdHolidayRule[]
  attendanceSettings: HouseholdAttendanceSettings | null
}> {
  const [holidayRulesResult, attendanceResult] = await Promise.all([
    supabase
      .from('household_holiday_rules')
      .select('*')
      .eq('household_id', householdId),
    supabase
      .from('household_attendance_settings')
      .select('*')
      .eq('household_id', householdId)
      .single(),
  ])

  if (holidayRulesResult.error) {
    throw new Error(`Failed to fetch holiday rules: ${holidayRulesResult.error.message}`)
  }

  return {
    holidayRules: (holidayRulesResult.data || []).map(transformToHolidayRule),
    attendanceSettings: attendanceResult.data
      ? transformToAttendanceSettings(attendanceResult.data)
      : null,
  }
}

/**
 * Create a custom holiday rule with full recurrence pattern
 */
export async function createHolidayRule(
  householdId: string,
  rule: HouseholdHolidayRuleInput
): Promise<HouseholdHolidayRule> {
  const ruleData: any = {
    household_id: householdId,
    rule_type: rule.ruleType,
    recurrence_interval_value: rule.recurrenceIntervalValue || 1,
    recurrence_interval_unit: rule.recurrenceIntervalUnit || 'week',
    ends_type: rule.endsType || 'never',
  }

  if (rule.repeatOnDaysOfWeek) {
    ruleData.repeat_on_days_of_week = rule.repeatOnDaysOfWeek
  }
  if (rule.repeatOnDayOfMonth) {
    ruleData.repeat_on_day_of_month = rule.repeatOnDayOfMonth
  }
  if (rule.daysPerMonth) {
    ruleData.days_per_month = rule.daysPerMonth
  }
  if (rule.endsDate) {
    ruleData.ends_date = rule.endsDate
  }
  if (rule.endsOccurrences) {
    ruleData.ends_occurrences = rule.endsOccurrences
  }

  const { data: created, error } = await supabase
    .from('household_holiday_rules')
    .insert(ruleData)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create holiday rule: ${error.message}`)
  }

  return transformToHolidayRule(created)
}
