import { CollapsibleDesc } from '@/components/custom/collapsible-desc'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import SecondBrain from '@/components/ui/second-brain'
import { getRecency } from '@/lib/utils'
import { Clock, MapPin, PhilippinePesoIcon } from 'lucide-react'
import Link from 'next/link'

interface Props {
  job: Record<string, string>
}

export default function JobListItem({ job }: Props) {
  function getAddress({ province, city_muni, barangay }: Props['job']) {
    let address = ''
    if (barangay) address += `${barangay}, `
    if (city_muni) address += `${city_muni}, `
    if (province) address += `${province}`

    return address
  }

  return (
    <Card className="bg-white dark:bg-gradient-to-r from-gray-800 via-gray-900 to-black shadow-xl border dark:border-gray-700 rounded-lg hover:shadow-2xl transition duration-300 max-w-4xl mx-auto space-y-6 ">
      {/* Job Header */}
      <CardHeader className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="space-y-1">
          <h3 className="text-3xl font-extrabold ">{job.name}</h3>
          <div className="flex items-center gap-2 text-xs dark:text-gray-400">
            <Clock
              size={16}
              className="dark:text-gray-500"
            />
            <span>Posted {getRecency(job.created_at)}</span>
          </div>
        </div>

        {/* Job Location */}
        <Chip
          beforeContent={<MapPin size={18} />}
          content={getAddress(job)}
          className="bg-primary text-white text-sm rounded-full px-4 py-1 flex items-center gap-1 shadow-md"
          contentClassName="whitespace-nowrap max-w-[unset]"
        />
      </CardHeader>

      {/* Job Content */}
      <CardContent className="space-y-4 ">
        <CollapsibleDesc
          content={job.description as string}
          className="leading-relaxed dark:text-gray-300"
        />

        {/* Job Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center gap-4 text-2xl font-semibold">
            <PhilippinePesoIcon
              size={22}
              className="text-green-400"
            />
            <span>{Number(job.price).toFixed(2)}</span>
          </div>

          <SecondBrain size="sm">
            <Link
              href={`${job.id}`}
              className="text-white"
            >
              View Details
            </Link>
          </SecondBrain>
        </div>
      </CardContent>
    </Card>
  )
}
