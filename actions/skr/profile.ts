'use server'

import * as z from 'zod'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { DescriptionSchema } from '@/schemas'
import { createClient } from '@/utils/supabase/server'

export const editProfile = async (values: z.infer<typeof DescriptionSchema>) => {
  const supabase = createClient()
  const validatedFields = DescriptionSchema.safeParse(values)

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
    .from('profiles')
    .update({
      short_desc: values.shortDescription,
      long_desc: values.longDescription,
      is_completed: true, // TODO: make into supabase trigger instead
    })
    .eq('id', profile!.id)
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  redirect('/skr/setup/address')
}
