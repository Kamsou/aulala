<script setup lang="ts">
const { history, predictions, deleteDate } = useCycle()

const frenchMonths = [
  'jan.', 'fev.', 'mars', 'avr.', 'mai', 'juin',
  'juil.', 'aout', 'sept.', 'oct.', 'nov.', 'dec.',
]

function formatShortDate(ds: string): string {
  const parts = ds.split('-')
  const y = Number(parts[0])
  const m = Number(parts[1])
  const d = Number(parts[2])
  return `${d} ${frenchMonths[m - 1]} ${y}`
}
</script>

<template>
  <section class="hist fade-in-up">
    <p v-if="history.length === 0 && predictions.length === 0" class="hist__empty">
      Rien pour l'instant.
    </p>

    <div v-if="predictions.length > 0" class="hist__group">
      <span class="hist__label">Previsions</span>
      <ul class="hist__list">
        <li
          v-for="pred in predictions"
          :key="'p-' + pred.date"
          class="hist__row hist__row--prediction"
        >
          <span class="hist__date">{{ formatShortDate(pred.date) }}</span>
          <span class="hist__badge" :class="`hist__badge--${pred.confidence}`">
            {{ pred.confidence }}
          </span>
        </li>
      </ul>
    </div>

    <div v-if="history.length > 0" class="hist__group">
      <span class="hist__label">Dates enregistrees</span>
      <ul class="hist__list">
        <li
          v-for="entry in history"
          :key="'h-' + entry.date"
          class="hist__row"
        >
          <div class="hist__row-left">
            <span class="hist__dot" />
            <span class="hist__date">{{ formatShortDate(entry.date) }}</span>
            <span v-if="entry.cycleDuration" class="hist__gap">{{ entry.cycleDuration }}j</span>
          </div>
          <button
            class="hist__delete tap-target"
            aria-label="Supprimer"
            @click="deleteDate(entry.date)"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.hist {
  padding: var(--space-4) 0;
}

.hist__empty {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  text-align: center;
  padding: var(--space-8) 0;
}

.hist__group {
  margin-bottom: var(--space-6);
}

.hist__group:last-child {
  margin-bottom: 0;
}

.hist__label {
  display: block;
  font-size: 11px;
  font-weight: var(--weight-medium);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: var(--space-3);
}

.hist__list {
  display: flex;
  flex-direction: column;
}

.hist__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border-subtle);
}

.hist__row:last-child {
  border-bottom: none;
}

.hist__row-left {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.hist__dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background: var(--color-accent);
  flex-shrink: 0;
}

.hist__row--prediction .hist__date {
  color: var(--color-text-secondary);
}

.hist__date {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-primary);
}

.hist__gap {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  background: var(--color-bg-warm);
  padding: 1px var(--space-2);
  border-radius: var(--radius-full);
}

.hist__badge {
  font-size: 11px;
  font-weight: var(--weight-medium);
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  text-transform: capitalize;
}

.hist__badge--haute {
  background: rgba(92, 177, 118, 0.1);
  color: #3d8b55;
}

.hist__badge--moyenne {
  background: rgba(184, 169, 201, 0.2);
  color: var(--color-accent-dark);
}

.hist__badge--basse {
  background: rgba(201, 145, 158, 0.15);
  color: #8b5a6a;
}

.hist__delete {
  color: var(--color-text-muted);
  opacity: 0.5;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.hist__delete:active {
  opacity: 1;
  color: var(--color-accent);
}
</style>
