import {useState, useEffect} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ComboboxDemo } from "./Combobox"
import { industries } from "../providers/industries"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import AvatarDemo from "./avatar-01"

const SectionBreakdown = ({children, title}) => {
    return (
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger>{title}</AccordionTrigger>
                <AccordionContent>
                    {children}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export function EditContact({children, contactData}) {
    
    const [formData, setFormData] = useState({
        name: contactData.name || "",
        email: contactData.email || "",
        phone_number: contactData.phone_number || "",
        company: contactData.company || "",
        role: contactData.role || "",
        industry: contactData.industry || "",
        school: contactData.school || "",
        where_met: contactData.where_met || "",
        last_contact_at: contactData.last_contact_at || "",
        relationship_type: contactData.relationship_type || [],
        tags: contactData.tags || [],
        linkedin: contactData.socials?.linkedin || "",
        twitter: contactData.socials?.twitter || "",
        instagram: contactData.socials?.instagram || "",
        notes: contactData.notes || ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'tags'
        ? value.split(',').map(tag => tag.trim()).filter(Boolean)
        : value
    }));
  };

  return (
    <Sheet>
        {children}
      <SheetContent className="min-w-[600px] sm:min-w-[700px] overflow-y-scroll" size="xl">
        <SheetHeader>
          <SheetTitle>Edit Contact</SheetTitle>
          <SheetDescription>
            Make changes to this contact here. Click save when you are done.
          </SheetDescription>
        </SheetHeader>

        <AvatarDemo initials="YB" />


        <div>
        
            <SectionBreakdown title="Basic Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
                    </div>
                    <div> 
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" value={formData.phone_number} onChange={(e) => handleInputChange("phone_number", e.target.value)} />
                    </div>
                </div>
            </SectionBreakdown>


            <SectionBreakdown title="Professional Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" value={formData.company} onChange={(e) => handleInputChange("company", e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="role">Role/Position</Label>
                        <Input id="role" value={formData.role} onChange={(e) => handleInputChange("role", e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                        <Label htmlFor="industry">Industry</Label>
                        <ComboboxDemo id="industry" value={formData.industry} onChange={(value) => handleInputChange("industry", value)} inputs={industries} />
                    </div>
                </div>
            </SectionBreakdown>

            <SectionBreakdown title="Background & Context">

            </SectionBreakdown>

            <SectionBreakdown title="Relationship & Categories">

            </SectionBreakdown>

            <SectionBreakdown title="Social Media & Additional Notes">

            </SectionBreakdown>

        </div>

        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
