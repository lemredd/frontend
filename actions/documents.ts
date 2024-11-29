'use server'

import { ValidDocumentSchema, ValidIdSchema } from '@/lib/schema'
import { createAdminClient, createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadDocument(form: FormData, type: 'id' | 'document') {
  const validatedFields =
    type === 'id'
      ? ValidIdSchema.safeParse(Object.fromEntries(form))
      : ValidDocumentSchema.safeParse(Object.fromEntries(form))

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const data = validatedFields.data

  let file: File
  if (type === 'id') {
    if (!('valid_id' in data)) {
      return { error: 'Field "valid_id" is missing!' }
    }
    file = data.valid_id
  } else {
    if (!('valid_document' in data)) {
      return { error: 'Field "valid_document" is missing!' }
    }
    file = data.valid_document
  }

  const supabase = createClient()
  const { error } = await supabase.storage
    .from('documents')
    .upload(`${data.name}/${type}`, file, { upsert: true })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Document uploaded' }
}

export async function getOtherDocuments(ownerId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase.rpc('get_other_documents', {
    _owner_id: ownerId,
  })

  if (error) return { error }

  revalidatePath('/admin/users')
  return { data }
}
