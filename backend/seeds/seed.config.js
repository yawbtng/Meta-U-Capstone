import { SeedPostgres } from '@snaplet/seed/adapter-postgres'
import postgres from 'postgres'

export default {
  adapter: () =>
    new SeedPostgres(
      postgres(process.env.SUPABASE_URL)          // reads .env at runtime
    )
}
