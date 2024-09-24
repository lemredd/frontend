'use server'

import { formatErrorMessage } from '@/lib/utils'
import { createClient } from '@/utils/supabase/server'

export const logout = async () => {
  const supabase = createClient()

  const { data: user } = await supabase.auth.getUser()

  if (!user) {
    return {
      error: formatErrorMessage('Not authenticated'),
    }
  }

  const { error } = await supabase.auth.signOut()

  if (error) {
    return {
      error: formatErrorMessage(error.code || 'Something went wrong'),
    }
  }

  // Revalidation can't happen directly, return success response
  return { success: true }
}
