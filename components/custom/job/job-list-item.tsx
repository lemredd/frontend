import { getRecency } from "@/lib/utils"

interface Props {
  job: Record<string, string>
}

export default function JobListItem({ job }: Props) {
  return (
    <a href={`${job.id}`} className="block border p-4 rounded">
      <h3 className="text-lg font-semibold">{job.name}</h3>
      <p>{job.description}</p>
      <p>{job.price}</p>
      <small>Posted {getRecency(job.created_at)}</small>
    </a>
  )
}
