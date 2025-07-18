import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function RecommendationCard({ contact }) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <h3 className="font-semibold text-lg">{contact.name}</h3>
            </CardHeader>
            
            <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">
                    {contact.role && contact.company ? 
                        `${contact.role} at ${contact.company}` : 
                        'No company info'
                    }
                </p>
            </CardContent>
        </Card>
    );
}

export default RecommendationCard;
