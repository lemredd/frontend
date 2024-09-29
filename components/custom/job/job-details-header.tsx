"use client"

import { Bookmark, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { applyJob } from "@/actions/pdr/job"
import { useAuthStore } from "@/store/AuthStore"

interface Props {
  job: Record<string, unknown>
}

export default function JobDetailsHeader({ job }: Props) {
  const { user } = useAuthStore()
  const [isPending, startTransition] = useTransition()
  function apply() {
    startTransition(() => {
      applyJob({ job_id: job.id as string }).then(({ error, success }) => {
        if (error) console.error(error)
        if (success) console.log(success)
      })
    })
  }
  return (
    <header className="grid grid-flow-col grid-cols-2 grid-rows-2">
      <h1 className="text-2xl font-semibold capitalize">{job.name as string}</h1>
      <h3 className="text-lg">₱{job.price as string} PHP</h3>
      <div className="row-span-2 self-center items-center justify-end flex gap-x-2">
        <Button onClick={apply} disabled={isPending}>{isPending ? 'Applying...' : 'Apply'}</Button>
        <Share2 />
        <Bookmark />
      </div>
    </header>
  )
}
