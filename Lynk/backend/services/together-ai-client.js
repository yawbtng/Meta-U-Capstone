import Together from 'together-ai';


const together = new Together({ apiKey: import.meta.env.VITE_TOGETHER_AI_API_KEY });


export async function generateEmbedding(
    text, model = 'togethercomputer/e5-mistral-7b-instruct') {
    if (!text || !text.trim()) {
      throw new Error('Text must be a non-empty string');
    }
    try {
      const { data } = await together.embeddings.create({
        model,
        input: [text.trim()],
      });
      if (!data?.[0]?.embedding) {
        throw new Error('Invalid response from Together AI');
      }
      return data[0].embedding;
    } catch (err) {
      throw new Error(`Together AI error: ${err.message}`);
    }
}

export async function generateEmbeddingsBatch(
    texts,
    model = 'togethercomputer/e5-mistral-7b-instruct') {
    const clean = texts.filter((t) => t && t.trim());
    if (!clean.length) throw new Error('No valid texts provided');
    try {
      const { data } = await together.embeddings.create({
        model,
        input: clean.map((t) => t.trim()),
      });
      return data.map((d) => d.embedding);
    } catch (err) {
      throw new Error(`Together AI error: ${err.message}`);
    }
}