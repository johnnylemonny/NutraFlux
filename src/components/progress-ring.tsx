import { cn } from '@/lib/utils'

export function ProgressRing({
  progress,
  consumed,
  remaining,
  className,
}: {
  progress: number
  consumed: number
  remaining: number
  className?: string
}) {
  const radius = 74
  const circumference = 2 * Math.PI * radius
  const safeProgress = Math.min(Math.max(progress, 0), 1)
  const strokeOffset = circumference * (1 - safeProgress)
  const overshoot = progress > 1

  return (
    <div className={cn('relative grid place-items-center', className)}>
      <svg
        viewBox="0 0 180 180"
        role="img"
        aria-label={`${consumed} calories consumed and ${remaining} remaining`}
        className="size-44 drop-shadow-[0_24px_50px_rgba(15,23,42,0.12)]"
      >
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke="var(--surface-elevated-strong)"
          strokeWidth="16"
          fill="none"
        />
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke={overshoot ? 'var(--warning)' : 'var(--tone-strong)'}
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeOffset}
          transform="rotate(-90 90 90)"
        />
      </svg>
      <div className="absolute flex flex-col items-center gap-1 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.26em] text-(--muted-foreground)">
          Today
        </span>
        <strong className="text-4xl font-semibold tracking-[-0.05em] text-(--foreground)">
          {consumed}
        </strong>
        <span className="text-sm text-(--muted-foreground)">
          {remaining >= 0 ? `${remaining} kcal left` : `${Math.abs(remaining)} kcal over`}
        </span>
      </div>
    </div>
  )
}
