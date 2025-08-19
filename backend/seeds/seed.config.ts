// backend/seeds/seed.config.ts
import 'dotenv/config';
import { defineConfig } from '@snaplet/seed/config';
import { SeedPostgres } from '@snaplet/seed/adapter-postgres';
import postgres from 'postgres';


export default defineConfig({
  adapter: () => new SeedPostgres(postgres("POSTGRES_URL_HERE")),
});
