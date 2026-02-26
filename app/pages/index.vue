<script setup lang="ts">
const activeTab = ref<'calendar' | 'history'>('calendar')
const slideDirection = ref<'left' | 'right'>('left')

function switchTab(tab: 'calendar' | 'history') {
  slideDirection.value = tab === 'history' ? 'left' : 'right'
  activeTab.value = tab
}
</script>

<template>
  <div class="page">
    <div class="page__header fade-in">
      <div class="page__brand">
        <img src="/drop.svg" width="14" height="14" alt="" class="page__brand-icon" />
        <span class="page__brand-name">auklm</span>
      </div>
    </div>

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

    <div class="page__content">
      <CycleDashboard />
      <Transition :name="'slide-' + slideDirection" mode="out-in">
        <CycleCalendar v-if="activeTab === 'calendar'" key="calendar" />
        <CycleHistory v-else key="history" />
      </Transition>
    </div>

  </div>
</template>

<style scoped>
.page {
  padding-top: calc(var(--safe-area-top) + var(--space-5));
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
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

.page__tabs {
  display: flex;
  gap: 0;
  background: rgba(107, 91, 149, 0.06);
  border: 1px solid rgba(107, 91, 149, 0.04);
  border-radius: var(--radius-sm);
  padding: 3px;
  flex-shrink: 0;
}

.page__tab {
  flex: 1;
  padding: var(--space-2) var(--space-4);
  font-weight: var(--weight-medium);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  transition: color var(--duration-fast) var(--ease-out),
              background var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
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
  box-shadow: 0 1px 4px rgba(30, 26, 42, 0.08),
              0 0 0 1px rgba(255, 255, 255, 0.8);
}

.page__content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.page__content::-webkit-scrollbar {
  display: none;
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

</style>
