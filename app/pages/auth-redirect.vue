<script setup lang="ts">
import { authClient } from '~/utils/auth-client'

definePageMeta({
  layout: false,
})

const isStandalone = ref(false)

onMounted(async () => {
  isStandalone.value = window.matchMedia('(display-mode: standalone)').matches
    || (navigator as any).standalone === true

  if (isStandalone.value) {
    navigateTo('/')
    return
  }

  try {
    const { data } = await authClient.oneTimeToken.generate()
    if (data?.token) {
      localStorage.setItem('auklm-ott', data.token)
    }
  }
  catch {}
})
</script>

<template>
  <div class="redirect">
    <div class="redirect__card">
      <div class="redirect__icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#6b5b95" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <h1 class="redirect__title">Connexion reussie</h1>
      <p class="redirect__text">
        Tu peux retourner dans l'app auklm sur ton ecran d'accueil.
      </p>
      <a href="/" class="redirect__button">
        Ouvrir auklm
      </a>
    </div>
  </div>
</template>

<style scoped>
.redirect {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f4eff9;
}

.redirect__card {
  width: 100%;
  max-width: 340px;
  text-align: center;
}

.redirect__icon {
  margin-bottom: 16px;
  animation: scaleIn 0.4s ease both;
}

.redirect__title {
  font-size: 22px;
  font-weight: 700;
  color: #1e1a2a;
  letter-spacing: -0.02em;
  margin: 0 0 8px;
}

.redirect__text {
  font-size: 14px;
  color: #6b6480;
  line-height: 1.6;
  margin: 0 0 24px;
}

.redirect__button {
  display: inline-block;
  padding: 14px 32px;
  background: #6b5b95;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: opacity 0.2s;
}

.redirect__button:active {
  opacity: 0.85;
}

@keyframes scaleIn {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
