export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login' || to.path.startsWith('/api/auth')) {
    return
  }

  const { data: session } = await useFetch<{ user?: { id: string } } | null>('/api/auth/get-session', {
    headers: useRequestHeaders(['cookie']),
  })

  if (!session.value?.user) {
    return navigateTo('/login')
  }
})
