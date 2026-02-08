import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { magicLink } from 'better-auth/plugins'
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
      plugins: [
        magicLink({
          sendMagicLink: async ({ email, url }) => {
            console.log(`\n[Magic Link] → ${email}\n${url}\n`)
          },
        }),
      ],
    })
  }
  return _auth
}
