import { eq, asc } from 'drizzle-orm'
import { periodDates } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const auth = useAuth()
  const session = await auth.api.getSession({ headers: event.headers })

  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Non authentifie' })
  }

  const db = useDb()
  const rows = await db
    .select({ date: periodDates.date })
    .from(periodDates)
    .where(eq(periodDates.userId, session.user.id))
    .orderBy(asc(periodDates.date))

  return rows.map(r => r.date)
})
