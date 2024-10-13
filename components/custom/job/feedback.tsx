"use client"

import { submitFeedback } from "@/actions/feedback";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { FeedbackSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/AuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { StarHalf } from "lucide-react";
import { TransitionStartFunction, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
                  onValueChange={field.onChange}
                  value={String(field.value)}
                  className="flex items-center"
                >
                  {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((value, i) => (
                    <FormItem key={i}>
                      <FormControl className="hidden">
                        <RadioGroupItem value={String(value)} className="[&_.aspect-square]:hidden" />
                      </FormControl>
                      <FormLabel>
                        {Number.isInteger(value) ? (
                          // TODO: fix unclickable .5 stars
                          <StarHalf size={32} className={cn("scale-x-[-1] ml-[-32px]", value <= field.value && "fill-yellow-500")} />
                        ) : (
                          <StarHalf size={32} className={value <= field.value ? "fill-yellow-500" : ""} />
                        )}
                      </FormLabel>
                    </FormItem>
                  ))}
                  <output className="ml-4">{field.value}</output>
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
