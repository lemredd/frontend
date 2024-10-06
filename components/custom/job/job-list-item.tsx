import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import { formatDescription, getRecency } from '@/lib/utils'
import { MapPin } from 'lucide-react'
import { useState } from 'react'

interface Props {
  job: Record<string, string>
}

export default function JobListItem({ job }: Props) {
  const [collapsed, setCollapsed] = useState(true)

  const descriptionClassName = () =>
    `whitespace-pre-line ${collapsed ? 'line-clamp-3' : 'line-clamp-0'}
    `

  function getAddress({ province, city_muni, barangay }: Props['job']) {
    let address = ''
    if (barangay) address += `${barangay}, `
    if (city_muni) address += `${city_muni}, `
    if (province) address += `${province}`

    return address
  }

  return (
    <Card className="border p-4 rounded space-y-2">
      <CardHeader>
        <a href={`${job.id}`}>
          <h3 className="text-lg font-semibold">{job.name}</h3>
        </a>
        <Chip
          beforeContent={<MapPin size={16} />}
          content={getAddress(job)}
          className="w-max"
          contentClassName="max-w-[unset]"
        />
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription
          className={descriptionClassName()}
          dangerouslySetInnerHTML={{
            __html: formatDescription(job.description as string),
          }}
        />
        <Button
          variant="link"
          className="p-0 -mt-2"
          onClick={() => setCollapsed(!collapsed)}
        >
          See {collapsed ? 'more' : 'less'}
        </Button>
      </CardContent>
      <p>PHP {Number(job.price).toFixed(2)}</p>
      <small>Posted {getRecency(job.created_at)}</small>
    </Card>
  )
}
