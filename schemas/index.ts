import * as z from 'zod'

import { createClient } from '@/utils/supabase/client'

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
})

const registerFields = {
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one digit')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character',
    ),
  confirmPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one digit')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character',
    ),
  firstName: z.string().min(1, {
    message: 'Name is required',
  }),
  lastName: z.string().min(1, {
    message: 'Name is required',
  }),
  // }),
  // profile_picture:
  //   typeof window === 'undefined'
  //     ? z.any()
  //     : z.instanceof(FileList).optional(),
  // province: z.string().optional(),
  // city: z.string().optional(),
  // barangay: z.string().optional(),
  terms: z
    .boolean()
    .refine(
      (value) => value === true,
      'You must agree to the terms and conditions',
    ),
}
export const RegisterSchema = z
  .object({
    ...registerFields
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      })
    }
  })

export const RegisterWithRoleSchema = z.object({
  ...registerFields,
  roleCode: z.string().min(1, {
    message: 'role is required',
  }).refine(async value => {
    const client = createClient()
    const { error } = await client
      .from('roles')
      .select('code')
      .eq('code', value)
      .single()
    return !error
  }, 'Role does not exist')
})
