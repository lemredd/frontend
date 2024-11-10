"use client"

import { deleteJobs } from "@/actions/job";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getAddress } from "@/lib/utils";
import { Info } from "lucide-react";
import { useTransition } from "react";

interface JobInfoProps {
  job: Record<string, any>
}

function Details({ job }: JobInfoProps) {
  return (
    <div className="grid grid-cols-2 grid-rows-auto gap-y-2 grid-flow-row">
      <div>Name</div><div>{job.name}</div>
      <div>Location</div><div>{getAddress(job)}</div>
      <div>Created At</div><div>{new Date(job.created_at).toLocaleString()}</div>
      <div>Setup</div><div>{job.setup}</div>
      <div>Skills</div><div>{job.job_skills.map((job_skill: Record<string, any>) => job_skill.skills.name).join(", ")}</div>
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
        <Info className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Job Information</DialogTitle>
          <DialogDescription>Details about this job</DialogDescription>
        </DialogHeader>
        <Details job={job} />
        <DialogFooter>
          <Button variant="destructive" onClick={deleteJob} disabled={isPending}>Delete</Button>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
