"use client"

import { useAuthStore } from "@/store/AuthStore";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
      .select("id, name, description, price")
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
  }, [searchParams])

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job.id} className="border p-2">
          <p>{job.name}</p>
          <p>{job.description}</p>
          <p>{job.price}</p>
        </div>
      ))}
    </div>
  )
}
