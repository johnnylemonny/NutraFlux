import { Coffee, Heart, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Translations } from '@/locales/en'

interface SupportCardProps {
  t: Translations
  className?: string
}

export function SupportCard({ t, className = '' }: SupportCardProps) {
  return (
    <section
      id="support"
      aria-labelledby="support-title"
      className={`relative overflow-hidden rounded-4xl border border-(--tone-soft-border) bg-(--surface-elevated) p-6 sm:p-10 shadow-sm ${className}`}
    >
      {/* Subtle decorative glow */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-(--tone-strong)/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 size-56 rounded-full bg-emerald-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-(--tone-soft-surface) text-(--tone-strong) shadow-inner ring-1 ring-(--tone-soft-border)">
          <Heart className="size-7 fill-(--tone-strong)/20 stroke-(--tone-strong)" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-(--tone-soft-border) bg-(--surface-subtle) px-3 py-1 text-xs font-semibold text-(--tone-strong) mb-3">
          <Sparkles className="size-3.5" />
          <span>{t.common.free} • {t.common.noAds}</span>
        </div>

        <h2
          id="support-title"
          className="text-2xl font-bold tracking-tight text-(--foreground) sm:text-3xl"
        >
          {t.support.title}
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-(--muted-foreground) sm:text-base">
          {t.support.subtitle}
        </p>

        <div className="mt-6 flex justify-center">
          <Button
            asChild
            className="rounded-full bg-(--tone-strong) px-8 py-6 text-sm font-bold text-white shadow-lg shadow-(--tone-strong)/25 transition-all hover:scale-105 active:scale-95 hover:bg-(--tone-strong)/90 cursor-pointer"
          >
            <a
              href="https://buymeacoffee.com/johnnylemonny"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5"
            >
              <Coffee className="size-5" />
              <span>{t.support.ctaButton}</span>
            </a>
          </Button>
        </div>

        <p className="mt-5 text-xs text-(--muted-foreground)/80">
          {t.support.tagline}
        </p>
      </div>
    </section>
  )
}
