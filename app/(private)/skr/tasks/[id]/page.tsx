'use client'

import JobDetailsHeader from '@/components/custom/job/job-details-header'
import JobDetailsSkills from '@/components/custom/job/job-details-skills'
import Spinner from '@/components/custom/spinner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { formatDescription, getRecency } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import { Clock } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'

interface Props {
  params: { id: string }
}

export default function JobDetailsPage({ params: { id } }: Props) {
  const [isPending, startTransition] = useTransition()
  const supabase = createClient()
  const [job, setJob] = useState<Record<string, unknown>>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    startTransition(() => {
      supabase
        .from('jobs')
        .select(
          `id,
           name,
           description,
           price,
           created_at,
           province,
           city_muni,
           barangay,
           job_skills (
             skills (
               id,
               name
             )
           )`,
        )
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error(error)
          }
          if (data) setJob(data)

          setLoading(false)
        })
    })
  }, [id])

  // TODO: USE GET ADDRESS
  // const getAddress = (job: Record<string, string>) => {
  //   const { province, city_muni, barangay } = job
  //   let address = ''
  //   if (barangay) address += `${barangay}, `
  //   if (city_muni) address += `${city_muni}, `
  //   if (province) address += `${province}`

  //   return address
  // }

  if (loading) {
    return <Spinner />
  }

  if (!job) {
    return <p>Job not found.</p>
  }

  return (
    <Card className="bg-white border-gray-300 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-900 dark:to-black shadow-xl border dark:border-gray-700 rounded-lg hover:shadow-2xl transition duration-300 max-w-4xl mx-auto py-3  min-w-2xl w-full">
      {!isPending && job && (
        <>
          <CardHeader className="space-y-4">
            <JobDetailsHeader job={job} />
            <hr />
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {/* Job Location */}
            <div className="text-sm dark:text-gray-400 sm:flex items-center gap-2 hidden">
              <Clock
                size={18}
                className="dark:text-gray-500"
              />
              <span>Posted {getRecency(job.created_at as string)}</span>
            </div>

            {/* Job Skills */}
            <JobDetailsSkills job={job} />

            {/* Job Description */}
            <h2 className="text-lg font-semibold">Description</h2>
            <CardDescription
              className="whitespace-pre-line dark:text-gray-300"
              dangerouslySetInnerHTML={{
                __html: formatDescription(job.description as string),
              }}
            />
          </CardContent>
        </>
      )}
    </Card>
  )
}
