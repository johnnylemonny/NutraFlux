import { useState } from 'react'
import { Check, ExternalLink, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Translations } from '@/locales/en'

interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  t: Translations
}

export function FeedbackDialog({ open, onOpenChange, t }: FeedbackDialogProps) {
  const [topic, setTopic] = useState<'general' | 'feature' | 'bug'>('general')
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGitHubSubmit = () => {
    const title = encodeURIComponent(`[${topic.toUpperCase()}] User Feedback`)
    const body = encodeURIComponent(
      `### Feedback Category: ${topic}\n\n### User Comments:\n${message || 'No additional details provided.'}\n\n---\n*Sent from NutraFlux Web App*`
    )
    window.open(
      `https://github.com/johnnylemonny/NutraFlux/issues/new?title=${title}&body=${body}`,
      '_blank',
      'noopener,noreferrer'
    )
    onOpenChange(false)
  }

  const handleCopyFeedback = async () => {
    try {
      await navigator.clipboard.writeText(
        `Category: ${topic}\nMessage: ${message || '(Empty feedback)'}`
      )
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-(--tone-strong)">
            <MessageSquare className="size-5" />
            <DialogTitle>{t.feedback.title}</DialogTitle>
          </div>
          <DialogDescription>{t.feedback.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
              {t.feedback.typeLabel}
            </label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTopic('general')}
                className={`rounded-xl border px-2.5 py-2 text-xs font-semibold transition active:scale-95 cursor-pointer ${
                  topic === 'general'
                    ? 'border-(--tone-strong) bg-(--tone-soft-surface) text-(--foreground)'
                    : 'border-(--border-soft) bg-(--surface-subtle) text-(--muted-foreground) hover:text-(--foreground)'
                }`}
              >
                {t.feedback.typeGeneral}
              </button>
              <button
                type="button"
                onClick={() => setTopic('feature')}
                className={`rounded-xl border px-2.5 py-2 text-xs font-semibold transition active:scale-95 cursor-pointer ${
                  topic === 'feature'
                    ? 'border-(--tone-strong) bg-(--tone-soft-surface) text-(--foreground)'
                    : 'border-(--border-soft) bg-(--surface-subtle) text-(--muted-foreground) hover:text-(--foreground)'
                }`}
              >
                {t.feedback.typeFeature}
              </button>
              <button
                type="button"
                onClick={() => setTopic('bug')}
                className={`rounded-xl border px-2.5 py-2 text-xs font-semibold transition active:scale-95 cursor-pointer ${
                  topic === 'bug'
                    ? 'border-(--tone-strong) bg-(--tone-soft-surface) text-(--foreground)'
                    : 'border-(--border-soft) bg-(--surface-subtle) text-(--muted-foreground) hover:text-(--foreground)'
                }`}
              >
                {t.feedback.typeBug}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
              {t.feedback.messageLabel}
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.feedback.messagePlaceholder}
              className="mt-2 w-full rounded-2xl border border-(--border-strong) bg-(--surface-subtle) p-3 text-sm text-(--foreground) placeholder:text-(--muted-foreground) focus:border-(--tone-strong) focus:outline-hidden"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopyFeedback}
            className="text-xs"
          >
            {copied ? (
              <>
                <Check className="mr-1.5 size-3.5 text-(--tone-strong)" />
                Copied to clipboard
              </>
            ) : (
              'Copy feedback'
            )}
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              {t.common.cancel}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleGitHubSubmit}
              className="bg-(--tone-strong) text-white hover:bg-(--tone-strong)/90"
            >
              <ExternalLink className="mr-1.5 size-3.5" />
              {t.feedback.directGithub}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
