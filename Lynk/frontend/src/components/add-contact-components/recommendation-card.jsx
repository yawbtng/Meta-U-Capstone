import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building } from "lucide-react";
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
                        <p className="text-sm text-muted-foreground flex items-center">
                            <Building className="w-3 h-3 mr-1" />
                            {contact.role && contact.company ? 
                                `${contact.role} at ${contact.company}` : 
                                'No company info'
                            }
                        </p>
                    </div>
                </div>
            </CardHeader>
            
            <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1 mb-3">
                    {contact.interests?.slice(0, 3).map((interest, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                            {interest}
                        </Badge>
                    ))}
                    {contact.interests?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                            +{contact.interests.length - 3} more
                        </Badge>
                    )}
                </div>
                
                {contact.location && (
                    <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        {contact.location}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default RecommendationCard;
