'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import * as z from 'zod'

import { AddressSchema, EditAddressSchema } from '@/lib/schema'
import { createClient } from '@/utils/supabase/server'

export const makeAddress = async (
  values: z.infer<typeof AddressSchema>,
  to = '/skr/setup/documents',
) => {
  const supabase = createClient()
  const validatedFields = AddressSchema.safeParse(values)

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

  const { error } = await supabase
    .from('addresses')
    .insert<z.infer<typeof AddressSchema> & { profile_id: string }>({
      ...validatedFields.data,
      profile_id: profile!.id,
    })
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  redirect(to)
}

export async function editAddress(
  values: z.infer<typeof EditAddressSchema>,
  roleLink: 'skr' | 'pdr',
) {
  const validatedFields = EditAddressSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    }
  }

  const supabase = createClient()
  const { error } = await supabase
    .from('addresses')
    .update(validatedFields.data)
    .eq('id', validatedFields.data.id)

  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  redirect(`/${roleLink}/profile`)
}
