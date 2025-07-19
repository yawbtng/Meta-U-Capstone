import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { UserAuth } from '../../context/AuthContext';
import RecommendationCard from './recommendation-card';
import { fetchUserRecommendations, quickAddContact } from '../../lib/recommendations';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export default function AddContactRecommendation() {
    const { session } = UserAuth();
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [addingContact, setAddingContact] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [currentOffset, setCurrentOffset] = useState(0);
    
    const observer = useRef();
    const user = session?.user;

    // Memoize the intersection observer callback to prevent unnecessary re-rendering
    const lastRecommendationRef = useCallback(node => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreRecommendations();
            }
        }, {
            threshold: 0.1, // Trigger slightly before fully visible
            rootMargin: '50px' // Load 50px before reaching the element
        });
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore]);

    const loadRecommendations = useCallback(async () => {
        if (!user?.id) return;
        
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        setCurrentOffset(0);
        
        try {
            const result = await fetchUserRecommendations(user.id, 16, 0);
            
            if (result.success) {
                setRecommendations(result.data);
                setHasMore(result.pagination.hasMore);
                setCurrentOffset(16);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Failed to load recommendations. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    const loadMoreRecommendations = useCallback(async () => {
        if (loadingMore || !hasMore || !user?.id) return;
        
        setLoadingMore(true);
        
        try {
            const result = await fetchUserRecommendations(user.id, 16, currentOffset);
            
            if (result.success) {
                // Only update if we actually got new data
                if (result.data.length > 0) {
                    setRecommendations(prev => [...prev, ...result.data]);
                    setCurrentOffset(prev => prev + result.data.length);
                }
                setHasMore(result.pagination.hasMore);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Failed to load more recommendations.');
        } finally {
            setLoadingMore(false);
        }
    }, [loadingMore, hasMore, user?.id, currentOffset]);

    const handleQuickAdd = useCallback(async (contact) => {
        const contactId = contact.id;
        setAddingContact(contactId);
        setSuccessMessage(null);
        setError(null);
        
        try {
            const result = await quickAddContact(contact, user.id);
            
            if (result.success) {
                // Remove only the specific contact
                setRecommendations(prev => prev.filter(rec => rec.id !== contactId));
                setSuccessMessage(result.message || 'Contact added successfully!');
                
                // Auto-clear success message
                setTimeout(() => setSuccessMessage(null), 4000);
            } else {
                setError(result.error);
                setTimeout(() => setError(null), 5000);
            }
        } catch (error) {
            setError('Failed to add contact. Please try again.');
            setTimeout(() => setError(null), 5000);
        } finally {
            setAddingContact(null);
        }
    }, [user?.id]);

    const handleDismiss = useCallback((contact) => {
        const contactId = contact.id || contact.payload?.id;
        setRecommendations(prev => prev.filter(rec => rec.id !== contactId));
    }, []);

    useEffect(() => {
        if (user?.id) {
            loadRecommendations();
        }
    }, [user?.id, loadRecommendations]);

    // Memoize the recommendation grid to prevent unnecessary re-renders
    const recommendationGrid = useMemo(() => {
        return recommendations.map((contact, index) => {
            const stableKey = `${contact.id}-${index}`;
            const isLast = recommendations.length === index + 1;
            
            const cardElement = (
                <RecommendationCard
                    contact={contact.payload || contact}
                    similarity={contact.similarity}
                    onQuickAdd={handleQuickAdd}
                    onDismiss={() => handleDismiss(contact)}
                    isAdding={addingContact === contact.id}
                />
            );

            if (isLast) {
                return (
                    <div key={stableKey} ref={lastRecommendationRef}>
                        {cardElement}
                    </div>
                );
            }
            
            return <div key={stableKey}>{cardElement}</div>;
        });
    }, [recommendations, addingContact, handleQuickAdd, handleDismiss, lastRecommendationRef]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="flex items-center space-x-2 text-muted-foreground">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Finding people you may know...</span>
                </div>
            </div>
        );
    }

    if (error && recommendations.length === 0) {
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
                <p>No new connections available at the moment.</p>
                <p className="text-sm mt-2">You've connected with everyone in your network!</p>
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
                    {recommendations.length} connections found • Sorted by similarity
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {recommendationGrid}
            </div>

            {/* Loading indicator for more recommendations */}
            {loadingMore && (
                <div className="flex justify-center items-center py-8">
                    <div className="flex flex-col items-center space-y-3">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span>Loading more recommendations...</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Finding people based on similarity
                        </div>
                    </div>
                </div>
            )}

            {/* End of recommendations message */}
            {!hasMore && recommendations.length > 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">You've seen all available recommendations</p>
                    <p className="text-xs mt-1">Connect with more people to get better suggestions</p>
                </div>
            )}
        </div>
    );
}
