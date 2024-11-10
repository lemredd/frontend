import { Suspense } from "react"

import { listUsers } from "@/actions/user"
import { UserTable } from "@/components/custom/admin/user-table"

function Fallback() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/*
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      */}
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  )
}

interface UsersProps {
  searchParams: Record<string, string | string[] | undefined>
}
export default async function Users({ searchParams }: UsersProps) {
  const { page, search } = searchParams
  const { data } = await listUsers(searchParams.page ? parseInt(page as string) : 1, search as string)

  return (
    <Suspense fallback={<Fallback />}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/*
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      */}
        <div className="min-h-[100vh] px-4 py-2 flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <UserTable data={data} />
        </div>
      </div>
    </Suspense>
  )
}
