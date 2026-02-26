<script setup lang="ts">
const visible = ref(false)

const isIos = computed(() => {
  if (!import.meta.client) return false
  const ua = navigator.userAgent
  return /iphone|ipad|ipod/i.test(ua)
})

const isAndroid = computed(() => {
  if (!import.meta.client) return false
  return /android/i.test(navigator.userAgent)
})

function isStandalone() {
  if (!import.meta.client) return false
  return window.matchMedia('(display-mode: standalone)').matches
    || (navigator as any).standalone === true
}

function dismiss() {
  visible.value = false
  localStorage.setItem('auklm-install-dismissed', '1')
}

onMounted(() => {
  if (isStandalone()) return
  if (localStorage.getItem('auklm-install-dismissed')) return
  if (!isIos.value && !isAndroid.value) return
  visible.value = true
})
</script>

<template>
  <Transition name="install-prompt">
    <div v-if="visible" class="install-prompt" @click.self="dismiss">
      <div class="install-prompt__sheet glass">
        <div class="install-prompt__handle" />

        <p class="install-prompt__title">Ajouter auklm à ton écran d'accueil</p>

        <div v-if="isIos" class="install-prompt__steps">
          <div class="install-prompt__step">
            <span class="install-prompt__step-num">1</span>
            <p>Appuie sur le bouton <strong>Partager</strong>
              <svg class="install-prompt__inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
              en bas de Safari
            </p>
          </div>
          <div class="install-prompt__step">
            <span class="install-prompt__step-num">2</span>
            <p>Fais défiler et appuie sur <strong>Sur l'écran d'accueil</strong></p>
          </div>
          <div class="install-prompt__step">
            <span class="install-prompt__step-num">3</span>
            <p>Confirme en appuyant sur <strong>Ajouter</strong></p>
          </div>
        </div>

        <div v-else class="install-prompt__steps">
          <div class="install-prompt__step">
            <span class="install-prompt__step-num">1</span>
            <p>Appuie sur le menu
              <svg class="install-prompt__inline-icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></svg>
              en haut à droite de Chrome
            </p>
          </div>
          <div class="install-prompt__step">
            <span class="install-prompt__step-num">2</span>
            <p>Appuie sur <strong>Ajouter à l'écran d'accueil</strong></p>
          </div>
          <div class="install-prompt__step">
            <span class="install-prompt__step-num">3</span>
            <p>Confirme en appuyant sur <strong>Ajouter</strong></p>
          </div>
        </div>

        <button class="install-prompt__btn" @click="dismiss">J'ai compris</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.install-prompt {
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  background: rgba(30, 26, 42, 0.3);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.install-prompt__sheet {
  width: 100%;
  max-width: var(--max-width);
  padding: var(--space-6) var(--space-6) calc(var(--space-8) + var(--safe-area-bottom));
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.install-prompt__handle {
  width: 36px;
  height: 4px;
  background: var(--color-text-muted);
  opacity: 0.3;
  border-radius: var(--radius-full);
  align-self: center;
}

.install-prompt__title {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: var(--weight-semi);
  color: var(--color-text-primary);
  text-align: center;
}

.install-prompt__steps {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.install-prompt__step {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}

.install-prompt__step-num {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: var(--gradient-period);
  color: white;
  font-size: var(--text-sm);
  font-weight: var(--weight-semi);
}

.install-prompt__step p {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  padding-top: var(--space-1);
}

.install-prompt__step strong {
  color: var(--color-text-primary);
  font-weight: var(--weight-semi);
}

.install-prompt__inline-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  vertical-align: text-bottom;
  color: var(--color-accent);
}

.install-prompt__btn {
  width: 100%;
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--gradient-period);
  color: white;
  font-weight: var(--weight-semi);
  font-size: var(--text-base);
  min-height: var(--touch-min);
  transition: opacity var(--duration-fast) var(--ease-out);
}

.install-prompt__btn:active {
  opacity: 0.85;
  transform: scale(0.98);
}

.install-prompt-enter-active,
.install-prompt-leave-active {
  transition: background var(--duration-normal) var(--ease-out);
}

.install-prompt-enter-active .install-prompt__sheet,
.install-prompt-leave-active .install-prompt__sheet {
  transition: transform var(--duration-normal) var(--ease-out),
              opacity var(--duration-normal) var(--ease-out);
}

.install-prompt-enter-from {
  background: transparent;
}
.install-prompt-enter-from .install-prompt__sheet {
  transform: translateY(100%);
  opacity: 0;
}

.install-prompt-leave-to {
  background: transparent;
}
.install-prompt-leave-to .install-prompt__sheet {
  transform: translateY(100%);
  opacity: 0;
}
</style>
