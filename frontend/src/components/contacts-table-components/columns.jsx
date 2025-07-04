import { z } from "zod"
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const Contact = z.object({
  id: z.string().uuid(),
  user_id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone_number: z.string().optional(),
  linkedin: z.string().url().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  relationship_type: z.enum(["personal", "professional", "social"]),
  avatar_url: z.string().url().optional(),
  industry: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
  last_contact_at: z.date().optional(),
  interaction_count: z.number().int().optional(),
  tags: z.array(z.string()).default([]),
});

const ContactActionsDropdown = ({ contact }) => {
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
        <DropdownMenuItem className="flex items-center gap-3 text-lg py-3 text-red-600 cursor-pointer">
          <Trash className="h-5 w-5 text-red-600" />
          Delete Contact
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const columns = [
  {
    accessorKey: "avatar_url",
    header: "Photo",
  },
  {
    accessorKey: "name",
    header: () => <div className="text-center">Name</div>,
    cell: ({row}) => {
      const name = row.getValue("name")
      return <div className="text-left font-medium text-xl">{name}</div>
    }
  },
  {
    accessorKey: "email",
    header: () => <div className="text-center">Email</div>,
    cell: ({row}) => {
      const email = row.getValue("email")
      return <div className="text-left text-lg font-medium">{email}</div>
    }
  },
  {
    accessorKey: "phone_number",
    header: () => <div className="text-center">Phone #</div>,
    cell: ({row}) => {
      const phone = row.getValue("phone_number")
      let parsed;
      if (phone.length === 10) {
        parsed = `${phone.substring(0, 3)}-${phone.substring(3, 6)}-${phone.substring(6, 10)}`
      } else {
        parsed = phone;
      }
      return <div className="text-center text-lg font-medium">{parsed}</div>
    }

  },
  {
    accessorKey: "socials.linkedin",
    header: () => <div className="text-center">LinkedIn</div>,
    cell: ({row}) => {
      const linkedin = row.getValue("socials_linkedin")
      return (
        <div className="text-left underline text-lg">
          <a href={`https://${linkedin}`} target="_blank" className="!text-gray-600">
            {linkedin}
          </a>
        </div>
        
      )
    }
  },
  {
    accessorKey: "socials.twitter",
    header: () => <div className="text-center">Twitter</div>,
    cell: ({row}) => {
      const twitter = row.getValue("socials_twitter")
      return (
        <div className="text-left underline text-lg">
          <a href={`https://twitter.com/${twitter}`} target="_blank" className="!text-gray-600">
            {twitter}
          </a>
        </div>
        
      )
    }
  },
  {
    accessorKey: "socials.instagram",
    header: () => <div className="text-center">Instagram</div>,
    cell: ({row}) => {
      const instagram = row.getValue("socials_instagram")
      return (
        <div className="text-left underline text-lg">
          <a href={`https://instagram.com/${instagram}`} target="_blank" className="!text-gray-600">
            {instagram}
          </a>
        </div>
        
      )
    }
  },
  {
    accessorKey: "relationship_type",
    header: () => <div className="text-center">Type</div>,
    cell: ({row}) => {
      const types = row.getValue("relationship_type")
      const colorMap = {
        personal: "bg-purple-100",
        professional: "bg-green-100",
        social: "bg-blue-100"
      }
      return (
        <div className="text-left text-md flex gap-2">
          {types.map((type, index) => (
            <p key={index} className={`px-2 py-1 rounded ${colorMap[type.toLowerCase()]}`}>
              {type}
            </p>
          ))}
        </div>
      )
    }
  },
  {
    accessorKey: "industry",
    header: () => <div className="text-center">Industry</div>,
    cell: ({row}) => {
      const industry = row.getValue("industry")
      return <div className="text-left text-lg font-medium">{industry}</div>
    }
  },
  {
    accessorKey: "company",
    header: () => <div className="text-center">Company</div>,
    cell: ({row}) => {
      const company = row.getValue("company")
      return <div className="text-left text-lg font-medium">{company}</div>
    }
  },
  {
    accessorKey: "role",
    header: () => <div className="text-center">Role</div>,
    cell: ({row}) => {
      const role = row.getValue("role")
      return <div className="text-left text-lg font-medium">{role}</div>
    }
  },
  {
    accessorKey: "interactions_count",
    header: () => <div className="text-center"># of Interactions</div>,
    cell: ({row}) => {
      const amount = parseInt(row.getValue("interactions_count"))
      return <div className="text-center font-medium text-xl">{amount}</div>
    }
  },
  {
    accessorKey: "tags",
    header: () => <div className="text-center">Tags</div>,
    cell: ({row}) => {
      const tags = row.getValue("tags")
      return (
        <div className="text-left text-md flex gap-2">
          {tags.map((tag, index) => (
            <p key={index} className="px-2 py-1 rounded bg-gray-100">{tag}</p>
          ))}
        </div>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const contact = row.original
      return <ContactActionsDropdown contact={contact} />
    },
  }
]
