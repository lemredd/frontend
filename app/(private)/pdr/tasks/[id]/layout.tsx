"use client"

import { useEffect } from "react"

import { useJobStore } from "@/store/JobStore"
import { useAuthStore } from "@/store/AuthStore"
import { createClient } from "@/utils/supabase/client"
import { ProviderJobDetailsHeader } from "@/components/custom/job/job-details-header"

interface Props {
  children: React.ReactNode
  params: {
    id: string
  }
}
export default function ProviderTaskDetailLayout({
  children,
  params: { id }
}: Props) {
  const supabase = createClient()
  const { profile } = useAuthStore()
  const { job, setJob } = useJobStore()

  useEffect(() => {
    if (!profile) return
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
        setJob(data!, profile.id === data!.profile_id)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  return (
    <section className="space-y-4">
      <ProviderJobDetailsHeader />
      {children}
    </section>
  )
}
