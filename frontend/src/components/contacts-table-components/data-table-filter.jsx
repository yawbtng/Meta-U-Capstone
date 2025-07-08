import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Trash2, Search } from "lucide-react";
import { getColumnDisplayName } from "./columns";

const filterConditions = [
  { value: "contains", label: "contains" },
  { value: "does_not_contain", label: "does not contain" },
  { value: "is", label: "is" },
  { value: "is_not", label: "is not" },
  { value: "is_empty", label: "is empty" },
  { value: "is_not_empty", label: "is not empty" },
];

export function DataTableFilter({ table }) {
  const [filters, setFilters] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchFields, setSearchFields] = useState("");

  const filterableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanFilter && column.getCanFilter())
    .filter((column) => column.id !== 'select' && column.id !== 'actions');

  const filteredColumns = filterableColumns.filter((column) =>
    getColumnDisplayName(column).toLowerCase().includes(searchFields.toLowerCase())
  );

  const addFilter = () => {
    const newFilter = {
      id: Date.now().toString(),
      column: '',
      condition: 'contains',
      value: ''
    };
    setFilters([...filters, newFilter]);
  };

  const removeFilter = (filterId) => {
    setFilters(filters.filter(f => f.id !== filterId));
  };

  const updateFilter = (filterId, field, value) => {
    setFilters(filters.map(f => 
      f.id === filterId ? { ...f, [field]: value } : f
    ));
  };

  const resetFilters = () => {
    setFilters([]);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-14 text-2xl px-6">
          <Filter className="h-6 w-6 mr-3" />
          Filter
          {filters.length > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-1 text-sm">
              {filters.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[600px] p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Filters</h3>
          </div>

          {/* Existing Filters */}
          {filters.map((filter) => (
            <div key={filter.id} className="flex items-center gap-2 p-3 border rounded-lg">
              <span className="text-sm text-muted-foreground min-w-[50px]">Where</span>
              
              {/* Column Selection */}
              <Select 
                value={filter.column} 
                onValueChange={(value) => updateFilter(filter.id, 'column', value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search fields..."
                        value={searchFields}
                        onChange={(e) => setSearchFields(e.target.value)}
                        className="h-8"
                      />
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {filteredColumns.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {getColumnDisplayName(column)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Condition Selection */}
              <Select 
                value={filter.condition} 
                onValueChange={(value) => updateFilter(filter.id, 'condition', value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterConditions.map((condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Value Input (hidden for empty/not empty conditions) */}
              {!['is_empty', 'is_not_empty'].includes(filter.condition) && (
                <Input
                  placeholder="Search titles..."
                  value={filter.value}
                  onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                  className="flex-1"
                />
              )}

              {/* Remove Filter Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFilter(filter.id)}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>

            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button 
              variant="default" 
              onClick={addFilter}
              className="bg-black text-white hover:bg-gray-800"
            >
              Add filter
            </Button>
            {filters.length > 0 && (
              <Button variant="ghost" onClick={resetFilters}>
                Reset filters
              </Button>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 