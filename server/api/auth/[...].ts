export default defineEventHandler(async (event) => {
  const auth = useAuth()
  return auth.handler(toWebRequest(event))
})
