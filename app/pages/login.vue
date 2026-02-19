<script setup lang="ts">
import { authClient } from '~/utils/auth-client'

definePageMeta({
  layout: false,
})

const email = ref('')
const sent = ref(false)
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  if (!email.value || loading.value) return
  loading.value = true
  error.value = ''

  const { error: authError } = await authClient.signIn.magicLink({
    email: email.value,
    callbackURL: '/',
  })

  loading.value = false

  if (authError) {
    error.value = 'Une erreur est survenue. Reessayez.'
    return
  }

  sent.value = true
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

      <div v-if="!sent" class="login__form">
        <p class="login__text">Entre ton email pour recevoir un lien de connexion.</p>
        <form @submit.prevent="handleSubmit">
          <input
            v-model="email"
            type="email"
            placeholder="email@exemple.com"
            class="login__input"
            autocomplete="email"
            required
          />
          <button
            type="submit"
            class="login__button"
            :disabled="loading || !email"
          >
            {{ loading ? 'Envoi...' : 'Recevoir le lien' }}
          </button>
        </form>
        <p v-if="error" class="login__error">{{ error }}</p>
      </div>

      <div v-else class="login__sent">
        <div class="login__sent-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="var(--color-accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <p class="login__sent-title">Lien envoyé</p>
        <p class="login__sent-text">
          Vérifie ta boite mail <strong>{{ email }}</strong> et clique sur le lien pour te connecter.
        </p>
        <button class="login__retry" @click="sent = false; email = ''">
          Utiliser une autre adresse
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

.login__text {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
  line-height: var(--leading-relaxed);
}

/* --- Input --- */
.login__input {
  width: 100%;
  padding: var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(120, 90, 170, 0.18);
  border-radius: var(--radius-md);
  outline: none;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: border-color var(--duration-fast) var(--ease-out),
              background var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}

.login__input:focus {
  border-color: rgba(120, 90, 170, 0.35);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 0 3px rgba(120, 90, 170, 0.1);
}

.login__input::placeholder {
  color: var(--color-text-muted);
}

/* --- Button --- */
.login__button {
  width: 100%;
  margin-top: var(--space-3);
  padding: var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--weight-semi);
  color: white;
  background: var(--color-accent);
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

.login__error {
  font-size: var(--text-xs);
  color: var(--color-warm-rose);
  margin-top: var(--space-3);
}

/* --- Sent state --- */
.login__sent {
  animation: fadeInUp var(--duration-normal) var(--ease-out) both;
}

.login__sent-icon {
  margin-bottom: var(--space-4);
}

.login__sent-title {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: var(--weight-semi);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.login__sent-text {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-6);
}

.login__sent-text strong {
  color: var(--color-text-primary);
  font-weight: var(--weight-semi);
}

.login__retry {
  font-size: var(--text-xs);
  color: var(--color-accent);
  font-weight: var(--weight-medium);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: rgba(107, 91, 149, 0.3);
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
