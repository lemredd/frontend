'use server'

import { RegisterSchema, RegisterWithRoleSchema } from '@/schemas'
import { createClient } from '@/utils/supabase/server'
import * as z from 'zod'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    }
  }
}

export const registerWithRole = async (values: z.infer<typeof RegisterWithRoleSchema>) => {
  const validatedFields = RegisterWithRoleSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    }
  }

  const supabase = createClient()

  const { error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        first_name: values.firstName,
        last_name: values.lastName,
        role_code: values.roleCode,
      },
    },
  })

  if (error) return { error: error.message }
}
