<script setup lang="ts">
const activeTab = ref<'calendar' | 'history'>('calendar')
const slideDirection = ref<'left' | 'right'>('left')
const showAbout = ref(false)

function switchTab(tab: 'calendar' | 'history') {
  slideDirection.value = tab === 'history' ? 'left' : 'right'
  activeTab.value = tab
}

async function logout() {
  await authClient.signOut()
  navigateTo('/login')
}
</script>

<template>
  <div class="page">
    <div class="page__header fade-in">
      <div class="page__brand">
        <img src="/drop.svg" width="14" height="14" alt="" class="page__brand-icon" />
        <span class="page__brand-name">auklm</span>
        <span class="page__brand-desc">suivi de cycle</span>
      </div>
      <button class="page__info-btn" @click="showAbout = true" aria-label="A propos">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="7.5" stroke="currentColor" stroke-width="1.3"/>
          <path d="M9 8V12.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          <circle cx="9" cy="5.75" r="0.75" fill="currentColor"/>
        </svg>
      </button>
    </div>

    <CycleDashboard />

    <nav class="page__tabs">
      <button
        class="page__tab"
        :class="{ 'page__tab--active': activeTab === 'calendar' }"
        @click="switchTab('calendar')"
      >
        Calendrier
      </button>
      <button
        class="page__tab"
        :class="{ 'page__tab--active': activeTab === 'history' }"
        @click="switchTab('history')"
      >
        Historique
      </button>
    </nav>

    <Transition :name="'slide-' + slideDirection" mode="out-in">
      <CycleCalendar v-if="activeTab === 'calendar'" key="calendar" />
      <CycleHistory v-else key="history" />
    </Transition>

    <Teleport to="body">
      <Transition name="about">
        <div v-if="showAbout" class="about__overlay" @click.self="showAbout = false">
          <div class="about__modal">
            <button class="about__close" @click="showAbout = false" aria-label="Fermer">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>

            <img src="/drop.svg" width="22" height="22" alt="" class="about__icon" />
            <h2 class="about__title">auklm</h2>
            <p class="about__subtitle">suivi de cycle</p>

            <p class="about__body">
              Suis ton cycle menstruel, enregistre tes dates et obtiens des estimations personnalisees.
            </p>

            <button class="about__logout" @click="logout">
              Se deconnecter
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.page {
  padding-top: var(--space-8);
  padding-bottom: calc(var(--space-16) + var(--safe-area-bottom));
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  min-height: 100dvh;
}

.page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page__brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.page__brand-icon {
  flex-shrink: 0;
}

.page__brand-name {
  font-family: var(--font-heading);
  font-size: var(--text-base);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
}

.page__brand-desc {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 0.08em;
}

.page__info-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-out),
              background var(--duration-fast) var(--ease-out);
}

.page__info-btn:active {
  color: var(--color-accent);
  background: rgba(107, 91, 149, 0.08);
}

.page__tabs {
  display: flex;
  gap: 0;
  background: rgba(0, 0, 0, 0.03);
  border-radius: var(--radius-sm);
  padding: 3px;
}

.page__tab {
  flex: 1;
  padding: var(--space-2) var(--space-4);
  font-weight: var(--weight-medium);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  transition: color var(--duration-fast) var(--ease-out),
              background var(--duration-fast) var(--ease-out);
  min-height: var(--touch-min);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 6px;
}

.page__tab--active {
  color: var(--color-text-primary);
  font-weight: var(--weight-semi);
  background: white;
  box-shadow: var(--shadow-sm);
}

/* ─── About Modal ─── */
.about__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}

.about__modal {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--space-8) var(--space-6) var(--space-6);
  max-width: 340px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.about__close {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-out);
}

.about__close:active {
  color: var(--color-text-primary);
}

.about__icon {
  display: block;
  margin: 0 auto var(--space-3);
  color: var(--color-accent);
}

.about__title {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
  text-align: center;
}

.about__subtitle {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 0.08em;
  text-align: center;
  margin-top: 2px;
}

.about__body {
  margin-top: var(--space-4);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  text-align: center;
}

.about__logout {
  margin-top: var(--space-5);
  width: 100%;
  padding: var(--space-3);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-out),
              background var(--duration-fast) var(--ease-out);
}

.about__logout:active {
  color: var(--color-warm-rose);
  background: rgba(201, 145, 158, 0.08);
}
</style>

<style>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: opacity 0.25s var(--ease-out),
              transform 0.25s var(--ease-out);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(24px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

/* About modal transition */
.about-enter-active,
.about-leave-active {
  transition: opacity 0.25s var(--ease-out);
}

.about-enter-active .about__modal,
.about-leave-active .about__modal {
  transition: transform 0.3s var(--ease-out), opacity 0.25s var(--ease-out);
}

.about-enter-from {
  opacity: 0;
}

.about-enter-from .about__modal {
  opacity: 0;
  transform: scale(0.92) translateY(12px);
}

.about-leave-to {
  opacity: 0;
}

.about-leave-to .about__modal {
  opacity: 0;
  transform: scale(0.92) translateY(12px);
}
</style>
