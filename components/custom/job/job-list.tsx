'use client'

import Spinner from '@/components/custom/spinner'
import { useAuthStore } from '@/store/AuthStore'
import { createClient } from '@/utils/supabase/client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import JobListItem from './job-list-item'

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
    <div className="gap-4">
      {jobs.map((job) => (
        <JobListItem
          key={job.id}
          job={job}
        />
      ))}
    </div>
  )
}
