// backend/seeds/seed.config.ts
import 'dotenv/config';
import { defineConfig } from '@snaplet/seed/config';
import { SeedPostgres } from '@snaplet/seed/adapter-postgres';
import postgres from 'postgres';

if (!process.env.SUPABASE_URL) throw new Error('Missing SUPABASE_URL');

export default defineConfig({
  adapter: () => new SeedPostgres(postgres(process.env.SUPABASE_URL!)),
});
