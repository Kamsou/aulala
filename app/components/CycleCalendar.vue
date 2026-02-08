<script setup lang="ts">
const { toggleDate, isRecorded, predictions, getToday } = useCycle()

const weekdays = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const monthNames = [
  'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
]

const now = new Date()
const currentMonth = ref(now.getMonth())
const currentYear = ref(now.getFullYear())

const monthName = computed(() => monthNames[currentMonth.value])

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

const startOffset = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay()
  return firstDay === 0 ? 6 : firstDay - 1
})

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function dayToDateString(day: number): string {
  const m = String(currentMonth.value + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${currentYear.value}-${m}-${d}`
}

function isDayRecorded(day: number): boolean {
  return isRecorded(dayToDateString(day))
}

function isDayPredicted(day: number): boolean {
  const ds = dayToDateString(day)
  return predictions.value.some(p => p.date === ds)
}

function isToday(day: number): boolean {
  return dayToDateString(day) === getToday()
}

function isFutureDay(day: number): boolean {
  return dayToDateString(day) > getToday()
}

function onDayClick(day: number) {
  if (!isFutureDay(day)) {
    toggleDate(dayToDateString(day))
  }
}

function getDayClasses(day: number) {
  return {
    'cal__day--today': isToday(day),
    'cal__day--recorded': isDayRecorded(day),
    'cal__day--predicted': !isDayRecorded(day) && isDayPredicted(day),
    'cal__day--future': isFutureDay(day),
  }
}
</script>

<template>
  <section class="cal fade-in-up">
    <header class="cal__header">
      <button class="cal__nav tap-target" aria-label="Mois precedent" @click="prevMonth">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 14L6 9L11 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <span class="cal__month">{{ monthName }} {{ currentYear }}</span>
      <button class="cal__nav tap-target" aria-label="Mois suivant" @click="nextMonth">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M7 14L12 9L7 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </header>

    <div class="cal__weekdays">
      <span v-for="(day, i) in weekdays" :key="i" class="cal__weekday">{{ day }}</span>
    </div>

    <div class="cal__grid">
      <div
        v-for="n in startOffset"
        :key="'e-' + n"
        class="cal__day cal__day--empty"
      />
      <button
        v-for="day in daysInMonth"
        :key="day"
        class="cal__day"
        :class="getDayClasses(day)"
        :disabled="isFutureDay(day)"
        @click="onDayClick(day)"
      >
        {{ day }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.cal {
  padding: var(--space-4) 0;
}

.cal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.cal__month {
  font-family: var(--font-heading);
  font-size: var(--text-base);
  font-weight: var(--weight-semi);
  color: var(--color-text-primary);
}

.cal__nav {
  color: var(--color-text-muted);
  border-radius: var(--radius-full);
  transition: color var(--duration-fast) var(--ease-out);
}

.cal__nav:active {
  color: var(--color-accent);
}

.cal__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: var(--space-2);
}

.cal__weekday {
  text-align: center;
  font-size: 11px;
  font-weight: var(--weight-medium);
  color: var(--color-text-muted);
}

.cal__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
}

.cal__day {
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  cursor: pointer;
  position: relative;
  transition: transform var(--duration-fast) var(--ease-out),
              background var(--duration-fast) var(--ease-out);
}

.cal__day--empty {
  cursor: default;
}

.cal__day--recorded {
  background: var(--gradient-period);
  color: white;
  font-weight: var(--weight-semi);
  box-shadow: 0 2px 8px rgba(107, 91, 149, 0.3);
}

.cal__day--predicted {
  background: var(--color-soft-violet);
  color: var(--color-accent-dark);
}

.cal__day--predicted::after {
  content: '';
  position: absolute;
  bottom: 3px;
  width: 4px;
  height: 4px;
  border-radius: var(--radius-full);
  background: var(--color-lilac);
}

.cal__day--today:not(.cal__day--recorded) {
  font-weight: var(--weight-bold);
  color: var(--color-accent);
}

.cal__day--today:not(.cal__day--recorded)::before {
  content: '';
  position: absolute;
  inset: 2px;
  border: 1.5px solid var(--color-accent);
  border-radius: var(--radius-sm);
  opacity: 0.4;
}

.cal__day--future {
  opacity: 0.3;
  cursor: default;
}

.cal__day:not(.cal__day--empty):not(.cal__day--future):active {
  transform: scale(0.88);
}
</style>
