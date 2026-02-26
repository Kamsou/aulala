export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400 })

  const sessionToken = getCookie(event, 'better-auth.session_token')
  if (!sessionToken) throw createError({ statusCode: 401 })

  const ok = completeBridge(id, sessionToken)
  if (!ok) throw createError({ statusCode: 404 })

  return { ok: true }
})
