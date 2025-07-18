import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { Document } from "@langchain/core/documents";
import { embeddings } from "./together-ai-client.js";
import { supabase } from "../browser-client.js";

const vectorStore = new SupabaseVectorStore(embeddings, {
  client: supabase,
  tableName: "embeddings",
  queryName: "match_documents",
});

export async function initializeCollection() {
  try {
    const { count, error } = await supabase
      .from('embeddings')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    
    console.log('LangChain Supabase vector store ready');
    return true;
  } catch (error) {
    console.error("Failed to initialize LangChain vector store:", error);
    throw new Error(`LangChain vector initialization failed: ${error.message}`);
  }
}

export async function getCollectionInfo() {
  try {
    const { count, error } = await supabase
      .from('embeddings')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    
    return {
      status: 'green',
      vectors_count: count,
      indexed_vectors_count: count,
      points_count: count,
      config: {
        params: {
          vectors: { size: 768, distance: 'Cosine' }
        }
      }
    };
  } catch (error) {
    console.error("Failed to get collection info:", error);
    throw error;
  }
}

export async function upsertVectorsBatch(points) {
  try {
    if (!Array.isArray(points) || points.length === 0) {
      throw new Error("Points must be a non-empty array");
    }

    const records = points.map(point => ({
      embedding: point.vector,
      content: point.payload.profile_text || point.payload.name || '',
      metadata: point.payload,
      profile_type: point.payload.type,
      user_id: point.payload.type === 'user' ? point.id : null,
      connection_id: point.payload.type === 'connection' ? point.id : null
    }));

    const { data, error } = await supabase
      .from('embeddings')
      .upsert(records, { ignoreDuplicates: false });

    if (error) throw error;

    console.log(`Upserted ${points.length} vectors using Supabase`);
    return true;
  } catch (error) {
    console.error("Failed to upsert vectors batch:", error);
    throw new Error(`Batch upsert failed: ${error.message}`);
  }
}

export async function upsertVector(id, vector, payload) {
  try {
    const record = {
      embedding: vector,
      content: payload.profile_text || payload.name || '',
      metadata: payload,
      profile_type: payload.type,
      user_id: payload.type === 'user' ? id : null,
      connection_id: payload.type === 'connection' ? id : null
    };
    
    const { data, error } = await supabase
      .from('embeddings')
      .upsert(record);

    if (error) throw error;
    
    console.log(`Upserted ${payload.type} vector with ID: ${id}`);
    return true;
  } catch (error) {
    console.error(`Failed to upsert vector ${id}:`, error);
    throw new Error(`Vector upsert failed: ${error.message}`);
  }
}

export async function deleteVectors(ids) {
  try {
    const { error } = await supabase
      .from('embeddings')
      .delete()
      .in('id', ids);

    if (error) throw error;

    console.log(`Deleted ${ids.length} vectors successfully`);
    return true;
  } catch (error) {
    console.error("Failed to delete vectors:", error);
    throw new Error(`Vector deletion failed: ${error.message}`);
  }
}

export async function searchSimilarVectors(queryVector, limit = 20, filter = null, scoreThreshold = 0.3) {
    try {
      let supabaseFilter = {};
      if (filter?.must) {
        for (const condition of filter.must) {
          if (condition.key === 'profile_type' || condition.key === 'type') {
            supabaseFilter.type = condition.match.value;
          }
        }
      }
  
      const { data, error } = await supabase.rpc('match_documents', {
        query_embedding: queryVector,
        match_count: limit,
        filter: supabaseFilter
      });
  
      if (error) throw error;
  
      const results = data
        .filter(row => row.similarity >= scoreThreshold)
        .map(row => ({
          id: row.id,
          score: row.similarity,
          payload: row.metadata,
          similarity: `${Math.round(row.similarity * 100)}%`
        }));
  
      console.log(`Found ${results.length} similar vectors`);
      return results;
    } catch (error) {
      console.error("Failed to search similar vectors:", error);
      throw new Error(`Vector search failed: ${error.message}`);
    }
  }
  
  export async function findSimilarPeople(userVector, userId, limit = 20, offset = 0) {
    const filter = {
      must: [{ key: "type", match: { value: "user" } }],
      must_not: [{ key: "user_id", match: { value: userId } }]
    };
  
    const results = await searchSimilarVectors(userVector, limit, filter, 0.1);
    
    return {
      recommendations: results,
      pagination: {
        currentPage: Math.floor(offset / limit) + 1,
        totalResults: results.length * 10,
        totalPages: Math.ceil((results.length * 10) / limit),
        hasMore: results.length === limit,
        currentCount: results.length
      }
    };
  }
  
  export async function findSimilarConnections(userVector, userId, limit = 20, offset = 0) {
    const filter = {
      must: [{ key: "type", match: { value: "connection" } }]
    };
  
    const results = await searchSimilarVectors(userVector, limit, filter, 0.1);
    
    return {
      recommendations: results,
      pagination: {
        currentPage: Math.floor(offset / limit) + 1,
        totalResults: results.length * 10,
        totalPages: Math.ceil((results.length * 10) / limit),
        hasMore: results.length === limit,
        currentCount: results.length
      }
    };
}

export async function findSimilarConnections(userVector, userId, limit = 20, offset = 0) {
  const filter = {
    must: [{ key: "type", match: { value: "connection" } }]
  };

  const results = await searchSimilarVectors(userVector, limit, filter, 0.6);
  
  return {
    recommendations: results,
    pagination: {
      currentPage: Math.floor(offset / limit) + 1,
      totalResults: results.length * 10,
      totalPages: Math.ceil((results.length * 10) / limit),
      hasMore: results.length === limit,
      currentCount: results.length
    }
  };
}

export async function getRecommendationsAPI({
  userVector,
  userId,
  type = 'people',
  limit = 20,
  offset = 0,
  criteria = {}
}) {
  try {
    let result;

    switch (type) {
      case 'people':
        result = await findSimilarPeople(userVector, userId, limit, offset);
        break;
      case 'connections':
        result = await findSimilarConnections(userVector, userId, limit, offset);
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
    console.error("Failed to get recommendations:", error);
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

export { vectorStore };
