
const CLADO_API_KEY = import.meta.env?.VITE_CLADO_API_KEY;
const CLADO_API_URL = 'https://search.clado.ai/api/search/users';

import { supabase } from '../browser-client.js';

export const CLADO_DAILY_LIMIT = 3; // max # of queries per day

/**
 * Get the user's Clado query count for today (no increment)
 */
export async function getCladoQueryCount(userId) {
  const today = new Date().toISOString().slice(0, 10);
  let { data, error } = await supabase
    .from('clado_query_limits')
    .select('query_count')
    .eq('user_id', userId)
    .eq('query_date', today)
    .single();
  if (error && error.code !== 'PGRST116') {
    throw new Error('Failed to check rate limit: ' + error.message);
  }
  return data ? data.query_count : 0;
}

/**
 * Increment the user's Clado query count for today (call only on real API call)
 * Returns the new count
 */
export async function incrementCladoQueryCount(userId) {
  const today = new Date().toISOString().slice(0, 10);
  let { data, error } = await supabase
    .from('clado_query_limits')
    .select('query_count')
    .eq('user_id', userId)
    .eq('query_date', today)
    .single();
  if (error && error.code !== 'PGRST116') {
    throw new Error('Failed to check rate limit: ' + error.message);
  }
  let query_count = 1;
  if (data) {
    query_count = data.query_count + 1;
  }
  const { error: upsertError } = await supabase
    .from('clado_query_limits')
    .upsert([
      { user_id: userId, query_date: today, query_count }
    ], { onConflict: ['user_id', 'query_date'] });
  if (upsertError) throw new Error('Failed to update rate limit: ' + upsertError.message);
  return query_count;
}


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
