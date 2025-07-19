import { supabase } from '../../../backend/browser-client.js';
import { getRecommendationsAPI } from '../../../backend/services/supabase-vector.js';

export async function fetchUserRecommendations(userId, limit = 20, offset = 0) {
    try {
        // First, get the user's existing embedding from the database
        const { data: userEmbedding, error: embeddingError } = await supabase
            .from('embeddings')
            .select('embedding')
            .eq('user_id', userId)
            .eq('profile_type', 'user')
            .single();

        if (embeddingError || !userEmbedding) {
            throw new Error('User embedding not found. Please run the embedding pipeline first.');
        }

        // Get recommendations using the existing user embedding with pagination
        const recommendations = await getRecommendationsAPI({
            userVector: userEmbedding.embedding,
            userId: userId,
            type: 'connections',
            limit: limit,
            offset: offset
        });

        if (!recommendations.success) {
            throw new Error(`Failed to get recommendations: ${recommendations.error}`);
        }

        // Fetch full contact details from connections table
        const connectionIds = recommendations.data.map(rec => rec.payload.id);
        
        const { data: connectionDetails, error: connectionError } = await supabase
            .from('connections')
            .select('id, name, email, role, company, location, interests')
            .in('id', connectionIds);

        if (connectionError) {
            console.error('Error fetching connection details:', connectionError);
            // Fallback to using payload data if connection fetch fails
            return {
                success: true,
                data: recommendations.data,
                pagination: recommendations.pagination
            };
        }

        // Merge connection details with recommendation data
        const enrichedRecommendations = recommendations.data.map(rec => {
            const connectionDetail = connectionDetails.find(conn => conn.id === rec.payload.id);
            return {
                ...rec,
                payload: {
                    ...rec.payload,
                    ...connectionDetail 
                }
            };
        });

        return {
            success: true,
            data: enrichedRecommendations,
            pagination: recommendations.pagination
        };

    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return {
            success: false,
            error: error.message,
            data: [],
            pagination: {
                currentPage: 1,
                totalPages: 0,
                hasMore: false,
                totalResults: 0,
                currentCount: 0
            }
        };
    }
}

export async function quickAddContact(contactData, userId) {
    try {
        // First, get the connection ID from the contact data
        const connectionId = contactData.id;

        if (!connectionId) {
            throw new Error('Connection ID is required');
        }

        // Check if the relationship already exists
        const { data: existingRelationship, error: checkError } = await supabase
            .from('user_to_connections')
            .select('user_id, connection_id')
            .eq('user_id', userId)
            .eq('connection_id', connectionId)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            throw new Error(`Failed to check existing relationship: ${checkError.message}`);
        }

        if (existingRelationship) {
            return {
                success: false,
                error: 'This connection is already in your network'
            };
        }

        // Create the user-to-connection relationship
        const { data: newRelationship, error: relationshipError } = await supabase
            .from('user_to_connections')
            .insert([{
                user_id: userId,
                connection_id: connectionId,
                added_at: new Date().toISOString(),
            }])
            .select()
            .single();

        if (relationshipError) {
            throw new Error(`Failed to create relationship: ${relationshipError.message}`);
        }

        return {
            success: true,
            data: newRelationship,
            message: 'Contact added to your network successfully'
        };

    } catch (error) {
        console.error('Error adding contact:', error);
        return {
            success: false,
            error: error.message
        };
    }
}