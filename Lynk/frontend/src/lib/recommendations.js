import { supabase } from '../../../backend/browser-client.js';
import { getRecommendationsAPI } from '../../../backend/services/supabase-vector.js';

export async function fetchUserRecommendations(userId, limit = 16, offset = 0) {
    try {
        // Get the user's embedding vector
        const { data: userEmbedding, error: embeddingError } = await supabase
            .from('embeddings')
            .select('embedding')
            .eq('user_id', userId)
            .eq('profile_type', 'user')
            .single();

        if (embeddingError || !userEmbedding) {
            throw new Error('User embedding not found. Please run the embedding pipeline first.');
        }

        
        const result = await getRecommendationsAPI({userVector: userEmbedding.embedding, userId: userId,
            type: 'connections', limit: limit, offset: offset });

        return result;

    } catch (error) {
        return {
            success: false,
            error: error.message,
            data: [],
            pagination: {
                currentPage: Math.floor(offset / limit) + 1,
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
        const connectionId = contactData.id;

        if (!connectionId) {
            throw new Error('Connection ID is required');
        }

       
        const { data: newRelationship, error: relationshipError } = await supabase
            .from('user_to_connections')
            .insert([{
                user_id: userId,
                connection_id: connectionId,
                added_at: new Date().toISOString(),
            }])
            .select('user_id, connection_id, added_at')
            .single();

        if (relationshipError) {
            if (relationshipError.code === '23505') { // Unique constraint violation
                return {
                    success: false,
                    error: 'This connection is already in your network'
                };
            }
            throw new Error(`Failed to create relationship: ${relationshipError.message}`);
        }

        return {
            success: true,
            data: newRelationship,
            message: `${contactData.name || 'Contact'} has been added to your network`
        };

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}