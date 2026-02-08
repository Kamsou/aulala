import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'turso',
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dbCredentials: {
    url: process.env.NUXT_TURSO_DATABASE_URL!,
    authToken: process.env.NUXT_TURSO_AUTH_TOKEN!,
  },
})
