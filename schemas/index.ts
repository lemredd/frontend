import * as z from 'zod'

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
    message: 'First name is required',
  }),
  lastName: z.string().min(1, {
    message: 'Last name is required',
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
    ...registerFields,
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

export const RoleSchema = z.object({
  roleCode: z.string().min(1, {
    message: 'role is required',
  }),
})
export const RegisterWithRoleSchema = z.object({
  ...registerFields,
  roleCode: z.string().min(1, {
    message: 'role is required',
  }),
})

export const SkillsSchema = z.object({
  skillIds: z.array(z.string().min(1, { message: 'skill is required' })),
})

export const DescriptionSchema = z.object({
  shortDescription: z.string().min(1, {
    message: 'Description is required',
  }),
  longDescription: z.string().min(1, {
    message: 'Description is required',
  }),
})

export const JobSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(10, { message: 'description is required' }),
  price: z.string().refine(value => Number(value)).transform(value => Number(value)).optional(),
  province: z.string().min(1, { message: 'province is required' }),
  city_muni: z.string().min(1, { message: 'city_muni is required' }),
  barangay: z.string().min(1, { message: 'barangay is required' }),
  skill_ids: z.array(z.string().min(1, { message: 'skill is required' })),
})
