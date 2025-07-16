import { QdrantClient } from "@qdrant/js-client-rest";

const qdrantClient = new QdrantClient({
    url: import.meta.env.VITE_QDRANT_URL,
    apiKey: import.meta.env.VITE_QDRANT_API_KEY,
});

// Collection configuration
const COLLECTION_NAME = import.meta.env.VITE_QDRANT_COLLECTION_NAME;
const VECTOR_DIMENSIONS = 768; // For BAAI/bge-base-en-v1.5

// initializing the qdrant collection for storing people embeddings
export async function initializeCollection() {
    try {
      // Check if collection exists
      const collections = await qdrantClient.getCollections();
      const collectionExists = collections.collections.some(
        (col) => col.name === COLLECTION_NAME
      );
  
      if (!collectionExists) {
        console.log(`Creating collection: ${COLLECTION_NAME}`);
        
        await qdrantClient.createCollection(COLLECTION_NAME, {
          vectors: {
            size: VECTOR_SIZE,
            distance: "Cosine",
          },
        });
  
        // Create payload indexes for efficient filtering
        await qdrantClient.createPayloadIndex(COLLECTION_NAME, {
          field_name: "user_id",
          field_schema: "keyword",
        });
  
        await qdrantClient.createPayloadIndex(COLLECTION_NAME, {
          field_name: "profile_type",
          field_schema: "keyword",
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
      const info = await qdrantClient.getCollection(COLLECTION_NAME);
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
  
      if (!Array.isArray(vector) || vector.length !== VECTOR_SIZE) {
        throw new Error(`Vector must be an array of ${VECTOR_SIZE} dimensions`);
      }
  
      await qdrantClient.upsert(COLLECTION_NAME, {
        points: [
          {
            id: id,
            vector: vector,
            payload: payload,
          },
        ],
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
        if (!Array.isArray(point.vector) || point.vector.length !== VECTOR_SIZE) {
          throw new Error(`All vectors must be ${VECTOR_SIZE} dimensions`);
        }
      }
  
      await qdrantClient.upsert(COLLECTION_NAME, {
        points: points,
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
  
      await qdrantClient.delete(COLLECTION_NAME, {
        points: ids,
      });
  
      console.log(`Deleted ${ids.length} vectors successfully`);
      return true;
    } catch (error) {
      console.error(" Failed to delete vectors:", error);
      throw new Error(`Vector deletion failed: ${error.message}`);
    }
}

// Search for similar vectors using cosine similarity
export async function searchSimilarVectors(queryVector, limit = 10, filter = null, scoreThreshold = 0.7) {
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
  
      const results = await qdrantClient.search(COLLECTION_NAME, searchParams);
  
      console.info(`Found ${results.length} similar vectors with score >= ${scoreThreshold}`);
      
      return results;
    } catch (error) {
      console.error("Failed to search similar vectors:", error);
      throw new Error(`Vector search failed: ${error.message}`);
    }
  }


// Find people similar to a user 
export async function findSimilarPeople(userVector, userId, limit) {
    try {
      const filter = {
        must: [
          {
            key: "profile_type",
            match: { value: "user" }
          }
        ],
        // Exclude the user themselves and people they already know
        must_not: [
          {
            key: "user_id", 
            match: { value: userId }
          }
        ]
      };
  
      const results = await searchSimilarVectors(
        userVector, 
        limit, 
        filter, 
        0.6
      );
      
      return results.map((result) => ({
        id: result.id,
        score: result.score,
        payload: result.payload,
        similarity: `${Math.round(result.score * 100)}%`
      }));
    } catch (error) {
      console.error("Failed to find similar people:", error);
      throw new Error(`Similar people search failed: ${error.message}`);
    }
}

// Find connections similar to a user (connections belonging to OTHER users)
export async function findSimilarConnections(userVector, userId, limit) {
  try {
    const filter = {
      must: [
        {
          key: "profile_type",
          match: { value: "connection" }
        }
      ],
      must_not: [
        {
          key: "user_ids",
          match: { value: userId }
        }
      ]
    };

    const results = await searchSimilarVectors(
      userVector, 
      limit, 
      filter, 
      0.6
    );
    
    return results.map((result) => ({
      id: result.id,
      score: result.score,
      payload: result.payload,
      similarity: `${Math.round(result.score * 100)}%`
    }));
  } catch (error) {
    console.error("Failed to find similar connections:", error);
    throw new Error(`Similar connections search failed: ${error.message}`);
  }
}


export async function findPeopleWithCriteria(userVector, criteria, limit = 10) {
    try {
      const filter = {
        must: [
          { key: "profile_type", match: { value: "user" } }
        ]
      };
  
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
        { key: "user_id", match: { value: criteria.userId } }
      ];
  
      const results = await searchSimilarVectors(
        userVector,
        limit,
        filter,
        criteria.minScore || 0.5
      );
  
      return results.map(result => ({
        id: result.id,
        score: result.score,
        payload: result.payload,
        matchReason: generateMatchReason(result.score, criteria)
      }));
    } catch (error) {
      console.error("Failed to find people with criteria:", error);
      throw new Error(`Criteria search failed: ${error.message}`);
    }
}

export async function findConnectionsByCriteria(userVector, criteria, limit = 10) {
  try {
    const filter = {
      must: [
        { key: "profile_type", match: { value: "connection" } }
      ]
    };

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

    // Exclude connections that belong to the current user
    filter.must_not = [
      { key: "user_ids", match: { value: criteria.userId } }
    ];

    const results = await searchSimilarVectors(
      userVector,
      limit,
      filter,
      criteria.minScore || 0.5
    );

    return results.map(result => ({
      id: result.id,
      score: result.score,
      payload: result.payload,
      matchReason: generateMatchReason(result.score, criteria)
    }));
  } catch (error) {
    console.error("Failed to find connections by criteria:", error);
    throw new Error(`Connection criteria search failed: ${error.message}`);
  }
}


function generateMatchReason(score, criteria) {
    if (score >= 0.8) return "Very similar profile and interests";
    if (score >= 0.6) return "Similar background and industry";
    if (score >= 0.4) return "Some shared interests and experience";
    return "Matches your search criteria";
}