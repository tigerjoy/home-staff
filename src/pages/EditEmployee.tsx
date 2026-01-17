import { useParams } from 'react-router-dom'

export function EditEmployee() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
        Edit Employee
      </h1>
      <p className="mt-2 text-stone-600 dark:text-stone-400">
        Employee ID: {id}
      </p>
      <p className="mt-2 text-stone-600 dark:text-stone-400">
        This is a placeholder page. Edit employee form will be implemented in a later milestone.
      </p>
    </div>
  )
}
