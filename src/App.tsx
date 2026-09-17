import { startTransition, useEffect, useId, useRef, useState } from 'react'
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Coffee,
  MessageSquare,
  Plus,
  RefreshCcw,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  X,
  Zap,
} from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { FaqSection } from '@/components/faq-section'
import { FeedbackDialog } from '@/components/feedback-dialog'
import { LanguageToggle } from '@/components/language-toggle'
import { LogoMark } from '@/components/logo-mark'
import { MealCard } from '@/components/meal-card'
import { SupportCard } from '@/components/support-card'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  featuredFoodCatalog,
  generatedFoodCatalogUrl,
  mealMeta,
  mergeFoodCatalogs,
} from '@/data/foods'
import { useCalorieTracker } from '@/hooks/use-calorie-tracker'
import { useLocale } from '@/hooks/use-locale'
import { useTheme } from '@/hooks/use-theme'
import {
  createFoodSnapshot,
  formatMacroSummary,
  generateDailySummaryText,
  getDailyTotals,
  getMealSummaries,
} from '@/lib/tracker'
import type { Entry, FoodItem, FoodSnapshot, MealKey } from '@/types'

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
  const { locale, setLocale, t } = useLocale()
  const {
    state,
    lastAddedEntryId,
    addEntry,
    duplicateEntry,
    deleteEntry,
    resetDay,
    loadDemoDay,
    setDailyTarget,
    setThemePreference,
    clearAnimationMarker,
  } = useCalorieTracker()
  const { resolvedTheme } = useTheme(state.settings.themePreference)

  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false)
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

  const hasSelectedFood = selectedFoodId && foodCatalog.some((food) => food.id === selectedFoodId)
  if (!hasSelectedFood && foodCatalog.length > 0) {
    setSelectedFoodId(foodCatalog[0].id)
  }

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
      setSearchWarning(t.search.placeholder)
      return
    }

    const catalog = await ensureFoodCatalogLoaded()
    const matches = filterFoods(catalog, trimmed)
    setSubmittedQuery(trimmed)
    setVisibleResults(25)
    setSearchWarning(matches.length === 0 ? t.search.noResults : null)
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

    const mealName = t.meals[selectedMeal]
    toast.success(
      <div>
        <div className="font-semibold">{entry.food.name}</div>
        <div className="text-xs opacity-90">
          {entry.totalCalories} kcal • {t.toasts.entryAdded.replace('{meal}', mealName)}
        </div>
      </div>,
    )

    startTransition(() => setServings(1))
  }

  const handleAddRecentFood = (food: FoodSnapshot) => {
    const entry = addEntry({ meal: selectedMeal, quantity: 1, food })
    const mealName = t.meals[selectedMeal]
    toast.success(
      <div>
        <div className="font-semibold">{entry.food.name}</div>
        <div className="text-xs opacity-90 font-medium">
          {entry.totalCalories} kcal • {t.toasts.entryAdded.replace('{meal}', mealName)}
        </div>
      </div>,
    )
  }

  const handleAddCustomFood = () => {
    const safeName = customName.trim()
    const parsedCalories = Number(customCalories)

    if (!safeName || Number.isNaN(parsedCalories) || parsedCalories <= 0 || parsedCalories > 10000) {
      toast.error(
        <div>
          <div className="font-semibold">{t.search.customTab}</div>
          <div className="text-xs opacity-90 font-medium">
            {t.search.customCaloriesLabel}: 1–10 000 kcal
          </div>
        </div>,
      )
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

    const mealName = t.meals[selectedMeal]
    toast.success(
      <div>
        <div className="font-semibold">{entry.food.name}</div>
        <div className="text-xs opacity-90 font-medium">
          {entry.totalCalories} kcal • {t.toasts.entryAdded.replace('{meal}', mealName)}
        </div>
      </div>,
    )

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

    const mealName = t.meals[entry.meal]
    toast.success(
      <div>
        <div className="font-semibold">{duplicated.food.name}</div>
        <div className="text-xs opacity-90 font-medium">
          {t.toasts.entryDuplicated.replace('{meal}', mealName)}
        </div>
      </div>,
    )
  }

  const handleDeleteEntry = (entry: Entry) => {
    deleteEntry(entry.id)
    toast.info(
      <div>
        <div className="font-semibold">{entry.food.name}</div>
        <div className="text-xs opacity-90 font-medium">{t.toasts.entryDeleted}</div>
      </div>,
    )
  }

  const handleShareSummary = async () => {
    const summaryText = generateDailySummaryText(state.entries, state.settings.dailyTarget, locale)

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'NutraFlux Daily Summary',
          text: summaryText,
        })
        toast.success(t.toasts.summaryShared)
        return
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return
        }
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(summaryText)
        toast.success(t.toasts.summaryCopied)
        return
      } catch {
        // clipboard fallback
      }
    }

    toast.info(t.toasts.shareError)
  }

  const handleResetDay = () => {
    resetDay()
    toast.success(t.toasts.resetSuccess)
  }

  const handleLoadDemo = () => {
    loadDemoDay()
    toast.success(t.toasts.demoLoaded)
  }

  const navLinks = [
    { label: t.nav.tracker, href: '#tracker' },
    { label: t.nav.overview, href: '#overview' },
    { label: t.nav.faq, href: '#faq' },
    { label: t.nav.support, href: '#support' },
  ]

  const targetGoals = [
    { label: t.targets.cutLabel, calories: 1700, desc: t.targets.cutDesc },
    { label: t.targets.maintainLabel, calories: 2100, desc: t.targets.maintainDesc },
    { label: t.targets.bulkLabel, calories: 2500, desc: t.targets.bulkDesc },
  ]

  return (
    <>
      <div className="relative isolate overflow-hidden min-h-screen">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 border-b border-(--border-soft) bg-(--surface-topbar) backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-8">
            <a href="#top" className="flex items-center gap-3 group transition-transform active:scale-95">
              <LogoMark className="size-10 text-(--tone-strong) transition-transform group-hover:rotate-6" />
              <div>
                <div className="text-base font-bold tracking-tight text-(--foreground)">
                  {t.common.appName}
                </div>
                <div className="text-[11px] font-medium text-(--muted-foreground) hidden sm:block">
                  {t.common.appTagline}
                </div>
              </div>
            </a>

            <nav className="hidden md:flex items-center gap-1 rounded-full border border-(--border-soft) bg-(--surface-elevated) px-2 py-1 shadow-xs" aria-label="Main Navigation">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-(--muted-foreground) transition hover:bg-(--surface-subtle) hover:text-(--foreground)"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <LanguageToggle currentLocale={locale} onToggle={setLocale} />

              <button
                type="button"
                onClick={() => setIsFeedbackDialogOpen(true)}
                className="hidden lg:flex items-center gap-1.5 rounded-full border border-(--border-soft) bg-(--surface-elevated) px-3 py-1.5 text-xs font-semibold text-(--muted-foreground) transition hover:text-(--foreground) hover:bg-(--surface-subtle) cursor-pointer"
                aria-label={t.feedback.triggerButton}
              >
                <MessageSquare className="size-3.5 text-(--tone-strong)" />
                <span>{t.feedback.triggerButton}</span>
              </button>

              <ThemeToggle
                preference={state.settings.themePreference}
                onChange={setThemePreference}
              />

              <Button
                asChild
                size="sm"
                className="rounded-full bg-(--tone-strong) text-white font-bold text-xs shadow-xs hover:bg-(--tone-strong)/90 hidden sm:inline-flex"
              >
                <a href="#support" className="inline-flex items-center gap-1.5">
                  <Coffee className="size-3.5" />
                  <span>{t.nav.support}</span>
                </a>
              </Button>
            </div>
          </div>
        </header>

        <main id="top" className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-24 pt-6 sm:px-8 sm:pt-10">
          {/* HERO SECTION */}
          <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] items-stretch" aria-labelledby="hero-title">
            <div className="card-panel relative overflow-hidden rounded-4xl p-6 sm:p-10 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-(--tone-soft-border) bg-(--tone-soft-surface) text-xs font-bold tracking-wide text-(--tone-strong) shadow-xs">
                  <Sparkles className="size-3.5" />
                  <span>{t.hero.badge}</span>
                </div>

                <div className="space-y-4">
                  <h1
                    id="hero-title"
                    className="text-balance text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-(--foreground) leading-[1.1]"
                  >
                    <span className="text-(--foreground)">{t.hero.titleLine1}</span>{' '}
                    <span className="bg-linear-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
                      {t.hero.titleLine2}
                    </span>
                  </h1>
                  <p className="max-w-xl text-base leading-relaxed text-(--muted-foreground) sm:text-lg">
                    {t.hero.description}
                  </p>
                </div>

                {/* Trust Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-(--surface-subtle) border border-(--border-soft) px-3 py-1.5 text-xs font-bold text-(--foreground)">
                    <CheckCircle2 className="size-3.5 text-(--tone-strong)" />
                    {t.hero.trustPills.free}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-(--surface-subtle) border border-(--border-soft) px-3 py-1.5 text-xs font-bold text-(--foreground)">
                    <CheckCircle2 className="size-3.5 text-(--tone-strong)" />
                    {t.hero.trustPills.noAccount}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-(--surface-subtle) border border-(--border-soft) px-3 py-1.5 text-xs font-bold text-(--foreground)">
                    <ShieldCheck className="size-3.5 text-(--tone-strong)" />
                    {t.hero.trustPills.private}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-8">
                <Button
                  asChild
                  className="rounded-full bg-(--tone-strong) text-white font-bold shadow-md shadow-(--tone-strong)/25 hover:bg-(--tone-strong)/90 hover:scale-105 active:scale-95 transition-all"
                >
                  <a href="#tracker" className="inline-flex items-center gap-2">
                    <Plus className="size-4" />
                    <span>{t.hero.openTracker}</span>
                  </a>
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleLoadDemo}
                  className="rounded-full border-(--border-strong) font-semibold hover:scale-105 active:scale-95 transition-all"
                >
                  <Sparkles className="size-4 text-(--tone-strong)" />
                  <span>{state.settings.demoLoaded ? t.hero.reloadDemo : t.hero.tryDemo}</span>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsFeedbackDialogOpen(true)}
                  className="rounded-full font-semibold"
                >
                  <MessageSquare className="size-4" />
                  <span>{t.feedback.triggerButton}</span>
                </Button>
              </div>
            </div>

            {/* Quick Overview Card */}
            <aside id="overview" className="card-panel relative overflow-hidden rounded-4xl p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="size-5 text-(--tone-strong)" />
                    <h2 className="text-xl font-bold tracking-tight text-(--foreground)">
                      {t.overview.todayAtGlance}
                    </h2>
                  </div>
                  <span className="rounded-full bg-(--surface-subtle) px-3 py-1 text-xs font-bold text-(--tone-strong)">
                    {state.settings.dailyTarget} {t.common.kcal}
                  </span>
                </div>

                <div className="rounded-3xl border border-(--border-soft) bg-(--surface-subtle) p-4 space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-(--muted-foreground)">
                    <span>{t.overview.budgetUsed}</span>
                    <span>{Math.round(totals.progress * 100)}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-(--surface-elevated)">
                    <div
                      className="h-full rounded-full bg-(--tone-strong) transition-all duration-500 ease-out"
                      style={{ width: `${Math.min(totals.progress, 1) * 100}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="rounded-2xl bg-(--surface-elevated) p-3">
                      <div className="text-[11px] font-medium text-(--muted-foreground)">{t.overview.consumed}</div>
                      <div className="text-lg font-black text-(--foreground)">{totals.consumed}</div>
                    </div>
                    <div className="rounded-2xl bg-(--surface-elevated) p-3">
                      <div className="text-[11px] font-medium text-(--muted-foreground)">{t.overview.remaining}</div>
                      <div className={`text-lg font-black ${totals.remaining < 0 ? 'text-(--danger)' : 'text-(--tone-strong)'}`}>
                        {totals.remaining}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-(--surface-elevated) p-3">
                      <div className="text-[11px] font-medium text-(--muted-foreground)">{t.meals.itemsCount.replace('{count}', '')}</div>
                      <div className="text-lg font-black text-(--foreground)">{state.entries.length}</div>
                    </div>
                  </div>
                </div>

                {/* Mini Meal Breakdown */}
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-(--muted-foreground)">
                    {t.overview.mealBudget}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {mealSummaries.map((summary) => (
                      <div
                        key={summary.key}
                        className="flex items-center justify-between rounded-xl border border-(--border-soft) bg-(--surface-subtle) px-3 py-2 text-xs"
                      >
                        <span className="font-semibold text-(--foreground)">{t.meals[summary.key]}</span>
                        <span className="font-bold text-(--muted-foreground)">{summary.totalCalories} kcal</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between gap-2 border-t border-(--border-soft)">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleShareSummary}
                  className="rounded-full text-xs font-semibold"
                >
                  <Share2 className="mr-1.5 size-3.5 text-(--tone-strong)" />
                  {t.summary.shareSummary}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsResetDialogOpen(true)}
                  className="rounded-full text-xs text-(--muted-foreground) hover:text-(--danger)"
                >
                  <RefreshCcw className="mr-1.5 size-3.5" />
                  {t.summary.resetDay}
                </Button>
              </div>
            </aside>
          </section>

          {/* TARGET SELECTION & QUICK PRESETS */}
          <section className="card-panel rounded-4xl p-6 sm:p-8" aria-labelledby="target-title">
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 id="target-title" className="text-2xl font-bold tracking-tight text-(--foreground) sm:text-3xl">
                  {t.targets.title}
                </h2>
                <p className="mt-1 text-sm text-(--muted-foreground)">
                  {t.targets.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {targetGoals.map((goal) => {
                  const isCurrent = state.settings.dailyTarget === goal.calories
                  return (
                    <button
                      key={goal.calories}
                      type="button"
                      onClick={() => setDailyTarget(goal.calories)}
                      className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all active:scale-98 cursor-pointer ${
                        isCurrent
                          ? 'border-(--tone-strong) bg-(--tone-soft-surface) shadow-sm'
                          : 'border-(--border-soft) bg-(--surface-subtle) hover:border-(--border-strong) hover:bg-(--surface-elevated)'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between mb-1">
                        <span className="text-sm font-bold text-(--foreground)">{goal.label}</span>
                        {isCurrent ? <Check className="size-4 text-(--tone-strong)" /> : null}
                      </div>
                      <div className="text-xl font-black text-(--tone-strong)">
                        {goal.calories} <span className="text-xs font-normal text-(--muted-foreground)">kcal</span>
                      </div>
                      <p className="mt-2 text-xs text-(--muted-foreground) leading-relaxed">
                        {goal.desc}
                      </p>
                    </button>
                  )
                })}
              </div>

              <div className="rounded-2xl border border-(--border-soft) bg-(--surface-subtle) p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <label htmlFor={targetInputId} className="text-xs font-bold uppercase tracking-wider text-(--muted-foreground)">
                    {t.targets.customLabel}
                  </label>
                  <div className="text-sm text-(--foreground) font-medium">
                    {state.settings.dailyTarget} {t.targets.unit}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    id={targetInputId}
                    type="number"
                    min={1000}
                    max={6000}
                    step={50}
                    value={state.settings.dailyTarget}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      if (!Number.isNaN(val) && val > 0) {
                        setDailyTarget(val)
                      }
                    }}
                    className="w-28 text-center font-black"
                  />
                  <span className="text-xs font-bold text-(--muted-foreground)">kcal</span>
                </div>
              </div>
            </div>
          </section>

          {/* TRACKER & FOOD SEARCH */}
          <section id="tracker" className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] items-start">
            {/* Left: Meal Selector & Actions */}
            <aside className="card-panel rounded-4xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-(--foreground)">
                  {t.meals.emptyPrompt.split('.')[0]}
                </h2>
                <p className="mt-1 text-sm text-(--muted-foreground)">
                  {t.search.subtitle}
                </p>
              </div>

              {/* Meal Selector Tabs */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-(--muted-foreground)">
                  {t.search.addToMeal.replace('{meal}', '')}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(mealMeta) as MealKey[]).map((meal) => {
                    const isSelected = selectedMeal === meal
                    return (
                      <button
                        key={meal}
                        type="button"
                        onClick={() => setSelectedMeal(meal)}
                        className={`rounded-2xl border p-3.5 text-left transition-all active:scale-95 cursor-pointer ${
                          isSelected
                            ? 'border-(--tone-strong) bg-(--tone-soft-surface) text-(--foreground) shadow-xs'
                            : 'border-(--border-soft) bg-(--surface-subtle) text-(--muted-foreground) hover:border-(--border-strong) hover:text-(--foreground)'
                        }`}
                      >
                        <div className="text-sm font-bold">{t.meals[meal]}</div>
                        <div className="mt-1 text-[11px] text-(--muted-foreground) line-clamp-1">
                          {t.meals[`${meal}Desc` as keyof typeof t.meals]}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Favorites & Recents */}
              {recentFoods.length > 0 ? (
                <div className="rounded-2xl border border-(--border-soft) bg-(--surface-subtle) p-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-(--muted-foreground)">
                    <Star className="size-3.5 text-amber-500 fill-amber-500" />
                    <span>{t.summary.tipFavorites}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentFoods.map((item, idx) => (
                      <button
                        key={`${item.name}-${idx}`}
                        type="button"
                        onClick={() => handleAddRecentFood(item)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-(--border-soft) bg-(--surface-elevated) px-3 py-1.5 text-xs font-semibold text-(--foreground) hover:border-(--tone-strong) transition-all active:scale-95 cursor-pointer"
                      >
                        <Plus className="size-3 text-(--tone-strong)" />
                        <span>{item.name}</span>
                        <span className="text-[11px] text-(--muted-foreground)">({item.calories} kcal)</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Daily Actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleShareSummary}
                  className="rounded-full text-xs font-bold"
                >
                  <Share2 className="mr-1.5 size-3.5 text-(--tone-strong)" />
                  {t.summary.shareSummary}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsResetDialogOpen(true)}
                  className="rounded-full text-xs font-semibold text-(--muted-foreground) hover:text-(--danger)"
                >
                  <RefreshCcw className="mr-1.5 size-3.5" />
                  {t.summary.resetDay}
                </Button>
              </div>
            </aside>

            {/* Right: Food Search & Custom Food */}
            <div className="card-panel rounded-4xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-(--foreground)">
                  {t.search.title}
                </h2>
                <p className="mt-1 text-sm text-(--muted-foreground)">
                  {t.search.subtitle}
                </p>
              </div>

              {/* Search Form */}
              <form
                className="flex flex-col sm:flex-row gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  void runSearch()
                }}
              >
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-(--muted-foreground)" />
                  <Input
                    value={searchDraft}
                    onFocus={() => {
                      if (catalogLoadState === 'idle') {
                        void ensureFoodCatalogLoaded()
                      }
                    }}
                    onChange={(e) => setSearchDraft(e.target.value)}
                    placeholder={t.search.placeholder}
                    className="pl-10 rounded-2xl"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="rounded-2xl bg-(--tone-strong) text-white font-bold">
                    <Search className="mr-1.5 size-4" />
                    <span>{locale === 'pl' ? 'Szukaj' : 'Search'}</span>
                  </Button>
                  {submittedQuery ? (
                    <Button type="button" variant="secondary" onClick={clearSearch} className="rounded-2xl">
                      <X className="size-4" />
                    </Button>
                  ) : null}
                </div>
              </form>

              {searchWarning ? (
                <div className="flex items-start gap-2.5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-900 dark:text-amber-200">
                  <AlertCircle className="size-4 shrink-0 mt-0.5 text-amber-600" />
                  <span>{searchWarning}</span>
                </div>
              ) : null}

              {/* Food Results List */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-(--muted-foreground) flex items-center justify-between">
                  <span>{t.search.suggestedFoods}</span>
                  <span>{visibleFoodResults.length} {t.meals.itemsCount.replace('{count}', '')}</span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {visibleFoodResults.map((food) => {
                    const isSelected = selectedFood?.id === food.id
                    return (
                      <div
                        key={food.id}
                        onClick={() => setSelectedFoodId(food.id)}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-(--tone-strong) bg-(--tone-soft-surface)'
                            : 'border-(--border-soft) bg-(--surface-subtle) hover:bg-(--surface-elevated)'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="text-sm font-bold text-(--foreground)">{food.name}</div>
                          <div className="text-xs text-(--muted-foreground)">
                            {food.servingLabel} • {formatMacroSummary(food.macros)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-(--tone-strong)">
                            {food.calories} <span className="text-xs font-normal text-(--muted-foreground)">kcal</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Add Selected Food Action */}
                {selectedFood ? (
                  <div className="rounded-2xl border border-(--tone-soft-border) bg-(--tone-soft-surface) p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-(--tone-strong)">
                          {selectedFood.name}
                        </div>
                        <div className="text-sm text-(--muted-foreground)">
                          {selectedFood.calories * servings} kcal ({servings}× {selectedFood.servingLabel})
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => setServings((s) => Math.max(0.5, s - 0.5))}
                          className="h-8 w-8 rounded-full p-0 font-bold"
                        >
                          -
                        </Button>
                        <span className="text-sm font-black w-8 text-center">{servings}×</span>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => setServings((s) => s + 0.5)}
                          className="h-8 w-8 rounded-full p-0 font-bold"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleAddCatalogFood}
                      className="w-full rounded-full bg-(--tone-strong) text-white font-bold shadow-sm hover:bg-(--tone-strong)/90"
                    >
                      <Plus className="mr-1.5 size-4" />
                      {t.search.addToMeal.replace('{meal}', t.meals[selectedMeal])}
                    </Button>
                  </div>
                ) : null}
              </div>

              <Separator />

              {/* Custom Food Form */}
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-(--muted-foreground)">
                  {t.search.customTab}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-(--muted-foreground)">
                      {t.search.customNameLabel}
                    </label>
                    <Input
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder={t.search.customNamePlaceholder}
                      className="mt-1 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-(--muted-foreground)">
                      {t.search.customCaloriesLabel}
                    </label>
                    <Input
                      type="number"
                      value={customCalories}
                      onChange={(e) => setCustomCalories(e.target.value)}
                      className="mt-1 rounded-xl"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddCustomFood}
                  className="w-full rounded-full border-(--border-strong) font-bold"
                >
                  <Plus className="mr-1.5 size-4 text-(--tone-strong)" />
                  {t.search.addCustomButton}
                </Button>
              </div>
            </div>
          </section>

          {/* MEAL ENTRIES LIST */}
          <section className="space-y-6" aria-label="Meals logged today">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-(--foreground) sm:text-3xl">
                  {t.nav.tracker}
                </h2>
                <p className="text-sm text-(--muted-foreground)">
                  {t.overview.todayAtGlance} • {state.entries.length} {t.meals.itemsCount.replace('{count}', '')}
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              {mealSummaries.map((summary) => (
                <MealCard
                  key={summary.key}
                  summary={summary}
                  localizedLabel={t.meals[summary.key]}
                  localizedDescription={t.meals[`${summary.key}Desc` as keyof typeof t.meals]}
                  emptyTitle={t.meals.emptyTitle}
                  emptyPrompt={t.meals.emptyPrompt}
                  onDuplicate={handleDuplicateEntry}
                  onDelete={handleDeleteEntry}
                  isHighlightedEntry={(entryId) => entryId === lastAddedEntryId}
                />
              ))}
            </div>
          </section>

          {/* VALUE / FEATURES SECTION */}
          <section className="grid gap-6 sm:grid-cols-3" aria-labelledby="features-title">
            <h2 id="features-title" className="sr-only">{t.features.sectionTitle}</h2>
            <div className="card-panel rounded-3xl p-6 space-y-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-(--tone-soft-surface) text-(--tone-strong)">
                <Zap className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-(--foreground)">{t.features.feature1Title}</h3>
              <p className="text-sm text-(--muted-foreground) leading-relaxed">{t.features.feature1Desc}</p>
            </div>

            <div className="card-panel rounded-3xl p-6 space-y-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-(--tone-soft-surface) text-(--tone-strong)">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-(--foreground)">{t.features.feature2Title}</h3>
              <p className="text-sm text-(--muted-foreground) leading-relaxed">{t.features.feature2Desc}</p>
            </div>

            <div className="card-panel rounded-3xl p-6 space-y-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-(--tone-soft-surface) text-(--tone-strong)">
                <Sparkles className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-(--foreground)">{t.features.feature3Title}</h3>
              <p className="text-sm text-(--muted-foreground) leading-relaxed">{t.features.feature3Desc}</p>
            </div>
          </section>

          {/* FAQ SECTION */}
          <FaqSection t={t} />

          {/* SUPPORT / DONATION CARD (Benchmark: Drink Daily) */}
          <SupportCard t={t} />
        </main>

        {/* FOOTER */}
        <footer className="border-t border-(--border-soft) bg-(--surface-topbar) py-10 px-4 sm:px-8 mt-12" role="contentinfo">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-3">
                <LogoMark className="size-9 text-(--tone-strong)" />
                <div>
                  <div className="text-base font-bold text-(--foreground)">{t.common.appName}</div>
                  <div className="text-xs text-(--muted-foreground)">{t.common.appTagline}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-(--muted-foreground)">
                <a href="#tracker" className="hover:text-(--foreground) transition-colors">{t.nav.tracker}</a>
                <span>•</span>
                <a href="#overview" className="hover:text-(--foreground) transition-colors">{t.nav.overview}</a>
                <span>•</span>
                <a href="#faq" className="hover:text-(--foreground) transition-colors">{t.nav.faq}</a>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setIsFeedbackDialogOpen(true)}
                  className="hover:text-(--foreground) transition-colors cursor-pointer"
                >
                  {t.feedback.triggerButton}
                </button>
                <span>•</span>
                <a
                  href="https://buymeacoffee.com/johnnylemonny"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--tone-strong) hover:underline font-bold"
                >
                  ☕ {t.support.ctaButton}
                </a>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-(--muted-foreground) max-w-4xl">
              {t.footer.disclaimer}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-(--border-soft) text-[11px] text-(--muted-foreground)">
              <div>{t.footer.copyright.replace('{year}', new Date().getFullYear().toString())}</div>
              <div>{t.footer.privacyNote}</div>
            </div>
          </div>
        </footer>
      </div>

      {/* FEEDBACK DIALOG */}
      <FeedbackDialog
        open={isFeedbackDialogOpen}
        onOpenChange={setIsFeedbackDialogOpen}
        t={t}
      />

      {/* RESET CONFIRMATION DIALOG */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.dialogs.resetTitle}</DialogTitle>
            <DialogDescription>{t.dialogs.resetDescription}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsResetDialogOpen(false)}
            >
              {t.dialogs.cancel}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setIsResetDialogOpen(false)
                handleResetDay()
              }}
            >
              {t.dialogs.confirmReset}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MOBILE BOTTOM ACTION DOCK */}
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-(--border-strong) bg-(--surface-elevated)/95 p-1.5 shadow-(--shadow-lift) backdrop-blur-md md:hidden"
      >
        <a
          href="#tracker"
          className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold text-(--foreground) transition active:scale-95 hover:bg-(--surface-subtle)"
        >
          <Plus className="size-3.5 text-(--tone-strong)" />
          <span>{t.nav.tracker}</span>
        </a>
        <a
          href="#overview"
          className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-(--muted-foreground) transition active:scale-95 hover:bg-(--surface-subtle) hover:text-(--foreground)"
        >
          <Sparkles className="size-3.5" />
          <span>{t.nav.overview}</span>
        </a>
        <button
          type="button"
          onClick={handleShareSummary}
          className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-(--muted-foreground) transition active:scale-95 hover:bg-(--surface-subtle) hover:text-(--foreground)"
          aria-label={t.summary.shareSummary}
        >
          <Share2 className="size-3.5" />
          <span>{locale === 'pl' ? 'Raport' : 'Share'}</span>
        </button>
        <button
          type="button"
          onClick={() => setLocale(locale === 'pl' ? 'en' : 'pl')}
          className="flex items-center gap-1 rounded-full px-2.5 py-2 text-xs font-black text-(--tone-strong) transition active:scale-95 hover:bg-(--surface-subtle)"
          aria-label="Toggle language"
        >
          {locale === 'pl' ? 'EN' : 'PL'}
        </button>
      </nav>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      />
    </>
  )
}

export default App
