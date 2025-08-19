import { MoreHorizontal, Eye, Edit, Trash, Pin, PinOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { SheetTrigger } from "@/components/ui/sheet"
import { EditContact } from "../edit-contact-sheet"
import { useState } from "react"
import ViewContactCard from "../ViewContactCard";
import { pinContact } from "../../../backend/supabase/contacts.js";
import { UserAuth } from "../../context/AuthContext";

export const RowActions = ({ contact, onDeleteContact, onUpdateContact }) => {
  const [openEditSheet, setOpenEditSheet] = useState(false)
  const [openViewModal, setOpenViewModal] = useState(false)
  const { session } = UserAuth();
  const [pinning, setPinning] = useState(false);

  const handlePinToggle = async () => {
    if (!session?.user?.id) return;
    setPinning(true);
    const newPinned = !contact.pinned;
    const result = await pinContact(session.user.id, contact.id, newPinned);
    setPinning(false);
    if (result.success) {
      onUpdateContact({ ...contact, pinned: newPinned });
    }
  };

    return (
      <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-9 w-9 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">

          {/* Pin/Unpin Contact */}
          <DropdownMenuItem
            className="flex items-center gap-3 text-lg py-3 cursor-pointer"
            onClick={handlePinToggle}
            disabled={pinning}
          >
            {contact.pinned ? (
              <PinOff className="h-5 w-5 text-yellow-600" />
            ) : (
              <Pin className="h-5 w-5" />
            )}
            {contact.pinned ? "Unpin Contact" : "Pin Contact"}
          </DropdownMenuItem>

          {/* Viewing a Contact */}
          <DropdownMenuItem className="flex items-center gap-3 text-lg py-3 cursor-pointer" onClick={() => setOpenViewModal(true)}>
            <Eye className="h-5 w-5" />
            View Contact
          </DropdownMenuItem>

          {/* Editing a Contact */}
          <EditContact onClick={() => setOpenEditSheet(true)}
            open={openEditSheet} onOpenChange={setOpenEditSheet} contactData={contact}
            onContactUpdated={onUpdateContact}>
            <SheetTrigger asChild>
              <DropdownMenuItem className="flex items-center gap-3 text-lg py-3 cursor-pointer" onSelect={(e) => e.preventDefault()}>
                <Edit className="h-5 w-5" />
                Edit Contact
              </DropdownMenuItem>
            </SheetTrigger>
          </EditContact>

          {/* Deleting a Contact */}
          <DeleteConfirmationDialog
            description={`This action cannot be undone. This will permanently delete the contact "${contact.name}" and remove their data from your contacts.`}
            onConfirm={() => onDeleteContact(contact.id)}
            confirmText="Delete Contact"
          >
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="flex items-center gap-3 text-lg py-3 text-red-600 cursor-pointer" onSelect={(e) => e.preventDefault()}>
                <Trash className="h-5 w-5 text-red-600" />
                Delete Contact
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DeleteConfirmationDialog>
        </DropdownMenuContent>
      </DropdownMenu>
      <ViewContactCard open={openViewModal} onOpenChange={setOpenViewModal} contact={contact} />
      </>
    )
  }
  