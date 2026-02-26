<script setup lang="ts">
import { authClient } from '~/utils/auth-client'

definePageMeta({
  layout: false,
  pageTransition: false,
})

const step = ref<1 | 2>(1)
const email = ref('')
const otp = ref('')
const loading = ref(false)
const { show } = useToast()

async function sendOtp() {
  if (!email.value) return
  loading.value = true
  try {
    await authClient.emailOtp.sendVerificationOtp({
      email: email.value,
      type: 'sign-in',
    })
    step.value = 2
  } catch {
    show('Impossible d\'envoyer le code, reessayez.')
  } finally {
    loading.value = false
  }
}

async function verifyOtp() {
  if (!otp.value) return
  loading.value = true
  try {
    const { error } = await authClient.signIn.emailOtp({
      email: email.value,
      otp: otp.value,
    })
    if (error) {
      show('Code invalide ou expire.')
      loading.value = false
      return
    }
    navigateTo('/')
  } catch {
    show('Verification impossible, reessayez.')
    loading.value = false
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

      <div v-if="step === 1" class="login__form">
        <input
          v-model="email"
          type="email"
          inputmode="email"
          autocomplete="email"
          placeholder="ton@email.com"
          class="login__input"
          :disabled="loading"
          @keydown.enter="sendOtp"
        />
        <button
          class="login__button login__button--primary"
          :disabled="loading || !email"
          @click="sendOtp"
        >
          {{ loading ? 'Envoi...' : 'Recevoir un code' }}
        </button>
      </div>

      <div v-else class="login__form">
        <p class="login__hint">
          Un code a ete envoye a <strong>{{ email }}</strong>
        </p>
        <input
          v-model="otp"
          type="tel"
          inputmode="numeric"
          pattern="[0-9]*"
          maxlength="6"
          placeholder="000000"
          class="login__input login__input--otp"
          :disabled="loading"
          @keydown.enter="verifyOtp"
        />
        <button
          class="login__button login__button--primary"
          :disabled="loading || !otp"
          @click="verifyOtp"
        >
          {{ loading ? 'Verification...' : 'Verifier' }}
        </button>
        <button
          class="login__link"
          :disabled="loading"
          @click="step = 1; otp = ''"
        >
          Changer d'email
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

.login__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.login__input {
  width: 100%;
  padding: var(--space-4) var(--space-5);
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(120, 90, 170, 0.15);
  border-radius: var(--radius-md);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}

.login__input:focus {
  border-color: rgba(120, 90, 170, 0.35);
  box-shadow: 0 0 0 3px rgba(107, 91, 149, 0.08);
}

.login__input::placeholder {
  color: var(--color-text-muted);
}

.login__input--otp {
  text-align: center;
  font-size: var(--text-xl);
  letter-spacing: 0.3em;
}

.login__hint {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

.login__button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-4);
  font-family: var(--font-body);
  font-size: 1rem;
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

.login__button--primary {
  color: white;
  background: var(--gradient-accent);
  box-shadow: 0 4px 16px rgba(107, 91, 149, 0.25);
}

.login__link {
  background: none;
  border: none;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.login__link:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

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
