import type { Locale } from '@/hooks/use-locale'

interface LanguageToggleProps {
  currentLocale: Locale
  onToggle: (locale: Locale) => void
  className?: string
}

export function LanguageToggle({ currentLocale, onToggle, className = '' }: LanguageToggleProps) {
  return (
    <div
      role="group"
      aria-label="Select language"
      className={`inline-flex items-center rounded-full border border-(--border-soft) bg-(--surface-subtle) p-0.5 shadow-xs ${className}`}
    >
      <button
        type="button"
        onClick={() => onToggle('pl')}
        className={`rounded-full px-2 py-1 text-[11px] font-black tracking-tight transition-all cursor-pointer ${
          currentLocale === 'pl'
            ? 'bg-(--surface-elevated) text-(--tone-strong) shadow-xs'
            : 'text-(--muted-foreground) hover:text-(--foreground)'
        }`}
        aria-pressed={currentLocale === 'pl'}
        title="Język polski"
      >
        PL
      </button>
      <button
        type="button"
        onClick={() => onToggle('en')}
        className={`rounded-full px-2 py-1 text-[11px] font-black tracking-tight transition-all cursor-pointer ${
          currentLocale === 'en'
            ? 'bg-(--surface-elevated) text-(--tone-strong) shadow-xs'
            : 'text-(--muted-foreground) hover:text-(--foreground)'
        }`}
        aria-pressed={currentLocale === 'en'}
        title="English"
      >
        EN
      </button>
    </div>
  )
}
