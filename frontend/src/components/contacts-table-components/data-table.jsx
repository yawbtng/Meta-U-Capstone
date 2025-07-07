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

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Settings2 } from "lucide-react";

import { DataTablePagination } from "./data-table-pagination";

const getColumnDisplayName = (column) => {
  const displayNameMap = {
    'select': 'Select',
    'avatar_url': 'Photo', 
    'name': 'Name',
    'email': 'Email',
    'phone_number': 'Phone #',
    'socials_linkedin': 'LinkedIn',
    'socials_twitter': 'Twitter', 
    'socials_instagram': 'Instagram',
    'relationship_type': 'Type',
    'industry': 'Industry',
    'company': 'Company',
    'role': 'Role',
    'last_contact_at': 'Last Contact',
    'interactions_count': '# of Interactions',
    'tags': 'Tags',
    'actions': 'Actions'
  };

  return displayNameMap[column.id]
};

export default function DataTable({ columns, data }) {
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredColumns = table
    .getAllColumns()
    .filter((column) => column.getCanHide())
    .filter((column) =>
      getColumnDisplayName(column).toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="flex flex-col">
      {/* Column Visibility Controls */}
      <div className="flex items-center py-4 mr-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto h-12 text-xl flex">
              <Settings2 className="h-10 w-10" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <div className="p-2">
              <Input
                placeholder="Search columns..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-8"
              />
            </div>
            <DropdownMenuSeparator />
            {filteredColumns.map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {getColumnDisplayName(column)}
                </DropdownMenuCheckboxItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
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
