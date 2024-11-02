'use client'

import { completeJobWithFeedback } from '@/actions/feedback'
import StarRating from '@/components/custom/star-rating'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { CompleteJobWithFeedbackSchema } from '@/lib/schema'
import { useAuthStore } from '@/store/AuthStore'
import { useJobStore } from '@/store/JobStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { RadioGroup } from '@radix-ui/react-radio-group'
import { Check } from 'lucide-react'
import {
  TransitionStartFunction,
  useEffect,
  useState,
  useTransition,
} from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface FeedbackFormProps {
  startTransition: TransitionStartFunction
}
function FeedbackForm({ startTransition }: FeedbackFormProps) {
  const { profile } = useAuthStore()
  const { job } = useJobStore()
  const [hoverValue, setHoverValue] = useState<null | number>(null)

  const form = useForm<z.infer<typeof CompleteJobWithFeedbackSchema>>({
    resolver: zodResolver(CompleteJobWithFeedbackSchema),
    defaultValues: {
      rate: 0,
      feedback: '',
    },
  })

  function onSubmit() {
    console.log('Submitting form...') // Add this line
    console.log(form.getValues()) // This should log the current form values
    startTransition(() => {
      completeJobWithFeedback(form.getValues()).then(({ error }) => {
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
      to_id: job.seeker_id,
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
                  className="resize-none"
                  placeholder="Leave a feedback to your seeker."
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

export function CompleteJobForm() {
  const [isPending, startTransition] = useTransition()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2"
          variant="success"
        >
          <Check size={18} />
          Complete Job
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave a feedback to your seeker.</DialogTitle>
          <DialogDescription>
            This will help other providers assess the seeker's quality of
            service.
          </DialogDescription>
        </DialogHeader>
        <FeedbackForm startTransition={startTransition} />
        <DialogFooter>
          <Button
            form="feedback-form"
            type="submit"
            variant="success"
            disabled={isPending}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
