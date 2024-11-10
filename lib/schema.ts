import * as z from 'zod'

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
})

const passwordSchema = z
  .string()
  .min(8, '')
  .regex(/[a-zA-Z]/, '')
  .regex(/[A-Z]/, '')
  .regex(/\d/, '')
  .regex(/[\W_]/, '')

const registerFields = {
  email: z.string().email({
    message: 'Email is required',
  }),
  password: passwordSchema,
  confirmPassword: passwordSchema,
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
  skillIds: z
    .array(
      z.string().transform((value) => {
        if (value.includes('|')) return value.split('|')[0]
        return value
      }),
    )
    .min(1, { message: 'skill is required' }),
})

export const SkillSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  skill_category_id: z.string().min(1, {
    message: 'skill_category_id is required',
  }).transform(value => value.split('|')[0]),
})

export const EditSkillSchema = z.object({
  id: z.string().min(1, { message: 'id is required' }),
  ...SkillSchema.shape,
})

export const ProfileDescriptionSchema = z.object({
  username: z.string().min(1, {
    message: 'Username is required',
  }),
  profile_picture: z.any(),
  shortDescription: z.string().min(1, {
    message: 'Description is required',
  }),
  longDescription: z.string().min(1, {
    message: 'Description is required',
  }),
})

export const EditProfileDescriptionSchema = z.object({
  shortDescription: z.string().min(1, {
    message: 'Description is required',
  }),
  longDescription: z.string().min(1, {
    message: 'Description is required',
  }),
  id: z.string().min(1, { message: 'id is required' }),
})

const transformPSGCField = (value: string) => value.split('|')[1]

export const AddressSchema = z.object({
  province: z
    .string()
    .min(1, { message: 'province is required' })
    .transform(transformPSGCField),
  city_muni: z
    .string()
    .min(1, { message: 'City/Municipality is required' })
    .transform(transformPSGCField),
  barangay: z
    .string()
    .min(1, { message: 'barangay is required' })
    .transform(transformPSGCField),
  address_1: z.string().optional(),
  address_2: z.string().optional(),
  postal_code: z.string().min(1, { message: 'Postal code is required' }),
})

export const EditAddressSchema = z.object({
  ...AddressSchema.shape,
  id: z.string().min(1, { message: 'address_id is required' }),
})

export const ProfilePictureSchema = z.object({
  profile_picture: z
    .instanceof(File)
    .refine((file) => file.size <= 10_000_000, 'File too large'),
  name: z.string().min(1, 'name is required'),
})

export const ContactUsSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  email: z.string().email({
    message: 'Email is required',
  }),
  message: z.string().min(1, {
    message: 'Message is required',
  }),
})

export const JobSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'description is required' }),
  price: z
    .string()
    .refine((value) => Number(value))
    .transform((value) => Number(value))
    .optional(),
  province: z
    .string()
    .min(1, { message: 'province is required' })
    .transform(transformPSGCField),
  city_muni: z
    .string()
    .min(1, { message: 'city_muni is required' })
    .transform(transformPSGCField),
  barangay: z
    .string()
    .min(1, { message: 'barangay is required' })
    .transform(transformPSGCField),
  skill_ids: z.array(z.string().min(1, { message: 'skill is required' })),
  setup: z.string().min(1, { message: 'setup is required' }),
})

export const EditJobSchema = z.object({
  ...JobSchema.shape,
  skill_ids: z.array(z.string()).optional(),
  id: z.string().min(1, { message: 'job_id is required' }),
})

// Separate schema for checking and applying. One of them might change later.
export const ApplyJobSchema = z.object({
  job_id: z.string().min(1, { message: 'job_id is required' }),
  user_id: z.string().min(1, { message: 'user_id is required' }),
  proposal: z.string().min(1, { message: 'proposal is required' }),
})

export const CheckJobApplicationSchema = z.object({
  job_id: z.string().min(1, { message: 'job_id is required' }),
  user_id: z.string().min(1, { message: 'user_id is required' }),
})

export const ApproveApplicantSchema = z.object({
  job_applicant_id: z.number(),
})

export const FeedbackSchema = z.object({
  feedback: z.string().optional(),
  rate: z
    .number()
    .min(0.5, { message: 'Rate must be at least 0.5' })
    .max(5, { message: 'Rate cannot exceed 5' }),
  from_id: z.string().min(1, { message: 'from_id is required' }),
  to_id: z.string().min(1, { message: 'to_id is required' }),
  job_id: z.string().min(1, { message: 'job_id is required' }),
})

export const CompleteJobWithFeedbackSchema = z.object({
  ...FeedbackSchema.shape,
  job_id: z.string().min(1, { message: 'job_id is required' }),
})
