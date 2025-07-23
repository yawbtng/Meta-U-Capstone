
const CLADO_API_KEY = import.meta.env?.VITE_CLADO_API_KEY;
const CLADO_API_URL = 'https://search.clado.ai/api/search/users';

/**
 * Search for users via Clado API
 */
export async function searchContactsViaClado(query, limit = 4) {
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

// --- LocalStorage Caching  ---
export function getCladoCacheKey(query) {
  return `clado_cache_${query.trim().toLowerCase()}`;
}

export function getCachedCladoResults(query, maxAgeMinutes = 1440) {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  const key = getCladoCacheKey(query);
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  try {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > maxAgeMinutes * 60 * 1000) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function setCachedCladoResults(query, data) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  const key = getCladoCacheKey(query);
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
}
