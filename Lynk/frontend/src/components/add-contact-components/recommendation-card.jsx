import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, X } from "lucide-react";
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
        let numericScore;
        if (typeof score === 'string') {
            numericScore = parseFloat(score.replace('%', ''));
        } else {
            numericScore = score;
        }
        
        if (numericScore >= 70) return "bg-green-100 text-green-800";
        if (numericScore >= 30) return "bg-yellow-100 text-yellow-800";
        return "bg-red-100 text-red-800";
    };

    return (
        <Card className="hover:shadow-lg hover:scale-105 hover:border-sky-800 hover:border-2 transition-all duration-200 relative h-[360px] cursor-pointer my-2">
            {/* Similarity score in top left */}
            {similarity && (
                <div className="absolute top-3 left-3">
                    <Badge className={`text-sm ${getSimilarityColor(similarity)}`}>
                        {similarity}
                    </Badge>
                </div>
            )}

            {/* Dismiss button (X) in top right */}
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onDismiss?.(contact);
                }}
                className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
                <X className="w-5 h-5 text-gray-500" />
            </button>

            <CardHeader className="pb-0 pt-8 ">
                <div className="flex flex-col items-center text-center space-y-2">
                    {/* Avatar */}
                    <AvatarDemo 
                        url={contact.avatar_url}
                        initials={getInitials(contact.name)} 
                        className="w-32 h-32 text-2xl"
                    />
                    
                    {/* Name */}
                    <h3 className="font-semibold text-xl">{contact.name}</h3>
                    
                    {/* Title/Company */}
                    <p className="text-base text-muted-foreground text-center">
                        {contact.role && contact.company ? 
                            `${contact.role} at ${contact.company}` : 
                            contact.role || contact.company || 'No company info'
                        }
                    </p>
                    
                    {/* Interest badges */}
                    <div className="flex flex-wrap gap-1 justify-center max-w-full">
                        {contact.interests?.slice(0, 3).map((interest, index) => (
                            <Badge 
                                key={index} 
                                className={`text-xs px-2 ${badgeColors[index % badgeColors.length]}`}
                            >
                                {interest}
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardHeader>
            
            <CardContent className="bottom-1 left-0 right-0 px-6 absolute">
                {/* Connect button */}
                <Button 
                     className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base"
                    onClick={(e) => {
                        e.stopPropagation();
                        onQuickAdd(contact);
                    }}
                >
                    <UserPlus className="w-5 h-5 mr-2 " />
                    Connect
                </Button>
            </CardContent>
        </Card>
    );
}

export default RecommendationCard;
