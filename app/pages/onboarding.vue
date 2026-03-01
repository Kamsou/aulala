<script setup lang="ts">
definePageMeta({ layout: false, pageTransition: false })

type Step = 'welcome' | 'remember' | 'date-picker' | 'no-worries' | 'ready'

const { toggleDate } = useCycle()
const { markDone } = useOnboarding()

const step = ref<Step>('welcome')
const selectedDay = ref<number | null>(null)
const selectedMonth = ref<number | null>(null)
const selectedYear = ref<number | null>(null)

const dotCount = 4
const currentYear = new Date().getFullYear()
const years = [currentYear, currentYear - 1]
const months = MONTHS_FULL.map((name, i) => ({ value: i, label: capitalize(name) }))
const today = (() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})()

const dotIndex = computed(() => {
  switch (step.value) {
    case 'welcome': return 0
    case 'remember': return 1
    case 'date-picker': return 2
    case 'no-worries': return 2
    case 'ready': return 3
  }
})

const daysInSelectedMonth = computed(() => {
  if (selectedMonth.value === null || selectedYear.value === null) return 31
  return new Date(selectedYear.value, selectedMonth.value + 1, 0).getDate()
})

const days = computed(() => Array.from({ length: daysInSelectedMonth.value }, (_, i) => i + 1))

const composedDate = computed(() => {
  if (selectedDay.value === null || selectedMonth.value === null || selectedYear.value === null) return ''
  const m = String(selectedMonth.value + 1).padStart(2, '0')
  const d = String(selectedDay.value).padStart(2, '0')
  return `${selectedYear.value}-${m}-${d}`
})

const isDateValid = computed(() => composedDate.value !== '' && composedDate.value <= today)

async function saveDate() {
  if (!composedDate.value) return
  await toggleDate(composedDate.value)
  step.value = 'ready'
}

function finish() {
  markDone()
  navigateTo('/')
}

watch([selectedMonth, selectedYear], () => {
  if (selectedDay.value !== null && selectedDay.value > daysInSelectedMonth.value) {
    selectedDay.value = daysInSelectedMonth.value
  }
})
</script>

<template>
  <div class="fixed inset-0 z-[1000] flex items-center justify-center p-5 bg-[#f4eff9] overflow-hidden">
    <div class="absolute -inset-[30%] blur-[40px] animate-[fadeIn_1.2s_ease_both]">
      <div class="blob blob--1" />
      <div class="blob blob--2" />
      <div class="blob blob--3" />
      <div class="blob blob--4" />
      <div class="blob blob--5" />
      <div class="blob blob--6" />
      <div class="blob blob--7" />
    </div>

    <Transition name="step" mode="out-in">
      <div v-if="step === 'welcome'" key="welcome" class="relative z-[1] flex flex-col items-center text-center gap-5 w-full max-w-[320px] stagger-children">
        <GouttyMascot mood="wave" :size="140" />
        <div>
          <h2 class="font-heading text-[clamp(2rem,7vw,2.5rem)] font-bold text-text-primary tracking-tight">Salut !</h2>
          <p class="text-base text-text-secondary leading-relaxed mt-2">
            Moi c'est <strong class="text-text-primary font-semibold">Goutty</strong>, je suis la pour t'aider a suivre ton cycle en toute simplicite
          </p>
        </div>
        <button class="btn-primary w-full" @click="step = 'remember'">Enchantee !</button>
      </div>

      <div v-else-if="step === 'remember'" key="remember" class="relative z-[1] flex flex-col items-center text-center gap-5 w-full max-w-[320px] stagger-children">
        <GouttyMascot mood="idle" :size="120" />
        <p class="text-base text-text-secondary leading-relaxed">
          Est-ce que tu te souviens de la date du <strong class="text-text-primary font-semibold">premier jour</strong> de tes dernieres regles ?
        </p>
        <div class="flex gap-3 w-full">
          <button class="btn-primary flex-1" @click="step = 'date-picker'">Oui, je sais !</button>
          <button class="btn-secondary flex-1" @click="step = 'no-worries'">Pas sure...</button>
        </div>
      </div>

      <div v-else-if="step === 'date-picker'" key="date-picker" class="relative z-[1] flex flex-col items-center text-center gap-5 w-full max-w-[320px] stagger-children">
        <GouttyMascot mood="celebrate" :size="120" />
        <p class="text-base text-text-secondary leading-relaxed">Super ! Selectionne la date du premier jour</p>
        <div class="flex gap-2 w-full">
          <select v-model="selectedDay" class="select-input flex-1">
            <option :value="null" disabled>Jour</option>
            <option v-for="d in days" :key="d" :value="d">{{ d }}</option>
          </select>
          <select v-model="selectedMonth" class="select-input flex-[1.4]">
            <option :value="null" disabled>Mois</option>
            <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
          </select>
          <select v-model="selectedYear" class="select-input flex-1">
            <option :value="null" disabled>Annee</option>
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
        <button class="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed" :disabled="!isDateValid" @click="saveDate">C'est bon !</button>
      </div>

      <div v-else-if="step === 'no-worries'" key="no-worries" class="relative z-[1] flex flex-col items-center text-center gap-5 w-full max-w-[320px] stagger-children">
        <GouttyMascot mood="reassure" :size="120" />
        <div>
          <p class="text-base text-text-secondary leading-relaxed">Aucun souci !</p>
          <p class="text-sm text-text-muted leading-relaxed mt-2">Tu pourras les noter a tout moment depuis l'ecran d'accueil</p>
        </div>
        <button class="btn-primary w-full" @click="step = 'ready'">J'ai compris</button>
      </div>

      <div v-else key="ready" class="relative z-[1] flex flex-col items-center text-center gap-5 w-full max-w-[320px] stagger-children">
        <GouttyMascot mood="celebrate" :size="150" />
        <div>
          <h2 class="font-heading text-[clamp(2rem,7vw,2.5rem)] font-bold text-text-primary tracking-tight">C'est parti !</h2>
          <p class="text-sm text-text-muted leading-relaxed mt-2">Goutty est prete a t'accompagner</p>
        </div>
        <button class="btn-primary w-full" @click="finish">Commencer</button>
      </div>
    </Transition>

    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1] flex items-center gap-2">
      <span
        v-for="i in dotCount"
        :key="i"
        class="block rounded-full transition-all duration-300"
        :class="i - 1 === dotIndex ? 'w-6 h-2 bg-accent' : 'w-2 h-2 bg-accent/20'"
      />
    </div>
  </div>
</template>

<style scoped>
.btn-primary {
  padding: 1rem;
  font-size: 1rem;
  font-weight: var(--weight-semi);
  color: white;
  border-radius: var(--radius-lg);
  background: var(--gradient-accent);
  box-shadow: 0 4px 16px rgba(107, 91, 149, 0.25);
  transition: transform var(--duration-fast) var(--ease-out), opacity var(--duration-fast) var(--ease-out);
}

.btn-primary:active { transform: scale(0.97); opacity: 0.9; }

.btn-secondary {
  padding: 1rem;
  font-size: 1rem;
  font-weight: var(--weight-semi);
  color: var(--color-text-secondary);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(107, 91, 149, 0.12);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: transform var(--duration-fast) var(--ease-out), opacity var(--duration-fast) var(--ease-out);
}

.btn-secondary:active { transform: scale(0.97); opacity: 0.9; }

.select-input {
  padding: 1rem 0.75rem;
  font-family: var(--font-body);
  font-size: 1rem;
  text-align: center;
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(120, 90, 170, 0.15);
  border-radius: var(--radius-md);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  transition: border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
}

.select-input:focus {
  border-color: rgba(120, 90, 170, 0.35);
  box-shadow: 0 0 0 3px rgba(107, 91, 149, 0.08);
}

.blob { position: absolute; border-radius: 50%; }
.blob--1 { width: 80vw; height: 80vw; max-width: 550px; max-height: 550px; top: -25%; left: -20%; background: radial-gradient(circle, rgba(140, 90, 200, 0.65) 0%, transparent 60%); animation: drift1 20s ease-in-out infinite alternate; }
.blob--2 { width: 70vw; height: 70vw; max-width: 500px; max-height: 500px; bottom: -20%; right: -15%; background: radial-gradient(circle, rgba(210, 80, 120, 0.5) 0%, transparent 60%); animation: drift2 24s ease-in-out infinite alternate; }
.blob--3 { width: 55vw; height: 55vw; max-width: 400px; max-height: 400px; top: 45%; right: 0%; background: radial-gradient(circle, rgba(100, 70, 180, 0.4) 0%, transparent 60%); animation: drift3 18s ease-in-out infinite alternate; }
.blob--4 { width: 50vw; height: 50vw; max-width: 380px; max-height: 380px; bottom: 25%; left: 0%; background: radial-gradient(circle, rgba(220, 100, 140, 0.35) 0%, transparent 60%); animation: drift4 22s ease-in-out infinite alternate; }
.blob--5 { width: 45vw; height: 45vw; max-width: 350px; max-height: 350px; top: 10%; right: -10%; background: radial-gradient(circle, rgba(180, 60, 130, 0.35) 0%, transparent 60%); animation: drift1 16s ease-in-out 3s infinite alternate; }
.blob--6 { width: 60vw; height: 60vw; max-width: 420px; max-height: 420px; top: 60%; left: -20%; background: radial-gradient(circle, rgba(120, 80, 210, 0.3) 0%, transparent 60%); animation: drift3 26s ease-in-out 1s infinite alternate; }
.blob--7 { width: 40vw; height: 40vw; max-width: 300px; max-height: 300px; top: 20%; left: 30%; background: radial-gradient(circle, rgba(200, 70, 100, 0.25) 0%, transparent 55%); animation: drift2 14s ease-in-out 5s infinite alternate; }

.step-enter-active { transition: opacity 0.35s var(--ease-out), transform 0.35s var(--ease-out); }
.step-leave-active { transition: opacity 0.15s ease-in, transform 0.15s ease-in; }
.step-enter-from { opacity: 0; transform: translateY(16px) scale(0.98); }
.step-leave-to { opacity: 0; transform: translateY(-8px) scale(0.98); }

@keyframes drift1 { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(8vw, 6vh) scale(1.1); } }
@keyframes drift2 { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(-6vw, -8vh) scale(1.15); } }
@keyframes drift3 { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(-5vw, 5vh) scale(0.9); } }
@keyframes drift4 { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(7vw, -4vh) scale(1.05); } }
</style>
