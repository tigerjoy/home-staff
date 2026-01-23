export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-50 dark:bg-stone-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-stone-600 dark:text-stone-400">Loading...</p>
      </div>
    </div>
  )
}
