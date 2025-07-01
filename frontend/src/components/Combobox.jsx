import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function ComboboxDemo({inputs, label, className}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-auto justify-start ${className} outline-gray-700`}
        >
          {value
            ? inputs.find((input) => input.value === value)?.label
            : "Select industry..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 outline-gray-400">
        <Command className="w-[175x]">
          <CommandInput placeholder="Search industry..." className="h-9" />
          <CommandList>
            <CommandEmpty>No input found.</CommandEmpty>
            <CommandGroup>
              {inputs.map((input) => (
                <CommandItem
                  key={input.value}
                  value={input.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                  className="flex items-start text-sm text-foreground-primary w-2xl"
                >
                  {input.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === input.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
