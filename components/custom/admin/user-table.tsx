'use client'

import { User } from '@supabase/supabase-js'
import { ColumnDef, PaginationState } from '@tanstack/react-table'
import { ExternalLink, Pencil } from 'lucide-react'
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from 'next/navigation'

import {
  deleteUser as _deleteUser,
  deleteMultipleUsers,
  listUsers,
} from '@/actions/user'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTable } from '@/components/ui/data-table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { PROFILE_STORE_FIELDS, USER_LIST_PAGE_SIZE } from '@/lib/constants'
import { createClient } from '@/utils/supabase/client'
import { DialogTitle } from '@radix-ui/react-dialog'
import { useEffect, useState, useTransition } from 'react'

import { toast } from '@/hooks/use-toast'
import { TableInjectionProps } from '@/lib/types'
import { getHumanReadableRole } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from 'next/link'

const USER_TABLE_COLUMNS: ColumnDef<User>[] = [
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
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'user_metadata.role_code',
    header: 'Role',
    cell: ({ row }) =>
      getHumanReadableRole(row.original.user_metadata.role_code),
  },
  {
    accessorKey: 'created_at',
    header: 'Joined at',
    cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <UserDialog user={row.original} />,
  },
]

interface UserDialogProps {
  user: User
}
function UserDialog({ user }: UserDialogProps) {
  const supabase = createClient()
  const [profile, setProfile] = useState<Record<string, any>>()
  const [isPending, startTransition] = useTransition()

  function getProfile() {
    const FIELDS = "*, approvals(*)"
    supabase
      .from('profiles')
      .select(FIELDS)
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => setProfile(data))
  }

  useEffect(() => {
    if (user) getProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  function getFullName() {
    if (!profile) return 'N/A'
    return (
      `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'N/A'
    )
  }

  function deleteUser() {
    startTransition(() => {
      _deleteUser(user.id).then(({ success, error }) => {
        if (error) return toast({ title: error, variant: 'destructive' })
        toast({ title: success, variant: 'success' })
      })
    })
  }

  function getUrl(name: string) {
    return supabase.storage.from("documents").getPublicUrl(name.trim()).data.publicUrl
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={getProfile}
          size="sm"
        >
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full lg:max-w-[700px] p-6 space-y-2 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {getFullName()}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {user?.email} - Joined:{' '}
            {new Date(user?.created_at).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <h2 className="col-span-full text-lg">General Info</h2>
          <div className="font-medium text-muted-foreground">Username</div>
          <div>{profile?.username || 'N/A'}</div>

          <div className="font-medium text-muted-foreground">Role</div>
          <div>{user.user_metadata.role_code || 'N/A'}</div>

          <div className="font-medium text-muted-foreground">Email Status</div>
          <div>{user.email_confirmed_at ? 'Confirmed' : 'Pending'}</div>

          <div className="font-medium text-muted-foreground">Full Name</div>
          <div>{getFullName()}</div>
        </div>

        {user.user_metadata.role_code === "SKR" && (
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <h2 className="col-span-full text-lg">Approval</h2>
            <div className="font-medium text-muted-foreground">Status</div>
            <div>{profile?.approvals?.status || 'N/A'}</div>

            <div className="font-medium text-muted-foreground">Valid ID</div>
            <div>
              {profile?.approvals.valid_id_pic_name ? (
                <Button asChild variant="outline" className="justify-start">
                  <Link
                    target="_blank"
                    href={getUrl(profile.approvals.valid_id_pic_name)}
                    className="space-x-2"
                  >
                    <ExternalLink size={16} />
                    <span className="max-w-[100px] truncate">{profile.approvals.valid_id_pic_name}</span>
                  </Link>
                </Button>
              ) : "N/A"}
            </div>

            <div className="font-medium text-muted-foreground">Other Documents</div>
            <div>{/* TODO: display other documents */}</div>
          </div>
        )}

        <DialogFooter className="flex justify-end gap-2 pt-6">
          <Button
            variant="destructive"
            onClick={deleteUser}
            disabled={isPending}
          >
            Delete
          </Button>
          <Button
            variant="secondary"
            disabled={isPending}
          >
            Reset Password
          </Button>
          <Button
            variant="outline"
            disabled={isPending || !!user.email_confirmed_at}
          >
            Confirm Email
          </Button>
          <Button disabled={isPending}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export interface SelectedActionsProps<TData>
  extends TableInjectionProps<TData> { }
function SelectedActions({ table }: SelectedActionsProps<User>) {
  const [isPending, startTransition] = useTransition()

  function deleteSelected() {
    startTransition(() => {
      const ids = table.getSelectedRowModel().rows.map((row) => row.original.id)
      deleteMultipleUsers(ids).then(({ error, success }) => {
        if (error) return toast({ title: error, variant: 'destructive' })
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

function UserSearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('search') || '')

  useEffect(() => {
    let to = location.pathname
    if (!to.endsWith('?')) to += '?'
    if (value) to += `&search=${value}`

    if (searchParams.get('role')) to += `&role=${searchParams.get('role')}`

    const debouncer = setTimeout(() => {
      router.push(to)
    }, 700)

    return () => clearTimeout(debouncer)
  }, [router, value])

  return (
    <Input
      placeholder="Search user by emails..."
      value={value}
      onChange={(event) => setValue(event.target.value)}
      className="max-w-sm"
    />
  )
}

function buildLink(searchParams: ReadonlyURLSearchParams, role: string) {
  let to = `./?role=${role}`
  if (searchParams.get('search'))
    to += `&search=${searchParams.get('search')}`
  return to
}

function RoleTabs() {
  const searchParams = useSearchParams()
  const ROLE_CODES = { "skr": "Seekers", "pdr": "Providers" }

  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="w-full">
        {Object.entries(ROLE_CODES).map(([key, val]) => (
          <TabsTrigger key={key} value={key} asChild>
            <Link href={buildLink(searchParams, key)} className="w-full">
              <span className="capitalize">{val}</span>
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

interface UserTableProps {
  data: Awaited<ReturnType<typeof listUsers>>['data']
}
export function UserTable({ data: { users, count } }: UserTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const pageCount = !!count ? Math.ceil(count / USER_LIST_PAGE_SIZE) : 0
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: searchParams.get('page')
      ? Number(searchParams.get('page')) - 1
      : 0,
    pageSize: USER_LIST_PAGE_SIZE,
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
    <div className="mt-2">
      <RoleTabs />
      <DataTable
        columns={USER_TABLE_COLUMNS}
        data={users}
        pageCount={pageCount}
        manualPagination={!!count}
        onPaginationChange={setPagination}
        state={{ pagination }}
        SelectedActions={SelectedActions}
        SearchInput={UserSearchInput}
      />
    </div>
  )
}
