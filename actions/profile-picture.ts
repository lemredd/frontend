"use server"

import { ProfilePictureSchema } from "@/lib/schema"
import { createClient } from "@/utils/supabase/server"

export async function uploadProfilePicture(form: FormData) {
  const validatedFields = ProfilePictureSchema.safeParse(Object.fromEntries(form))
  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    }
  }

  const file = validatedFields.data.profile_picture

  const supabase = createClient()
  const { error } = await supabase.storage
    .from("profile_pictures")
    .upload(validatedFields.data.name, file, { upsert: true })

  if (error) return { error: error.message }
  return { success: 'Profile picture uploaded' }
}
