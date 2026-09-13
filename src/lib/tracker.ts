import { demoEntries, featuredFoodCatalog, mealMeta } from '@/data/foods'
import type {
  Entry,
  FoodItem,
  FoodSnapshot,
  MealKey,
  MealSummary,
  RecentFood,
} from '@/types'

function round(value: number) {
  return Math.round(value * 10) / 10
}

export function createFoodSnapshot(food: FoodItem): FoodSnapshot {
  return {
    sourceId: food.id,
    name: food.name,
    servingLabel: food.servingLabel,
    calories: food.calories,
    macros: food.macros,
    note: food.note,
  }
}

function generateEntryId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function createEntry(input: {
  meal: MealKey
  quantity: number
  food: FoodSnapshot
}): Entry {
  const quantity = Math.max(0.1, round(input.quantity || 1))
  const calories = Math.max(0, Number(input.food.calories) || 0)

  return {
    id: generateEntryId(),
    meal: input.meal,
    quantity,
    food: input.food,
    totalCalories: Math.round(calories * quantity),
    createdAt: new Date().toISOString(),
  }
}

export function toRecentFood(food: FoodSnapshot): RecentFood {
  return {
    ...food,
    usedAt: new Date().toISOString(),
  }
}

export function getDailyTotals(entries: Entry[], dailyTarget: number) {
  const consumed = entries.reduce((sum, entry) => sum + entry.totalCalories, 0)
  const remaining = dailyTarget - consumed
  const progress = dailyTarget > 0 ? Math.min(consumed / dailyTarget, 1.4) : 0

  return { consumed, remaining, progress }
}

export function getMealSummaries(entries: Entry[]): MealSummary[] {
  return Object.entries(mealMeta).map(([key, meta]) => {
    const mealEntries = entries
      .filter((entry) => entry.meal === key)
      .toSorted((left, right) => right.createdAt.localeCompare(left.createdAt))

    return {
      key: key as MealKey,
      label: meta.label,
      description: meta.description,
      entries: mealEntries,
      totalCalories: mealEntries.reduce((sum, entry) => sum + entry.totalCalories, 0),
    }
  })
}

export function formatMacroSummary(macros?: FoodSnapshot['macros']) {
  if (!macros) {
    return 'Calories only'
  }

  return `${macros.protein}P • ${macros.carbs}C • ${macros.fat}F`
}

export function getFoodById(foodId: string) {
  return featuredFoodCatalog.find((item: FoodItem) => item.id === foodId) ?? null
}

export function buildDemoEntries() {
  return demoEntries
    .map(({ meal, sourceId, quantity }) => {
      const food = getFoodById(sourceId)

      if (!food) {
        return null
      }

      return createEntry({
        meal,
        quantity,
        food: createFoodSnapshot(food),
      })
    })
    .filter((entry): entry is Entry => entry !== null)
}

export function generateDailySummaryText(entries: Entry[], dailyTarget: number): string {
  const totals = getDailyTotals(entries, dailyTarget)
  const summaries = getMealSummaries(entries)
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  const remainingText =
    totals.remaining >= 0 ? `${totals.remaining} kcal remaining` : `${Math.abs(totals.remaining)} kcal over target`

  const lines: string[] = [
    `📊 NutraFlux Daily Summary - ${dateStr}`,
    `Target: ${dailyTarget} kcal | Consumed: ${totals.consumed} kcal (${remainingText})`,
    '',
  ]

  let hasItems = false
  for (const meal of summaries) {
    if (meal.entries.length > 0) {
      hasItems = true
      lines.push(`${meal.label} (${meal.totalCalories} kcal):`)
      for (const entry of meal.entries) {
        lines.push(`  • ${entry.food.name} (${entry.quantity}×) - ${entry.totalCalories} kcal`)
      }
      lines.push('')
    }
  }

  if (!hasItems) {
    lines.push('No meals logged yet today.', '')
  }

  lines.push('Tracked with NutraFlux - local-first nutritional momentum.')
  return lines.join('\n')
}
