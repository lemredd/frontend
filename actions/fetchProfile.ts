'use server'

import { formatErrorMessage } from '@/lib/utils'
import { createClient } from '@/utils/supabase/server'

export const fetchProfile = async (user_id: string) => {
  const supabase = createClient()

  const { error, data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user_id)
    .single()

  if (error) {
    return {
      error: formatErrorMessage(error.code || 'Something went wrong'),
    }
  }

  return { data: profile }
}
