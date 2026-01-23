import type { UIEmployee } from '../../types'

/**
 * Export employees to CSV format
 */
export function exportToCSV(employees: UIEmployee[], filename: string): void {
  // Define CSV headers
  const headers = [
    'Name',
    'Role',
    'Phone',
    'Email',
    'Start Date',
    'Holiday Balance',
    'Current Salary',
    'Payment Method',
    'Status',
  ]

  // Convert employees to CSV rows
  const rows = employees.map((emp) => {
    const currentRole = emp.employmentHistory.find((e) => !e.endDate) || emp.employmentHistory[0]
    const currentSalary = emp.salaryHistory[0]

    return [
      emp.name || '',
      currentRole?.role || '',
      emp.phoneNumbers.map((p) => p.number).join('; ') || '',
      '', // Email not in employee data
      currentRole?.startDate || '',
      emp.holidayBalance.toString(),
      currentSalary?.amount.toString() || '',
      currentSalary?.paymentMethod || '',
      emp.status,
    ]
  })

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export employees to PDF format
 * Note: This is a basic implementation. For production, consider using a library like jsPDF or pdfkit
 */
export function exportToPDF(employees: UIEmployee[]): void {
  // Create a simple HTML table for PDF generation
  const tableRows = employees
    .map((emp) => {
      const currentRole = emp.employmentHistory.find((e) => !e.endDate) || emp.employmentHistory[0]
      const currentSalary = emp.salaryHistory[0]

      return `
      <tr>
        <td>${escapeHtml(emp.name || '')}</td>
        <td>${escapeHtml(currentRole?.role || '')}</td>
        <td>${escapeHtml(emp.phoneNumbers.map((p) => p.number).join(', ') || '')}</td>
        <td>${escapeHtml(currentRole?.startDate || '')}</td>
        <td>${emp.holidayBalance}</td>
        <td>${currentSalary?.amount || ''}</td>
        <td>${escapeHtml(currentSalary?.paymentMethod || '')}</td>
        <td>${escapeHtml(emp.status)}</td>
      </tr>
    `
    })
    .join('')

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Staff Directory</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          h1 {
            color: #333;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
        </style>
      </head>
      <body>
        <h1>Staff Directory</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Start Date</th>
              <th>Holiday Balance</th>
              <th>Current Salary</th>
              <th>Payment Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `

  // Create blob and open in new window for printing/saving as PDF
  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const windowRef = window.open(url, '_blank')

  if (windowRef) {
    windowRef.onload = () => {
      setTimeout(() => {
        windowRef.print()
        URL.revokeObjectURL(url)
      }, 250)
    }
  } else {
    // Fallback: download as HTML file
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `staff-directory-${new Date().toISOString().split('T')[0]}.html`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}
