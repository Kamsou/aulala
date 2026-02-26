<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const bridgeId = String(route.query.bridge || '')
const done = ref(false)

onMounted(async () => {
  if (bridgeId) {
    try {
      await $fetch(`/api/auth/bridge/${bridgeId}/complete`, { method: 'POST' })
      done.value = true
    } catch {
      done.value = false
    }
  }
})
</script>

<template>
  <div class="callback">
    <div class="callback__card">
      <img src="/drop.svg" width="32" height="32" alt="" />
      <h1 class="callback__title">auklm</h1>
      <p v-if="done" class="callback__text">
        Connexion reussie !<br />
        Retourne sur l'app depuis ton ecran d'accueil.
      </p>
      <p v-else-if="!bridgeId" class="callback__text">
        Redirection...
      </p>
    </div>
  </div>
</template>

<style scoped>
.callback {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-5);
  background: #f4eff9;
}

.callback__card {
  text-align: center;
}

.callback__title {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  margin-top: var(--space-2);
}

.callback__text {
  margin-top: var(--space-4);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}
</style>
