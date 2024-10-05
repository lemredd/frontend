"use server"

import { createClient } from "@/utils/supabase/server"


/**
 * Refetches the authenticated user.
 *
 * Used after redirected from email confirmation.
 */
export async function refreshUser() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  return { user }
}
