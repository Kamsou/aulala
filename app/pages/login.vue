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
    <div class="login__card">
      <h1 class="login__brand">aulala</h1>
      <p class="login__subtitle">suivi de cycle</p>

      <div v-if="!sent" class="login__form">
        <p class="login__text">Entrez votre email pour recevoir un lien de connexion.</p>
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
        <p class="login__sent-title">Lien envoye</p>
        <p class="login__sent-text">
          Verifiez votre boite mail <strong>{{ email }}</strong> et cliquez sur le lien pour vous connecter.
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
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-5);
  background-color: var(--color-bg);
  background-image:
    radial-gradient(ellipse at 20% 50%, rgba(107, 91, 149, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(184, 169, 201, 0.06) 0%, transparent 50%);
}

.login__card {
  width: 100%;
  max-width: 360px;
  text-align: center;
}

.login__brand {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: var(--weight-bold);
  color: var(--color-accent);
  letter-spacing: -0.03em;
}

.login__subtitle {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: var(--space-8);
}

.login__text {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-5);
  line-height: var(--leading-relaxed);
}

.login__input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-out);
}

.login__input:focus {
  border-color: var(--color-accent-light);
}

.login__input::placeholder {
  color: var(--color-text-muted);
}

.login__button {
  width: 100%;
  margin-top: var(--space-3);
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--weight-semi);
  color: white;
  background: var(--gradient-accent);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: opacity var(--duration-fast) var(--ease-out),
              transform var(--duration-fast) var(--ease-out);
}

.login__button:active {
  transform: scale(0.98);
}

.login__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login__error {
  font-size: var(--text-xs);
  color: var(--color-warm-rose);
  margin-top: var(--space-3);
}

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

.login__retry {
  font-size: var(--text-xs);
  color: var(--color-accent);
  font-weight: var(--weight-medium);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
