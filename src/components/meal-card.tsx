import { Copy, Flame, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatMacroSummary } from '@/lib/tracker'
import { cn } from '@/lib/utils'
import type { Entry, MealSummary } from '@/types'

export function MealCard({
  summary,
  onDuplicate,
  onDelete,
  onAddFirstItem,
  isHighlightedEntry,
  localizedLabel,
  localizedDescription,
  emptyTitle,
  emptyPrompt,
  emptyActionLabel,
}: {
  summary: MealSummary
  onDuplicate: (entry: Entry) => void
  onDelete: (entry: Entry) => void
  onAddFirstItem?: () => void
  isHighlightedEntry: (entryId: string) => boolean
  localizedLabel?: string
  localizedDescription?: string
  emptyTitle?: string
  emptyPrompt?: string
  emptyActionLabel?: string
}) {
  const mealToneClass = `meal-${summary.key}`
  const title = localizedLabel || summary.label
  const description = localizedDescription || summary.description

  return (
    <section
      className={cn(
        'card-panel content-lazy meal-panel flex flex-col gap-5 rounded-4xl p-6',
        mealToneClass,
      )}
      aria-labelledby={`meal-${summary.key}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="eyebrow">{summary.key}</p>
          <div>
            <h3 id={`meal-${summary.key}`} className="text-2xl font-semibold tracking-[-0.04em]">
              {title}
            </h3>
            <p className="max-w-[36ch] text-sm text-(--muted-foreground)">
              {description}
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
                  title="Duplicate entry"
                  onClick={() => onDuplicate(entry)}
                  className="size-8 rounded-full border border-transparent hover:border-(--border-soft) hover:bg-(--surface-elevated) text-(--muted-foreground) hover:text-(--foreground) transition-all active:scale-90 cursor-pointer"
                >
                  <Copy className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-8 rounded-full border border-transparent hover:border-rose-500/30 hover:bg-rose-500/10 text-(--muted-foreground) hover:text-rose-600 dark:hover:text-rose-400 transition-all active:scale-90 cursor-pointer"
                  aria-label={`Delete ${entry.food.name}`}
                  title="Delete entry"
                  onClick={() => onDelete(entry)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-[1.8rem] border border-dashed border-(--border-soft) bg-(--surface-subtle) px-5 py-7 text-center transition-all hover:border-(--tone-soft-border)">
          <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-(--surface-elevated) text-(--tone-strong) shadow-xs">
            <Flame className="size-5" />
          </div>
          <h4 className="text-base font-semibold text-(--foreground)">
            {emptyTitle || 'Nothing logged yet'}
          </h4>
          <p className="mt-1.5 text-xs text-(--muted-foreground) max-w-[28ch] mx-auto">
            {emptyPrompt || 'Add your first item to start building a clean daily picture.'}
          </p>
          {onAddFirstItem ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onAddFirstItem}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-(--border-strong) bg-(--surface-elevated) px-4 py-2 text-xs font-bold text-(--foreground) hover:border-(--tone-strong) hover:bg-(--tone-soft-surface) hover:text-(--tone-strong) shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="size-3.5 text-(--tone-strong)" />
              <span>{emptyActionLabel || `Add to ${title}`}</span>
            </Button>
          ) : null}
        </div>
      )}
    </section>
  )
}
