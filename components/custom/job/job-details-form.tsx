"use client"

import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { Form } from "@/components/ui/form"
import { Edit } from "lucide-react"
import { useState } from "react"

interface Props {
  job?: Record<string, unknown>
}

interface ProviderJobDetailsFormProps extends Props {
  isOwned: boolean
}
export function JobDetailsForm({ isOwned, job }: ProviderJobDetailsFormProps) {
  const [editing, setEditing] = useState(false)
  if (!isOwned || !editing) return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl">Project Details</h2>
        {isOwned && (
          <Button size="icon" variant="ghost" onClick={() => setEditing(true)}><Edit /></Button>
        )}
      </div>
      <p className="whitespace-pre-line">{job?.description as string}</p>
      <h3 className="text-lg font-semibold">Required skills</h3>
      <div className="flex flex-wrap gap-2">
        {(job?.job_skills as Record<"skills", Record<string, unknown>>[])?.map(({ skills }) => (
          <Chip key={skills?.id as string} content={skills?.name as string} className="w-max" contentClassName="max-w-[unset]" />
        ))}
      </div>
    </div>
  )

  return (
    <form>
      <div className="flex gap-x-2">
        <Button type="button" className="uppercase" variant="secondary" onClick={() => setEditing(false)}>cancel</Button>
        <Button type="submit" className="uppercase">save</Button>
      </div>
    </form>
  )
}
