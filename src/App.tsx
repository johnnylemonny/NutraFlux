import { startTransition, useEffect, useId, useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowDown,
  ArrowUpRight,
  CheckCheck,
  GitBranch,
  Heart,
  Plus,
  RefreshCcw,
  Search,
  Sparkles,
  Star,
  X,
} from 'lucide-react'
import { Toaster, toast } from 'sonner'

import { LogoMark } from '@/components/logo-mark'
import { MealCard } from '@/components/meal-card'
import { ProgressRing } from '@/components/progress-ring'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import {
  featuredFoodCatalog,
  generatedFoodCatalogUrl,
  mealMeta,
  mergeFoodCatalogs,
  targetPresets,
} from '@/data/foods'
import { useCalorieTracker } from '@/hooks/use-calorie-tracker'
import { useTheme } from '@/hooks/use-theme'
import {
  createFoodSnapshot,
  formatMacroSummary,
  getDailyTotals,
  getMealSummaries,
} from '@/lib/tracker'
import { cn } from '@/lib/utils'
import type { Entry, FoodItem, FoodSnapshot, MealKey } from '@/types'

const navItems = [
  { label: 'Tracker', href: '#tracker' },
  { label: 'Overview', href: '#overview' },
  { label: 'Open source', href: '#open-source' },
]

function wildcardToRegExp(query: string) {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\*/g, '.*')
  return new RegExp(escaped, 'i')
}

function filterFoods(catalog: FoodItem[], query: string) {
  const matcher = wildcardToRegExp(query)
  return catalog.filter((food) =>
    matcher.test(`${food.name} ${food.category} ${food.note ?? ''}`),
  )
}

function App() {
  const {
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
  } = useCalorieTracker()
  const { resolvedTheme } = useTheme(state.settings.themePreference)

  const [selectedMeal, setSelectedMeal] = useState<MealKey>('breakfast')
  const [searchDraft, setSearchDraft] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [searchWarning, setSearchWarning] = useState<string | null>(null)
  const [visibleResults, setVisibleResults] = useState(25)
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(
    featuredFoodCatalog[0]?.id ?? null,
  )
  const [servings, setServings] = useState(1)
  const [customName, setCustomName] = useState('')
  const [customCalories, setCustomCalories] = useState('240')
  const [customServingLabel, setCustomServingLabel] = useState('1 plate')
  const [customServings, setCustomServings] = useState(1)
  const [foodCatalog, setFoodCatalog] = useState(featuredFoodCatalog)
  const [catalogLoadState, setCatalogLoadState] = useState<'idle' | 'loading' | 'loaded' | 'error'>(
    'idle',
  )
  const catalogLoadPromiseRef = useRef<Promise<FoodItem[]> | null>(null)

  const targetInputId = useId()
  const totals = getDailyTotals(state.entries, state.settings.dailyTarget)
  const mealSummaries = getMealSummaries(state.entries)
  const favoriteFoods = foodCatalog.filter((food) => state.favoriteFoodIds.includes(food.id))
  const recentFoods = state.recentFoods.slice(0, 4)

  const ensureFoodCatalogLoaded = async () => {
    if (catalogLoadState === 'loaded') {
      return foodCatalog
    }

    if (catalogLoadPromiseRef.current) {
      return catalogLoadPromiseRef.current
    }

    const loadPromise = (async () => {
      setCatalogLoadState('loading')

      try {
        const response = await fetch(generatedFoodCatalogUrl)
        if (!response.ok) {
          throw new Error(`Failed to load ${generatedFoodCatalogUrl}`)
        }

        const importedFoodCatalog = (await response.json()) as FoodItem[]
        const mergedCatalog = mergeFoodCatalogs(featuredFoodCatalog, importedFoodCatalog)
        setFoodCatalog(mergedCatalog)
        setCatalogLoadState('loaded')
        return mergedCatalog
      } catch {
        setFoodCatalog(featuredFoodCatalog)
        setCatalogLoadState('error')
        return featuredFoodCatalog
      } finally {
        catalogLoadPromiseRef.current = null
      }
    })()

    catalogLoadPromiseRef.current = loadPromise
    return loadPromise
  }

  const searchResults =
    submittedQuery.trim().length > 0 ? filterFoods(foodCatalog, submittedQuery.trim()) : foodCatalog
  const suggestedFoods =
    submittedQuery.trim().length > 0
      ? searchResults
      : foodCatalog.filter(
          (food) => food.mealHints.includes(selectedMeal) || state.favoriteFoodIds.includes(food.id),
        )
  const visibleFoodResults = suggestedFoods.slice(0, visibleResults)
  const selectedFood =
    foodCatalog.find((food) => food.id === selectedFoodId) ?? visibleFoodResults[0] ?? null

  useEffect(() => {
    setSelectedFoodId((current) => {
      if (current && foodCatalog.some((food) => food.id === current)) {
        return current
      }

      return foodCatalog[0]?.id ?? null
    })
  }, [foodCatalog])

  useEffect(() => {
    if (!lastAddedEntryId) {
      return undefined
    }

    const timeout = window.setTimeout(clearAnimationMarker, 1400)
    return () => window.clearTimeout(timeout)
  }, [clearAnimationMarker, lastAddedEntryId])

  const runSearch = async () => {
    const trimmed = searchDraft.trim()

    if (!trimmed) {
      setSubmittedQuery('')
      setVisibleResults(25)
      setSearchWarning('Enter a food description before searching.')
      return
    }

    const catalog = await ensureFoodCatalogLoaded()
    const matches = filterFoods(catalog, trimmed)
    setSubmittedQuery(trimmed)
    setVisibleResults(25)
    setSearchWarning(
      matches.length === 0
        ? 'No foods matched that search. Try a broader word or wildcard like "chicken*".'
        : null,
    )
  }

  const clearSearch = () => {
    setSearchDraft('')
    setSubmittedQuery('')
    setSearchWarning(null)
    setVisibleResults(25)
  }

  const handleAddCatalogFood = () => {
    if (!selectedFood) {
      return
    }

    const entry = addEntry({
      meal: selectedMeal,
      quantity: servings,
      food: createFoodSnapshot(selectedFood),
    })

    toast.success(`${entry.food.name} added`, {
      description: `${entry.totalCalories} kcal in ${mealMeta[selectedMeal].label.toLowerCase()}.`,
    })

    startTransition(() => setServings(1))
  }

  const handleAddRecentFood = (food: FoodSnapshot) => {
    const entry = addEntry({ meal: selectedMeal, quantity: 1, food })
    toast.success(`${entry.food.name} added again`, {
      description: `Quick add dropped it into ${mealMeta[selectedMeal].label.toLowerCase()}.`,
    })
  }

  const handleAddCustomFood = () => {
    const safeName = customName.trim()
    const parsedCalories = Number(customCalories)

    if (!safeName || Number.isNaN(parsedCalories) || parsedCalories <= 0) {
      toast.error('Add a valid custom item', {
        description: 'A name and calories per serving are both required.',
      })
      return
    }

    const entry = addEntry({
      meal: selectedMeal,
      quantity: customServings,
      food: {
        name: safeName,
        servingLabel: customServingLabel.trim() || '1 serving',
        calories: parsedCalories,
      },
    })

    toast.success('Custom item added', {
      description: `${entry.totalCalories} kcal saved to your day.`,
    })

    startTransition(() => {
      setCustomName('')
      setCustomCalories('240')
      setCustomServingLabel('1 plate')
      setCustomServings(1)
    })
  }

  const handleDuplicateEntry = (entry: Entry) => {
    const duplicated = duplicateEntry({
      meal: entry.meal,
      quantity: entry.quantity,
      food: entry.food,
    })

    toast.success('Item duplicated', {
      description: `${duplicated.food.name} was added one more time.`,
    })
  }

  const handleResetDay = () => {
    resetDay()
    toast.success('Fresh day ready', {
      description: 'Your entries were cleared without touching favorites or theme.',
    })
  }

  const handleLoadDemo = () => {
    loadDemoDay()
    toast.success('Sample day loaded', {
      description: 'A balanced example is ready for browsing and screenshots.',
    })
  }

  return (
    <>
      <div className="relative isolate overflow-hidden">
        <div className="hero-blur hero-blur-one" />
        <div className="hero-blur hero-blur-two" />

        <header className="sticky top-0 z-40 border-b border-[var(--border-soft)] bg-[color:var(--surface-topbar)]/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 md:px-8">
            <a href="#top" className="flex items-center gap-3">
              <LogoMark className="size-11" />
              <div>
                <div className="text-base font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  Calorie Counter
                </div>
                <div className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                  local-first daily tracker
                </div>
              </div>
            </a>

            <nav className="hidden items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-2 py-1 md:flex">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] transition hover:bg-[var(--surface-subtle)] hover:text-[var(--foreground)]"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle
                preference={state.settings.themePreference}
                onChange={setThemePreference}
              />
              <Button asChild size="sm">
                <a href="#tracker">
                  Start tracking
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
            </div>
          </div>
        </header>

        <main id="top" className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 pb-16 pt-8 md:px-8 md:pb-24 md:pt-12">
          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6 md:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(82,183,136,0.16),transparent_36%)]" />
              <div className="relative flex flex-col gap-8">
                <div className="space-y-5">
                  <p className="eyebrow">Friendly. Useful. Open source.</p>
                  <div className="space-y-4">
                    <h1 className="max-w-[13.5ch] text-balance text-[clamp(3.35rem,5vw,5.25rem)] font-semibold tracking-[-0.075em] text-[var(--foreground)]">
                      Track calories without turning your day into homework.
                    </h1>
                    <p className="max-w-xl text-base leading-8 text-[var(--muted-foreground)] md:text-lg">
                      Calorie Counter keeps the daily picture crisp: fast meal logging,
                      clear remaining calories, search-first food lookup, and enough motion
                      to feel alive without getting in your way.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <a href="#tracker">
                      Open the tracker
                      <Plus className="size-4" />
                    </a>
                  </Button>
                  <Button type="button" variant="secondary" onClick={handleLoadDemo}>
                    {state.settings.demoLoaded ? 'Reload sample day' : 'Try sample day'}
                    <Sparkles className="size-4" />
                  </Button>
                  <Button asChild variant="ghost">
                    <a href="https://github.com/johnnylemonny/Calorie-Counter" target="_blank" rel="noreferrer">
                      View source
                      <GitBranch className="size-4" />
                    </a>
                  </Button>
                </div>

                {!state.settings.dismissedOnboarding ? (
                  <div className="grid gap-4 rounded-[1.75rem] border border-[var(--tone-soft-border)] bg-[var(--surface-elevated)] p-5 md:grid-cols-[1fr_auto] md:items-center">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--tone-strong)]">
                        Quick onboarding
                      </p>
                      <p className="text-sm leading-7 text-[var(--foreground)]">
                        Set your daily target, search foods with a keyword or wildcard,
                        add a result, then reuse favorites and recents to move faster tomorrow.
                      </p>
                    </div>
                    <Button type="button" size="sm" variant="secondary" onClick={dismissOnboarding}>
                      Got it
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>

            <aside className="glass-panel relative overflow-hidden rounded-[2rem] p-6 md:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(82,183,136,0.1),transparent_52%)]" />
              <div className="relative flex h-full flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="eyebrow">Live preview</p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-[-0.06em]">
                      Today at a glance
                    </h2>
                  </div>
                  <div className="rounded-full bg-[var(--surface-elevated)] px-3 py-2 text-sm font-medium text-[var(--muted-foreground)]">
                    {resolvedTheme} mode
                  </div>
                </div>

                <div className="grid gap-4 rounded-[1.8rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-5">
                  <div className="flex items-center justify-between text-sm text-[var(--muted-foreground)]">
                    <span>Daily target</span>
                    <span>{state.settings.dailyTarget} kcal</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-elevated-strong)]">
                    <div
                      className="h-full rounded-full bg-[var(--tone-strong)] transition-[width] duration-500 ease-out"
                      style={{ width: `${Math.min(totals.progress, 1) * 100}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="rounded-[1.4rem] bg-[var(--surface-subtle)] p-4">
                      <div className="text-[var(--muted-foreground)]">Consumed</div>
                      <div className="mt-1 text-2xl font-semibold text-[var(--foreground)]">
                        {totals.consumed}
                      </div>
                    </div>
                    <div className="rounded-[1.4rem] bg-[var(--surface-subtle)] p-4">
                      <div className="text-[var(--muted-foreground)]">Remaining</div>
                      <div className="mt-1 text-2xl font-semibold text-[var(--foreground)]">
                        {totals.remaining}
                      </div>
                    </div>
                    <div className="rounded-[1.4rem] bg-[var(--surface-subtle)] p-4">
                      <div className="text-[var(--muted-foreground)]">Entries</div>
                      <div className="mt-1 text-2xl font-semibold text-[var(--foreground)]">
                        {state.entries.length}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  {mealSummaries.map((summary) => (
                    <div
                      key={summary.key}
                      className="flex items-center justify-between rounded-[1.4rem] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3"
                    >
                      <div>
                        <div className="text-sm font-semibold text-[var(--foreground)]">
                          {summary.label}
                        </div>
                        <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                          {summary.entries.length} items
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-[var(--foreground)]">
                        {summary.totalCalories} kcal
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </section>
          <section id="tracker" className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <aside className="glass-panel content-lazy rounded-[2rem] p-6 md:p-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="eyebrow">Tracker setup</p>
                  <h2 className="text-3xl font-semibold tracking-[-0.06em] text-[var(--foreground)]">
                    Build your day in a few taps
                  </h2>
                  <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                    Choose a target, pick the meal you are logging, and search the local JSON food list.
                  </p>
                </div>

                <div className="rounded-[1.8rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-5">
                  <label htmlFor={targetInputId} className="text-sm font-semibold text-[var(--foreground)]">
                    Daily calorie target
                  </label>
                  <div className="mt-3 flex items-center gap-3">
                    <Input
                      id={targetInputId}
                      inputMode="numeric"
                      value={state.settings.dailyTarget}
                      onChange={(event) => {
                        const nextValue = Number(event.target.value)
                        if (!Number.isNaN(nextValue) && nextValue > 0) {
                          setDailyTarget(nextValue)
                        }
                      }}
                    />
                    <div className="rounded-2xl bg-[var(--surface-subtle)] px-4 py-3 text-sm text-[var(--muted-foreground)]">
                      kcal
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {targetPresets.map((preset) => (
                      <Button
                        key={preset}
                        type="button"
                        size="sm"
                        variant={preset === state.settings.dailyTarget ? 'default' : 'secondary'}
                        onClick={() => setDailyTarget(preset)}
                      >
                        {preset}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-5">
                  <p className="text-sm font-semibold text-[var(--foreground)]">Meal focus</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {(Object.keys(mealMeta) as MealKey[]).map((meal) => (
                      <button
                        key={meal}
                        type="button"
                        className={cn(
                          'rounded-[1.4rem] border px-4 py-3 text-left transition duration-300',
                          selectedMeal === meal
                            ? 'border-[var(--tone-soft-border)] bg-[var(--tone-soft)] text-[var(--foreground)]'
                            : 'border-[var(--border-soft)] bg-[var(--surface-subtle)] text-[var(--muted-foreground)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]',
                        )}
                        onClick={() => setSelectedMeal(meal)}
                      >
                        <div className="text-sm font-semibold">{mealMeta[meal].label}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.18em]">
                          {mealMeta[meal].description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">Quick signals</p>
                      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                        A few clues to keep the flow easy.
                      </p>
                    </div>
                    <Sparkles className="size-5 text-[var(--tone-strong)]" />
                  </div>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-[1.4rem] bg-[var(--surface-subtle)] p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                        Search bonus
                      </div>
                      <div className="mt-2 text-sm font-medium text-[var(--foreground)]">
                        Wildcards are supported. Try `chicken*` or `*salad`.
                      </div>
                    </div>
                    <div className="rounded-[1.4rem] bg-[var(--surface-subtle)] p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                        Momentum
                      </div>
                      <div className="mt-2 text-sm font-medium text-[var(--foreground)]">
                        {totals.remaining >= 0
                          ? `You are ${totals.remaining} kcal away from your target.`
                          : `You are ${Math.abs(totals.remaining)} kcal above target today.`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <div className="glass-panel rounded-[2rem] p-6 md:p-8">
              <div className="grid gap-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="eyebrow">Search and add</p>
                    <h2 className="text-3xl font-semibold tracking-[-0.06em] text-[var(--foreground)]">
                      Search the food list, then log it fast
                    </h2>
                  </div>
                  <div className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-4 py-2 text-sm text-[var(--muted-foreground)]">
                    Logging to {mealMeta[selectedMeal].label}
                  </div>
                </div>

                <div className="grid gap-4 rounded-[1.8rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-5">
                  <form
                    className="grid gap-3 md:grid-cols-[1fr_auto_auto]"
                    onSubmit={(event) => {
                      event.preventDefault()
                      void runSearch()
                    }}
                  >
                    <label className="relative">
                      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                      <Input
                        value={searchDraft}
                        onFocus={() => {
                          if (catalogLoadState === 'idle') {
                            void ensureFoodCatalogLoaded()
                          }
                        }}
                        onChange={(event) => setSearchDraft(event.target.value)}
                        placeholder="Search foods by description"
                        className="pl-11"
                      />
                    </label>
                    <Button type="submit">
                      Search
                      <Search className="size-4" />
                    </Button>
                    <Button type="button" variant="secondary" onClick={clearSearch}>
                      Clear
                      <X className="size-4" />
                    </Button>
                  </form>

                  {searchWarning ? (
                    <div className="flex items-start gap-3 rounded-[1.4rem] border border-[var(--tone-soft-border)] bg-[var(--tone-soft)] px-4 py-3 text-sm leading-6 text-[var(--foreground)]">
                      <AlertCircle className="mt-0.5 size-4 shrink-0 text-[var(--tone-strong)]" />
                      <span>{searchWarning}</span>
                    </div>
                  ) : null}

                  {catalogLoadState === 'loading' ? (
                    <div className="rounded-[1.4rem] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3 text-sm text-[var(--muted-foreground)]">
                      Loading the full catalog in the background...
                    </div>
                  ) : null}

                  {favoriteFoods.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {favoriteFoods.slice(0, 4).map((food) => (
                        <button
                          key={food.id}
                          type="button"
                          className="inline-flex items-center gap-2 rounded-full border border-[var(--tone-soft-border)] bg-[var(--tone-soft)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:-translate-y-0.5"
                          onClick={() => setSelectedFoodId(food.id)}
                        >
                          <Heart className="size-4 fill-current" />
                          {food.name}
                        </button>
                      ))}
                    </div>
                  ) : null}

                  {recentFoods.length > 0 ? (
                    <div>
                      <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                        <RefreshCcw className="size-3.5" />
                        Recent foods
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentFoods.map((food) => (
                          <button
                            key={`${food.name}-${food.usedAt}`}
                            type="button"
                            className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-2 text-sm text-[var(--foreground)] transition hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
                            onClick={() => handleAddRecentFood(food)}
                          >
                            {food.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-[1.6rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-4">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                            Results
                          </p>
                          <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                            {submittedQuery ? `Matches for "${submittedQuery}"` : 'Suggested foods'}
                          </h3>
                        </div>
                        <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                          {suggestedFoods.length} results
                        </div>
                      </div>

                      <div className="max-h-[29rem] space-y-3 overflow-y-auto pr-1">
                        {visibleFoodResults.map((food) => {
                          const isSelected = selectedFood?.id === food.id
                          const isFavorite = state.favoriteFoodIds.includes(food.id)

                          return (
                            <button
                              key={food.id}
                              type="button"
                              className={cn(
                                'group w-full rounded-[1.5rem] border p-4 text-left transition duration-300 hover:-translate-y-0.5',
                                isSelected
                                  ? 'border-[var(--tone-soft-border)] bg-[var(--tone-soft)]'
                                  : 'border-[var(--border-soft)] bg-[var(--surface-elevated)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-elevated-strong)]',
                              )}
                              onClick={() => setSelectedFoodId(food.id)}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="text-sm font-semibold text-[var(--foreground)]">
                                    {food.name}
                                  </div>
                                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                                    {food.category}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  aria-label={isFavorite ? `Remove ${food.name} from favorites` : `Save ${food.name} as favorite`}
                                  className={cn(
                                    'rounded-full p-2 transition',
                                    isFavorite
                                      ? 'bg-[var(--tone-soft)] text-[var(--tone-strong)]'
                                      : 'bg-[var(--surface-subtle)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
                                  )}
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    toggleFavorite(food.id)
                                  }}
                                >
                                  <Star className={cn('size-4', isFavorite && 'fill-current')} />
                                </button>
                              </div>
                              <div className="mt-4 flex items-center justify-between gap-3">
                                <span className="text-sm text-[var(--muted-foreground)]">
                                  {food.servingLabel}
                                </span>
                                <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-sm font-semibold text-[var(--foreground)]">
                                  {food.calories} kcal
                                </span>
                              </div>
                            </button>
                          )
                        })}
                      </div>

                      {suggestedFoods.length > visibleResults ? (
                        <Button
                          type="button"
                          variant="secondary"
                          className="mt-4 w-full"
                          onClick={() => setVisibleResults((current) => current + 25)}
                        >
                          Show 25 more
                          <ArrowDown className="size-4" />
                        </Button>
                      ) : null}
                    </div>

                    <div className="grid gap-4 rounded-[1.6rem] border border-[var(--border-soft)] bg-[var(--surface-subtle)] p-5">
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                          Selected food
                        </p>
                        <h3 className="text-2xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
                          {selectedFood?.name ?? 'Pick something from the list'}
                        </h3>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          {selectedFood?.note ?? selectedFood?.category ?? 'Fast add keeps you moving.'}
                        </p>
                      </div>

                      {selectedFood ? (
                        <>
                          <div className="rounded-[1.3rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-4">
                            <div className="flex items-center justify-between text-sm text-[var(--muted-foreground)]">
                              <span>Serving size</span>
                              <span>{servings}x</span>
                            </div>
                            <div className="mt-4">
                              <Slider
                                min={0.5}
                                max={4}
                                step={0.5}
                                value={[servings]}
                                onValueChange={([value]) => setServings(value ?? 1)}
                              />
                            </div>
                            <div className="mt-4 flex items-center justify-between text-sm text-[var(--muted-foreground)]">
                              <span>{selectedFood.servingLabel}</span>
                              <span>{Math.round(selectedFood.calories * servings)} kcal</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted-foreground)]">
                            <CheckCheck className="size-4 text-[var(--tone-strong)]" />
                            <span>{formatMacroSummary(selectedFood.macros)}</span>
                          </div>

                          <Button type="button" onClick={handleAddCatalogFood}>
                            Add to {mealMeta[selectedMeal].label}
                            <Plus className="size-4" />
                          </Button>
                        </>
                      ) : (
                        <div className="rounded-[1.4rem] border border-dashed border-[var(--border-soft)] p-6 text-sm text-[var(--muted-foreground)]">
                          Search for a food or clear the search to see suggestions.
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 rounded-[1.8rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-5 md:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                          Custom item
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
                          Add something not in the food list
                        </h3>
                      </div>
                      <Input
                        value={customName}
                        onChange={(event) => setCustomName(event.target.value)}
                        placeholder="Item name"
                      />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Input
                          inputMode="decimal"
                          value={customCalories}
                          onChange={(event) => setCustomCalories(event.target.value)}
                          placeholder="Calories per serving"
                        />
                        <Input
                          value={customServingLabel}
                          onChange={(event) => setCustomServingLabel(event.target.value)}
                          placeholder="Serving label"
                        />
                      </div>
                    </div>

                    <div className="rounded-[1.4rem] bg-[var(--surface-subtle)] p-4">
                      <div className="flex items-center justify-between text-sm text-[var(--muted-foreground)]">
                        <span>Quantity</span>
                        <span>{customServings}x</span>
                      </div>
                      <div className="mt-4">
                        <Slider
                          min={0.5}
                          max={4}
                          step={0.5}
                          value={[customServings]}
                          onValueChange={([value]) => setCustomServings(value ?? 1)}
                        />
                      </div>
                      <div className="mt-4 text-sm text-[var(--muted-foreground)]">
                        Preview{' '}
                        <span className="font-semibold text-[var(--foreground)]">
                          {Math.round(Number(customCalories || 0) * customServings) || 0} kcal
                        </span>
                      </div>
                      <Button type="button" className="mt-5 w-full" onClick={handleAddCustomFood}>
                        Add custom item
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="overview" className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
            <aside className="glass-panel content-lazy rounded-[2rem] p-6 md:p-8">
              <div className="space-y-6">
                <div>
                  <p className="eyebrow">Daily overview</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-[var(--foreground)]">
                    One calm place for the whole picture
                  </h2>
                </div>
                <ProgressRing
                  progress={totals.progress}
                  consumed={totals.consumed}
                  remaining={totals.remaining}
                  className="mx-auto"
                />
                <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface-subtle)] p-4">
                  <div className="grid gap-4 divide-y divide-[var(--border-soft)]">
                    <div className="pb-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                        Best shortcut
                      </div>
                      <div className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                        Favorites + recents
                      </div>
                      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                        Save food once, then repeat it with almost no friction.
                      </p>
                    </div>
                    <div className="pt-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                        Reset flow
                      </div>
                      <div className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                        Start fresh when you want
                      </div>
                      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                        The reset keeps preferences and favorites intact, so a new day never feels expensive.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="secondary" onClick={handleResetDay}>
                    Reset day
                    <RefreshCcw className="size-4" />
                  </Button>
                  <Button asChild variant="ghost">
                    <a href="#tracker">Add more food</a>
                  </Button>
                </div>
              </div>
            </aside>

            <div className="grid gap-6">
              {mealSummaries.map((summary) => (
                <MealCard
                  key={summary.key}
                  summary={summary}
                  onDuplicate={handleDuplicateEntry}
                  isHighlightedEntry={(entryId) => entryId === lastAddedEntryId}
                />
              ))}
            </div>
          </section>

          <section id="open-source" className="grid gap-6 content-lazy">
            <div className="glass-panel rounded-[2rem] p-6 md:p-8">
              <div className="space-y-4">
                <p className="eyebrow">Open source build notes</p>
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-2xl">
                    <h2 className="text-3xl font-semibold tracking-[-0.06em] text-[var(--foreground)]">
                      A clean demo app designed to be forked, studied, and shipped.
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                      This project is intentionally front-end only, local-first, and GitHub Pages-friendly.
                      It keeps the architecture readable while still showing strong polish, motion,
                      and a reusable tracker state model.
                    </p>
                  </div>
                  <Button asChild variant="secondary">
                    <a href="https://github.com/johnnylemonny/Calorie-Counter" target="_blank" rel="noreferrer">
                      GitHub repository
                      <ArrowUpRight className="size-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
              <article className="glass-panel overflow-hidden rounded-[2rem]">
                <img
                  src="https://picsum.photos/seed/calorie-counter-bowl/800/600.webp"
                  alt="A placeholder healthy meal used for demo presentation."
                  loading="lazy"
                  className="h-56 w-full object-cover"
                />
                <div className="p-6">
                  <p className="eyebrow">Presentation ready</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
                    Screenshots, README polish, and a favicon set included.
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                    The repo is meant to look good in public and be easy to understand for contributors or curious visitors.
                  </p>
                </div>
              </article>

              <div className="grid gap-6">
                <article className="glass-panel rounded-[2rem] p-6">
                  <p className="eyebrow">Built for reuse</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
                    Strong primitives, small state surface
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                    Type-safe tracker state, local JSON food data, and shadcn-friendly primitives make future iterations straightforward.
                  </p>
                </article>

                <article className="glass-panel rounded-[2rem] p-6">
                  <p className="eyebrow">Privacy-first</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
                    Your browser keeps the data
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                    No accounts, no sync pressure, no surprise server costs. Just a polished local tracker that loads fast and stays yours.
                  </p>
                </article>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-[var(--border-soft)] bg-[color:var(--surface-topbar)]/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <LogoMark className="size-9" />
                <span className="text-base font-semibold text-[var(--foreground)]">
                  Calorie Counter
                </span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">
                Built by a solo creator. English-only, MIT-licensed, ready for GitHub Pages.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-[var(--muted-foreground)]">
              <a className="footer-link" href="#tracker">
                Tracker
              </a>
              <a className="footer-link" href="#overview">
                Overview
              </a>
              <a className="footer-link" href="#open-source">
                Open source
              </a>
              <a
                className="footer-link"
                href="https://github.com/johnnylemonny/Calorie-Counter"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>

      <Toaster
        richColors
        closeButton
        position="top-right"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      />
    </>
  )
}

export default App
