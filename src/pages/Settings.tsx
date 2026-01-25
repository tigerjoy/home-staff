import { useState, useEffect } from 'react'
import { SettingsDashboard } from '../components/settings'
import type {
  UserProfile,
  Household,
  Member,
  InvitationCode,
  PermissionsMap,
} from '../components/settings/types'
import * as profileApi from '../lib/api/profile'
import * as householdsApi from '../lib/api/households'
import * as membersApi from '../lib/api/members'
import * as invitationsApi from '../lib/api/invitations'
import { useHousehold } from '../hooks/useHousehold'
import { supabase } from '../supabase'

const PERMISSIONS: PermissionsMap = {
  Admin: [
    'Manage Staff Directory',
    'Track Attendance',
    'Manage Payroll & Finance',
    'Invite & Remove Members',
    'Edit Household Settings',
    'Archive Household',
  ],
  Member: ['View Staff Directory', 'Track Attendance', 'View Reports'],
}

export function Settings() {
  const { activeHouseholdId, switchHousehold, setPrimaryHousehold, refreshHouseholds } =
    useHousehold()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [households, setHouseholds] = useState<Household[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [invitationCode, setInvitationCode] = useState<InvitationCode | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch user profile
        const profile = await profileApi.getUserProfile()
        setUserProfile({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatarUrl: profile.avatarUrl,
          timezone: profile.timezone,
        })

        // Fetch households with roles
        const userHouseholds = await householdsApi.getUserHouseholdsWithRoles()
        setHouseholds(
          userHouseholds.map((h) => ({
            id: h.id,
            name: h.name,
            role: h.role,
            status: h.status,
            isPrimary: h.isPrimary,
          }))
        )

        // Fetch members and invitation code for active household
        if (activeHouseholdId) {
          // Check if user is admin
          const userRole = await membersApi.getCurrentUserRole(activeHouseholdId)
          const isAdmin = userRole === 'Admin'

          const [householdMembers, code] = await Promise.all([
            membersApi.getHouseholdMembers(activeHouseholdId),
            invitationsApi.getInvitationCode(activeHouseholdId).catch(() => null),
          ])

          // Auto-generate invitation code if admin and none exists
          let finalCode = code
          if (isAdmin && !code) {
            try {
              finalCode = await invitationsApi.createInvitationCode(activeHouseholdId)
            } catch (err) {
              console.error('Failed to auto-generate invitation code:', err)
            }
          }

          setMembers(
            householdMembers.map((m) => ({
              id: m.id,
              name: m.name,
              email: m.email,
              role: m.role,
              joinedDate: m.joinedAt,
              avatarUrl: m.avatarUrl,
            }))
          )

          if (finalCode) {
            setInvitationCode({
              id: finalCode.id,
              code: finalCode.code,
              expiresAt: finalCode.expiresAt,
              maxUses: finalCode.maxUses,
              currentUses: finalCode.currentUses,
              status: finalCode.status,
              sentDate: finalCode.createdAt,
            })
          } else {
            setInvitationCode(null)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load settings')
        console.error('Error loading settings:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [activeHouseholdId])

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return

    try {
      const updated = await profileApi.updateUserProfile({
        name: updates.name,
        avatarUrl: updates.avatarUrl,
        timezone: updates.timezone,
      })
      setUserProfile({
        id: updated.id,
        name: updated.name,
        email: updated.email,
        avatarUrl: updated.avatarUrl,
        timezone: updated.timezone,
      })
    } catch (err) {
      console.error('Failed to update profile:', err)
      throw err
    }
  }

  const handleCreateHousehold = async (name: string) => {
    try {
      await householdsApi.createHousehold(name)
      await refreshHouseholds()
      // Refresh households list
      const userHouseholds = await householdsApi.getUserHouseholdsWithRoles()
      setHouseholds(
        userHouseholds.map((h) => ({
          id: h.id,
          name: h.name,
          role: h.role,
          status: h.status,
          isPrimary: h.isPrimary,
        }))
      )
    } catch (err) {
      console.error('Failed to create household:', err)
      throw err
    }
  }

  const handleSwitchHousehold = async (id: string) => {
    try {
      await switchHousehold(id)
      // Refresh members and invitation code
      const [householdMembers, code] = await Promise.all([
        membersApi.getHouseholdMembers(id),
        invitationsApi.getInvitationCode(id).catch(() => null),
      ])

      setMembers(
        householdMembers.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          role: m.role,
          joinedDate: m.joinedAt,
          avatarUrl: m.avatarUrl,
        }))
      )

      if (code) {
        setInvitationCode({
          id: code.id,
          code: code.code,
          expiresAt: code.expiresAt,
          maxUses: code.maxUses,
          currentUses: code.currentUses,
          status: code.status,
          sentDate: code.createdAt,
        })
      } else {
        setInvitationCode(null)
      }
    } catch (err) {
      console.error('Failed to switch household:', err)
      throw err
    }
  }

  const handleRenameHousehold = async (id: string, newName: string) => {
    try {
      await householdsApi.renameHousehold(id, newName)
      // Refresh households
      const userHouseholds = await householdsApi.getUserHouseholdsWithRoles()
      setHouseholds(
        userHouseholds.map((h) => ({
          id: h.id,
          name: h.name,
          role: h.role,
          status: h.status,
          isPrimary: h.isPrimary,
        }))
      )
    } catch (err) {
      console.error('Failed to rename household:', err)
      throw err
    }
  }

  const handleArchiveHousehold = async (id: string) => {
    try {
      await householdsApi.archiveHousehold(id)
      // Refresh households
      const userHouseholds = await householdsApi.getUserHouseholdsWithRoles()
      setHouseholds(
        userHouseholds.map((h) => ({
          id: h.id,
          name: h.name,
          role: h.role,
          status: h.status,
          isPrimary: h.isPrimary,
        }))
      )
    } catch (err) {
      console.error('Failed to archive household:', err)
      throw err
    }
  }

  const handleRegenerateInvitationCode = async () => {
    if (!activeHouseholdId) return

    try {
      const code = await invitationsApi.regenerateInvitationCode(activeHouseholdId)
      setInvitationCode({
        id: code.id,
        code: code.code,
        expiresAt: code.expiresAt,
        maxUses: code.maxUses,
        currentUses: code.currentUses,
        status: code.status,
        sentDate: code.createdAt,
      })
    } catch (err) {
      console.error('Failed to regenerate invitation code:', err)
      throw err
    }
  }

  const handleJoinHousehold = async (code: string) => {
    try {
      const result = await invitationsApi.acceptInvitationCode(code)
      if (result.success && result.householdId) {
        await refreshHouseholds()
        await switchHousehold(result.householdId)
        // Refresh data
        const [householdMembers, newCode] = await Promise.all([
          membersApi.getHouseholdMembers(result.householdId),
          invitationsApi.getInvitationCode(result.householdId).catch(() => null),
        ])

        setMembers(
          householdMembers.map((m) => ({
            id: m.id,
            name: m.name,
            email: m.email,
            role: m.role,
            joinedDate: m.joinedAt,
            avatarUrl: m.avatarUrl,
          }))
        )

        // Refresh households list
        const userHouseholds = await householdsApi.getUserHouseholdsWithRoles()
        setHouseholds(
          userHouseholds.map((h) => ({
            id: h.id,
            name: h.name,
            role: h.role,
            status: h.status,
            isPrimary: h.isPrimary,
          }))
        )
      } else {
        throw new Error(result.error || 'Failed to join household')
      }
    } catch (err) {
      console.error('Failed to join household:', err)
      throw err
    }
  }

  const handleChangeMemberRole = async (id: string, newRole: 'Admin' | 'Member') => {
    if (!activeHouseholdId) return

    try {
      await membersApi.updateMemberRole(id, activeHouseholdId, newRole)
      // Refresh members
      const householdMembers = await membersApi.getHouseholdMembers(activeHouseholdId)
      setMembers(
        householdMembers.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          role: m.role,
          joinedDate: m.joinedAt,
          avatarUrl: m.avatarUrl,
        }))
      )
    } catch (err) {
      console.error('Failed to change member role:', err)
      throw err
    }
  }

  const handleRemoveMember = async (id: string) => {
    if (!activeHouseholdId) return

    try {
      await membersApi.removeMember(id, activeHouseholdId)
      // Refresh members
      const householdMembers = await membersApi.getHouseholdMembers(activeHouseholdId)
      setMembers(
        householdMembers.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          role: m.role,
          joinedDate: m.joinedAt,
          avatarUrl: m.avatarUrl,
        }))
      )
    } catch (err) {
      console.error('Failed to remove member:', err)
      throw err
    }
  }

  const handleSetPrimaryHousehold = async (id: string) => {
    try {
      await setPrimaryHousehold(id)
      // Refresh households
      const userHouseholds = await householdsApi.getUserHouseholdsWithRoles()
      setHouseholds(
        userHouseholds.map((h) => ({
          id: h.id,
          name: h.name,
          role: h.role,
          status: h.status,
          isPrimary: h.isPrimary,
        }))
      )
    } catch (err) {
      console.error('Failed to set primary household:', err)
      throw err
    }
  }

  if (loading && !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-stone-600 dark:text-stone-400">Loading settings...</div>
      </div>
    )
  }

  if (error && !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 dark:text-red-400">{error}</div>
      </div>
    )
  }

  if (!userProfile) {
    return null
  }

  return (
    <SettingsDashboard
      userProfile={userProfile}
      households={households}
      members={members}
      invitationCode={invitationCode}
      permissions={PERMISSIONS}
      onUpdateProfile={handleUpdateProfile}
      onSwitchHousehold={handleSwitchHousehold}
      onCreateHousehold={handleCreateHousehold}
      onRenameHousehold={handleRenameHousehold}
      onArchiveHousehold={handleArchiveHousehold}
      onRegenerateInvitationCode={handleRegenerateInvitationCode}
      onJoinHousehold={handleJoinHousehold}
      onChangeMemberRole={handleChangeMemberRole}
      onRemoveMember={handleRemoveMember}
      onSetPrimaryHousehold={handleSetPrimaryHousehold}
    />
  )
}
