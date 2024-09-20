'use server'

import { LoginSchema } from '@/schemas'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import * as z from 'zod'

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const supabase = createClient()
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    }
  }

  const { error } = await supabase.auth.signInWithPassword(values)

  if (error) {
    return {
      error: error.code,
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
