'use server'

import { PROFILE_STORE_FIELDS } from '@/lib/constants'
import { formatErrorMessage } from '@/lib/utils'
import { createClient } from '@/utils/supabase/server'

export const fetchProfile = async (user_id: string) => {
  const supabase = createClient()

  const { error, data: profile } = await supabase
    .from('profiles')
    .select(PROFILE_STORE_FIELDS)
    .eq('user_id', user_id)
    .single()

  if (error) {
    return {
      error: formatErrorMessage(error.code || 'Something went wrong'),
    }
  }

  return { data: profile }
}
