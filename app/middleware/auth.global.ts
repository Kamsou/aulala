export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith('/api/auth')) {
    return
  }

  const sessionUser = useState<{ id: string; email: string } | null>('auth-user', () => null)

  if (import.meta.client && sessionUser.value) {
    return to.path === '/login' ? navigateTo('/') : undefined
  }

  const session = await $fetch<{ user?: { id: string; email: string } } | null>('/api/auth/get-session', {
    headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined,
  }).catch(() => null)

  if (session?.user) {
    sessionUser.value = session.user
    return to.path === '/login' ? navigateTo('/') : undefined
  }

  if (to.path === '/login') return
  return navigateTo('/login')
})
