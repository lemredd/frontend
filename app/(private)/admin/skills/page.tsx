import { Suspense } from "react"

import { SKILL_LIST_PAGE_SIZE } from "@/lib/constants"
import { createClient } from "@/utils/supabase/server"
import { SkillsTable } from "@/components/custom/admin/skills-table"

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

interface SkillsProps {
  searchParams: Record<string, string | string[] | undefined>
}
export default async function Skills({ searchParams }: SkillsProps) {
  const
    page = +(searchParams.page as string),
    start = !!page ? (page - 1) * SKILL_LIST_PAGE_SIZE : 0,
    end = !!page ? page * SKILL_LIST_PAGE_SIZE : SKILL_LIST_PAGE_SIZE,
    search = searchParams.search as string || ""

  const supabase = createClient()
  const result = await supabase
    .from("skills")
    .select("*, skill_categories(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .ilike("name", `%${search}%`)
    .range(start, end)
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
          <SkillsTable data={result} />
        </div>
      </div>
    </Suspense>
  )
}
