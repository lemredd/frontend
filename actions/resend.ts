'use server'

import { formatErrorMessage } from '@/lib/utils'
import { createClient } from '@/utils/supabase/server'

export const resendEmail = async (email: string) => {
  const supabase = createClient()

  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
  })

  if (error) {
    return {
      error: formatErrorMessage(error.code || 'Something went wrong'),
    }
  }

  return { data }
}
