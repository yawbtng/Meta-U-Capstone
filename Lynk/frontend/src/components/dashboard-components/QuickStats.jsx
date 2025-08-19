import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users, UserPlus, Factory, MessageCircle, Star, Users2 } from "lucide-react";
import LoadingSpinner from "../ui/loading-spinner";

const RELATIONSHIP_TYPES = [
    { type: "professional", color: "text-green-700" },
    { type: "personal", color: "text-purple-700" },
    { type: "social", color: "text-blue-700" },
];

function getStats(contacts) {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    // 1. Total connections
    const total = contacts.length;

    // 2. New connections this month
    const newThisMonth = contacts.filter(c => {
        const added = c.added_at ? new Date(c.added_at) : null;
        return added && added.getMonth() === thisMonth && added.getFullYear() === thisYear;
    }).length;

    // 3. Most common industry
    const industryCounts = {};
    contacts.forEach(c => {
        if (c.industry) {
            industryCounts[c.industry] = (industryCounts[c.industry] || 0) + 1;
        }
    });
    let mostCommonIndustry = null;
    let maxIndustryCount = 0;
    Object.entries(industryCounts).forEach(([industry, count]) => {
        if (count > maxIndustryCount) {
            mostCommonIndustry = industry;
            maxIndustryCount = count;
        }
    });

    // 4. Average interactions per contact
    const totalInteractions = contacts.reduce((sum, c) => sum + (c.interactions_count || 0), 0);
    const avgInteractions = total > 0 ? (totalInteractions / total) : 0;

    // 5. Most contacted contact
    let mostContacted = null;
    let maxInteractions = -1;
    contacts.forEach(c => {
        if ((c.interactions_count || 0) > maxInteractions) {
            mostContacted = c;
            maxInteractions = c.interactions_count || 0;
        }
    });

    // 6. Relationship type counts
    const relationshipTypeCounts = {
        professional: 0,
        personal: 0,
        social: 0,
    };
    contacts.forEach(c => {
        if (Array.isArray(c.relationship_type)) {
            c.relationship_type.forEach(type => {
                const t = type.toLowerCase();
                if (relationshipTypeCounts[t] !== undefined) {
                    relationshipTypeCounts[t]++;
                }
            });
        }
    });

    return {
        total,
        newThisMonth,
        mostCommonIndustry: mostCommonIndustry || "-",
        avgInteractions: avgInteractions.toFixed(1),
        mostContacted: mostContacted ? mostContacted.name : "-",
        relationshipTypeCounts,
    };
}

const statBox = (
    icon, label, value, valueClass = ""
) => (
    <div className="flex flex-col items-center justify-center text-center w-full">
        <div className="flex items-center justify-center gap-3 mb-1">
            {icon}
            <span className={`font-bold text-xl md:text-2xl ${valueClass}`}>{value}</span>
        </div>
        <div className="text-xs md:text-sm text-muted-foreground font-medium mb-0.5">{label}</div>
    </div>
);

const relationshipTypeStat = (counts) => (
    <div className="flex flex-col items-center justify-center text-center w-full">
        <div className="flex items-center justify-center gap-3 mb-1">
            <Users2 className="h-8 w-8 text-primary" />
            <span className="flex gap-2">
                {RELATIONSHIP_TYPES.map(({ type, color }, idx) => (
                    <span key={type} className={`font-semibold text-xs md:text-sm ${color}`}>{type}: {counts[type]}{idx < RELATIONSHIP_TYPES.length - 1 ? ',' : ''}</span>
                ))}
            </span>
        </div>
        <div className="text-xs md:text-sm text-muted-foreground font-medium mb-0.5">Connections by Type</div>
    </div>
);

const QuickStats = ({ contacts, loading }) => {
    const stats = getStats(contacts || []);
    return (
        <div className="lg:col-span-2">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        <span className="text-lg md:text-xl">Quick Stats</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-center h-full">
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <LoadingSpinner size={28} text="Loading stats..." />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 grid-rows-3 gap-4 h-full w-full">
                            {statBox(
                                <Users className="h-8 w-8 text-primary" />, "Total Connections", stats.total
                            )}
                            {statBox(
                                <UserPlus className="h-8 w-8 text-green-600" />, "New This Month", `+${stats.newThisMonth}`, "text-green-600"
                            )}
                            {statBox(
                                <Factory className="h-8 w-8 text-blue-600" />, "Most Common Industry", <span className="text-base md:text-lg font-semibold">{stats.mostCommonIndustry}</span>
                            )}
                            {statBox(
                                <MessageCircle className="h-8 w-8 text-yellow-600" />, "Avg. Interactions", <span className="text-base md:text-lg font-semibold">{stats.avgInteractions}</span>
                            )}
                            {relationshipTypeStat(stats.relationshipTypeCounts)}
                            <div className="flex flex-col items-center justify-center text-center w-full">
                                <div className="flex items-center justify-center gap-3 mb-1">
                                    <Star className="h-8 w-8 text-pink-600" />
                                    <span className="font-bold text-lg md:text-xl text-pink-600">{stats.mostContacted}</span>
                                </div>
                                <div className="text-xs md:text-sm text-muted-foreground font-medium mb-0.5">Most Contacted</div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default QuickStats; 