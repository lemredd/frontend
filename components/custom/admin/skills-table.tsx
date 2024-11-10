"use client"

import { useEffect, useState, useTransition } from "react"
import { User } from "@supabase/supabase-js"
import { useRouter, useSearchParams } from "next/navigation"
import { ColumnDef, PaginationState } from "@tanstack/react-table"

import { listUsers } from "@/actions/user"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { deleteSkills } from "@/actions/skills"
import { TableInjectionProps } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/ui/data-table"
import { SKILL_LIST_PAGE_SIZE } from "@/lib/constants"
import { SkillForm } from "@/components/custom/admin/skills-form"

const SKILL_TABLE_COLUMNS: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={value => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Name"
  },
  {
    accessorKey: "skill_categories.name",
    header: "Category",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleString()
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <SkillForm skill={row.original} />
    )
  }
]


export interface SelectedActionsProps<TData> extends TableInjectionProps<TData> { }
function SelectedActions({ table }: SelectedActionsProps<User>) {
  const [isPending, startTransition] = useTransition()

  function deleteSelected() {
    startTransition(() => {
      const ids = table.getSelectedRowModel().rows.map(row => row.original.id)
      deleteSkills(ids).then(({ error }) => {
        if (error) return console.error(error)
        table.toggleAllRowsSelected(false)
      })
    })
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={deleteSelected}
      disabled={isPending}
    >
      Delete selected
    </Button>
  )
}

function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get("search") || "")

  useEffect(() => {
    let to = location.pathname
    if (!to.endsWith("?")) to += "?"
    if (value) to += `&search=${value}`

    const debouncer = setTimeout(() => {
      router.push(to)
    }, 700)

    return () => clearTimeout(debouncer)
  }, [router, value])

  return (
    <div className="w-full flex items-center justify-between gap-x-2">
      <Input
        placeholder="Search skill by name..."
        value={value}
        onChange={event => setValue(event.target.value)}
        className="max-w-sm"
      />
      <SkillForm />
    </div>
  )
}

interface UserTableProps {
  data: Awaited<ReturnType<typeof listUsers>>["data"]
}
export function SkillsTable({ data: { data, count } }: UserTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const pageCount = !!count ? Math.ceil(count / SKILL_LIST_PAGE_SIZE) : 0
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: searchParams.get("page") ? Number(searchParams.get("page")) - 1 : 0,
    pageSize: SKILL_LIST_PAGE_SIZE
  })

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    if (pagination.pageIndex) newSearchParams.set("page", (pagination.pageIndex + 1).toString())
    else newSearchParams.delete("page")
    const to = location.pathname + "?" + newSearchParams.toString()
    router.push(to)
  }, [pagination, router, searchParams])

  return (
    <DataTable
      columns={SKILL_TABLE_COLUMNS}
      data={data}
      pageCount={pageCount}
      manualPagination={!!count}
      onPaginationChange={setPagination}
      state={{ pagination }}
      SelectedActions={SelectedActions}
      SearchInput={SearchInput}
    />
  )
}

