"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useAuthStore } from "@/store/AuthStore"
import { ProviderJobDetailsHeader } from "@/components/custom/job/job-details-header"

interface Props {
  params: {
    id: string
  }
}

export default function ProviderTaskPage({ params: { id } }: Props) {
  const supabase = createClient()
  const { profile } = useAuthStore()
  const [job, setJob] = useState<Record<string, unknown>>()
  const isOwned = profile?.id === job?.profile_id

  useEffect(() => {
    supabase
      .from("jobs")
      .select()
      .match({ id })
      .single()
      .then(({ data, error }) => {
        if (error) console.error(error)
        setJob(data)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section>
      <ProviderJobDetailsHeader isOwned={isOwned} job={job} />
    </section>
  )
}
