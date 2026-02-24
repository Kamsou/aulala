export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login' || to.path.startsWith('/api/auth')) {
    return
  }

  const sessionUser = useState<{ id: string } | null>('auth-user', () => null)

  if (import.meta.client && sessionUser.value) {
    return
  }

  const { data: session } = await useFetch<{ user?: { id: string } } | null>('/api/auth/get-session', {
    headers: useRequestHeaders(['cookie']),
  })

  if (session.value?.user) {
    sessionUser.value = session.value.user
    return
  }

  return navigateTo('/login')
})
