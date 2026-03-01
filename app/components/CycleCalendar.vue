<script setup lang="ts">
const { toggleDate, deleteDate, isRecorded, predictions, getToday, periodDates } = useCycle()

const now = new Date()
const sheetMonth = ref(now.getMonth())
const sheetYear = ref(now.getFullYear())

const weekdayHeaders = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const monthNames = MONTHS_FULL.map(capitalize)
const todayStr = getToday()

const sheetMonthName = computed(() => `${monthNames[sheetMonth.value]} ${sheetYear.value}`)

const sheetDaysInMonth = computed(() => {
  return new Date(sheetYear.value, sheetMonth.value + 1, 0).getDate()
})

const sheetStartOffset = computed(() => {
  const firstDay = new Date(sheetYear.value, sheetMonth.value, 1).getDay()
  return firstDay === 0 ? 6 : firstDay - 1
})

function isDayRecorded(date: string): boolean {
  return isRecorded(date)
}

function isDayPredicted(date: string): boolean {
  return predictions.value.some(p => p.date === date)
}

function sheetPrev() {
  if (sheetMonth.value === 0) {
    sheetMonth.value = 11
    sheetYear.value--
  } else {
    sheetMonth.value--
  }
}

function sheetNext() {
  if (sheetMonth.value === 11) {
    sheetMonth.value = 0
    sheetYear.value++
  } else {
    sheetMonth.value++
  }
}

function sheetDayToDate(day: number): string {
  const m = String(sheetMonth.value + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${sheetYear.value}-${m}-${d}`
}

async function onSheetDayClick(day: number) {
  const date = sheetDayToDate(day)
  if (date > todayStr) return

  if (isRecorded(date)) {
    toggleDate(date)
    return
  }

  const monthPrefix = `${sheetYear.value}-${String(sheetMonth.value + 1).padStart(2, '0')}-`
  const existingInMonth = periodDates.value.find(d => d.startsWith(monthPrefix))
  if (existingInMonth) {
    await deleteDate(existingInMonth)
  }

  toggleDate(date)
}

function sheetDayClasses(day: number) {
  const date = sheetDayToDate(day)
  return {
    'calendar__day--recorded': isDayRecorded(date),
    'calendar__day--predicted': !isDayRecorded(date) && isDayPredicted(date),
    'calendar__day--today': date === todayStr,
    'calendar__day--future': date > todayStr,
  }
}
</script>

<template>
  <div class="calendar">
    <header class="calendar__header">
      <button class="calendar__nav" @click="sheetPrev">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 14L6 9L11 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <span class="calendar__title">{{ sheetMonthName }}</span>
      <button class="calendar__nav" @click="sheetNext">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M7 14L12 9L7 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </header>

    <div class="calendar__weekdays">
      <span v-for="(wd, i) in weekdayHeaders" :key="i" class="calendar__wd">{{ wd }}</span>
    </div>

    <div class="calendar__grid">
      <div v-for="n in sheetStartOffset" :key="'e-' + n" class="calendar__day calendar__day--empty" />
      <button
        v-for="day in sheetDaysInMonth"
        :key="day"
        class="calendar__day"
        :class="sheetDayClasses(day)"
        :disabled="sheetDayToDate(day) > todayStr"
        @click="onSheetDayClick(day)"
      >
        {{ day }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.calendar {
  flex: 1;
  min-height: 0;
  padding: var(--space-2) 0;
}

.calendar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.calendar__title {
  font-family: var(--font-heading);
  font-size: var(--text-base);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
}

.calendar__nav {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-out);
}

.calendar__nav:active {
  color: var(--color-accent);
}

.calendar__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: var(--space-2);
}

.calendar__wd {
  text-align: center;
  font-size: 11px;
  font-weight: var(--weight-semi);
  color: var(--color-text-muted);
}

.calendar__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.calendar__day {
  aspect-ratio: 1;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-primary);
  cursor: pointer;
  position: relative;
  transition: transform var(--duration-fast) var(--ease-out),
              background var(--duration-fast) var(--ease-out);
}

.calendar__day--empty {
  cursor: default;
}

.calendar__day--recorded {
  background: var(--color-accent);
  color: white;
  font-weight: var(--weight-bold);
  box-shadow: 0 2px 10px rgba(107, 91, 149, 0.35);
}

.calendar__day--predicted {
  background: rgba(107, 91, 149, 0.1);
  color: var(--color-accent);
  font-weight: var(--weight-semi);
}

.calendar__day--today:not(.calendar__day--recorded) {
  font-weight: var(--weight-bold);
  color: var(--color-accent);
}

.calendar__day--today:not(.calendar__day--recorded)::before {
  content: '';
  position: absolute;
  inset: 2px;
  border: 2px solid var(--color-accent);
  border-radius: 8px;
  opacity: 0.3;
}

.calendar__day--future {
  opacity: 0.25;
  cursor: default;
}

.calendar__day:not(.calendar__day--empty):not(.calendar__day--future):active {
  transform: scale(0.88);
}
</style>
