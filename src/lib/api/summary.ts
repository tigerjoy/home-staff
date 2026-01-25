import { supabase } from '../../supabase'
import type { Summary } from '../../types'

export async function fetchSummary(householdId: string): Promise<Summary> {
  // Fetch all employments for this household
  const { data: employments, error } = await supabase
    .from('employments')
    .select('status, role, employment_type')
    .eq('household_id', householdId)

  if (error) {
    throw new Error(`Failed to fetch summary: ${error.message}`)
  }

  if (!employments || employments.length === 0) {
    return {
      totalStaff: 0,
      activeStaff: 0,
      archivedStaff: 0,
      monthlyStaff: 0,
      adhocStaff: 0,
      roleBreakdown: {},
    }
  }

  const totalStaff = employments.length
  const activeStaff = employments.filter((e) => e.status === 'active').length
  const archivedStaff = employments.filter((e) => e.status === 'archived').length
  const monthlyStaff = employments.filter((e) => e.employment_type === 'monthly' && e.status === 'active').length
  const adhocStaff = employments.filter((e) => e.employment_type === 'adhoc' && e.status === 'active').length

  // Calculate role breakdown from active employments
  const roleBreakdown: { [role: string]: number } = {}
  employments
    .filter((e) => e.status === 'active')
    .forEach((e) => {
      if (e.role) {
        roleBreakdown[e.role] = (roleBreakdown[e.role] || 0) + 1
      }
    })

  return {
    totalStaff,
    activeStaff,
    archivedStaff,
    monthlyStaff,
    adhocStaff,
    roleBreakdown,
  }
}
