// Use fetch-based client for browser compatibility
const QDRANT_URL = import.meta.env.VITE_QDRANT_URL;
const QDRANT_API_KEY = import.meta.env.VITE_QDRANT_API_KEY;

// Helper function for authenticated requests
async function qdrantRequest(endpoint, options = {}) {
  const url = `${QDRANT_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'api-key': QDRANT_API_KEY,
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    throw new Error(`Qdrant API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Collection configuration
const COLLECTION_NAME = import.meta.env.VITE_QDRANT_COLLECTION_NAME;
const VECTOR_DIMENSIONS = 768; // For BAAI/bge-base-en-v1.5

// initializing the qdrant collection for storing people embeddings
export async function initializeCollection() {
    try {
      // Check if collection exists
      const collections = await qdrantRequest('/collections');
      const collectionExists = collections.collections.some(
        (col) => col.name === COLLECTION_NAME
      );
  
      if (!collectionExists) {
        console.log(`Creating collection: ${COLLECTION_NAME}`);
        
        await qdrantRequest(`/collections/${COLLECTION_NAME}`, {
          method: 'PUT',
          body: JSON.stringify({
            vectors: {
              size: VECTOR_DIMENSIONS,
              distance: "Cosine",
            },
          })
        });
  
        // Create payload indexes for efficient filtering
        await qdrantRequest(`/collections/${COLLECTION_NAME}/index`, {
          method: 'PUT',
          body: JSON.stringify({
            field_name: "user_id",
            field_schema: "keyword",
          })
        });
  
        await qdrantRequest(`/collections/${COLLECTION_NAME}/index`, {
          method: 'PUT',
          body: JSON.stringify({
            field_name: "profile_type",
            field_schema: "keyword",
          })
        });
  
        console.log(`Collection ${COLLECTION_NAME} created successfully`);
      } else {
        console.log(`Collection ${COLLECTION_NAME} already exists`);
      }
  
      return true;
    } catch (error) {
      console.error("Failed to initialize Qdrant collection:", error);
      throw new Error(`Qdrant initialization failed: ${error.message}`);
    }
}

export async function getCollectionInfo() {
    try {
      const info = await qdrantRequest(`/collections/${COLLECTION_NAME}`);
      return info;
    } catch (error) {
      console.error(" Failed to get collection info:", error);
      throw error;
    }
}


// Upsert a single vector with necessary metadata
export async function upsertVector(id, vector, payload) {
    try {
      if (!id || !vector || !payload) {
        throw new Error("Missing required parameters: id, vector, or payload");
      }
  
      if (!Array.isArray(vector) || vector.length !== VECTOR_DIMENSIONS) {
        throw new Error(`Vector must be an array of ${VECTOR_DIMENSIONS} dimensions`);
      }
  
      await qdrantRequest(`/collections/${COLLECTION_NAME}/points`, {
        method: 'PUT',
        body: JSON.stringify({
          points: [
            {
              id: id,
              vector: vector,
              payload: payload,
            },
          ],
        })
      });
  
      console.log(`Upserted vector with ID: ${id}`);
      return true;
    } catch (error) {
      console.error(` Failed to upsert vector ${id}:`, error);
      throw new Error(`Vector upsert failed: ${error.message}`);
    }
}

export async function upsertVectorsBatch(points) {
    try {
      if (!Array.isArray(points) || points.length === 0) {
        throw new Error("Points must be a non-empty array");
      }
  
      // Validate all points
      for (const point of points) {
        if (!point.id || !point.vector || !point.payload) {
          throw new Error("Each point must have id, vector, and payload");
        }
        if (!Array.isArray(point.vector) || point.vector.length !== VECTOR_DIMENSIONS) {
          throw new Error(`All vectors must be ${VECTOR_DIMENSIONS} dimensions`);
        }
      }
  
      await qdrantRequest(`/collections/${COLLECTION_NAME}/points`, {
        method: 'PUT',
        body: JSON.stringify({
          points: points,
        })
      });
  
      console.log(`Upserted ${points.length} vectors successfully`);
      return true;
    } catch (error) {
      console.error(" Failed to upsert vectors batch:", error);
      throw new Error(`Batch upsert failed: ${error.message}`);
    }
}

export async function deleteVectors(ids) {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error("IDs must be a non-empty array");
      }
  
      await qdrantRequest(`/collections/${COLLECTION_NAME}/points/delete`, {
        method: 'POST',
        body: JSON.stringify({
          points: ids,
        })
      });
  
      console.log(`Deleted ${ids.length} vectors successfully`);
      return true;
    } catch (error) {
      console.error(" Failed to delete vectors:", error);
      throw new Error(`Vector deletion failed: ${error.message}`);
    }
}

// Search for similar vectors using cosine similarity
export async function searchSimilarVectors(queryVector, limit = 20, filter = null, scoreThreshold = 0.7) {
    try {
      if (!Array.isArray(queryVector) || queryVector.length !== VECTOR_DIMENSIONS) {
        throw new Error(`Query vector must be an array of ${VECTOR_DIMENSIONS} dimensions`);
      }
  
      const searchParams = {
        vector: queryVector,
        limit: limit,
        score_threshold: scoreThreshold,
        with_payload: true,
        with_vector: false
      };
  
      if (filter) {
        searchParams.filter = filter;
      }
  
      const results = await qdrantRequest(`/collections/${COLLECTION_NAME}/points/search`, {
        method: 'POST',
        body: JSON.stringify(searchParams)
      });
  
      console.info(`Found ${results.length} similar vectors with score >= ${scoreThreshold}`);
      
      return results;
    } catch (error) {
      console.error("Failed to search similar vectors:", error);
      throw new Error(`Vector search failed: ${error.message}`);
    }
  }


// Generic recommendation finder - single source of truth
export async function findRecommendations({
  userVector,
  filter,
  limit = 20,
  offset = 0
}) {
  try {
    if (!Array.isArray(userVector) || userVector.length !== VECTOR_DIMENSIONS) {
      throw new Error(`User vector must be an array of ${VECTOR_DIMENSIONS} dimensions`);
    }

    // Let Qdrant handle pagination efficiently
    const searchParams = {
      vector: userVector,
      filter: filter,
      limit: limit,
      offset: offset,
      score_threshold: 0.6,
      with_payload: true,
      with_vector: false
    };

    const results = await qdrantClient.search(COLLECTION_NAME, searchParams);

    const recommendations = results.map(hit => ({
      id: hit.id,
      score: hit.score,
      payload: hit.payload,
      similarity: `${Math.round(hit.score * 100)}%`
    }));

    // Get total count for pagination metadata
    const totalCount = await estimateTotalCount(filter);

    return {
      recommendations: recommendations,
      pagination: {
        currentPage: Math.floor(offset / limit) + 1,
        totalResults: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: results.length === limit && (offset + limit) < totalCount,
        currentCount: results.length
      }
    };
  } catch (error) {
    console.error("Recommendation search failed:", error);
    throw new Error(`Recommendation search failed: ${error.message}`);
  }
}

// Helper to get total count for a given filter
async function estimateTotalCount(filter) {
  try {
    const stats = await qdrantRequest(`/collections/${COLLECTION_NAME}/points/count`, {
      method: 'POST',
      body: JSON.stringify({
        filter: filter
      })
    });
    return stats.count;
  } catch (error) {
    console.error("Failed to get total count:", error);
    // Fallback: return a reasonable estimate
    return 1000;
  }
}

// Convenience functions that use the generic finder
export async function findSimilarPeople(userVector, userId, limit = 20, offset = 0) {
  return findRecommendations({
    userVector,
    filter: {
      must: [
        { key: "profile_type", match: { value: "user" } }
      ],
      must_not: [
        { key: "user_id", match: { value: userId } }
      ]
    },
    limit,
    offset
  });
}

export async function findSimilarConnections(userVector, userId, limit = 20, offset = 0) {
  return findRecommendations({
    userVector,
    filter: {
      must: [
        { key: "profile_type", match: { value: "connection" } }
      ],
      must_not: [
        { key: "user_ids", match: { value: userId } }
      ]
    },
    limit,
    offset
  });
}

export async function findConnectionsByCriteria(userVector, criteria, limit = 20, offset = 0) {
  const filter = {
    must: [
      { key: "profile_type", match: { value: "connection" } }
    ]
  };

  // Build dynamic filter based on criteria
  if (criteria.location) {
    filter.must.push({
      key: "location",
      match: { value: criteria.location }
    });
  }

  if (criteria.role) {
    filter.must.push({
      key: "role",
      match: { value: criteria.role }
    });
  }

  if (criteria.company) {
    filter.must.push({
      key: "company",
      match: { value: criteria.company }
    });
  }

  filter.must_not = [
    { key: "user_ids", match: { value: criteria.userId } }
  ];

  return findRecommendations({
    userVector,
    filter,
    limit,
    offset
  });
}

// Unified API function for all recommendation types
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
      case 'criteria':
        result = await findConnectionsByCriteria(userVector, { ...criteria, userId }, limit, offset);
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


function generateMatchReason(score, criteria) {
    if (score >= 0.8) return "Very similar profile and interests";
    if (score >= 0.6) return "Similar background and industry";
    if (score >= 0.4) return "Some shared interests and experience";
    return "Matches your search criteria";
}