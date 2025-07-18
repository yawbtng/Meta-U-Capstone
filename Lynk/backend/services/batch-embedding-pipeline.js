import { fetchAllUsers, fetchAllConnections } from "./data-fetch.js";
import { generateUserEmbeddingsBatch, generateConnectionEmbeddingsBatch, prepareUserMetadata, prepareConnectionMetadata, createVectorPoint, validateVectorPoint } from "./embedding-service.js";
// CHANGE: Import from new Supabase client instead of Qdrant
import { upsertVectorsBatch } from "./supabase-vector.js";

export async function processAllUserEmbeddings() {
  console.log('Starting user embeddings processing with Supabase...');
  const users = await fetchAllUsers();
  if (!users.length) {
    console.log("No users found.");
    return;
  }

  const batchResult = await generateUserEmbeddingsBatch(users);
  if (!batchResult.success) {
    console.error("Embedding batch failed:", batchResult.error);
    return;
  }

  const vectorPoints = [];
  batchResult.results.forEach((result, idx) => {
    if (result.success) {
      try {
        // CHANGE: Pass profile text to metadata preparation
        const metadata = prepareUserMetadata(users[idx], result.profileText);
        const point = createVectorPoint(result.embedding, metadata);
        const valid = validateVectorPoint(point);
        if (valid.success) {
          vectorPoints.push(point);
        } else {
          console.warn("Invalid vector point:", valid.error);
        }
      } catch (err) {
        console.warn("Error preparing vector point:", err.message);
      }
    } else {
      console.warn("Skipping user due to embedding error:", result.error);
    }
  });

  if (!vectorPoints.length) {
    console.log("No valid user vector points to upsert.");
    return;
  }

  // CHANGE: Now uses Supabase LangChain instead of Qdrant
  await upsertVectorsBatch(vectorPoints);
  console.log(`Upserted ${vectorPoints.length} user vectors to Supabase.`);
}

export async function processAllConnectionEmbeddings() {
  console.log('Starting connection embeddings processing with Supabase...');
  const connections = await fetchAllConnections();
  if (!connections.length) {
    console.log("No connections found.");
    return;
  }

  const batchResult = await generateConnectionEmbeddingsBatch(connections);
  if (!batchResult.success) {
    console.error("Connection embedding batch failed:", batchResult.error);
    return;
  }

  const vectorPoints = [];
  batchResult.results.forEach((result, idx) => {
    if (result.success) {
      try {
        // CHANGE: Pass profile text to metadata preparation
        const metadata = prepareConnectionMetadata(
          connections[idx], 
          connections[idx].user_ids,
          result.profileText
        );
        const point = createVectorPoint(result.embedding, metadata);
        const valid = validateVectorPoint(point);
        if (valid.success) {
          vectorPoints.push(point);
        } else {
          console.warn("Invalid connection vector point:", valid.error);
        }
      } catch (err) {
        console.warn("Error preparing connection vector point:", err.message);
      }
    } else {
      console.warn("Skipping connection due to embedding error:", result.error);
    }
  });

  if (!vectorPoints.length) {
    console.log("No valid connection vector points to upsert.");
    return;
  }

  // CHANGE: Now uses Supabase LangChain instead of Qdrant
  await upsertVectorsBatch(vectorPoints);
  console.log(`Upserted ${vectorPoints.length} connection vectors to Supabase.`);
}