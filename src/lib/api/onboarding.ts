import { supabase } from '../../supabase'
import type { OnboardingConfig } from '../../types'

/**
 * Get current onboarding progress for the authenticated user
 */
export async function getOnboardingProgress(): Promise<OnboardingConfig | null> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return null
  }

  const { data: progress, error } = await supabase
    .from('onboarding_progress')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found - return default progress
      return {
        userId: user.id,
        currentStepIndex: 0,
        totalSteps: 4,
        isCompleted: false,
        lastSavedAt: new Date().toISOString(),
      }
    }
    throw new Error(`Failed to fetch onboarding progress: ${error.message}`)
  }

  return {
    userId: progress.user_id,
    currentStepIndex: progress.current_step_index,
    totalSteps: 4, // Fixed for onboarding wizard
    isCompleted: false, // This is determined by profiles.onboarding_completed
    lastSavedAt: progress.last_saved_at,
  }
}

/**
 * Save onboarding progress for the current step
 */
export async function saveOnboardingProgress(
  stepIndex: number,
  stepData: Record<string, any>
): Promise<void> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  // Validate step index
  if (stepIndex < 0 || stepIndex >= 4) {
    throw new Error('Invalid step index')
  }

  // Get existing progress or create new
  const { data: existing } = await supabase
    .from('onboarding_progress')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const stepDataJson = existing?.step_data || {}
  stepDataJson[`step_${stepIndex}`] = stepData

  if (existing) {
    // Update existing progress
    const { error } = await supabase
      .from('onboarding_progress')
      .update({
        current_step_index: stepIndex,
        step_data: stepDataJson,
        last_saved_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    if (error) {
      throw new Error(`Failed to save onboarding progress: ${error.message}`)
    }
  } else {
    // Create new progress
    const { error } = await supabase
      .from('onboarding_progress')
      .insert({
        user_id: user.id,
        current_step_index: stepIndex,
        step_data: stepDataJson,
        last_saved_at: new Date().toISOString(),
      })

    if (error) {
      throw new Error(`Failed to create onboarding progress: ${error.message}`)
    }
  }
}

/**
 * Get step data for a specific step
 */
export async function getStepData(stepIndex: number): Promise<Record<string, any> | null> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return null
  }

  const { data: progress, error } = await supabase
    .from('onboarding_progress')
    .select('step_data')
    .eq('user_id', user.id)
    .single()

  if (error || !progress) {
    return null
  }

  return progress.step_data[`step_${stepIndex}`] || null
}

/**
 * Complete onboarding - marks onboarding as complete in profiles table
 * Note: This doesn't delete the progress, that's handled separately
 */
export async function completeOnboarding(): Promise<void> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  // Mark onboarding as completed in profiles
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ onboarding_completed: true })
    .eq('id', user.id)

  if (profileError) {
    throw new Error(`Failed to complete onboarding: ${profileError.message}`)
  }
}

/**
 * Reset onboarding progress (useful for testing or allowing users to restart)
 */
export async function resetOnboardingProgress(): Promise<void> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  // Delete progress record
  const { error } = await supabase
    .from('onboarding_progress')
    .delete()
    .eq('user_id', user.id)

  if (error) {
    throw new Error(`Failed to reset onboarding progress: ${error.message}`)
  }

  // Also reset onboarding_completed flag
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ onboarding_completed: false })
    .eq('id', user.id)

  if (profileError) {
    throw new Error(`Failed to reset onboarding status: ${profileError.message}`)
  }
}
