import {useState, useEffect} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ComboboxDemo } from "./Combobox"
import { industries } from "../lib/industries.js"
import { Label } from "@/components/ui/label"
import { Calendar22 } from "./ui/date-picker"
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
import { getInitials } from "./contacts-table-components/columns"
import { updateContact } from "../../../backend/index.js"
import { toast } from "sonner"
import { UserAuth } from "../context/AuthContext"

const SectionBreakdown = ({children, title, value}) => {
    return (
        <AccordionItem className="border-b-black" value={value}>
           <AccordionTrigger className="!text-2xl !font-semibold !py-4 outline-2">{title}</AccordionTrigger>
            <AccordionContent>{children}</AccordionContent>
        </AccordionItem>
    )
}

function initializeForm(c = {}) {
  return {
    name: c.name || "",
    email: c.email || "",
    avatar_url: c.avatar_url || "",
    phone_number: c.phone_number || "",
    company: c.company || "",
    role: c.role || "",
    industry: c.industry || "",
    school: c.school || "",
    where_met: c.where_met || "",
    last_contact_at: c.last_contact_at || "",
    relationship_type: c.relationship_type || [],
    tags: c.tags || [],
    linkedin: c.socials?.linkedin || "",
    twitter: c.socials?.twitter || "",
    instagram: c.socials?.instagram || "",
    notes: c.notes || "",
  }
}

export function EditContact({children,  contactData, open, onOpenChange, onContactUpdated}) {
    const { session } = UserAuth();
    const [formData, setFormData] = useState(initializeForm(contactData))
    const [saving, setSaving]   = useState(false)
    const [errors, setErrors]   = useState({})

    useEffect(() => {
        setFormData(initializeForm(contactData))
    }, [contactData])


  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'tags'
        ? value.split(',').map(tag => tag.trim()).filter(Boolean)
        : value
    }));
  };

      // Validate form
    const validate = () => {
        const newErrors = {};

        // Required field validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        // Email validation
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation
        if (formData.phone_number && !/^\+?[1-9]\d{1,14}$/.test(formData.phone_number)) {
            newErrors.phone_number = 'Please enter a valid phone number (e.g., 1234567890)';
        }

        // Last contact date validation
        if (formData.last_contact_at) {
            const lastContactDate = new Date(formData.last_contact_at);
            const currentDate = new Date();
            if (lastContactDate > currentDate) {
                newErrors.last_contact_at = 'Last contact date cannot be in the future';
            }
        }

        // linkedIn URL validation
        if (formData.linkedin) {
            const linkedInPattern = /^https?:\/\/(www\.)?linkedin\.com\/.*$/i;
            if (!linkedInPattern.test(formData.linkedin)) {
                newErrors.linkedin = "Not a valid LinkedIn URL";
            }
        }

        // Tags validation
        if (formData.tags.length > 0) {
            const invalidTags = formData.tags.filter(tag => tag.includes(' '));
            if (invalidTags.length > 0) {
                newErrors.tags = 'Tags must be comma-separated without spaces';
            }
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        const v = validate(formData)
        setErrors(v)
        if (Object.keys(v).length > 0) return

        setSaving(true)
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                phone_number: formData.phone_number,
                company: formData.company,
                role: formData.role,
                industry: formData.industry,
                school: formData.school,
                where_met: formData.where_met,
                last_contact_at: formData.last_contact_at,
                relationship_type: formData.relationship_type,
                tags: formData.tags,
                socials: {
                    linkedin: formData.linkedin || null,
                    twitter : formData.twitter  || null,
                    instagram: formData.instagram || null,
                },
                notes: formData.notes,
                updated_at: new Date().toISOString(),
            }

         
            const result = await updateContact(contactData.id, payload, session?.user?.id);

            if (!result.success) throw new Error(result.error);

            onContactUpdated?.(result.data); 
            toast.success("Contact updated ✅")
            onOpenChange(false)       
        } catch (err) {
            toast.error("Failed to update contact");
        } finally {
            setSaving(false)
        }
    }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
        {children}
      <SheetContent className="min-w-1/2 max-w-[1200px] px-12 py-8 overflow-y-scroll">
        <SheetHeader className="text-center mb-6">
            <SheetTitle className="text-4xl font-bold text-gray-900">
                Edit Contact
            </SheetTitle>
            <SheetDescription className="!text-lg text-gray-600 mt-2">
                Make changes to this contact here. Click save when you are done.
            </SheetDescription>
        </SheetHeader>

        <div className="flex justify-center mb-8">
            <AvatarDemo initials={getInitials(formData.name)} url={formData.avatar_url} className="w-40 h-40 text-2xl" />
        </div>


        <Accordion type="multiple" collapsible="true" className="space-y-6">
            <SectionBreakdown title="Basic Information" value="basic">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <Label htmlFor="name" className="!text-lg font-semibold">Name *</Label>
                        <Input
                            id="name"
                            className="h-12 !text-lg"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                    </div>
                    <div>
                    <Label htmlFor="email" className="!text-lg font-semibold">Email</Label>
                        <Input
                            id="email"
                            className="h-12 !text-lg"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                    </div>
                    <div>
                    <Label htmlFor="phone" className="!text-lg font-semibold">Phone Number</Label>
                        <Input
                            id="phone"
                            className="h-12 !text-lg"
                            value={formData.phone_number}
                            onChange={(e) => handleInputChange("phone_number", e.target.value)}
                        />
                    </div>
                </div>
            </SectionBreakdown>

            <SectionBreakdown title="Professional Information" value="professional">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="company" className="!text-lg font-semibold">Company</Label>
                        <Input
                            id="company"
                            className="h-12 !text-lg"
                            value={formData.company}
                            onChange={(e) => handleInputChange("company", e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="role" className="!text-lg font-semibold">Role/Position</Label>
                        <Input
                            id="role"
                            className="h-12 !text-lg"
                            value={formData.role}
                            onChange={(e) => handleInputChange("role", e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <Label htmlFor="industry" className="!text-lg font-semibold">Industry</Label>

                        {formData.industry && (
                            <p className="text-muted-foreground mb-1 !justify-start text-lg flex">
                                Current: {formData.industry}
                            </p>
                        )}
                        <ComboboxDemo
                            className="!justify-start mt-1 flex scale-125 ml-3"
                            id="industry"
                            value={formData.industry}
                            onChange={(value) => handleInputChange("industry", value)}
                            inputs={industries}
                        />
                    </div>
                </div>
            </SectionBreakdown>


            <SectionBreakdown title="Background & Context" value="background">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="school" className="!text-lg font-semibold">School/University</Label>
                        <Input
                            id="school"
                            className="h-12 !text-lg"
                            value={formData.school}
                            onChange={(e) => handleInputChange('school', e.target.value)}
                            placeholder="Educational institution"
                        />
                    </div>
                    <div>
                        <Label htmlFor="last_contact" className="!text-lg font-semibold">Last Contact Date</Label>
                        <Calendar22
                            selectedDate={formData.last_contact_at ? new Date(formData.last_contact_at) : undefined}
                            onDateChange={(date) =>
                            handleInputChange('last_contact_at', date ? date.toISOString().split('T')[0] : '')
                            }
                        />
                    </div>
                    <div className="md:col-span-2">
                        <Label htmlFor="where_met" className="!text-lg font-semibold">Where We Met</Label>
                        <Input
                            id="where_met"
                            className="h-12 !text-lg"
                            value={formData.where_met}
                            onChange={(e) => handleInputChange('where_met', e.target.value)}
                            placeholder="e.g., Conference, LinkedIn, Mutual friend"
                        />
                    </div>
                </div>
            </SectionBreakdown>



            <SectionBreakdown title="Relationship & Categories" value="relationship">
                <div className="space-y-6">
                    <div>
                        <Label className="!text-lg font-semibold">Relationship Type</Label>
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
                                        <Label htmlFor={`relationship-${type}`} className="capitalize !text-lg">{type}</Label>
                                    </div>
                                ))}
                            </div>
                    </div>
                    <div>
                        <Label htmlFor="tags" className="!text-lg font-semibold">Tags</Label>
                        <Input
                            id="tags"
                            className="h-12 !text-lg"
                            value={formData.tags.join(', ')}
                            onChange={(e) => handleInputChange('tags', e.target.value)}
                            placeholder="e.g., mentor, client, friend (comma-separated)"
                        />
                    </div>
                </div>
            </SectionBreakdown>


            <SectionBreakdown title="Social Media & Additional Notes" value="social">
            <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <Label htmlFor="linkedin" className="!text-lg font-semibold">LinkedIn</Label>
                            <Input
                            id="linkedin"
                            className="h-12 !text-lg"
                            value={formData.linkedin}
                            onChange={(e) => handleInputChange('linkedin', e.target.value)}
                            placeholder="LinkedIn profile URL"
                            />
                        </div>
                        <div>
                            <Label htmlFor="twitter" className="!text-lg font-semibold">Twitter</Label>
                            <Input
                            id="twitter"
                            className="h-12 !text-lg"
                            value={formData.twitter}
                            onChange={(e) => handleInputChange('twitter', e.target.value)}
                            placeholder="@username"
                            />
                        </div>
                        <div>
                            <Label htmlFor="instagram" className="!text-lg font-semibold">Instagram</Label>
                            <Input
                            id="instagram"
                            className="h-12 !text-lg"
                            value={formData.instagram}
                            onChange={(e) => handleInputChange('instagram', e.target.value)}
                            placeholder="@username"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="notes" className="!text-lg font-semibold">Notes</Label>
                        <Textarea
                            id="notes"
                            className="!text-lg"
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            placeholder="Any additional notes about this contact..."
                            rows={4}
                        />
                    </div>
                </div>
            </SectionBreakdown>

        </Accordion>

        <SheetFooter>
            <Button type="button" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
            </Button>
            <SheetClose asChild>
                <Button variant="outline">Close</Button>
            </SheetClose>

        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
