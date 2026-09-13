import { describe, expect, it } from 'vitest'
import {
  createEntry,
  createFoodSnapshot,
  formatMacroSummary,
  generateDailySummaryText,
  getDailyTotals,
  getMealSummaries,
  toRecentFood,
} from '@/lib/tracker'
import type { Entry, FoodItem } from '@/types'

describe('tracker math and utilities', () => {
  const sampleFood: FoodItem = {
    id: 'sample-oats',
    name: 'Steel-cut oats',
    category: 'Breakfast',
    mealHints: ['breakfast'],
    servingLabel: '1 bowl',
    calories: 250,
    macros: { protein: 10, carbs: 45, fat: 4 },
  }

  it('creates food snapshot with required fields', () => {
    const snapshot = createFoodSnapshot(sampleFood)
    expect(snapshot.sourceId).toBe('sample-oats')
    expect(snapshot.name).toBe('Steel-cut oats')
    expect(snapshot.calories).toBe(250)
    expect(snapshot.macros?.protein).toBe(10)
  })

  it('creates entry with safe quantity and total calories', () => {
    const snapshot = createFoodSnapshot(sampleFood)
    const entry = createEntry({
      meal: 'breakfast',
      quantity: 2,
      food: snapshot,
    })

    expect(entry.id).toBeDefined()
    expect(typeof entry.id).toBe('string')
    expect(entry.meal).toBe('breakfast')
    expect(entry.quantity).toBe(2)
    expect(entry.totalCalories).toBe(500)
    expect(entry.createdAt).toBeDefined()
  })

  it('handles fractional quantities properly', () => {
    const snapshot = createFoodSnapshot(sampleFood)
    const entry = createEntry({
      meal: 'lunch',
      quantity: 1.5,
      food: snapshot,
    })

    expect(entry.totalCalories).toBe(375)
  })

  it('converts snapshot to recent food with usedAt timestamp', () => {
    const snapshot = createFoodSnapshot(sampleFood)
    const recent = toRecentFood(snapshot)

    expect(recent.name).toBe(snapshot.name)
    expect(recent.usedAt).toBeDefined()
  })

  it('calculates daily totals and remaining calories correctly', () => {
    const entries: Entry[] = [
      {
        id: '1',
        meal: 'breakfast',
        quantity: 1,
        food: createFoodSnapshot(sampleFood),
        totalCalories: 300,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        meal: 'lunch',
        quantity: 1,
        food: createFoodSnapshot(sampleFood),
        totalCalories: 700,
        createdAt: new Date().toISOString(),
      },
    ]

    const totals = getDailyTotals(entries, 2000)
    expect(totals.consumed).toBe(1000)
    expect(totals.remaining).toBe(1000)
    expect(totals.progress).toBe(0.5)
  })

  it('handles target overshoot in totals', () => {
    const entries: Entry[] = [
      {
        id: '1',
        meal: 'dinner',
        quantity: 1,
        food: createFoodSnapshot(sampleFood),
        totalCalories: 2400,
        createdAt: new Date().toISOString(),
      },
    ]

    const totals = getDailyTotals(entries, 2000)
    expect(totals.consumed).toBe(2400)
    expect(totals.remaining).toBe(-400)
    expect(totals.progress).toBeGreaterThan(1)
  })

  it('groups entries into meal summaries', () => {
    const entries: Entry[] = [
      {
        id: '1',
        meal: 'breakfast',
        quantity: 1,
        food: createFoodSnapshot(sampleFood),
        totalCalories: 300,
        createdAt: '2026-09-13T08:00:00.000Z',
      },
      {
        id: '2',
        meal: 'breakfast',
        quantity: 1,
        food: createFoodSnapshot(sampleFood),
        totalCalories: 200,
        createdAt: '2026-09-13T09:00:00.000Z',
      },
    ]

    const summaries = getMealSummaries(entries)
    const breakfast = summaries.find((s) => s.key === 'breakfast')

    expect(breakfast).toBeDefined()
    expect(breakfast?.entries).toHaveLength(2)
    expect(breakfast?.totalCalories).toBe(500)
    expect(breakfast?.entries[0]?.id).toBe('2') // newest first
  })

  it('formats macro summary properly', () => {
    expect(formatMacroSummary({ protein: 30, carbs: 40, fat: 12 })).toBe('30P • 40C • 12F')
    expect(formatMacroSummary(undefined)).toBe('Calories only')
  })

  it('generates clean text for daily summary export', () => {
    const entries: Entry[] = [
      {
        id: '1',
        meal: 'breakfast',
        quantity: 1,
        food: createFoodSnapshot(sampleFood),
        totalCalories: 250,
        createdAt: new Date().toISOString(),
      },
    ]

    const summaryText = generateDailySummaryText(entries, 2000)
    expect(summaryText).toContain('NutraFlux Daily Summary')
    expect(summaryText).toContain('Target: 2000 kcal')
    expect(summaryText).toContain('Consumed: 250 kcal')
    expect(summaryText).toContain('Steel-cut oats')
    expect(summaryText).toContain('local-first nutritional momentum')
  })
})
