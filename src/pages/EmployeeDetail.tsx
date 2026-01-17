import { useParams } from 'react-router-dom'

export function EmployeeDetail() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
        Employee Detail
      </h1>
      <p className="mt-2 text-stone-600 dark:text-stone-400">
        Employee ID: {id}
      </p>
      <p className="mt-2 text-stone-600 dark:text-stone-400">
        This is a placeholder page. Employee detail content will be implemented in a later milestone.
      </p>
    </div>
  )
}
