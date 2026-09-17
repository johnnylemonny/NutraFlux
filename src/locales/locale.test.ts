import { describe, expect, it } from 'vitest'
import { en } from '@/locales/en'
import { pl } from '@/locales/pl'
import { detectBrowserLocale } from '@/hooks/use-locale'
import { generateDailySummaryText } from '@/lib/tracker'
import type { Entry } from '@/types'

describe('i18n and localization', () => {
  it('contains consistent translation keys between PL and EN', () => {
    expect(en.common.appName).toBe('NutraFlux')
    expect(pl.common.appName).toBe('NutraFlux')
    expect(en.hero.titleLine1).toBeDefined()
    expect(pl.hero.titleLine1).toBeDefined()
    expect(en.faq.q1).toBeDefined()
    expect(pl.faq.q1).toBeDefined()
    expect(en.search.tabCatalog).toBeDefined()
    expect(pl.search.tabCatalog).toBeDefined()
    expect(en.search.tabCustom).toBeDefined()
    expect(pl.search.tabCustom).toBeDefined()
    expect(en.search.mealFocusTitle).toBeDefined()
    expect(pl.search.mealFocusTitle).toBeDefined()
    expect(en.meals.addPromptBtn).toBeDefined()
    expect(pl.meals.addPromptBtn).toBeDefined()
    expect(en.feedback.submitButton).toBeDefined()
    expect(pl.feedback.submitButton).toBeDefined()
    expect(en.feedback.thankYouToast).toBeDefined()
    expect(pl.feedback.thankYouToast).toBeDefined()
  })

  it('detects locale gracefully in environment without navigator', () => {
    const locale = detectBrowserLocale()
    expect(['pl', 'en']).toContain(locale)
  })

  it('generates localized daily summary in Polish', () => {
    const sampleEntry: Entry = {
      id: 'test-1',
      meal: 'breakfast',
      quantity: 1,
      food: {
        sourceId: 'oats',
        name: 'Płatki owsiane',
        calories: 300,
        servingLabel: '1 miska',
      },
      totalCalories: 300,
      createdAt: new Date().toISOString(),
    }

    const summaryPl = generateDailySummaryText([sampleEntry], 2000, 'pl')
    expect(summaryPl).toContain('NutraFlux - Podsumowanie Dnia')
    expect(summaryPl).toContain('Cel: 2000 kcal')
    expect(summaryPl).toContain('Śniadanie')
    expect(summaryPl).toContain('Płatki owsiane')
    expect(summaryPl).toContain('pozostało 1700 kcal')
  })

  it('generates localized daily summary in English', () => {
    const sampleEntry: Entry = {
      id: 'test-2',
      meal: 'lunch',
      quantity: 1,
      food: {
        sourceId: 'salad',
        name: 'Chicken Salad',
        calories: 450,
        servingLabel: '1 plate',
      },
      totalCalories: 450,
      createdAt: new Date().toISOString(),
    }

    const summaryEn = generateDailySummaryText([sampleEntry], 2000, 'en')
    expect(summaryEn).toContain('NutraFlux Daily Summary')
    expect(summaryEn).toContain('Target: 2000 kcal')
    expect(summaryEn).toContain('Lunch')
    expect(summaryEn).toContain('Chicken Salad')
    expect(summaryEn).toContain('1550 kcal remaining')
  })
})
