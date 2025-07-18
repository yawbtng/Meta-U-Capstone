import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, X, Linkedin } from "lucide-react";
import AvatarDemo from "../avatar-01";
import { getInitials } from "../contacts-table-components/columns";

export function RecommendationCard({ contact, onQuickAdd, onDismiss, similarity }) {
    // Color array for interest badges
    const badgeColors = [
        "bg-purple-100 text-purple-800",
        "bg-green-100 text-green-800", 
        "bg-blue-100 text-blue-800",
        "bg-orange-100 text-orange-800"
    ];

    // Get similarity color based on score
    const getSimilarityColor = (score) => {
        if (score >= 70) return "bg-green-100 text-green-800";
        if (score >= 30) return "bg-yellow-100 text-yellow-800";
        return "bg-red-100 text-red-800";
    };

    return (
        <Card className="hover:shadow-md transition-shadow relative">
            {/* Similarity score in top left */}
            {similarity && (
                <div className="absolute top-2 left-2">
                    <Badge className={`text-xs ${getSimilarityColor(similarity)}`}>
                        {similarity}%
                    </Badge>
                </div>
            )}

            {/* Dismiss button (X) in top right */}
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onDismiss?.(contact);
                }}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
                <X className="w-4 h-4 text-gray-500" />
            </button>

            <CardHeader className="pb-3 pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                    {/* Avatar */}
                    <AvatarDemo 
                        initials={getInitials(contact.name)} 
                        className="w-16 h-16 text-xl"
                    />
                    
                    {/* Name */}
                    <h3 className="font-semibold text-lg">{contact.name}</h3>
                    
                    {/* Title/Company */}
                    <p className="text-sm text-muted-foreground text-center">
                        {contact.role && contact.company ? 
                            `${contact.role} at ${contact.company}` : 
                            contact.role || contact.company || 'No company info'
                        }
                    </p>
                    
                    {/* Interest badges */}
                    <div className="flex flex-wrap gap-1 justify-center">
                        {contact.interests?.slice(0, 3).map((interest, index) => (
                            <Badge 
                                key={index} 
                                className={`text-xs ${badgeColors[index % badgeColors.length]}`}
                            >
                                {interest}
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardHeader>
            
            <CardContent className="pt-0 pb-4">
                {/* Connect button */}
                <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={(e) => {
                        e.stopPropagation();
                        onQuickAdd(contact);
                    }}
                >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Connect
                </Button>
            </CardContent>
        </Card>
    );
}

export default RecommendationCard;
