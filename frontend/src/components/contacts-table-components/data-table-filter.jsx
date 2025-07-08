import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";

export function DataTableFilter({ table }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
      <Button variant="outline" className="h-14 text-2xl px-6">
        <Filter className="h-6 w-6 mr-3" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[400px] p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Filters</h3>
          </div>

          <DropdownMenuSeparator />

          {/* Simple search input*/}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search contacts</label>
            <Input
              placeholder="Type to search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <Button 
              variant="default" 
              onClick={() => {
                // TODO: Implement filtering logic
                console.log("Filter applied:", searchValue);
                setIsOpen(false);
              }}
              className="bg-black text-white hover:bg-gray-800"
            >
              Apply Filter
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => {
                setSearchValue("");
                // TODO: Reset filters
                console.log("Filters reset");
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 