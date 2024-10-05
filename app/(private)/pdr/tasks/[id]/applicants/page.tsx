"use client"

import { CollapsibleDesc } from "@/components/custom/collapsible-desc"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Chip } from "@/components/ui/chip"
import usePaginationSearchParams from "@/hooks/usePaginationSearchParams"
import { createClient } from "@/utils/supabase/client"
import { MapPin } from "lucide-react"
import { useEffect, useState } from "react"

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
  const supabase = createClient()
  const { start, end } = usePaginationSearchParams()
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
    <div className="space-y-4">
      <h2 className="text-xl">Task Applicants ({totalApplicants})</h2>

      {!!applicants.length && applicants.map(applicant => (
        <Card key={applicant.id as string}>
          <CardHeader>
            <h3 className="text-lg font-bold">
              {applicant.profiles.first_name as string}
            </h3>
            <p>{applicant.profiles.short_desc}</p>

            <Chip
              beforeContent={<MapPin size={16} />}
              content={Object.values(applicant.profiles.addresses[0]).join(", ")}
              className="w-max"
              contentClassName="max-w-[unset]"
            />
          </CardHeader>
          <CardContent>
            <CollapsibleDesc content={applicant.proposal} />
          </CardContent>
          <CardFooter className="justify-end gap-x-4">
            <Button variant="destructive">Reject</Button>
            <Button>Approve</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
