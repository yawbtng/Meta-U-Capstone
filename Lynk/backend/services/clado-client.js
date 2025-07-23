
const CLADO_API_KEY = import.meta.env?.VITE_CLADO_API_KEY;
const CLADO_API_URL = 'https://search.clado.ai/api/search/users';

/**
 * Search for users via Clado API
 */
export async function searchContactsViaClado(query, limit = 16) {
  if (!CLADO_API_KEY) {
    throw new Error('Clado API key is missing. Set VITE_CLADO_API_KEY in your environment.');
  }
  const url = `${CLADO_API_URL}?query=${encodeURIComponent(query)}&limit=${limit}`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${CLADO_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Clado API error: ${res.status} ${errorText}`);
  }
  return res.json();
} 