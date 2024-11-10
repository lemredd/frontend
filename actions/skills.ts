"use server"

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

import { EditSkillSchema, SkillSchema } from '@/lib/schema'
import { createAdminClient, createClient } from '@/utils/supabase/server'

export async function addSkill(values: z.infer<typeof SkillSchema>) {
  const supabase = createClient()
  const validatedFields = SkillSchema.safeParse(values)

  if (!validatedFields.success) return {
    error: {
      message: 'Invalid fields!',
      details: validatedFields.error,
    }
  }

  const { error } = await supabase.from('skills').insert([{
    ...validatedFields.data,
    verified_at: new Date().toISOString(),
  }])
  if (error) return { error }

  revalidatePath('/admin/skills')
  return { success: 'Skill added successfully!' }
}

export async function editSkill(values: z.infer<typeof EditSkillSchema>) {
  const supabase = createAdminClient()
  const validatedFields = EditSkillSchema.safeParse(values)

  if (!validatedFields.success) return {
    error: {
      message: 'Invalid fields!',
      details: validatedFields.error,
    }
  }

  const { error } = await supabase
    .from('skills')
    .update({ ...validatedFields.data })
    .eq('id', validatedFields.data.id)
  if (error) return { error }

  revalidatePath('/admin/skills')
  return { success: 'Skill updated successfully!' }
}

export async function deleteSkills(ids: string[]) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('skills').delete().in('id', ids)

  if (error) return { error }

  revalidatePath('/admin/skills')
  return { success: 'Skills deleted successfully!' }
}
