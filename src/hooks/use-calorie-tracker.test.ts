import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useCalorieTracker } from '@/hooks/use-calorie-tracker'
import type { FoodSnapshot } from '@/types'

describe('useCalorieTracker hook', () => {
  const testFood: FoodSnapshot = {
    name: 'Avocado Salad',
    servingLabel: '1 bowl',
    calories: 320,
    macros: { protein: 4, carbs: 12, fat: 28 },
  }

  it('initializes with default state', () => {
    const { result } = renderHook(() => useCalorieTracker())

    expect(result.current.state.settings.dailyTarget).toBe(2100)
    expect(result.current.state.entries).toEqual([])
    expect(result.current.state.favoriteFoodIds.length).toBeGreaterThan(0)
  })

  it('adds an entry and registers it in recentFoods', () => {
    const { result } = renderHook(() => useCalorieTracker())

    act(() => {
      result.current.addEntry({
        meal: 'lunch',
        quantity: 1,
        food: testFood,
      })
    })

    expect(result.current.state.entries).toHaveLength(1)
    expect(result.current.state.entries[0]?.food.name).toBe('Avocado Salad')
    expect(result.current.state.entries[0]?.totalCalories).toBe(320)
    expect(result.current.state.recentFoods[0]?.name).toBe('Avocado Salad')
  })

  it('duplicates an entry', () => {
    const { result } = renderHook(() => useCalorieTracker())

    let firstEntryId = ''
    act(() => {
      const entry = result.current.addEntry({
        meal: 'lunch',
        quantity: 1,
        food: testFood,
      })
      firstEntryId = entry.id
    })

    act(() => {
      result.current.duplicateEntry({
        meal: 'lunch',
        quantity: 1,
        food: testFood,
      })
    })

    expect(result.current.state.entries).toHaveLength(2)
    expect(result.current.state.entries[0]?.id).not.toBe(firstEntryId)
  })

  it('deletes a specific entry by id', () => {
    const { result } = renderHook(() => useCalorieTracker())

    let entryToDeleteId = ''
    let entryToKeepId = ''

    act(() => {
      const e1 = result.current.addEntry({
        meal: 'breakfast',
        quantity: 1,
        food: { ...testFood, name: 'Breakfast item' },
      })
      const e2 = result.current.addEntry({
        meal: 'dinner',
        quantity: 1,
        food: { ...testFood, name: 'Dinner item' },
      })
      entryToKeepId = e1.id
      entryToDeleteId = e2.id
    })

    expect(result.current.state.entries).toHaveLength(2)

    act(() => {
      result.current.deleteEntry(entryToDeleteId)
    })

    expect(result.current.state.entries).toHaveLength(1)
    expect(result.current.state.entries[0]?.id).toBe(entryToKeepId)
    expect(result.current.state.entries[0]?.food.name).toBe('Breakfast item')
  })

  it('resets day while preserving settings and favorites', () => {
    const { result } = renderHook(() => useCalorieTracker())

    act(() => {
      result.current.setDailyTarget(2500)
      result.current.addEntry({
        meal: 'breakfast',
        quantity: 1,
        food: testFood,
      })
    })

    expect(result.current.state.entries).toHaveLength(1)
    expect(result.current.state.settings.dailyTarget).toBe(2500)

    act(() => {
      result.current.resetDay()
    })

    expect(result.current.state.entries).toHaveLength(0)
    expect(result.current.state.settings.dailyTarget).toBe(2500)
  })

  it('toggles favorite items', () => {
    const { result } = renderHook(() => useCalorieTracker())

    act(() => {
      result.current.toggleFavorite('custom-super-food')
    })

    expect(result.current.state.favoriteFoodIds).toContain('custom-super-food')

    act(() => {
      result.current.toggleFavorite('custom-super-food')
    })

    expect(result.current.state.favoriteFoodIds).not.toContain('custom-super-food')
  })
})
