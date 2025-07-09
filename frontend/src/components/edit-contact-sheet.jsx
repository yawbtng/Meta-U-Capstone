import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

export function EditContact({children}) {
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

            </SectionBreakdown>

            <SectionBreakdown title="Professional Information">

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
