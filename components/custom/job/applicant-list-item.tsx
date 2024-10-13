'use client'

import { approveApplicant } from '@/actions/pdr/job'
import { CollapsibleDesc } from '@/components/custom/collapsible-desc'
import Spinner from '@/components/custom/spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import { useJobStore } from '@/store/JobStore'
import { MapPin } from 'lucide-react'
import Link from 'next/link'
import { useTransition } from 'react'

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
    <Card className="modern-card">
      <CardHeader>
        <Link href={`/skr/${applicant.profiles.username}`}>
          <h3 className="text-lg font-bold">
            {/* TODO: link to seeker profile */}
            {applicant.profiles.first_name as string}
          </h3>
        </Link>
        <p>{applicant.profiles.short_desc}</p>
        <Chip
          beforeContent={<MapPin size={16} />}
          content={Object.values(applicant.profiles.addresses[0]).join(', ')}
          className="w-max"
          contentClassName="max-w-[unset]"
        />
      </CardHeader>
      <CardContent>
        <CollapsibleDesc content={applicant.proposal} />
      </CardContent>
      {isJobOpen() && (
        <CardFooter className="justify-end">
          <Button
            className="text-white bg-green-500 hover:bg-green-600 transition-colors duration-200"
            disabled={isPending}
            onClick={approve}
          >
            {isPending ? <Spinner size="xs" /> : 'Approve'}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
