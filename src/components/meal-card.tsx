import { Copy, Flame } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatMacroSummary } from '@/lib/tracker'
import { cn } from '@/lib/utils'
import type { Entry, MealSummary } from '@/types'

export function MealCard({
  summary,
  onDuplicate,
  isHighlightedEntry,
}: {
  summary: MealSummary
  onDuplicate: (entry: Entry) => void
  isHighlightedEntry: (entryId: string) => boolean
}) {
  const mealToneClass = `meal-${summary.key}`

  return (
    <section
      className={cn(
        'glass-panel content-lazy meal-panel flex flex-col gap-5 rounded-4xl p-6',
        mealToneClass,
      )}
      aria-labelledby={`meal-${summary.key}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="eyebrow">{summary.key}</p>
          <div>
            <h3 id={`meal-${summary.key}`} className="text-2xl font-semibold tracking-[-0.04em]">
              {summary.label}
            </h3>
            <p className="max-w-[32ch] text-sm text-(--muted-foreground)">
              {summary.description}
            </p>
          </div>
        </div>
        <div className="rounded-full border border-(--border-soft) bg-(--surface-elevated) px-4 py-2 text-right">
          <div className="text-xs uppercase tracking-[0.22em] text-(--muted-foreground)">
            Total
          </div>
          <div className="text-xl font-semibold text-(--foreground)">
            {summary.totalCalories}
          </div>
        </div>
      </div>

      <Separator />

      {summary.entries.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {summary.entries.map((entry) => (
            <li
              key={entry.id}
              className={cn(
                'group flex items-start justify-between gap-4 rounded-[1.6rem] border border-(--border-soft) bg-(--surface-subtle) p-4 transition duration-300 hover:-translate-y-0.5 hover:border-(--border-strong) hover:bg-(--surface-elevated)',
                isHighlightedEntry(entry.id) && 'entry-pop border-(--tone-soft-border)',
              )}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-(--foreground)">
                    {entry.food.name}
                  </span>
                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-semibold text-(--tone-strong-foreground)"
                    style={{ backgroundColor: 'var(--meal-accent)' }}
                  >
                    {entry.quantity}×
                  </span>
                </div>
                <p className="text-sm text-(--muted-foreground)">
                  {entry.food.servingLabel} • {formatMacroSummary(entry.food.macros)}
                </p>
                {entry.food.note ? (
                  <p className="text-sm text-(--muted-foreground)">{entry.food.note}</p>
                ) : null}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <div className="rounded-full bg-(--surface-elevated) px-3 py-2 text-sm font-semibold text-(--foreground)">
                  {entry.totalCalories} kcal
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label={`Duplicate ${entry.food.name}`}
                  onClick={() => onDuplicate(entry)}
                >
                  <Copy className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-[1.8rem] border border-dashed border-(--border-soft) bg-(--surface-subtle) px-5 py-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-(--surface-elevated) text-(--tone-strong)">
            <Flame className="size-5" />
          </div>
          <h4 className="text-lg font-semibold text-(--foreground)">Nothing logged yet</h4>
          <p className="mt-2 text-sm text-(--muted-foreground)">
            Add your first item to start building a clean daily picture.
          </p>
        </div>
      )}
    </section>
  )
}
