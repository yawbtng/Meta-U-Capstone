import { QdrantClient } from "@qdrant/js-client-rest";

const qdrantClient = new QdrantClient({
    url: import.meta.env.VITE_QDRANT_URL,
    apiKey: import.meta.env.VITE_QDRANT_API_KEY,
});

// Collection configuration
const COLLECTION_NAME = 'lynk-profiles';
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