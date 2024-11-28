'use server'

import { ValidDocumentSchema, ValidIdSchema } from '@/lib/schema'
import { createClient } from '@/utils/supabase/server'

// ! TODO: FIX
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
    .upload(data.name, file, { upsert: true })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Document uploaded' }
}
