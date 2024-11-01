'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import {
  ApplyJobSchema,
  ApproveApplicantSchema,
  CheckJobApplicationSchema,
  EditJobSchema,
  JobSchema,
} from '@/lib/schema'
import { createClient } from '@/utils/supabase/server'

export async function postJob(
  values: z.infer<typeof JobSchema>,
  isOnboarding: boolean,
) {
  // Validate the input values using the schema
  const validatedFields = JobSchema.safeParse(values)
  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const supabase = createClient()

  // Get the authenticated user
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData?.user) {
    console.error('Failed to get authenticated user:', authError)
    return { error: 'Unable to get authenticated user.' }
  }

  // Get the user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', authData.user.id)
    .single()

  if (profileError || !profile) {
    console.error('Failed to get user profile:', profileError)
    return { error: 'Unable to get user profile.' }
  }

  // Insert the job data
  const { data: jobData, error: jobError } = await supabase
    .from('jobs')
    .insert({
      name: validatedFields.data.name,
      description: validatedFields.data.description,
      price: validatedFields.data.price,
      province: validatedFields.data.province,
      city_muni: validatedFields.data.city_muni,
      barangay: validatedFields.data.barangay,
      setup: validatedFields.data.setup,
      profile_id: profile.id,
    })
    .select()

  if (jobError || !jobData?.length) {
    console.error('Failed to insert job:', jobError)
    return { error: 'Failed to create job.' }
  }

  // Insert job skills
  const jobSkills = validatedFields.data.skill_ids.map((id) => ({
    job_id: jobData[0].id,
    skill_id: id,
  }))

  const { error: jobSkillsError } = await supabase
    .from('job_skills')
    .insert(jobSkills)

  if (jobSkillsError) {
    console.error('Failed to insert job skills:', jobSkillsError)
    return { error: 'Failed to add job skills.' }
  }

  // If onboarding, update the profile status
  if (isOnboarding) {
    const { error: onboardingError } = await supabase
      .from('profiles')
      .update({ is_completed: true })
      .eq('id', profile.id)

    if (onboardingError) {
      console.error('Failed to update onboarding status:', onboardingError)
      return { error: 'Failed to complete onboarding.' }
    }

    // Redirect to home page after successful onboarding
    redirect('/')
  }

  // Return success message
  return {
    data: {
      message: 'Job posted successfully!',
      job: jobData[0], // Include the job data in the response if needed
    },
  }
}

export async function editJob(values: z.infer<typeof EditJobSchema>) {
  const validatedFields = EditJobSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
      details: validatedFields.error.errors,
    }
  }

  const supabase = createClient()
  const { data, error } = await supabase
    .from('jobs')
    .update({
      name: validatedFields.data.name,
      description: validatedFields.data.description,
      price: validatedFields.data.price,
      province: validatedFields.data.province,
      city_muni: validatedFields.data.city_muni,
      barangay: validatedFields.data.barangay,
      setup: validatedFields.data.setup,
    })
    .eq('id', validatedFields.data.id)
    .select()

  if (error) return { error: error.message }

  return { success: 'Job updated successfully!', data }
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
      proposal: validatedFields.data.proposal,
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

export async function approveApplicant(
  values: z.infer<typeof ApproveApplicantSchema>,
) {
  const validatedFields = ApproveApplicantSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: {
        message: 'Invalid fields!',
        errors: validatedFields.error.errors,
      },
    }
  }

  const supabase = createClient()
  const { error } = await supabase
    .from('job_applicants')
    .update({ status: 'accepted' })
    .eq('id', validatedFields.data.job_applicant_id)

  if (error) return { error: error.message }

  return { success: 'Applicant approved' }
}
