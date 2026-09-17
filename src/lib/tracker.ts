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

export function generateDailySummaryText(
  entries: Entry[],
  dailyTarget: number,
  locale: 'pl' | 'en' = 'en'
): string {
  const totals = getDailyTotals(entries, dailyTarget)
  const summaries = getMealSummaries(entries)
  const dateLocale = locale === 'pl' ? 'pl-PL' : 'en-US'
  const dateStr = new Date().toLocaleDateString(dateLocale, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  const isPl = locale === 'pl'

  const remainingText =
    totals.remaining >= 0
      ? isPl
        ? `pozostało ${totals.remaining} kcal`
        : `${totals.remaining} kcal remaining`
      : isPl
        ? `przekroczono o ${Math.abs(totals.remaining)} kcal`
        : `${Math.abs(totals.remaining)} kcal over target`

  const lines: string[] = isPl
    ? [
        `📊 NutraFlux - Podsumowanie Dnia (${dateStr})`,
        `Cel: ${dailyTarget} kcal | Spożyte: ${totals.consumed} kcal (${remainingText})`,
        '',
      ]
    : [
        `📊 NutraFlux Daily Summary - ${dateStr}`,
        `Target: ${dailyTarget} kcal | Consumed: ${totals.consumed} kcal (${remainingText})`,
        '',
      ]

  const mealLabels: Record<MealKey, string> = isPl
    ? {
        breakfast: 'Śniadanie',
        lunch: 'Obiad',
        dinner: 'Kolacja',
        snacks: 'Przekąski',
      }
    : {
        breakfast: 'Breakfast',
        lunch: 'Lunch',
        dinner: 'Dinner',
        snacks: 'Snacks',
      }

  let hasItems = false
  for (const meal of summaries) {
    if (meal.entries.length > 0) {
      hasItems = true
      const label = mealLabels[meal.key] || meal.label
      lines.push(`${label} (${meal.totalCalories} kcal):`)
      for (const entry of meal.entries) {
        lines.push(`  • ${entry.food.name} (${entry.quantity}×) - ${entry.totalCalories} kcal`)
      }
      lines.push('')
    }
  }

  if (!hasItems) {
    lines.push(isPl ? 'Brak zapisanych posiłków na dzisiaj.' : 'No meals logged yet today.', '')
  }

  lines.push(
    isPl
      ? 'Zapisano w NutraFlux - Twój darmowy i prywatny licznik kalorii.'
      : 'Tracked with NutraFlux - local-first nutritional momentum.'
  )
  return lines.join('\n')
}
