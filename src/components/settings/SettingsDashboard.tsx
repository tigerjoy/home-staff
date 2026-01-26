import { useState } from 'react'
import type { SettingsAndAccessProps, Household, Member } from './types'
import {
  Home,
  Users,
  Shield,
  Plus,
  MoreVertical,
  Edit3,
  Archive,
  Trash2,
  CheckCircle,
  ChevronRight,
  X,
  Star,
  Copy,
  RefreshCw,
  Clock,
} from 'lucide-react'
import { InvitationCodeCard } from './InvitationCodeCard'
import { JoinHouseholdModal } from './JoinHouseholdModal'
import { SwitchHouseholdDialog } from './SwitchHouseholdDialog'
import { ProfileEditModal } from './ProfileEditModal'
import { PermissionsManagement } from './PermissionsManagement'
import { useHouseholdAccess } from '../../hooks/useAccessControl'
import { AccessDenied } from '../common/AccessDenied'

// Sub-components
function HouseholdCard({
  household,
  isActive,
  onSwitch,
  onRename,
  onArchive,
  onSetPrimary,
}: {
  household: Household
  isActive: boolean
  onSwitch?: () => void
  onRename?: () => void
  onArchive?: () => void
  onSetPrimary?: () => void
}) {
  const [showMenu, setShowMenu] = useState(false)
  const isArchived = household.status === 'archived'
  const isPending = household.memberStatus === 'pending'
  const canSwitch = !isArchived && !isPending && !isActive

  const handleCardClick = () => {
    if (canSwitch && onSwitch) {
      onSwitch()
    }
  }

  return (
    <div
      onClick={handleCardClick}
      className={`
        group relative p-4 rounded-xl border transition-all duration-200
        ${
          isActive
            ? 'border-amber-300 bg-amber-50/50 dark:border-amber-700 dark:bg-amber-950/30'
            : household.isPrimary
              ? 'border-amber-200 bg-amber-50/30 dark:border-amber-800 dark:bg-amber-950/20'
              : isArchived
                ? 'border-stone-200 bg-stone-100/50 dark:border-stone-700 dark:bg-stone-800/30 opacity-60'
                : isPending
                  ? 'border-stone-200 bg-stone-100/30 dark:border-stone-700 dark:bg-stone-800/20 opacity-70'
                  : canSwitch
                    ? 'border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-800/50 hover:border-amber-300 dark:hover:border-amber-600 cursor-pointer'
                    : 'border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-800/50'
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className={`
              flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
              ${
                household.isPrimary
                  ? 'bg-amber-500 text-white'
                  : isArchived
                    ? 'bg-stone-300 dark:bg-stone-600 text-stone-500 dark:text-stone-400'
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
              }
            `}
          >
            <Home className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                {household.name}
              </h3>
              {isActive && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-amber-500 text-white dark:bg-amber-600">
                  <CheckCircle className="w-3 h-3" />
                  Active
                </span>
              )}
              {household.isPrimary && !isActive && (
                <Star className="w-4 h-4 text-amber-500 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`
                  text-xs px-2 py-0.5 rounded-full font-medium
                  ${
                    household.role === 'Admin'
                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                      : 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-400'
                  }
                `}
              >
                {household.role}
              </span>
              {isPending && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                  Pending
                </span>
              )}
              {isArchived && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-stone-200 text-stone-500 dark:bg-stone-600 dark:text-stone-400">
                  Archived
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        {household.role === 'Admin' && !isArchived && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:text-stone-300 dark:hover:bg-stone-700 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-8 z-20 w-40 bg-white dark:bg-stone-800 rounded-lg shadow-lg border border-stone-200 dark:border-stone-700 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  {!household.isPrimary && onSetPrimary && (
                    <button
                      onClick={() => {
                        onSetPrimary()
                        setShowMenu(false)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
                    >
                      <Star className="w-4 h-4" />
                      Set Primary
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onRename?.()
                      setShowMenu(false)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
                  >
                    <Edit3 className="w-4 h-4" />
                    Rename
                  </button>
                  {!household.isPrimary && (
                    <button
                      onClick={() => {
                        onArchive?.()
                        setShowMenu(false)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Archive className="w-4 h-4" />
                      Archive
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Switch Button - Only show for non-active, non-archived, non-pending households */}
      {canSwitch && (
        <div className="mt-3 flex items-center justify-center gap-2 py-2 text-sm font-medium text-amber-600 dark:text-amber-400">
          Click to switch
          <ChevronRight className="w-4 h-4" />
        </div>
      )}
    </div>
  )
}

function MemberRow({
  member,
  isCurrentUser,
  isAdmin,
  onChangeRole,
  onRemove,
  onApprove,
  onReject,
}: {
  member: Member
  isCurrentUser: boolean
  isAdmin: boolean
  onChangeRole?: () => void
  onRemove?: () => void
  onApprove?: () => void
  onReject?: () => void
}) {
  const [showMenu, setShowMenu] = useState(false)
  const isPending = member.status === 'pending'
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
      {/* Avatar */}
      {member.avatarUrl ? (
        <img
          src={member.avatarUrl}
          alt={member.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
          {initials}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-stone-900 dark:text-stone-100 truncate">
            {member.name}
          </span>
          {isCurrentUser && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              You
            </span>
          )}
        </div>
        <p className="text-sm text-stone-500 dark:text-stone-400 truncate">
          {member.email}
        </p>
      </div>

      {/* Role Badge */}
      <span
        className={`
          hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium
          ${
            member.role === 'Admin'
              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
              : 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-400'
          }
        `}
      >
        {member.role}
        <span className={member.role === 'Admin' ? 'opacity-100' : 'opacity-0'}>:</span>
      </span>

      {/* Status */}
      {isPending ? (
        <div className="hidden md:flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400">
          <Clock className="w-4 h-4" />
          <span>Pending</span>
        </div>
      ) : (
        <div className="hidden md:flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
          <CheckCircle className="w-4 h-4" />
          <span>Active</span>
        </div>
      )}

      {/* Actions */}
      {!isCurrentUser && (
        <div className="relative">
          {isPending && isAdmin ? (
            // Show approve/reject buttons for pending members (admin only)
            <div className="flex items-center gap-2">
              <button
                onClick={onApprove}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-green-500 hover:bg-green-600 text-white transition-colors"
              >
                Approve
              </button>
              <button
                onClick={onReject}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors"
              >
                Reject
              </button>
            </div>
          ) : (
            // Show menu for active members
            <>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:text-stone-300 dark:hover:bg-stone-700 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-10 z-20 w-44 bg-white dark:bg-stone-800 rounded-lg shadow-lg border border-stone-200 dark:border-stone-700 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={() => {
                        onChangeRole?.()
                        setShowMenu(false)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
                    >
                      <Shield className="w-4 h-4" />
                      Change Role
                    </button>
                    <button
                      onClick={() => {
                        onRemove?.()
                        setShowMenu(false)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove Member
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}


// Main Component
export function SettingsDashboard({
  userProfile,
  households,
  members,
  invitationCode,
  permissions,
  onUpdateProfile,
  onSwitchHousehold,
  onCreateHousehold,
  onRenameHousehold,
  onArchiveHousehold,
  onRegenerateInvitationCode,
  onJoinHousehold,
  onChangeMemberRole,
  onRemoveMember,
  onSetPrimaryHousehold,
  onApproveMember,
  onRejectMember,
  onUpdateMemberPermissions,
  activeHouseholdId,
}: SettingsAndAccessProps) {
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newHouseholdName, setNewHouseholdName] = useState('')
  const [renamingHousehold, setRenamingHousehold] = useState<{
    id: string
    name: string
  } | null>(null)
  const [switchingHousehold, setSwitchingHousehold] = useState<{
    id: string
    name: string
  } | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'households' | 'members' | 'permissions'>(
    'households'
  )

  // Check access for active household
  const {
    hasAccess,
    isPending: isPendingMember,
    loading: accessLoading,
  } = useHouseholdAccess(activeHouseholdId)

  const activeHouseholds = households.filter((h) => h.status === 'active')
  const archivedHouseholds = households.filter((h) => h.status === 'archived')
  const currentUserMember = members.find((m) => m.email === userProfile.email)
  const isAdmin = currentUserMember?.role === 'Admin' || false

  // Show access denied if user is pending and trying to access household-specific tabs
  if (activeHouseholdId && !accessLoading && !hasAccess && (activeTab === 'members' || activeTab === 'permissions')) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <AccessDenied isPending={isPendingMember} showSettingsLink={false} />
        </div>
      </div>
    )
  }

  const handleCreateHousehold = () => {
    if (newHouseholdName.trim()) {
      onCreateHousehold?.(newHouseholdName.trim())
      setNewHouseholdName('')
      setShowCreateModal(false)
    }
  }

  const handleRenameHousehold = () => {
    if (renamingHousehold && renamingHousehold.name.trim()) {
      onRenameHousehold?.(renamingHousehold.id, renamingHousehold.name.trim())
      setRenamingHousehold(null)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
            Settings
          </h1>
          <p className="mt-2 text-stone-600 dark:text-stone-400">
            Manage your households, team members, and access permissions
          </p>
        </div>

        {/* Profile Card */}
        <div className="mb-8 p-6 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/50">
          <div className="flex items-center gap-4">
            {userProfile.avatarUrl ? (
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-amber-100 dark:ring-amber-900/40"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl ring-4 ring-amber-100 dark:ring-amber-900/40">
                {userProfile.name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                {userProfile.name}
              </h2>
              <p className="text-stone-500 dark:text-stone-400">{userProfile.email}</p>
            </div>
            <button
              onClick={() => setShowProfileModal(true)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 mb-6 rounded-xl bg-stone-200/50 dark:bg-stone-800/50">
          {[
            { id: 'households' as const, icon: Home, label: 'Households' },
            { id: 'members' as const, icon: Users, label: 'Members' },
            { id: 'permissions' as const, icon: Shield, label: 'Permissions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'households' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Active Households */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                  Your Households
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowJoinModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 text-sm font-medium transition-colors"
                  >
                    Join Household
                  </button>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create New
                  </button>
                </div>
              </div>
              
              <div className="grid gap-4">
                {activeHouseholds.map((household) => (
                  <HouseholdCard
                    key={household.id}
                    household={household}
                    isActive={household.id === activeHouseholdId}
                    onSwitch={() =>
                      setSwitchingHousehold({ id: household.id, name: household.name })
                    }
                    onRename={() =>
                      setRenamingHousehold({ id: household.id, name: household.name })
                    }
                    onArchive={() => onArchiveHousehold?.(household.id)}
                    onSetPrimary={() => onSetPrimaryHousehold?.(household.id)}
                  />
                ))}
              </div>
            </div>

            {/* Archived */}
            {archivedHouseholds.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-stone-500 dark:text-stone-400 mb-4">
                  Archived
                </h3>
                <div className="grid gap-4">
                  {archivedHouseholds.map((household) => (
                    <HouseholdCard key={household.id} household={household} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Invitation Code Card */}
            {isAdmin && (
              <InvitationCodeCard
                invitationCode={invitationCode}
                onRegenerate={onRegenerateInvitationCode}
                isAdmin={isAdmin}
              />
            )}

            {/* Members List */}
            <div>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
                Team Members
              </h3>
              <div className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/50 overflow-hidden divide-y divide-stone-200 dark:divide-stone-700">
                {members.length === 0 ? (
                  <div className="p-8 text-center text-stone-500 dark:text-stone-400">
                    No members found
                  </div>
                ) : (
                  members.map((member) => (
                    <MemberRow
                      key={member.id}
                      member={member}
                      isCurrentUser={member.email === userProfile.email}
                      isAdmin={isAdmin}
                      onChangeRole={() =>
                        onChangeMemberRole?.(
                          member.id,
                          member.role === 'Admin' ? 'Member' : 'Admin'
                        )
                      }
                      onRemove={() => onRemoveMember?.(member.id)}
                      onApprove={() => onApproveMember?.(member.id)}
                      onReject={() => onRejectMember?.(member.id)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'permissions' && (
          <div className="animate-in fade-in duration-200">
            <PermissionsManagement
              key={activeHouseholdId ?? 'none'}
              members={members}
              permissions={permissions}
              isAdmin={isAdmin}
              onUpdatePermissions={onUpdateMemberPermissions}
            />
          </div>
        )}
      </div>

      {/* Join Household Modal */}
      {showJoinModal && (
        <JoinHouseholdModal
          onClose={() => setShowJoinModal(false)}
          onJoin={async (code) => {
            await onJoinHousehold?.(code)
            setShowJoinModal(false)
          }}
        />
      )}

      {/* Create Household Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-stone-700">
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                Create Household
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:text-stone-300 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Household Name
                </label>
                <input
                  type="text"
                  value={newHouseholdName}
                  onChange={(e) => setNewHouseholdName(e.target.value)}
                  placeholder="Enter household name"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateHousehold()
                    }
                  }}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateHousehold}
                  disabled={!newHouseholdName.trim()}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 dark:disabled:bg-stone-700 text-white font-medium transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {showProfileModal && onUpdateProfile && (
        <ProfileEditModal
          userProfile={userProfile}
          onClose={() => setShowProfileModal(false)}
          onSave={async (updates) => {
            await onUpdateProfile(updates)
            setShowProfileModal(false)
          }}
        />
      )}

      {/* Switch Household Confirmation Dialog */}
      {switchingHousehold && (
        <SwitchHouseholdDialog
          householdName={switchingHousehold.name}
          onConfirm={() => {
            onSwitchHousehold?.(switchingHousehold.id)
            setSwitchingHousehold(null)
          }}
          onCancel={() => setSwitchingHousehold(null)}
        />
      )}

      {/* Rename Household Modal */}
      {renamingHousehold && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
            onClick={() => setRenamingHousehold(null)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-stone-700">
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                Rename Household
              </h2>
              <button
                onClick={() => setRenamingHousehold(null)}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:text-stone-300 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Household Name
                </label>
                <input
                  type="text"
                  value={renamingHousehold.name}
                  onChange={(e) =>
                    setRenamingHousehold({ ...renamingHousehold, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRenameHousehold()
                    }
                  }}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setRenamingHousehold(null)}
                  className="flex-1 py-3 px-4 rounded-xl border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRenameHousehold}
                  disabled={!renamingHousehold.name.trim()}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 dark:disabled:bg-stone-700 text-white font-medium transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
