import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { emailOTP } from 'better-auth/plugins/email-otp'
import { Resend } from 'resend'
import { useDb } from './db'

let _auth: ReturnType<typeof betterAuth> | null = null

export function useAuth() {
  if (!_auth) {
    const config = useRuntimeConfig()
    const db = useDb()
    const resend = new Resend(String(config.resendApiKey))

    _auth = betterAuth({
      database: drizzleAdapter(db, { provider: 'sqlite' }),
      secret: config.betterAuth.secret,
      baseURL: process.env.BETTER_AUTH_URL,
      plugins: [
        emailOTP({
          otpLength: 6,
          expiresIn: 300,
          async sendVerificationOTP({ email, otp }) {
            await resend.emails.send({
              from: 'auklm <contact@auklm.com>',
              to: email,
              subject: 'Ton code de connexion',
              html: `<p>Ton code de connexion auklm : <strong>${otp}</strong></p><p>Ce code expire dans 5 minutes.</p>`,
            })
          },
        }),
      ],
    })
  }
  return _auth
}
