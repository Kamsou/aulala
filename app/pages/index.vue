<script setup lang="ts">
const activeTab = ref<'calendar' | 'history'>('calendar')
</script>

<template>
  <div class="page">
    <div class="page__brand fade-in">
      <span class="page__brand-name">aulala</span>
      <span class="page__brand-desc">suivi de cycle</span>
    </div>

    <CycleDashboard />

    <nav class="page__tabs">
      <button
        class="page__tab"
        :class="{ 'page__tab--active': activeTab === 'calendar' }"
        @click="activeTab = 'calendar'"
      >
        Calendrier
      </button>
      <button
        class="page__tab"
        :class="{ 'page__tab--active': activeTab === 'history' }"
        @click="activeTab = 'history'"
      >
        Historique
      </button>
    </nav>

    <Transition name="tab" mode="out-in">
      <CycleCalendar v-if="activeTab === 'calendar'" key="calendar" />
      <CycleHistory v-else key="history" />
    </Transition>
  </div>
</template>

<style scoped>
.page {
  padding-top: var(--space-8);
  padding-bottom: calc(var(--space-16) + var(--safe-area-bottom));
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-height: 100dvh;
}

.page__brand {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
}

.page__brand-name {
  font-family: var(--font-heading);
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  letter-spacing: 0.08em;
}

.page__brand-desc {
  font-size: 11px;
  color: var(--color-text-muted);
}

.page__tabs {
  display: flex;
  gap: var(--space-1);
  border-bottom: 1px solid var(--color-border-subtle);
  padding-bottom: 0;
}

.page__tab {
  flex: 1;
  padding: var(--space-3) var(--space-4);
  font-weight: var(--weight-medium);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  transition: color var(--duration-normal) var(--ease-out),
              box-shadow var(--duration-normal) var(--ease-out);
  min-height: var(--touch-min);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.page__tab--active {
  color: var(--color-text-primary);
}

.page__tab--active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: var(--space-4);
  right: var(--space-4);
  height: 2px;
  background: var(--color-accent);
  border-radius: 2px;
}

.tab-enter-active,
.tab-leave-active {
  transition: opacity var(--duration-normal) var(--ease-out),
              transform var(--duration-normal) var(--ease-out);
}

.tab-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.tab-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
