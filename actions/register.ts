'use server'

import { RegisterSchema, RegisterWithRoleSchema } from '@/schemas'
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
  console.log("register with role",values)
  const validatedFields = RegisterWithRoleSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    }
  }
}
