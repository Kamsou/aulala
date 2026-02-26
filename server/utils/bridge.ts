const bridges = new Map<string, { token: string; expiresAt: number }>()

setInterval(() => {
  const now = Date.now()
  for (const [id, b] of bridges) {
    if (now > b.expiresAt) bridges.delete(id)
  }
}, 60_000)

export function createBridge(): string {
  const id = crypto.randomUUID()
  bridges.set(id, { token: '', expiresAt: Date.now() + 300_000 })
  return id
}

export function completeBridge(id: string, token: string): boolean {
  const bridge = bridges.get(id)
  if (!bridge || Date.now() > bridge.expiresAt) return false
  bridge.token = token
  return true
}

export function claimBridge(id: string): string | null {
  const bridge = bridges.get(id)
  if (!bridge || !bridge.token || Date.now() > bridge.expiresAt) return null
  const token = bridge.token
  bridges.delete(id)
  return token
}
