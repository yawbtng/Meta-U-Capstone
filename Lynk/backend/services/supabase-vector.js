import { embeddings } from "./together-ai-client.js";
import { supabase } from "../browser-client.js";

export async function initializeCollection() {
  try {
    const { count, error } = await supabase
      .from('embeddings')
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    return true;
  } catch (error) {
    throw new Error(`Vector initialization failed: ${error.message}`);
  }
}

export async function upsertVectorsBatch(points) {
  try {
    const embeddingRows = points.map(point => ({
      id: point.id,
      content: point.payload.profile_text || point.payload.name || '',
      embedding: point.vector,
      metadata: point.payload,
      profile_type: point.payload.type,
      user_id: point.payload.type === 'user' ? point.id : null,
      connection_id: point.payload.type === 'connection' ? point.id : null,
    }));

    const { error } = await supabase
      .from('embeddings')
      .upsert(embeddingRows);

    if (error) throw error;
    return true;
  } catch (error) {
    throw new Error(`Batch upsert failed: ${error.message}`);
  }
}

export async function getRecommendationsAPI({userVector, userId, type = 'connections', limit = 16, offset = 0, criteria = {}}) {
  try {
    let result;
    switch (type) {
      case 'connections':
        result = await findSimilarConnections(userVector, userId, limit, offset);
        break;
      case 'people':
        result = await findSimilarPeople(userVector, userId, limit, offset);
        break;
      default:
        throw new Error(`Unknown recommendation type: ${type}`);
    }
    
    return {
      success: true,
      data: result.recommendations,
      pagination: result.pagination,
      type: type,
      timestamp: new Date().toISOString()
    };
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

async function findSimilarConnections(userVector, userId, limit = 16, offset = 0) {
  try {
    // Parse the user vector if it's a string
    let parsedUserVector = userVector;
    if (typeof userVector === 'string') {
      try {
        parsedUserVector = JSON.parse(userVector);
      } catch (parseError) {
        throw new Error('Invalid user vector format');
      }
    }
    
    // Get existing connections for this user and total counts in parallel
    const [existingConnectionsResult, totalConnectionsResult] = await Promise.all([
      supabase
        .from('user_to_connections')
        .select('connection_id')
        .eq('user_id', userId),
      
      supabase
        .from('connections')
        .select('*', { count: 'exact', head: true })
    ]);

    if (existingConnectionsResult.error) {
      throw existingConnectionsResult.error;
    }

    if (totalConnectionsResult.error) {
      throw totalConnectionsResult.error;
    }

    const existingConnectionIds = existingConnectionsResult.data?.map(conn => conn.connection_id) || [];
    const totalConnections = totalConnectionsResult.count || 0;
    const availableConnections = totalConnections - existingConnectionIds.length;

    // Get ALL similarity-based recommendations
    const { data: similarEmbeddings, error: searchError } = await supabase.rpc('match_documents', {
      query_embedding: parsedUserVector,
      match_count: 1000, // Large enough to get all embeddings
      filter: {}
    });

    let embeddingBasedResults = [];
    
    if (!searchError && similarEmbeddings) {
      // Filter for connections and exclude user's existing connections
      const connectionEmbeddings = similarEmbeddings
        .filter(emb => emb.metadata?.type === 'connection')
        .filter(emb => {
          const connectionId = emb.metadata?.id || emb.id;
          return connectionId && !existingConnectionIds.includes(connectionId);
        });

      // Batch fetch all connection details in one query
      if (connectionEmbeddings.length > 0) {
        const connectionIds = connectionEmbeddings.map(emb => emb.metadata?.id || emb.id);
        
        const { data: connectionsData, error: connectionsError } = await supabase
          .from('connections')
          .select('*')
          .in('id', connectionIds);

        if (!connectionsError && connectionsData) {
          // Create a map for O(1) lookups
          const connectionsMap = connectionsData.reduce((map, conn) => {
            map[conn.id] = conn;
            return map;
          }, {});

          // Build results with connection data
          embeddingBasedResults = connectionEmbeddings
            .map(embedding => {
              const connectionId = embedding.metadata?.id || embedding.id;
              const connectionData = connectionsMap[connectionId];
              
              if (!connectionData) return null;
              
              return {
                id: connectionId,
                score: embedding.similarity,
                similarity: `${Math.round(embedding.similarity * 100)}%`,
                payload: {
                  id: connectionId,
                  name: connectionData.name,
                  email: connectionData.email,
                  role: connectionData.role,
                  company: connectionData.company,
                  location: connectionData.location,
                  interests: connectionData.interests,
                  type: 'connection'
                },
                source: 'embedding'
              };
            })
            .filter(Boolean); // Remove null results
        }
      }
    }

    // Get ALL remaining connections that don't have embeddings
    let additionalResults = [];
    const embeddingConnectionIds = embeddingBasedResults.map(r => r.id);
    const allExcludedIds = [...existingConnectionIds, ...embeddingConnectionIds];
    
    // Get all remaining connections (no artificial limit)
    if (allExcludedIds.length > 0) {
      const { data: additionalConnections, error: additionalError } = await supabase
        .from('connections')
        .select('*')
        .not('id', 'in', `(${allExcludedIds.map(id => `"${id}"`).join(',')})`)
        .limit(1000); // Large limit to get all remaining connections

      if (!additionalError && additionalConnections) {
        additionalResults = additionalConnections.map(conn => ({
          id: conn.id,
          score: 0, // Set to 0 for connections without embeddings (lowest similarity)
          similarity: '0%', 
          payload: {
            id: conn.id,
            name: conn.name,
            email: conn.email,
            role: conn.role,
            company: conn.company,
            location: conn.location,
            interests: conn.interests,
            type: 'connection'
          },
          source: 'database'
        }));
      }
    } else {
      // If no excluded IDs, get all connections
      const { data: additionalConnections, error: additionalError } = await supabase
        .from('connections')
        .select('*')
        .limit(1000); // Get all connections

      if (!additionalError && additionalConnections) {
        additionalResults = additionalConnections.map(conn => ({
          id: conn.id,
          score: 0,
          similarity: '0%',
          payload: {
            id: conn.id,
            name: conn.name,
            email: conn.email,
            role: conn.role,
            company: conn.company,
            location: conn.location,
            interests: conn.interests,
            type: 'connection'
          },
          source: 'database'
        }));
      }
    }

    // Combine and sort ALL results by similarity score (highest first)
    const allResults = [...embeddingBasedResults, ...additionalResults];
    allResults.sort((a, b) => b.score - a.score);
    
    // Apply pagination to the complete sorted dataset
    const paginatedResults = allResults.slice(offset, offset + limit);
    const hasMore = allResults.length > offset + limit;

    return {
      recommendations: paginatedResults,
      pagination: {
        currentPage: Math.floor(offset / limit) + 1,
        totalResults: allResults.length,
        totalPages: Math.ceil(allResults.length / limit),
        hasMore: hasMore,
        currentCount: paginatedResults.length
      }
    };

  } catch (error) {
    throw new Error(`Connection search failed: ${error.message}`);
  }
}

async function findSimilarPeople(userVector, userId, limit = 16, offset = 0) {
  try {
    // Parse the user vector if it's a string
    let parsedUserVector = userVector;
    if (typeof userVector === 'string') {
      try {
        parsedUserVector = JSON.parse(userVector);
      } catch (parseError) {
        throw new Error('Invalid user vector format');
      }
    }

    const { data: similarEmbeddings, error: searchError } = await supabase.rpc('match_documents', {
      query_embedding: parsedUserVector,
      match_count: limit + offset + 10,
      filter: { profile_type: 'user' }
    });

    if (searchError) throw searchError;

    if (!similarEmbeddings || similarEmbeddings.length === 0) {
      return {
        recommendations: [],
        pagination: {
          currentPage: Math.floor(offset / limit) + 1,
          totalResults: 0,
          totalPages: 0,
          hasMore: false,
          currentCount: 0
        }
      };
    }

    const filteredResults = similarEmbeddings
      .filter(embedding => embedding.user_id !== userId)
      .slice(offset, offset + limit)
      .map(embedding => ({
        id: embedding.user_id,
        score: embedding.similarity,
        similarity: `${Math.round(embedding.similarity * 100)}%`,
        payload: embedding.metadata || {}
      }));

    return {
      recommendations: filteredResults,
      pagination: {
        currentPage: Math.floor(offset / limit) + 1,
        totalResults: filteredResults.length * 2,
        totalPages: Math.ceil((filteredResults.length * 2) / limit),
        hasMore: filteredResults.length === limit,
        currentCount: filteredResults.length
      }
    };
  } catch (error) {
    throw new Error(`People search failed: ${error.message}`);
  }
}
