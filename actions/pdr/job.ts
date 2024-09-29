"use server"

import { z } from 'zod'
import { redirect } from 'next/navigation'

import { ApplyJobSchema, JobSchema } from '@/schemas'
import { createClient } from '@/utils/supabase/server'

export async function postJob(values: z.infer<typeof JobSchema>, isOnboarding: boolean) {
  const validatedFields = JobSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    }
  }

  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
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

  const jobSkills = validatedFields.data.skill_ids.map(id => ({
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

  return { success: "Job posted" }
}

export async function applyJob(values: z.infer<typeof ApplyJobSchema>) {
  const validatedFields = ApplyJobSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    }
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select<string, { id: string }>('id')
    .eq('user_id', user!.id)
    .single()

  const { error } = await supabase
    .from('job_applicants')
    .insert({
      ...validatedFields.data,
      profile_id: profile!.id,
    })

  if (error) return { error: error.message }

  return { success: "Job applied" }
}
