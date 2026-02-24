import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { useDb } from './db'

let _auth: ReturnType<typeof betterAuth> | null = null

export function useAuth() {
  if (!_auth) {
    const config = useRuntimeConfig()
    const db = useDb()

    _auth = betterAuth({
      database: drizzleAdapter(db, { provider: 'sqlite' }),
      secret: config.betterAuth.secret,
      baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
      emailAndPassword: {
        enabled: false,
      },
      socialProviders: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID || '',
          clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        },
        apple: {
          clientId: process.env.APPLE_CLIENT_ID || '',
          clientSecret: process.env.APPLE_CLIENT_SECRET || '',
        },
      },
    })
  }
  return _auth
}
