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

const customFilterFn = (row, columnId, filterValue) => {
  const cellValue = row.getValue(columnId);
  const { condition, value, columnType } = filterValue;
  
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

export const columns = (onDeleteContact, onUpdateContact, onViewContact) => [
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
        className="outline-2 flex justify-left"
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

      return <div className="flex justify-center font-medium cursor-pointer" onClick={() => onViewContact(row.original)}>
        <AvatarDemo initials={initials} url={avatar} className="w-12 h-12"/>
        </div>
    }
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name = row.getValue("name");
      const contact = row.original;
      return (
        <div
          className="text-center text-lg font-medium cursor-pointer hover:underline focus:outline-none"
          onClick={() => onViewContact(contact)}
        >
          {name}
        </div>
      );
    },
    id: "name", 
    type: "text",
    enableColumnFilter: true,
    filterFn: customFilterFn
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({row}) => {
      const email = row.getValue("email")
      const contact = row.original
      return <div className="text-left text-lg font-medium"
      onClick={() => onViewContact(contact)}>{email}</div>
    },
    id: "email",
    type: "email",
    enableColumnFilter: true,
    filterFn: customFilterFn
  },
  {
    accessorKey: "phone_number",
    header: () => <div className="text-center">Phone #</div>,
    cell: ({row}) => {
      const phone = row.getValue("phone_number")
      const contact = row.original
      let parsed;
      if (phone.length === 10) {
        parsed = `${phone.substring(0, 3)}-${phone.substring(3, 6)}-${phone.substring(6, 10)}`
      } else {
        parsed = phone;
      }
      return <div className="text-center text-lg font-medium"
      onClick={() => onViewContact(contact)}>{parsed}</div>
    },
    id: "phone_number",
    type: "number",
    enableColumnFilter: true,
    filterFn: customFilterFn
  },
  {
    accessorKey: "socials.linkedin",
    header: () => <div className="flex justify-center"><Linkedin color="blue"/></div>,
    cell: ({row}) => {
      const linkedin = row.original.socials?.linkedin
      return (
        <div className="flex justify-center underline text-lg"
        onClick={() => onViewContact(contact)}>
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
    id: "socials_linkedin",
    type: "text",
    enableColumnFilter: true,
    filterFn: customFilterFn
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
    id: "socials_twitter",
    type: "text",
    enableColumnFilter: true,
    filterFn: customFilterFn
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
    id: "socials_instagram",
    type: "text",
    enableColumnFilter: true,
    filterFn: customFilterFn
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
        <div className="text-left flex gap-1">
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
    id: "relationship_type",
    type: "multi-select",
    options: ["personal", "professional", "social"],
    enableColumnFilter: true,
    filterFn: customFilterFn
  },
  {
    accessorKey: "industry",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Industry" />
    ),
    cell: ({row}) => {
      const industry = row.getValue("industry")
      const contact = row.original
      return <div className="text-left text-lg font-medium"
      onClick={() => onViewContact(contact)}>{industry}</div>
    },
    id: "industry",
    type: "text",
    enableColumnFilter: true,
    filterFn: customFilterFn
  },
  {
    accessorKey: "company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({row}) => {
      const company = row.getValue("company")
      const contact = row.original
      return <div className="text-left text-lg font-medium"
      onClick={() => onViewContact(contact)}>{company}</div>
    },
    id: "company",
    type: "text",
    enableColumnFilter: true,
    filterFn: customFilterFn
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({row}) => {
      const role = row.getValue("role")
      const contact = row.original
      return <div className="text-left text-lg font-medium"
      onClick={() => onViewContact(contact)}>{role}</div>
    },
    id: "role",
    type: "text",
    enableColumnFilter: true,
    filterFn: customFilterFn
  },
  {
    accessorKey: "last_contact_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Contact" />
    ),
    cell: ({row}) => {
      const lastContact = row.getValue("last_contact_at")
      if (!lastContact) return <div className="text-center text-sm font-medium">-</div>
      const contact = row.original
      
      const date = new Date(lastContact)
      const formatted = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
      
      return <div className="text-center text-lg font-medium"
      onClick={() => onViewContact(contact)}>{formatted}</div>
    },
    id: "last_contact_at",
    type: "date",
    enableColumnFilter: true,
    filterFn: customFilterFn
  },
  {
    accessorKey: "interactions_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="# of Interactions" />
    ),
    cell: ({row}) => {
      const amount = parseInt(row.getValue("interactions_count"))
      const contact = row.original
      return <div className="text-center font-medium text-xl"
      onClick={() => onViewContact(contact)}>{amount}</div>
    },
    id: "interactions_count",
    type: "number",
    enableColumnFilter: true,
    filterFn: customFilterFn
  },
  {
    accessorKey: "tags",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tags" />
    ),
    cell: ({row}) => {
      const tags = row.getValue("tags")
      const contact = row.original
      return (
        <div className="text-left flex gap-2">
          {tags?.map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline"
              className="text-sm bg-gray-100 text-black hover:bg-gray-200"
              onClick={() => onViewContact(contact)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )
    },
    id: "tags",
    type: "text",
    enableColumnFilter: true,
    filterFn: customFilterFn
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
