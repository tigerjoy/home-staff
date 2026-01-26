import { useNavigate } from 'react-router-dom'
import { X, Home, Star, ChevronRight } from 'lucide-react'

export interface SwitchHouseholdModalHousehold {
  id: string
  name: string
  role: 'Admin' | 'Member'
  isPrimary: boolean
  status?: 'active' | 'archived'
  memberStatus?: 'active' | 'pending'
}

interface SwitchHouseholdModalProps {
  households: SwitchHouseholdModalHousehold[]
  activeHouseholdId: string | null
  onSelect: (id: string, name: string) => void
  onClose: () => void
}

function isSwitchable(
  h: SwitchHouseholdModalHousehold,
  activeHouseholdId: string | null
): boolean {
  if (h.id === activeHouseholdId) return false
  if (h.status === 'archived') return false
  if (h.memberStatus === 'pending') return false
  return true
}

export function SwitchHouseholdModal({
  households,
  activeHouseholdId,
  onSelect,
  onClose,
}: SwitchHouseholdModalProps) {
  const navigate = useNavigate()
  const switchable = households.filter((h) => isSwitchable(h, activeHouseholdId))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-stone-700 shrink-0">
          <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
            Switch Household
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:text-stone-300 dark:hover:bg-stone-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1 min-h-0">
          {switchable.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-stone-600 dark:text-stone-400 mb-4">
                No other households to switch to.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose()
                  navigate('/settings')
                }}
                className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:underline"
              >
                Manage households in Settings
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {switchable.map((household) => (
                <button
                  key={household.id}
                  type="button"
                  onClick={() => onSelect(household.id, household.name)}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-800/50 hover:border-amber-300 dark:hover:border-amber-600 hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-all duration-200 text-left"
                >
                  <div
                    className={`
                      flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                      ${
                        household.isPrimary
                          ? 'bg-amber-500 text-white'
                          : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                      }
                    `}
                  >
                    <Home className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                        {household.name}
                      </span>
                      {household.isPrimary && (
                        <Star className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      )}
                    </div>
                    <span
                      className={`
                        inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium
                        ${
                          household.role === 'Admin'
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                            : 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-400'
                        }
                      `}
                    >
                      {household.role}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
