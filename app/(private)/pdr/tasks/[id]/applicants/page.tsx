"use client"

import { useEffect, useState } from "react"

import { createClient } from "@/utils/supabase/client"
import usePaginationSearchParams from "@/hooks/usePaginationSearchParams"
import { ApplicantListItem } from "@/components/custom/job/applicant-list-item"
import { SelectedSeeker } from "@/components/custom/job/selected-seeker"
import { useJobStore } from "@/store/JobStore"

interface Props {
  params: {
    id: string
  }
}
const JOB_APPLICANT_FIELDS = `
  *,
  profiles (
    id,
    first_name,
    last_name,
    short_desc,
    addresses (
      barangay, city_muni, province
    )
  )
`
export default function TaskApplicantsPage({ params: { id } }: Props) {
  const { isJobOpen } = useJobStore()
  const supabase = createClient()
  const { start, end } = usePaginationSearchParams()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [applicants, setApplicants] = useState<any[]>([])
  const [totalApplicants, setTotalApplicants] = useState(0)

  useEffect(() => {
    supabase
      .from("job_applicants")
      .select(JOB_APPLICANT_FIELDS, { count: "exact" })
      .eq("job_id", id)
      .order("created_at", { ascending: false })
      .range(start, end)
      .then(({ data, error, count }) => {
        if (data) setApplicants(data)
        if (count) setTotalApplicants(count)
        if (error) console.error(error)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {!isJobOpen() && (
        <SelectedSeeker applicant={applicants.find(({ status }) => status === "accepted")} />
      )}
      <div className="space-y-4">
        {!isJobOpen() && (
          <h2 className="text-xl">Previous Applicants ({totalApplicants})</h2>
        )}

        {!!applicants.length && applicants.map(applicant => (
          <ApplicantListItem key={applicant.id} applicant={applicant} />
        ))}
      </div>
    </>
  )
}
