function shouldOnboard(): boolean {
  if (!import.meta.client) return false
  return localStorage.getItem('auklm-onboarding-done') !== '1'
}

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith('/api/auth')) {
    return
  }

  const sessionUser = useState<{ id: string; email: string } | null>('auth-user', () => null)

  if (import.meta.client && sessionUser.value) {
    if (to.path === '/login') {
      return navigateTo(shouldOnboard() ? '/onboarding' : '/')
    }
    if (to.path === '/' && shouldOnboard()) {
      return navigateTo('/onboarding')
    }
    return
  }

  const session = await $fetch<{ user?: { id: string; email: string } } | null>('/api/auth/get-session', {
    headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined,
  }).catch(() => null)

  if (session?.user) {
    sessionUser.value = session.user
    if (to.path === '/login') {
      return navigateTo('/')
    }
    if (to.path === '/onboarding') {
      return
    }
    return
  }

  if (to.path === '/login') return
  return navigateTo('/login')
})
