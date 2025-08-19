import { fetchAllUsers, fetchAllConnections } from "./data-fetch.js";
import { generateUserEmbeddingsBatch, generateConnectionEmbeddingsBatch, prepareUserMetadata, prepareConnectionMetadata, createVectorPoint, validateVectorPoint } from "./embedding-service.js";
import { upsertVectorsBatch } from "./supabase-vector.js";

export async function processAllUserEmbeddings() {
  const users = await fetchAllUsers();
  if (!users.length) {
    throw new Error("No users found for embedding processing.");
  }

  const batchResult = await generateUserEmbeddingsBatch(users);
  if (!batchResult.success) {
    throw new Error(`Embedding batch failed: ${batchResult.error}`);
  }

  const vectorPoints = [];
  batchResult.results.forEach((result, idx) => {
    if (result.success) {
      try {
        const metadata = prepareUserMetadata(users[idx], result.profileText);
        const point = createVectorPoint(result.embedding, metadata);
        const valid = validateVectorPoint(point);
        if (valid.success) {
          vectorPoints.push(point);
        } else {
          throw new Error(`Invalid vector point: ${valid.error}`);
        }
      } catch (err) {
        throw new Error(`Error preparing vector point: ${err.message}`);
      }
    } else {
      throw new Error(`Skipping user due to embedding error: ${result.error}`);
    }
  });

  if (!vectorPoints.length) {
    throw new Error("No valid user vector points to upsert.");
  }

  await upsertVectorsBatch(vectorPoints);
  return { success: true, count: vectorPoints.length };
}

export async function processAllConnectionEmbeddings() {
  const connections = await fetchAllConnections();
  if (!connections.length) {
    throw new Error("No connections found for embedding processing.");
  }

  const batchResult = await generateConnectionEmbeddingsBatch(connections);
  if (!batchResult.success) {
    throw new Error(`Connection embedding batch failed: ${batchResult.error}`);
  }

  const vectorPoints = [];
  batchResult.results.forEach((result, idx) => {
    if (result.success) {
      try {
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
          throw new Error(`Invalid connection vector point: ${valid.error}`);
        }
      } catch (err) {
        throw new Error(`Error preparing connection vector point: ${err.message}`);
      }
    } else {
      throw new Error(`Skipping connection due to embedding error: ${result.error}`);
    }
  });

  if (!vectorPoints.length) {
    throw new Error("No valid connection vector points to upsert.");
  }

  await upsertVectorsBatch(vectorPoints);
  return { success: true, count: vectorPoints.length };
}