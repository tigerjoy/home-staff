import { supabase } from '../supabase/client'
import type {
  Employee,
  SalaryRecord,
  Document,
} from '../../types'

// Convert bigint ID to string for TypeScript interface
const idToString = (id: number): string => String(id)

// Transform database rows to Employee interface
function transformToEmployee(
  employee: any,
  phoneNumbers: any[],
  addresses: any[],
  employmentHistory: any[],
  salaryHistory: any[],
  documents: any[],
  customProperties: any[],
  notes: any[]
): Employee {
  return {
    id: idToString(employee.id),
    householdId: idToString(employee.household_id),
    name: employee.name,
    photo: employee.photo,
    status: employee.status,
    holidayBalance: employee.holiday_balance || 0,
    phoneNumbers: phoneNumbers.map((p) => ({
      number: p.number,
      label: p.label,
    })),
    addresses: addresses.map((a) => ({
      address: a.address,
      label: a.label,
    })),
    employmentHistory: employmentHistory.map((e) => ({
      role: e.role,
      department: e.department,
      startDate: e.start_date,
      endDate: e.end_date,
    })),
    salaryHistory: salaryHistory
      .map((s) => ({
        amount: Number(s.amount),
        paymentMethod: s.payment_method as SalaryRecord['paymentMethod'],
        effectiveDate: s.effective_date,
      }))
      .sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime()),
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
  }
}

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export async function fetchEmployees(
  householdId: string,
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<Employee>> {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  // Fetch employees with pagination
  const { data: employees, error: employeesError, count } = await supabase
    .from('employees')
    .select('*', { count: 'exact' })
    .eq('household_id', householdId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (employeesError) {
    throw new Error(`Failed to fetch employees: ${employeesError.message}`)
  }

  if (!employees || employees.length === 0) {
    return { data: [], total: count || 0, page, pageSize }
  }

  // Fetch all related data for these employees
  const employeeIds = employees.map((e) => e.id)

  const [
    { data: phoneNumbers },
    { data: addresses },
    { data: employmentHistory },
    { data: salaryHistory },
    { data: documents },
    { data: customProperties },
    { data: notes },
  ] = await Promise.all([
    supabase.from('employee_phone_numbers').select('*').in('employee_id', employeeIds),
    supabase.from('employee_addresses').select('*').in('employee_id', employeeIds),
    supabase.from('employment_history').select('*').in('employee_id', employeeIds),
    supabase.from('salary_history').select('*').in('employee_id', employeeIds),
    supabase.from('employee_documents').select('*').in('employee_id', employeeIds),
    supabase.from('employee_custom_properties').select('*').in('employee_id', employeeIds),
    supabase.from('employee_notes').select('*').in('employee_id', employeeIds),
  ])

  // Group related data by employee_id
  const phoneNumbersByEmployee = new Map<number, any[]>()
  const addressesByEmployee = new Map<number, any[]>()
  const employmentHistoryByEmployee = new Map<number, any[]>()
  const salaryHistoryByEmployee = new Map<number, any[]>()
  const documentsByEmployee = new Map<number, any[]>()
  const customPropertiesByEmployee = new Map<number, any[]>()
  const notesByEmployee = new Map<number, any[]>()

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

  employmentHistory?.forEach((e) => {
    const arr = employmentHistoryByEmployee.get(e.employee_id) || []
    arr.push(e)
    employmentHistoryByEmployee.set(e.employee_id, arr)
  })

  salaryHistory?.forEach((s) => {
    const arr = salaryHistoryByEmployee.get(s.employee_id) || []
    arr.push(s)
    salaryHistoryByEmployee.set(s.employee_id, arr)
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

  // Transform to Employee interface
  const transformedEmployees = employees.map((employee) =>
    transformToEmployee(
      employee,
      phoneNumbersByEmployee.get(employee.id) || [],
      addressesByEmployee.get(employee.id) || [],
      employmentHistoryByEmployee.get(employee.id) || [],
      salaryHistoryByEmployee.get(employee.id) || [],
      documentsByEmployee.get(employee.id) || [],
      customPropertiesByEmployee.get(employee.id) || [],
      notesByEmployee.get(employee.id) || []
    )
  )

  return {
    data: transformedEmployees,
    total: count || 0,
    page,
    pageSize,
  }
}

export async function fetchEmployee(id: string): Promise<Employee | null> {
  const employeeId = Number(id)

  // Fetch employee
  const { data: employee, error: employeeError } = await supabase
    .from('employees')
    .select('*')
    .eq('id', employeeId)
    .single()

  if (employeeError || !employee) {
    return null
  }

  // Fetch all related data
  const [
    { data: phoneNumbers },
    { data: addresses },
    { data: employmentHistory },
    { data: salaryHistory },
    { data: documents },
    { data: customProperties },
    { data: notes },
  ] = await Promise.all([
    supabase.from('employee_phone_numbers').select('*').eq('employee_id', employeeId),
    supabase.from('employee_addresses').select('*').eq('employee_id', employeeId),
    supabase.from('employment_history').select('*').eq('employee_id', employeeId),
    supabase.from('salary_history').select('*').eq('employee_id', employeeId),
    supabase.from('employee_documents').select('*').eq('employee_id', employeeId),
    supabase.from('employee_custom_properties').select('*').eq('employee_id', employeeId),
    supabase.from('employee_notes').select('*').eq('employee_id', employeeId),
  ])

  return transformToEmployee(
    employee,
    phoneNumbers || [],
    addresses || [],
    employmentHistory || [],
    salaryHistory || [],
    documents || [],
    customProperties || [],
    notes || []
  )
}

export async function createEmployee(
  employee: Omit<Employee, 'id'>
): Promise<Employee> {
  const householdId = Number(employee.householdId)

  // Insert employee
  const { data: newEmployee, error: employeeError } = await supabase
    .from('employees')
    .insert({
      household_id: householdId,
      name: employee.name,
      photo: employee.photo,
      status: employee.status,
      holiday_balance: employee.holidayBalance,
    })
    .select()
    .single()

  if (employeeError || !newEmployee) {
    throw new Error(`Failed to create employee: ${employeeError?.message}`)
  }

  const employeeId = newEmployee.id

  // Insert related data
  const insertPromises: Promise<any>[] = []

  if (employee.phoneNumbers.length > 0) {
    insertPromises.push(
      supabase
        .from('employee_phone_numbers')
        .insert(
          employee.phoneNumbers.map((p) => ({
            employee_id: employeeId,
            number: p.number,
            label: p.label,
          }))
        )
        .then((result) => result)
    )
  }

  if (employee.addresses.length > 0) {
    insertPromises.push(
      supabase
        .from('employee_addresses')
        .insert(
          employee.addresses.map((a) => ({
            employee_id: employeeId,
            address: a.address,
            label: a.label,
          }))
        )
        .then((result) => result)
    )
  }

  if (employee.employmentHistory.length > 0) {
    insertPromises.push(
      supabase
        .from('employment_history')
        .insert(
          employee.employmentHistory.map((e) => ({
            employee_id: employeeId,
            role: e.role,
            department: e.department,
            start_date: e.startDate,
            end_date: e.endDate,
          }))
        )
        .then((result) => result)
    )
  }

  if (employee.salaryHistory.length > 0) {
    insertPromises.push(
      supabase
        .from('salary_history')
        .insert(
          employee.salaryHistory.map((s) => ({
            employee_id: employeeId,
            amount: s.amount,
            payment_method: s.paymentMethod,
            effective_date: s.effectiveDate,
          }))
        )
        .then((result) => result)
    )
  }

  if (employee.documents.length > 0) {
    insertPromises.push(
      supabase
        .from('employee_documents')
        .insert(
          employee.documents.map((d) => ({
            employee_id: employeeId,
            name: d.name,
            url: d.url,
            category: d.category,
            uploaded_at: d.uploadedAt,
          }))
        )
        .then((result) => result)
    )
  }

  if (employee.customProperties.length > 0) {
    insertPromises.push(
      supabase
        .from('employee_custom_properties')
        .insert(
          employee.customProperties.map((p) => ({
            employee_id: employeeId,
            name: p.name,
            value: p.value,
          }))
        )
        .then((result) => result)
    )
  }

  if (employee.notes.length > 0) {
    insertPromises.push(
      supabase
        .from('employee_notes')
        .insert(
          employee.notes.map((n) => ({
            employee_id: employeeId,
            content: n.content,
            created_at: n.createdAt,
          }))
        )
        .then((result) => result)
    )
  }

  await Promise.all(insertPromises)

  // Fetch and return the complete employee
  const createdEmployee = await fetchEmployee(idToString(employeeId))
  if (!createdEmployee) {
    throw new Error('Failed to fetch created employee')
  }
  return createdEmployee
}

export async function updateEmployee(
  id: string,
  updates: Partial<Omit<Employee, 'id'>>
): Promise<Employee> {
  const employeeId = Number(id)

  // Update employee main record
  if (updates.name || updates.photo || updates.status !== undefined || updates.holidayBalance !== undefined) {
    const updateData: any = {}
    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.photo !== undefined) updateData.photo = updates.photo
    if (updates.status !== undefined) updateData.status = updates.status
    if (updates.holidayBalance !== undefined) updateData.holiday_balance = updates.holidayBalance

    const { error: updateError } = await supabase
      .from('employees')
      .update(updateData)
      .eq('id', employeeId)

    if (updateError) {
      throw new Error(`Failed to update employee: ${updateError.message}`)
    }
  }

  // Update related tables - delete and reinsert for simplicity
  // (In a production app, you might want to do more sophisticated diffing)

  if (updates.phoneNumbers !== undefined) {
    await supabase.from('employee_phone_numbers').delete().eq('employee_id', employeeId)
    if (updates.phoneNumbers.length > 0) {
      await supabase.from('employee_phone_numbers').insert(
        updates.phoneNumbers.map((p) => ({
          employee_id: employeeId,
          number: p.number,
          label: p.label,
        }))
      )
    }
  }

  if (updates.addresses !== undefined) {
    await supabase.from('employee_addresses').delete().eq('employee_id', employeeId)
    if (updates.addresses.length > 0) {
      await supabase.from('employee_addresses').insert(
        updates.addresses.map((a) => ({
          employee_id: employeeId,
          address: a.address,
          label: a.label,
        }))
      )
    }
  }

  if (updates.employmentHistory !== undefined) {
    await supabase.from('employment_history').delete().eq('employee_id', employeeId)
    if (updates.employmentHistory.length > 0) {
      await supabase.from('employment_history').insert(
        updates.employmentHistory.map((e) => ({
          employee_id: employeeId,
          role: e.role,
          department: e.department,
          start_date: e.startDate,
          end_date: e.endDate,
        }))
      )
    }
  }

  if (updates.salaryHistory !== undefined) {
    await supabase.from('salary_history').delete().eq('employee_id', employeeId)
    if (updates.salaryHistory.length > 0) {
      await supabase.from('salary_history').insert(
        updates.salaryHistory.map((s) => ({
          employee_id: employeeId,
          amount: s.amount,
          payment_method: s.paymentMethod,
          effective_date: s.effectiveDate,
        }))
      )
    }
  }

  if (updates.customProperties !== undefined) {
    await supabase.from('employee_custom_properties').delete().eq('employee_id', employeeId)
    if (updates.customProperties.length > 0) {
      await supabase.from('employee_custom_properties').insert(
        updates.customProperties.map((p) => ({
          employee_id: employeeId,
          name: p.name,
          value: p.value,
        }))
      )
    }
  }

  if (updates.notes !== undefined) {
    await supabase.from('employee_notes').delete().eq('employee_id', employeeId)
    if (updates.notes.length > 0) {
      await supabase.from('employee_notes').insert(
        updates.notes.map((n) => ({
          employee_id: employeeId,
          content: n.content,
          created_at: n.createdAt,
        }))
      )
    }
  }

  // Fetch and return updated employee
  const updatedEmployee = await fetchEmployee(id)
  if (!updatedEmployee) {
    throw new Error('Failed to fetch updated employee')
  }
  return updatedEmployee
}

export async function archiveEmployee(id: string): Promise<void> {
  const employeeId = Number(id)
  const { error } = await supabase
    .from('employees')
    .update({ status: 'archived' })
    .eq('id', employeeId)

  if (error) {
    throw new Error(`Failed to archive employee: ${error.message}`)
  }
}

export async function restoreEmployee(id: string): Promise<void> {
  const employeeId = Number(id)
  const { error } = await supabase
    .from('employees')
    .update({ status: 'active' })
    .eq('id', employeeId)

  if (error) {
    throw new Error(`Failed to restore employee: ${error.message}`)
  }
}
