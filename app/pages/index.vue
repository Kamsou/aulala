<script setup lang="ts">
const {
  predictions,
  daysUntilNext,
  stats,
  loading,
  averageCycleLength,
  confidence,
  currentCycleDay,
} = useCycle()
const { isDone: onboardingDone } = useOnboarding()

const showCalendar = ref(false)
const ready = ref(false)

const isLate = computed(() => (daysUntilNext.value ?? 0) < 0)
const displayDays = computed(() => Math.abs(daysUntilNext.value ?? 0))
const hasPredictions = computed(() => predictions.value.length > 0)

const nextDateLabel = computed(() => {
  const first = predictions.value[0]
  if (!first) return ''
  const parts = first.date.split('-')
  return `${Number(parts[2])} ${MONTHS_FULL[Number(parts[1]) - 1]}`
})

const confidenceLabel = computed(() => {
  const labels: Record<string, string> = { haute: 'Haute', moyenne: 'Moyenne', basse: 'Basse' }
  return confidence.value ? labels[confidence.value] : ''
})

const gouttyMood = computed<'idle' | 'wave' | 'celebrate' | 'reassure'>(() => {
  if (loading.value || !hasPredictions.value) return 'wave'
  const days = daysUntilNext.value ?? 0
  if (days < 0) return 'reassure'
  if (days <= 1) return 'celebrate'
  return 'idle'
})

const contextText = computed(() => {
  if (loading.value) return ''
  if (stats.value.totalEntries === 0) return 'Entre tes dates de regles pour que je puisse t\'aider'
  if (!hasPredictions.value) return 'Encore un peu de donnees et je pourrai faire des estimations'
  if (isLate.value) return 'pas de stress, chaque cycle est different'
  if (displayDays.value === 0) return 'tes regles devraient arriver aujourd\'hui'
  if (displayDays.value === 1) return 'tes regles arrivent demain'
  return `prochaines regles le ${nextDateLabel.value}`
})

onMounted(() => {
  if (!onboardingDone.value) {
    navigateTo('/onboarding')
    return
  }
  ready.value = true
})
</script>

<template>
  <div v-if="ready" class="flex flex-col items-center justify-center flex-1 min-h-0 pt-safe-top">
    <div class="flex flex-col items-center">
      <GouttyMascot :mood="gouttyMood" :size="140" class="anim-up" />

      <div v-if="loading" class="flex flex-col items-center gap-1 anim-up-d1">
        <span class="text-sm text-text-muted animate-pulse">Chargement...</span>
      </div>

      <div v-else-if="hasPredictions" class="flex flex-col items-center gap-1 anim-up-d1">
        <div class="flex items-baseline gap-2" :class="{ 'text-warm-rose': isLate }">
          <span class="font-heading text-5xl font-bold leading-none tracking-tighter">{{ displayDays }}</span>
          <span class="text-sm font-medium" :class="isLate ? 'text-warm-rose' : 'text-text-muted'">
            {{ isLate ? 'jours de retard' : displayDays <= 1 ? 'jour' : 'jours' }}
          </span>
        </div>
        <p class="text-sm text-text-secondary text-center mt-0.5">{{ contextText }}</p>
      </div>

      <div v-else class="flex flex-col items-center gap-1 anim-up-d1">
        <p class="text-sm text-text-muted text-center max-w-60 leading-relaxed">{{ contextText }}</p>
      </div>

      <div
        v-if="hasPredictions && !loading"
        class="flex items-center gap-3 px-5 py-3 mt-3 rounded-full bg-accent/[0.04] border border-accent/[0.06] anim-up-d2"
      >
        <div class="flex items-center gap-1">
          <span class="text-xs text-text-muted">Cycle moyen</span>
          <span class="text-xs font-bold text-text-primary">{{ averageCycleLength }}j</span>
        </div>
        <span class="w-[3px] h-[3px] rounded-full bg-text-muted/30" />
        <div class="flex items-center gap-1">
          <span class="text-xs text-text-muted">Jour</span>
          <span class="text-xs font-bold text-text-primary">{{ currentCycleDay }}</span>
        </div>
        <span class="w-[3px] h-[3px] rounded-full bg-text-muted/30" />
        <div class="flex items-center gap-1">
          <span
            class="w-[7px] h-[7px] rounded-full shrink-0"
            :class="{
              'bg-green-500': confidence === 'haute',
              'bg-accent': confidence === 'moyenne',
              'bg-warm-rose': confidence === 'basse',
            }"
          />
          <span class="text-xs font-bold text-text-primary">{{ confidenceLabel }}</span>
        </div>
      </div>

      <button
        class="flex items-center justify-center gap-2 px-5 py-3 mt-4 bg-accent text-white rounded-full text-sm font-semibold active:scale-[0.97] transition-transform anim-up-d2"
        @click="showCalendar = true"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" class="shrink-0">
          <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" stroke-width="1.4"/>
          <path d="M2 7H16" stroke="currentColor" stroke-width="1.4"/>
          <path d="M6 1V4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M12 1V4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
        <span>Enregistrer mes regles</span>
      </button>
    </div>

    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showCalendar" class="sheet-overlay" @click.self="showCalendar = false">
          <div class="sheet">
            <div class="w-9 h-1 rounded-full bg-black/10 mx-auto mb-3" />
            <CycleCalendar />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.pt-safe-top {
  padding-top: calc(env(safe-area-inset-top) + 1.25rem);
}

.anim-up { animation: fadeInUp 0.4s ease-out both; }
.anim-up-d1 { animation: fadeInUp 0.5s ease-out 0.1s both; }
.anim-up-d2 { animation: fadeInUp 0.5s ease-out 0.2s both; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
}

.sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.sheet {
  background: white;
  border-radius: 24px 24px 0 0;
  width: 100%;
  max-width: 430px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 0.5rem 1.25rem calc(env(safe-area-inset-bottom) + 1.25rem);
}

.sheet-enter-active,
.sheet-leave-active { transition: opacity 0.25s ease-out; }
.sheet-enter-active .sheet,
.sheet-leave-active .sheet { transition: transform 0.3s ease-out; }
.sheet-enter-from,
.sheet-leave-to { opacity: 0; }
.sheet-enter-from .sheet,
.sheet-leave-to .sheet { transform: translateY(100%); }
</style>
