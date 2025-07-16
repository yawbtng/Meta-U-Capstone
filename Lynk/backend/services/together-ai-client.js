import { TogetherAIEmbeddings } from "@langchain/community/embeddings/togetherai";

// Initialize LangChain Together AI embeddings
const embeddings = new TogetherAIEmbeddings({
  model: "BAAI/bge-base-en-v1.5", // 768 dimensions
});

export const MODEL = 'BAAI/bge-base-en-v1.5';

export async function generateEmbedding(text, model = MODEL) {
  if (!text || !text.trim()) {
    throw new Error('Text must be a non-empty string');
  }
  
  try {
    // Use LangChain's embedQuery method for single text
    const embedding = await embeddings.embedQuery(text.trim());
    return embedding;
  } catch (err) {
    throw new Error(`Together AI error: ${err.message}`);
  }
}

export async function generateEmbeddingsBatch(texts, model = MODEL) {
  const clean = texts.filter((t) => t && t.trim());
  if (!clean.length) {
    throw new Error('No valid texts provided');
  }
  
  try {
    // Use LangChain's embedDocuments method for multiple texts
    const embeddingsArray = await embeddings.embedDocuments(clean.map((t) => t.trim()));
    return embeddingsArray;
  } catch (err) {
    throw new Error(`Together AI error: ${err.message}`);
  }
}

export { embeddings };