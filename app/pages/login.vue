<script setup lang="ts">
import { authClient } from '~/utils/auth-client'

definePageMeta({
  layout: false,
})

const loading = ref('')
const { show } = useToast()
const isStandalone = ref(false)

onMounted(() => {
  isStandalone.value = window.matchMedia('(display-mode: standalone)').matches
    || 'standalone' in window.navigator

  checkPendingBridge()
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', onVisibilityChange)
})

function onVisibilityChange() {
  if (document.visibilityState === 'visible') {
    checkPendingBridge()
  }
}

async function checkPendingBridge() {
  const bridgeId = localStorage.getItem('bridge_id')
  if (!bridgeId) return

  try {
    await $fetch(`/api/auth/bridge/${bridgeId}/claim`, { method: 'POST' })
    localStorage.removeItem('bridge_id')
    navigateTo('/')
  } catch {
    localStorage.removeItem('bridge_id')
  }
}

async function signIn(provider: 'google' | 'apple') {
  loading.value = provider

  if (isStandalone.value) {
    const { id } = await $fetch('/api/auth/bridge', { method: 'POST' })
    localStorage.setItem('bridge_id', id)
    await authClient.signIn.social({
      provider,
      callbackURL: `/auth-callback?bridge=${id}`,
    })
    return
  }

  const { error } = await authClient.signIn.social({
    provider,
    callbackURL: '/',
  })
  if (error) {
    show('Connexion impossible, reessayez plus tard.')
    loading.value = ''
  }
}
</script>

<template>
  <div class="login">
    <div class="login__bg">
      <div class="login__blob login__blob--1" />
      <div class="login__blob login__blob--2" />
      <div class="login__blob login__blob--3" />
      <div class="login__blob login__blob--4" />
      <div class="login__blob login__blob--5" />
      <div class="login__blob login__blob--6" />
      <div class="login__blob login__blob--7" />
    </div>

    <div class="login__card">
      <div class="login__brand-row">
        <h1 class="login__brand">auklm</h1>
        <img src="/drop.svg" width="24" height="24" alt="" class="login__icon" />
      </div>
      <p class="login__subtitle">suivi de cycle</p>

      <p class="login__about">
        Suis ton cycle menstruel, enregistre tes dates et obtiens des estimations personnalisees.
      </p>

      <div class="login__buttons">
        <button
          class="login__button login__button--google"
          :disabled="!!loading"
          @click="signIn('google')"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {{ loading === 'google' ? 'Connexion...' : 'Continuer avec Google' }}
        </button>

        <button
          class="login__button login__button--apple"
          :disabled="!!loading"
          @click="signIn('apple')"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          {{ loading === 'apple' ? 'Connexion...' : 'Continuer avec Apple' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login {
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-5);
  background: #f4eff9;
  overflow: hidden;
}

/* --- Blobs --- */
.login__bg {
  position: absolute;
  inset: -30%;
  filter: blur(40px);
  animation: fadeIn 1.2s ease both;
}

.login__blob {
  position: absolute;
  border-radius: 50%;
}

.login__blob--1 {
  width: 80vw;
  height: 80vw;
  max-width: 550px;
  max-height: 550px;
  top: -25%;
  left: -20%;
  background: radial-gradient(circle, rgba(140, 90, 200, 0.65) 0%, transparent 60%);
  animation: drift1 20s ease-in-out infinite alternate;
}

.login__blob--2 {
  width: 70vw;
  height: 70vw;
  max-width: 500px;
  max-height: 500px;
  bottom: -20%;
  right: -15%;
  background: radial-gradient(circle, rgba(210, 80, 120, 0.5) 0%, transparent 60%);
  animation: drift2 24s ease-in-out infinite alternate;
}

.login__blob--3 {
  width: 55vw;
  height: 55vw;
  max-width: 400px;
  max-height: 400px;
  top: 45%;
  right: 0%;
  background: radial-gradient(circle, rgba(100, 70, 180, 0.4) 0%, transparent 60%);
  animation: drift3 18s ease-in-out infinite alternate;
}

.login__blob--4 {
  width: 50vw;
  height: 50vw;
  max-width: 380px;
  max-height: 380px;
  bottom: 25%;
  left: 0%;
  background: radial-gradient(circle, rgba(220, 100, 140, 0.35) 0%, transparent 60%);
  animation: drift4 22s ease-in-out infinite alternate;
}

.login__blob--5 {
  width: 45vw;
  height: 45vw;
  max-width: 350px;
  max-height: 350px;
  top: 10%;
  right: -10%;
  background: radial-gradient(circle, rgba(180, 60, 130, 0.35) 0%, transparent 60%);
  animation: drift1 16s ease-in-out 3s infinite alternate;
}

.login__blob--6 {
  width: 60vw;
  height: 60vw;
  max-width: 420px;
  max-height: 420px;
  top: 60%;
  left: -20%;
  background: radial-gradient(circle, rgba(120, 80, 210, 0.3) 0%, transparent 60%);
  animation: drift3 26s ease-in-out 1s infinite alternate;
}

.login__blob--7 {
  width: 40vw;
  height: 40vw;
  max-width: 300px;
  max-height: 300px;
  top: 20%;
  left: 30%;
  background: radial-gradient(circle, rgba(200, 70, 100, 0.25) 0%, transparent 55%);
  animation: drift2 14s ease-in-out 5s infinite alternate;
}

/* --- Card --- */
.login__card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 340px;
  text-align: center;
  animation: fadeInUp 0.8s var(--ease-out) 0.15s both;
}

.login__brand-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.login__icon {
  flex-shrink: 0;
}

.login__brand {
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 8vw, 3.5rem);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  letter-spacing: -0.03em;
}

.login__subtitle {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 0.08em;
}

.login__about {
  margin-top: var(--space-4);
  margin-bottom: var(--space-10);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: var(--leading-relaxed);
}

/* --- Buttons --- */
.login__buttons {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.login__button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--weight-semi);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: opacity var(--duration-fast) var(--ease-out),
              transform var(--duration-fast) var(--ease-out);
}

.login__button:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.login__button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.login__button--google {
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(120, 90, 170, 0.18);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.login__button--apple {
  color: white;
  background: #1e1a2a;
}

/* --- Drift keyframes --- */
@keyframes drift1 {
  0%   { transform: translate(0, 0) scale(1); }
  100% { transform: translate(8vw, 6vh) scale(1.1); }
}

@keyframes drift2 {
  0%   { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-6vw, -8vh) scale(1.15); }
}

@keyframes drift3 {
  0%   { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-5vw, 5vh) scale(0.9); }
}

@keyframes drift4 {
  0%   { transform: translate(0, 0) scale(1); }
  100% { transform: translate(7vw, -4vh) scale(1.05); }
}
</style>
