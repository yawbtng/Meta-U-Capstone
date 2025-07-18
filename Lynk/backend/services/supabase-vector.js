import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
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
      // Test the connection by checking if table exists
      const { count, error } = await supabase
        .from('embeddings')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      
      console.log(' LangChain Supabase vector store ready');
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


