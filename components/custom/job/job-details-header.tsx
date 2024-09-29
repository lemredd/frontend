"use client"

import { Bookmark, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useEffect, useState, useTransition } from "react"
import { applyJob, checkJobApplication } from "@/actions/pdr/job"
import { useAuthStore } from "@/store/AuthStore"

interface Props {
  job: Record<string, unknown>
}

export default function JobDetailsHeader({ job }: Props) {
  const { user } = useAuthStore()
  const [isPending, startTransition] = useTransition()
  const [application, setApplication] = useState<Record<string, unknown>>()
  console.log(application)

  function apply() {
    if (!user) return
    startTransition(() => {
      applyJob({
        job_id: job.id as string,
        user_id: user.id
      }).then(({ error, application }) => {
        if (error) return console.error(error)
        setApplication(application)
      })
    })
  }

  useEffect(() => {
    if (!user) return
    startTransition(() => {
      checkJobApplication({
        job_id: job.id as string,
        user_id: user.id
      }).then(({ error, application }) => {
        if (error) return console.error(error)
        if (application) setApplication(application)
      })
    })
  }, [user, job.id])

  return (
    <header className="grid grid-flow-col grid-cols-2 grid-rows-2">
      <h1 className="text-2xl font-semibold capitalize">{job.name as string}</h1>
      <h3 className="text-lg">₱{job.price as string} PHP</h3>
      <div className="row-span-2 self-center items-center justify-end flex gap-x-2">
        {!application && (
          <Button onClick={apply} disabled={isPending}>{isPending ? 'Please wait...' : 'Apply'}</Button>
        )}
        {!!application && (
          <Button disabled>{application.status as string}</Button>
        )}
        <Share2 />
        <Bookmark />
      </div>
    </header>
  )
}
