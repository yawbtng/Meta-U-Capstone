import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AvatarDemo from "../avatar-01";
import { getInitials } from "../contacts-table-components/columns";

export function RecommendationCard({ contact }) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                    <AvatarDemo 
                        initials={getInitials(contact.name)} 
                        className="w-12 h-12 text-lg"
                    />
                    <div>
                        <h3 className="font-semibold text-lg">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground">
                            {contact.role && contact.company ? 
                                `${contact.role} at ${contact.company}` : 
                                'No company info'
                            }
                        </p>
                    </div>
                </div>
            </CardHeader>
            
            <CardContent className="pt-0">
                
            </CardContent>
        </Card>
    );
}

export default RecommendationCard;
