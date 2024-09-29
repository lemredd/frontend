"use client"

import { useAuthStore } from "@/store/AuthStore";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import JobListItem from "./job-list-item";

export default function JobList() {
  const { user } = useAuthStore()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [jobs, setJobs] = useState<Record<string, string>[]>([])

  useEffect(() => {
    const page = +(searchParams.get("page") ?? 1)
    const size = +(searchParams.get("size") ?? 10)
    const start = (page - 1) * size
    const end = start + size

    const query = supabase
      .from("jobs")
      .select("id, created_at, name, description, price")
      .order("created_at", { ascending: false })
      .range(start, end)

    const search = searchParams.get("search")
    if (search) query
      .textSearch('search_jobs', `'${search}'`)

    // TODO: default query to user province
    const location = searchParams.get("location")
    if (location) query
      .or(`province.ilike.%${location}%,city_muni.ilike.%${location}%,barangay.ilike.%${location}%`)

    query
      .then(({ data, error }) => {
        if (data) setJobs(data)
        if (error) console.error(error)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobListItem key={job.id} job={job} />
      ))}
    </div>
  )
}
