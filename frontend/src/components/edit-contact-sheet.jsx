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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="school">School/University</Label>
                        <Input
                            id="school"
                            value={formData.school}
                            onChange={(e) => handleInputChange('school', e.target.value)}
                            placeholder="Educational institution"
                        />
                    </div>

                    <div>
                        <Label htmlFor="last_contact">Last Contact Date</Label>
                        <Calendar22
                            selectedDate={formData.last_contact_at ? new Date(formData.last_contact_at) : undefined}
                            onDateChange={(date) =>
                            handleInputChange(
                                'last_contact_at',
                                date ? date.toISOString().split('T')[0] : ''
                            )
                            }
                        />
                    </div>

                    <div className="md:col-span-2">
                        <Label htmlFor="where_met">Where We Met</Label>
                        <Input
                            id="where_met"
                            value={formData.where_met}
                            onChange={(e) => handleInputChange('where_met', e.target.value)}
                            placeholder="e.g., Conference, LinkedIn, Mutual friend"
                        />
                    </div>
                </div>
            </SectionBreakdown>


            <SectionBreakdown title="Relationship & Categories">
                <div className="space-y-4">
                    <div>
                    <Label className="text-base font-medium">Relationship Type</Label>
                    <div className="flex flex-wrap gap-10 mt-3">
                        {['professional', 'personal', 'social'].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                            id={`relationship-${type}`}
                            checked={formData.relationship_type.includes(type)}
                            onCheckedChange={(checked) => {
                                if (checked) {
                                setFormData((prev) => ({
                                    ...prev,
                                    relationship_type: [...prev.relationship_type, type],
                                }));
                                } else {
                                setFormData((prev) => ({
                                    ...prev,
                                    relationship_type: prev.relationship_type.filter((t) => t !== type),
                                }));
                                }
                            }}
                            />
                            <Label htmlFor={`relationship-${type}`} className="capitalize cursor-pointer">
                            {type}
                            </Label>
                        </div>
                        ))}
                    </div>
                    </div>

                    <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                        id="tags"
                        value={formData.tags.join(', ')}
                        onChange={(e) => handleInputChange('tags', e.target.value)}
                        placeholder="e.g., mentor, client, friend (comma-separated)"
                    />
                    </div>
                </div>
            </SectionBreakdown>


            <SectionBreakdown title="Social Media & Additional Notes">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input
                            id="linkedin"
                            value={formData.linkedin}
                            onChange={(e) => handleInputChange('linkedin', e.target.value)}
                            placeholder="LinkedIn profile URL"
                            />
                        </div>

                        <div>
                            <Label htmlFor="twitter">Twitter</Label>
                            <Input
                            id="twitter"
                            value={formData.twitter}
                            onChange={(e) => handleInputChange('twitter', e.target.value)}
                            placeholder="@username"
                            />
                        </div>

                        <div>
                            <Label htmlFor="instagram">Instagram</Label>
                            <Input
                            id="instagram"
                            value={formData.instagram}
                            onChange={(e) => handleInputChange('instagram', e.target.value)}
                            placeholder="@username"
                            />
                        </div>

                    </div>

                    <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            placeholder="Any additional notes about this contact..."
                            rows={4}
                        />
                    </div>
                </div>
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
