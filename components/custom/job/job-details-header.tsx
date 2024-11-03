'use client'

import { applyJob, checkJobApplication } from '@/actions/pdr/job'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthStore } from '@/store/AuthStore'
import { useJobStore } from '@/store/JobStore'
import { Clock, PhilippinePesoIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'

import Spinner from '@/components/custom/spinner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { getRecency } from '@/lib/utils'

export function ProviderJobDetailsHeader() {
  const { job } = useJobStore()
  const TABS = ['details', 'applicants']
  const { id } = useParams()
  const currentTab = usePathname().split('/').filter(Boolean).slice(-1)[0]

  const buildHref = (tab: string) =>
    `/pdr/tasks/${id}/${tab === 'details' ? '' : 'applicants'}`

  if (!job) return null

  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
      {/* Job Title and Status */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <h1 className="text-2xl font-extrabold capitalize flex items-center gap-x-2">
          {job?.name as string}
        </h1>
        <Chip
          getStatusColor
          content={job?.status as string}
          className="w-max capitalize"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue={TABS.find((tab) => tab === currentTab) || TABS[0]}>
        <TabsList className="flex justify-start">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              asChild
            >
              <Link href={buildHref(tab)}>
                <span className="capitalize">{tab}</span>
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </header>
  )
}

interface Props {
  job: Record<string, unknown>
}

export default function JobDetailsHeader({ job }: Props) {
  const { user } = useAuthStore()
  const [isPending, startTransition] = useTransition()
  const [application, setApplication] = useState<Record<string, unknown>>()
  const [proposal, setProposal] = useState('')

  function apply() {
    if (!user) return
    startTransition(() => {
      applyJob({
        job_id: job?.id as string,
        user_id: user.id,
        proposal,
      }).then(({ error, application }) => {
        if (error) return console.error(error)
        setApplication(application)
      })
    })
  }

  useEffect(() => {
    if (!user) return
    startTransition(() => {
      checkJobApplication({
        job_id: job?.id as string,
        user_id: user.id,
      }).then(({ error, application }) => {
        if (error) return console.error(error)
        if (application) setApplication(application)
      })
    })
  }, [user, job?.id])

  return (
    <header className="w-full flex flex-col sm:flex-row  justify-center sm:justify-between items-center gap-2 text-center sm:text-left">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold capitalize">
          {job?.name as string}
        </h1>

        <div className="flex items-center gap-2 justify-center sm:justify-start text-2xl font-semibold ">
          <PhilippinePesoIcon
            size={22}
            className="text-green-400"
          />
          <span>{Number(job.price).toFixed(2)}</span>
        </div>

        <div className="text-sm dark:text-gray-400 sm:hidden items-center gap-2 flex">
          <Clock
            size={18}
            className="dark:text-gray-500"
          />
          <span>Posted {getRecency(job.created_at as string)}</span>
        </div>
      </div>

      <div className="items-center flex flex-col sm:flex-row gap-2">
        <Chip
          getStatusColor
          content={job?.status as string}
          className="w-max uppercase"
        />
        {!application && (
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={isPending}>
                {isPending ? <Spinner size="sm" /> : 'Apply Now'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Tell us why you want this job</DialogTitle>
                <DialogDescription>
                  Stand out among other applicants by explaining why the client
                  should choose you for this job.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Textarea
                  value={proposal}
                  className="resize-none"
                  onChange={(e) => setProposal(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={apply}
                  disabled={isPending || !proposal}
                >
                  {isPending ? <Spinner size="sm" /> : 'Submit'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        {!!application && (
          <Chip
            getStatusColor
            content={application.status as string}
            className="capitalize"
          />
        )}
      </div>
    </header>
  )
}
