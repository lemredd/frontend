"use client"

import { Pencil } from "lucide-react"
import { User } from "@supabase/supabase-js"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const TABLE_HEADERS = [
  "email",
  "role",
  "Display name",
  "Joined at",
  "Actions",
]


interface UserTableProps {
  users: User[]
}
export function UserTable({ users }: UserTableProps) {
  function getHumanReadableRole<K extends "PDR" | "SKR">(role: K) {
    const ROLES = {
      "PDR": "Provider",
      "SKR": "Seeker",
    } as Record<K, string>

    return ROLES[role]
  }
  return (
    <Table>
      <TableHeader>
        {TABLE_HEADERS.map(header => (
          <TableHead key={header}>{header}</TableHead>
        ))}
      </TableHeader>
      <TableBody>
        {users.filter(user => !user.email?.includes('admin')).map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{getHumanReadableRole(user.user_metadata.role_code)}</TableCell>
            <TableCell>{user.user_metadata.display_name}</TableCell>
            <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
            <TableCell>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Pencil />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    Header
                  </DialogHeader>
                  <div>
                    Content
                  </div>
                  <DialogFooter>
                    <Button variant="destructive">Delete</Button>
                    <Button>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
