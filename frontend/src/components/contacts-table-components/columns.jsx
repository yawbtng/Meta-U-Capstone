import {z} from 'zod';


const ContactSchema = z.object({
    id: z.uuid(),
    user_id: z.string(),
    name: z.string(),
    email: z.email(),
    phone_number: z.string(),
    linkedin: z.url(),
    twitter: z.string(),
    instagram: z.string(),
    relationship_type: z.enum(["personal", "professional", "social"]),
    avatar_url: z.url(),
    industry: z.string(),
    company: z.string(),
    role: z.string(),
    last_contact_at: z.date(),
    interaction_count: z.number(),
    tags: z.array(z.string())
})


export const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone_number",
    header: "Phone #",
  },
  {
    accessorKey: "linkedin",
    header: "LinkedIn",
  },
  {
    accessorKey: "twitter",
    header: "Twitter",
  },
  {
    accessorKey: "instagram",
    header: "Instagram",
  },
  {
    accessorKey: "relationship_type",
    header: "Relationship Type",
  },
  {
    accessorKey: "avatar_url",
    header: "Photo",
  },
  {
    accessorKey: "industry",
    header: "Industry",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "interaction_count",
    header: "# of Interactions",
  },
  {
    accessorKey: "tags",
    header: "Tags",
  },
]
