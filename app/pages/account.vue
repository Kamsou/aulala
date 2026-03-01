<script setup lang="ts">
import { authClient } from '~/utils/auth-client'

definePageMeta({
  layout: false,
})

const { averageCycleLength, confidence, stats } = useCycle()

const sessionUser = useState<{ id: string; email: string } | null>('auth-user')

const confidenceLabel = computed(() => {
  if (!confidence.value) return '--'
  return confidence.value.charAt(0).toUpperCase() + confidence.value.slice(1)
})

async function logout() {
  await authClient.signOut()
  sessionUser.value = null
  navigateTo('/login')
}
</script>

<template>
  <div class="account">
    <div class="account__banner">
      <div class="account__banner-bg" />
      <div class="account__avatar">
        <svg width="32" height="32" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="8.5" r="3.5" stroke="currentColor" stroke-width="1.4"/>
          <path d="M4.5 18.5C4.5 15.46 7.41 13 11 13C14.59 13 17.5 15.46 17.5 18.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      </div>
      <span class="account__email">{{ sessionUser?.email }}</span>
    </div>

    <div class="account__content">
      <div class="account__section">
        <span class="account__section-title">Mes statistiques</span>
        <div class="account__stats">
          <div class="account__stat">
            <div class="account__stat-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.4"/>
                <path d="M9 5v4l3 1.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="account__stat-info">
              <span class="account__stat-value">{{ averageCycleLength ?? '--' }}j</span>
              <span class="account__stat-label">Cycle moyen</span>
            </div>
          </div>
          <div class="account__stat">
            <div class="account__stat-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" stroke-width="1.4"/>
                <path d="M2 7h14" stroke="currentColor" stroke-width="1.4"/>
                <path d="M6 1v3M12 1v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="account__stat-info">
              <span class="account__stat-value">{{ stats.totalEntries }}</span>
              <span class="account__stat-label">Dates enregistrees</span>
            </div>
          </div>
          <div class="account__stat">
            <div class="account__stat-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2l2.1 4.3 4.7.7-3.4 3.3.8 4.7L9 12.7 4.8 15l.8-4.7L2.2 7l4.7-.7L9 2z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="account__stat-info">
              <span class="account__stat-value">{{ confidenceLabel }}</span>
              <span class="account__stat-label">Confiance</span>
            </div>
          </div>
        </div>
      </div>

      <button class="account__logout" @click="logout">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 14H3.33C2.6 14 2 13.4 2 12.67V3.33C2 2.6 2.6 2 3.33 2H6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10.67 11.33L14 8L10.67 4.67M14 8H6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Se deconnecter
      </button>
    </div>
  </div>
</template>

<style scoped>
.account {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.account__banner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: calc(var(--safe-area-top) + var(--space-10)) var(--space-6) var(--space-8);
  gap: var(--space-4);
}

.account__banner-bg {
  position: absolute;
  inset: 0;
  background: var(--gradient-accent);
  opacity: 0.10;
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
}

.account__avatar {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(107, 91, 149, 0.10);
  border: 2px solid rgba(107, 91, 149, 0.15);
  border-radius: var(--radius-full);
  color: var(--color-accent);
}

.account__email {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: var(--weight-semi);
  color: var(--color-text-primary);
  text-align: center;
  word-break: break-all;
}

.account__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  padding: var(--space-6) 0;
}

.account__section-title {
  display: block;
  font-size: 11px;
  font-weight: var(--weight-bold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: var(--space-4);
}

.account__stats {
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 12px rgba(30, 26, 42, 0.06),
              0 0 0 1px rgba(255, 255, 255, 0.5);
  overflow: hidden;
}

.account__stat {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
}

.account__stat + .account__stat {
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}

.account__stat-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(107, 91, 149, 0.07);
  border-radius: var(--radius-sm);
  color: var(--color-accent);
  flex-shrink: 0;
}

.account__stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.account__stat-value {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  line-height: 1.2;
}

.account__stat-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.account__logout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--weight-semi);
  color: var(--color-warm-rose);
  background: rgba(201, 145, 158, 0.08);
  border: 1px solid rgba(201, 145, 158, 0.12);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: opacity var(--duration-fast) var(--ease-out),
              transform var(--duration-fast) var(--ease-out);
}

.account__logout:active {
  opacity: 0.7;
  transform: scale(0.98);
}
</style>
