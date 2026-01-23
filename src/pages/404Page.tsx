import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-50 dark:bg-stone-900">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-6xl font-bold text-stone-900 dark:text-stone-100 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
          Page Not Found
        </h2>
        <p className="text-stone-600 dark:text-stone-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
