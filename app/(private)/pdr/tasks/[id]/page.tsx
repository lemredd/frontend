"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useAuthStore } from "@/store/AuthStore"
import { ProviderJobDetailsHeader } from "@/components/custom/job/job-details-header"
import { JobDetailsForm } from "@/components/custom/job/job-details-form"

interface Props {
  params: {
    id: string
  }
}

export default function ProviderTaskPage({ params: { id } }: Props) {
  const supabase = createClient()
  const { profile } = useAuthStore()
  const [job, setJob] = useState<Record<string, unknown>>()
  const isOwned = !!profile && !!job && (profile?.id === job?.profile_id)

  useEffect(() => {
    supabase
      .from("jobs")
      .select<string, typeof job>(`
        id, name, description, price, status, profile_id,
        province, city_muni, barangay,
        job_skills (
          skills (id, name)
        )
      `)
      .match({ id })
      .single()
      .then(({ data, error }) => {
        if (error) console.error(error)
        setJob(data!)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="space-y-4">
      <ProviderJobDetailsHeader isOwned={isOwned} job={job} />
      <JobDetailsForm isOwned={isOwned} job={job} />
    </section>
  )
}
