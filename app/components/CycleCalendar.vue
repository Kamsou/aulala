<script setup lang="ts">
const { toggleDate, deleteDate, isRecorded, predictions, getToday, periodDates } = useCycle()

const weekdayLetters = ['D', 'L', 'M', 'M', 'J', 'V', 'S']
const weekdayHeaders = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const monthNames = [
  'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
]

// ─── Ribbon ───
interface RibbonDay {
  date: string
  day: number
  month: number
  year: number
  weekday: string
  isMonday: boolean
  isFirstOfMonth: boolean
  monthLabel: string
}

const days = computed<RibbonDay[]>(() => {
  const today = new Date()
  const result: RibbonDay[] = []
  for (let offset = -60; offset <= 60; offset++) {
    const d = new Date(today)
    d.setDate(d.getDate() + offset)
    const year = d.getFullYear()
    const month = d.getMonth()
    const day = d.getDate()
    const dow = d.getDay()
    const m = String(month + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    result.push({
      date: `${year}-${m}-${dd}`,
      day,
      month,
      year,
      weekday: weekdayLetters[dow]!,
      isMonday: dow === 1,
      isFirstOfMonth: day === 1,
      monthLabel: `${monthNames[month]} ${year}`,
    })
  }
  return result
})

const todayStr = getToday()

function isDayRecorded(date: string): boolean {
  return isRecorded(date)
}

function isDayPredicted(date: string): boolean {
  return predictions.value.some(p => p.date === date)
}

function isFuture(date: string): boolean {
  return date > todayStr
}

function isDateToday(date: string): boolean {
  return date === todayStr
}

function onDayClick(date: string) {
  if (!isFuture(date)) {
    toggleDate(date)
  }
}

function getDayClasses(d: RibbonDay) {
  return {
    'ribbon__day--today': isDateToday(d.date),
    'ribbon__day--recorded': isDayRecorded(d.date),
    'ribbon__day--predicted': !isDayRecorded(d.date) && isDayPredicted(d.date),
    'ribbon__day--future': isFuture(d.date),
    'ribbon__day--week-start': d.isMonday,
  }
}

// ─── Scroll & Observers ───
const trackRef = ref<HTMLElement | null>(null)
const todayRef = ref<HTMLElement | null>(null)
const visibleMonth = ref('')
const showTodayBtn = ref(false)
const dayRefs = new Map<string, HTMLElement>()

function setDayRef(el: any, d: RibbonDay) {
  if (!el) return
  dayRefs.set(d.date, el)
  if (isDateToday(d.date)) todayRef.value = el
}

function scrollToToday() {
  todayRef.value?.scrollIntoView({ inline: 'center', behavior: 'smooth' })
}

let monthObserver: IntersectionObserver | null = null
let todayObserver: IntersectionObserver | null = null

onMounted(() => {
  nextTick(() => {
    todayRef.value?.scrollIntoView({ inline: 'center', behavior: 'instant' as ScrollBehavior })
  })

  if (trackRef.value) {
    monthObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const label = entry.target.getAttribute('data-month')
            if (label) visibleMonth.value = label
          }
        }
      },
      { root: trackRef.value, threshold: 0.5 },
    )

    todayObserver = new IntersectionObserver(
      (entries) => {
        showTodayBtn.value = !entries[0]?.isIntersecting
      },
      { root: trackRef.value, threshold: 0.1 },
    )

    nextTick(() => {
      days.value.forEach((d) => {
        const el = dayRefs.get(d.date)
        if (el && d.isFirstOfMonth) {
          el.setAttribute('data-month', d.monthLabel)
          monthObserver!.observe(el)
        }
      })
      if (todayRef.value) todayObserver!.observe(todayRef.value)
      const todayDay = days.value.find(d => d.date === todayStr)
      if (todayDay) visibleMonth.value = todayDay.monthLabel
    })
  }
})

onUnmounted(() => {
  monthObserver?.disconnect()
  todayObserver?.disconnect()
})

// ─── Bottom Sheet Calendar ───
const sheetOpen = ref(false)
const now = new Date()
const sheetMonth = ref(now.getMonth())
const sheetYear = ref(now.getFullYear())

const sheetMonthName = computed(() => `${monthNames[sheetMonth.value]} ${sheetYear.value}`)

const sheetDaysInMonth = computed(() => {
  return new Date(sheetYear.value, sheetMonth.value + 1, 0).getDate()
})

const sheetStartOffset = computed(() => {
  const firstDay = new Date(sheetYear.value, sheetMonth.value, 1).getDay()
  return firstDay === 0 ? 6 : firstDay - 1
})

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

  // If clicking an already recorded date, just deselect it
  if (isRecorded(date)) {
    toggleDate(date)
    return
  }

  // If another date is recorded in this month, delete it first (move operation)
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
    'sheet__day--recorded': isDayRecorded(date),
    'sheet__day--predicted': !isDayRecorded(date) && isDayPredicted(date),
    'sheet__day--today': date === todayStr,
    'sheet__day--future': date > todayStr,
  }
}

function openSheet() {
  sheetMonth.value = now.getMonth()
  sheetYear.value = now.getFullYear()
  sheetOpen.value = true
}
</script>

<template>
  <section class="ribbon">
    <button class="ribbon__month-btn" @click="openSheet">
      <span class="ribbon__month">{{ visibleMonth }}</span>
      <svg width="16" height="16" viewBox="0 0 14 14" fill="none" class="ribbon__month-icon">
        <path d="M4.5 2.5V4M9.5 2.5V4M2 6H12M3 3H11C11.5523 3 12 3.44772 12 4V11C12 11.5523 11.5523 12 11 12H3C2.44772 12 2 11.5523 2 11V4C2 3.44772 2.44772 3 3 3Z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <div ref="trackRef" class="ribbon__track">
      <button
        v-for="d in days"
        :key="d.date"
        :ref="(el: any) => setDayRef(el, d)"
        class="ribbon__day"
        :class="getDayClasses(d)"
        :disabled="isFuture(d.date)"
        @click="onDayClick(d.date)"
      >
        <span class="ribbon__weekday">{{ d.weekday }}</span>
        <span class="ribbon__num">{{ d.day }}</span>
        <span
          v-if="isDayRecorded(d.date) || isDayPredicted(d.date)"
          class="ribbon__dot"
          :class="{
            'ribbon__dot--recorded': isDayRecorded(d.date),
            'ribbon__dot--predicted': !isDayRecorded(d.date) && isDayPredicted(d.date),
          }"
        />
      </button>
    </div>

    <Transition name="fade">
      <button v-if="showTodayBtn" class="ribbon__today-btn" @click="scrollToToday">
        Aujourd'hui
      </button>
    </Transition>

    <!-- Bottom Sheet -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="sheetOpen" class="sheet__overlay" @click.self="sheetOpen = false">
          <div class="sheet__panel">
            <div class="sheet__handle" />

            <header class="sheet__header">
              <button class="sheet__nav" @click="sheetPrev">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M11 14L6 9L11 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <span class="sheet__title">{{ sheetMonthName }}</span>
              <button class="sheet__nav" @click="sheetNext">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M7 14L12 9L7 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </header>

            <div class="sheet__weekdays">
              <span v-for="(wd, i) in weekdayHeaders" :key="i" class="sheet__wd">{{ wd }}</span>
            </div>

            <div class="sheet__grid">
              <div v-for="n in sheetStartOffset" :key="'e-' + n" class="sheet__day sheet__day--empty" />
              <button
                v-for="day in sheetDaysInMonth"
                :key="day"
                class="sheet__day"
                :class="sheetDayClasses(day)"
                :disabled="sheetDayToDate(day) > todayStr"
                @click="onSheetDayClick(day)"
              >
                {{ day }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.ribbon {
  padding: var(--space-4) 0;
  position: relative;
}

.ribbon__month-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin: 0 auto var(--space-4);
  cursor: pointer;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  background: rgba(107, 91, 149, 0.07);
  transition: background var(--duration-fast) var(--ease-out);
}

.ribbon__month-btn:active {
  background: rgba(107, 91, 149, 0.14);
}

.ribbon__month {
  font-family: var(--font-heading);
  font-size: var(--text-base);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
}

.ribbon__month-icon {
  color: var(--color-accent);
}

.ribbon__track {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding: var(--space-2) var(--space-4);
  margin: 0 calc(-1 * var(--space-4));
  scrollbar-width: none;
}

.ribbon__track::-webkit-scrollbar {
  display: none;
}

.ribbon__day {
  flex-shrink: 0;
  width: 48px;
  height: 72px;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  background: rgba(0, 0, 0, 0.02);
  cursor: pointer;
  scroll-snap-align: center;
  position: relative;
  transition: transform var(--duration-fast) var(--ease-out),
              background var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}

.ribbon__day--week-start {
  margin-left: 8px;
}

.ribbon__weekday {
  font-size: 10px;
  font-weight: var(--weight-medium);
  color: var(--color-text-muted);
  line-height: 1;
}

.ribbon__num {
  font-size: var(--text-sm);
  font-weight: var(--weight-semi);
  color: var(--color-text-primary);
  line-height: 1;
}

.ribbon__dot {
  width: 4px;
  height: 4px;
  border-radius: var(--radius-full);
  position: absolute;
  bottom: 8px;
}

.ribbon__dot--recorded {
  background: white;
}

.ribbon__dot--predicted {
  background: var(--color-accent);
  opacity: 0.6;
}

.ribbon__day--recorded {
  background: var(--color-accent);
  box-shadow: 0 2px 12px rgba(107, 91, 149, 0.35);
}

.ribbon__day--recorded .ribbon__weekday {
  color: rgba(255, 255, 255, 0.7);
}

.ribbon__day--recorded .ribbon__num {
  color: white;
  font-weight: var(--weight-bold);
}

.ribbon__day--predicted {
  background: rgba(107, 91, 149, 0.08);
  border: 1.5px dashed rgba(107, 91, 149, 0.25);
}

.ribbon__day--predicted .ribbon__num {
  color: var(--color-accent);
  font-weight: var(--weight-semi);
}

.ribbon__day--today:not(.ribbon__day--recorded) {
  background: transparent;
  border: 2px solid var(--color-accent);
}

.ribbon__day--today:not(.ribbon__day--recorded) .ribbon__num {
  color: var(--color-accent);
  font-weight: var(--weight-bold);
}

.ribbon__day--future {
  opacity: 0.2;
  cursor: default;
}

.ribbon__day--future.ribbon__day--predicted {
  opacity: 0.6;
}

.ribbon__day:not(.ribbon__day--future):active {
  transform: scale(0.88);
}

/* Today button */
.ribbon__today-btn {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  font-weight: var(--weight-semi);
  color: var(--color-accent);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 6px 16px;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: opacity var(--duration-fast) var(--ease-out),
              transform var(--duration-fast) var(--ease-out);
  z-index: 2;
}

.ribbon__today-btn:active {
  transform: translateX(-50%) scale(0.95);
}

/* ─── Bottom Sheet ─── */
.sheet__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.sheet__panel {
  background: white;
  border-radius: 20px 20px 0 0;
  width: 100%;
  max-width: var(--max-width);
  padding: var(--space-3) var(--space-5) calc(var(--space-6) + var(--safe-area-bottom));
}

.sheet__handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.12);
  margin: 0 auto var(--space-4);
}

.sheet__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.sheet__title {
  font-family: var(--font-heading);
  font-size: var(--text-base);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
}

.sheet__nav {
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

.sheet__nav:active {
  color: var(--color-accent);
}

.sheet__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: var(--space-2);
}

.sheet__wd {
  text-align: center;
  font-size: 11px;
  font-weight: var(--weight-semi);
  color: var(--color-text-muted);
}

.sheet__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.sheet__day {
  aspect-ratio: 1;
  border-radius: 10px;
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

.sheet__day--empty {
  cursor: default;
}

.sheet__day--recorded {
  background: var(--color-accent);
  color: white;
  font-weight: var(--weight-bold);
  box-shadow: 0 2px 10px rgba(107, 91, 149, 0.35);
}

.sheet__day--predicted {
  background: rgba(107, 91, 149, 0.1);
  color: var(--color-accent);
  font-weight: var(--weight-semi);
}

.sheet__day--today:not(.sheet__day--recorded) {
  font-weight: var(--weight-bold);
  color: var(--color-accent);
}

.sheet__day--today:not(.sheet__day--recorded)::before {
  content: '';
  position: absolute;
  inset: 2px;
  border: 2px solid var(--color-accent);
  border-radius: 8px;
  opacity: 0.3;
}

.sheet__day--future {
  opacity: 0.25;
  cursor: default;
}

.sheet__day:not(.sheet__day--empty):not(.sheet__day--future):active {
  transform: scale(0.88);
}

/* ─── Transitions ─── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s var(--ease-out);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s var(--ease-out);
}

.sheet-enter-active .sheet__panel,
.sheet-leave-active .sheet__panel {
  transition: transform 0.3s var(--ease-out);
}

.sheet-enter-from {
  opacity: 0;
}

.sheet-enter-from .sheet__panel {
  transform: translateY(100%);
}

.sheet-leave-to {
  opacity: 0;
}

.sheet-leave-to .sheet__panel {
  transform: translateY(100%);
}
</style>
