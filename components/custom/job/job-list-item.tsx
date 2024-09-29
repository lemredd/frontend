import { useState } from "react"
import { MapPin } from "lucide-react"

import { getRecency } from "@/lib/utils"
import { Chip } from "@/components/ui/chip"
import { Button } from "@/components/ui/button"

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

  function getAddress({ province, city_muni, barangay }: Props["job"]) {
    let address = ""
    if (barangay) address += `${barangay}, `
    if (city_muni) address += `${city_muni}, `
    if (province) address += `${province}`

    return address
  }

  return (
    <div className="border p-4 rounded space-y-2">
      <a href={`${job.id}`}><h3 className="text-lg font-semibold">{job.name}</h3></a>
      <Chip
        beforeContent={<MapPin size={16} />}
        content={getAddress(job)}
        className="w-max"
        contentClassName="max-w-[unset]"
      />
      <div>
        <p className={descriptionClassName()}>{job.description}</p>
        <Button variant="link" className="p-0 -mt-2" onClick={() => setCollapsed(!collapsed)}>See {collapsed ? 'more' : 'less'}</Button>
      </div>
      <p>PHP {Number(job.price).toFixed(2)}</p>
      <small>Posted {getRecency(job.created_at)}</small>
    </div>
  )
}
