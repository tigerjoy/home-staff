import { useRequireAdmin } from '../hooks/useRequireAdmin'

export function Payroll() {
  const { isAdmin, loading } = useRequireAdmin()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-stone-600 dark:text-stone-400">Loading...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
            Access Restricted
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mb-4">
            You need admin access to view the Payroll & Finance section. Please contact a household admin to upgrade your role.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
        Payroll & Finance
      </h1>
      <p className="mt-2 text-stone-600 dark:text-stone-400">
        This is a placeholder page. Payroll and finance content will be implemented in a later milestone.
      </p>
    </div>
  )
}
