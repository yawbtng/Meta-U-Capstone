import { useState, useEffect } from 'react';
import RecommendationCard from './recommendation-card';

export default function AddContactRecommendation() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    // TODO: Replace with actual API call to get recommendations
    useEffect(() => {
       
        setTimeout(() => {
            setRecommendations([]);
            setLoading(false);
        }, 1000);
    }, []);

    const handleQuickAdd = (contact) => {
        console.log('Adding contact:', contact);
        // TODO: Implement quick add functionality
    };

    const handleDismiss = (contact) => {
        console.log('Dismissing contact:', contact);
        // TODO: Implement dismiss functionality
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-muted-foreground">Loading recommendations...</div>
            </div>
        );
    }

    if (recommendations.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>No recommendations available at the moment.</p>
                <p className="text-sm mt-2">Check back later for personalized suggestions.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">People You May Know</h2>
                <p className="text-sm text-muted-foreground">
                    Based on your network and interests
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recommendations.map((contact, index) => (
                    <RecommendationCard
                        key={contact.id || index}
                        contact={contact}
                        similarity={contact.similarity}
                        onQuickAdd={handleQuickAdd}
                        onDismiss={handleDismiss}
                    />
                ))}
            </div>
        </div>
    );
}
