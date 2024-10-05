"use client"

import { MapPin } from "lucide-react"
import { Chip } from "@/components/ui/chip"
import { Button } from "@/components/ui/button"
import { CollapsibleDesc } from "@/components/custom/collapsible-desc"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useTransition } from "react"
import { approveApplicant } from "@/actions/pdr/job"
import { useJobStore } from "@/store/JobStore"

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  applicant: Record<string, any>
}

export function ApplicantListItem({ applicant }: Props) {
  const { isJobOpen } = useJobStore()
  const [isPending, startTransition] = useTransition()

  function approve() {
    startTransition(() => {
      approveApplicant({ job_applicant_id: applicant.id }).then(({ error }) => {
        if (error) return console.error(error)

        location.reload()
      })
    })
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-bold">
          {/* TODO: link to seeker profile */}
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
      {isJobOpen() && (
        <CardFooter className="justify-end">
          <Button disabled={isPending} onClick={approve}>Approve</Button>
        </CardFooter>
      )}
    </Card>
  )
}
