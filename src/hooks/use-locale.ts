import { useCallback, useEffect, useMemo, useState } from 'react'
import { en } from '@/locales/en'
import { pl } from '@/locales/pl'
import type { Translations } from '@/locales/en'

export type Locale = 'pl' | 'en'

const STORAGE_KEY = 'nutraflux_locale'

export function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'pl'
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'pl' || saved === 'en') {
      return saved
    }

    const browserLang = navigator.language || (navigator.languages && navigator.languages[0]) || ''
    if (browserLang.toLowerCase().startsWith('pl')) {
      return 'pl'
    }
  } catch {
    // LocalStorage or navigator error fallback
  }

  return 'en'
}

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(detectBrowserLocale)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      // safe fallback
    }

    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
    }
  }, [locale])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
  }, [])

  const t: Translations = useMemo(() => {
    return locale === 'pl' ? pl : en
  }, [locale])

  return { locale, setLocale, t }
}
