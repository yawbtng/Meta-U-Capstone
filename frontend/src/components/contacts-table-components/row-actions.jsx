import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export const RowActions = ({ contact, onDeleteContact }) => {

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-9 w-9 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="flex items-center gap-3 text-lg py-3 cursor-pointer">
            <Eye className="h-5 w-5" />
            View Contact
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-3 text-lg py-3 cursor-pointer">
            <Edit className="h-5 w-5" />
            Edit Contact
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-3 text-lg py-3 text-red-600 cursor-pointer" onClick={() => onDeleteContact(contact.id)}>
            <Trash className="h-5 w-5 text-red-600 hover:text-red-600" />
            Delete Contact
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  