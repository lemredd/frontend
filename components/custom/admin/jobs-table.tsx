'use client'

import { User } from '@supabase/supabase-js'
import { ColumnDef, PaginationState } from '@tanstack/react-table'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'

import { deleteJobs } from '@/actions/job'
import { listUsers } from '@/actions/user'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { JOB_LIST_PAGE_SIZE } from '@/lib/constants'
import { TableInjectionProps } from '@/lib/types'
import { JobInfo } from './job-info'

const JOB_TABLE_COLUMNS: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <JobInfo job={row.original} />,
  },
]

export interface SelectedActionsProps<TData>
  extends TableInjectionProps<TData> {}
function SelectedActions({ table }: SelectedActionsProps<User>) {
  const [isPending, startTransition] = useTransition()

  function deleteSelected() {
    startTransition(() => {
      const ids = table.getSelectedRowModel().rows.map((row) => row.original.id)
      deleteJobs(ids).then(({ error, success }) => {
        if (error)
          return toast({ variant: 'destructive', title: error.message })
        table.toggleAllRowsSelected(false)
        toast({ title: success, variant: 'success' })
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
  const [value, setValue] = useState(searchParams.get('search') || '')

  useEffect(() => {
    let to = location.pathname
    if (!to.endsWith('?')) to += '?'
    if (value) to += `&search=${value}`

    const debouncer = setTimeout(() => {
      router.push(to)
    }, 700)

    return () => clearTimeout(debouncer)
  }, [router, value])

  return (
    <Input
      placeholder="Search job by name..."
      value={value}
      onChange={(event) => setValue(event.target.value)}
      className="max-w-sm"
    />
  )
}

interface UserTableProps {
  data: Awaited<ReturnType<typeof listUsers>>['data']
}
export function JobsTable({ data: { data, count } }: UserTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const pageCount = !!count ? Math.ceil(count / JOB_LIST_PAGE_SIZE) : 0
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: searchParams.get('page')
      ? Number(searchParams.get('page')) - 1
      : 0,
    pageSize: JOB_LIST_PAGE_SIZE,
  })

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    if (pagination.pageIndex)
      newSearchParams.set('page', (pagination.pageIndex + 1).toString())
    else newSearchParams.delete('page')
    const to = location.pathname + '?' + newSearchParams.toString()
    router.push(to)
  }, [pagination, router, searchParams])

  return (
    <DataTable
      columns={JOB_TABLE_COLUMNS}
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
