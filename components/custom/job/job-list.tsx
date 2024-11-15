'use client'

import EmptyState from '@/components/custom/empty-state'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/store/AuthStore'
import { createClient } from '@/utils/supabase/client'
import { RefreshCwIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import JobListItem, { ProfileJobListItem } from './job-list-item'
import { toast } from '@/hooks/use-toast'

interface ProfileJobListProps {
  role: 'seeker' | 'provider'
}

export default function JobList({ role }: ProfileJobListProps) {
  const router = useRouter()
  const { user, profile } = useAuthStore()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [jobs, setJobs] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !profile) {
      setLoading(false)
      return
    }

    const page = +(searchParams.get('page') ?? 1)
    const size = +(searchParams.get('size') ?? 10)
    const start = (page - 1) * size
    const end = start + size
    const status = searchParams.get('status') ?? 'open'

    let selectedFields = '*'
    if (role === "provider") selectedFields = '*, job_applicants(*)'
    const query = supabase
      .from('jobs')
      .select(selectedFields)
      .eq('status', status)
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

    const location = searchParams.get('location')
    if (location) {
      query.or(
        `province.ilike.%${location}%,city_muni.ilike.%${location}%,barangay.ilike.%${location}%`,
      )
    }

    query.then(({ data, error }) => {
      if (error) {
        setError('Failed to fetch jobs. Please try again later.')
        return toast({ title: error.message, variant: 'destructive' })
      }

      console.log(data)
      setJobs(data)
      setLoading(false)
    })
  }, [role, searchParams, user, profile, supabase])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton
            key={i}
            className={`h-${20 + i * 5} w-full`}
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <Alert variant="destructive">{error}</Alert>
        <Button
          onClick={() => {
            window.location.reload()
          }}
          className="mt-2"
          variant="outline"
        >
          <RefreshCwIcon className="mr-2" /> Try Again
        </Button>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        message={
          role === 'seeker'
            ? "You're not following any jobs."
            : 'You haven’t posted any jobs yet.'
        }
        subtitle={
          role === 'seeker'
            ? 'Explore jobs that align with your interests to get started.'
            : 'Start creating a job post to reach the right candidates.'
        }
        actionLabel={role === 'seeker' ? 'Find Jobs' : 'Create Job Post'}
        onActionClick={() => {
          router.push(role === 'seeker' ? '/skr/tasks/' : '/pdr/tasks/post/')
        }}
      />
    )
  }

  // Standard Job Listing
  return (
    <div className="space-y-4 shadow-sm rounded-lg p-4">
      {jobs.map((job) => (
        <JobListItem
          key={job.id}
          job={job}
        />
      ))}
    </div>
  )
}

export function ProfileJobList({ role }: ProfileJobListProps) {
  const { profile } = useAuthStore()
  const supabase = createClient()
  const searchParams = useSearchParams()

  const [jobs, setJobs] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) {
      setLoading(false)
      return
    }

    if (role === "seeker") {
      const status = searchParams.get("status") || "pending"
      const search = searchParams.get("search") || ""

      if (["pending", "declined"].includes(status)) {
        supabase
          .from("job_applicants")
          .select("jobs(*, feedbacks(*))")
          .match({
            "status": status,
            "profile_id": profile.id
          })
          .ilike("jobs.name", `%${search}%`)
          .order("created_at", { ascending: false })
          .then(({ data, error }) => {
            if (error) return toast({ title: error.message, variant: "destructive" })
            setJobs(data.map(application => application.jobs).filter(Boolean))
          })
      } else {
        const selectedFields = '*, feedbacks(*)'
        supabase
          .from('jobs')
          .select(selectedFields)
          .match({
            "status": status,
            "seeker_id": profile.id
          })
          .ilike("name", `%${search}%`)
          .order('created_at', { ascending: false })
          .then(({ data, error }) => {
            if (error) return toast({ title: error.message, variant: "destructive" })
            if (data) {
              setJobs(data)
            }
            setLoading(false)
          })
      }
    } else {
      const selectedFields = '*, feedbacks(*)'
      supabase
        .from('jobs')
        .select(selectedFields)
        .eq("profile_id", profile.id)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) return toast({ title: error.message, variant: "destructive" })
          if (data) {
            setJobs(data)
          }
          setLoading(false)
        })
    }
  }, [profile, role, supabase, searchParams])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (jobs.length === 0) {
    return <EmptyState message="No jobs found." />
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {role === 'seeker' ? 'Your Tasks' : 'Tasks You’ve Posted'}
      </h2>
      <div className="space-y-4">
        {jobs.map((job) => (
          <ProfileJobListItem
            key={job.id}
            role="skr"
            job={job}
          />
        ))}
      </div>
    </div>
  )
}
