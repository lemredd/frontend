"use client"

import { useEffect, useState, useTransition } from "react"

import { createClient } from "@/utils/supabase/client"
import JobDetailsHeader from "@/components/custom/job/job-details-header"
import JobDetailsSkills from "@/components/custom/job/job-details-skills"

interface Props {
  params: { id: string }
}

export default function JobDetailsPage({ params: { id } }: Props) {
  const [isPending, startTransition] = useTransition()
  const supabase = createClient()
  const [job, setJob] = useState<Record<string, unknown>>()

  console.log(job)
  useEffect(() => {
    startTransition(() => {
      supabase
        .from("jobs")
        .select(`
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
        `)
        .eq("id", id)
        .single()
        .then(({ data }) => {
          if (data) setJob(data)
        })
    })
  }, [])

  return (
    <div className="space-y-8">
      {!isPending && job && (
        <>
          <div className="space-y-4">
            <JobDetailsHeader job={job} />
            <hr />
          </div>
          <section className="space-y-2">
            <JobDetailsSkills job={job} />
          </section>
          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="whitespace-pre-line">{job.description as string}</p>
          </section>
        </>
      )}
      {!isPending && !job && (
        <h1>Job not found</h1>
      )}
    </div >
  )
}
