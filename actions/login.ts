'use server'

import { formatErrorMessage } from '@/lib/utils'
import { LoginSchema } from '@/schemas'
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

  return { data }
}
