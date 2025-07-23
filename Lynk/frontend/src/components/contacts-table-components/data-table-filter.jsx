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
import { Filter, Trash2, Search, Calendar } from "lucide-react";
import { getColumnDisplayName } from "./columns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Type-specific filter conditions
const getFilterConditions = (columnType) => {
  const baseConditions = [
    { value: "is_empty", label: "is empty" },
    { value: "is_not_empty", label: "is not empty" },
  ];

  switch (columnType) {
    case "number":
      return [
        { value: "equals", label: "equals" },
        { value: "greater_than", label: "greater than" },
        { value: "less_than", label: "less than" },
        { value: "greater_than_or_equal", label: "greater than or equal" },
        { value: "less_than_or_equal", label: "less than or equal" },
        ...baseConditions,
      ];
    case "date":
      return [
        { value: "equals", label: "equals" },
        { value: "before", label: "before" },
        { value: "after", label: "after" },
        { value: "on_or_before", label: "on or before" },
        { value: "on_or_after", label: "on or after" },
        ...baseConditions,
      ];
    case "multi-select":
      return [
        { value: "contains_any", label: "contains any" },
        { value: "contains_all", label: "contains all" },
        { value: "does_not_contain", label: "does not contain" },
        ...baseConditions,
      ];
    default: // text, email, and other types
      return [
        { value: "contains", label: "contains" },
        { value: "does_not_contain", label: "does not contain" },
        { value: "equals", label: "equals" },
        { value: "starts_with", label: "starts with" },
        { value: "ends_with", label: "ends with" },
        ...baseConditions,
      ];
  }
};

export function DataTableFilter({ table }) {
  const [filters, setFilters] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchFields, setSearchFields] = useState("");

  
  const applyFilters = () => {
    // Clear existing filters first
    table.getAllColumns().forEach(column => {
      if (column.getCanFilter()) {
        column.setFilterValue(undefined);
      }
    });

    // Apply each filter to the corresponding column
    filters.forEach(filter => {
      if (filter.column && filter.condition && filter.value !== '') {
        const column = table.getColumn(filter.column);
        if (column) {
          // Create a filter value that the table can understand
          const filterValue = createFilterValue(filter.condition, filter.value, filter.columnType);
          column.setFilterValue(filterValue);
        }
      }
    });

    setIsOpen(false);
  };

  const createFilterValue = (condition, value, columnType) => {
    // Return a filter value that TanStack can process
    return {
      condition,
      value,
      columnType
    };
  };

  const createFilterFunction = (condition, value, columnType) => {
    return (cellValue) => {
      if (!cellValue && condition !== 'is_empty') return false;
      
      switch (condition) {
        case 'contains':
          if (Array.isArray(cellValue)) {
            return cellValue.some(item => 
              String(item).toLowerCase().includes(String(value).toLowerCase())
            );
          }
          return String(cellValue).toLowerCase().includes(String(value).toLowerCase());
          
        case 'does_not_contain':
          if (Array.isArray(cellValue)) {
            return !cellValue.some(item => 
              String(item).toLowerCase().includes(String(value).toLowerCase())
            );
          }
          return !String(cellValue).toLowerCase().includes(String(value).toLowerCase());
          
        case 'equals':
          if (Array.isArray(cellValue)) {
            return cellValue.length === 1 && String(cellValue[0]).toLowerCase() === String(value).toLowerCase();
          }
          if (columnType === 'number') {
            return Number(cellValue) === Number(value);
          }
          if (columnType === 'date') {
            return new Date(cellValue).toDateString() === new Date(value).toDateString();
          }
          return String(cellValue).toLowerCase() === String(value).toLowerCase();
          
        case 'starts_with':
          return String(cellValue).toLowerCase().startsWith(String(value).toLowerCase());
          
        case 'ends_with':
          return String(cellValue).toLowerCase().endsWith(String(value).toLowerCase());
          
        case 'greater_than':
          return Number(cellValue) > Number(value);
          
        case 'less_than':
          return Number(cellValue) < Number(value);
          
        case 'greater_than_or_equal':
          return Number(cellValue) >= Number(value);
          
        case 'less_than_or_equal':
          return Number(cellValue) <= Number(value);
          
        case 'before':
          return new Date(cellValue) < new Date(value);
          
        case 'after':
          return new Date(cellValue) > new Date(value);
          
        case 'on_or_before':
          return new Date(cellValue) <= new Date(value);
          
        case 'on_or_after':
          return new Date(cellValue) >= new Date(value);
          
        case 'contains_any':
          if (Array.isArray(cellValue) && Array.isArray(value)) {
            return value.some(v => cellValue.includes(v));
          }
          return false;
          
        case 'contains_all':
          if (Array.isArray(cellValue) && Array.isArray(value)) {
            return value.every(v => cellValue.includes(v));
          }
          return false;
          
        case 'is_empty':
          if (Array.isArray(cellValue)) {
            return cellValue.length === 0;
          }
          return !cellValue || cellValue === '';
          
        case 'is_not_empty':
          if (Array.isArray(cellValue)) {
            return cellValue.length > 0;
          }
          return cellValue && cellValue !== '';
          
        default:
          return true;
      }
    };
  };

  const filterableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanFilter && column.getCanFilter())
    .filter((column) => column.id !== 'select' && column.id !== 'actions' && column.id !== 'avatar_url');

  const filteredColumns = filterableColumns.filter((column) =>
    getColumnDisplayName(column).toLowerCase().includes(searchFields.toLowerCase())
  );

  const addFilter = () => {
    const newFilter = {
      id: Date.now().toString(),
      column: '',
      condition: 'contains',
      value: '',
      columnType: 'text'
    };
    setFilters([...filters, newFilter]);
  };

  const removeFilter = (filterId) => {
    setFilters(filters.filter(f => f.id !== filterId));
  };

  const updateFilter = (filterId, field, value) => {
    setFilters(filters.map(f => {
      if (f.id === filterId) {
        const updatedFilter = { ...f, [field]: value };
        
        // Update columnType when column changes
        if (field === 'column') {
          const column = filterableColumns.find(col => col.id === value);
          updatedFilter.columnType = column?.columnDef?.type || 'text';
          
          const conditions = getFilterConditions(updatedFilter.columnType);
          updatedFilter.condition = conditions[0]?.value || 'contains';
        }
        
        return updatedFilter;
      }
      return f;
    }));
  };

  
  const resetFilters = () => {
    setFilters([]);
    table.getAllColumns().forEach(column => {
      if (column.getCanFilter()) {
        column.setFilterValue(undefined);
      }
    });
  };

  // Helper function to parse date string without timezone issues
  const parseDateString = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
    return new Date(year, month - 1, day); 
  };

  // Render type-specific input component
  const renderFilterInput = (filter) => {
    if (['is_empty', 'is_not_empty'].includes(filter.condition)) {
      return null;
    }

    const column = filterableColumns.find(col => col.id === filter.column);
    if (!column) return null;

    const columnType = column.columnDef?.type || 'text';
    
    switch (columnType) {
      case "number":
        return (
          <Input
            type="number"
            placeholder="Enter a number..."
            value={filter.value}
            onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
            className="flex-1"
          />
        );
        
      case "date":
        const parsedDate = parseDateString(filter.value);
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 justify-start text-left font-normal",
                  !filter.value && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {parsedDate ? format(parsedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={parsedDate}
                onSelect={(date) => updateFilter(filter.id, 'value', date ? format(date, 'yyyy-MM-dd') : '')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
        
      case "multi-select":
        const options = column.columnDef?.options || [];
        return (
          <Select
            value={filter.value}
            onValueChange={(value) => updateFilter(filter.id, 'value', value)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select options..." />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      default: // text, email, and other types
        return (
          <Input
            placeholder="Enter value..."
            value={filter.value}
            onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
            className="flex-1"
          />
        );
    }
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
          {filters.map((filter) => {
            const column = filterableColumns.find(col => col.id === filter.column);
            const columnType = column?.columnDef?.type || 'text';
            const conditions = getFilterConditions(columnType);
            
            return (
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
                    {conditions.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Type-specific Value Input */}
                {renderFilterInput(filter)}

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
            );
          })}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button 
              variant="default" 
              onClick={addFilter}
              className="bg-black text-white hover:bg-gray-800"
            >
              Add filter
            </Button>
            
            <Button 
              variant="default" 
              onClick={applyFilters}
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={filters.length === 0}
            >
              Apply filters
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