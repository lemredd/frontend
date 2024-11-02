"use client"

import { submitFeedback } from "@/actions/feedback";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FeedbackSchema } from "@/lib/schema";
import { useAuthStore } from "@/store/AuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { TransitionStartFunction, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import StarRating from "../star-rating";

interface FeedbackFormProps {
  job: Record<string, any>
  startTransition: TransitionStartFunction
}
function FeedbackForm({ startTransition, job }: FeedbackFormProps) {
  const { profile } = useAuthStore()
  const form = useForm<z.infer<typeof FeedbackSchema>>({
    resolver: zodResolver(FeedbackSchema),
    defaultValues: {
      feedback: "",
      rate: 0
    }
  })
  const [hoverValue, setHoverValue] = useState<null | number>(null)

  function onSubmit() {
    startTransition(() => {
      submitFeedback(form.getValues()).then(({ error }) => {
        if (error) return console.error(error)

        location.reload()
      })
    })
  }

  useEffect(() => {
    if (!profile || !job) return

    form.reset({
      job_id: job.id,
      from_id: profile.id,
      to_id: job.profile_id
    })
  }, [profile, job, form])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        id="feedback-form"
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(newValue) => field.onChange(Number(newValue))}
                  value={String(field.value)}
                  className="flex items-center"
                >
                  <FormItem>
                    <StarRating
                      value={form.getValues('rate')}
                      hoverValue={hoverValue}
                      onChange={(newValue) => form.setValue('rate', newValue)}
                      onMouseEnter={(hoverValue) => setHoverValue(hoverValue)}
                      onMouseLeave={() => setHoverValue(null)}
                    />
                  </FormItem>

                  <output className="ml-4">{hoverValue || field.value}</output>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Feedback</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Leave your feedback here"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

interface SeekerFeedbackProps {
  job: Record<string, any>
}
export function SeekerFeedbackForm({ job }: SeekerFeedbackProps) {
  const [isPending, startTransition] = useTransition()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Send Feedback</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave a feedback to the task provider.</DialogTitle>
          <DialogDescription>This will help other seekers assess the provider's excellence.</DialogDescription>
        </DialogHeader>
        <FeedbackForm startTransition={startTransition} job={job} />
        <DialogFooter>
          <Button form="feedback-form" type="submit" disabled={isPending}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
