import { computed, ref } from 'vue'

export type DateString = string

export type Confidence = 'haute' | 'moyenne' | 'basse'

export interface CyclePrediction {
  date: DateString
  confidence: Confidence
}

export interface CycleEntry {
  date: DateString
  cycleDuration: number | null
}

export interface CycleStats {
  averageCycleLength: number | null
  nextPeriodDate: DateString | null
  daysUntilNext: number | null
  confidence: Confidence | null
  totalEntries: number
}

function parseDate(ds: DateString): Date {
  const parts = ds.split('-')
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
}

function formatDate(date: Date): DateString {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getToday(): DateString {
  return formatDate(new Date())
}

function daysBetween(a: DateString, b: DateString): number {
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.round(Math.abs(parseDate(b).getTime() - parseDate(a).getTime()) / msPerDay)
}

function addDays(ds: DateString, days: number): DateString {
  const date = parseDate(ds)
  date.setDate(date.getDate() + days)
  return formatDate(date)
}

const periodDates = ref<DateString[]>([])
const loading = ref(true)
let _fetched = false

async function fetchDates() {
  loading.value = true
  try {
    const data = await $fetch<DateString[]>('/api/dates')
    periodDates.value = data
  } catch {
    periodDates.value = []
  } finally {
    loading.value = false
  }
}

export function useCycle() {
  if (import.meta.client && !_fetched) {
    _fetched = true
    fetchDates()
  }

  const sortedDates = computed<DateString[]>(() => {
    return [...periodDates.value].sort()
  })

  const MIN_CYCLE_DAYS = 15
  const MAX_CYCLE_DAYS = 45

  function isTooClose(date: DateString): boolean {
    return periodDates.value.some(
      d => d !== date && daysBetween(d, date) < MIN_CYCLE_DAYS
    )
  }

  async function toggleDate(date: DateString): Promise<void> {
    if (periodDates.value.includes(date)) {
      periodDates.value = periodDates.value.filter(d => d !== date)
      try {
        await $fetch(`/api/dates/${date}`, { method: 'DELETE' })
      } catch {
        await fetchDates()
      }
    } else if (date <= getToday() && !isTooClose(date)) {
      periodDates.value = [...periodDates.value, date]
      try {
        await $fetch('/api/dates', { method: 'POST', body: { date } })
      } catch {
        await fetchDates()
      }
    }
  }

  async function deleteDate(date: DateString): Promise<void> {
    // Optimistic remove
    periodDates.value = periodDates.value.filter(d => d !== date)
    try {
      await $fetch(`/api/dates/${date}`, { method: 'DELETE' })
    } catch {
      // Revert on error
      await fetchDates()
    }
  }

  function isRecorded(date: DateString): boolean {
    return periodDates.value.includes(date)
  }

  const cycleGaps = computed<number[]>(() => {
    const dates = sortedDates.value
    if (dates.length < 2) return []
    const gaps: number[] = []
    for (let i = 1; i < dates.length; i++) {
      const gap = daysBetween(dates[i - 1]!, dates[i]!)
      if (gap >= MIN_CYCLE_DAYS && gap <= MAX_CYCLE_DAYS) gaps.push(gap)
    }
    return gaps
  })

  const averageCycleLength = computed<number | null>(() => {
    const gaps = cycleGaps.value
    if (gaps.length === 0) return null
    return Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length)
  })

  const confidence = computed<Confidence | null>(() => {
    const count = sortedDates.value.length
    if (count >= 4) return 'haute'
    if (count === 3) return 'moyenne'
    if (count === 2) return 'basse'
    return null
  })

  const predictions = computed<CyclePrediction[]>(() => {
    const avg = averageCycleLength.value
    const dates = sortedDates.value
    if (avg === null || dates.length < 2) return []

    const lastDate = dates[dates.length - 1]!
    const conf = confidence.value!

    return Array.from({ length: 6 }, (_, i) => ({
      date: addDays(lastDate, avg * (i + 1)),
      confidence: conf,
    }))
  })

  const daysUntilNext = computed<number | null>(() => {
    if (predictions.value.length === 0) return null
    const nextDate = predictions.value[0]!.date
    const today = getToday()
    return nextDate < today
      ? -daysBetween(nextDate, today)
      : daysBetween(today, nextDate)
  })

  const cycleProgress = computed<number | null>(() => {
    const avg = averageCycleLength.value
    const days = daysUntilNext.value
    if (avg === null || days === null) return null
    const elapsed = avg - days
    return Math.min(Math.max(elapsed / avg, 0), 1)
  })

  const currentCycleDay = computed<number | null>(() => {
    const avg = averageCycleLength.value
    const days = daysUntilNext.value
    if (avg === null || days === null) return null
    return avg - days
  })

  const history = computed<CycleEntry[]>(() => {
    const dates = sortedDates.value
    return dates.map((date, index) => ({
      date,
      cycleDuration: index > 0 ? daysBetween(dates[index - 1]!, date) : null,
    })).reverse()
  })

  const stats = computed<CycleStats>(() => ({
    averageCycleLength: averageCycleLength.value,
    nextPeriodDate: predictions.value.length > 0 ? predictions.value[0]!.date : null,
    daysUntilNext: daysUntilNext.value,
    confidence: confidence.value,
    totalEntries: periodDates.value.length,
  }))

  return {
    periodDates: sortedDates,
    loading,
    toggleDate,
    deleteDate,
    isRecorded,
    averageCycleLength,
    confidence,
    predictions,
    daysUntilNext,
    cycleProgress,
    currentCycleDay,
    history,
    stats,
    formatDate,
    parseDate,
    getToday,
    daysBetween,
  }
}
