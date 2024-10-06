'use client'

import { useEffect, useState, useTransition } from 'react'

import JobDetailsHeader from '@/components/custom/job/job-details-header'
import JobDetailsSkills from '@/components/custom/job/job-details-skills'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { formatDescription } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'

interface Props {
  params: { id: string }
}

export default function JobDetailsPage({ params: { id } }: Props) {
  const [isPending, startTransition] = useTransition()
  const supabase = createClient()
  const [job, setJob] = useState<Record<string, unknown>>()

  useEffect(() => {
    startTransition(() => {
      supabase
        .from('jobs')
        .select(
          `
          id,
          name,
          description,
          price,
          job_skills (
            skills (
              id,
              name
            )
          )
        `,
        )
        .eq('id', id)
        .single()
        .then(({ data }) => {
          if (data) setJob(data)
        })
    })
  }, [])

  return (
    <section className="space-y-8 container mx-auto flex h-full min-h-screen flex-col px-6 2xl:px-0 max-w-4xl">
      <Card className="max-w-3xl">
        {!isPending && job && (
          <>
            <CardHeader className="space-y-4">
              <JobDetailsHeader job={job} />
              <hr />
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <JobDetailsSkills job={job} />

              <h2 className="text-lg font-semibold">Description</h2>
              <CardDescription
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: formatDescription(job.description as string),
                }}
              />
            </CardContent>
          </>
        )}
        {!isPending && !job && <h1>Job not found</h1>}
      </Card>
    </section>
  )
}
