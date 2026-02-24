export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login' || to.path === '/auth-redirect' || to.path.startsWith('/api/auth')) {
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

  if (import.meta.client) {
    const pendingToken = localStorage.getItem('auklm-ott')
    if (pendingToken) {
      localStorage.removeItem('auklm-ott')
      try {
        const res = await $fetch<{ user?: { id: string } }>('/api/auth/one-time-token/verify', {
          method: 'POST',
          body: { token: pendingToken },
        })
        if (res?.user) {
          sessionUser.value = res.user
          return
        }
      }
      catch {}
    }
  }

  return navigateTo('/login')
})
