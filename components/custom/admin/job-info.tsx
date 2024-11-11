'use client'

import { deleteJobs } from '@/actions/job'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { getAddress } from '@/lib/utils'
import { Info } from 'lucide-react'
import { useTransition } from 'react'

interface JobInfoProps {
  job: Record<string, any>
}

function Details({ job }: JobInfoProps) {
  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold ">Details</div>
      <div className="grid grid-cols-[1fr_2fr] gap-y-2 text-sm ">
        <div className="font-medium">Name</div>
        <div>{job.name}</div>
        <div className="font-medium">Location</div>
        <div>{getAddress(job)}</div>
        <div className="font-medium">Created At</div>
        <div>{new Date(job.created_at).toLocaleString()}</div>
        <div className="font-medium">Setup</div>
        <div>{job.setup}</div>
      </div>

      <div className="mt-4 text-lg font-semibold ">Skills</div>
      <div className="text-sm ">
        {job.job_skills
          .map((job_skill: Record<string, any>) => job_skill.skills.name)
          .join(', ')}
      </div>
    </div>
  )
}

export function JobInfo({ job }: JobInfoProps) {
  const [isPending, startTransition] = useTransition()

  function deleteJob() {
    startTransition(() => {
      deleteJobs([job.id]).then(({ error }) => {
        if (error) return console.error(error)
      })
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Info className="cursor-pointer text-blue-600 hover:text-blue-700" />
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Job Information
          </DialogTitle>
          <DialogDescription className="text-sm ">
            Details about this job
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Details job={job} />
        </div>

        <DialogFooter className="flex justify-end space-x-2 mt-6">
          <Button
            variant="destructive"
            onClick={deleteJob}
            disabled={isPending}
          >
            Delete
          </Button>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
