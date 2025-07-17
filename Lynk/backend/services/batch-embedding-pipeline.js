import { fetchAllUsers } from "./data-fetch.js";
import { generateUserEmbeddingsBatch, prepareUserMetadata, createVectorPoint, validateVectorPoint } from "./embedding-service.js";
import { upsertVectorsBatch } from "./qdrant-client.js";

export async function processAllUserEmbeddings() {
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
        const metadata = prepareUserMetadata(users[idx]);
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

  await upsertVectorsBatch(vectorPoints);
  console.log(`Upserted ${vectorPoints.length} user vectors to Qdrant.`);
}

export async function processAllConnectionEmbeddings() {
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
        const metadata = prepareConnectionMetadata(connections[idx], connections[idx].user_ids);
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

  await upsertVectorsBatch(vectorPoints);
  console.log(`Upserted ${vectorPoints.length} connection vectors to Qdrant.`);
}
