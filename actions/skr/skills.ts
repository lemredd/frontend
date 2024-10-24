'use server'

import { SkillsSchema } from '@/lib/schema'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import * as z from 'zod'

export const addSkills = async (values: z.infer<typeof SkillsSchema>) => {
  const supabase = createClient()
  const validatedFields = SkillsSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user!.id)
    .single()

  const { error: profileSkillsError } = await supabase
    .from('profile_skills')
    .insert(
      validatedFields.data.skillIds.map((id) => ({
        profile_id: profile!.id,
        skill_id: id,
      })),
    )
  if (profileSkillsError) return { error: profileSkillsError.message }

  const { error: onboardingError } = await supabase
    .from('profiles')
    .update({
      is_completed: true, // TODO: make into supabase trigger instead
    })
    .eq('id', profile!.id)
  if (onboardingError) return { error: onboardingError.message }

  revalidatePath('/', 'layout')
  redirect('/')
}


export async function editSkills(
  values: z.infer<typeof SkillsSchema>,
  profileId: string
) {
  const validatedFields = SkillsSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    }
  }

  const supabase = createClient()

  const { error: deleteError } = await supabase
    .from('profile_skills')
    .delete()
    .eq('profile_id', profileId)
  if (deleteError) return { error: deleteError.message }

  const { error } = await supabase
    .from('profile_skills')
    .insert(
      validatedFields.data.skillIds.map((id) => ({
        profile_id: profileId,
        skill_id: id,
      })),
    )
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  redirect('/')
}
