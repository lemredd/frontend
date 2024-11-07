"use client"

import { Pencil } from "lucide-react"
import { User } from "@supabase/supabase-js"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState, useTransition } from "react"
import { PROFILE_STORE_FIELDS } from "@/lib/constants"
import { DialogTitle } from "@radix-ui/react-dialog"
import { deleteUser as _deleteUser, countUsers, deleteMultipleUsers } from "@/actions/user"
import { Checkbox } from "@/components/ui/checkbox"

import {
  Pagination,
  PaginationContent,
  //PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationRouterLink,
} from "@/components/ui/pagination"
import { getHumanReadableRole } from "@/lib/utils"

const TABLE_HEADERS = [
  "check_all",
  "email",
  "role",
  "Joined at",
  "Actions",
]

const PAGE_SIZE = 10

interface UserDialogProps {
  user: User
}
function UserDialog({ user }: UserDialogProps) {
  const supabase = createClient()
  const [profile, setProfile] = useState<Record<string, any>>()
  const [isPending, startTransition] = useTransition()

  function getProfile() {
    supabase
      .from("profiles")
      .select(PROFILE_STORE_FIELDS)
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => setProfile(data))
  }

  function getFullName() {
    if (!profile) return ""
    if (!profile.first_name && !profile.last_name) return "N/A"
    return `${profile.first_name} ${profile.last_name}`
  }

  function deleteUser() {
    startTransition(() => {
      _deleteUser(user.id).then(({ error }) => {
        if (error) return console.error(error)
        location.reload()
      })
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={getProfile}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{user?.email}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 grid-rows-5 grid-flow-row">
          <div>username</div><div>{profile?.username}</div>
          <div>role</div><div>{user.user_metadata.role || "N/A"}</div>
          <div>Full name</div><div>{getFullName()}</div>
          <div>Joined at</div><div>{new Date(user?.created_at).toLocaleString()}</div>
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={deleteUser} disabled={isPending}>Delete</Button>
          <Button disabled={isPending}>Reset Password</Button>
          <Button disabled={isPending}>Reconfirm Email</Button>
          <Button disabled={isPending}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface UserTableProps {
  users: User[]
}
export function UserTable({ users }: UserTableProps) {
  const [checkedIds, setCheckedIds] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()
  const [count, setCount] = useState<number>()

  useEffect(() => {
    countUsers().then(({ data }) => setCount(data))
  }, [])

  const totalPages = !!count ? Math.ceil(count / PAGE_SIZE) : 0
  const pages = !!count ? Array.from({ length: totalPages }, (_, i) => i + 1) : []

  function checkAll(checked: boolean) {
    if (checked) {
      setCheckedIds(users.map(user => user.id))
    } else {
      setCheckedIds([])
    }
  }

  function checkUser(checked: boolean, id: string) {
    if (checked) {
      setCheckedIds(prev => [...prev, id])
    } else {
      setCheckedIds(prev => prev.filter(_id => _id !== id))
    }
  }

  function deleteSelected() {
    startTransition(() => {
      deleteMultipleUsers(checkedIds).then(({ error }) => {
        if (error) return console.error(error)
        location.reload()
      })
    })
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {TABLE_HEADERS.map(header => header === "check_all" ? (
              <TableHead key={header}>
                <Checkbox onCheckedChange={checkAll}></Checkbox>
              </TableHead>
            ) : (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.filter(user => !user.email?.includes('admin')).map((user) => (
            <TableRow key={user.id}>
              <TableCell><Checkbox value={user.id} checked={checkedIds.includes(user.id)} onCheckedChange={checked => checkUser(checked as boolean, user.id)}></Checkbox></TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{getHumanReadableRole(user.user_metadata.role_code)}</TableCell>
              <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
              <TableCell>
                <UserDialog user={user} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!!count ? (
        // TODO: make previous and next work
        <Pagination className="justify-end mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>

            {pages.map(page => (
              <PaginationItem key={page}>
                <PaginationRouterLink href={`/admin/users?page=${page}`}>{page}</PaginationRouterLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : (
        <p>Getting total users count...</p>
      )}
      {!!checkedIds.length && (
        <Button disabled={isPending} variant="destructive" onClick={deleteSelected}>Delete</Button>
      )}
    </>
  )
}
