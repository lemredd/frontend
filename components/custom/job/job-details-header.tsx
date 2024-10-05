"use client"

import { Bookmark, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useEffect, useState, useTransition } from "react"
import { applyJob, checkJobApplication } from "@/actions/pdr/job"
import { useAuthStore } from "@/store/AuthStore"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Chip } from "@/components/ui/chip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { useJobStore } from "@/store/JobStore"
import { useParams, usePathname } from "next/navigation"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export function ProviderJobDetailsHeader() {
  const { job, isOwned } = useJobStore()
  const TABS = ["details", "applicants"]
  const { id } = useParams()
  const currentTab = usePathname().split("/").filter(Boolean).slice(-1)[0]

  const buildHref = (tab: string) => `/pdr/tasks/${id}/${tab === "details" ? "" : "applicants"}`

  return (
    <header className="grid grid-flow-row gap-4 grid-cols-[1fr_auto] grid-rows-2">
      <h1 className="flex items-center gap-x-2 text-2xl font-semibold capitalize">
        {job?.name as string}
        <Chip content={job?.status as string} className="w-max" />
      </h1>
      <h3 className="text-lg self-center">₱{job?.price as string} PHP</h3>
      <div className="flex gap-x-4">
        <Tabs defaultValue={TABS.find(tab => tab === currentTab) || TABS[0]}>
          <TabsList>
            {TABS.map(tab => (
              <TabsTrigger key={tab} value={tab} asChild>
                <Link href={buildHref(tab)}>
                  <span className="capitalize">{tab}</span>
                </Link>
              </TabsTrigger>
            ))}

          </TabsList>
        </Tabs>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">...</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup className="px-2 py-1">
              {isOwned && (
                <DropdownMenuItem className="hover:outline-none px-2 hover:bg-rose-500 transition-colors rounded cursor-pointer">
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
  const [proposal, setProposal] = useState("")

  function apply() {
    if (!user) return
    startTransition(() => {
      applyJob({
        job_id: job?.id as string,
        user_id: user.id,
        proposal
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
        user_id: user.id
      }).then(({ error, application }) => {
        if (error) return console.error(error)
        if (application) setApplication(application)
      })
    })
  }, [user, job?.id])

  return (
    <header className="grid grid-flow-col grid-cols-2 grid-rows-2">
      <h1 className="text-2xl font-semibold capitalize">{job?.name as string}</h1>
      <h3 className="text-lg">₱{job?.price as string} PHP</h3>
      <div className="row-span-2 self-center items-center justify-end flex gap-x-2">
        {!application && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Apply</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Tell us why you want this job</DialogTitle>
                <DialogDescription>
                  Stand out among other applicants by explaining why the client should choose you for this job.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Textarea value={proposal} onChange={e => setProposal(e.target.value)} />
              </div>
              <DialogFooter>
                <Button type="submit" onClick={apply} disabled={isPending}>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        {!!application && (
          <Button disabled>{application.status as string}</Button>
        )}
        <Share2 />
        <Bookmark />
      </div>
    </header>
  )
}
