"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "./button"
import { useState } from "react"
import { SelectedActionsProps } from "../custom/admin/user-table"

interface DataTableProps<TData, TValue> extends Partial<TableOptions<TData>> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  SelectedActions?: (props: SelectedActionsProps<TData>) => React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  manualPagination,
  onPaginationChange,
  state,
  SelectedActions
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({})
  const table = useReactTable({
    data,
    columns,
    pageCount,
    manualPagination,
    onPaginationChange,
    state: { ...state, rowSelection },
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center justify-end space-x-2 py-4">
          {!!table.getIsSomePageRowsSelected() && !!SelectedActions ? (
            <SelectedActions table={table} />
          ) : (
            null
          )}
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
