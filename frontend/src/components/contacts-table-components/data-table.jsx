import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SearchContacts from "../search-contacts";


import { DataTablePagination } from "./data-table-pagination";
import { DataTableFilter } from "./data-table-filter";
import { HideColumns } from "./hide-columns";


export default function DataTable({ columns, data, onFiltersChange }) {
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({
      "phone_number": false,
      "socials_twitter": false,
      "industry": false,
      "company": false,
      "interactions_count": false,
      "tags": false
  });

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: setSorting,
  onRowSelectionChange: setRowSelection,
  onColumnVisibilityChange: setColumnVisibility,
  state: {
    sorting,
    rowSelection,
    columnVisibility,
  },
  initialState: {
    pagination: {
      pageSize: 20,
    },
  },
});

  return (
    <div className="flex flex-col">
      {/* Column Filtering and Visibility Controls */}
      <div className="flex items-center justify-between py-4 mr-1">
        {/* Filter Component */}
        <DataTableFilter table={table} onFiltersChange={onFiltersChange} />

        {/* Search Compononet */}
        <SearchContacts />
        
        {/* View/Hide Columns Component */}
        <HideColumns table={table} />
      </div>

      <div className="flex items-center pt-5 pb-4 overflow-x-auto scrollbar-hide">
        <Table className="border mx-auto">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="text-center border-r border-solid border-gray-200 text-xl">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  className="cursor-pointer hover:bg-gray-100 h-15"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="border-r border-solid border-gray-100 text-center px-5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-2xl text-bold">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
