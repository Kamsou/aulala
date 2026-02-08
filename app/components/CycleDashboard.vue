<script setup lang="ts">
const {
  stats,
  daysUntilNext,
  averageCycleLength,
  confidence,
  cycleProgress,
  currentCycleDay,
  predictions,
  loading,
} = useCycle()

const frenchMonths = [
  'janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre',
]

const nextDateLabel = computed(() => {
  const first = predictions.value[0]
  if (!first) return ''
  const parts = first.date.split('-')
  const month = Number(parts[1])
  const day = Number(parts[2])
  return `${day} ${frenchMonths[month - 1]}`
})

const isLate = computed(() => (daysUntilNext.value ?? 0) < 0)
const displayDays = computed(() => Math.abs(daysUntilNext.value ?? 0))

const confidenceLabel = computed(() => {
  const labels: Record<string, string> = {
    haute: 'Haute',
    moyenne: 'Moyenne',
    basse: 'Basse',
  }
  return confidence.value ? labels[confidence.value] : ''
})

const arcPath = computed(() => {
  const p = cycleProgress.value ?? 0
  if (p <= 0) return ''
  const r = 70
  const cx = 80
  const cy = 80
  const startAngle = -Math.PI / 2
  const endAngle = startAngle + p * 2 * Math.PI
  const x1 = cx + r * Math.cos(startAngle)
  const y1 = cy + r * Math.sin(startAngle)
  const x2 = cx + r * Math.cos(endAngle)
  const y2 = cy + r * Math.sin(endAngle)
  const largeArc = p > 0.5 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`
})
</script>

<template>
  <section class="dashboard fade-in-up">
    <div v-if="loading" class="dashboard__loading">
      <div class="dashboard__loading-ring">
        <svg viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" fill="none" stroke="var(--color-border-subtle)" stroke-width="4" />
        </svg>
      </div>
      <p class="dashboard__loading-text">Chargement...</p>
    </div>

    <div v-else-if="predictions.length === 0" class="dashboard__empty">
      <p v-if="stats.totalEntries === 0" class="dashboard__empty-text">
        Enregistrez au moins 2 dates de regles pour obtenir une premiere estimation.
      </p>
      <p v-else class="dashboard__empty-text">
        Encore {{ stats.totalEntries === 1 ? '1 date' : 'des dates espacees' }} pour lancer les estimations.
      </p>
    </div>

    <div v-else class="dashboard__hero">
      <div class="dashboard__ring" :class="{ 'dashboard__ring--late': isLate }">
        <svg viewBox="0 0 160 160" class="dashboard__ring-svg">
          <circle
            cx="80" cy="80" r="70"
            fill="none"
            stroke="var(--color-border-subtle)"
            stroke-width="4"
          />
          <path
            v-if="arcPath"
            :d="arcPath"
            fill="none"
            :stroke="isLate ? 'var(--color-warm-rose)' : 'url(#progressGradient)'"
            stroke-width="4"
            stroke-linecap="round"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="var(--color-accent)" />
              <stop offset="100%" stop-color="var(--color-lilac)" />
            </linearGradient>
          </defs>
        </svg>
        <div class="dashboard__ring-content">
          <span class="dashboard__number" :class="{ 'dashboard__number--late': isLate }">{{ displayDays }}</span>
          <span class="dashboard__unit">{{ isLate ? 'jours de retard' : 'jours' }}</span>
        </div>
      </div>

      <p class="dashboard__context" :class="{ 'dashboard__context--late': isLate }">
        {{ isLate ? 'regles en retard' : 'avant vos prochaines regles' }}
      </p>
      <p v-if="nextDateLabel && !isLate" class="dashboard__next-date">{{ nextDateLabel }}</p>

      <div class="dashboard__meta">
        <div class="dashboard__chip">
          <span class="dashboard__chip-label">Cycle moyen</span>
          <span class="dashboard__chip-value">{{ averageCycleLength }}j</span>
        </div>
        <span class="dashboard__dot" />
        <div class="dashboard__chip">
          <span class="dashboard__chip-label">Jour</span>
          <span class="dashboard__chip-value">{{ currentCycleDay }}</span>
        </div>
        <span class="dashboard__dot" />
        <div class="dashboard__chip dashboard__chip--confidence" :class="`confidence--${confidence}`">
          <span class="dashboard__confidence-dot" />
          <span class="dashboard__chip-value">{{ confidenceLabel }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dashboard {
  padding: var(--space-6) 0 var(--space-2);
}

.dashboard__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-8) 0;
}

.dashboard__loading-ring {
  width: 160px;
  height: 160px;
  animation: pulse 1.5s ease-in-out infinite;
  opacity: 0.3;
}

.dashboard__loading-text {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.dashboard__empty {
  text-align: center;
  padding: var(--space-4) var(--space-6);
  border: 1px dashed var(--color-lilac);
  border-radius: var(--radius-lg);
  animation: breathe 3s ease-in-out infinite;
}

.dashboard__empty-text {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

@keyframes breathe {
  0%, 100% {
    border-color: var(--color-border-subtle);
    box-shadow: 0 0 0 0 transparent;
  }
  50% {
    border-color: var(--color-lilac);
    box-shadow: 0 0 12px -4px var(--color-lilac);
  }
}

.dashboard__hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.dashboard__ring {
  position: relative;
  width: 160px;
  height: 160px;
}

.dashboard__ring-svg {
  width: 100%;
  height: 100%;
  transform: rotate(0deg);
}

.dashboard__ring-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dashboard__number {
  font-family: var(--font-heading);
  font-size: 3rem;
  font-weight: var(--weight-bold);
  line-height: 1;
  color: var(--color-text-primary);
  letter-spacing: -0.03em;
}

.dashboard__unit {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-top: 2px;
}

.dashboard__context {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.dashboard__next-date {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-weight: var(--weight-medium);
  margin-top: calc(-1 * var(--space-1));
}

.dashboard__meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-1);
}

.dashboard__chip {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.dashboard__chip-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.dashboard__chip-value {
  font-size: var(--text-xs);
  font-weight: var(--weight-semi);
  color: var(--color-text-primary);
}

.dashboard__dot {
  width: 3px;
  height: 3px;
  border-radius: var(--radius-full);
  background: var(--color-text-muted);
  opacity: 0.4;
}

.dashboard__chip--confidence {
  gap: var(--space-1);
}

.dashboard__confidence-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.dashboard__ring--late .dashboard__ring-svg {
  filter: drop-shadow(0 0 8px rgba(201, 145, 158, 0.3));
}

.dashboard__number--late {
  color: var(--color-warm-rose);
}

.dashboard__context--late {
  color: var(--color-warm-rose);
  font-weight: var(--weight-medium);
}

.confidence--haute .dashboard__confidence-dot {
  background: #5cb176;
}

.confidence--moyenne .dashboard__confidence-dot {
  background: var(--color-lilac);
}

.confidence--basse .dashboard__confidence-dot {
  background: var(--color-warm-rose);
}
</style>
