'use server'

import { SkillsSchema } from '@/schemas'
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

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user!.id).single()

  let { error } = await supabase
    .from('profile_skills')
    .insert(validatedFields.data.skillIds.map((id) => ({ profile_id: profile!.id, skill_id: id })))
  console.error("add profile skills", error)
  if (error) return { error: error.code }

  // TODO: redirect to `/user/setup/description`

  error = (
    await supabase.from('profiles').update({ is_completed: true }).eq('id', profile!.id)
  ).error
  console.error("is completed update", error)
  if (error) return { error: error.code }

  revalidatePath('/', 'layout')
  redirect('/')
}
