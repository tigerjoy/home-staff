import { supabase } from '../../supabase'
import type {
  Employee,
  UIEmployee,
  Employment,
  EmploymentRecord,
  SalaryRecord,
  Document,
  PhoneNumber,
  Address,
  CustomProperty,
  Note,
  ExistingEmployeeFromOtherHousehold,
} from '../../types'

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * Transform database employment records to EmploymentRecord for UI
 */
function transformToEmploymentRecord(employment: any): EmploymentRecord {
  return {
    role: employment.role,
    department: employment.role, // Use role as department for now (can be enhanced later)
    startDate: employment.start_date,
    endDate: employment.end_date || null,
  }
}

/**
 * Transform database employment records to SalaryRecord for UI
 */
function transformToSalaryRecord(employment: any): SalaryRecord {
  return {
    amount: Number(employment.current_salary || 0),
    paymentMethod: employment.payment_method as SalaryRecord['paymentMethod'],
    effectiveDate: employment.start_date,
  }
}

/**
 * Transform database rows to UIEmployee interface
 * This combines Employee data with current Employment data for a specific household
 */
function transformToUIEmployee(
  employee: any,
  currentEmployment: any,
  allEmployments: any[],
  phoneNumbers: any[],
  addresses: any[],
  documents: any[],
  customProperties: any[],
  notes: any[]
): UIEmployee {
  // Derive employment history from all employments (sorted by start_date)
  const employmentHistory: EmploymentRecord[] = allEmployments
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    .map(transformToEmploymentRecord)

  // Derive salary history from all employments (sorted by start_date, most recent first)
  const salaryHistory: SalaryRecord[] = allEmployments
    .filter((e) => e.current_salary != null)
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
    .map(transformToSalaryRecord)

  return {
    id: employee.id,
    name: employee.name,
    photo: employee.photo,
    status: currentEmployment?.status || 'archived',
    phoneNumbers: phoneNumbers.map((p) => ({
      number: p.number,
      label: p.label,
    })),
    addresses: addresses.map((a) => ({
      address: a.address,
      label: a.label,
    })),
    employmentHistory,
    salaryHistory,
    documents: documents.map((d) => ({
      name: d.name,
      url: d.url,
      category: d.category as Document['category'],
      uploadedAt: d.uploaded_at,
    })),
    customProperties: customProperties.map((p) => ({
      name: p.name,
      value: p.value,
    })),
    notes: notes.map((n) => ({
      content: n.content,
      createdAt: n.created_at,
    })),
    holidayBalance: currentEmployment?.holiday_balance || 0,
    householdId: currentEmployment?.household_id || '',
    createdAt: employee.created_at,
    updatedAt: employee.updated_at,
  }
}

/**
 * Fetch employees for a household via their employments
 */
export async function fetchEmployees(
  householdId: string,
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<UIEmployee>> {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  // Fetch all employments (active and archived) for this household
  // First, get all employments to count unique employees
  const { data: allHouseholdEmployments, error: countError } = await supabase
    .from('employments')
    .select('employee_id', { count: 'exact' })
    .eq('household_id', householdId)

  if (countError) {
    throw new Error(`Failed to fetch employments count: ${countError.message}`)
  }

  // Get unique employee IDs for pagination
  const uniqueEmployeeIds = [...new Set((allHouseholdEmployments || []).map((e) => e.employee_id))]
  const totalEmployees = uniqueEmployeeIds.length

  // Paginate the unique employee IDs
  const paginatedEmployeeIds = uniqueEmployeeIds.slice(from, to + 1)

  if (paginatedEmployeeIds.length === 0) {
    return { data: [], total: totalEmployees, page, pageSize }
  }

  // Fetch all employments for the paginated employees in this household
  const { data: employments, error: employmentsError } = await supabase
    .from('employments')
    .select('*')
    .eq('household_id', householdId)
    .in('employee_id', paginatedEmployeeIds)
    .order('created_at', { ascending: false })

  if (employmentsError) {
    throw new Error(`Failed to fetch employments: ${employmentsError.message}`)
  }

  if (!employments || employments.length === 0) {
    return { data: [], total: totalEmployees, page, pageSize }
  }

  // Get unique employee IDs
  const employeeIds = [...new Set(employments.map((e) => e.employee_id))]

  // Fetch employees
  const { data: employees, error: employeesError } = await supabase
    .from('employees')
    .select('*')
    .in('id', employeeIds)

  if (employeesError) {
    throw new Error(`Failed to fetch employees: ${employeesError.message}`)
  }

  if (!employees) {
    return { data: [], total: totalEmployees, page, pageSize }
  }

  // Fetch all employments for these employees (for history)
  const { data: allEmployments } = await supabase
    .from('employments')
    .select('*')
    .in('employee_id', employeeIds)

  // Fetch all related data
  const [
    { data: phoneNumbers },
    { data: addresses },
    { data: documents },
    { data: customProperties },
    { data: notes },
  ] = await Promise.all([
    supabase.from('employee_phone_numbers').select('*').in('employee_id', employeeIds),
    supabase.from('employee_addresses').select('*').in('employee_id', employeeIds),
    supabase.from('employee_documents').select('*').in('employee_id', employeeIds),
    supabase.from('employee_custom_properties').select('*').in('employee_id', employeeIds),
    supabase.from('employee_notes').select('*').in('employee_id', employeeIds),
  ])

  // Group related data by employee_id
  const phoneNumbersByEmployee = new Map<string, any[]>()
  const addressesByEmployee = new Map<string, any[]>()
  const documentsByEmployee = new Map<string, any[]>()
  const customPropertiesByEmployee = new Map<string, any[]>()
  const notesByEmployee = new Map<string, any[]>()
  const employmentsByEmployee = new Map<string, any[]>()
  const currentEmploymentsByEmployee = new Map<string, any>()

  phoneNumbers?.forEach((p) => {
    const arr = phoneNumbersByEmployee.get(p.employee_id) || []
    arr.push(p)
    phoneNumbersByEmployee.set(p.employee_id, arr)
  })

  addresses?.forEach((a) => {
    const arr = addressesByEmployee.get(a.employee_id) || []
    arr.push(a)
    addressesByEmployee.set(a.employee_id, arr)
  })

  documents?.forEach((d) => {
    const arr = documentsByEmployee.get(d.employee_id) || []
    arr.push(d)
    documentsByEmployee.set(d.employee_id, arr)
  })

  customProperties?.forEach((p) => {
    const arr = customPropertiesByEmployee.get(p.employee_id) || []
    arr.push(p)
    customPropertiesByEmployee.set(p.employee_id, arr)
  })

  notes?.forEach((n) => {
    const arr = notesByEmployee.get(n.employee_id) || []
    arr.push(n)
    notesByEmployee.set(n.employee_id, arr)
  })

  allEmployments?.forEach((e) => {
    const arr = employmentsByEmployee.get(e.employee_id) || []
    arr.push(e)
    employmentsByEmployee.set(e.employee_id, arr)

    // Track most recent employment (active or archived) for this household
    if (e.household_id === householdId) {
      const existing = currentEmploymentsByEmployee.get(e.employee_id)
      if (!existing) {
        currentEmploymentsByEmployee.set(e.employee_id, e)
      } else {
        // Keep the most recent employment (by created_at, then by start_date)
        const existingDate = new Date(existing.created_at || existing.start_date)
        const currentDate = new Date(e.created_at || e.start_date)
        if (currentDate > existingDate) {
          currentEmploymentsByEmployee.set(e.employee_id, e)
        }
      }
    }
  })

  // Transform to UIEmployee
  const transformedEmployees = employees
    .map((employee) => {
      const currentEmployment = currentEmploymentsByEmployee.get(employee.id)
      const allEmployeeEmployments = employmentsByEmployee.get(employee.id) || []

      return transformToUIEmployee(
        employee,
        currentEmployment,
        allEmployeeEmployments,
        phoneNumbersByEmployee.get(employee.id) || [],
        addressesByEmployee.get(employee.id) || [],
        documentsByEmployee.get(employee.id) || [],
        customPropertiesByEmployee.get(employee.id) || [],
        notesByEmployee.get(employee.id) || []
      )
    })
    .filter((emp) => emp.householdId === householdId) // Only return employees with employment (active or archived) in this household

  return {
    data: transformedEmployees,
    total: totalEmployees,
    page,
    pageSize,
  }
}

/**
 * Fetch a single employee by ID with all their employments
 */
export async function fetchEmployee(id: string, householdId: string): Promise<UIEmployee | null> {
  // Fetch employee
  const { data: employee, error: employeeError } = await supabase
    .from('employees')
    .select('*')
    .eq('id', id)
    .single()

  if (employeeError || !employee) {
    return null
  }

  // Fetch all employments for this employee
  const { data: allEmployments } = await supabase
    .from('employments')
    .select('*')
    .eq('employee_id', id)
    .order('start_date', { ascending: true })

  // Find current employment for this household
  const currentEmployment =
    allEmployments?.find(
      (e) => e.household_id === householdId && e.status === 'active' && !e.end_date
    ) || allEmployments?.[0] || null

  // Fetch all related data
  const [
    { data: phoneNumbers },
    { data: addresses },
    { data: documents },
    { data: customProperties },
    { data: notes },
  ] = await Promise.all([
    supabase.from('employee_phone_numbers').select('*').eq('employee_id', id),
    supabase.from('employee_addresses').select('*').eq('employee_id', id),
    supabase.from('employee_documents').select('*').eq('employee_id', id),
    supabase.from('employee_custom_properties').select('*').eq('employee_id', id),
    supabase.from('employee_notes').select('*').eq('employee_id', id),
  ])

  return transformToUIEmployee(
    employee,
    currentEmployment,
    allEmployments || [],
    phoneNumbers || [],
    addresses || [],
    documents || [],
    customProperties || [],
    notes || []
  )
}

/**
 * Create a new employee and their initial employment (via RPC, single transaction).
 */
export async function createEmployee(
  employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>,
  employmentData: {
    householdId: string
    employmentType: 'monthly' | 'adhoc'
    role: string
    startDate: string
    holidayBalance?: number
    currentSalary?: number
    paymentMethod: 'Cash' | 'Bank Transfer' | 'UPI' | 'Cheque'
  }
): Promise<UIEmployee> {
  const payload = {
    p_employee: {
      name: employeeData.name,
      photo: employeeData.photo ?? null,
    },
    p_employment: {
      household_id: employmentData.householdId,
      employment_type: employmentData.employmentType,
      role: employmentData.role,
      start_date: employmentData.startDate,
      holiday_balance: employmentData.holidayBalance ?? null,
      current_salary: employmentData.currentSalary ?? null,
      payment_method: employmentData.paymentMethod,
    },
    p_phone_numbers: employeeData.phoneNumbers,
    p_addresses: employeeData.addresses,
    p_documents: employeeData.documents.map((d) => ({
      name: d.name,
      url: d.url,
      category: d.category,
      uploaded_at: d.uploadedAt,
    })),
    p_custom_properties: employeeData.customProperties,
    p_notes: employeeData.notes.map((n) => ({ content: n.content })),
  }

  const { data: employeeId, error } = await supabase.rpc(
    'create_employee_with_employment',
    payload
  )

  if (error) {
    throw new Error(`Failed to create employee: ${error.message}`)
  }

  if (!employeeId) {
    throw new Error('Failed to create employee: no ID returned')
  }

  const createdEmployee = await fetchEmployee(employeeId, employmentData.householdId)
  if (!createdEmployee) {
    throw new Error('Failed to fetch created employee')
  }
  return createdEmployee
}

/**
 * Update employee core data
 */
export async function updateEmployee(
  id: string,
  updates: Partial<Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Employee> {
  // Update employee main record
  if (updates.name || updates.photo !== undefined) {
    const updateData: any = {}
    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.photo !== undefined) updateData.photo = updates.photo

    const { error: updateError } = await supabase.from('employees').update(updateData).eq('id', id)

    if (updateError) {
      throw new Error(`Failed to update employee: ${updateError.message}`)
    }
  }

  // Update related tables - delete and reinsert for simplicity
  if (updates.phoneNumbers !== undefined) {
    await supabase.from('employee_phone_numbers').delete().eq('employee_id', id)
    if (updates.phoneNumbers.length > 0) {
      await supabase.from('employee_phone_numbers').insert(
        updates.phoneNumbers.map((p) => ({
          employee_id: id,
          number: p.number,
          label: p.label,
        }))
      )
    }
  }

  if (updates.addresses !== undefined) {
    await supabase.from('employee_addresses').delete().eq('employee_id', id)
    if (updates.addresses.length > 0) {
      await supabase.from('employee_addresses').insert(
        updates.addresses.map((a) => ({
          employee_id: id,
          address: a.address,
          label: a.label,
        }))
      )
    }
  }

  if (updates.documents !== undefined) {
    await supabase.from('employee_documents').delete().eq('employee_id', id)
    if (updates.documents.length > 0) {
      await supabase.from('employee_documents').insert(
        updates.documents.map((d) => ({
          employee_id: id,
          name: d.name,
          url: d.url,
          category: d.category,
          uploaded_at: d.uploadedAt,
        }))
      )
    }
  }

  if (updates.customProperties !== undefined) {
    await supabase.from('employee_custom_properties').delete().eq('employee_id', id)
    if (updates.customProperties.length > 0) {
      await supabase.from('employee_custom_properties').insert(
        updates.customProperties.map((p) => ({
          employee_id: id,
          name: p.name,
          value: p.value,
        }))
      )
    }
  }

  if (updates.notes !== undefined) {
    await supabase.from('employee_notes').delete().eq('employee_id', id)
    if (updates.notes.length > 0) {
      await supabase.from('employee_notes').insert(
        updates.notes.map((n) => ({
          employee_id: id,
          content: n.content,
        }))
      )
    }
  }

  // Fetch updated employee (without employment data for core Employee type)
  const { data: employee } = await supabase.from('employees').select('*').eq('id', id).single()
  if (!employee) {
    throw new Error('Failed to fetch updated employee')
  }

  const [
    { data: phoneNumbers },
    { data: addresses },
    { data: documents },
    { data: customProperties },
    { data: notes },
  ] = await Promise.all([
    supabase.from('employee_phone_numbers').select('*').eq('employee_id', id),
    supabase.from('employee_addresses').select('*').eq('employee_id', id),
    supabase.from('employee_documents').select('*').eq('employee_id', id),
    supabase.from('employee_custom_properties').select('*').eq('employee_id', id),
    supabase.from('employee_notes').select('*').eq('employee_id', id),
  ])

  return {
    id: employee.id,
    name: employee.name,
    photo: employee.photo,
    phoneNumbers: phoneNumbers?.map((p) => ({ number: p.number, label: p.label })) || [],
    addresses: addresses?.map((a) => ({ address: a.address, label: a.label })) || [],
    documents:
      documents?.map((d) => ({
        name: d.name,
        url: d.url,
        category: d.category as Document['category'],
        uploadedAt: d.uploaded_at,
      })) || [],
    customProperties:
      customProperties?.map((p) => ({ name: p.name, value: p.value })) || [],
    notes: notes?.map((n) => ({ content: n.content, createdAt: n.created_at })) || [],
    createdAt: employee.created_at,
    updatedAt: employee.updated_at,
  }
}

/**
 * Update employment (role, salary, holiday balance, etc.)
 */
export async function updateEmployment(
  id: string,
  updates: Partial<Omit<Employment, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Employment> {
  const updateData: any = {}
  if (updates.role !== undefined) updateData.role = updates.role
  if (updates.startDate !== undefined) updateData.start_date = updates.startDate
  if (updates.endDate !== undefined) updateData.end_date = updates.endDate
  if (updates.status !== undefined) updateData.status = updates.status
  if (updates.holidayBalance !== undefined) updateData.holiday_balance = updates.holidayBalance
  if (updates.currentSalary !== undefined) updateData.current_salary = updates.currentSalary
  if (updates.paymentMethod !== undefined) updateData.payment_method = updates.paymentMethod
  if (updates.employmentType !== undefined) updateData.employment_type = updates.employmentType

  const { data: employment, error } = await supabase
    .from('employments')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update employment: ${error.message}`)
  }

  return {
    id: employment.id,
    employeeId: employment.employee_id,
    householdId: employment.household_id,
    employmentType: employment.employment_type,
    role: employment.role,
    startDate: employment.start_date,
    endDate: employment.end_date || undefined,
    status: employment.status,
    holidayBalance: employment.holiday_balance,
    currentSalary: employment.current_salary ? Number(employment.current_salary) : null,
    paymentMethod: employment.payment_method,
    createdAt: employment.created_at,
    updatedAt: employment.updated_at,
  }
}

/**
 * Archive an employee (archives all their employments)
 */
export async function archiveEmployee(id: string, householdId: string): Promise<void> {
  // Archive all employments for this employee in this household
  const { error } = await supabase
    .from('employments')
    .update({ status: 'archived' })
    .eq('employee_id', id)
    .eq('household_id', householdId)

  if (error) {
    throw new Error(`Failed to archive employee: ${error.message}`)
  }
}

/**
 * Restore an archived employee
 */
export async function restoreEmployee(id: string, householdId: string): Promise<void> {
  const { error } = await supabase
    .from('employments')
    .update({ status: 'active' })
    .eq('employee_id', id)
    .eq('household_id', householdId)

  if (error) {
    throw new Error(`Failed to restore employee: ${error.message}`)
  }
}

/**
 * Rename a document for an employee
 */
export async function renameDocument(
  employeeId: string,
  documentUrl: string,
  newName: string
): Promise<void> {
  const { error } = await supabase
    .from('employee_documents')
    .update({ name: newName })
    .eq('employee_id', employeeId)
    .eq('url', documentUrl)

  if (error) {
    throw new Error(`Failed to rename document: ${error.message}`)
  }
}

/**
 * Get current employment for an employee in a household
 */
export async function getCurrentEmployment(
  employeeId: string,
  householdId: string
): Promise<Employment | null> {
  const { data: employment, error } = await supabase
    .from('employments')
    .select('*')
    .eq('employee_id', employeeId)
    .eq('household_id', householdId)
    .eq('status', 'active')
    .is('end_date', null)
    .single()

  if (error || !employment) {
    return null
  }

  return {
    id: employment.id,
    employeeId: employment.employee_id,
    householdId: employment.household_id,
    employmentType: employment.employment_type,
    role: employment.role,
    startDate: employment.start_date,
    endDate: employment.end_date || undefined,
    status: employment.status,
    holidayBalance: employment.holiday_balance,
    currentSalary: employment.current_salary ? Number(employment.current_salary) : null,
    paymentMethod: employment.payment_method,
    createdAt: employment.created_at,
    updatedAt: employment.updated_at,
  }
}

/**
 * Fetch employees from other households that the current user has access to
 * (excluding the current household)
 */
export async function fetchEmployeesFromOtherHouseholds(
  currentHouseholdId: string
): Promise<ExistingEmployeeFromOtherHousehold[]> {
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  // Get all households where user is a member (excluding current household)
  const { data: members, error: membersError } = await supabase
    .from('members')
    .select('household_id')
    .eq('user_id', user.id)
    .neq('household_id', currentHouseholdId)

  if (membersError) {
    throw new Error(`Failed to fetch user households: ${membersError.message}`)
  }

  if (!members || members.length === 0) {
    return []
  }

  const otherHouseholdIds = members.map((m) => m.household_id)

  // Get active employments from other households
  const { data: employments, error: employmentsError } = await supabase
    .from('employments')
    .select('employee_id, role, household_id, created_at')
    .in('household_id', otherHouseholdIds)
    .eq('status', 'active')
    .is('end_date', null)

  if (employmentsError) {
    throw new Error(`Failed to fetch employments: ${employmentsError.message}`)
  }

  if (!employments || employments.length === 0) {
    return []
  }

  // Get unique employee IDs
  const employeeIds = [...new Set(employments.map((e) => e.employee_id))]

  // Fetch households to get names
  const { data: households } = await supabase
    .from('households')
    .select('id, name')
    .in('id', otherHouseholdIds)

  const householdMap = new Map<string, string>()
  households?.forEach((h) => {
    householdMap.set(h.id, h.name)
  })

  // Fetch employees
  const { data: employees, error: employeesError } = await supabase
    .from('employees')
    .select('id, name')
    .in('id', employeeIds)

  if (employeesError) {
    throw new Error(`Failed to fetch employees: ${employeesError.message}`)
  }

  // Fetch phone numbers
  const { data: phoneNumbers } = await supabase
    .from('employee_phone_numbers')
    .select('employee_id, number')
    .in('employee_id', employeeIds)

  // Build map of employee to their most recent employment
  const employeeToEmployment = new Map<string, any>()
  employments.forEach((e) => {
    const existing = employeeToEmployment.get(e.employee_id)
    if (!existing || new Date(e.created_at) > new Date(existing.created_at)) {
      employeeToEmployment.set(e.employee_id, e)
    }
  })

  // Build map of employee to primary phone
  const employeeToPhone = new Map<string, string>()
  phoneNumbers?.forEach((p) => {
    if (!employeeToPhone.has(p.employee_id)) {
      employeeToPhone.set(p.employee_id, p.number)
    }
  })

  // Transform to ExistingEmployeeFromOtherHousehold
  return (employees || [])
    .map((emp) => {
      const employment = employeeToEmployment.get(emp.id)
      if (!employment) return null

      const householdName = householdMap.get(employment.household_id) || 'Unknown Household'
      const phoneNumber = employeeToPhone.get(emp.id) || '—'

      return {
        id: emp.id,
        name: emp.name,
        role: employment.role,
        householdName,
        phoneNumber,
      }
    })
    .filter((e): e is ExistingEmployeeFromOtherHousehold => e !== null)
}

/**
 * Link an existing employee to a new household by creating a new employment record
 */
export async function linkExistingEmployee(
  employeeId: string,
  householdId: string,
  employmentData: {
    employmentType: 'monthly' | 'adhoc'
    role: string
    startDate: string
    holidayBalance?: number
    currentSalary?: number
    paymentMethod: 'Cash' | 'Bank Transfer' | 'UPI' | 'Cheque'
  }
): Promise<UIEmployee> {
  // Check if employee already has an active employment in this household
  const existingEmployment = await getCurrentEmployment(employeeId, householdId)
  if (existingEmployment) {
    throw new Error('Employee is already linked to this household')
  }

  // Create new employment record
  const { data: employment, error: employmentError } = await supabase
    .from('employments')
    .insert({
      employee_id: employeeId,
      household_id: householdId,
      employment_type: employmentData.employmentType,
      role: employmentData.role,
      start_date: employmentData.startDate,
      holiday_balance: employmentData.holidayBalance ?? null,
      current_salary: employmentData.currentSalary ?? null,
      payment_method: employmentData.paymentMethod,
      status: 'active',
    })
    .select()
    .single()

  if (employmentError) {
    throw new Error(`Failed to link employee: ${employmentError.message}`)
  }

  // Fetch the linked employee with all their data
  const linkedEmployee = await fetchEmployee(employeeId, householdId)
  if (!linkedEmployee) {
    throw new Error('Failed to fetch linked employee')
  }

  return linkedEmployee
}
