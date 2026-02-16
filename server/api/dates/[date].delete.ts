import { eq, and } from 'drizzle-orm'
import { periodDates } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const auth = useAuth()
  const session = await auth.api.getSession({ headers: event.headers })

  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Non authentifie' })
  }

  const date = getRouterParam(event, 'date')

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw createError({ statusCode: 400, statusMessage: 'Format de date invalide' })
  }

  const parsed = new Date(date + 'T00:00:00')
  if (isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw createError({ statusCode: 400, statusMessage: 'Date invalide' })
  }

  const db = useDb()
  await db
    .delete(periodDates)
    .where(and(eq(periodDates.userId, session.user.id), eq(periodDates.date, date)))

  return { ok: true }
})
