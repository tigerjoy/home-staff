import { useState, useMemo } from 'react'
import { Shield, CheckCircle } from 'lucide-react'
import type { Member, PermissionsMap } from './types'
import { dbToUiPermissions, uiToDbPermissions } from '../../lib/permissions/permissionMapping'

interface PermissionsManagementProps {
  members: Member[]
  permissions: PermissionsMap
  isAdmin: boolean
  onUpdatePermissions?: (memberId: string, permissions: string[]) => void
}

export function PermissionsManagement({
  members,
  permissions,
  isAdmin,
  onUpdatePermissions,
}: PermissionsManagementProps) {
  const basePermissions = useMemo(() => {
    const m = new Map<string, string[]>()
    members.forEach((member) => {
      if (member.permissions && member.permissions.length > 0) {
        // Convert database format (snake_case) to UI format (Title Case)
        const uiPermissions = dbToUiPermissions(member.permissions)
        m.set(member.id, uiPermissions)
      } else {
        // Use default permissions from the permissions map (already in UI format)
        m.set(member.id, permissions[member.role] || [])
      }
    })
    return m
  }, [members, permissions])

  const [overrides, setOverrides] = useState<Map<string, string[]>>(new Map())

  const allPermissions = [...permissions.Admin].sort()
  const memberDefaultPermissions = permissions.Member

  const handleTogglePermission = (memberId: string, permission: string) => {
    if (!isAdmin) return

    const base = basePermissions.get(memberId) || []
    const current = overrides.get(memberId) ?? base
    const updated = current.includes(permission)
      ? current.filter((p) => p !== permission)
      : [...current, permission]

    setOverrides(new Map(overrides).set(memberId, updated))
    
    // Convert UI format back to database format before calling the callback
    const dbPermissions = uiToDbPermissions(updated)
    onUpdatePermissions?.(memberId, dbPermissions)
  }

  const getMemberPermissions = (memberId: string): string[] => {
    return overrides.get(memberId) ?? basePermissions.get(memberId) ?? []
  }

  return (
    <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/50">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-500" />
          Member Permissions
        </h3>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          {isAdmin
            ? 'Admins always have full access. Customize permissions for each Member.'
            : 'View permissions for each member.'}
        </p>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-8 text-stone-500 dark:text-stone-400">
          No members found
        </div>
      ) : (
        <div className="space-y-6">
          {members.map((member) => {
            const isAdminRole = member.role === 'Admin'
            const memberPerms = getMemberPermissions(member.id)
            const defaultPerms = memberDefaultPermissions

            return (
              <div
                key={member.id}
                className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-stone-900 dark:text-stone-100">
                      {member.name}
                    </h4>
                    <p className="text-sm text-stone-500 dark:text-stone-400">{member.email}</p>
                  </div>
                  <span
                    className={`
                      px-2.5 py-1 rounded-lg text-xs font-medium
                      ${
                        isAdminRole
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                          : 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-400'
                      }
                    `}
                  >
                    {member.role}
                  </span>
                </div>

                {isAdminRole ? (
                  <div className="flex items-center gap-2 py-2 text-sm text-stone-600 dark:text-stone-400">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    <span>Full access — all permissions</span>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {allPermissions.map((permission) => {
                      const isChecked = memberPerms.includes(permission)
                      const isDefault = defaultPerms.includes(permission)
                      const isDisabled = !isAdmin

                      return (
                        <label
                          key={permission}
                          className={`
                            flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors
                            ${
                              isDisabled
                                ? 'cursor-not-allowed opacity-60'
                                : 'hover:bg-stone-100 dark:hover:bg-stone-700'
                            }
                            ${
                              isChecked
                                ? 'bg-amber-50 dark:bg-amber-950/20'
                                : 'bg-white dark:bg-stone-800'
                            }
                          `}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleTogglePermission(member.id, permission)}
                            disabled={isDisabled}
                            className="w-4 h-4 rounded border-stone-300 text-amber-500 focus:ring-amber-500 focus:ring-2"
                          />
                          <span className="text-sm text-stone-700 dark:text-stone-300 flex-1">
                            {permission}
                          </span>
                          {isDefault && !isChecked && (
                            <span className="text-xs text-stone-400">(default)</span>
                          )}
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
