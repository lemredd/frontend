'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import {
  ApplyJobSchema,
  ApproveApplicantSchema,
  CheckJobApplicationSchema,
  JobSchema,
} from '@/lib/schema'
import { createClient } from '@/utils/supabase/server'

export async function postJob(
  values: z.infer<typeof JobSchema>,
  isOnboarding: boolean,
) {
  const validatedFields = JobSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    }
  }

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select<string, { id: string }>('id')
    .eq('user_id', user!.id)
    .single()

  const { data: job, error } = await supabase
    .from('jobs')
    .insert({
      name: validatedFields.data.name,
      description: validatedFields.data.description,
      price: validatedFields.data.price,
      province: validatedFields.data.province,
      city_muni: validatedFields.data.city_muni,
      barangay: validatedFields.data.barangay,
      profile_id: profile!.id,
    })
    .select()
  if (error) return { error: error.message }

  const jobSkills = validatedFields.data.skill_ids.map((id) => ({
    job_id: job![0].id,
    skill_id: id,
  }))
  const { error: jobSkillsError } = await supabase
    .from('job_skills')
    .insert(jobSkills)

  if (jobSkillsError) return { error: jobSkillsError.message }

  if (isOnboarding) {
    const { error: onboardingError } = await supabase
      .from('profiles')
      .update({ is_completed: true })
      .eq('id', profile!.id)

    if (onboardingError) return { error: onboardingError.message }
    redirect('/')
  }

  return { success: 'Job posted' }
}

export async function applyJob(values: z.infer<typeof ApplyJobSchema>) {
  const validatedFields = ApplyJobSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    }
  }

  const supabase = createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select<string, { id: string }>('id')
    .eq('user_id', validatedFields.data.user_id)
    .single()

  const { data: application, error } = await supabase
    .from('job_applicants')
    .insert({
      job_id: validatedFields.data.job_id,
      profile_id: profile!.id,
      proposal: validatedFields.data.proposal
    })
    .select()

  if (error) return { error: error.message }

  return { application: application![0] }
}

export async function checkJobApplication(
  values: z.infer<typeof CheckJobApplicationSchema>,
) {
  const validatedFields = CheckJobApplicationSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    }
  }

  const supabase = createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select<string, { id: string }>('id')
    .eq('user_id', validatedFields.data.user_id)
    .single()

  const { data: application, error } = await supabase
    .from('job_applicants')
    .select('status')
    .eq('profile_id', profile!.id)
    .eq('job_id', validatedFields.data.job_id)

  if (error) return { error: error.message }

  if (application.length) return { application: application[0] }
  return { application: undefined }
}

export async function approveApplicant(values: z.infer<typeof ApproveApplicantSchema>) {
  const validatedFields = ApproveApplicantSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: {
        message: 'Invalid fields!',
        errors: validatedFields.error.errors
      },
    }
  }

  const supabase = createClient()
  const { error } = await supabase
    .from('job_applicants')
    .update({ status: "accepted" })
    .eq('id', validatedFields.data.job_applicant_id)

  if (error) return { error: error.message }

  return { success: 'Applicant approved' }
}
