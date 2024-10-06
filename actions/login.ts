'use server'

import { PROFILE_STORE_FIELDS } from '@/lib/constants'
import { LoginSchema } from '@/lib/schema'
import { formatErrorMessage } from '@/lib/utils'
import { createClient } from '@/utils/supabase/server'
import * as z from 'zod'

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const supabase = createClient()
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword(values)

  if (error) {
    return {
      error: formatErrorMessage(error.code || 'Something went wrong'),
    }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select(PROFILE_STORE_FIELDS)
    .eq('user_id', data.user.id)
    .single()

  return { data: { user: data.user, profile } }
}
