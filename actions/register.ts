'use server'

import { RegisterSchema } from '@/schemas'
import * as z from 'zod'
import { createClient } from '@/utils/supabase/server'
import { SignUpWithPasswordCredentials } from '@supabase/supabase-js'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    }
  }
  const options: SignUpWithPasswordCredentials["options"] = {
    "data": {
      "first_name": values.firstName,
      "last_name": values.lastName
    }
  }

  const supabase = createClient()
  const { error } = await supabase.auth.signUp({
    "email": values.email,
    "password": values.password,
    options
  })

  if (error) return { error: error.code }
  return {
    success: 'Email sent!',
  }
}
