"use server"

import { PROFILE_STORE_FIELDS } from "@/lib/constants"
import { createClient } from "@/utils/supabase/server"


/**
 * Refetches the authenticated user.
 *
 * Used after redirected from email confirmation.
 */
export async function refreshUser() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { user: null, profile: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select(PROFILE_STORE_FIELDS)
    .eq('user_id', user!.id)
    .single()

  return { user, profile }
}
