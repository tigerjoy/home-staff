import type { Employee } from '../../types'

/**
 * Export employees to CSV format
 */
export function exportToCSV(employees: Employee[], filename: string = 'staff-directory.csv'): void {
  // Get current role and salary for each employee
  const rows = employees.map((emp) => {
    const currentRole = emp.employmentHistory.find((e) => e.endDate === null)
    const currentSalary = emp.salaryHistory[0]
    const primaryPhone = emp.phoneNumbers[0]

    return {
      Name: emp.name,
      Role: currentRole?.role || '',
      Department: currentRole?.department || '',
      Phone: primaryPhone?.number || '',
      'Holiday Balance': emp.holidayBalance,
      Salary: currentSalary ? `₹${currentSalary.amount.toLocaleString('en-IN')}` : '',
      'Payment Method': currentSalary?.paymentMethod || '',
      Status: emp.status,
    }
  })

  // Create CSV header
  const headers = Object.keys(rows[0] || {})
  const csvRows = [headers.join(',')]

  // Create CSV rows
  rows.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header as keyof typeof row]
      // Escape quotes and wrap in quotes if contains comma
      const stringValue = String(value)
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    })
    csvRows.push(values.join(','))
  })

  // Create blob and download
  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export employees to PDF format using browser print API
 */
export function exportToPDF(employees: Employee[]): void {
  // Create a temporary window with formatted content
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Please allow pop-ups to generate PDF')
    return
  }

  // Format employees data
  const currentRole = (emp: Employee) => emp.employmentHistory.find((e) => e.endDate === null)
  const currentSalary = (emp: Employee) => emp.salaryHistory[0]
  const primaryPhone = (emp: Employee) => emp.phoneNumbers[0]

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Staff Directory Report</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 20px;
            color: #1c1917;
          }
          h1 {
            color: #92400e;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #e7e5e4;
          }
          th {
            background-color: #fef3c7;
            font-weight: 600;
            color: #78350f;
          }
          tr:hover {
            background-color: #fef3c7;
          }
          .summary {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #fef3c7;
            border-radius: 8px;
          }
        </style>
      </head>
      <body>
        <h1>Staff Directory Report</h1>
        <div class="summary">
          <p><strong>Total Staff:</strong> ${employees.length}</p>
          <p><strong>Generated:</strong> ${new Date().toLocaleString('en-IN')}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Phone</th>
              <th>Holiday Balance</th>
              <th>Salary</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${employees
              .map(
                (emp) => `
              <tr>
                <td>${emp.name}</td>
                <td>${currentRole(emp)?.role || '—'}</td>
                <td>${currentRole(emp)?.department || '—'}</td>
                <td>${primaryPhone(emp)?.number || '—'}</td>
                <td>${emp.holidayBalance} days</td>
                <td>${currentSalary(emp) ? formatSalary(currentSalary(emp)!.amount) : '—'}</td>
                <td>${emp.status}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()

  // Wait for content to load, then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }
}
