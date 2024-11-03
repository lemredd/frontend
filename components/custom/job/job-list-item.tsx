import { CollapsibleDesc } from '@/components/custom/collapsible-desc'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import SecondBrain from '@/components/ui/second-brain'
import { getAddress, getRecency } from '@/lib/utils'
import { useAuthStore } from '@/store/AuthStore'
import { Clock, MapPin, PhilippinePesoIcon } from 'lucide-react'
import Link from 'next/link'
import { SeekerFeedbackForm } from './feedback'

interface Props {
  job: Record<string, any>
}

export default function JobListItem({ job }: Props) {
  return (
    <Card className="modern-card ">
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
        <div className="flex gap-x-2">
          <Chip
            beforeContent={<MapPin size={18} />}
            content={getAddress(job)}
            className=" bg-primary text-white text-sm rounded-full px-4 py-1 flex items-center gap-1 shadow-md"
            contentClassName="max-w-[unset]"
          />
          <Chip
            getStatusColor
            content={job?.setup}
            contentClassName="uppercase max-w-[unset]"
          />
        </div>
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

interface ProfileJobListItemProps extends Props {
  role: 'skr' | 'pdr'
}
export function ProfileJobListItem({ job, role }: ProfileJobListItemProps) {
  const { profile } = useAuthStore()
  const hasGivenFeedback = job.feedbacks.some(
    (feedback: Record<string, any>) => feedback.from_id === profile?.id,
  )
  return (
    <Card className="modern-card">
      {/* Job Header */}
      <CardHeader className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="space-y-1">
          <Link href={`/${role}/tasks/${job.id}`}>
            <h3 className="text-3xl font-extrabold ">{job.name}</h3>
          </Link>
          <div className="flex items-center gap-2 text-xs dark:text-gray-400">
            <Clock
              size={16}
              className="dark:text-gray-500"
            />
            <span>Posted {getRecency(job.created_at)}</span>
          </div>
        </div>

        {/* Job Location */}
        <div className="flex gap-x-4">
          <Chip
            beforeContent={<MapPin size={18} />}
            content={getAddress(job)}
            className="bg-primary text-white text-sm rounded-full px-4 py-1 flex items-center gap-1 shadow-md"
            contentClassName="max-w-[unset]"
          />
          <Chip
            className="w-max capitalize"
            content={job.status}
            getStatusColor
          />
        </div>
      </CardHeader>

      {/* Job Content */}
      <CardContent className="space-y-4 ">
        <CollapsibleDesc
          content={job.description as string}
          className="leading-relaxed dark:text-gray-300"
        />

        {/* Job Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          {job.status === 'completed' && !hasGivenFeedback && (
            <SeekerFeedbackForm job={job} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
