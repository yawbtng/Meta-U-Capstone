import { useState, useEffect, useRef } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
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
import { HideColumns } from "./hide-columns";
import { DataTableFilter } from "./data-table-filter";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog.jsx";
import { deleteContact } from "../../../backend/supabase/contacts.js";
import { toast } from "sonner";
import LoadingSpinner from "../ui/loading-spinner";

export default function DataTable({ columns, data, loading }) {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [showMassDeleteDialog, setShowMassDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({
      "phone_number": false,
      "industry": false,
      "tags": false,
      "company": false,
      "interactions_count": false,
  });
  
  
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), 
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters, 
    onGlobalFilterChange: setGlobalFilter,   
    enableColumnFilters: true,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      columnFilters, 
      globalFilter,  
    },
    initialState: {
      pagination: {
        pageSize: 15,
        pageIndex: 0,
      },
    },
    manualPagination: false,
    autoResetPageIndex: false,
  });

  
  useEffect(() => {
    if (isMounted.current && table) {
      table.resetPageIndex();
    }
  }, [data.length, table]);

  // Get selected rows
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedIds = selectedRows.map(row => row.original.id);

  // Mass delete handler
  const handleMassDelete = async () => {
    setDeleting(true);
    try {
      let allSuccess = true;
      for (const row of selectedRows) {
        const result = await deleteContact(row.original.id);
        if (!result.success) allSuccess = false;
      }
      
      toast.success(allSuccess ? "Contacts deleted ✅" : "Some contacts could not be deleted");
      setShowMassDeleteDialog(false);
     
      setRowSelection({});
    } catch (err) {
      toast.error("Failed to delete contacts");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Controls Row: Filter left, Search center, View/Hide Columns right */}
      <div className="relative w-full flex items-center py-4" style={{ minHeight: 64 }}>
        <div className="absolute left-8 flex items-center gap-2">
          <DataTableFilter table={table} />
          
          <button
            onClick={() => navigate('/add-contact')}
            className="ml-3 mr-3 flex items-center gap-1 rounded-full bg-black hover:bg-gray-700 text-white px-5 py-2 shadow-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-black text-base font-semibold"
            title="Add Contact"
            aria-label="Add Contact"
          >
            <Plus className="w-4 h-4 mr-0.5" />
            Add a contact
          </button>
        </div>
        <div className="flex justify-center items-center w-full ml-10">
          <SearchContacts />
        </div>
        <div className="absolute right-8 flex items-center gap-3">
          <button
            disabled={selectedRows.length === 0 || deleting}
            onClick={() => setShowMassDeleteDialog(true)}
            className="bg-red-600 text-white py-2 px-4 rounded-full font-semibold shadow disabled:opacity-60 disabled:cursor-not-allowed mr-2"
            title="Delete"
            aria-label="Delete"
          >
            Delete
          </button>
          <HideColumns table={table} />
        </div>
      </div>
      {/* Mass Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showMassDeleteDialog}
        onOpenChange={setShowMassDeleteDialog}
        description={`This will permanently delete ${selectedRows.length} contact(s). This action cannot be undone.`}
        onConfirm={handleMassDelete}
        confirmText={deleting ? "Deleting..." : "Delete"}
      />

      <div className="flex items-center pt-4 pb-4 overflow-x-auto scrollbar-hide w-full">
        <Table className="border w-full">
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-2xl text-bold">
                  <LoadingSpinner size={32} text="Loading contacts..." />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
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
