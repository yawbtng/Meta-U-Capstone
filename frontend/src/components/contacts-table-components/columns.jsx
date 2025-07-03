import { z } from "zod"

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
