import { Bookmark, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"

interface Props {
  job: Record<string, unknown>
}

export default function JobDetailsHeader({ job }: Props) {
  return (
    <header className="grid grid-flow-col grid-cols-2 grid-rows-2">
      <h1 className="text-2xl font-semibold capitalize">{job.name as string}</h1>
      <h3 className="text-lg">₱{job.price as string} PHP</h3>
      <div className="row-span-2 self-center items-center justify-end flex gap-x-2">
        <Button>Apply</Button>
        <Share2 />
        <Bookmark />
      </div>
    </header>
  )
}
