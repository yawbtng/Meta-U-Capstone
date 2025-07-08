import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings2 } from "lucide-react";
import { getColumnDisplayName } from "./columns";

export function HideColumns({ table }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredColumns = table
    .getAllColumns()
    .filter((column) => column.getCanHide())
    .filter((column) =>
      getColumnDisplayName(column).toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-12 text-xl flex">
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
  );
} 