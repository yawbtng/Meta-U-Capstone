import { createClient } from "@supabase/supabase-js"
import { config } from "dotenv";

config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);


async function main() {
  try {
    const { data, error } = await supabase.from("user_profiles").select('*');
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

main();