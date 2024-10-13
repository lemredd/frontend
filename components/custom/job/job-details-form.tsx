'use client'

import JobDetailsSkills from '@/components/custom/job/job-details-skills'
import NotFound from '@/components/custom/not-found'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { JobSchema } from '@/lib/schema'
import { formatDescription, getAddress, getRecency } from '@/lib/utils'
import { useJobStore } from '@/store/JobStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { Clock, MapPin, Pencil, PhilippinePesoIcon, Trash } from 'lucide-react'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export function JobDetailsForm() {
  const { job, isOwned, isEditing, setEditing } = useJobStore()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof JobSchema>>({
    resolver: zodResolver(JobSchema),
    defaultValues: {
      name: (job?.name as string) || '',
      description: job?.description
        ? formatDescription(job.description as string)
        : '',
    },
  })

  function onSubmit(values: z.infer<typeof JobSchema>) {
    startTransition(() => {
      console.log(values)
      setEditing(false)
    })
  }

  if (!job) {
    return <NotFound className="text-foreground h" />
  }

  if (!isOwned || !isEditing) return (
    <Card className="modern-card">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-4">
          {/* Job Date */}
          <div className="flex justify-between items-center">
            <div className="text-sm dark:text-gray-400 flex items-center gap-2">
              <Clock
                size={18}
                className="dark:text-gray-500"
              />
              <span>Posted {getRecency(job.created_at as string)}</span>
            </div>
            {/* Job Location */}
            <Chip
              beforeContent={<MapPin size={18} />}
              content={getAddress(job)}
              className="bg-primary !w-fit text-white text-sm rounded-full px-4 py-1 flex items-center gap-1 shadow-md"
              contentClassName="max-w-[unset]"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col space-y-6">
        {/* Job Price */}
        <div className="flex items-center gap-4 text-2xl font-semibold">
          <PhilippinePesoIcon
            size={22}
            className="text-green-400"
          />
          <span>{Number(job.price).toFixed(2)}</span>
        </div>

        {/* Job Skills */}
        <JobDetailsSkills job={job} />

        {/* Job Description */}
        <h2 className="text-lg font-semibold">Description</h2>
        <CardDescription
          className="whitespace-pre-line dark:text-gray-300"
          dangerouslySetInnerHTML={{
            __html: formatDescription(job.description as string),
          }}
        />
      </CardContent>

      {/* Edit and Delete Buttons */}
      <CardContent className="flex justify-end space-x-3">
        <Button
          variant="secondary"
          onClick={() => setEditing(true)}
          className="flex items-center gap-2"
        >
          <Pencil size={18} />
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={() => console.log('Delete action')}
          className="flex items-center gap-2"
        >
          <Trash size={18} />
          Delete
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <Card className="modern-card">
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isPending}
                      className="bg-background"
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* TODO: add field for skills */}
            {/* TODO: add location fields */}

            <div className="flex justify-end gap-x-2">
              <Button
                type="button"
                className="uppercase"
                variant="secondary"
                onClick={() => setEditing(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="uppercase"
                disabled={isPending}
              >
                {isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
