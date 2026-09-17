import { Languages } from 'lucide-react'
import type { Locale } from '@/hooks/use-locale'

interface LanguageToggleProps {
  currentLocale: Locale
  onToggle: (locale: Locale) => void
  className?: string
}

export function LanguageToggle({ currentLocale, onToggle, className = '' }: LanguageToggleProps) {
  const nextLocale = currentLocale === 'pl' ? 'en' : 'pl'
  const nextLabel = currentLocale === 'pl' ? 'Switch to English' : 'Przełącz na język polski'

  return (
    <button
      type="button"
      onClick={() => onToggle(nextLocale)}
      aria-label={nextLabel}
      title={nextLabel}
      className={`group flex items-center gap-1.5 rounded-full border border-(--border-soft) bg-(--surface-elevated) px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-(--foreground) shadow-xs transition-all hover:border-(--border-strong) hover:bg-(--surface-subtle) active:scale-95 cursor-pointer ${className}`}
    >
      <Languages className="size-3.5 text-(--tone-strong) transition-transform group-hover:rotate-12" />
      <span className={currentLocale === 'pl' ? 'text-(--tone-strong)' : 'opacity-60'}>PL</span>
      <span className="opacity-40">/</span>
      <span className={currentLocale === 'en' ? 'text-(--tone-strong)' : 'opacity-60'}>EN</span>
    </button>
  )
}
