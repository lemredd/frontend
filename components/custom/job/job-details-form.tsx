"use client"

import { Edit, MapPin } from "lucide-react"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { JobSchema } from "@/lib/schema"
import { Chip } from "@/components/ui/chip"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useJobStore } from "@/store/JobStore"

export function JobDetailsForm() {
  const { job, isOwned } = useJobStore()
  const [isPending, startTransition] = useTransition()
  const [editing, setEditing] = useState(false)

  const form = useForm<z.infer<typeof JobSchema>>({ resolver: zodResolver(JobSchema) })

  function onSubmit(/* values: z.infer<typeof JobSchema> */) {
    startTransition(() => {
      setEditing(false)
    })
  }

  const address = [
    job?.barangay as string,
    job?.city_muni as string,
    job?.province as string
  ].join(", ")

  if (!isOwned || !editing) return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl">Project Details</h2>
        {isOwned && (
          <Button size="icon" variant="ghost" onClick={() => setEditing(true)}><Edit /></Button>
        )}
      </div>
      <p className="whitespace-pre-line">{job?.description as string}</p>
      <h3 className="text-lg font-semibold">Required skills</h3>
      <div className="flex flex-wrap gap-2">
        {(job?.job_skills as Record<"skills", Record<string, unknown>>[])?.map(({ skills }) => (
          <Chip key={skills?.id as string} content={skills?.name as string} className="w-max" contentClassName="max-w-[unset]" />
        ))}
      </div>
      <h3 className="text-lg font-semibold">Location</h3>
      <Chip beforeContent={<MapPin size={16} />} content={address} className="w-max" contentClassName="max-w-[unset]" />
    </div>
  )

  return (
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
                  defaultValue={job?.name as string}
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
                  defaultValue={job?.description as string}
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
          <Button type="button" className="uppercase" variant="secondary" onClick={() => setEditing(false)}>cancel</Button>
          <Button type="submit" className="uppercase" disabled={isPending}>save</Button>
        </div>
      </form>
    </Form>
  )
}
