'use server'

import * as z from 'zod'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { AddressSchema } from '@/schemas'
import { createClient } from '@/utils/supabase/server'

export const makeAddress = async (values: z.infer<typeof AddressSchema>) => {
  const supabase = createClient()
  const validatedFields = AddressSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    }
  }

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user!.id)
    .single()

  const { error } = await supabase
    .from('addresses')
    .insert<z.infer<typeof AddressSchema> & { profile_id: string }>(({
      ...validatedFields.data,
      profile_id: profile!.id,
    }))
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  redirect('/skr/setup/skills')
}

