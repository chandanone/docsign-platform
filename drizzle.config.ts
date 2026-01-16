import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql', // Use 'dialect' instead of 'driver'
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Use 'url' instead of 'connectionString'
  },
});