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
import { useEffect, useRef, useState } from 'react'

interface Props {
  job: Record<string, string>
}

export default function JobListItem({ job }: Props) {
  const [collapsed, setCollapsed] = useState(true)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  // Check if the text content overflows
  useEffect(() => {
    const element = descriptionRef.current
    if (element) {
      setIsOverflowing(element.scrollHeight > element.clientHeight)
    }
  }, [job.description])

  const descriptionClassName = () =>
    `whitespace-pre-line ${collapsed ? 'line-clamp-3' : ''}`

  function getAddress({ province, city_muni, barangay }: Props['job']) {
    let address = ''
    if (barangay) address += `${barangay}, `
    if (city_muni) address += `${city_muni}, `
    if (province) address += `${province}`

    return address
  }

  return (
    <Card className="shadow-none border rounded-lg hover:shadow-md transition-all bg-transparent max-w-4xl mx-auto">
      <CardHeader className="pb-3 flex flex-col items-start space-y-4">
        <a
          href={`${job.id}`}
          className="no-underline"
        >
          <h3 className="text-xl font-bold  hover:text-primary transition-colors">
            {job.name}
          </h3>
        </a>
        <Chip
          beforeContent={<MapPin size={16} />}
          content={getAddress(job)}
          className="w-max mt-2 bg-primary/10 text-primary text-sm rounded-full px-3 py-1 shadow-sm"
          contentClassName="max-w-[unset]"
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription
          ref={descriptionRef}
          className={descriptionClassName() + ' text-gray-600 leading-relaxed'}
          dangerouslySetInnerHTML={{
            __html: formatDescription(job.description as string),
          }}
        />
        {isOverflowing && (
          <Button
            variant="link"
            className="text-primary font-medium hover:underline p-0 !mt-2"
            onClick={() => setCollapsed(!collapsed)}
          >
            See {collapsed ? 'more' : 'less'}
          </Button>
        )}
        <div className="flex items-center justify-between pt-4">
          <p className="text-lg font-semibold text-primary">
            PHP {Number(job.price).toFixed(2)}
          </p>
          <small className="text-gray-500">
            Posted {getRecency(job.created_at)}
          </small>
        </div>
      </CardContent>
    </Card>
  )
}
