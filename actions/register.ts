'use server'

import { RegisterSchema } from '@/schemas'
import * as z from 'zod'
import { createClient } from '@/utils/supabase/server'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    }
  }

  const supabase = createClient()
  const { error } = await supabase.auth.signUp({ "email": values.email, "password": values.password })

  if (error) return { error: error.code, }
  return {
    success: 'Email sent!',
  }
}
