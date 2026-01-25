import { useState } from 'react'
import type {
  SettingsAndAccessProps,
  Household,
  Member,
  Invitation,
} from '../types'
import {
  Home,
  Users,
  Shield,
  Plus,
  MoreVertical,
  Edit3,
  Archive,
  Trash2,
  Mail,
  CheckCircle,
  Clock,
  ChevronRight,
  X,
  User,
  Star,
} from 'lucide-react'

// Sub-components
function HouseholdCard({
  household,
  onSwitch,
  onRename,
  onArchive,
}: {
  household: Household
  onSwitch?: () => void
  onRename?: () => void
  onArchive?: () => void
}) {
  const [showMenu, setShowMenu] = useState(false)
  const isArchived = household.status === 'archived'

  return (
    <div
      className={`
        group relative p-4 rounded-xl border transition-all duration-200
        ${
          household.isPrimary
            ? 'border-amber-300 bg-amber-50/50 dark:border-amber-700 dark:bg-amber-950/30'
            : isArchived
              ? 'border-stone-200 bg-stone-100/50 dark:border-stone-700 dark:bg-stone-800/30 opacity-60'
              : 'border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-800/50 hover:border-amber-300 dark:hover:border-amber-600'
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
              {household.isPrimary && (
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

      {/* Switch Button */}
      {!household.isPrimary && !isArchived && (
        <button
          onClick={onSwitch}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
        >
          Switch to this household
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

function MemberRow({
  member,
  isCurrentUser,
  onChangeRole,
  onRemove,
}: {
  member: Member
  isCurrentUser: boolean
  onChangeRole?: () => void
  onRemove?: () => void
}) {
  const [showMenu, setShowMenu] = useState(false)
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
          hidden sm:inline-flex px-2.5 py-1 rounded-lg text-xs font-medium
          ${
            member.role === 'Admin'
              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
              : 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-400'
          }
        `}
      >
        {member.role}
      </span>

      {/* Status */}
      <div className="hidden md:flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
        <CheckCircle className="w-4 h-4" />
        <span>Active</span>
      </div>

      {/* Actions */}
      {!isCurrentUser && (
        <div className="relative">
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
        </div>
      )}
    </div>
  )
}

function InvitationRow({
  invitation,
  onCancel,
}: {
  invitation: Invitation
  onCancel?: () => void
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-stone-50/50 dark:bg-stone-800/30 hover:bg-stone-100/50 dark:hover:bg-stone-800/50 transition-colors">
      {/* Icon */}
      <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
        <Mail className="w-5 h-5 text-stone-500 dark:text-stone-400" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-stone-900 dark:text-stone-100 truncate">
          {invitation.email}
        </p>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Invited as {invitation.role}
        </p>
      </div>

      {/* Status */}
      <div className="flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400">
        <Clock className="w-4 h-4" />
        <span className="hidden sm:inline">Pending</span>
      </div>

      {/* Cancel */}
      <button
        onClick={onCancel}
        className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        title="Cancel invitation"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

function InviteModal({
  onClose,
  onInvite,
}: {
  onClose: () => void
  onInvite?: (email: string, role: 'Admin' | 'Member') => void
}) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'Admin' | 'Member'>('Member')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      onInvite?.(email.trim(), role)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-stone-700">
          <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
            Invite Member
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:text-stone-300 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@example.com"
              className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['Member', 'Admin'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`
                    p-4 rounded-xl border-2 text-left transition-all
                    ${
                      role === r
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30'
                        : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {r === 'Admin' ? (
                      <Shield className="w-4 h-4 text-orange-500" />
                    ) : (
                      <User className="w-4 h-4 text-stone-500" />
                    )}
                    <span className="font-medium text-stone-900 dark:text-stone-100">
                      {r}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {r === 'Admin'
                      ? 'Full access including payroll'
                      : 'View and track attendance'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!email.trim()}
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 dark:disabled:bg-stone-700 text-white font-medium transition-colors"
          >
            Send Invitation
          </button>
        </form>
      </div>
    </div>
  )
}

function PermissionsCard({ permissions }: { permissions: { Admin: string[]; Member: string[] } }) {
  return (
    <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/50">
      <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-amber-500" />
        Role Permissions
      </h3>
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Admin */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
              Admin
            </span>
          </div>
          <ul className="space-y-2">
            {permissions.Admin.map((perm, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400"
              >
                <CheckCircle className="w-4 h-4 text-green-500" />
                {perm}
              </li>
            ))}
          </ul>
        </div>

        {/* Member */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-400">
              Member
            </span>
          </div>
          <ul className="space-y-2">
            {permissions.Member.map((perm, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400"
              >
                <CheckCircle className="w-4 h-4 text-green-500" />
                {perm}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// Main Component
export function SettingsDashboard({
  userProfile,
  households,
  members,
  invitations,
  permissions,
  onUpdateProfile,
  onSwitchHousehold,
  onCreateHousehold,
  onRenameHousehold,
  onArchiveHousehold,
  onInviteMember,
  onChangeMemberRole,
  onRemoveMember,
  onCancelInvitation,
}: SettingsAndAccessProps) {
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'households' | 'members' | 'permissions'>('households')

  const activeHouseholds = households.filter((h) => h.status === 'active')
  const archivedHouseholds = households.filter((h) => h.status === 'archived')

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
              <p className="text-stone-500 dark:text-stone-400">
                {userProfile.email}
              </p>
            </div>
            <button
              onClick={() => onUpdateProfile?.({})}
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
                <button
                  onClick={() => onCreateHousehold?.('New Household')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create New
                </button>
              </div>
              <div className="grid gap-4">
                {activeHouseholds.map((household) => (
                  <HouseholdCard
                    key={household.id}
                    household={household}
                    onSwitch={() => onSwitchHousehold?.(household.id)}
                    onRename={() => onRenameHousehold?.(household.id, household.name)}
                    onArchive={() => onArchiveHousehold?.(household.id)}
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
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                Team Members
              </h3>
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors"
              >
                <Mail className="w-4 h-4" />
                Invite
              </button>
            </div>

            {/* Members List */}
            <div className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/50 overflow-hidden divide-y divide-stone-200 dark:divide-stone-700">
              {members.map((member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  isCurrentUser={member.id === 'mem-1'}
                  onChangeRole={() => onChangeMemberRole?.(member.id, member.role === 'Admin' ? 'Member' : 'Admin')}
                  onRemove={() => onRemoveMember?.(member.id)}
                />
              ))}
              {invitations.map((invitation) => (
                <InvitationRow
                  key={invitation.id}
                  invitation={invitation}
                  onCancel={() => onCancelInvitation?.(invitation.id)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'permissions' && (
          <div className="animate-in fade-in duration-200">
            <PermissionsCard permissions={permissions} />
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          onClose={() => setShowInviteModal(false)}
          onInvite={onInviteMember}
        />
      )}
    </div>
  )
}
