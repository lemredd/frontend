import { z } from 'zod'
import { redirect } from 'next/navigation'

import { JobSchema } from '@/schemas'
import { createClient } from '@/utils/supabase/server'

export async function postJob(values: z.infer<typeof JobSchema>) {
  const validatedFields = JobSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    }
  }

  const supabase = createClient()
  const { error } = await supabase
    .from('jobs')
    .insert([
      {
        ...validatedFields.data,
      }
    ])

  if (error) return { error: error.message }
  redirect('/')
}
