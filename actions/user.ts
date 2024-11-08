'use server'

import { PROFILE_STORE_FIELDS } from '@/lib/constants'
import { createAdminClient, createClient } from '@/utils/supabase/server'

/**
 * Refetches the authenticated user.
 *
 * Used after redirected from email confirmation.
 */
export async function refreshUser() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { user: null, profile: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select(PROFILE_STORE_FIELDS)
    .eq('user_id', user!.id)
    .single()

  return { user, profile }
}

export async function getUserByUsername(username: string) {
  const supabase = createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select(PROFILE_STORE_FIELDS)
    .eq('username', username)
    .single()

  const adminSupabase = createAdminClient()

  const {
    data: { user },
  } = await adminSupabase.auth.admin.getUserById(profile.user_id)

  return user
}

/*
 * Admin actions
 */

export async function rankSkillsByJobs() {
  const supabase = createAdminClient()
  return await supabase.rpc('rank_skills_by_jobs')
}

export async function rankSkillsByProfile() {
  const supabase = createAdminClient()
  return await supabase.rpc('rank_skills_by_profile')
}

export async function countProfilesByRole() {
  const supabase = createAdminClient()
  return await supabase.rpc('count_profiles_by_role')
}

export async function countUsersByMonthCreated() {
  const supabase = createAdminClient()
  return await supabase.rpc('count_users_by_month_created')
}

export async function listUsers(page: number) {
  const supabase = createAdminClient()
  return await supabase.auth.admin.listUsers({
    page,
    perPage: 10,
  })
}

export async function countUsers() {
  const supabase = createAdminClient()
  return await supabase.rpc('get_user_count')
}

export async function deleteUser(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.auth.admin.deleteUser(id)
  if (error) return { error: error.message }
  return { success: 'User deleted successfully!' }
}

export async function deleteMultipleUsers(ids: string[]) {
  const supabase = createAdminClient()
  const { error } = await supabase.rpc('delete_users_by_ids', { ids })
  if (error) return { error: error.message }
  return { success: 'User deleted successfully!' }
}
