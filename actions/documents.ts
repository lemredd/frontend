'use server'

import { ValidDocumentsSchema } from '@/lib/schema'
import { createAdminClient, createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function uploadDocuments(form: FormData, profileId: string) {
  const validatedFields = ValidDocumentsSchema.safeParse({
    id: form.get('id') as File,
    documents: Array.from(form.getAll('documents') as File[]),
  })

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const data = validatedFields.data

  const supabase = createClient()
  const idFileName = `id_${profileId}`
  const { error: idError } = await supabase.storage
    .from('documents')
    .upload(idFileName, data.id, { upsert: true })
  if (idError) return { error: idError.message }

  for (const document of data.documents) {
    const { error: documentError } = await supabase
      .storage
      .from('documents')
      .upload(document.name, document, { upsert: true })
    if (documentError) return { error: documentError.message }
  }

  redirect("/skr/setup/skills")
}


export async function getOtherDocuments(ownerId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .rpc('get_other_documents', { _owner_id: ownerId })

  if (error) return { error }

  revalidatePath('/admin/users')
  return { data }
}
