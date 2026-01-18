import { supabase } from '../supabase/client'
import type { Summary } from '../../types'

export async function fetchSummary(householdId: string): Promise<Summary> {
  const householdIdNum = Number(householdId)

  // Fetch all employees for this household
  const { data: employees, error } = await supabase
    .from('employees')
    .select('status')
    .eq('household_id', householdIdNum)

  if (error) {
    throw new Error(`Failed to fetch summary: ${error.message}`)
  }

  if (!employees || employees.length === 0) {
    return {
      totalStaff: 0,
      activeStaff: 0,
      archivedStaff: 0,
      roleBreakdown: {},
    }
  }

  const totalStaff = employees.length
  const activeStaff = employees.filter((e) => e.status === 'active').length
  const archivedStaff = employees.filter((e) => e.status === 'archived').length

  // Fetch current roles (employment history with no end_date)
  const { data: employmentHistory } = await supabase
    .from('employment_history')
    .select('employee_id, role')
    .is('end_date', null)
    .in(
      'employee_id',
      employees.map((e) => e.id)
    )

  // Calculate role breakdown
  const roleBreakdown: { [role: string]: number } = {}
  if (employmentHistory) {
    employmentHistory.forEach((eh) => {
      if (eh.role) {
        roleBreakdown[eh.role] = (roleBreakdown[eh.role] || 0) + 1
      }
    })
  }

  return {
    totalStaff,
    activeStaff,
    archivedStaff,
    roleBreakdown,
  }
}
