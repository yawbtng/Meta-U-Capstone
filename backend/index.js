import { createClient } from "@supabase/supabase-js"
import { config } from "dotenv";

config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);


// typeahead search
export async function fetchInitialContactsForSearch(firstChar) {
  const { data, error } = await supabase
    .from('connections')
    .select("*")
    .ilike('name', `${firstChar}%`);
  if (error) {
    console.error('Error fetching data:', error);
    return [];
  }
  return data;
}

