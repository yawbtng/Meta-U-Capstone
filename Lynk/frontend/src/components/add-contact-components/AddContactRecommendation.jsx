import { useState, useEffect } from 'react';
import { UserAuth } from '../../context/AuthContext';
import RecommendationCard from './recommendation-card';
import { fetchUserRecommendations, quickAddContact } from '../../lib/recommendations';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export default function AddContactRecommendation() {
    const { session } = UserAuth();
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingContact, setAddingContact] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const user = session?.user;

    useEffect(() => {
        if (user?.id) {
            loadRecommendations();
        }
    }, [user?.id]);

    const loadRecommendations = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        
        try {
            const result = await fetchUserRecommendations(user.id);
            
            if (result.success) {
                setRecommendations(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Failed to load recommendations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleQuickAdd = async (contact) => {
        setAddingContact(contact.id);
        setSuccessMessage(null);
        
        try {
            const result = await quickAddContact(contact, user.id);
            
            if (result.success) {
                setRecommendations(prev => 
                    prev.filter(rec => rec.id !== contact.id)
                );
                setSuccessMessage(result.message || 'Contact added successfully!');
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 3000);
            } else {
                setError(result.error);
                setTimeout(() => {
                    setError(null);
                }, 5000);
            }
        } catch (error) {
            console.error('Error adding contact:', error);
            setError('Failed to add contact. Please try again.');
            setTimeout(() => {
                setError(null);
            }, 5000);
        } finally {
            setAddingContact(null);
        }
    };

    const handleDismiss = (contact) => {
        setRecommendations(prev => 
            prev.filter(rec => rec.id !== contact.id)
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="flex items-center space-x-2 text-muted-foreground">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Loading recommendations...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-red-600 mb-4">Failed to load recommendations</p>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button 
                    onClick={loadRecommendations}
                    variant="outline"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                </Button>
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
            {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-green-800">{successMessage}</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-red-800">{error}</p>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">People You May Know</h2>
                <p className="text-sm text-muted-foreground">
                    Based on your network and interests
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {recommendations.map((contact, index) => (
                    <RecommendationCard
                        key={contact.id || index}
                        contact={contact.payload || contact}
                        similarity={contact.similarity}
                        onQuickAdd={handleQuickAdd}
                        onDismiss={handleDismiss}
                        isAdding={addingContact === (contact.id || index)}
                    />
                ))}
            </div>
        </div>
    );
}
