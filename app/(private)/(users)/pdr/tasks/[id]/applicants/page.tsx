'use client'

import { useEffect, useState } from 'react'

import { ApplicantListItem } from '@/components/custom/job/applicant-list-item'
import { SelectedSeeker } from '@/components/custom/job/selected-seeker'
import Spinner from '@/components/custom/spinner'
import usePaginationSearchParams from '@/hooks/usePaginationSearchParams'
import { useJobStore } from '@/store/JobStore'
import { createClient } from '@/utils/supabase/client'
import { UserRoundSearchIcon } from 'lucide-react'

interface Props {
  params: {
    id: string
  }
}
const JOB_APPLICANT_FIELDS = `
  *,
  profiles (
    *,
    addresses (
      barangay, city_muni, province
    )
  )
`

export default function TaskApplicantsPage({ params: { id } }: Props) {
  const { isJobOpen } = useJobStore()
  const supabase = createClient()
  const { start, end } = usePaginationSearchParams()
  const [applicants, setApplicants] = useState<any[]>([])
  const [totalApplicants, setTotalApplicants] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('job_applicants')
      .select(JOB_APPLICANT_FIELDS, { count: 'exact' })
      .eq('job_id', id)
      .order('created_at', { ascending: false })
      .range(start, end)
      .then(({ data, error, count }) => {
        if (data) setApplicants(data)
        if (count) setTotalApplicants(count)
        if (error) console.error(error)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) return <Spinner size="md" />

  return (
    <>
      {!isJobOpen() && (
        <SelectedSeeker
          applicant={applicants.find(({ status }) => status === 'accepted')}
        />
      )}
      <div className="space-y-4">
        {!isJobOpen() && !!totalApplicants && (
          <h2 className="text-xl">Previous Applicants ({totalApplicants})</h2>
        )}
        {!!applicants.length &&
          applicants.map((applicant) => (
            <ApplicantListItem
              key={applicant.id}
              applicant={applicant}
            />
          ))}

        {!totalApplicants && (
          <div className="text-center space-y-4">
            <UserRoundSearchIcon className="mx-auto size-24 text-gray-400" />
            <h1 className="text-2xl">No applicants yet</h1>
            <p className="text-gray-500">
              It seems like there are no applicants for this job.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
