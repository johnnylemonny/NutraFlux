import { useEffect, useState } from 'react'

import { buildDemoEntries, createEntry, toRecentFood } from '@/lib/tracker'
import type { FoodSnapshot, MealKey, ThemePreference, TrackerState } from '@/types'

const STORAGE_KEY = 'nutraflux::tracker::v1'

const defaultState: TrackerState = {
  settings: {
    dailyTarget: 2100,
    themePreference: 'system',
    dismissedOnboarding: false,
    demoLoaded: false,
  },
  entries: [],
  recentFoods: [],
  favoriteFoodIds: ['overnight-oats', 'chicken-rice-bowl', 'salmon-potatoes'],
}

function isTrackerState(value: unknown): value is TrackerState {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as TrackerState

  return (
    Array.isArray(candidate.entries) &&
    Array.isArray(candidate.recentFoods) &&
    Array.isArray(candidate.favoriteFoodIds) &&
    typeof candidate.settings?.dailyTarget === 'number'
  )
}

function readInitialState() {
  if (typeof window === 'undefined') {
    return defaultState
  }

  const cached = window.localStorage.getItem(STORAGE_KEY)

  if (!cached) {
    return defaultState
  }

  try {
    const parsed = JSON.parse(cached)

    return isTrackerState(parsed)
      ? {
          ...defaultState,
          ...parsed,
          settings: {
            ...defaultState.settings,
            ...parsed.settings,
          },
        }
      : defaultState
  } catch {
    return defaultState
  }
}

export function useCalorieTracker() {
  const [state, setState] = useState<TrackerState>(() => readInitialState())
  const [lastAddedEntryId, setLastAddedEntryId] = useState<string | null>(null)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const addEntry = (input: { meal: MealKey; quantity: number; food: FoodSnapshot }) => {
    const entry = createEntry(input)

    setState((current) => ({
      ...current,
      entries: [entry, ...current.entries],
      recentFoods: [toRecentFood(input.food), ...current.recentFoods]
        .filter(
          (recent, index, collection) =>
            collection.findIndex(
              (candidate) =>
                candidate.name === recent.name &&
                candidate.servingLabel === recent.servingLabel,
            ) === index,
        )
        .slice(0, 8),
    }))
    setLastAddedEntryId(entry.id)

    return entry
  }

  const duplicateEntry = (input: { meal: MealKey; quantity: number; food: FoodSnapshot }) => {
    const duplicated = createEntry(input)

    setState((current) => ({
      ...current,
      entries: [duplicated, ...current.entries],
      recentFoods: [toRecentFood(input.food), ...current.recentFoods].slice(0, 8),
    }))
    setLastAddedEntryId(duplicated.id)

    return duplicated
  }

  const resetDay = () => {
    setState((current) => ({
      ...current,
      entries: [],
      settings: {
        ...current.settings,
        demoLoaded: false,
      },
    }))
    setLastAddedEntryId(null)
  }

  const loadDemoDay = () => {
    const demoStateEntries = buildDemoEntries()

    setState((current) => ({
      ...current,
      entries: demoStateEntries,
      recentFoods: demoStateEntries.map((entry) => toRecentFood(entry.food)).slice(0, 8),
      settings: {
        ...current.settings,
        demoLoaded: true,
      },
    }))
    setLastAddedEntryId(demoStateEntries[0]?.id ?? null)
  }

  const setDailyTarget = (dailyTarget: number) => {
    setState((current) => ({
      ...current,
      settings: {
        ...current.settings,
        dailyTarget,
      },
    }))
  }

  const setThemePreference = (themePreference: ThemePreference) => {
    setState((current) => ({
      ...current,
      settings: {
        ...current.settings,
        themePreference,
      },
    }))
  }

  const dismissOnboarding = () => {
    setState((current) => ({
      ...current,
      settings: {
        ...current.settings,
        dismissedOnboarding: true,
      },
    }))
  }

  const toggleFavorite = (foodId: string) => {
    setState((current) => {
      const isFavorite = current.favoriteFoodIds.includes(foodId)

      return {
        ...current,
        favoriteFoodIds: isFavorite
          ? current.favoriteFoodIds.filter((id) => id !== foodId)
          : [foodId, ...current.favoriteFoodIds].slice(0, 10),
      }
    })
  }

  const clearAnimationMarker = () => {
    setLastAddedEntryId(null)
  }

  return {
    state,
    lastAddedEntryId,
    addEntry,
    duplicateEntry,
    resetDay,
    loadDemoDay,
    setDailyTarget,
    setThemePreference,
    dismissOnboarding,
    toggleFavorite,
    clearAnimationMarker,
  }
}
