import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { magicLink } from 'better-auth/plugins'
import { Resend } from 'resend'
import { useDb } from './db'

let _auth: ReturnType<typeof betterAuth> | null = null

export function useAuth() {
  if (!_auth) {
    const config = useRuntimeConfig()
    const db = useDb()
    const resend = new Resend(config.resendApiKey)

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
            if (process.dev) {
              console.log(`\n[Magic Link] → ${email}\n${url}\n`)
              return
            }

            try {
              await resend.emails.send({
                from: 'auklm <noreply@auklm.com>',
                replyTo: 'camille.coutens@gmail.com',
                to: email,
                subject: 'Ton lien de connexion auklm',
                html: `
                  <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 400px; margin: 0 auto; padding: 40px 20px; text-align: center;">
                    <h1 style="font-size: 28px; font-weight: 700; color: #1e1a2a; letter-spacing: -0.02em; margin: 0;">auklm</h1>
                    <p style="font-size: 12px; color: #9e96ad; letter-spacing: 0.08em; margin: 4px 0 32px;">suivi de cycle</p>
                    <p style="font-size: 14px; color: #4a4458; line-height: 1.6; margin: 0 0 24px;">
                      Clique sur le bouton ci-dessous pour te connecter.
                    </p>
                    <a href="${url}" style="display: inline-block; padding: 14px 32px; background: #6b5b95; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">
                      Se connecter
                    </a>
                    <p style="font-size: 12px; color: #9e96ad; margin: 32px 0 0; line-height: 1.5;">
                      Si tu n'as pas demande ce lien, ignore cet email.
                    </p>
                  </div>
                `,
              })
            }
            catch (err) {
              console.error('[Magic Link] Erreur envoi email:', err)
              throw err
            }
          },
        }),
      ],
    })
  }
  return _auth
}
