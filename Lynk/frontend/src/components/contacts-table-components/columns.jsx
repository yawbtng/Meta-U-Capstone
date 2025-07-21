import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import AvatarDemo from "../avatar-01"
import { RowActions } from "./row-actions"
import { DataTableColumnHeader } from "./data-table-column-header"
import { Linkedin, Twitter, Instagram } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"



export function getInitials(fullName) {
    const words = fullName.split(' ');
    const firstName = words[0];
    const lastName = words[words.length - 1];
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }

export const columns =  (onDeleteContact, onUpdateContact) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="outline-2 flex justify-center"
        checked={Boolean(row.getIsSelected())}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "avatar_url",
    header: "Photo",
    cell: ({row}) => {
      const name = row.getValue("name")
      const avatar = row.getValue("avatar_url")
      
      const initials = getInitials(name);

      return <div className="flex justify-center font-medium">
        <AvatarDemo initials={initials} url={avatar} className="w-12 h-12"/>
        </div>
    }
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({row}) => {
      const name = row.getValue("name")
      return <div className="text-left font-medium text-xl">{name}</div>
    },
    id: "name"
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({row}) => {
      const email = row.getValue("email")
      return <div className="text-left text-lg font-medium">{email}</div>
    },
    id: "email"
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
    },
    id: "phone_number"
  },
  {
    accessorKey: "socials.linkedin",
    header: () => <div className="flex justify-center"><Linkedin color="blue"/></div>,
    cell: ({row}) => {
      const linkedin = row.original.socials?.linkedin
      return (
        <div className="flex justify-center underline text-lg">
          {linkedin ? (
              <Tooltip> 
                <TooltipTrigger asChild>
                  <a href={`https://${linkedin}`} target="_blank" className="!text-gray-600">
                    <Linkedin color="blue"/>
                  </a>
                </TooltipTrigger>

                <TooltipContent>
                  <p>{linkedin}</p> 
                </TooltipContent>
              </Tooltip>
          ) : null}
        </div>
        
      )
    },
    id: "socials_linkedin"
  },
  {
    accessorKey: "socials.twitter",
    header: () => <div className="flex justify-center"><Twitter color="skyblue"/></div>,
    cell: ({row}) => {
      const twitter = row.original.socials?.twitter
      return (
        <div className="flex justify-center text-lg">
          {twitter ? (
            <Tooltip>
              <TooltipTrigger asChild>
              <a href={`https://twitter.com/${twitter}`} target="_blank" className="!text-gray-600">
                <Twitter color="skyblue"/>
              </a>
              </TooltipTrigger>
              <TooltipContent>{twitter}</TooltipContent>
            </Tooltip>
          ) : null}
        </div>
      )
    },
    id: "socials_twitter"
  },
  {
    accessorKey: "socials.instagram",
    header: () => <div className="flex justify-center"><Instagram color="purple"/></div>,
    cell: ({row}) => {
      const instagram = row.original.socials?.instagram
      return (
        <div className="flex justify-center text-lg">
          {instagram ? (
            <Tooltip>
              <TooltipTrigger asChild>
            <a href={`https://instagram.com/${instagram}`} target="_blank" className="!text-gray-600">
              <Instagram color="purple"/>
            </a>
              </TooltipTrigger>
            <TooltipContent>{instagram}</TooltipContent>
          </Tooltip>
          ) : null}
        </div>
      )
    },
    id: "socials_instagram"
  },
  {
    accessorKey: "relationship_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({row}) => {
      const types = row.getValue("relationship_type")
      const colorMap = {
        personal: "bg-purple-100 text-purple-800 hover:bg-purple-200",
        professional: "bg-green-100 text-green-800 hover:bg-green-200",
        social: "bg-blue-100 text-blue-800 hover:bg-blue-200"
      }
      return (
        <div className="text-left flex gap-2">
          {types?.map((type, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className={`text-sm ${colorMap[type.toLowerCase()] }`}
            >
              {type}
            </Badge>
          ))}
        </div>
      )
    },
    id: "relationship_type"
  },
  {
    accessorKey: "industry",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Industry" />
    ),
    cell: ({row}) => {
      const industry = row.getValue("industry")
      return <div className="text-left text-lg font-medium">{industry}</div>
    },
    id: "industry"
  },
  {
    accessorKey: "company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({row}) => {
      const company = row.getValue("company")
      return <div className="text-left text-lg font-medium">{company}</div>
    },
    id: "company"
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({row}) => {
      const role = row.getValue("role")
      return <div className="text-left text-lg font-medium">{role}</div>
    },
    id: "role"
  },
  {
    accessorKey: "last_contact_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Contact" />
    ),
    cell: ({row}) => {
      const lastContact = row.getValue("last_contact_at")
      if (!lastContact) return <div className="text-center text-lg font-medium">-</div>
      
      // Format the date (assuming it's in YYYY-MM-DD format)
      const date = new Date(lastContact)
      const formatted = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
      
      return <div className="text-center text-lg font-medium">{formatted}</div>
    },
    id: "last_contact_at"
  },
  {
    accessorKey: "interactions_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="# of Interactions" />
    ),
    cell: ({row}) => {
      const amount = parseInt(row.getValue("interactions_count"))
      return <div className="text-center font-medium text-xl">{amount}</div>
  }
  },
  {
    accessorKey: "tags",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tags" />
    ),
    cell: ({row}) => {
      const tags = row.getValue("tags")
      return (
        <div className="text-left flex gap-2">
          {tags?.map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline"
              className="text-sm bg-gray-100 text-black hover:bg-gray-200"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )
    },
    id: "tags"
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const contact = row.original
      return <RowActions contact={contact} onDeleteContact={onDeleteContact}  onUpdateContact={onUpdateContact}/>
    },
  }
]


export const getColumnDisplayName = (column) => {
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
