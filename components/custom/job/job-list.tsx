'use client'

import Spinner from '@/components/custom/spinner'
import { useAuthStore } from '@/store/AuthStore'
import { createClient } from '@/utils/supabase/client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import JobListItem, { ProfileJobListItem } from './job-list-item'

export default function JobList() {
  const { user, profile } = useAuthStore()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [jobs, setJobs] = useState<Record<string, string>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !profile) {
      setLoading(false)
      return
    }

    // TODO: usePaginationSearchParams

    const page = +(searchParams.get('page') ?? 1)
    const size = +(searchParams.get('size') ?? 10)
    const start = (page - 1) * size
    const end = start + size

    const selectedFields =
      'id, created_at, name, description, price, province, city_muni, barangay'
    const query = supabase
      .from('jobs')
      .select(selectedFields)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .range(start, end)

    const { role_code: roleCode } = user.user_metadata
    if (roleCode === 'PDR') {
      query.eq('profile_id', profile.id)
    }

    const search = searchParams.get('search')
    if (search) {
      query.textSearch('search_jobs', `'${search}'`)
    }

    // TODO: default query to user province
    const location = searchParams.get('location')
    if (location) {
      query.or(
        `province.ilike.%${location}%,city_muni.ilike.%${location}%,barangay.ilike.%${location}%`,
      )
    }

    query.then(({ data, error }) => {
      if (data) setJobs(data)
      if (error) console.error(error)
      setLoading(false)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, user, profile])

  if (loading) {
    return <Spinner />
  }

  if (!loading && jobs.length === 0) {
    return <p>No jobs found.</p>
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobListItem
          key={job.id}
          job={job}
        />
      ))}
    </div>
  )
}

interface ProfileJobListProps {
  role: "seeker" | "provider"
}
export function ProfileJobList({ role }: ProfileJobListProps) {
  const { profile } = useAuthStore()
  const supabase = createClient()

  const [jobs, setJobs] = useState<Record<string, any>[]>([])
  const matcher = role === "seeker" ? "seeker_id" : "profile_id"
  const roleLink = role === "seeker" ? "skr" : "pdr"

  useEffect(() => {
    if (!profile) return

    const selectedFields = '*, feedbacks(*)'
    supabase
      .from('jobs')
      .select(selectedFields)
      .eq(matcher, profile.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (data) setJobs(data)
        if (error) console.error(error)
      })
  }, [profile, supabase, matcher])

  return (
    <>
      <h2 className="text-xl">My Jobs</h2>
      <div className="space-y-4">
        {jobs.map((job) => (
          <ProfileJobListItem
            key={job.id}
            role={roleLink}
            job={job}
          />
        ))}
      </div>
    </>
  )
}
