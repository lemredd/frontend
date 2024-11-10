'use client'

import { approveApplicant } from '@/actions/job'
import { CollapsibleDesc } from '@/components/custom/collapsible-desc'
import Spinner from '@/components/custom/spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
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
    <Card className="border dark:border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 dark:bg-gray-800/50 dark:text-white">
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <Link href={`/skr/${applicant.profiles.username}`}>
              <h3 className="text-lg font-semibold hover:underline">
                {applicant.profiles.first_name} {applicant.profiles.last_name}
              </h3>
            </Link>
            <div className="text-sm flex items-center space-x-1 mt-1">
              <MapPin
                size={14}
                className="dark:text-gray-400"
              />
              <span>
                {Object.values(applicant.profiles.addresses[0]).join(', ')}
              </span>
            </div>
          </div>
          {isJobOpen() && (
            <Button
              className="text-white bg-green-600 hover:bg-green-700 rounded-md px-4 py-2"
              disabled={isPending}
              onClick={approve}
            >
              {isPending ? <Spinner size="xs" /> : 'Approve'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CollapsibleDesc content={applicant.proposal} />
      </CardContent>
      <CardFooter className="p-4 text-sm border-t dark:border-gray-700">
        Applied on: {new Date(applicant.created_at).toLocaleDateString()}
      </CardFooter>
    </Card>
  )
}
