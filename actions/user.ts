"use server"

import { revalidatePath } from "next/cache"
import { User } from "@supabase/supabase-js"

import { PROFILE_STORE_FIELDS, USER_LIST_PAGE_SIZE } from "@/lib/constants"
import { createAdminClient, createClient } from "@/utils/supabase/server"
import { z } from "zod"
import { ChangeAdminPasswordSchema } from "@/lib/schema"

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

export async function listUsers(page: number, search?: string) {
  const
    supabase = createAdminClient(),
    start = (page - 1) * USER_LIST_PAGE_SIZE,
    _arguments: Record<string, any> = { _offset: start, _limit: USER_LIST_PAGE_SIZE }

  if (search) _arguments["search"] = search
  return await supabase.rpc('list_users', _arguments).then(result => {
    if (result.error || !result.data.users) return result

    const users = result.data.users.map((user: User & { raw_user_meta_data: Record<string, any> }) => ({
      ...user,
      user_metadata: user.raw_user_meta_data
    }))
    const data = {
      ...result.data,
      users
    }
    return {
      ...result,
      data
    }
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

  revalidatePath('/admin/users')
  return { success: 'User deleted successfully!' }
}

export async function deleteMultipleUsers(ids: string[]) {
  const supabase = createAdminClient()
  const { error } = await supabase.rpc('delete_users_by_ids', { ids })
  if (error) return { error: error.message }

  revalidatePath('/admin/users')
  return { success: 'User deleted successfully!' }
}

export async function changeAdminPassword(values: z.infer<typeof ChangeAdminPasswordSchema>) {
  const supabase = createAdminClient()
  const validatedFields = ChangeAdminPasswordSchema.safeParse(values)
  if (!validatedFields.success) return { error: { message: 'Invalid fields!', errors: validatedFields.error.errors } }

  const { error } = await supabase.rpc('change_admin_password', {
    user_id: validatedFields.data.user_id,
    old_password: validatedFields.data.old_password,
    new_password: validatedFields.data.new_password
  })
  if (error) return { error }

  return { success: 'Password changed successfully!' }
}
