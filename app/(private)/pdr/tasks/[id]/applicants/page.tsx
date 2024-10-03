"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import usePaginationSearchParams from "@/hooks/usePaginationSearchParams"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"

interface Props {
  params: {
    id: string
  }
}
export default function TaskApplicantsPage({ params: { id } }: Props) {
  const supabase = createClient()
  const { start, end } = usePaginationSearchParams()
  const [applicants, setApplicants] = useState<Record<string, unknown>[]>([])
  const [totalApplicants, setTotalApplicants] = useState(0)

  useEffect(() => {
    const fields = "*, profiles (id, first_name, last_name, profile_skills(skills(id,name)))"
    supabase
      .from("job_applicants")
      .select<string, typeof applicants[number]>(fields, { count: "exact" })
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
    <div className="space-y-4">
      <h2 className="text-xl">Task Applicants ({totalApplicants})</h2>

      {!!applicants.length && applicants.map(applicant => (
        <Card key={applicant.id as string}>
          <CardHeader>
            <h3 className="text-lg">
              {(applicant.profiles as Record<string, unknown>).first_name as string}
            </h3>
          </CardHeader>
          <CardContent>
            <pre>{JSON.stringify(applicant, null, 2)}</pre>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
