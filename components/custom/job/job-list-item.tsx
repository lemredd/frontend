import { Button } from "@/components/ui/button"
import { getRecency } from "@/lib/utils"
import { useState } from "react"

interface Props {
  job: Record<string, string>
}

export default function JobListItem({ job }: Props) {
  const [collapsed, setCollapsed] = useState(true)

  const descriptionClassName = () => (
    `whitespace-pre-line ${collapsed
      ? 'line-clamp-3'
      : 'line-clamp-0'}
    `
  )

  return (
    <div className="border p-4 rounded space-y-2">
      <a href={`${job.id}`}><h3 className="text-lg font-semibold">{job.name}</h3></a>
      <div>
        <p className={descriptionClassName()}>{job.description}</p>
        <Button variant="link" className="p-0 -mt-2" onClick={() => setCollapsed(!collapsed)}>See {collapsed ? 'more' : 'less'}</Button>
      </div>
      <p>PHP {Number(job.price).toFixed(2)}</p>
      <small>Posted {getRecency(job.created_at)}</small>
    </div>
  )
}
