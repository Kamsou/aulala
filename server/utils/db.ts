import { drizzle } from 'drizzle-orm/libsql'
import * as schema from '../db/schema'

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function useDb() {
  if (!_db) {
    const config = useRuntimeConfig()
    _db = drizzle({
      connection: {
        url: config.turso.databaseUrl,
        authToken: config.turso.authToken,
      },
      schema,
    })
  }
  return _db
}
