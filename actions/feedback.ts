"use server"

import { z } from "zod";

import { CompleteJobWithFeedbackSchema, FeedbackSchema } from "@/lib/schema";
import { createClient } from '@/utils/supabase/server'

export async function submitFeedback(values: z.infer<typeof FeedbackSchema>) {
  const validatedFields = FeedbackSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    }
  }

  const supabase = createClient()
  const { error } = await supabase
    .from('feedbacks')
    .insert(validatedFields.data)
  if (error) return { error: error.message }
  return { success: 'Feedback submitted' }
}

export async function completeJobWithFeedback(values: z.infer<typeof CompleteJobWithFeedbackSchema>) {
  const validatedFields = CompleteJobWithFeedbackSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    }
  }

  const supabase = createClient()
  const { error } = await supabase
    .rpc('complete_job_with_feedback', {
      ...validatedFields.data
    })
  if (error) return { error: error.message }
  return { success: 'Feedback submitted' }
}
